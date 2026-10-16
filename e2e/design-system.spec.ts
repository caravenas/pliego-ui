import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';

// Comprueba la salida de `npm run ds:build`: cada tarjeta se abre como la abre
// el marco del artifact (tokens y bundle.css, React 18, bundle.js y
// `data-theme`), se pinta sin errores y pasa axe. No hace falta publicar nada.
const project = resolve('design-system/project');
const components = join(project, 'components');
const read = (path: string) => readFileSync(path, 'utf8');

const react = read(resolve('node_modules/react/umd/react.production.min.js'));
const reactDom = read(resolve('node_modules/react-dom/umd/react-dom.production.min.js'));
const bundleJs = read(join(components, 'bundle.js'));
const bundleCss = read(join(components, 'bundle.css'));
const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'];

const cards = readdirSync(components, { withFileTypes: true })
  .filter((entry) => entry.isDirectory() && existsSync(join(components, entry.name, 'preview.html')))
  .map((entry) => entry.name);

/** El documento de la tarjeta con lo que el marco del artifact le deja cargado. */
function framed(card: string): string {
  const html = read(join(components, card, 'preview.html'));
  const preloaded = `<style>${bundleCss}</style><script>${react}</script><script>${reactDom}</script><script>${bundleJs}</script>`;
  return html.replace('<html lang="es">', '<html lang="es" data-theme="light">').replace('</head>', `${preloaded}</head>`);
}

async function open(page: Page, card: string): Promise<string[]> {
  const problems: string[] = [];
  page.on('console', (message) => message.type() === 'error' && problems.push(`console: ${message.text()}`));
  page.on('pageerror', (error) => problems.push(`pageerror: ${error.message}`));
  await page.route(/fonts\.(googleapis|gstatic)\.com/, (route) => route.abort());
  await page.setContent(framed(card));
  // La raíz se pinta, o el componente va en un portal (Drawer).
  await page.waitForSelector('#root > *, [role="dialog"]', { state: 'attached', timeout: 5000 });
  return problems;
}

/** Los nombres que `src/index.ts` exporta como valores (los `export type` no existen en tiempo de ejecución). */
function exportedValues(): string[] {
  const names: string[] = [];
  for (const match of read(resolve('src/index.ts')).matchAll(/^export \{([^}]+)\} from/gm)) {
    names.push(...match[1].split(',').map((name) => name.trim()).filter(Boolean));
  }
  return names;
}

test('window.PliegoUI exporta todo lo que exporta src/index.ts', async ({ page }) => {
  await open(page, 'Button');
  const published = await page.evaluate(() => Object.keys((window as unknown as { PliegoUI: object }).PliegoUI));
  const expected = exportedValues();
  expect(expected.length).toBeGreaterThanOrEqual(18);
  expect(expected.filter((name) => !published.includes(name))).toEqual([]);
});

test('tokens.json de la salida es el de la librería, sin cambios', () => {
  expect(read(join(project, 'tokens.json'))).toBe(read(resolve('tokens/tokens.json')));
});

test('bundle.js cumple el formato: cabecera, script clásico y menos de 6 MB', () => {
  const header = /^\/\* @ds-bundle: (\{.*\}) \*\//.exec(bundleJs.split('\n')[0]);
  expect(header).not.toBeNull();
  const meta = JSON.parse(header![1]) as { format: number; namespace: string; components: { name: string }[] };
  expect(meta.format).toBe(4);
  expect(meta.namespace).toBe('PliegoUI');
  expect(meta.components.map((c) => c.name).sort()).toEqual(cards);
  expect(bundleJs).not.toMatch(/<\/script|<!--/i);
  expect(bundleJs).not.toMatch(/^\s*(import|export)\s/m);
  expect(Buffer.byteLength(bundleJs)).toBeLessThan(6 * 1024 * 1024);
});

test('cada tarjeta tiene README y su preview empieza por el marcador @dsCard', () => {
  for (const card of cards) {
    expect(existsSync(join(components, card, 'README.md')), `${card}/README.md`).toBe(true);
    expect(read(join(components, card, 'preview.html')).split('\n')[0]).toMatch(/^<!-- @dsCard group="[^"]+" height=\d+ -->$/);
  }
});

test('hay una tarjeta por componente de la librería', () => {
  expect([...cards].sort()).toEqual(
    [
      'Badge', 'Button', 'Drawer', 'Field', 'HowPanel', 'Input', 'MeasureField', 'Notice',
      'OptionField', 'ResultList', 'Select', 'SegmentedControl', 'SpecStep', 'Toast',
    ].sort(),
  );
});

for (const card of cards) {
  test(`${card}: se pinta con window.PliegoUI y React 18, sin errores`, async ({ page }) => {
    const problems = await open(page, card);
    expect(problems).toEqual([]);
    expect(await page.evaluate(() => typeof (window as unknown as { PliegoUI: unknown }).PliegoUI)).toBe('object');
  });

  test(`${card}: pasa axe (WCAG 2.1 AA)`, async ({ page }) => {
    await open(page, card);
    const { violations } = await new AxeBuilder({ page }).withTags(TAGS).analyze();
    expect(
      violations.map((v) => `${v.id} (${v.impact}): ${v.nodes.map((n) => n.target.join(' ')).join(' | ')}`),
    ).toEqual([]);
  });
}
