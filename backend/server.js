require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Conectar ao MongoDB (mesmo banco de dados que o backend de tarefas)
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("📦 Conectado ao MongoDB"))
  .catch((err) => console.error("Erro ao conectar ao MongoDB:", err));

// Modelo de Tarefa (mesmo modelo usado no backend de tarefas)
const TarefaSchema = new mongoose.Schema({
  nome: String,
  data: String,
  concluida: Boolean,
});

const Tarefa = mongoose.model("Tarefa", TarefaSchema);

// Rota para buscar as tarefas
app.get("/tarefas", async (req, res) => {
  try {
    const tarefas = await Tarefa.find();
    res.json(tarefas);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar tarefas" });
  }
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor de calendário rodando em http://localhost:${PORT}`);
});
