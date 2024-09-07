import { getRandomString } from "@axync/random";

export interface PubSubDependencies {
  getTopicToken?: () => string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onPublishError?: (error: any, data: any) => void;
  maxBatchTime?: number;
}

interface TopicHandlers {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: (...args: any[]) => void;
}

interface TopicRecords {
  [key: string]: TopicHandlers;
}

export class PubSub {
  private topics: TopicRecords;
  private getTopicToken: () => string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private onPublishError: (error: any, data: any) => void;
  private executionQueue: Record<string, (() => Promise<void>)[]> = {};
  private executionTimer: NodeJS.Timeout | null = null;
  private batchStartTime: number | null = null;
  private maxBatchTime: number;
  private currentProcess: Promise<void[]> = Promise.resolve([]);

  constructor({
    getTopicToken,
    onPublishError,
    maxBatchTime,
  }: PubSubDependencies = {}) {
    this.topics = {};
    this.getTopicToken = getTopicToken ?? getRandomString;
    this.onPublishError = onPublishError ?? console.error;
    this.maxBatchTime = maxBatchTime ?? 200;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  subscribe(topic: string, handler: (...args: any[]) => void) {
    const token = this.getTopicToken();
    if (!this.topics[topic]) {
      this.topics[topic] = {};
    }
    this.topics[topic][token] = handler;
    return token;
  }

  unsubscribe(topic: string, token: string) {
    if (!this.topics[topic]) {
      return;
    }
    delete this.topics[topic][token];
    if (Object.keys(this.topics[topic]).length === 0) {
      delete this.topics[topic];
    }
  }

  unsubscribeAll(topic: string) {
    if (!this.topics[topic]) {
      return;
    }
    delete this.topics[topic];
  }

  removeAllTopics() {
    this.topics = {};
  }

  publish(topic: string, data: unknown) {
    // If there are no handlers for the topic, return early.
    if (!this.topics[topic] || Object.keys(this.topics[topic]).length === 0) {
      return;
    }

    if (this.batchStartTime === null) {
      this.batchStartTime = performance.now();
    }

    this.executionQueue[topic] = [];
    const handlers = Object.values(this.topics[topic]);
    for (const handler of handlers) {
      this.executionQueue[topic].push(async () => {
        try {
          await handler(data);
        } catch (error) {
          this.onPublishError(error, data);
        }
      });
    }

    if (performance.now() - this.batchStartTime > this.maxBatchTime) {
      this.clearExecutionTimer();
      this.processExecutionQueue();
      this.batchStartTime = null;
      return;
    }

    this.clearExecutionTimer();
    this.registerExecution();
  }

  getCurrentActiveTopics() {
    return Object.keys(this.topics);
  }

  private async processExecutionQueue() {
    await this.currentProcess;
    const promises: Promise<void>[] = [];
    for (const topic in this.executionQueue) {
      const tasks = this.executionQueue[topic];
      this.executionQueue[topic] = [];
      for (const task of tasks) {
        promises.push(task());
      }
    }
    this.currentProcess = Promise.all(promises);
  }

  private clearExecutionTimer() {
    if (this.executionTimer) {
      clearTimeout(this.executionTimer);
    }
  }

  private registerExecution() {
    this.executionTimer = setTimeout(() => {
      this.processExecutionQueue();
    }, this.maxBatchTime);
  }
}
