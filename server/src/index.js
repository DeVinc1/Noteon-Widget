import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const application = express();

application.use(cors());
application.use(express.json());

const PORT = process.env.PORT;

application.get('/health-check', (request, response) => {
  return response.status(200).json({ message: 'Servidor está funcionando!' });
});

application.listen(PORT, () => {
  console.log(`Servidor hospedado na porta: ${PORT}!`);
});