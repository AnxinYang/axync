import { describe, it, expect, vi, beforeEach } from "vitest";
import { PubSub } from "../pubsub.js";

describe("PubSub", () => {
  let pubSub: PubSub;

  beforeEach(() => {
    pubSub = new PubSub({
      getTopicToken: vi.fn(() => "mock-token"),
      maxBatchTime: 0,
    });
  });

  it("should subscribe to a topic and store the handler", () => {
    const handler = vi.fn();
    const token = pubSub.subscribe("test-topic", handler);

    expect(token).toBe("mock-token");
    expect(pubSub["topics"]["test-topic"]["mock-token"]).toBe(handler);
  });

  it("should unsubscribe a handler from a topic and remove the topic if no handlers remain", () => {
    const handler = vi.fn();
    const token = pubSub.subscribe("test-topic", handler);
    pubSub.unsubscribe("test-topic", token);

    expect(pubSub["topics"]["test-topic"]).toBeUndefined();
  });

  it("should unsubscribe all handlers from a topic", () => {
    const handler1 = vi.fn();
    const handler2 = vi.fn();
    pubSub.subscribe("test-topic", handler1);
    pubSub.subscribe("test-topic", handler2);

    pubSub.unsubscribeAll("test-topic");
    expect(pubSub["topics"]["test-topic"]).toBeUndefined();
  });

  it("should remove all topics", () => {
    const handler = vi.fn();
    pubSub.subscribe("test-topic", handler);

    pubSub.removeAllTopics();
    expect(pubSub["topics"]).toEqual({});
  });

  it('should publish data to subscribed handlers', async () => {
    const handler = vi.fn().mockResolvedValue(null);
    pubSub.subscribe('test-topic', handler);
  
    pubSub.publish('test-topic', { message: 'hello' });
  
    await new Promise((resolve) => setTimeout(resolve, 10));
  
    expect(handler).toHaveBeenCalledWith({ message: 'hello' });
  });
  

  it("should not publish if no handlers are subscribed", async () => {
    pubSub.publish("nonexistent-topic", { message: "no-subscribers" });

    (pubSub as any).registerExecution = vi.fn();
    expect((pubSub as any).registerExecution).not.toHaveBeenCalled();
  });

  it("should handle errors during handler execution", async () => {
    const onPublishError = vi.fn();
    const pubSubWithErrorHandling = new PubSub({ onPublishError, maxBatchTime: 0 });
    const handler = vi.fn().mockRejectedValue(new Error("Handler error"));

    pubSubWithErrorHandling.subscribe("test-topic", handler);
    pubSubWithErrorHandling.publish("test-topic", { message: "error" });
    await new Promise((resolve) => setTimeout(resolve, 10));

    expect(onPublishError).toHaveBeenCalledWith(expect.any(Error), {
      message: "error",
    });
  });

  it("should process handlers within maxBatchTime when publishing multiple events", async () => {
    const handler1 = vi.fn().mockResolvedValue(null);
    const handler2 = vi.fn().mockResolvedValue(null);
    const pubSubWithBatching = new PubSub({ maxBatchTime: 50 });

    pubSubWithBatching.subscribe("test-topic", handler1);
    pubSubWithBatching.subscribe("test-topic", handler2);

    const performanceNowMock = vi.spyOn(performance, "now").mockReturnValue(0);
    pubSubWithBatching.publish("test-topic", { message: "batch1" });

    performanceNowMock.mockReturnValue(60); // Simulate time passing beyond maxBatchTime
    pubSubWithBatching.publish("test-topic", { message: "batch2" });
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(handler1).toBeCalledWith({ message: "batch2" });
    expect(handler1).toHaveBeenCalledTimes(1);
    expect(handler2).toHaveBeenCalledTimes(1);
    performanceNowMock.mockRestore();
  });

  it("should get the current active topics", () => {
    const handler = vi.fn();
    pubSub.subscribe("test-topic-1", handler);
    pubSub.subscribe("test-topic-2", handler);

    const activeTopics = pubSub.getCurrentActiveTopics();
    expect(activeTopics).toEqual(["test-topic-1", "test-topic-2"]);
  });

  it("should return an empty list if there are no active topics", () => {
    const activeTopics = pubSub.getCurrentActiveTopics();
    expect(activeTopics).toEqual([]);
  });
});
