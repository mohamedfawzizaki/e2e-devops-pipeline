const express = require('express');
const mysql = require('mysql2/promise');
const redis = require('redis');
const os = require('os');

const app = express();
const port = process.env.PORT || 3000;

const redisClient = redis.createClient({
  socket: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379
  },
  password: process.env.REDIS_PASSWORD || '1234'
});

redisClient.on('error', err => console.error('Redis error:', err));
redisClient.connect();

app.get('/', (req, res) => {
  res.status(200).send('OK');  // MUST return 200 for the probes
});

app.get('/api/test-react-nginx', (req, res) => {
  res.json({ message: 'React-Nginx is working!', host: os.hostname() });
});

app.get('/api/test-proxy', (req, res) => {
  res.json({ message: 'Proxy reached this backend!', host: os.hostname() });
});

app.get('/api/test-express', (req, res) => {
  res.json({ message: 'Express server is running!', host: os.hostname() });
});

app.get('/api/test-mysql', async (req, res) => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST || 'localhost',
      port: process.env.MYSQL_PORT || '3306',
      database: process.env.MYSQL_DB || 'my_db',
      user: process.env.MYSQL_USER || 'root',
      password: process.env.MYSQL_PASSWORD || 'root',

    });

    const [rows] = await connection.execute('SELECT NOW() AS now');
    await connection.end();

    res.json({ message: 'MySQL connected', now: rows[0].now });
  } catch (err) {
    res.status(500).json({ error: 'MySQL connection failed', details: err.message });
  }
});

app.get('/api/test-redis', async (req, res) => {
  try {
    await redisClient.set('healthcheck', 'ok');
    const value = await redisClient.get('healthcheck');
    res.json({ message: 'Redis connected', value });
  } catch (err) {
    res.status(500).json({ error: 'Redis connection failed', details: err.message });
  }
});

let fetch;
(async () => {
  fetch = (await import('node-fetch')).default;
})();

app.get('/api/test-phpmyadmin', async (req, res) => {
  const phpmyadminUrl = process.env.PHPMYADMIN_URL || 'http://phpmyadmin:80';
  const phpmyadminUrlFromHost = process.env.PHPMYADMIN_URL_FROM_HOST || 'http://localhost:8080';

  try {
    const response = await fetch(phpmyadminUrl);
    const isOk = response.ok;

    res.json({
      message: isOk
        ? `phpMyAdmin is accessible via :  ${phpmyadminUrlFromHost} from host, and via ${phpmyadminUrl} from Docker network`
        : 'phpMyAdmin responded but not OK',
      status: response.status,
      host: os.hostname()
    });
  } catch (err) {
    res.status(500).json({
      error: 'phpMyAdmin not accessible',
      details: err.message
    });
  }
});
// app.listen(port, () => {
//   console.log(`API server listening at http://localhost:${port}`);
// });

app.listen(port, '0.0.0.0', () => {
  console.log(`API server listening on port ${port}`);
});



