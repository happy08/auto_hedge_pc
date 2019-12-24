import settings from 'electron-settings';
import fse from 'fs-extra';
import path from 'path';
import os from 'os';

const docDir = path.join(os.homedir(), 'auto_hedge_pc');
const settingsPath = path.join(docDir, 'hedgeLog.json');
fse.ensureFileSync(settingsPath);
settings.setPath(settingsPath);

 
export const record = (data) => {
  settings.set(`${new Date().getTime()}`, JSON.stringify(data));
}
export default record