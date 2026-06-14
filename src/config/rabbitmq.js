import ampq from "amqplib";

let connection;
let channel;

export async function connectRabbitMQ() {
  if (connection) return connection;

  connection = await ampq.connect(
    process.env.RABBITMQ_URL || "amqp://localhost",
  );

  connection.on("error", (err) => {
    console.error("RabbitMQ connection error:", err);
    connection = null;
  });

  connection.on("close", () => {
    console.warn("RabbitMQ connection closed");
    connection = null;
  });

  // now create a channel

  channel = await connection.createChannel();

  console.log("RabbitMQ connection Established");

  return connection;
}

// fetch a channel
export function getRabbitChannel() {
  if (!channel) {
    throw new Error("RabbitMQ channel is not initialized");
  }

  return channel;
}
