# @axync/pubsub

`@axync/pubsub` is a simple publish-subscribe (pub-sub) library designed for easy topic-based event handling. It allows you to publish data to specific topics and subscribe multiple handlers to those topics. The library also supports batch execution of handlers with configurable timing.

## Installation

```bash
npm install @axync/pubsub
```

## Usage

### Importing the PubSub class

```typescript
import { PubSub } from "@axync/pubsub";
```

### Example

```typescript
import { PubSub } from "@axync/pubsub";

// Initialize PubSub
const pubsub = new PubSub();

// Subscribe to a topic
const token = pubsub.subscribe("myTopic", (data) => {
  console.log("Received data:", data);
});

// Publish to a topic
pubsub.publish("myTopic", { key: "value" });

// Unsubscribe from a topic
pubsub.unsubscribe("myTopic", token);
```

### Constructor Options

The `PubSub` class accepts an optional `PubSubDependencies` object during initialization:

- `getTopicToken?: () => string`: A function to generate a unique token for each subscription. By default, it uses `getRandomString` from `@axync/random`.
- `onPublishError?: (error: any, data: any) => void`: A function to handle errors that occur during the execution of a handler. Defaults to `console.error`.
- `maxBatchTime?: number`: The maximum time (in milliseconds) to batch handler executions. Defaults to 200ms.

### Methods

#### `subscribe(topic: string, handler: (...args: any[]) => void): string`
Subscribes a handler to a specific topic. Returns a token that can be used to unsubscribe.

#### `unsubscribe(topic: string, token: string): void`
Unsubscribes a handler from a specific topic using the provided token.

#### `unsubscribeAll(topic: string): void`
Unsubscribes all handlers from the specified topic.

#### `removeAllTopics(): void`
Removes all topics and their associated handlers.

#### `publish(topic: string, data: unknown): void`
Publishes data to a specific topic. All handlers subscribed to the topic will be executed.

#### `getCurrentActiveTopics(): string[]`
Returns a list of currently active topics.

## License

MIT

