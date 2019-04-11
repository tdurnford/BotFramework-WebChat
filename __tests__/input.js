import { By, Key } from 'selenium-webdriver';

import { imageSnapshotOptions, timeouts } from './constants.json';
import minNumActivitiesShown from './setup/conditions/minNumActivitiesShown.js';

// selenium-webdriver API doc:
// https://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/index_exports_WebDriver.html

jest.setTimeout(timeouts.test);

const styleOptions = { sendBoxTextWrap: true };

test('textarea input scroll', async () => {
  const { driver } = await setupWebDriver({ props: { styleOptions }});

  const textarea = await driver.findElement(By.tagName('textarea'));

  await textarea.sendKeys('Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.');

  const base64PNG = await driver.takeScreenshot();

  expect(base64PNG).toMatchImageSnapshot(imageSnapshotOptions);
});

test('textarea input resize after delete', async () => {
  const { driver } = await setupWebDriver({ props: { styleOptions }});

  const textarea = await driver.findElement(By.tagName('textarea'));

  await textarea.sendKeys('Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.');
  await textarea.sendKeys(Key.chord([Key.CONTROL, 'a']), Key.BACK_SPACE);

  const base64PNG = await driver.takeScreenshot();

  expect(base64PNG).toMatchImageSnapshot(imageSnapshotOptions);
});

test('textarea input with whitespace', async () => {
  const { driver } = await setupWebDriver({ props: { styleOptions }});

  const textarea = await driver.findElement(By.tagName('textarea'));

  await textarea.sendKeys('Lorem ipsum dolor       sit amet, consectetur       adipiscing elit, sed do eiusmod tempor        incididunt ut labore et        dolore magna      aliqua.');

  const base64PNG = await driver.takeScreenshot();

  expect(base64PNG).toMatchImageSnapshot(imageSnapshotOptions);
});

test('textarea input shift enter', async () => {
  const { driver } = await setupWebDriver({ props: { styleOptions }});

  const textarea = await driver.findElement(By.tagName('textarea'));

  await textarea.sendKeys('Lorem ipsum dolor sit amet, consectetur adipiscing elit,');
  await textarea.sendKeys(Key.chord([Key.SHIFT, Key.ENTER]));
  await textarea.sendKeys('sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.');

  const base64PNG = await driver.takeScreenshot();

  expect(base64PNG).toMatchImageSnapshot(imageSnapshotOptions);
});

test('textarea input multiple lines', async () => {
  const { driver } = await setupWebDriver({ props: { styleOptions }});

  const textarea = await driver.findElement(By.tagName('textarea'));

  await textarea.sendKeys('Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.');

  const base64PNG = await driver.takeScreenshot();

  expect(base64PNG).toMatchImageSnapshot(imageSnapshotOptions);
});

test('textarea send on enter', async () => {
  const { driver } = await setupWebDriver({ props: { styleOptions }});

  const textarea = await driver.findElement(By.tagName('textarea'));

  await textarea.sendKeys('Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', Key.ENTER);
  await driver.wait(minNumActivitiesShown(2), timeouts.directLine);

  const base64PNG = await driver.takeScreenshot();

  expect(base64PNG).toMatchImageSnapshot(imageSnapshotOptions);
});
