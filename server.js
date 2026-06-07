const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/analisar', async (req, res) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const base64Image = req.body.inputs;

        const result = await model.generateContent([
            "Identifique o nome do produto nesta foto. Retorne apenas o nome do produto de forma curta.",
            { inlineData: { data: base64Image, mimeType: "image/jpeg" } }
        ]);
        
        res.json({ descricao: result.response.text().trim() });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
