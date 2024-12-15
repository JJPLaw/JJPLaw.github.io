import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { DateTime } from 'https://cdn.jsdelivr.net/npm/luxon@3.5.0/+esm';
// import("https://cdn.jsdelivr.net/npm/d3@7/+esm").then(m=> d3 = m);

let window1024 = window.matchMedia('max-width: 1024px');

const width = 1500;
const height = 720;
const marginLeft = 0;
const cX = 1.53;
const cY = -0.96;
const fontSize = +window.getComputedStyle(document.documentElement).fontSize.replace('px', ''); // Get the font size of the window -- + at the start turns the string into a number;

const palette = { "1_0": "#FFFFFF", "1_1": "#D1EEEA", "1_2": "#8DC9CD", "1_3": "#67AAB7", "1_4": "#4E8FA5", "1_5": "#407A95", "1_6": "#366B87", "1_7": "#30607E", "1_8": "#2A5674", "2_0": "#FFFFFF", "2_1": "#C7E5BE", "2_2": "#73C49C", "2_3": "#4BA28E", "2_4": "#348781", "2_5": "#267374", "2_6": "#1E646A", "2_7": "#195A63", "2_8": "#14505C", "3_0": "#FFFFFF", "3_1": "#B7F1B2", "3_2": "#62DEAD", "3_3": "#2CC5AF", "3_4": "#07AFAB", "3_5": "#009FA6", "3_6": "#0391A0", "3_7": "#0D889C", "3_8": "#177F97", "4_0": "#FFFFFF", "4_1": "#EDEF5C", "4_2": "#72C570", "4_3": "#16A67E", "4_4": "#018C7F", "4_5": "#00787B", "4_6": "#0E6A75", "4_7": "#1B606F", "4_8": "#255668", "5_0": "#FFFFFF", "5_1": "#F3CBD3", "5_2": "#E08FB0", "5_3": "#C9689C", "5_4": "#AF4D8D", "5_5": "#993B81", "5_6": "#872F77", "5_7": "#79286F", "5_8": "#6C2167", "6_0": "#FFFFFF", "6_1": "#F6D2A9", "6_2": "#F1A280", "6_3": "#E98071", "6_4": "#DC676C", "6_5": "#CF5868", "6_6": "#C24D66", "6_7": "#BA4665", "6_8": "#B13F64", "7_0": "#FFFFFF", "7_1": "#FCDE9C", "7_2": "#F27F6F", "7_3": "#E34E6F", "7_4": "#D73876", "7_5": "#C22A79", "7_6": "#A72376", "7_7": "#921F73", "7_8": "#7C1D6F", "8_0": "#FFFFFF", "8_1": "#AEB6E5", "8_2": "#B68DD1", "8_3": "#BC6DB8", "8_4": "#BC569D", "8_5": "#B94686", "8_6": "#B33B72", "8_7": "#AF3663", "8_8": "#A93154" };

const orange = '#f08637';

const years = ['2018', '2019', '2020', '2021', '2022', '2023', '2024'];

const mainX = d3.scaleLinear()
	.domain([0, width * 0.003])
	.range([0, width]);

const mainY = d3.scaleLinear()
	.domain([0, height * -0.003])
	.range([0, height]);

function getOrdinal(day) {
	if (day === '1' || day === '21' || day === '31') {
		return "st"
	} else if (day === '2' || day === '22') {
		return "nd"
	} else if (day === '3' || day === '23') {
		return "rd"
	} else return "th";
}

function daysInMonth(month, year) {
	// getDate() returns the day number. Setting day to 0 returns the whole month;
	return new Date(year, month, 0).getDate();
}

function updatePrimaryInfo(d) {
	d3.select('#info')
		.selectAll('h4')
		.data(d)
		.join('h4')
		.text(d => `${d.fMonth} ${d.year}, ${d.total} albums`);
}

function updateSecondaryInfo(d) {
	d3.select('#info ol')
		.selectAll('li')
		.data(d[0].data)
		.join('li')
		.attr('class', d => d.fav ? 'favourite-album' : undefined)
		.html((d) => `<p style="grid-column:span 2">${d.album} by ${d.artist} (${d.released})<br/></p>`)
		.style('font-weight', 'initial');
	
	d3.selectAll('.favourite-album')
		.style('font-weight', 700);

	let favouriteContainer = d3.selectAll('.favourite-album')
		.append('div')
		.attr('class', 'favourite-container');
	
	if (favouriteContainer._groups[0].length !== 0) {
		if (favouriteContainer.datum().bandcamp) {
			favouriteContainer.append('a')
				.style('font-weight', 400)
				.html("Bandcamp")
				.attr('href', d => d.bandcamp);
		} else {
			favouriteContainer.append('a')
				.style('font-weight', 400)
				.html("Spotify")
				.attr('href', d => d.spotify);

			favouriteContainer.append('a')
				.style('font-weight', 400)
				.html("Apple Music")
				.attr('href', d => d.apple)
				.style('justify-self', 'right');
		}
	}
	
	favouriteContainer.append('img')
		.attr('src', d => d.artworkFile)
		.attr('width', '200px')
		.style('grid-column', 'span 2');
}

function drawFlower(_data, _dom, main) {
	let x, y, margin, cursor;
	switch (main) {
		case "main":
			x = mainX;
			y = mainY;
			margin = marginLeft;
			cursor = 'auto';
			break;
	}

	let flower = _dom.append('g')
		.attr('class', 'flowers')
		.selectAll('g')
		.data(_data)
		.join('g')
		.attr('class', 'flower')
		.attr('id', d => d.id);
	
	// Create the petals
	let petals = flower.append('g')
		.attr('class', 'petals')
		.selectAll('ellipse')
		.data(d => d.petals)
		.join('ellipse')
		.attr('class', 'petal')
		.attr('id', d => `p${d.date}`)
		.attr('rx', d => x(d.rx))
		.attr('ry', d => y(d.ry) * -1)
		.attr('cx', d => x(d.x0) + margin)
		.attr('cy', d => y(d.y0))
		.attr('transform', d => `rotate(${(d.angleJS + (Math.PI / 2)) * 180 / Math.PI} ${x(d.x0) + margin} ${y(d.y0)})`)
		// .attr('transform-origin', d => `${x(d.x0) + margin}px ${y(d.y0)}px`)
		// .style('translate', d => `${x(d.x0) + margin}px ${y(d.y0)}px`)
		// .style('rotate', d => `${d.angleJS + (Math.PI / 2)}rad`)
		.style('fill', d => palette[d.palette])
		.style('fill-opacity', 0.85)
		.style('stroke', d => palette[d.palette])
		.style('stroke-width', `${x(0.006)}pt`);

	// Create the centre discs
	let discs = flower.append('circle')
		.attr('cx', d => x(d.x) + margin)
		.attr('cy', d => y(d.y))
		.attr('r', x(0.045))
		.style('fill', d => palette[d.centre_fill])
		.style('stroke', d => palette[d.centre_col])
		.style('stroke-width', `${x(0.006)}pt`);
};

// Re-centre the data at 1,-1 for individual plots
function reCentre(_data, _id, leg = false) {
	let newData;

	if (!_id) {
		newData = [structuredClone(_data)];
	} else {
		newData = [structuredClone(_data[_data.findIndex(el => el.id === _id)])];
		// for (let i = 0; i < _data.length; i++) {
		// 	if (_data[i].id === _id) {
		// 		newData = [structuredClone(_data[i])];
		// 		break;
		// 	}
		// }
	}

	newData[0].x = cX;
	newData[0].y = cY;
	for (let i = 0; i < newData.length; i++) {
		newData[i]['centre_col'] = leg ? newData[i]['centre_col'].replace(/\d_/, '4_') : newData[i]['centre_col'];
		newData[i]['centre_fill'] = leg ? newData[i]['centre_fill'].replace(/\d_/, '4_') : newData[i]['centre_fill'];
		for (let j = 0; j < newData[i]['petals'].length; j++) {
			newData[i]['petals'][j]['x0'] = newData[i]['x'] + (newData[i]['petals'][j]['logCount'] * Math.cos(newData[i]['petals'][j]['angle'] * -1));
			newData[i]['petals'][j]['y0'] = newData[i]['y'] - (newData[i]['petals'][j]['logCount'] * Math.sin(newData[i]['petals'][j]['angle'] * -1));
			newData[i]['petals'][j]['palette'] = leg ? newData[i]['petals'][j]['palette'].replace(/\d_/, '4_') : newData[i]['petals'][j]['palette'];
		}
	}
	return newData;
}

function generateDate(_data) {
	let today = DateTime.local({ locale: 'en-GB' });
	// let today = DateTime.fromFormat('2018-05-08', 'yyyy-MM-dd');
	
	let validDatesAll = [];
	for (let i = 0; i < _data.length; i++) {
		for (let j = 0; j < _data[i]['petals'].length; j++) {
			validDatesAll.push(_data[i]['petals'][j]['date']);
		}
	}

	let validDates = validDatesAll.filter((el) => el.includes(today.toFormat('LL-dd')));
	let i = 1;
	while (validDates.length == 0) {
		validDates = validDatesAll.filter((el) => el.includes(today.plus({ days: i }).toFormat('LL-dd')));
		i++;
	}

	let newDate = DateTime.fromFormat(validDates[Math.floor(Math.random() * validDates.length)], 'yyyy-MM-dd');
	// let newDate = DateTime.fromFormat('2018-05-08', 'yyyy-MM-dd');


	return {
		date: newDate,
		id: newDate.toFormat('LLL_yyyy'),
		day: newDate.toFormat('dd'),
		stringDate: newDate.toFormat('yyyy-LL-dd')
	}
}

function intersection(x1, y1, x2, y2, x3, y3, x4, y4) {
	let p = {};

	p.x = ((((x1 * y2) - (y1 * x2)) * (x3 - x4)) - (((x3 * y4) - (y3 * x4)) * (x1 - x2))) / (((x1 - x2) * (y3 - y4)) - ((y1 - y2) * (x3 - x4)));
	
	p.y = ((((x1 * y2) - (y1 * x2)) * (y3 - y4)) - (((x3 * y4) - (y3 * x4)) * (y1 - y2))) / (((x1 - x2) * (y3 - y4)) - ((y1 - y2) * (x3 - x4)));

	return p;
}

function radialLines(_generatedDate, _dom) {
	let n = daysInMonth(_generatedDate.date.month, _generatedDate.date.year);

	_dom.select('.petals')
		.append('g')
		.attr('class', 'radial')
		.selectAll('polygon')
		.data(d => {
			let pal = d.petals[0].palette.replace(/_\d/, '_1');
			let newAngle;
			for (let i = 0; i < n; i++) {
				newAngle = ((i * 2 * Math.PI / n) - (Math.PI / 2)) * -1;
				if (d.petals.findIndex(el => el.day === (i + 1)) === -1) {
					d.petals.push({ angle: newAngle, logCount: -0.025, date: '0', palette: pal })
				} else {
					continue;
				}
			}
			return d.petals;
		})
		.join('polygon')
		// .attr('d', d => {
		// 	let offset = d.date === _generatedDate.stringDate ? 0.14 : 0.05;
		// 	let angleOff = (Math.PI / n) * 0.5;

		// 	let diamond = {
		// 		a: { x: 510, y: 10 },
		// 		b: { x: 1010, y: 320 },
		// 		c: { x: 510, y: 630 },
		// 		d: { x: 10, y: 320 }
		// 	};

		// 	let angle = (d.angle * -1) - angleOff;
		// 	let line = [], x = [], y = [];
		// 	let path = '';
		// 	let middle = false;
		// 	let start, p, r;

		// 	for (let i = 0; i < 2; i++) {
		// 		if (angle < -Math.PI * 0.5) {
		// 			angle += Math.PI * 2;
		// 		} else if (Math.PI * 1.5 <= angle) {
		// 			angle -= Math.PI * 2;
		// 		}
		// 		start = d.logCount * 2 + offset;
		// 		x[0] = mainX(cX + (start * Math.cos(angle)));
		// 		y[0] = mainY(cY - (start * Math.sin(angle)));
		// 		x[1] = mainX(cX + (cX * Math.cos(angle)));
		// 		y[1] = mainY(cY - (cX * Math.sin(angle)));

		// 		if (-Math.PI * 0.5 <= angle && angle < 0) {
		// 			line[0] = diamond.a;
		// 			line[1] = diamond.b;
		// 		} else if (0 <= angle && angle < Math.PI * 0.5) {
		// 			line[0] = diamond.b;
		// 			line[1] = diamond.c;
		// 		} else if (Math.PI * 0.5 <= angle && angle < Math.PI) {
		// 			line[0] = diamond.c;
		// 			line[1] = diamond.d;
		// 		} else if (Math.PI <= angle && angle < Math.PI * 1.5) {
		// 			line[0] = diamond.d;
		// 			line[1] = diamond.a;
		// 		}

		// 		p = intersection(x[0], y[0], x[1], y[1], line[0].x, line[0].y, line[1].x, line[1].y);
				
		// 		// if (middle && !(d.date === '0')) {
		// 		// 	r = Math.sqrt(Math.pow(x[0] - p.x, 2) + Math.pow(y[0] - p.y, 2)) * 0.003;
		// 		// 	start += r * 0.33;
		// 		// 	x[0] = mainX(cX + (start * Math.cos(angle)));
		// 		// 	y[0] = mainY(cY - (start * Math.sin(angle)));
		// 		// }
				
		// 		path += `M ${x[0]},${y[0]} L ${p.x},${p.y} `
		// 		angle += angleOff * 2;
		// 		middle = !middle;
		// 	}
		// 	return path;
		// })
		.attr('points', d => {
			let offset = d.date === _generatedDate.stringDate ? 0.14 : 0.05;
			let angleOff = (Math.PI / n) * 0.33;

			let diamond = {
				a: { x: 510, y: 10 },
				b: { x: 1010, y: 320 },
				c: { x: 510, y: 630 },
				d: { x: 10, y: 320 }
			};

			let angle = (d.angle * -1) - angleOff;
			let line = [], x = [], y = [];
			let path = '';
			let middle = false;
			let start, p, r;

			for (let i = 0; i < 2; i++) {
				if (angle < -Math.PI * 0.5) {
					angle += Math.PI * 2;
				} else if (Math.PI * 1.5 <= angle) {
					angle -= Math.PI * 2;
				}
				start = d.logCount * 2 + offset;
				x[0] = mainX(cX + (start * Math.cos(angle)));
				y[0] = mainY(cY - (start * Math.sin(angle)));
				x[1] = mainX(cX + (cX * Math.cos(angle)));
				y[1] = mainY(cY - (cX * Math.sin(angle)));

				if (-Math.PI * 0.5 <= angle && angle < 0) {
					line[0] = diamond.a;
					line[1] = diamond.b;
				} else if (0 <= angle && angle < Math.PI * 0.5) {
					line[0] = diamond.b;
					line[1] = diamond.c;
				} else if (Math.PI * 0.5 <= angle && angle < Math.PI) {
					line[0] = diamond.c;
					line[1] = diamond.d;
				} else if (Math.PI <= angle && angle < Math.PI * 1.5) {
					line[0] = diamond.d;
					line[1] = diamond.a;
				}

				p = intersection(x[0], y[0], x[1], y[1], line[0].x, line[0].y, line[1].x, line[1].y);

				// if (middle && !(d.date === '0')) {
				// 	r = Math.sqrt(Math.pow(x[0] - p.x, 2) + Math.pow(y[0] - p.y, 2)) * 0.003;
				// 	start += r * 0.33;
				// 	x[0] = mainX(cX + (start * Math.cos(angle)));
				// 	y[0] = mainY(cY - (start * Math.sin(angle)));
				// }

				path += middle ? `${x[0]},${y[0]} ${p.x},${p.y} ` : `${p.x},${p.y} ${x[0]},${y[0]} `;
				angle += angleOff * 2;
				middle = !middle;
			}
			return path;
		})
		.style('stroke-width', d => d.date === '0' ? '2px' : '3px')
		.style('opacity', d => d.date === '0' ? 0.5 : 1)
		.style('stroke', d => d.date === _generatedDate.stringDate ? orange : palette[d.palette])
		.style('fill', d => d.date === _generatedDate.stringDate ? orange : palette[d.palette])
		.style('fill-opacity', 0.85);
		// .style('clip-path', 'url(#diamond)');
		// .lower();
}

d3.json('./projects/first-listens/Calendar-Data_All.json')
	.then(function (data) {

		// Create the SVG container.
		let svg = d3.create('svg:svg')
			.attr("width", width)
			.attr("height", height)
			.attr("viewBox", [0, 0, width, height])
			.attr("style", "max-width: 100%; height: auto")
			.attr('id', 'plot');			
		
		let date = generateDate(data);

		drawFlower(reCentre(data, date.id), svg, "main");

		svg.select(`#p${date.stringDate}`)
			.style('stroke', orange)
			.attr('cx', d => mainX(cX + ((d.logCount + 0.09) * Math.cos(d.angle * -1))))
			.attr('cy', d => mainY(cY - ((d.logCount + 0.09) * Math.sin(d.angle * -1))))
			.attr('transform', d => `rotate(${(d.angleJS + (Math.PI / 2)) * 180 / Math.PI} ${mainX(cX + ((d.logCount + 0.09) * Math.cos(d.angle * -1)))} ${mainY(cY - ((d.logCount + 0.09) * Math.sin(d.angle * -1)))})`)
			.raise();
			// .attr('transform-origin', d => `${mainX(0.75 + ((d.logCount + 0.09) * Math.cos(d.angle * -1)))}px ${mainY(-0.75 - ((d.logCount + 0.09) * Math.sin(d.angle * -1))) }px`)
			// .style('translate', d => `${mainX(0.75 + ((d.logCount + 0.09) * Math.cos(d.angle * -1)))}px ${mainY(-0.75 - ((d.logCount + 0.09) * Math.sin(d.angle * -1)))}px`);
			// .style('rotate', d => `${d.angleJS + (Math.PI / 2)}rad`)

		let count = svg.select(`#p${date.stringDate}`).datum().count;
		
		radialLines(date, svg);

		svg.select('g.radial')
			.lower();
		
		svg.append('defs')
			.append('clipPath')
			.attr('id', 'diamond')
			.append('path')
			.attr('d', `M 10,320 L 510,10 L 1010,320 L 510,630 Z`);
		
		let cDiamond = 330;
		let cH = height * 0.5;
		let heroSize = fontSize * 3.125;
		let heroCentre = heroSize * 0.5;
		let heroSpacing = heroSize * 1;
		
		svg.append('text')
			.attr('class', 'hero hero-date hero-accent')
			.html(`${date.date.day}<tspan class="hero hero-date hero-accent ordinal">${getOrdinal(date.date.day)}</tspan> ${date.date.toFormat('LLLL')}`)
			.attr('x', width)
			// text baseline is set as the middle, so shift position down by half of the font size (+ a little for the superscript)
			.attr('y', 0 + (fontSize * 5.625 * 0.7))
			// skewing in the x axis shifts points by {tan(theta) * y}, where y is the distance from the transformation origin (here the center of the page)
			// here, translate unshifts the points by that same amount by reversing the skew direction (so x = tan(-theta) * y) 
			// I've done this here rather than in the css because I've got access to the most variables here
			.attr('transform', `skewX(-10) translate(${((fontSize * 5.625 * 0.5) - cH) * Math.tan(10 * Math.PI / 180)})`);
		
		// svg.append('circle')
		// 	.attr('cx', mainX(cX))
		// 	.attr('cy', mainY(cY))
		// 	.attr('r', mainX(0.7))
		// 	.style('fill', 'none')
		// 	.style('stroke', 'black');
		
		// svg.append('circle')
		// 	.attr('cx', mainX(cX))
		// 	.attr('cy', mainY(cY))
		// 	.attr('r', mainX(0.75))
		// 	.style('fill', 'none')
		// 	.style('stroke', 'black');
		
		// svg.append('g')
		// 	.selectAll('line')
		// 	.data([cH - (1.5 * heroSpacing) - (1.8965 * heroCentre), cH - (0.5 * heroSpacing) - (0.8965 * heroCentre), cH, cH + (0.5 * heroSpacing) + (0.1035 * heroCentre), cH + (1.5 * heroSpacing) + (1.1035 * heroCentre)])
		// 	.join('line')
		// 	.attr('x1', width/2)
		// 	.attr('x2', width)
		// 	.attr('y1', d => d)
		// 	.attr('y2', d => d)
		// 	.style('stroke', 'black');
		
		// svg.append('g')
		// 	.selectAll('line')
		// 	.data([cH - (1.5 * heroSpacing) - (1.5 * heroCentre), cH - (0.5 * heroSpacing) - (0.5 * heroCentre), cH, cH + (0.5 * heroSpacing) + (0.5 * heroCentre), cH + (1.5 * heroSpacing) + (1.5 * heroCentre)])
		// 	.join('line')
		// 	.attr('x1', width / 2)
		// 	.attr('x2', width)
		// 	.attr('y1', d => d)
		// 	.attr('y2', d => d)
		// 	.style('stroke', 'red');
		
		
		// treat the middle text as one paragraph, centred on the diamond
		// adjusted for the difference between the x height and the middle baseline of josefin (x height is 0.8965 * middle) 
		svg.append('text')
			.attr('class', 'hero')
			.html(`On this day in <tspan class='hero hero-accent'>${date.date.year}</tspan>`)
			.attr('x', width)
			.attr('y', cDiamond - (1.5 * heroSpacing) - (1.8965 * heroCentre));
		
		svg.append('text')
			.attr('class', 'hero')
			.text('I listened to')
			.attr('x', width)
			.attr('y', cDiamond - (0.5 * heroSpacing) - (0.8965 * heroCentre));
		
		svg.append('text')
			.attr('class', 'hero')
			.html(`<tspan class='hero hero-accent'>${count}</tspan> album${count > 1 ? 's' : ''}`)
			.attr('x', width)
			.attr('y', cDiamond + (0.5 * heroSpacing) + (0.1035 * heroCentre));
		
		svg.append('text')
			.attr('class', 'hero')
			.text('for the first time')
			.attr('x', width)
			.attr('y', cDiamond + (1.5 * heroSpacing) + (1.1035 * heroCentre));
		
		svg.append('text')
			.attr('class', 'hero')
			.html(`<a href="/projects/first-listens/" class='hero hero-accent'>Click here</a> to view the full,`)
			.attr('x', width)
			.attr('y', height - 5 - heroSpacing - heroCentre)
			.attr('transform', `skewX(-10) translate(${(cH - 5 - heroSpacing - heroCentre) * Math.tan(10 * Math.PI / 180)})`);
		
		svg.append('text')
			.attr('class', 'hero')
			.html(`interactive visualisation`)
			.attr('x', width)
			.attr('y', height - 5 - heroCentre)
			.attr('transform', `skewX(-10) translate(${(cH - 5 - heroCentre) * Math.tan(10 * Math.PI / 180)})`);

		
		d3.select("#vis")
			.append(() => svg.node());
		
		let info = d3.select('#info');
					
		info.select('h2')
			.html(`${date.date.day}<sup>${getOrdinal(date.date.day)}</sup> ${date.date.toFormat('LLLL')}`);
		
		info.select('p')
			.html(`On this day in ${date.date.year} I listened to:`);

		updateSecondaryInfo([d3.select(`#p${date.stringDate}`).datum()]);
	});