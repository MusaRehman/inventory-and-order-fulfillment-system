// worker.js — consumers only, this is what your Dockerfile CMD runs for the "worker" service
import { connectRabbitMQ } from "../../config/rabbitmq.js";

import { startOrderConsumer } from "./messaging/consumers/order.consumer.js";
import { startPaymentConsumer } from "./messaging/consumers/paymentProcess.consumer.js";
import { startDeadLetterConsumer } from "./messaging/consumers/deadLetter.consumer.js";
import { startOrderUpdateConsumer } from "./messaging/consumers/order.update.consumer.js";

const start = async () => {
  await connectRabbitMQ();
  await startOrderConsumer();
  await startPaymentConsumer();
  await startOrderUpdateConsumer();
  await startDeadLetterConsumer();
  console.log("All workers running");
};
export const startConsumer = start;