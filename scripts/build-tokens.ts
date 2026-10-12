/**
 * tokens/*.json → src/styles/tokens.css + src/tokens.ts
 *
 * tokens/tokens.json tiene el mismo formato que el Design System de claude.ai
 * (familias como listas {name, value, usage}), así que el mismo archivo sirve
 * para re-sincronizar el artifact. Los nombres se respetan tal cual: la
 * variable --color-text-primary de PliegoStack sigue llamándose igual aquí,
 * y su CSS actual funciona sobre este paquete sin renombrar nada.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

type Token = { name: string; value: string | number | Record<string, string>; usage?: string };
type Family = { note?: string; tokens: Token[] };
type TypeStyle = {
  name: string;
  fontSize: string;
  lineHeight?: string | number;
  fontWeight?: number | string;
  letterSpacing?: string;
  fontStyle?: string;
};
type Tokens = {
  color: { themes: { id: string; name: string }[]; tokens: Token[] };
  type: {
    families: Record<string, string>;
    groups: { name: string; family: string; styles: (TypeStyle & { family?: string })[] }[];
  };
  [family: string]: unknown;
};

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = <T>(p: string): T => JSON.parse(readFileSync(resolve(root, p), 'utf8')) as T;

const tokens = read<Tokens>('tokens/tokens.json');
const motion = read<Family>('tokens/motion.json');

const NAME = /^[A-Za-z0-9][A-Za-z0-9_.-]{0,63}$/;
const seen = new Set<string>();
function check(name: string): string {
  if (!NAME.test(name)) throw new Error(`Nombre de token inválido: "${name}"`);
  if (seen.has(name)) throw new Error(`Token duplicado: "${name}"`);
  seen.add(name);
  return name;
}
const cssName = (n: string) => `--${n.replace(/\./g, '\\.')}`;
const colorValue = (v: string) => (/^\{(.+)\}$/.test(v) ? `var(--${v.slice(1, -1)})` : v);

const themes = tokens.color.themes;
const first = themes[0]?.id ?? 'light';

// Colores: el primer tema va en :root; los demás, en [data-theme="<id>"].
const perTheme: Record<string, string[]> = Object.fromEntries(themes.map((t) => [t.id, []]));
for (const t of tokens.color.tokens) {
  check(t.name);
  const values = typeof t.value === 'object' ? t.value : { [first]: String(t.value) };
  const base = values[first] ?? Object.values(values)[0];
  perTheme[first].push(`  ${cssName(t.name)}: ${colorValue(base)};`);
  for (const th of themes.slice(1)) {
    if (values[th.id] && values[th.id] !== base) perTheme[th.id].push(`  ${cssName(t.name)}: ${colorValue(values[th.id])};`);
  }
}

// Familias de un solo valor: todo lo que tenga forma {tokens: [...]}, más motion.
const SKIP = new Set(['color', 'type', 'meta', 'name', 'version']);
const plain: [string, Family][] = Object.entries(tokens)
  .filter(([k, v]) => !SKIP.has(k) && typeof v === 'object' && v !== null && Array.isArray((v as Family).tokens))
  .map(([k, v]) => [k, v as Family]);
plain.push(['motion', motion]);

const rootLines: string[] = [];
for (const [key, stack] of Object.entries(tokens.type.families)) {
  rootLines.push(`  --font-${key}: ${stack};`);
}
for (const [family, f] of plain) {
  rootLines.push(`  /* ${family} */`);
  for (const t of f.tokens) rootLines.push(`  ${cssName(check(t.name))}: ${String(t.value)};`);
}

// Estilos de texto como clases utilitarias: .pui-type-<nombre>.
const typeRules: string[] = [];
for (const g of tokens.type.groups) {
  for (const s of g.styles) {
    const decl = [
      `font-family: var(--font-${s.family ?? g.family});`,
      `font-size: ${s.fontSize};`,
      s.lineHeight !== undefined && `line-height: ${s.lineHeight};`,
      s.fontWeight !== undefined && `font-weight: ${s.fontWeight};`,
      s.letterSpacing && `letter-spacing: ${s.letterSpacing};`,
      s.fontStyle && `font-style: ${s.fontStyle};`,
    ].filter(Boolean);
    typeRules.push(`.pui-type-${s.name} {\n  ${decl.join('\n  ')}\n}`);
  }
}

const header = '/* GENERADO por scripts/build-tokens.ts desde tokens/*.json — no editar a mano. */\n';
const css = [
  header,
  `:root,\n[data-theme="${first}"] {\n${perTheme[first].join('\n')}\n}`,
  ...themes.slice(1).map((t) => `[data-theme="${t.id}"] {\n${perTheme[t.id].join('\n')}\n}`),
  `:root {\n${rootLines.join('\n')}\n}`,
  ...typeRules,
].join('\n\n') + '\n';

// Tipos: cada nombre de token y su var() correspondiente.
const all = [...tokens.color.tokens, ...plain.flatMap(([, f]) => f.tokens)];
const ts = `${header.replace('/*', '//').replace(' */', '')}
export const tokenNames = ${JSON.stringify(all.map((t) => t.name), null, 2)} as const;

export type TokenName = (typeof tokenNames)[number];

/** \`cssVar('color-text-primary')\` → \`'var(--color-text-primary)'\`, con el nombre comprobado por TypeScript. */
export const cssVar = (name: TokenName): string => \`var(--\${name})\`;

export const fontFamilies = ${JSON.stringify(Object.keys(tokens.type.families))} as const;
export type FontFamily = (typeof fontFamilies)[number];

export const typeStyles = ${JSON.stringify(tokens.type.groups.flatMap((g) => g.styles.map((s) => s.name)), null, 2)} as const;
export type TypeStyle = (typeof typeStyles)[number];
`;

mkdirSync(resolve(root, 'src/styles'), { recursive: true });
writeFileSync(resolve(root, 'src/styles/tokens.css'), css);
writeFileSync(resolve(root, 'src/tokens.ts'), ts);
console.log(`tokens: ${all.length} variables, ${typeRules.length} estilos de texto, ${themes.length} tema(s)`);
