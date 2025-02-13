import { useState, useEffect } from 'react';

interface DynamicImportState<T> {
  Component: T | null;
  error: Error | null;
  loading: boolean;
}

function useDynamicImport<T>(importFn: () => Promise<{ default: T }>) {
  const [state, setState] = useState<DynamicImportState<T>>({
    Component: null,
    error: null,
    loading: true,
  });

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const { default: Component } = await importFn();
        if (mounted) {
          setState({
            Component,
            error: null,
            loading: false,
          });
        }
      } catch (error) {
        if (mounted) {
          setState({
            Component: null,
            error: error as Error,
            loading: false,
          });
        }
      }
    })();

    return () => {
      mounted = false;
    };
  }, [importFn]);

  return state;
}

export default useDynamicImport;
