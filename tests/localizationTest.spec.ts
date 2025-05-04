import { test, expect, Page } from '@playwright/test';
import i18next from 'i18next';
import Backend from 'i18next-fs-backend';
import path from 'path';

let context;
let page: Page;

// test.use({ locale: 'fr-FR' });

test.beforeAll(async ({ browser }) => {
  context = await browser.newContext();
  page = await context.newPage();

  await page.goto('https://www.duckduckgo.com');

  const browserLocale = await page.evaluate(() => navigator.language);

  await i18next.use(Backend).init({
    lng: browserLocale,
    fallbackLng: 'en',
    backend: {
      loadPath: path.resolve(__dirname, './../locales/{{lng}}.json'),
    },
  });
});

test('Header message displays expected marketing text', async () => {
  await expect(page.locator('h2').first()).toHaveText(
    i18next.t('switchToDuckDuckGo')
  );
});

test('Search input has placeholder text', async () => {
  await expect(page.locator('#searchbox_input')).toHaveAttribute(
    'placeholder',
    i18next.t('searchPlaceHolder')
  );
});

test('Can search for localization librarties', async () => {
  await page.fill('#searchbox_input', 'i18next');
  await page.click('[aria-label="Search"]');

  // Verify the expected result title
  await expect(
    page.locator('[data-testid="result-title-a"]').first()
  ).toHaveText('Introduction | i18next documentation');
});

test('Can search images', async () => {
  await page.fill('#searchbox_input', 'i18next');
  await page.click('[aria-label="Search"]');

  await page.getByRole('link', { name: i18next.t('images') }).click();

  await expect(
    page.getByAltText(
      'A Complete Guide to Internationalization with React i18next'
    )
  ).toHaveCount(1);
  await expect(
    page.getByAltText(
      'A Complete Guide to Internationalization with React i18next'
    )
  ).toBeVisible();
});
