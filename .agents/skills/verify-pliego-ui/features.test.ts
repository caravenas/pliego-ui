import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { FEATURES, MAPPED_TITLES } from './features';

// Los títulos salen del código fuente de las stories, no del Storybook
// compilado: esta prueba corre en `npm test`, antes de cualquier build.
function sourceTitles(folder: string): string[] {
  const titles: string[] = [];
  for (const entry of readdirSync(folder, { withFileTypes: true })) {
    const path = join(folder, entry.name);
    if (entry.isDirectory()) titles.push(...sourceTitles(path));
    else if (entry.name.endsWith('.stories.tsx')) {
      const match = readFileSync(path, 'utf8').match(/^ {2}title: '([^']+\/[^']+)',/m);
      if (match) titles.push(match[1]);
    }
  }
  return titles;
}

describe('el mapa de funcionalidades', () => {
  const real = sourceTitles('src');

  it('encuentra las stories del repositorio', () => {
    expect(real.length).toBeGreaterThan(0);
  });

  it('todo título del mapa existe', () => {
    expect(MAPPED_TITLES.filter((title) => !real.includes(title))).toEqual([]);
  });

  it('toda story del repositorio pertenece a una funcionalidad', () => {
    expect(real.filter((title) => !MAPPED_TITLES.includes(title))).toEqual([]);
  });

  it('ningún título está en dos funcionalidades', () => {
    expect(MAPPED_TITLES.filter((title, index) => MAPPED_TITLES.indexOf(title) !== index)).toEqual([]);
  });

  it('cada funcionalidad tiene al menos una story', () => {
    expect(Object.entries(FEATURES).filter(([, feature]) => feature.titles.length === 0)).toEqual([]);
  });
});
