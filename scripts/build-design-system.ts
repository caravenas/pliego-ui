// Productor del Design System de claude.ai a partir de la librería.
//
//   npm run ds:build   →   design-system/project/…
//
// Escribe el árbol `project/` que pide el tipo «Design System» (ver su
// SKILL.md), sin el índice `design-system.json`: ese se lee y se fusiona en el
// momento de publicar, porque la gente edita el artifact a la vez. No publica
// nada. La publicación y su confirmación están en docs/PLAN.md (L-13).
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { build } from 'vite';
import { COMPONENTS, previewHtml } from './design-system/previews';

const root = resolve(import.meta.dirname, '..');
const out = join(root, 'design-system');
const project = join(out, 'project');
const bundleDir = join(out, '.bundle');
const NAMESPACE = 'PliegoUI';
const MAX_BUNDLE_BYTES = 6 * 1024 * 1024;

/** Lo que el artifact tiene y la librería no: se borra al publicar, ya sustituido (decisión de Chris, 2026-10-15). */
export const SUPERSEDED = ['FormField', 'OptionGroup', 'CentralTabs', 'Notices'];

function write(path: string, content: string): void {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content);
}

/** Línea 1 del bundle: el espacio de nombres y el orden de las tarjetas. */
const BUNDLE_HEADER = `/* @ds-bundle: ${JSON.stringify({
  format: 4,
  namespace: NAMESPACE,
  components: COMPONENTS.map((c) => ({ name: c.name })),
})} */`;

async function buildBundle(): Promise<void> {
  await build({
    configFile: false,
    root,
    logLevel: 'warn',
    esbuild: { jsx: 'automatic' },
    define: { 'process.env.NODE_ENV': '"production"' },
    resolve: { alias: { 'react/jsx-runtime': join(root, 'scripts/design-system/jsx-runtime-shim.ts') } },
    build: {
      outDir: bundleDir,
      emptyOutDir: true,
      copyPublicDir: false,
      minify: true,
      sourcemap: false,
      lib: { entry: join(root, 'src/index.ts'), formats: ['iife'], name: NAMESPACE, fileName: () => 'bundle.js', cssFileName: 'bundle' },
      rollupOptions: {
        external: ['react', 'react-dom'],
        output: { globals: { react: 'React', 'react-dom': 'ReactDOM' } },
        // Radix marca sus módulos con "use client"; en un script clásico no significa nada.
        onwarn(warning, warn) {
          if (warning.code !== 'MODULE_LEVEL_DIRECTIVE') warn(warning);
        },
      },
    },
  });
}

/** Un script clásico incrustado no puede traer `</script` ni `<!--` en claro. */
function escapeForInlining(js: string): string {
  return js.replace(/<\/script/gi, '<\\/script').replace(/<!--/g, '\\x3C!--');
}

/** Los tipos como documentación: los .d.ts de cada componente, sin sus imports. */
function typesFile(): string {
  const dist = join(root, 'dist/components');
  if (!existsSync(dist)) throw new Error('Falta dist/: ejecuta npm run build antes (npm run ds:build lo hace).');
  const parts: string[] = [];
  for (const dir of readdirSync(dist).sort()) {
    const folder = join(dist, dir);
    if (!statSync(folder).isDirectory()) continue;
    for (const file of readdirSync(folder).filter((f) => f.endsWith('.d.ts')).sort()) {
      const body = readFileSync(join(folder, file), 'utf8')
        .split('\n')
        .filter((line) => !/^\s*(import\b|export\s*\{\s*\}\s*;?\s*$)/.test(line))
        .join('\n')
        .trim();
      parts.push(`// ${dir}/${file}\n${body}`);
    }
  }
  return `${parts.join('\n\n')}\n`;
}

async function main(): Promise<void> {
  rmSync(project, { recursive: true, force: true });
  await buildBundle();

  // La cabecera va aquí y no como `banner` de Rollup: el minificador se la come.
  const js = `${BUNDLE_HEADER}\n${escapeForInlining(readFileSync(join(bundleDir, 'bundle.js'), 'utf8'))}`;
  if (Buffer.byteLength(js) > MAX_BUNDLE_BYTES) throw new Error('bundle.js pasa de 6 MB.');
  write(join(project, 'components/bundle.js'), js);

  // La hoja de la librería, y detrás la actual del artifact sin tocar, para
  // que las tarjetas que se conservan (AppHeader, CatalogBoard, CatalogPanel,
  // Panel y la cubierta) mantengan su aspecto.
  const legacy = readFileSync(join(root, 'scripts/design-system/legacy.css'), 'utf8');
  write(join(project, 'components/bundle.css'), `${readFileSync(join(bundleDir, 'bundle.css'), 'utf8')}\n${legacy}`);

  write(join(project, 'components/index.d.ts'), typesFile());
  cpSync(join(root, 'tokens/tokens.json'), join(project, 'tokens.json'));
  cpSync(join(root, 'docs/design-system/README.md'), join(project, 'README.md'));

  for (const component of COMPONENTS) {
    const readme = join(root, 'docs/design-system/components', component.name, 'README.md');
    if (!existsSync(readme)) throw new Error(`Falta el README de ${component.name}: ${readme}`);
    cpSync(readme, join(project, 'components', component.name, 'README.md'));
    write(join(project, 'components', component.name, 'preview.html'), previewHtml(component));
  }

  rmSync(bundleDir, { recursive: true, force: true });
  console.log(`design-system/project: ${COMPONENTS.length} tarjetas, bundle.js ${(Buffer.byteLength(js) / 1024).toFixed(0)} KB`);
  console.log(`A borrar del artifact al publicar: ${SUPERSEDED.join(', ')}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
