import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import type { Page } from '@playwright/test';

interface IndexEntry {
  id: string;
  title: string;
  name: string;
  type: 'story' | 'docs';
}

/** Las stories del Storybook compilado: una prueba por cada una. */
export function listStories(): IndexEntry[] {
  const index = JSON.parse(readFileSync(resolve('storybook-static/index.json'), 'utf8')) as {
    entries: Record<string, IndexEntry>;
  };
  return Object.values(index.entries).filter((entry) => entry.type === 'story');
}

/**
 * Abre una story lista para medirla. Las fuentes de Google se bloquean: sin
 * red cargarían la pila de respaldo y con red la fuente, y una comparación
 * necesita lo mismo las dos veces.
 */
export async function openStory(page: Page, id: string): Promise<void> {
  await page.route(/fonts\.(googleapis|gstatic)\.com/, (route) => route.abort());
  await page.goto(`/iframe.html?id=${id}&viewMode=story`);
  // Storybook marca el `body` cuando la story se pintó o cuando falló.
  await page.waitForFunction(
    () => document.body.classList.contains('sb-show-main') || document.body.classList.contains('sb-show-errordisplay'),
  );
  // `sb-show-main` se pone antes de que React monte la story: hay que esperar a
  // que haya algo que medir (la raíz, o un portal como el de Drawer). Sin esto
  // las pruebas podían medir una página vacía y pasar sin comprobar nada.
  if (!(await page.evaluate(() => document.body.classList.contains('sb-show-errordisplay')))) {
    await page.waitForSelector('#storybook-root > *, [role="dialog"]', { state: 'attached', timeout: 10_000 });
  }
  await page.evaluate(() => document.fonts.ready);
}
