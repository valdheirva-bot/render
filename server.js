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
        const response = await fetch("https://api-inference.huggingface.co/models/Salesforce/blip-image-captioning-large", {
    method: "POST",
    headers: { 
        "Authorization": `Bearer ${process.env.HF_TOKEN}`,
        "Content-Type": "application/json" 
    },
    body: JSON.stringify({ inputs: req.body.inputs })
});

        const data = await response.json();
        
        if (!response.ok) {
            console.error("Erro do Hugging Face:", data);
            return res.status(response.status).json(data);
        }

        res.json(data);
    } catch (err) {
        console.error("Erro interno:", err);
        res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
