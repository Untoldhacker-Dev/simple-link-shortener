const crypto = require('crypto');
const { getConfigValue } = require('./config');
const db = new Disk('shortlinks');
const seg = req.path.replace(/^\/api\/?/,'').split('/');
const action = req.query.action || seg[0] || '';
const tok = req.headers['x-admin-token'] || '';

function hash(s){return crypto.createHash('sha256').update(s).digest('hex');}
function isAdmin(){return !!tok && tok === db.get('admin_token');}
function getLinks(){return db.get('links')||{};}
function saveLinks(l){db.set('links',l);}
function getAdminPassword(){return getConfigValue('admin_password','changeme');}

const expectedAdminHash = hash(getAdminPassword());
if(!db.get('admin_pass') || db.get('admin_pass') !== expectedAdminHash){
  db.set('admin_pass', expectedAdminHash);
}

if(action==='login' && req.method==='POST'){
  const {password}=req.body||{};
  if(hash(password||'')!==expectedAdminHash) return res.status(401).json({error:'Wrong password'});
  const t=crypto.randomBytes(24).toString('hex');
  db.set('admin_token',t);
  return res.json({token:t});
}

if(action==='frontend'){
  return res.json({
    site_title: getConfigValue('site_title','Short Links'),
    accent: getConfigValue('accent','#6366f1'),
    mode: getConfigValue('mode','public')
  });
}

if(action==='public'){
  const links=getLinks();
  return res.json({links:Object.values(links).filter(l=>l.visibility==='public').map(l=>({slug:l.slug,hits:l.hits||0}))});
}

if(action==='all'){
  if(!isAdmin()) return res.status(403).json({error:'Forbidden'});
  return res.json({links:Object.values(getLinks())});
}

if(action==='add' && req.method==='POST'){
  if(!isAdmin()) return res.status(403).json({error:'Forbidden'});
  const {slug,url,title,visibility}=req.body||{};
  if(!slug||!url) return res.status(400).json({error:'Slug and URL required'});
  if(!/^[a-zA-Z0-9_-]{1,50}$/.test(slug)) return res.status(400).json({error:'Slug: letters, numbers, - _ only, max 50'});
  const links=getLinks();
  if(links[slug]) return res.status(400).json({error:'Slug already exists'});
  if(!url.startsWith('http://') && !url.startsWith('https://')) return res.status(400).json({error:'URL must start with http:// or https://'});
  links[slug]={slug,url,title:title||'',visibility:visibility||'private',hits:0,created:Date.now()};
  saveLinks(links);
  return res.json({ok:true});
}

if(action==='delete' && req.method==='POST'){
  if(!isAdmin()) return res.status(403).json({error:'Forbidden'});
  const {slug}=req.body||{};
  const links=getLinks();
  delete links[slug];
  saveLinks(links);
  return res.json({ok:true});
}

res.status(404).json({error:'Not found'});
