import { Gefyra as Klass } from './gefyra';
import * as installer from './install';

export const Gefyra = Klass;
export const gefyraClient = new Klass(installer.binaryPath);
export const gefyraInstaller = installer;
