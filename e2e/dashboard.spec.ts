import { expect, test, type Page } from '@playwright/test';
import { openStory } from './stories';

// El dashboard compuesto, medido en el navegador a los tres anchos que el brief
// de L-17 promete: cuántas columnas, que nada se desborde, que el orden visual
// sea el del DOM y que Tab recorra la pantalla sin quedarse en ninguna parte.
const WIDTHS = [
  { width: 1024, columns: 3 },
  { width: 768, columns: 2 },
  { width: 375, columns: 1 },
];

const STORY = 'finanzas-dashboard--default';

async function openDashboard(page: Page, width: number) {
  await page.setViewportSize({ width, height: 900 });
  await openStory(page, STORY);
  // Los datos llegan en el siguiente turno: se espera a la tabla, que es lo último en pintarse.
  await page.waitForSelector('.pui-movements table');
}

for (const { width, columns } of WIDTHS) {
  test.describe(`dashboard a ${width} px`, () => {
    test('no desborda en horizontal y reparte los paneles en las columnas previstas', async ({ page }) => {
      await openDashboard(page, width);

      const overflow = await page.evaluate(() => {
        const root = document.documentElement;
        const outside: string[] = [];
        for (const el of document.querySelectorAll<HTMLElement>('#storybook-root *')) {
          const box = el.getBoundingClientRect();
          if (box.width === 0 || box.right <= root.clientWidth + 0.5) continue;
          // Pasarse del ancho solo vale dentro de una región que se desplaza por su cuenta.
          let scrolls = false;
          for (let up = el.parentElement; up; up = up.parentElement) {
            const overflowX = getComputedStyle(up).overflowX;
            if (overflowX === 'auto' || overflowX === 'scroll') {
              scrolls = true;
              break;
            }
          }
          if (!scrolls) outside.push(`${el.tagName.toLowerCase()}.${String(el.className).split(' ')[0]} termina en ${box.right.toFixed(0)} px`);
        }
        return { page: root.scrollWidth - root.clientWidth, outside: outside.slice(0, 5) };
      });
      expect(overflow.page).toBeLessThanOrEqual(0);
      expect(overflow.outside).toEqual([]);

      const lefts = await page.$$eval('.pui-data-panel', (panels) => panels.map((p) => Math.round(p.getBoundingClientRect().left)));
      expect(lefts).toHaveLength(5);
      expect(new Set(lefts).size).toBe(columns);
    });

    test('el orden visual es el del DOM y Tab sale de la pantalla sin bloquearse', async ({ page }) => {
      await openDashboard(page, width);

      // Los paneles, por posición (arriba y luego izquierda), son los del DOM.
      const order = await page.$$eval('.pui-data-panel', (panels) => {
        const boxes = panels.map((p, index) => ({ index, ...p.getBoundingClientRect().toJSON() }));
        return [...boxes].sort((a, b) => Math.round(a.top) - Math.round(b.top) || a.left - b.left).map((b) => b.index);
      });
      expect(order).toEqual([0, 1, 2, 3, 4]);

      // Una pasada de Tab desde el principio de la página.
      await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
      const visited: { id: string; top: number; left: number }[] = [];
      let previous = '';
      let left = false;
      for (let press = 0; press < 80 && !left; press += 1) {
        await page.keyboard.press('Tab');
        const now = await page.evaluate(() => {
          const el = document.activeElement as HTMLElement | null;
          if (!el || el === document.body || !document.getElementById('storybook-root')?.contains(el)) return null;
          const box = el.getBoundingClientRect();
          const name = el.getAttribute('aria-label') || el.textContent?.trim().slice(0, 24) || el.tagName;
          return { id: `${el.tagName}:${name}:${Math.round(box.top + window.scrollY)}:${Math.round(box.left)}`, top: box.top + window.scrollY, left: box.left };
        });
        if (now === null) {
          left = true;
          break;
        }
        // El foco nunca se queda en el mismo sitio: sería un bloqueo.
        expect(now.id, `Tab ${press + 1} no avanzó`).not.toBe(previous);
        previous = now.id;
        visited.push(now);
      }
      expect(left, 'Tab no salió de la pantalla en 80 pulsaciones').toBe(true);
      expect(visited.length).toBeGreaterThan(8);
    });

    test('cada parada de Tab queda dentro de su panel en el orden del DOM', async ({ page }) => {
      await openDashboard(page, width);
      await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
      const indexes: number[] = [];
      for (let press = 0; press < 80; press += 1) {
        await page.keyboard.press('Tab');
        const index = await page.evaluate(() => {
          const el = document.activeElement as HTMLElement | null;
          if (!el || el === document.body) return -2;
          const panel = el.closest('.pui-data-panel');
          if (!panel) return -1; // el selector de periodo, antes de los paneles
          return Array.from(document.querySelectorAll('.pui-data-panel')).indexOf(panel);
        });
        if (index === -2) break;
        indexes.push(index);
      }
      // Primero el selector (-1), luego los paneles sin retroceder jamás.
      expect(indexes[0]).toBe(-1);
      const rest = indexes.slice(1).filter((i) => i >= 0);
      expect(rest).toEqual([...rest].sort((a, b) => a - b));
      // Y llega hasta el último panel: ninguno queda fuera del recorrido.
      expect(new Set(rest).has(4)).toBe(true);
    });
  });
}
