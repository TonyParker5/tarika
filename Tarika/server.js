/* eslint-disable no-undef */
import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';

const app = express();
app.use(cors());
app.use(express.json());

// DB path: allow override via env (Render -> Environment -> DB_PATH)
// default: project ./databases/comments.json
const DB = process.env.DB_PATH
  ? path.resolve(process.env.DB_PATH)
  : path.join(process.cwd(), 'databases', 'comments.json');

const readComments = () => JSON.parse(fs.readFileSync(DB, 'utf8') || '[]');
const writeComments = (d) => fs.writeFileSync(DB, JSON.stringify(d, null, 2));

// API routes (example)
app.get('/api/comments', (req, res) => res.json(readComments()));
app.post('/api/comments', (req, res) => {
  const { text } = req.body; if (!text) return res.status(400).json({ error: 'Empty' });
  const item = { id: Date.now(), text: text.trim(), createdAt: new Date().toISOString() };
  const list = readComments(); list.unshift(item); writeComments(list);
  res.status(201).json(item);
});
app.delete('/api/comments/:id', (req, res) => {
  const id = Number(req.params.id); const list = readComments().filter(c => c.id !== id);
  writeComments(list); res.json({ success: true });
});

const possibleBuildDirs = [path.join(process.cwd(), 'dist'), path.join(process.cwd(), 'build')];
const buildDir = possibleBuildDirs.find(d => fs.existsSync(d));

// serve static if build exists
if (buildDir) {
  app.use(express.static(buildDir));
  app.get(/^\/(?!api).*/, (req, res) => {
    const index = path.join(buildDir, 'index.html');
    if (fs.existsSync(index)) return res.sendFile(index);
    return res.status(404).send('index.html not found');
  });
} else {
  // no frontend build available
  app.get(/^\/(?!api).*/, (req, res) => res.status(404).send('No frontend build found'));
}

const port = process.env.PORT || 5173;
app.listen(port, () => console.log(`Server listening on ${port}`));

// curl https://your-service.onrender.com/api/comments