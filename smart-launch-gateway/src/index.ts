import express from 'express';
import { config } from './config';
import { smartAuthorize } from './routes/smartAuthorize';
import { smartCallback } from './routes/smartCallback';

const app = express();
app.use(express.json({ limit: '1mb' }));

app.get('/healthz', (_req, res) => res.status(200).send('ok'));

// SMART Launch endpoints
app.get('/smart/authorize', smartAuthorize);
app.get('/smart/callback', smartCallback);

app.listen(config.port, () => {
  // eslint-disable-next-line no-console
  console.log(`[smart-launch-gateway] listening on :${config.port}`);
});
