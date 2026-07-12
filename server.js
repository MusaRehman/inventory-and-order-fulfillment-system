import app from "./src/app.js";
import { connectDB } from "./src/config/database.js";
import { setupTopology } from "./src/config/rabbitmq-topology.js";
import { connectRabbitMQ } from "./src/config/rabbitmq.js";
import { db } from "./src/models/index.js";
import { startConsumer } from "./src/queues/consumers/worker.js";

const PORT = process.env.PORT || 3000;

(async () => {
  await connectDB();
    await connectRabbitMQ();
    await setupTopology();
  await startConsumer();

  await db.sequelize.sync({ alter: true });

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
})();
