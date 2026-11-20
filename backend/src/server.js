import express from 'express';
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';

const app = express();
const PORT = 3000;

app.use(cors()); 
//Se eu tivesse o dominio oficial eu passaria ele aqui, para o Back só receber as requisições dele. 
app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'API online' });
});

app.use('/users', userRoutes);

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ error: 'JSON malformado na requisição.' });
  }
  next(err);
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});