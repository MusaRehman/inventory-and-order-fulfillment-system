import { connectRabbitMQ, getRabbitChannel } from "./rabbitmq.js";

export const setupTopology = async () => {
  let channel;

  try {
     await connectRabbitMQ();
     const channel = getRabbitChannel();

    await channel.assertExchange("app.exchange", "direct", { durable: true });
    await channel.assertExchange("dead.exchange", "direct", { durable: true });

    await channel.assertQueue("payment.process.queue", {
      durable: true,
      arguments: {
        "x-dead-letter-exchange": "dead.exchange",
        "x-dead-letter-routing-key": "dead.letter",
      },
    });

    await channel.assertQueue("payment.completed.queue", { durable: true });
    await channel.assertQueue("payment.failed.queue", { durable: true });

    await channel.assertQueue("fulfillment.queue", { durable: true }); 

    await channel.assertQueue("dead.letter.queue", { durable: true });

    await channel.assertQueue("order.queue", { durable: true });

    await channel.assertQueue("order.update_inventory.queue", { durable: true });

    // bindings

    
    await channel.bindQueue("order.queue", "app.exchange", "order.created");
    
    await channel.bindQueue("payment.process.queue", "app.exchange", "payment.process");
    
    await channel.bindQueue("payment.completed.queue", "app.exchange", "payment.completed");
    
    await channel.bindQueue("payment.failed.queue", "app.exchange", "payment.failed");
    
    await channel.bindQueue("fulfillment.queue", "app.exchange", "fulfillment.process");
    
    await channel.bindQueue("fulfillment.queue", "app.exchange", "fulfillment.completed");
    
    await channel.bindQueue("order.update_inventory.queue", "app.exchange", "order.update_inventory");

    await channel.bindQueue("dead.letter.queue", "dead.exchange", "dead.letter");

    console.log("RabbitMQ topology setup completed");
  } catch (error) {
    console.error("Error setting up RabbitMQ topology:", error);
    process.exit(1);
  }
};