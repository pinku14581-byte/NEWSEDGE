import express from 'express';
import {readDB,writeDB} from './db.js';
import {spawn} from 'node:child_process';
const app=express();
const PORT=process.env.PORT||3000;
const SITE_URL=(process.env.SITE_URL||`http://localhost:${PORT}`).replace(/\/$/,'');
app.use(express.json({limit:'100kb'}));
app.use(express.static('public'));

function cleanText(s=''){return String(s).replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim()}
function slug(s=''){return cleanText(s).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,90)}
function runFetch(){return new Promise((resolve,reject)=>{const p=spawn(process.execPath,['fetch.js'],{stdio:'inherit'});p.on('close',c=>c===0?resolve():reject(new Error(`fetch exited ${c}`)));})}

app.get('/api/news',async(req,res)=>{
  const db=await readDB();let items=db.items||[];const c=req.query.category;
  if(c&&c!=='All')items=items.filter(x=>x.category.toLowerCase()===String(c).toLowerCase());
  if(req.query.status)items=items.filter(x=>x.status===req.query.status);
  if(req.query.published==='true')items=items.filter(x=>x.published);
  const q=cleanText(req.query.q||'').toLowerCase();if(q)items=items.filter(x=>`${x.title} ${x.snippet} ${x.source}`.toLowerCase().includes(q));
  const limit=Math.min(Number(req.query.limit)||100,500);res.json({updatedAt:db.updatedAt,items:items.slice(0,limit)});
});
app.get('/api/categories',async(_,res)=>{const db=await readDB();res.json([...new Set((db.items||[]).map(x=>x.category))].sort())});
app.get('/api/health',async(_,res)=>{const db=await readDB();res.json({ok:true,time:new Date().toISOString(),updatedAt:db.updatedAt,count:db.items?.length||0})});
app.post('/api/fetch',async(_,res)=>{try{await runFetch();res.json({ok:true})}catch(e){res.status(500).json({ok:false,error:e.message})}});
app.patch('/api/news/:id',async(req,res)=>{const db=await readDB();const item=db.items.find(x=>x.id===req.params.id);if(!item)return res.status(404).json({error:'Not found'});
  const allowed=['status','published','summary','title','category'];for(const k of allowed)if(req.body[k]!==undefined)item[k]=req.body[k];item.updatedAt=new Date().toISOString();await writeDB(db);res.json(item);
});
app.get('/news/:id',async(req,res)=>{const db=await readDB();const item=db.items.find(x=>x.id===req.params.id);if(!item)return res.status(404).send('Not found');res.send(renderArticle(item));});
app.get('/sitemap.xml',async(_,res)=>{const db=await readDB();const urls=(db.items||[]).filter(x=>x.published).slice(0,500).map(x=>`<url><loc>${SITE_URL}/news/${encodeURIComponent(x.id)}</loc><lastmod>${new Date(x.updatedAt||x.date).toISOString()}</lastmod></url>`).join('');res.type('application/xml').send(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${SITE_URL}/</loc></url>${urls}</urlset>`)});

function renderArticle(x){const title=escape(x.title),desc=escape(x.summary||x.snippet||'');return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title} — NEWSEDGE</title><meta name="description" content="${desc}"><meta property="og:title" content="${title}"><meta property="og:description" content="${desc}"><link rel="canonical" href="${SITE_URL}/news/${encodeURIComponent(x.id)}"><style>body{font-family:system-ui;margin:0;background:#f5f7fa;color:#111827}.wrap{max-width:800px;margin:auto;padding:24px 18px}.brand{font-weight:900;margin-bottom:50px}.brand b{background:#111;color:#fff;padding:4px}.tag{color:#d11;font-weight:800;font-size:12px;text-transform:uppercase}h1{font-size:clamp(30px,6vw,54px);line-height:1.05}.box{background:#fff;border:1px solid #e5e7eb;border-radius:16px;padding:22px}.source{color:#667085;font-size:13px}.back{display:inline-block;margin-top:25px;color:#d11;font-weight:800}</style></head><body><main class="wrap"><div class="brand"><span>NEWS</span><b>EDGE</b></div><div class="box"><div class="tag">${escape(x.category)} · ${escape(x.source)}</div><h1>${title}</h1><p class="source">${new Date(x.date).toLocaleString()}</p><p>${desc}</p><p><a href="${escape(x.url)}" target="_blank" rel="noopener noreferrer">Read the original source →</a></p><a class="back" href="/">← NEWSEDGE</a></div></main></body></html>`}
function escape(s=''){return String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}

app.listen(PORT,()=>console.log(`NEWSEDGE running on ${SITE_URL}`));
setInterval(()=>runFetch().catch(e=>console.error('Scheduled fetch failed:',e.message)),15*60*1000);
