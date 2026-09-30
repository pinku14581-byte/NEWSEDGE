import fs from 'node:fs/promises';
import Parser from 'rss-parser';
import {readDB,writeDB,normalizeItem} from './db.js';
const parser=new Parser({timeout:10000,headers:{'User-Agent':'NEWSEDGE-NewsEngine/0.4'}});
const feeds=JSON.parse(await fs.readFile('./feeds.json','utf8'));
const old=await readDB();
const map=new Map((old.items||[]).map(x=>[x.id,normalizeItem(x)]));
for(const feed of feeds){
  try{
    const data=await parser.parseURL(feed.url);
    for(const item of (data.items||[]).slice(0,50)){
      const id=item.guid||item.id||item.link;if(!id)continue;
      const existing=map.get(id);
      const snippet=(item.contentSnippet||item.content||item.summary||'').replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim().slice(0,320);
      map.set(id,normalizeItem({
        ...(existing||{}),id,title:item.title||'Untitled',source:feed.name,date:item.isoDate||item.pubDate||new Date().toISOString(),category:feed.category,url:item.link||'',snippet,
        image:item.enclosure?.url||existing?.image||null,
        fetchedAt:new Date().toISOString()
      }));
    }
  }catch(e){console.error(`Feed failed: ${feed.name}: ${e.message}`)}
}
const items=[...map.values()].sort((a,b)=>new Date(b.date)-new Date(a.date)).slice(0,1000);
await writeDB({updatedAt:new Date().toISOString(),items});
console.log(`Stored ${items.length} items.`);
