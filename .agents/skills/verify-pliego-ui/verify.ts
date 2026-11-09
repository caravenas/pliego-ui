// Verifica en un navegador real las stories que un cambio toca y deja la
// evidencia en .verification/<sha>/. Se corre desde la raíz del repositorio:
//   npx tsx .agents/skills/verify-pliego-ui/verify.ts [--base <ref>] [--feature "<nombre>"]
//     [--stories id,id] [--no-build]
// Termina con 0 solo si todo lo elegido se abrió, se midió y pasó axe y áreas.
import { execFileSync, spawn, spawnSync, type ChildProcess } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { createServer } from 'node:net';
import { join, resolve } from 'node:path';
import { chromium, type Page } from '@playwright/test';
import { openStory } from '../../../e2e/stories';
import { FEATURES, featureOf } from './features';
import { selectStories, type StoryEntry } from './select';

const PORT = 6007;
const WIDTHS = [375, 768, 1024];
const HEIGHT = 800;
const MAX_STOPS = 40;
const BASE_URL = `http://127.0.0.1:${PORT}`;

class Refusal extends Error {}

function git(...args: string[]): string {
  return execFileSync('git', args, { encoding: 'utf8' }).trim();
}

function parse(argv: string[]) {
  const options = { base: 'origin/main', feature: undefined as string | undefined, stories: undefined as string[] | undefined, build: true };
  for (let i = 0; i < argv.length; i += 1) {
    const flag = argv[i];
    if (flag === '--base') options.base = argv[++i];
    else if (flag === '--feature') options.feature = argv[++i];
    else if (flag === '--stories') options.stories = argv[++i].split(',');
    else if (flag === '--no-build') options.build = false;
    else throw new Refusal(`Argumento desconocido: ${flag}`);
  }
  return options;
}

function portIsFree(): Promise<boolean> {
  return new Promise((done) => {
    const probe = createServer();
    probe.once('error', () => done(false));
    probe.listen(PORT, '127.0.0.1', () => probe.close(() => done(true)));
  });
}

async function waitForServer(server: ChildProcess): Promise<void> {
  for (let attempt = 0; attempt < 80; attempt += 1) {
    if (server.exitCode !== null) throw new Refusal('El servidor de storybook-static terminó antes de responder.');
    try {
      if ((await fetch(`${BASE_URL}/index.json`)).ok) return;
    } catch {
      /* todavía no escucha */
    }
    await new Promise((wait) => setTimeout(wait, 250));
  }
  throw new Refusal(`${BASE_URL}/index.json no respondió en 20 s.`);
}

/** Lo que el diff toca: contra la base, lo ya commiteado, lo modificado y lo nuevo. */
function changedFiles(base: string): string[] {
  const lines = [
    git('diff', '--name-only', `${base}...HEAD`),
    git('diff', '--name-only', 'HEAD'),
    git('ls-files', '--others', '--exclude-standard'),
  ].join('\n');
  return [...new Set(lines.split('\n').filter(Boolean))].filter((path) => !path.startsWith('.verification/'));
}

interface Stop {
  tag: string;
  role: string;
  name: string;
  focusVisible: boolean;
}

/** El control que tiene el foco: rol, nombre y si el foco se ve. */
async function focused(page: Page): Promise<Stop | null> {
  return page.evaluate(() => {
    const el = document.activeElement as HTMLElement | null;
    if (!el || el === document.body) return null;
    const implicit: Record<string, string> = { BUTTON: 'button', A: 'link', SELECT: 'combobox', TEXTAREA: 'textbox', SUMMARY: 'button' };
    const type = (el as HTMLInputElement).type;
    const role =
      el.getAttribute('role') ??
      (el.tagName === 'INPUT' ? ({ search: 'searchbox', checkbox: 'checkbox', radio: 'radio', range: 'slider' } as Record<string, string>)[type] ?? 'textbox' : implicit[el.tagName]) ??
      el.tagName.toLowerCase();
    const labelled = el.getAttribute('aria-labelledby')?.split(' ').map((id) => document.getElementById(id)?.textContent?.trim()).join(' ');
    const label = (el as HTMLInputElement).labels?.[0]?.textContent?.trim();
    // Aproximación del nombre accesible; el estado exacto está en aria.yml.
    const name = el.getAttribute('aria-label') || labelled || label || el.textContent?.trim() || el.getAttribute('title') || el.getAttribute('placeholder') || '';
    const style = getComputedStyle(el);
    const ring = (style.outlineStyle !== 'none' && style.outlineWidth !== '0px') || style.boxShadow !== 'none';
    return { tag: el.tagName.toLowerCase(), role, name: name.slice(0, 80), focusVisible: el.matches(':focus-visible') && ring };
  });
}

async function walkKeyboard(page: Page, keys: string[]) {
  await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
  const stops: Stop[] = [];
  let trapped = false;
  let reachedLimit = false;
  let previous = '';
  for (let i = 0; i < MAX_STOPS; i += 1) {
    await page.keyboard.press('Tab');
    const stop = await focused(page);
    if (!stop) break; // el foco salió de la página
    const signature = `${stop.tag}|${stop.role}|${stop.name}`;
    if (stops.length > 0 && signature === previous) {
      trapped = true;
      break;
    }
    previous = signature;
    stops.push(stop);
    if (i === MAX_STOPS - 1) reachedLimit = true;
  }
  const afterKeys: { key: string; focus: Stop | null }[] = [];
  if (keys.length > 0 && stops.length > 0) {
    await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
    await page.keyboard.press('Tab');
    for (const key of keys) {
      await page.keyboard.press(key);
      afterKeys.push({ key, focus: await focused(page) });
    }
  }
  return { stops, trapped, reachedLimit, afterKeys };
}

function pickStories(entries: StoryEntry[], options: ReturnType<typeof parse>, base: string) {
  if (options.stories) {
    const stories = entries.filter((entry) => options.stories!.includes(entry.id));
    const missing = options.stories.filter((id) => !entries.some((entry) => entry.id === id));
    if (missing.length > 0) throw new Refusal(`Stories que no existen en el índice: ${missing.join(', ')}`);
    return { stories, reasons: [`elegidas por id: ${options.stories.join(', ')}`], all: false };
  }
  if (options.feature) {
    const feature = FEATURES[options.feature];
    if (!feature) throw new Refusal(`Funcionalidad desconocida: ${options.feature}. Hay: ${Object.keys(FEATURES).join(', ')}`);
    return { stories: entries.filter((entry) => feature.titles.includes(entry.title)), reasons: [`funcionalidad: ${options.feature}`], all: false };
  }
  return selectStories(changedFiles(base), entries);
}

function runSpecs(titles: string[], outFile: string) {
  const escaped = titles.map((title) => title.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&'));
  const result = spawnSync(
    'npx',
    ['playwright', 'test', 'e2e/a11y.spec.ts', 'e2e/touch-targets.spec.ts', '--reporter=json', '--grep', `(${escaped.join("|")}) · `],
    { encoding: 'utf8', env: { ...process.env, PLAYWRIGHT_JSON_OUTPUT_NAME: outFile }, maxBuffer: 256 * 1024 * 1024 },
  );
  const stats = existsSync(outFile) ? (JSON.parse(readFileSync(outFile, 'utf8')) as { stats: { expected: number; unexpected: number; skipped: number; flaky: number } }).stats : undefined;
  return { exitCode: result.status, stats };
}

async function main() {
  process.chdir(git('rev-parse', '--show-toplevel'));
  const options = parse(process.argv.slice(2));

  // Antes de lanzar nada: lo que, de fallar, no debe dejar ningún informe.
  if (!(await portIsFree())) throw new Refusal(`El puerto ${PORT} está ocupado por otro proceso: ciérralo, la skill lanza su propio servidor ahí.`);
  if (options.build) {
    console.log('Compilando Storybook (npm run build-storybook)…');
    const build = spawnSync('npm', ['run', 'build-storybook'], { stdio: 'inherit' });
    if (build.status !== 0) throw new Refusal('npm run build-storybook falló: no hay evidencia que dar de un Storybook que no compila.');
  }
  if (!existsSync(resolve('storybook-static/index.json'))) throw new Refusal('Falta compilar: storybook-static/index.json no existe (npm run build-storybook).');

  const sha = git('rev-parse', '--short', 'HEAD');
  const dirty = git('status', '--porcelain', '--', '.', ':!.verification').length > 0;
  const outDir = resolve('.verification', dirty ? `${sha}-dirty` : sha);

  const server = spawn('node', ['scripts/serve-static.mjs', 'storybook-static'], { stdio: 'ignore' });
  try {
    await waitForServer(server);
    const index = JSON.parse(readFileSync('storybook-static/index.json', 'utf8')) as { entries: Record<string, StoryEntry & { type: string }> };
    const entries = Object.values(index.entries).filter((entry) => entry.type === 'story');
    const selection = pickStories(entries, options, options.base);

    rmSync(outDir, { recursive: true, force: true });
    mkdirSync(outDir, { recursive: true });
    const report: Record<string, unknown> = {
      sha,
      dirty,
      base: options.base,
      reasons: selection.reasons,
      all: selection.all,
      stories: selection.stories.map((story) => story.id),
      failures: [] as string[],
      warnings: [] as string[],
    };
    const failures = report.failures as string[];
    const warnings = report.warnings as string[];

    if (selection.stories.length === 0) {
      warnings.push('El cambio no toca ninguna story: no hay nada que verificar en el navegador.');
    } else {
      const browser = await chromium.launch();
      try {
        for (const story of selection.stories) {
          const storyDir = join(outDir, story.id);
          mkdirSync(storyDir, { recursive: true });
          const page = await browser.newPage({ baseURL: BASE_URL, viewport: { width: WIDTHS[0], height: HEIGHT } });
          try {
            for (const width of WIDTHS) {
              await page.setViewportSize({ width, height: HEIGHT });
              await openStory(page, story.id);
              await page.screenshot({ path: join(storyDir, `${width}.png`), fullPage: true });
            }
            const keys = featureOf(story.title)?.[1].keys ?? [];
            const keyboard = await walkKeyboard(page, keys);
            if (keyboard.trapped) warnings.push(`${story.id}: el foco no avanza (posible trampa de foco)`);
            if (keyboard.reachedLimit) warnings.push(`${story.id}: el recorrido llegó al tope de ${MAX_STOPS} paradas`);
            writeFileSync(join(storyDir, 'keyboard.json'), `${JSON.stringify(keyboard, null, 2)}\n`);
            writeFileSync(join(storyDir, 'aria.yml'), `${await page.locator('body').ariaSnapshot()}\n`);
          } catch (error) {
            failures.push(`${story.id}: ${(error as Error).message.split('\n')[0]}`);
          } finally {
            await page.close();
          }
        }
      } finally {
        await browser.close();
      }
      if (failures.length === 0) {
        const specs = runSpecs([...new Set(selection.stories.map((story) => story.title))], join(outDir, 'specs.json'));
        report.specs = specs.stats ?? null;
        if (specs.exitCode !== 0 || !specs.stats || specs.stats.unexpected > 0) failures.push('a11y o áreas de puntero fallaron: ver specs.json');
        if (specs.stats && specs.stats.expected === 0) failures.push('los specs no corrieron ninguna prueba (el filtro no coincidió con nada)');
      }
    }

    report.status = failures.length === 0 ? 'ok' : 'failed';
    writeFileSync(join(outDir, 'report.json'), `${JSON.stringify(report, null, 2)}\n`);
    console.log(`Evidencia: ${outDir}`);
    console.log(`${selection.stories.length} stories · ${failures.length} fallos · ${warnings.length} avisos`);
    const lines = [...failures.map((f) => `FALLO ${f}`), ...warnings.map((w) => `AVISO ${w}`)];
    for (const line of lines.slice(0, 15)) console.log(line);
    if (lines.length > 15) console.log(`… y ${lines.length - 15} más en report.json`);
    return failures.length === 0 ? 0 : 1;
  } finally {
    server.kill();
  }
}

main().then(
  (code) => process.exit(code),
  (error) => {
    console.error(error instanceof Refusal ? `verify: ${error.message}` : error);
    process.exit(error instanceof Refusal ? 2 : 1);
  },
);
