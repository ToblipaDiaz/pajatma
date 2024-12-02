import { useState, useEffect } from 'react';
import { syncDesignTokens, syncComponents, DesignToken } from '../utils/figma';

export function useFigmaSync() {
  const [tokens, setTokens] = useState<DesignToken[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function sync() {
      try {
        setIsLoading(true);
        const designTokens = await syncDesignTokens();
        setTokens(designTokens);
      } catch (err) {
        setError('Error sincronizando con Figma');
      } finally {
        setIsLoading(false);
      }
    }

    sync();
  }, []);

  return { tokens, isLoading, error };
}