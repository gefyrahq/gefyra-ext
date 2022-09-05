import { ensureInstalled } from '../install';
import { cleanBinary } from './install.tests';
import gefyra from '../gefyra';
import { GefyraStatusResponse } from '../protocol';

jest.setTimeout(120000);
beforeAll(async () => {
  await ensureInstalled();
});

// afterAll(() => {
//     cleanBinary();
// });

test('Gefyra Status', () => {
  let status = gefyra.status();
  expect(status).toBeInstanceOf(GefyraStatusResponse);
  expect(status.status).toEqual('up');
});
