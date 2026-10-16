import { expect, test } from '@playwright/test';
import { listStories, openStory } from './stories';

// La regla del sistema: ningún control mide menos de 40 px de alto, y con
// `pointer: coarse` menos de 44 px. Se mide en el navegador, para cada story,
// con el puntero fino (por defecto) y con uno grueso (un móvil emulado).
const CONTROLS = 'button, a[href], select, input:not([type="hidden"]), summary, [role="tab"], [role="radio"]';

/**
 * Lo que mide un control: el control mismo, salvo la cifra de `MeasureField`,
 * cuya área de puntero es la caja de la línea que la contiene (la unidad hace
 * de tirador y el input ocupa lo que le deja).
 */
const MEASURED_BY_PARENT = '.pui-measure__input';

async function undersized(page: import('@playwright/test').Page, min: number): Promise<string[]> {
  return page.evaluate(
    ({ controls, byParent, floor }) => {
      const found: string[] = [];
      for (const element of document.querySelectorAll<HTMLElement>(controls)) {
        const target = element.matches(byParent) ? (element.parentElement as HTMLElement) : element;
        const box = target.getBoundingClientRect();
        // Lo invisible o el texto solo para lectores de pantalla no es un blanco.
        if (box.width <= 1 || box.height <= 1) continue;
        if (getComputedStyle(target).visibility === 'hidden') continue;
        if (box.height + 0.5 < floor) {
          const name = (element.getAttribute('aria-label') || element.textContent || element.className || element.tagName).trim().slice(0, 30);
          found.push(`${element.tagName.toLowerCase()}.${String(element.className).split(' ')[0]} "${name}" mide ${box.height.toFixed(1)} px`);
        }
      }
      return found;
    },
    { controls: CONTROLS, byParent: MEASURED_BY_PARENT, floor: min },
  );
}

test.describe('puntero fino: 40 px', () => {
  for (const story of listStories()) {
    test(`${story.title} · ${story.name}`, async ({ page }) => {
      await openStory(page, story.id);
      expect(await undersized(page, 40)).toEqual([]);
    });
  }
});

test.describe('puntero grueso: 44 px', () => {
  test.use({ hasTouch: true, isMobile: true });

  for (const story of listStories()) {
    test(`${story.title} · ${story.name}`, async ({ page }) => {
      await openStory(page, story.id);
      expect(await page.evaluate(() => matchMedia('(pointer: coarse)').matches)).toBe(true);
      expect(await undersized(page, 44)).toEqual([]);
    });
  }
});
