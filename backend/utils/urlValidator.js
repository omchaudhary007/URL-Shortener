import { v4 as uuidv4 } from 'uuid';

export const isValidUrl = (string) => {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
};

export const generateShortCode = () => {
  return uuidv4().split('-')[0];
};
