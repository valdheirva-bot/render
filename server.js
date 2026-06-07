const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Inicializa o Gemini com a chave que está nas suas Environment Variables do Render
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/analisar', async (req, res) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const base64Image = req.body.inputs;

        // Formata a requisição para o Gemini
        const result = await model.generateContent([
            "Identifique o nome do produto nesta foto. Retorne apenas o nome do produto.",
            { inlineData: { data: base64Image, mimeType: "image/jpeg" } }
        ]);
        
        const respostaTexto = result.response.text().trim();
        console.log("IA identificou:", respostaTexto);
        
        res.json({ descricao: respostaTexto });
    } catch (err) {
        console.error("Erro na IA:", err.message);
        res.status(500).json({ error: "Erro ao processar imagem: " + err.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
