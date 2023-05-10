const { exec } = require('node:child_process');

import { binaryPath, ensureInstalled } from '../install';
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
  let statusResponse = await gefyraClient.status().catch((err) => {
    console.error(err);
    throw Error('Gefyra Status Error')
  });
  expect(statusResponse).toBeInstanceOf(GefyraStatusResponse);
  expect(statusResponse.status).toEqual('success');
  expect(statusResponse.response.cluster.connected).toEqual(true);
  
});
