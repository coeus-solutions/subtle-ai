import { useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { socketCluster } from '@/lib/socketcluster';

export interface ChannelMessage {
  type: string;
  data?: any;
}

export const useUserChannel = (onMessage: (message: ChannelMessage) => void) => {
  const { user } = useAuth();

  useEffect(() => {
    let subscriptionId: string | undefined;

    if (user?.uuid) {
      const channel = `/user/${user.uuid}`;
      subscriptionId = socketCluster.subscribe(channel, onMessage);
    }

    return () => {
      if (subscriptionId) {
        socketCluster.unsubscribe(subscriptionId);
      }
    };
  }, [user?.uuid, onMessage]);
}; 