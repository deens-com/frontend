import { useEffect } from 'react';

export default function useResponsive(onWindowResize) {
  useEffect(
    () => {
      window.addEventListener('resize', onWindowResize);
      return () => {
        window.removeEventListener('resize', onWindowResize);
      };
    },
    [onWindowResize],
  );
}
