import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';
import { listStories, openStory } from './stories';

// WCAG 2.1 AA: el nivel que fija el Design System. Una violación falla la prueba.
const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'];

/**
 * El addon a11y de Storybook corre axe dentro de la propia story, y axe no
 * admite dos ejecuciones a la vez: si la del addon sigue en curso, se espera.
 */
async function analyze(page: Page) {
  for (let attempt = 0; ; attempt += 1) {
    try {
      return await new AxeBuilder({ page }).withTags(TAGS).analyze();
    } catch (error) {
      if (attempt >= 20 || !/already running/i.test(String(error))) throw error;
      await page.waitForTimeout(250);
    }
  }
}

for (const story of listStories()) {
  test(`${story.title} · ${story.name}`, async ({ page }) => {
    await openStory(page, story.id);
    await expect(page.locator('body')).not.toHaveClass(/sb-show-errordisplay/);
    const { violations } = await analyze(page);
    expect(
      violations.map((v) => `${v.id} (${v.impact}): ${v.nodes.map((n) => n.target.join(' ')).join(' | ')}`),
    ).toEqual([]);
  });
}
