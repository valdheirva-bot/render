const axios = require('axios');
const express = require('express');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.post('/analisar', async (req, res) => {
console.log("Token carregado:", process.env.HF_TOKEN ? "SIM" : "NÃO");
    if (!process.env.HF_TOKEN) {
        return res.status(500).json({ error: "Token não configurado no servidor" });
    }
    console.log("Recebendo requisição de análise..."); // Isso aparecerá no Log do Render

    if (!req.body.inputs) {
        console.error("Erro: Nenhum input de imagem recebido.");
        return res.status(400).json({ error: "Nenhuma imagem fornecida" });
    }

try {
    console.log("Tentando conexão com Hugging Face via Axios...");
    
    const response = await axios.post(
        "https://api-inference.huggingface.co/models/Salesforce/blip-image-captioning-large",
        { inputs: req.body.inputs },
        {
            headers: { 
                "Authorization": `Bearer ${process.env.HF_TOKEN}`,
                "Content-Type": "application/json"
            },
            timeout: 10000 // Timeout de 10 segundos
        }
    );

    res.json(response.data);
} catch (err) {
    console.error("Erro detalhado:", err.message);
    if (err.response) {
        console.error("Dados do erro:", err.response.data);
    }
    res.status(500).json({ error: "Falha na conexão com IA: " + err.message });
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
