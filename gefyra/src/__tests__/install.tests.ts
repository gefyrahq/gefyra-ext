import { unlinkSync } from 'fs';
import { join } from 'path';
import { InstallError } from '../errors';
import { install, checkInstalled, binaryPath } from '../install';

const zipName = 'gefyra-0.1.0-linux-amd64.zip';
const outputDir = join(__dirname, '..');
const zipPath = join(outputDir, zipName);

export function cleanBinary(): any {
  try {
    unlinkSync(binaryPath);
  } catch (err) {}
  try {
    unlinkSync(zipPath);
  } catch (err) {}
}

beforeAll(() => {
  cleanBinary();
});

afterAll(() => {
  cleanBinary();
});

test('Gefyra check not installed', () => {
  expect(() => {
    checkInstalled();
  }).toThrowError(/Gefyra binary is not installed/);
});

jest.setTimeout(120000);
test('Install Gefyra', () => {
  return install().then(() => {
    checkInstalled();
  });
});
