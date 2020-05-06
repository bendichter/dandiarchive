import { CLIENT_URL, uniqueId } from '../util';
import {
  vAvatar,
  vBtn,
  vTextField,
  vListItem,
  vIcon,
} from '../vuetify-xpaths';

describe('account management', () => {
  const username = `user${uniqueId()}`;
  const email = `${username}@dandi.test`;
  const password = 'password'; // Top secret

  beforeAll(async () => {
    await page.goto(CLIENT_URL);
  });

  it('registers a new user', async () => {
    await expect(page).toClickXPath(vBtn('Create Account'));

    await expect(page).toFillXPath(vTextField('Username'), username);
    await expect(page).toFillXPath(vTextField('Email'), email);
    await expect(page).toFillXPath(vTextField('First Name'), 'Mister');
    await expect(page).toFillXPath(vTextField('Last Name'), 'Roboto');
    await expect(page).toFillXPath(vTextField('Password'), password);
    await expect(page).toFillXPath(vTextField('Retype password'), password);

    await expect(page).toClickXPath(vBtn('Register'));

    // the user avatar contains the initials and is only rendered when logged in successfully
    await expect(page).toContainXPath(vAvatar('MR'));
  });

  it('logs the user out', async () => {
    await expect(page).toClickXPath(vAvatar('MR'));
    await page.waitFor(500);
    await expect(page).toClickXPath(vListItem('Logout', { action: vIcon('mdi-logout') }));

    // this text is only displayed when not logged in
    await expect(page).toMatch('Want to create your own datasets?');
  });

  it('logs the user in', async () => {
    await expect(page).toClickXPath(vBtn('Login'));

    await expect(page).toFillXPath(vTextField('Username or e-mail'), username);
    await expect(page).toFillXPath(vTextField('Password'), password);

    await expect(page).toClickXPath(vBtn(['Login', vIcon('mdi-login')]));

    // the user avatar contains the initials and is only rendered when logged in successfully
    await expect(page).toContainXPath(vAvatar('MR'));
  });
});
