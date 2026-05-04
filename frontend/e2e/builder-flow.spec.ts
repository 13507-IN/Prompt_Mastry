import { expect, test } from '@playwright/test';

test('critical flow: build answers, generate prompt, and show results', async ({ page }) => {
  await page.goto('/builder');

  await page.getByRole('button', { name: 'Web Application' }).click();
  await page.getByRole('button', { name: 'Yes' }).click();
  await page.getByPlaceholder('Enter project name').fill('Playwright Demo Project');
  await page.getByRole('button', { name: 'Next' }).click();

  await page.getByRole('button', { name: 'Dark Mode' }).click();
  await page.getByRole('button', { name: 'Top' }).click();
  await page.getByRole('button', { name: 'Single Page (SPA)' }).click();
  await page.getByRole('button', { name: 'React/Next.js' }).click();
  await page.getByRole('button', { name: 'Tailwind CSS' }).click();
  await page.getByRole('button', { name: 'Next' }).click();

  await page.getByRole('button', { name: 'PostgreSQL' }).click();
  await page.getByRole('button', { name: 'Prisma' }).click();
  await page.getByRole('button', { name: 'No' }).nth(1).click();
  await page.getByRole('button', { name: 'REST API' }).click();
  await page.getByRole('button', { name: 'Node.js' }).click();
  await page.getByRole('button', { name: 'Next' }).click();

  await page.getByRole('button', { name: 'Vercel' }).click();
  await page.getByRole('button', { name: 'Next' }).click();

  await page.getByRole('button', { name: 'Generate Prompt' }).click();
  await expect(page).toHaveURL(/\/results\//);
  await expect(page.getByRole('heading', { name: 'Your Prompt Is Ready' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Copy Prompt' })).toBeVisible();
});
