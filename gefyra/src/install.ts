import { type, arch } from 'os';
import { chmodSync, existsSync } from 'fs';
import { join } from 'path';

import downloadRelease = require('download-github-release');

import { InstallError } from './errors';

const user = 'gefyrahq';
const repo = 'gefyra-ext';
const binaryName = 'gefyra-json';
const outputDir = __dirname;
export const binaryPath = join(outputDir, binaryName);
const supportedPlatforms = [
  {
    TYPE: 'Linux',
    TARGET: 'linux-amd64',
  },
  {
    TYPE: 'Darwin',
    TARGET: 'x64'
  },
  {
    TYPE: 'Windows_NT',
    TARGET: 'x64'
  },
];

const getPlatform = () => {
  const platform = type();
  const architecture = arch();

  for (const index in supportedPlatforms) {
    if (platform === supportedPlatforms[index].TYPE) {
      return supportedPlatforms[index].TARGET;
    }
  }

  throw new InstallError(
    `Platform with type '${type}' and architecture '${architecture}' is not supported by Gefyra.\nYour system must be one of the following:\n\n
    ${supportedPlatforms}`,
  );
};

function filterRelease(release: any): boolean {
  return release.name === '0.3.3';
}

function filterAsset(asset: any) {
  const target = getPlatform();
  return asset.name.indexOf(target) >= 0;
}

async function downloadGefyraRelease(): Promise<void> {
  // @ts-ignore as there is some mistake in the types of this 3rd party function
  const download = downloadRelease(user, repo, outputDir, filterRelease, filterAsset, false);
  download
    .then(() => {
      const platform = type();
      if (platform === 'Linux' || platform === 'Darwin') {
        chmodSync(binaryPath, 0o111);
      }
    })
    .catch((err) => {
      throw new InstallError(err.message);
    });
  return download;
}

export function install(): Promise<void> {
  return downloadGefyraRelease();
}

export function checkInstalled() {
  if (!existsSync(binaryPath)) {
    throw new InstallError(`Gefyra binary is not installed: ${binaryPath}`);
  } else {
    chmodSync(binaryPath, 0o111);
  }
}

export function isInstalled(): boolean {
  try {
    checkInstalled();
    return true;
  } catch (InstallError) {
    return false;
  }
}

export function ensureInstalled() {
  try {
    checkInstalled();
  } catch (InstallError) {
    return downloadGefyraRelease();
  }
}
