import { vIcon, vTextField } from '../vuetify-xpaths';

/**
 * Gets the current value of the given stat from the home page
 *
 * @param {String} stat the stat to check
 */
export async function getStat(stat) {
  return page.$eval(`[data-id="stat"][data-name="${stat}"] [data-id="value"]`, (element) => Number(element.innerText));
}

/**
 * Searches for dandisets using the search bar on the home page
 *
 * @param {String} query
 */
export async function search(query) {
  await expect(page).toFillXPath(vTextField('Search Dandisets by name, description, or identifier'), query);
  await expect(page).toClickXPath(vIcon('mdi-magnify'));
  // TODO figure out a dynamic wait
  await page.waitFor(2000);
}
