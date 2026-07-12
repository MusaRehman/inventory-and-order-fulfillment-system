// import { getRabbitChannel } from "../../config/rabbitmq.js";

import { getRabbitChannel } from "../../../../config/rabbitmq.js";

const QUEUE_NAME = "order.update_inventory.queue";

export const startOrderUpdateConsumer = async () => {
  const channel = getRabbitChannel();

  await channel.prefetch(1);

  channel.consume(QUEUE_NAME, async (msg) => {
    if (!msg) return;

    const routingKey = msg.fields.routingKey;

    try {
      const payload = JSON.parse(msg.content.toString());

      console.log(`[order.consumer] received [${routingKey}]`, payload);

      switch (routingKey) {
        case "order.created":
          await handleOrderCreated(payload);
          break;

        case "order.update_inventory":
          await handleOrderUpdated(payload);
          break;

        default:
          console.warn(`[order.consumer] unhandled routing key: ${routingKey}`);
      }

      channel.ack(msg);
    } catch (err) {
      console.error("[order.consumer] failed:", err.message);
      channel.nack(msg, false, false); // goes to DLX if order.queue has one configured
    }
  });

  console.log(`[order.consumer] listening on "${QUEUE_NAME}"`);
};

const handleOrderCreated = async (payload) => {
  console.log("[order.consumer] handling order.created:", payload);
};

const handleOrderUpdated = async (payload) => {
  console.log("[order.consumer] handling update_inventory:", payload);
  
};
