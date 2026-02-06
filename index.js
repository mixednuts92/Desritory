import express from 'express';
import { createServer } from 'node:http';
import { uvPath } from '@titaniumnetwork-dev/ultraviolet';
import { epoxyPath } from '@mercuryworkshop/epoxy-transport';
import { baremuxPath } from '@mercuryworkshop/bare-mux/node';
import { join } from 'node:path';
import { hostname } from 'node:os';

const app = express();
const publicPath = 'public';

// Serve static files (your Desritory HTML)
app.use(express.static(publicPath));

// Serve Ultraviolet scripts
app.use('/uv/', express.static(uvPath));

// Serve Epoxy transport
app.use('/epoxy/', express.static(epoxyPath));

// Serve bare-mux
app.use('/baremux/', express.static(baremuxPath));

// Fallback to index.html
app.use((req, res) => {
  res.sendFile(join(process.cwd(), publicPath, 'index.html'));
});

const server = createServer(app);

const PORT = process.env.PORT || 8080;

server.on('request', (req, res) => {
  res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
});

server.on('listening', () => {
  const address = server.address();
  console.log(`Desritory + Ultraviolet running on:`);
  console.log(`- Local: http://localhost:${address.port}`);
  console.log(`- Network: http://${hostname()}:${address.port}`);
});

server.listen(PORT);
