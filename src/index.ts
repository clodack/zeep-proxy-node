import httpProxy from 'http-proxy';
import express from 'express';

import { injectEnvFiles } from './envs';

injectEnvFiles('.env', '');

const app = express();

const proxyMap = httpProxy.createProxyServer({ target: process.env.MAP_WS_URL, ws: true });
const server = require('http').createServer(app);

app.post('/map/*', function(req, res) {
  console.log("proxying POST request", req.url);
  proxyMap.web(req, res, {});
});

// @ts-ignore
server.on('upgrade', (req, socket, head) =>{
  console.log("proxying upgrade request", req.url);
  proxyMap.ws(req, socket, head);
});

server.listen(process.env?.SERVER_PORT ?? 8080, () => {
  console.log('server run in', process.env?.SERVER_PORT ?? 8080, 'port');
});
