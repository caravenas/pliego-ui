import { describe, expect, it } from 'vitest';
import { selectStories, type StoryEntry } from './select';

const story = (title: string, name: string, folder: string, file: string): StoryEntry => ({
  id: `${title}--${name}`.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
  title,
  name,
  importPath: `./src/components/${folder}/${file}.stories.tsx`,
});

// Un índice pequeño con la misma forma que el de Storybook: dos stories de
// Amount, una de Badge y una de Dashboard, que vive en otra carpeta que su título.
const ENTRIES: StoryEntry[] = [
  story('Finanzas/Amount', 'Default', 'Amount', 'Amount'),
  story('Finanzas/Amount', 'Debit', 'Amount', 'Amount'),
  story('Primitivos/Badge', 'Default', 'Badge', 'Badge'),
  story('Finanzas/Dashboard', 'Default', 'DashboardGrid', 'Dashboard'),
];

const titles = (changed: string[]) => [...new Set(selectStories(changed, ENTRIES).stories.map((s) => s.title))];

describe('selectStories', () => {
  it('un componente elige solo las stories de su carpeta', () => {
    const selection = selectStories(['src/components/Amount/Amount.tsx'], ENTRIES);
    expect(selection.stories.map((s) => s.name)).toEqual(['Default', 'Debit']);
    expect(titles(['src/components/Amount/Amount.tsx'])).toEqual(['Finanzas/Amount']);
    expect(selection.all).toBe(false);
  });

  it('su prueba o su CSS eligen las mismas stories que el componente', () => {
    expect(titles(['src/components/Amount/Amount.test.tsx'])).toEqual(['Finanzas/Amount']);
    expect(titles(['src/components/Amount/Amount.css'])).toEqual(['Finanzas/Amount']);
  });

  it('la carpeta manda, no el título: Dashboard sale de DashboardGrid', () => {
    expect(titles(['src/components/DashboardGrid/DashboardGrid.tsx'])).toEqual(['Finanzas/Dashboard']);
  });

  it.each(['src/styles/base.css', 'tokens/tokens.json', 'src/hooks/usePanelData.ts', 'src/utils/format.ts', '.storybook/preview.ts', 'e2e/stories.ts'])(
    'un cambio en %s elige todas, y dice por qué',
    (path) => {
      const selection = selectStories([path], ENTRIES);
      expect(selection.all).toBe(true);
      expect(selection.stories).toHaveLength(ENTRIES.length);
      expect(selection.reasons).toEqual([`${path}: afecta a todas las stories`]);
    },
  );

  it('un archivo sin story no elige ninguna y lo dice', () => {
    const selection = selectStories(['README.md', 'docs/PLAN.md'], ENTRIES);
    expect(selection.stories).toEqual([]);
    expect(selection.reasons).toEqual(['README.md: sin story', 'docs/PLAN.md: sin story']);
  });

  it('varios archivos de un mismo componente no repiten sus stories', () => {
    const selection = selectStories(['src/components/Amount/Amount.tsx', 'src/components/Amount/Amount.css'], ENTRIES);
    expect(selection.stories).toHaveLength(2);
  });

  it('acepta rutas con ./ al principio', () => {
    expect(titles(['./src/components/Badge/Badge.tsx'])).toEqual(['Primitivos/Badge']);
  });
});
