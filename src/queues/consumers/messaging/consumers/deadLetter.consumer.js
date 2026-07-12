import { getRabbitChannel } from "../../../../config/rabbitmq.js";

const QUEUE_NAME = "dead.letter.queue";

export const startDeadLetterConsumer = async () => {
  const channel = getRabbitChannel();

  await channel.prefetch(1);

  channel.consume(QUEUE_NAME, async (msg) => {
    if (!msg) return;

    try {
      const payload = JSON.parse(msg.content.toString());
      const deathInfo = msg.properties.headers?.["x-death"]?.[0];

      console.error("[deadLetter.consumer] DEAD LETTER RECEIVED:", {
        originalQueue: deathInfo?.queue,
        exchange: deathInfo?.exchange,
        routingKeys: deathInfo?.["routing-keys"],
        reason: deathInfo?.reason,
        failCount: deathInfo?.count,
        payload,
      });

      // TODO: persist to a dead_letters table here (Layer 3 from earlier)
      // await db.query(`INSERT INTO dead_letters (...) VALUES (...)`, [...]);

      // TODO: alert ops here if this matters (Slack/PagerDuty/etc.)

      channel.ack(msg); // ack — you've now safely recorded the failure
    } catch (err) {
      // even the raw parse/logging failed — still ack to avoid infinite reprocessing,
      // but log the raw buffer so nothing is silently lost
      console.error("[deadLetter.consumer] failed to process dead letter itself:", err.message);
      console.error("[deadLetter.consumer] raw content:", msg.content.toString());
      channel.ack(msg);
    }
  });

  console.log(`[deadLetter.consumer] listening on "${QUEUE_NAME}"`);
};