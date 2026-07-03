const fs = require('fs');
const f = `./index.html`;
if(!fs.existsSync(f)) return res.status(404).send('Not found');
res.setHeader('Content-Type', 'text/html; charset=utf-8');
res.send(fs.readFileSync(f,'utf8'));
