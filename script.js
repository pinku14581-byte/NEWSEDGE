const stories=[
["ODISHA","Odisha developments at a glance","A demo local-news card ready for your verified report.","12 min ago"],
["INDIA","What is shaping the national conversation?","Put the essential facts and context in a concise national report.","27 min ago"],
["LEGAL","Law & Justice: important developments","Use this space for judgments, legislation and legal analysis.","43 min ago"],
["WEATHER","Weather desk: today's outlook","Add verified observations and clearly labelled forecasts.","1 hr ago"],
["SPORTS","Sports round-up","Scores, fixtures, results and analysis in one place.","2 hrs ago"],
["ENTERTAINMENT","Bollywood X-Rays: beyond the glamour","Film, celebrity and industry stories with context.","3 hrs ago"]
];
const grid=document.getElementById("stories");
grid.innerHTML=stories.map((s,i)=>`<article class="news-card"><div class="news-img">${s[0]}</div><div class="content"><span class="pill">${s[0]}</span><h3>${s[1]}</h3><p>${s[2]}</p><div class="meta">NEWSEDGE • ${s[3]}</div></div></article>`).join("");
document.getElementById("date").textContent=new Date().toLocaleDateString("en-IN",{day:"numeric",month:"long",year:"numeric"});
document.getElementById("year").textContent=new Date().getFullYear();

const tickers=["NEWSEDGE — News beyond the headlines.","Odisha: latest verified developments.","Legal Desk: law, justice and judgments.","Weather Desk: observations first, forecasts clearly labelled.","Entertainment: Bollywood beyond the glamour."];
let ti=0;setInterval(()=>{ti=(ti+1)%tickers.length;document.getElementById("ticker").textContent=tickers[ti]},3500);

document.getElementById("menuBtn").onclick=()=>{const n=document.getElementById("nav");n.style.display=n.style.display==="flex"?"none":"flex"};
const modal=document.getElementById("searchModal");
document.getElementById("searchBtn").onclick=()=>{modal.style.display="block";document.getElementById("searchInput").focus()};
document.getElementById("closeSearch").onclick=()=>modal.style.display="none";
document.getElementById("searchInput").oninput=(e)=>{
 const q=e.target.value.toLowerCase();
 const matches=stories.filter(s=>s.join(" ").toLowerCase().includes(q));
 document.getElementById("searchResults").innerHTML=q?matches.map(s=>`<div class="result"><b>${s[1]}</b><span>${s[0]} • ${s[3]}</span></div>`).join(""):"";
};
function subscribe(e){e.preventDefault();alert("Demo only: connect this form to an email service when you publish.");}
