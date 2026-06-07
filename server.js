const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const app = express();

app.use(cors()); // Permite que seu site no GitHub Pages fale com este servidor
app.use(express.json());

const HF_TOKEN = "SUA_NOVA_CHAVE_AQUI"; // Fica escondido no servidor

app.post('/analisar', async (req, res) => {
    try {
        const response = await fetch("https://api-inference.huggingface.co/models/Salesforce/blip-image-captioning-large", {
            method: "POST",
            headers: { "Authorization": `Bearer ${HF_TOKEN}`, "Content-Type": "application/json" },
            body: JSON.stringify(req.body)
        });
        const data = await response.json();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(3000, () => console.log("Servidor rodando!"));