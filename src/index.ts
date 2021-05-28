import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';
import fetch from 'node-fetch';
import { API_ENDPOINTS, __dev__ } from './constants';

dotenv.config();

const main = async () => {
  const { CMC_BASE_URL, CMC_API_KEY, PORT = 4000 } = process.env;
  const app = express();

  if (__dev__) {
    app.use(morgan('dev'));
  }

  app.use(cors());

  app.get('/', (_, res) => {
    res.json({
      endpoints: Object.values(API_ENDPOINTS).map((val) => `${val}/*`),
    });
  });

  for (const endpoint of Object.values(API_ENDPOINTS)) {
    app.get(`${endpoint}/*`, async (req, res) => {
      try {
        const CMC_URL = `${CMC_BASE_URL}${req.path}`;
        const response = await fetch(CMC_URL, {
          headers: { 'X-CMC_PRO_API_KEY': CMC_API_KEY! },
        }).then((r) => r.json());
        res.json(response);
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: err });
      }
    });
  }

  app.listen(PORT, () => console.log(`Server listening on port ${PORT}... 🚀`));
};

main().catch((err) => console.error(err));
