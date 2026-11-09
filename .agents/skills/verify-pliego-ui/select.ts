// Elige las stories que un cambio toca: archivos cambiados cruzados con el
// índice del Storybook compilado. Pura, para poder probarla sin navegador.
import { posix } from 'node:path';

export interface StoryEntry {
  id: string;
  title: string;
  name: string;
  importPath: string;
}

export interface Selection {
  stories: StoryEntry[];
  /** Todas las stories, por un cambio que afecta a cualquiera de ellas. */
  all: boolean;
  /** Por qué se eligió esto, en palabras: va tal cual al informe. */
  reasons: string[];
}

/**
 * Lo que, si cambia, puede cambiar cualquier story: los tokens, los estilos
 * base, los hooks y utilidades compartidos, la configuración de Storybook y el
 * ayudante que abre las stories.
 */
const AFFECTS_EVERYTHING = [
  /^tokens\//,
  /^src\/styles\//,
  /^src\/hooks\//,
  /^src\/utils\//,
  /^src\/test\//,
  /^\.storybook\//,
  /^e2e\/stories\.ts$/,
];

const clean = (path: string) => path.replace(/^\.\//, '');

export function selectStories(changedFiles: string[], entries: StoryEntry[]): Selection {
  const reasons: string[] = [];
  const picked = new Map<string, StoryEntry>();
  let all = false;

  for (const raw of changedFiles.map(clean)) {
    if (AFFECTS_EVERYTHING.some((pattern) => pattern.test(raw))) {
      all = true;
      reasons.push(`${raw}: afecta a todas las stories`);
      continue;
    }
    const folder = posix.dirname(raw);
    const owners = entries.filter((entry) => posix.dirname(clean(entry.importPath)) === folder);
    if (owners.length === 0) {
      reasons.push(`${raw}: sin story`);
      continue;
    }
    for (const entry of owners) picked.set(entry.id, entry);
    reasons.push(`${raw}: ${[...new Set(owners.map((entry) => entry.title))].join(', ')}`);
  }

  return { stories: all ? [...entries] : [...picked.values()], all, reasons };
}
