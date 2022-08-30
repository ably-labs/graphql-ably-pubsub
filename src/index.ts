import { PubSubEngine } from "graphql-subscriptions";
import Ably from "ably";

type SubscriptionInfo = {
    handler: (...args: unknown[]) => void;
    triggerName: string;
};

export default class AblyPubSub extends PubSubEngine {
  private ably: Ably.Realtime;
  private handlerMap = new Map<number, SubscriptionInfo>();

    constructor(options: Ably.Types.ClientOptions | string) {
      super();
      this.ably = new Ably.Realtime(options);
    }

    public async publish<T>(triggerName: string, payload: T): Promise<void> {
      const channel = this.ably.channels.get(triggerName);
      channel.publish("push", payload);
    }

    public subscribe(triggerName: string, onMessage: (...args: unknown[]) => void): Promise<number> {      
      const handler = (message: Ably.Types.Message) => {
        onMessage(message.data);
      };

      const id = Date.now() * Math.random();
      this.handlerMap.set(id, { handler, triggerName });
      
      const channel = this.ably.channels.get(triggerName);
      channel.subscribe("push", handler);
  
      return Promise.resolve(id);
    }

    public unsubscribe(subId: number) {
      const info = this.handlerMap.get(subId);
      if (!info) { 
        return 
      }

      const channel = this.ably.channels.get(info.triggerName);
      channel.unsubscribe("push", info.handler);
      this.handlerMap.delete(subId);
    }
}