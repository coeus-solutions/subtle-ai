import { useState, useEffect } from 'react';
import { socketCluster } from '@/lib/socketcluster';

export const useSocketCluster = () => {
  const [client] = useState(socketCluster);

  useEffect(() => {
    return () => {
      // Cleanup function - could be used to handle disconnection if needed
    };
  }, []);

  return client;
}; 