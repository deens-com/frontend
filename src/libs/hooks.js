import { useRef } from 'react';

export const useVoid = () => {
  return useRef(() => {}).current;
};
