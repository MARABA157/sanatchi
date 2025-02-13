import { ReactNode } from 'react';
import { TFunction } from 'i18next';

export const translateToNode = (t: TFunction, key: string): ReactNode => {
  return t(key) as ReactNode;
};
