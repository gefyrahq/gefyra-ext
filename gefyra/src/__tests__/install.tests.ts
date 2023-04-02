import { unlinkSync } from 'fs';
import { install, checkInstalled, binaryPath } from '../install';


export function cleanBinary(): any {
  try {
    unlinkSync(binaryPath);
  } catch (err) {}
  try {
    unlinkSync(binaryPath);
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
