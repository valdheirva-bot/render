const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.post('/analisar', async (req, res) => {
    try {
        // Log para ver se estamos recebendo a imagem corretamente
        if (!req.body.inputs) {
            return res.status(400).json({ error: "Nenhuma imagem recebida" });
        }

        const response = await fetch("https://api-inference.huggingface.co/models/Salesforce/blip-image-captioning-large", {
            method: "POST",
            headers: { 
                "Authorization": `Bearer ${process.env.HF_TOKEN}`, 
                "Content-Type": "application/json" 
            },
            body: JSON.stringify({ inputs: req.body.inputs })
        });

        const data = await response.json();
        
        // Se o Hugging Face retornar erro, repassamos para o front
        if (!response.ok) {
            console.error("Erro do Hugging Face:", data);
            return res.status(response.status).json(data);
        }

        res.json(data);
    } catch (err) {
        console.error("Erro interno do servidor:", err);
        res.status(500).json({ error: err.message });
    }
});

app.listen(process.env.PORT || 3000);
