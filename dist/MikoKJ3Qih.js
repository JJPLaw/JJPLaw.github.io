import*as d3 from"https://cdn.jsdelivr.net/npm/d3@7/+esm";import{DateTime}from"https://cdn.jsdelivr.net/npm/luxon@3.5.0/+esm";let window450=window.matchMedia("(max-width: 450px)").matches,fontSize=+window.getComputedStyle(document.documentElement).fontSize.replace("px",""),heroSize=window450?3.125*fontSize*.68:3.125*fontSize,heroCentre=.5*heroSize,heroSpacing=+heroSize,heroDateSize=window450?5.625*fontSize*.68:5.625*fontSize,width=window450?450:1500,height=window450?1100:730,cW=.5*width,cH=.5*height,diamondW=window450?450:1100,diamondH=window450?690:720,diamondYOff=window450?1.1*heroDateSize:5,cDiamondX=.5*diamondW,cDiamondY=.5*diamondH+diamondYOff,marginLeft=0,conv=window450?.0046:.003,cX=cDiamondX*conv,cY=-cDiamondY*conv,palette={"1_0":"#FFFFFF","1_1":"#D1EEEA","1_2":"#8DC9CD","1_3":"#67AAB7","1_4":"#4E8FA5","1_5":"#407A95","1_6":"#366B87","1_7":"#30607E","1_8":"#2A5674","2_0":"#FFFFFF","2_1":"#C7E5BE","2_2":"#73C49C","2_3":"#4BA28E","2_4":"#348781","2_5":"#267374","2_6":"#1E646A","2_7":"#195A63","2_8":"#14505C","3_0":"#FFFFFF","3_1":"#B7F1B2","3_2":"#62DEAD","3_3":"#2CC5AF","3_4":"#07AFAB","3_5":"#009FA6","3_6":"#0391A0","3_7":"#0D889C","3_8":"#177F97","4_0":"#FFFFFF","4_1":"#EDEF5C","4_2":"#72C570","4_3":"#16A67E","4_4":"#018C7F","4_5":"#00787B","4_6":"#0E6A75","4_7":"#1B606F","4_8":"#255668","5_0":"#FFFFFF","5_1":"#F3CBD3","5_2":"#E08FB0","5_3":"#C9689C","5_4":"#AF4D8D","5_5":"#993B81","5_6":"#872F77","5_7":"#79286F","5_8":"#6C2167","6_0":"#FFFFFF","6_1":"#F6D2A9","6_2":"#F1A280","6_3":"#E98071","6_4":"#DC676C","6_5":"#CF5868","6_6":"#C24D66","6_7":"#BA4665","6_8":"#B13F64","7_0":"#FFFFFF","7_1":"#FCDE9C","7_2":"#F27F6F","7_3":"#E34E6F","7_4":"#D73876","7_5":"#C22A79","7_6":"#A72376","7_7":"#921F73","7_8":"#7C1D6F","8_0":"#FFFFFF","8_1":"#AEB6E5","8_2":"#B68DD1","8_3":"#BC6DB8","8_4":"#BC569D","8_5":"#B94686","8_6":"#B33B72","8_7":"#AF3663","8_8":"#A93154"},orange="#f08637",years=["2018","2019","2020","2021","2022","2023","2024"],mainX=d3.scaleLinear().domain([0,width*conv]).range([0,width]),mainY=d3.scaleLinear().domain([0,height*-conv]).range([0,height]);function getOrdinal(t){return"1"===t||"21"===t||"31"===t?"st":"2"===t||"22"===t?"nd":"3"===t||"23"===t?"rd":"th"}function daysInMonth(t,e){return new Date(e,t,0).getDate()}function drawFlower(t,e,a){let n,r,o;"main"===a&&(n=mainX,r=mainY,o=marginLeft);a=e.append("g").attr("class","flowers").selectAll("g").data(t).join("g").attr("class","flower").attr("id",t=>t.id);a.append("g").attr("class","petals").selectAll("ellipse").data(t=>t.petals).join("ellipse").attr("class","petal").attr("id",t=>"p"+t.date).attr("rx",t=>n(t.rx)).attr("ry",t=>-1*r(t.ry)).attr("cx",t=>n(t.x0)+o).attr("cy",t=>r(t.y0)).attr("transform",t=>`rotate(${180*(t.angleJS+Math.PI/2)/Math.PI} ${n(t.x0)+o} ${r(t.y0)})`).style("fill",t=>palette[t.palette]).style("fill-opacity",.85).style("stroke",t=>palette[t.palette]).style("stroke-width",n(.006)+"pt"),a.append("circle").attr("cx",t=>n(t.x)+o).attr("cy",t=>r(t.y)).attr("r",n(.045)).style("fill",t=>palette[t.centre_fill]).style("stroke",t=>palette[t.centre_col]).style("stroke-width",n(.006)+"pt")}function reCentre(t,e,a=!1){let n;(n=e?[structuredClone(t[t.findIndex(t=>t.id===e)])]:[structuredClone(t)])[0].x=cX,n[0].y=cY;for(let e=0;e<n.length;e++){n[e].centre_col=a?n[e].centre_col.replace(/\d_/,"4_"):n[e].centre_col,n[e].centre_fill=a?n[e].centre_fill.replace(/\d_/,"4_"):n[e].centre_fill;for(let t=0;t<n[e].petals.length;t++)n[e].petals[t].x0=n[e].x+n[e].petals[t].logCount*Math.cos(-1*n[e].petals[t].angle),n[e].petals[t].y0=n[e].y-n[e].petals[t].logCount*Math.sin(-1*n[e].petals[t].angle),n[e].petals[t].palette=a?n[e].petals[t].palette.replace(/\d_/,"4_"):n[e].petals[t].palette}return n}function generateDate(a){let e=DateTime.local({locale:"en-GB"});var n=[];for(let e=0;e<a.length;e++)for(let t=0;t<a[e].petals.length;t++)n.push(a[e].petals[t].date);let t=n.filter(t=>t.includes(e.toFormat("LL-dd"))),r=1;for(;0==t.length;)t=n.filter(t=>t.includes(e.plus({days:r}).toFormat("LL-dd"))),r++;var o=DateTime.fromFormat(t[Math.floor(Math.random()*t.length)],"yyyy-MM-dd");return{date:o,id:o.toFormat("LLL_yyyy"),day:o.toFormat("dd"),stringDate:o.toFormat("yyyy-LL-dd")}}function intersection(t,e,a,n,r,o,i,l){var s={};return s.x2=((t*n-e*a)*(r-i)-(r*l-o*i)*(t-a))/((t-a)*(o-l)-(e-n)*(r-i)),s.y2=((t*n-e*a)*(o-l)-(r*l-o*i)*(e-n))/((t-a)*(o-l)-(e-n)*(r-i)),s}function radialLines(d,t){let h=daysInMonth(d.date.month,d.date.year);t.select(".petals").append("g").attr("class","radial").selectAll("polygon").data(t=>{var a,n=t.petals[0].palette.replace(/_\d/,"_1");for(let e=0;e<h;e++)a=-1*(2*e*Math.PI/h-Math.PI/2),-1===t.petals.findIndex(t=>t.day===e+1)&&t.petals.push({angle:a,logCount:.0225,date:"0",palette:n});return t.petals}).join("polygon").attr("points",e=>{var a=e.date===d.stringDate?.19:.1,n=Math.PI/h*.25,r={a:{x:cDiamondX,y:diamondYOff},b:{x:diamondW,y:cDiamondY},c:{x:cDiamondX,y:diamondYOff+diamondH},d:{x:0,y:cDiamondY}};let o=-1*e.angle-n;var i,l=[],s=[];for(let t=0;t<3;t++)o<.5*-Math.PI?o+=2*Math.PI:1.5*Math.PI<=o&&(o-=2*Math.PI),i=2*e.logCount+a,s[t]={x1:mainX(cX+i*Math.cos(o)),y1:mainY(cY-i*Math.sin(o)),x3:mainX(cX+cX*Math.cos(o)),y3:mainY(cY-cX*Math.sin(o))},.5*-Math.PI<=o&&o<0?(l[0]=r.a,l[1]=r.b):0<=o&&o<.5*Math.PI?(l[0]=r.b,l[1]=r.c):.5*Math.PI<=o&&o<Math.PI?(l[0]=r.c,l[1]=r.d):Math.PI<=o&&o<1.5*Math.PI&&(l[0]=r.d,l[1]=r.a),i=intersection(s[t].x1,s[t].y1,s[t].x3,s[t].y3,l[0].x,l[0].y,l[1].x,l[1].y),s[t]={...s[t],...i},o+=n;return`${s[1].x1},${s[1].y1} ${s[0].x2},${s[0].y2} ${s[1].x2},${s[1].y2} ${s[2].x2},`+s[2].y2}).style("stroke-width",t=>"0"===t.date?"2px":"3px").style("opacity",t=>"0"===t.date?.5:1).style("stroke",t=>t.date===d.stringDate?orange:palette[t.palette]).style("fill",t=>t.date===d.stringDate?orange:palette[t.palette]).style("fill-opacity",.85),t.select(".radial").append("rect").attr("x",0).attr("y",diamondYOff).attr("width",diamondW).attr("height",diamondH).style("fill","#00000000")}function generateTextData(t,e){return[{x:window450?cW:width,y:.6*heroDateSize,html:`${t.date.day}<tspan class="hero hero-date sm:hero sm:hero-date hero-accent ordinal">${getOrdinal(t.date.day)}</tspan> `+t.date.toFormat("LLLL"),class:"hero hero-date hero-accent sm:hero sm:hero-date",trans:!0},{x:window450?cW:width,y:window450?diamondH+diamondYOff+heroSize:cDiamondY-1.5*heroSpacing-1.8965*heroCentre,html:`On this day in <tspan class='hero sm:hero hero-accent'>${t.date.year}</tspan>`,class:"hero sm:hero",trans:!1},{x:window450?cW:width,y:window450?diamondH+diamondYOff+2*heroSize+heroCentre:cDiamondY-.5*heroSpacing-.8965*heroCentre,html:"I listened to",class:"hero sm:hero",trans:!1},{x:window450?cW:width,y:window450?diamondH+diamondYOff+3*heroSize+2*heroCentre:cDiamondY+.5*heroSpacing+.1035*heroCentre,html:`<tspan class='hero sm:hero hero-accent'>${e}</tspan> album`+(1<e?"s":""),class:"hero sm:hero",trans:!1},{x:window450?cW:width,y:window450?diamondH+diamondYOff+4*heroSize+3*heroCentre:cDiamondY+1.5*heroSpacing+1.1035*heroCentre,html:"for the first time",class:"hero sm:hero",trans:!1},{x:window450?cW:width,y:height-5-heroSpacing-heroCentre,html:`<a href="/projects/first-listens/" class='hero sm:hero hero-accent'>View the full,</a>`,class:"hero sm:hero",trans:!0},{x:window450?cW:width,y:height-5-heroCentre,html:`<a href="/projects/first-listens/" class='hero sm:hero hero-accent'>interactive visualisation</a>`,class:"hero sm:hero",trans:!0}]}d3.json("./projects/first-listens/Calendar-Data_All.json").then(t=>{var e=generateDate(t),a=new URL("/projects/first-listens/",window.location.origin);a.searchParams.set("id",e.id),a.searchParams.set("date",e.stringDate);let n=d3.create("svg:svg").attr("width",width).attr("height",height).attr("viewBox",[0,0,width,height]).attr("style","max-width: 100%; height: auto").attr("xmlns","http://www.w3.org/2000/svg").attr("id","plot");a=n.append("a").attr("href",a.href),drawFlower(reCentre(t,e.id),a,"main"),n.select("#p"+e.stringDate).style("stroke",orange).attr("cx",t=>mainX(cX+(t.logCount+.09)*Math.cos(-1*t.angle))).attr("cy",t=>mainY(cY-(t.logCount+.09)*Math.sin(-1*t.angle))).attr("transform",t=>`rotate(${180*(t.angleJS+Math.PI/2)/Math.PI} ${mainX(cX+(t.logCount+.09)*Math.cos(-1*t.angle))} ${mainY(cY-(t.logCount+.09)*Math.sin(-1*t.angle))})`).raise(),t=n.select("#p"+e.stringDate).datum().count,radialLines(e,n),n.select("g.radial").lower(),a=generateTextData(e,t);n.selectAll("text").data(a).join("text").attr("class",t=>t.class).attr("x",t=>t.x).attr("y",t=>t.y).attr("transform",(t,e)=>t.trans?`skewX(-10) translate(${t.y*(0===e?.71:1)*Math.tan(10*Math.PI/180)})`:"").html(t=>t.html),d3.select("#vis").append(()=>n.node())});