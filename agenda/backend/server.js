require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;


app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("📦 Conectado ao MongoDB"))
  .catch((err) => console.error("Erro ao conectar ao MongoDB:", err));

const TarefaSchema = new mongoose.Schema({
  nome: String,
  data: String,
  concluida: Boolean,
});

const Tarefa = mongoose.model("Tarefa", TarefaSchema);


app.get("/tarefas", async (req, res) => {
  try {
    const tarefas = await Tarefa.find();
    res.json(tarefas);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar tarefas" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor de calendário rodando em http://localhost:${PORT}`);
});
