import { getRabbitChannel } from "../../../../config/rabbitmq.js";


const QUEUE_NAME = "payment.process.queue";

export const startPaymentConsumer = async () => {
  const channel = getRabbitChannel();

  await channel.prefetch(1);

  channel.consume(QUEUE_NAME, async (msg) => {
    if (!msg) return;

    const routingKey = msg.fields.routingKey;

    try {
      const payload = JSON.parse(msg.content.toString());
      

      console.log(`[payment.consumer] received [${routingKey}]`, payload);
      handlePaymentProcessed(payload);

      channel.ack(msg);
    } catch (err) {
      console.error("[payment.consumer] failed:", err.message);
      channel.nack(msg, false, false); // goes to DLX if payment.process.queue has one configured
    }
  });

  console.log(`[payment .consumer] listening on "${QUEUE_NAME}"`);
};

const handlePaymentProcessed = async (payload) => {
  console.log("[payment.consumer] processing payment:", payload);
};
