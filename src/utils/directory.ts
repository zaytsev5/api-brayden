import moment from 'moment';
import * as fs from 'fs';
import config from '../appconfig';

export const formatDir = (dt?: string | Date): string => {
  return moment(dt).format(config.DIR_FORMAT);
};

export const mkdirRecursiveSync = (path: string): void => {
  const paths = path.split('/');
  let fullPath = '';
  paths.forEach((path) => {
    if (fullPath === '') {
      fullPath = path;
    } else {
      fullPath = fullPath + '/' + path;
    }

    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath);
    }
  });
};
