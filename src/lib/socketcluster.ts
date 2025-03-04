import socketClusterClient from 'socketcluster-client';

interface SubscriptionHandlers {
  [key: string]: {
    [key: string]: (data: any) => void;
  };
}

interface Topics {
  [key: string]: any;
}

interface SubscriptionIds {
  [key: string]: string;
}

class SocketClusterClient {
  private _socket: any;
  private _topics: Topics = {};
  private _subscriptionHandlers: SubscriptionHandlers = {};
  private _subscriptionIds: SubscriptionIds = {};
  public connected: boolean = false;

  constructor() {
    console.log('creating new sc client')
    
    const socketUrl = import.meta.env.VITE_SOCKETCLUSTER_URL || 'ws://localhost:7001/socketcluster';
    const { hostname, pathname, protocol } = new URL(socketUrl);
    const port = parseInt(new URL(socketUrl).port, 10);
    
    const token = localStorage.getItem('token');
    
    const options = {
      hostname,
      port,
      pathname,
      secure: protocol === 'wss:',
      authToken: token
    };

    this._socket = socketClusterClient.create(options);

    (async () => {
      for await (let { socket } of this._socket.listener('connect')) {
        this.connected = true;
        // Try to authenticate on connect if token exists
        const token = localStorage.getItem('token');
        if (token) {
          await this.authenticate();
        }
      }
    })();

    (async () => {
      for await (let { socket } of this._socket.listener('disconnect')) {
        this.connected = false;
      }
    })();
  }

  public async authenticate() {
    const token = localStorage.getItem('token');
    if (token && this._socket) {
      try {
        await this._socket.authenticate(token);
        // Re-subscribe to all topics after authentication
        Object.keys(this._topics).forEach(topic => {
          this._initSubscription(topic);
        });
      } catch (error) {
        console.error('SocketCluster authentication failed:', error);
      }
    }
  }

  public deauthenticate() {
    if (this._socket) {
      this._socket.deauthenticate();
      // Clear all subscriptions
      Object.keys(this._topics).forEach(topic => {
        const channel = this._topics[topic];
        if (channel) {
          channel.close();
        }
      });
      this._topics = {};
    }
  }

  public publish(topic: string, data: any): Promise<void> {
    return this._socket.transmitPublish(topic, JSON.stringify(data));
  }

  public subscribe(topic: string, handler: (data: any) => void): string {
    if (!this._subscriptionHandlers[topic]) {
      this._subscriptionHandlers[topic] = {};
    }

    const subscriptionId = this._randomId();
    this._subscriptionHandlers[topic][subscriptionId] = handler;
    this._subscriptionIds[subscriptionId] = topic;

    if (!this._topics[topic]) {
      this._topics[topic] = false;
      this._initSubscription(topic);
    }

    return subscriptionId;
  }

  public unsubscribe(subscriptionId: string): void {
    const topic = this._subscriptionIds[subscriptionId];
    if (topic) {
      delete this._subscriptionIds[subscriptionId];
      delete this._subscriptionHandlers[topic][subscriptionId];

      if (Object.keys(this._subscriptionHandlers[topic]).length === 0) {
        const channel = this._topics[topic];
        if (channel) {
          channel.close();
        }
        delete this._topics[topic];
      }
    }
  }

  public getSocket(): any {
    return this._socket;
  }

  private _randomId(): string {
    return Math.random().toString(36).substring(2);
  }

  private _initSubscription(topic: string): void {
    if (this._topics[topic] !== false) {
      return;
    }

    (async () => {
      const channel = this._socket.subscribe(topic);
      this._topics[topic] = channel;

      try {
        if (channel.state !== channel.SUBSCRIBED) {
          await channel.listener('subscribe').once();
        }

        for await (let data of channel) {
          try {
            const parsedData = typeof data === 'string' ? JSON.parse(data) : data;
            console.log('ICSC Received', topic, data)
            Object.values(this._subscriptionHandlers[topic]).forEach(handler => handler(parsedData));
          } catch (error) {
            Object.values(this._subscriptionHandlers[topic]).forEach(handler => handler(data));
          }
        }
      } catch (error) {
        console.error('Subscription error:', error);
      }
    })();
  }
}

export const socketCluster = new SocketClusterClient(); 