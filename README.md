# GraphQL Ably PubSub

This is an Ably implementation of the `PubSubEngine` base-class to enable [Subscriptions](https://www.apollographql.com/docs/apollo-server/data/subscriptions) in Apollo Server. This implementation uses Ably as the message transport for the WebSocket portion of Apollo Subscriptions, allowing you to use the feature without managing and maintaining your own WebSocket Server.

Please consult the [Apollo Server documentation](https://www.apollographql.com/docs/apollo-server/data/subscriptions) for more information on how to use this feature.

## Installation

```bash
npm install --save @ably/graphql-ably-pubsub
```

## Usage

You can run a full example by running

```bash
npm run start
```

But the more important parts of the example are shown here

```js
import AblyPubSub from "./index.js"; 

// The AblyPubSub constructor accepts all the same configuration options as the Ably JS SDK.
// Make sure to keep your API key safe! Here, we're loading it from the environment.
const pubsub = new AblyPubSub({ key: process.env.ABLY_API_KEY });

// ...

// Resolver map
const resolvers = {
  Query: {
    currentNumber() {
      return currentNumber;
    },
  },
  Subscription: {
    numberIncremented: {
      subscribe: () => pubsub.asyncIterator(["NUMBER_INCREMENTED"]),
    },
  },
};

// ...

// In the background, increment a number every second and notify subscribers when
// it changes.
let currentNumber = 0;
function incrementNumber() {
  currentNumber++;
  pubsub.publish("NUMBER_INCREMENTED", { numberIncremented: currentNumber });
  setTimeout(incrementNumber, 1000);
}
// Start incrementing
incrementNumber();
```

## Example

This example is based on the ["Subscriptions in Apollo Server v3" sample](https://www.apollographql.com/docs/apollo-server/data/subscriptions/).

The text below is lifted directly from the sample, with the `AblyPubSub` implementation of the `PubSubEngine` replacing the original `PubSub` implementation referenced in the official documentation as "not fit for production use".

This example demonstrates a basic subscription operation in Apollo Server.
[See the docs on subscriptions](https://www.apollographql.com/docs/apollo-server/data/subscriptions/)

The example server exposes one subscription (`numberIncremented`) that returns
an integer that's incremented on the server every second.

After you start up this server, you can test out running a subscription with the
Apollo Studio Explorer by following the link from http://localhost:4000/graphql
to the Apollo Sandbox. You may need to edit the Apollo Sandbox connection
settings to select the
[`graphql-ws` subscriptions implementation](https://www.apollographql.com/docs/studio/explorer/additional-features/#subscription-support).
You'll see the subscription's value update every second.

```graphql
subscription IncrementingNumber {
  numberIncremented
}
```

## Run locally

```shell
npm install
npm run start
```

## Run in CodeSandbox

<a href="https://codesandbox.io/s/github/ably-labs/graphql-ably-pubsub?fontsize=14&hidenavigation=1&initialpath=%2Fgraphql&theme=dark">
  <img alt="Edit" src="https://codesandbox.io/static/img/play-codesandbox.svg">
</a>
