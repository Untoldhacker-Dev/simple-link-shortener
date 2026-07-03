const { getConfigValue } = require('./config');
const db = new Disk('shortlinks');
const slug = req.path.replace(/^\/go\/?/,'').split('/')[0];

if(!slug){
  res.setHeader('Location','/');
  return res.status(302).end();
}

const links = db.get('links')||{};
const link = links[slug];

if(!link){
  const accent = getConfigValue('accent', '#6366f1');
  const notFoundPage = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Not Found</title></head><body style="font-family:system-ui;text-align:center;padding:4rem;color:#64748b"><h2>Link not found</h2><p><a href="/" style="color:${accent}">Go home</a></p></body></html>`;
  res.status(404).send(notFoundPage);
  return;
}

link.hits=(link.hits||0)+1;
links[slug]=link;
db.set('links',links);

res.setHeader('Location', link.url);
res.status(301).end();
