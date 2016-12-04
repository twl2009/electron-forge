import installer from 'electron-installer-debian';
import path from 'path';
import pify from 'pify';

import { ensureFile } from '../../util/ensure-output';

function debianArch(nodeArch) {
  switch (nodeArch) {
    case 'ia32': return 'i386';
    case 'x64': return 'amd64';
    case 'arm':
      if (process.config.variables.arm_version === '7') {
        return 'armhf';
      }
      return 'armel';
    default: return nodeArch;
  }
}

export default async (dir, appName, forgeConfig, packageJSON) => { // eslint-disable-line
  const arch = debianArch(process.arch);
  const outPath = path.resolve(dir, '../make', `${packageJSON.name}_${packageJSON.version}_${arch}.deb`);

  await ensureFile(outPath);
  const debianDefaults = {
    arch,
    dest: path.dirname(outPath),
    src: dir,
  };
  const debianConfig = Object.assign({}, forgeConfig.electronInstallerDebian, debianDefaults);

  await pify(installer)(debianConfig);
};
