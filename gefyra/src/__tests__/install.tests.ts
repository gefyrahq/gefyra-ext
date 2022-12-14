import { unlinkSync } from 'fs';
import { join } from 'path';
import { InstallError } from '../errors';
import { install, checkInstalled, binaryPath } from '../install';
import { type } from 'os';

const zipNameMap = {
  'Linux': 'gefyra-0.13.4-linux-amd64.zip',
  'Darwin': 'gefyra-0.13.4-darwin-universal.zip',
  'Windows_NT': 'gefyra-0.13.4-windows-x86_64.zip'
};
const platform = type();
const zipName = zipNameMap[platform];
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
