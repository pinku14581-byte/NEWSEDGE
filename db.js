import fs from 'node:fs/promises';
const FILE='./data.json';
const empty={updatedAt:null,items:[]};
export async function readDB(){try{return JSON.parse(await fs.readFile(FILE,'utf8'));}catch{return structuredClone(empty)}}
export async function writeDB(db){await fs.writeFile(FILE,JSON.stringify(db,null,2));}
export function normalizeItem(item){return {...item,status:item.status||'pending',published:item.published??false,summary:item.summary||item.snippet||''};}
