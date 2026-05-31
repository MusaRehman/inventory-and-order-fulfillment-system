import { sequelize } from "../config/database.js";
import createUser from "./users.js";

const User = createUser(sequelize);

export const db = {
  sequelize,
  User,
};