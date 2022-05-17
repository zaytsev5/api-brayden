'use strict';

import config from 'config';

export const appconfig = {
  DATE_TIME_FORMAT: config.get<string>('dateTime.DATE_TIME_FORMAT'),
  DATE_FORMAT: config.get<string>('dateTime.DATE_FORMAT'),
  TIME_FORMAT: config.get<string>('dateTime.TIME_FORMAT'),
  DIR_FORMAT: config.get<string>('directory.DIR_FORMAT'),
};

export default appconfig;
