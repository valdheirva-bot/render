const axios = require('axios');
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.post('/analisar', async (req, res) => {
    console.log("Token carregado:", process.env.HF_TOKEN ? "SIM" : "NÃO");
    
    if (!process.env.HF_TOKEN) {
        return res.status(500).json({ error: "Token não configurado" });
    }

    if (!req.body.inputs) {
        return res.status(400).json({ error: "Nenhuma imagem fornecida" });
    }

    try {
        console.log("Conectando via Axios...");
        const response = await axios.post(
            "https://api-inference.huggingface.co/models/Salesforce/blip-image-captioning-large",
            { inputs: req.body.inputs },
            {
                headers: { 
                    "Authorization": `Bearer ${process.env.HF_TOKEN}`,
                    "Content-Type": "application/json"
                },
                timeout: 10000 
            }
        );
        res.json(response.data);
    } catch (err) {
        console.error("Erro detalhado:", err.message);
        res.status(500).json({ error: "Falha na conexão: " + err.message });
    }
}); // <--- ESTA CHAVE FECHA O app.post

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
