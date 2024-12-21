import*as d3 from"https://cdn.jsdelivr.net/npm/d3@7/+esm";let paramsString=window.location.search,search=new URLSearchParams(paramsString),content=""!==paramsString?{id:search.get("id"),date:search.get("date")}:null,marginLeft=(history.replaceState(content,"",window.location.href),120),marginMult=.7,height=1200,width=height*(8/13)+marginLeft,popWidth=width,legendWidth=200,legendHeight=120,years=["2018","2024"],months=["January","December"],selectedPetal="",window1190=window.matchMedia("(max-width: 1190px)"),popMargin=window1190.matches?0:35,window858=(window1190.onchange=t=>{popMargin=t.matches?0:35},window.matchMedia("(max-width: 858px)")),windowMin=(window858.matches&&(width-=marginLeft,marginLeft=50,width+=marginLeft,months=["Jan","Dec"],marginMult=1.2,popWidth=width),window.matchMedia(`(max-width: ${width}px)`)),popOuterMargin=windowMin.matches?window.innerWidth:width,favourite=document.querySelector("input#favourite"),petalData=[{x:.1875,h:.1025261,t:"1",p:"4_1"},{x:.375,h:.1625,t:"2",p:"4_2"},{x:.5625,h:.2050522,t:"3",p:"4_3"},{x:.75,h:.2380582,t:"4",p:"4_4"},{x:.9375,h:.2650261,t:"5",p:"4_5"},{x:1.125,h:.2878271,t:"6",p:"4_6"},{x:1.3125,h:.3075783,t:"7",p:"4_7"},{x:1.5,h:.325,t:"8",p:"4_8"}],palette={"1_0":"#FFFFFF","1_1":"#D1EEEA","1_2":"#8DC9CD","1_3":"#67AAB7","1_4":"#4E8FA5","1_5":"#407A95","1_6":"#366B87","1_7":"#30607E","1_8":"#2A5674","2_0":"#FFFFFF","2_1":"#C7E5BE","2_2":"#73C49C","2_3":"#4BA28E","2_4":"#348781","2_5":"#267374","2_6":"#1E646A","2_7":"#195A63","2_8":"#14505C","3_0":"#FFFFFF","3_1":"#B7F1B2","3_2":"#62DEAD","3_3":"#2CC5AF","3_4":"#07AFAB","3_5":"#009FA6","3_6":"#0391A0","3_7":"#0D889C","3_8":"#177F97","4_0":"#FFFFFF","4_1":"#EDEF5C","4_2":"#72C570","4_3":"#16A67E","4_4":"#018C7F","4_5":"#00787B","4_6":"#0E6A75","4_7":"#1B606F","4_8":"#255668","5_0":"#FFFFFF","5_1":"#F3CBD3","5_2":"#E08FB0","5_3":"#C9689C","5_4":"#AF4D8D","5_5":"#993B81","5_6":"#872F77","5_7":"#79286F","5_8":"#6C2167","6_0":"#FFFFFF","6_1":"#F6D2A9","6_2":"#F1A280","6_3":"#E98071","6_4":"#DC676C","6_5":"#CF5868","6_6":"#C24D66","6_7":"#BA4665","6_8":"#B13F64","7_0":"#FFFFFF","7_1":"#FCDE9C","7_2":"#F27F6F","7_3":"#E34E6F","7_4":"#D73876","7_5":"#C22A79","7_6":"#A72376","7_7":"#921F73","7_8":"#7C1D6F","8_0":"#FFFFFF","8_1":"#AEB6E5","8_2":"#B68DD1","8_3":"#BC6DB8","8_4":"#BC569D","8_5":"#B94686","8_6":"#B33B72","8_7":"#AF3663","8_8":"#A93154"},orange="#f08637",mainX=d3.scaleLinear().domain([0,8]).range([0,width-marginLeft]),mainY=d3.scaleLinear().domain([0,-13]).range([0,height]),lg=d3.scaleLog().domain([1,9]).range([0,.325]),legX=d3.scaleLinear().domain([0,1.5]).range([0,legendWidth]),legY=d3.scaleLinear().domain([0,-1.5]).range([0,legendWidth]),legPX=d3.scaleLinear().domain([0,1.7]).range([0,legendWidth]),legPY=d3.scaleLinear().domain([0,-.8]).range([0,legendHeight]),popX=d3.scaleLinear().domain([0,1.5]).range([0,popWidth]),popY=d3.scaleLinear().domain([0,-1.5]).range([0,popWidth]);function getOrdinal(t){t=t.toString();return"1"===t||"21"===t||"31"===t?"st":"2"===t||"22"===t?"nd":"3"===t||"23"===t?"rd":"th"}function updatePrimaryInfo(t){d3.select("#info").selectAll("h3").data(t).join("h3").html(t=>t.fMonth+` ${t.year}, ${t.total}&nbsp;albums`)}function updateSecondaryInfo(t){d3.select("#info").selectAll("h4").data(t).join("h4").text(t=>t.wDay+" "+t.day).append("sup").text(t=>getOrdinal(t.day)),d3.select("#info ol").selectAll("li").data(t[0].data).join("li").attr("class",t=>t.fav?"favourite-album":void 0).html(t=>`<p>${t.album} by ${t.artist} (${t.released})<br/></p>`);t=d3.selectAll(".favourite-album").append("div").attr("class","favourite-container");0!==t._groups[0].length&&(t.datum().bandcamp?t.append("a").style("font-weight",400).html("Bandcamp").attr("href",t=>t.bandcamp):(t.append("a").style("font-weight",400).html("Spotify").attr("href",t=>t.spotify),t.append("a").style("font-weight",400).html("Apple Music").attr("href",t=>t.apple).style("justify-self","right"))),t.append("img").attr("src",t=>t.artworkFile).attr("width","200px").attr("height","200px").style("grid-column","span 2")}function petalSelector(t,e){d3.select(t.parentNode).insert("g","#"+t.id).attr("id","placeholder"),d3.select(t).style("stroke",orange).style("translate",t=>`${popX(.75+(t.logCount+.09)*Math.cos(-1*t.angle))+popMargin}px ${popY(-.75-(t.logCount+.09)*Math.sin(-1*t.angle))}px`).style("fill-opacity",1).raise(),updateSecondaryInfo([e]),selectedPetal=t.id,e.selected=!0}function petalDeselector(t){t=document.getElementById(t);let e=d3.select(t);var a=e.datum();a.selected=!1,e.style("stroke",t=>favourite.checked&&t.fav?"#595959":palette[t.palette]).style("translate",t=>`${popX(t.x0)+popMargin}px ${popY(t.y0)}px`).style("fill-opacity",.85),d3.select(t.parentNode).select(function(){return this.insertBefore(e.node(),document.getElementById("placeholder"))}).datum(a),d3.select("g#placeholder").remove(),d3.select("#info h4").text(""),d3.selectAll("#info li").remove(),selectedPetal=""}function petalController(t,e){""===selectedPetal&&(selectedPetal=t.target.id),e.selected||selectedPetal!==t.target.id?e.selected&&selectedPetal===t.target.id?petalDeselector(t.target.id):selectedPetal!==t.target.id&&(petalDeselector(selectedPetal),petalSelector(t.target,e)):petalSelector(t.target,e)}function drawFlower(t,e,a){let l,r,i,n="auto",p="";switch(a){case"main":l=mainX,r=mainY,i=marginLeft;break;case"leg":l=legX,r=legY,i=0;break;case"pop":l=popX,r=popY,i=popMargin,n="pointer",p="-pop"}e=e.append("g").attr("class","flowers").selectAll("g").data(t).join("g").attr("class","flower").attr("id",t=>t.id),"main"===a&&e.on("mouseleave",()=>{document.querySelector("#popup")||d3.select("#info h3").text("")}),t=e.append("g").attr("class","petals").selectAll("ellipse").data(t=>t.petals).join("ellipse").attr("class","petal").attr("id",t=>"p"+t.date+p).attr("rx",t=>l(t.rx)).attr("ry",t=>-1*r(t.ry)).style("translate",t=>`${l(t.x0)+i}px ${r(t.y0)}px`).style("rotate",t=>t.angleJS+Math.PI/2+"rad").style("fill",t=>palette[t.palette]).style("fill-opacity",.85).style("stroke",t=>palette[t.palette]).style("stroke-width",l(.006)+"pt").style("cursor",n);"pop"===a&&t.on("click",(t,e)=>{petalController(t,e)}),e.append("circle").attr("cx",t=>l(t.x)+i).attr("cy",t=>r(t.y)).attr("r",l(.045)).style("fill",t=>palette[t.centre_fill]).style("stroke",t=>palette[t.centre_col]).style("stroke-width",l(.006)+"pt");"main"===a&&e.append("rect").attr("id",t=>"r"+t.id).attr("x",t=>l(t.x-.5)+i).attr("y",t=>r(t.y+.5)).attr("width",l(1)).attr("height",r(-1)).style("fill","#00000000").style("cursor","pointer").on("mousemove",(t,e)=>updatePrimaryInfo([e])).on("click",(t,e)=>popupGenerator(e))}function reCentre(t,e,a=!1){let l;(l=e?[structuredClone(t[t.findIndex(t=>t.id===e)])]:[structuredClone(t)])[0].x=.75,l[0].y=-.75;for(let e=0;e<l.length;e++){l[e].centre_col=a?l[e].centre_col.replace(/\d_/,"4_"):l[e].centre_col,l[e].centre_fill=a?l[e].centre_fill.replace(/\d_/,"4_"):l[e].centre_fill;for(let t=0;t<l[e].petals.length;t++)l[e].petals[t].x0=l[e].x+l[e].petals[t].logCount*Math.cos(-1*l[e].petals[t].angle),l[e].petals[t].y0=l[e].y-l[e].petals[t].logCount*Math.sin(-1*l[e].petals[t].angle),l[e].petals[t].palette=a?l[e].petals[t].palette.replace(/\d_/,"4_"):l[e].petals[t].palette}return l}function closePopup(t=!1){d3.select("#popup").remove(),d3.select("#info h3").text(""),d3.select("#info h4").text(""),d3.selectAll("#info li").remove(),selectedPetal="",t||null===history.state||history.pushState(null,"",window.location.origin+window.location.pathname)}function popupGenerator(t){let e=d3.create("svg:svg").attr("width",width).attr("height",height).attr("viewBox",[0,0,width,height]).attr("id","popup").attr("style",`max-width: 100%; height: auto; margin-left: -${popOuterMargin}px; overflow: visible`);var a=e.append("defs"),a=(a.append("filter").attr("id","flowerShadow").append("feDropShadow").attr("dx",0).attr("dy",0).attr("stdDeviation",5).attr("flood-color","var(--main-font-colour)").attr("flood-opacity",.5),a.append("filter").attr("id","boxShadow").append("feDropShadow").attr("dx",0).attr("dy",0).attr("stdDeviation",5).attr("flood-color","var(--main-font-colour)").attr("flood-opacity",.2),e.append("rect").attr("x",0).attr("y",0).attr("width",width).attr("height",height).style("fill","#F9F6EE80").on("click",(t,e)=>{closePopup()}),e.append("g").attr("id","popBox"));a.append("rect").attr("x",popX(.15)+popMargin).attr("y",popY(-.15)).attr("width",popX(1.2)+popMargin).attr("height",popY(-1.3)).attr("rx",5).attr("ry",5).attr("filter","url(#boxShadow)").style("fill","var(--main-background-color)").on("click",(t,e)=>{petalDeselector(selectedPetal,popX,popY,popMargin)}),drawFlower(reCentre(t,!1),a,"pop"),favourite.checked&&a.selectAll(".petal").style("stroke",t=>t.fav?"#595959":palette[t.palette]).style("fill-opacity",t=>t.fav?1:.85).style("opacity",t=>t.fav?1:.3),a.append("path").attr("d",`M ${popX(.2)+popMargin},${popY(-.2)} L ${popX(.25)+popMargin},${popY(-.25)} M ${popX(.2)+popMargin},${popY(-.25)} L ${popX(.25)+popMargin},`+popY(-.2)).attr("stroke-linecap","round"),a.append("rect").attr("x",popX(.17)+popMargin).attr("y",popY(-.17)).attr("width",popX(.1)+popMargin).attr("height",popY(-.1)).attr("rx",5).attr("ry",5).attr("fill","#00000000").attr("id","close").style("cursor","pointer").on("click",()=>{closePopup()}),a.selectAll("text").data([t]).join("text").text(t=>t.fMonth+" "+t.year).attr("x",popX(.75)+popMargin).attr("y",popY(-1.35)).attr("font-weight",400),d3.select("#vis").append(()=>e.node())}function stateLoader(t){null!==t&&(updatePrimaryInfo([d3.select("#r"+t.id).datum()]),popupGenerator(d3.select("#r"+t.id).datum()),petalSelector(document.getElementById("p"+t.date+"-pop"),d3.select("#p"+t.date+"-pop").datum()))}window.addEventListener("popstate",t=>{closePopup(!0),stateLoader(t.state)}),d3.json("Calendar-Data_All.json").then(function(t){let e=d3.create("svg:svg").attr("width",width).attr("height",height).attr("viewBox",[0,0,width,height]).attr("style","max-width: 100%; height: auto").attr("id","plot");e.append("svg:defs").append("svg:marker").attr("viewBox",[0,0,12,12]).attr("refX",6).attr("refY",6).attr("markerWidth",6).attr("markerHeight",6).attr("orient","auto-start-reverse").attr("id","arrowhead").append("path").attr("d","M 1,1 L 11,6 L 1,11 z").attr("stroke-linejoin","round");var a=e.append("g").attr("class","x-axis axis"),a=(a.selectAll("text").data(years).join("text").text(t=>t).each(function(t,e){e=0===e?mainX(1)+marginLeft:mainX(7)+marginLeft;d3.select(this).style("translate",`${e}px ${mainY(-.3)}px`)}),a.append("line").attr("x1",mainX(1.75)+marginLeft).attr("y1",mainY(-.3)).attr("x2",mainX(6.25)+marginLeft).attr("y2",mainY(-.3)).attr("marker-end","url(#arrowhead)"),e.append("g").attr("class","y-axis axis"));a.selectAll("text").data(months).join("text").text(t=>t).each(function(t,e){e=0===e?mainY(-1):mainY(-12);d3.select(this).style("translate",marginLeft*marginMult+`px ${e}px`)}),a.append("line").attr("x1",marginLeft*marginMult).attr("y1",mainY(-1.5)).attr("x2",marginLeft*marginMult).attr("y2",mainY(-11.5)).attr("marker-end","url(#arrowhead)"),drawFlower(t,e,"main"),d3.select("#vis").append(()=>e.node());let l=d3.create("svg:svg").attr("width",legendWidth).attr("height",legendWidth).attr("viewBox",[0,0,legendWidth,legendWidth]).attr("style","max-width: 100%; height: auto;");a=l.append("g").attr("class","annotation");a.append("path").attr("d",`M ${legX(.75)},${legY(-.1)} L ${legX(.75)},`+legY(-.75)).attr("stroke-dasharray",5),a.append("path").attr("d",`M ${legX(.75)},${legY(-.1)} A ${legX(.65)} ${legY(-.65)} 0 1 1 ${legX(.75+.65*Math.cos(1.75*Math.PI)*-1)},`+legY(-.75-.65*Math.sin(1.75*Math.PI)*-1)).attr("fill","none").attr("marker-end","url(#arrowhead)").attr("stroke-linecap","square"),a.append("text").attr("class","legText").html("1<tspan dominant-baseline='mathematical' baseline-shift='super' font-size='0.5em'>st</tspan>").attr("x",legX(.65)).attr("y",legY(-.1)),drawFlower(reCentre(t,"Aug_2022",!0),l,"leg"),d3.select("#dates").append(()=>l.node());let r=d3.create("svg:svg").attr("width",legendWidth).attr("height",legendHeight).attr("viewBox",[0,0,legendWidth,legendHeight]).attr("style","max-width: 100%; height: auto;");r.selectAll("ellipse").data(petalData).join("ellipse").attr("rx",t=>legPX(.12*t.h)).attr("ry",t=>legPY(-1*t.h)).style("translate",t=>`${legPX(t.x)}px ${legPY(-.65+t.h)}px`).style("fill",t=>palette[t.p]).style("stroke",t=>palette[t.p]),r.selectAll("text").data(petalData).join("text").text(t=>t.t).attr("class","legText").attr("x",t=>legPX(t.x)).attr("y",legPY(-.75)),d3.select("#petals").append(()=>r.node()),d3.select(favourite).on("click",(t,e)=>{favourite.checked?d3.select("#vis").selectAll(".petal").style("stroke",t=>t.selected?orange:t.fav?"#595959":palette[t.palette]).style("fill-opacity",t=>t.fav?1:.85).style("opacity",t=>t.fav?1:.3):d3.select("#vis").selectAll(".petal").style("stroke",t=>t.selected?orange:palette[t.palette]).style("fill-opacity",t=>t.selected?1:.85).style("opacity",1)}),stateLoader(history.state)});