import { join } from 'path';
import { execSync } from 'child_process';

const GEFYRA = join(__dirname, "..", "gefyra-json");

const gefyra = () => {
  const stdout = execSync(`${GEFYRA} '{"action": "gefyra.status"}'`);
  return JSON.parse(stdout.toString());
};

export default gefyra;
