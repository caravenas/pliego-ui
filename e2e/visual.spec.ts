import { expect, test } from '@playwright/test';
import { listStories, openStory } from './stories';

// Una captura por story contra su referencia. Las referencias son de la
// plataforma donde se generaron (Playwright añade `darwin` o `linux` al
// nombre): una captura de otro sistema no es comparable, por la tipografía.
for (const story of listStories()) {
  test(`${story.title} · ${story.name}`, async ({ page }) => {
    await openStory(page, story.id);
    await expect(page).toHaveScreenshot(`${story.id}.png`, { animations: 'disabled', caret: 'hide' });
  });
}
