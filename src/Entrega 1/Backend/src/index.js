import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import sequelize from "./config/database.js";
dotenv.config();

const app = express();
app.use(express.json());

app.use("/auth", authRoutes);

const PORT = process.env.PORT || 3000;

sequelize.sync({ alter: true }).then(() => {
  app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
});
