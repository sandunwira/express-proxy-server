const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// Use cors middleware and allow all origins
app.use(cors());

// Rest of your code...

app.use('/', (req, res, next) => {
  // Extract the target from the request path and decode it
  const target = decodeURIComponent(req.path.slice(1));

  // Check if the target is a valid URL
  try {
    new URL(target);
  } catch (err) {
    // If the target is not a valid URL, send an error response
    res.status(400).send('Invalid target URL');
    return;
  }
  
  // Create a new proxy middleware for this request
  const proxyMiddleware = createProxyMiddleware({
    target,
    changeOrigin: true,
    ws: true,
    pathRewrite: {
      // Remove the target from the path
      [`^/${encodeURIComponent(target)}`]: '/',
    },
    router: {
      // Use the target as the new host for this request
      '*': target,
    },
  });

  // Use the proxy middleware
  proxyMiddleware(req, res, next);
});

app.listen(3000, () => {
  console.log('Proxy server is running on http://localhost:3000');
});