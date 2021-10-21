import { useEffect, useRef } from 'react';

export const useComponentMounted = () => {
  const componentIsMounted = useRef(true);
  useEffect(() => {
    return () => {
      componentIsMounted.current = false;
    };
  }, []);
  return componentIsMounted;
};

export const useWindowTitle = (newTitle?: string | (string | undefined)[]) => {
  const title = Array.isArray(newTitle)
    ? newTitle.some((str) => !str)
      ? document.title
      : newTitle.join(' - ')
    : newTitle;
  document.title = title || 'R^My Health App';
};
