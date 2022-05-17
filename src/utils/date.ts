import moment from 'moment';
import config from '../appconfig';

export const nowUTC = (): Date => {
  return moment.utc().toDate();
};

export const formatDateTime = (dt?: string | Date): string => {
  return moment(dt).format(config.DATE_TIME_FORMAT);
};

export const formatDate = (dt?: string | Date): string => {
  return moment(dt).format(config.DATE_FORMAT);
};

export const formatTime = (dt?: string | Date): string => {
  return moment(dt).format(config.TIME_FORMAT);
};

export const formatMonthYear = (dt?: string | Date): string => {
  return moment(dt).format('MM/YYYY');
};
