import { ensureInstalled } from '../install';
import { cleanBinary } from './install.tests';
import { gefyraClient } from '../index';
import { GefyraStatusResponse } from '../protocol';

jest.setTimeout(120000);
beforeAll(async () => {
  await ensureInstalled();
});

// afterAll(() => {
//     cleanBinary();
// });

test('Gefyra Status', async () => {
  let status = await gefyraClient.status();
  console.log(status);
  expect(status).toBeInstanceOf(GefyraStatusResponse);
  expect(status.status).toEqual('up');
});
