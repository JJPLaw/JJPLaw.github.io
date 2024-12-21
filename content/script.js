import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { DateTime } from 'https://cdn.jsdelivr.net/npm/luxon@3.5.0/+esm';
// import("https://cdn.jsdelivr.net/npm/d3@7/+esm").then(m=> d3 = m); // copy line for d3 debug

let window450 = window.matchMedia('(max-width: 450px)').matches;
// let window450 = false;

const fontSize = +window.getComputedStyle(document.documentElement).fontSize.replace('px', ''); // Get the font size of the window -- + at the start turns the string into a number;
const heroSize = window450 ? fontSize * 3.125 * 0.68 : fontSize * 3.125;
const heroCentre = heroSize * 0.5;
const heroSpacing = heroSize * 1;
const heroDateSize = window450 ? fontSize * 5.625 * 0.68 : fontSize * 5.625;
const heroButton = window450 ? fontSize * 3.125 * 0.68 : fontSize * 3.125;

const width = window450 ? 450 : 1500;
const height = window450 ? 1120 : 730;
const cW = width * 0.5;
const cH = height * 0.5;
const diamondW = window450 ? 450 : 1100;
const diamondH = window450 ? 690 : 720;
const diamondYOff = window450 ? heroDateSize * 1.3 : 5;
const cDiamondX = diamondW * 0.5;
const cDiamondY = diamondH * 0.5 + diamondYOff;
const marginLeft = 0;
const conv = window450 ? 0.0046 : 0.003;
const cX = cDiamondX * conv;
const cY = -cDiamondY * conv;
const buttonW = window450 ? 306 : 450;
const buttonH = heroButton * 2.3;
const buttonMarginX = window450 ? 72 : 16;
const buttonMarginY = 16;
const buttonX = width - buttonMarginX - buttonW;
const buttonY = height - buttonMarginY - buttonH;

const palette = { "1_0": "#FFFFFF", "1_1": "#D1EEEA", "1_2": "#8DC9CD", "1_3": "#67AAB7", "1_4": "#4E8FA5", "1_5": "#407A95", "1_6": "#366B87", "1_7": "#30607E", "1_8": "#2A5674", "2_0": "#FFFFFF", "2_1": "#C7E5BE", "2_2": "#73C49C", "2_3": "#4BA28E", "2_4": "#348781", "2_5": "#267374", "2_6": "#1E646A", "2_7": "#195A63", "2_8": "#14505C", "3_0": "#FFFFFF", "3_1": "#B7F1B2", "3_2": "#62DEAD", "3_3": "#2CC5AF", "3_4": "#07AFAB", "3_5": "#009FA6", "3_6": "#0391A0", "3_7": "#0D889C", "3_8": "#177F97", "4_0": "#FFFFFF", "4_1": "#EDEF5C", "4_2": "#72C570", "4_3": "#16A67E", "4_4": "#018C7F", "4_5": "#00787B", "4_6": "#0E6A75", "4_7": "#1B606F", "4_8": "#255668", "5_0": "#FFFFFF", "5_1": "#F3CBD3", "5_2": "#E08FB0", "5_3": "#C9689C", "5_4": "#AF4D8D", "5_5": "#993B81", "5_6": "#872F77", "5_7": "#79286F", "5_8": "#6C2167", "6_0": "#FFFFFF", "6_1": "#F6D2A9", "6_2": "#F1A280", "6_3": "#E98071", "6_4": "#DC676C", "6_5": "#CF5868", "6_6": "#C24D66", "6_7": "#BA4665", "6_8": "#B13F64", "7_0": "#FFFFFF", "7_1": "#FCDE9C", "7_2": "#F27F6F", "7_3": "#E34E6F", "7_4": "#D73876", "7_5": "#C22A79", "7_6": "#A72376", "7_7": "#921F73", "7_8": "#7C1D6F", "8_0": "#FFFFFF", "8_1": "#AEB6E5", "8_2": "#B68DD1", "8_3": "#BC6DB8", "8_4": "#BC569D", "8_5": "#B94686", "8_6": "#B33B72", "8_7": "#AF3663", "8_8": "#A93154" };

const orange = '#f08637';
const white = '#F9F6EE';
const grey = '#595959';

const years = ['2018', '2019', '2020', '2021', '2022', '2023', '2024'];

const mainX = d3.scaleLinear()
	.domain([0, width * conv])
	.range([0, width]);

const mainY = d3.scaleLinear()
	.domain([0, height * -conv])
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
		// using transform as an attr allows this to be imported into inkscape (inkscape uses svg 1.1, which doesn't support transforms using css styling)
		.attr('transform', d => `rotate(${(d.angleJS + (Math.PI / 2)) * 180 / Math.PI} ${x(d.x0) + margin} ${y(d.y0)})`)
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
	// let today = DateTime.fromFormat('2018-02-03', 'yyyy-MM-dd');
	
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

	return {
		date: newDate,
		id: newDate.toFormat('LLL_yyyy'),
		day: newDate.toFormat('d'),
		stringDate: newDate.toFormat('yyyy-LL-dd')
	}
}

function intersection(x1, y1, x2, y2, x3, y3, x4, y4) {
	let p = {};
	p.x2 = ((((x1 * y2) - (y1 * x2)) * (x3 - x4)) - (((x3 * y4) - (y3 * x4)) * (x1 - x2))) / (((x1 - x2) * (y3 - y4)) - ((y1 - y2) * (x3 - x4)));
	p.y2 = ((((x1 * y2) - (y1 * x2)) * (y3 - y4)) - (((x3 * y4) - (y3 * x4)) * (y1 - y2))) / (((x1 - x2) * (y3 - y4)) - ((y1 - y2) * (x3 - x4)));
	return p;
}

function radialLines(_generatedDate, _dom) {
	let n = daysInMonth(_generatedDate.date.month, _generatedDate.date.year);

	let diamond = {
		a: { x: cDiamondX, y: diamondYOff },
		b: { x: diamondW, y: cDiamondY },
		c: { x: cDiamondX, y: diamondYOff + diamondH },
		d: { x: 0, y: cDiamondY }
	};

	let outline = '';
	for (let vertex in diamond) {
		outline += diamond[vertex].x + ',' + diamond[vertex].y + ' ';
	}

	let radial = _dom.select('.petals')
		.append('g')
		.attr('class', 'radial');
	
	radial.selectAll('polygon')
		.data(d => {
			let pal = d.petals[0].palette.replace(/_\d/, '_1');
			let newAngle;
			for (let i = 0; i < n; i++) {
				newAngle = ((i * 2 * Math.PI / n) - (Math.PI / 2)) * -1;
				if (d.petals.findIndex(el => el.day === (i + 1)) === -1) {
					d.petals.push({ angle: newAngle, logCount: 0.0225, date: '0', palette: pal })
				} else {
					continue;
				}
			}
			return d.petals;
		})
		.join('polygon')
		.attr('points', d => {
			let offset = d.date === _generatedDate.stringDate ? 0.19 : 0.1;
			let angleOff = (Math.PI / n) * 0.25;
			let angle = (d.angle * -1) - angleOff;
			let line = [], points = [];
			let path = '';
			let start, p;

			for (let i = 0; i < 3; i++) {
				if (angle < -Math.PI * 0.5) {
					angle += Math.PI * 2;
				} else if (Math.PI * 1.5 <= angle) {
					angle -= Math.PI * 2;
				}
				start = d.logCount * 2 + offset;
				points[i] = {
					x1: mainX(cX + (start * Math.cos(angle))),
					y1: mainY(cY - (start * Math.sin(angle))),
					x3: mainX(cX + (cX * Math.cos(angle))),
					y3: mainY(cY - (cX * Math.sin(angle)))
				}

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

				p = intersection(points[i].x1, points[i].y1, points[i].x3, points[i].y3, line[0].x, line[0].y, line[1].x, line[1].y);

				points[i] = { ...points[i], ...p };

				angle += angleOff;
			}
			path = `${ points[1].x1 },${ points[1].y1 } ${ points[0].x2 },${ points[0].y2 } ${ points[1].x2 },${points[1].y2} ${points[2].x2},${points[2].y2}`
			
			return path;
		})
		.style('stroke-width', d => d.date === '0' ? '2px' : '3px')
		.style('opacity', d => d.date === '0' ? 0.3 : 1)
		.style('stroke', d => d.date === _generatedDate.stringDate ? orange : palette[d.palette])
		.style('fill', d => d.date === _generatedDate.stringDate ? orange : palette[d.palette])
		.style('fill-opacity', 0.85);
	
	// diamond shape to make the whole thing clickable
	radial.append('polygon')
		.attr('points', outline)
		.style('fill', white)
		.lower();
}

function generateTextData(date, count) {
	return [
		{
			// Date
			x: window450 ? cW : width,
			// text baseline is set as the middle, so shift position down by half of the font size (+ a little for the superscript)
			y: heroDateSize * 0.6,
			html: `${date.day}<tspan class="hero hero-date sm:hero sm:hero-date hero-accent ordinal">${getOrdinal(date.day)}</tspan> ${date.date.toFormat('LLLL')}`,
			class: 'hero hero-date hero-accent sm:hero sm:hero-date',
			trans: true
		},
		{
			// "On this day..."
			x: window450 ? cW : width,
			// treat the middle text as one paragraph, centred on the diamond (in landscape)
			// adjusted for the difference between the x height and the middle baseline of josefin (x height is 0.8965 * middle) 
			y: window450 ? diamondH + diamondYOff * 1.2 + heroSize : cDiamondY - (1.5 * heroSpacing) - (1.8965 * heroCentre),
			html: `On this day in <tspan class='hero sm:hero hero-accent'>${date.date.year}</tspan>`,
			class: 'hero sm:hero',
			trans: false
		},
		{
			// "I listened to"
			x: window450 ? cW : width,
			y: window450 ? diamondH + diamondYOff * 1.2 + 2 * heroSize + heroCentre : cDiamondY - (0.5 * heroSpacing) - (0.8965 * heroCentre),
			html: 'I listened to',
			class: 'hero sm:hero',
			trans: false
		},
		{
			// "x albums"
			x: window450 ? cW : width,
			y: window450 ? diamondH + diamondYOff * 1.2 + 3 * heroSize + 2 * heroCentre : cDiamondY + (0.5 * heroSpacing) + (0.1035 * heroCentre),
			html: `<tspan class='hero sm:hero hero-accent'>${count}</tspan> album${count > 1 ? 's' : ''}`,
			class: 'hero sm:hero',
			trans: false
		},
		{
			// "for the first time"
			x: window450 ? cW : width,
			y: window450 ? diamondH + diamondYOff * 1.2 + 4 * heroSize + 3 * heroCentre : cDiamondY + (1.5 * heroSpacing) + (1.1035 * heroCentre),
			html: 'for the first time',
			class: 'hero sm:hero',
			trans: false
		}
	];
}

function skewUndo(y) {
	// skewing in the x axis shifts points by {tan(theta) * y}, where y is the distance from the transformation origin (for svg, 0,0 -- this can't be changed with transform-origin because safari doesn't like it)
	// here, translate unshifts the points by that same amount by reversing the skew direction (so x = tan(-theta) * y)
	// I've done this here rather than in the css because I've got access to the most variables here
	return `skewX(-7) translate(${y * Math.tan(7 * Math.PI / 180) })`
}

function generateButton(_dom) {
	let button = _dom.append('a')
		.attr('class', 'button')
		.attr('href', window.location.origin + '/projects/first-listens/')

	button.append('rect')
		.attr('x', buttonX + 15)
		.attr('y', buttonY + 16)
		.attr('width', buttonW)
		.attr('height', buttonH)
		.attr('transform', skewUndo(buttonY + 16))
		.style('fill', orange)
		;

	button.append('rect')
		.attr('x', buttonX)
		.attr('y', buttonY)
		.attr('width', buttonW)
		.attr('height', buttonH)
		.attr('transform', skewUndo(buttonY))
		.style('fill', white)
		.style('stroke', grey)
		.style('stroke-width', '1px')
		;

	button.append('text')
		.attr('x', width - buttonMarginX - (buttonW * 0.51))
		.attr('y', height - buttonMarginY - (heroButton * 0.6) - heroButton)
		.attr('class', 'hero hero-button sm:hero sm:hero-button')
		.text('View the full, interactive');

	button.append('text')
		.attr('x', width - buttonMarginX - (buttonW * 0.52))
		.attr('y', height - buttonMarginY - (heroButton * 0.6))
		.attr('transform', skewUndo(height - buttonMarginY - heroButton))
		.attr('class', 'hero hero-accent hero-button-accent sm:hero-button-accent')
		.text('visualisation');
}

d3.json('./projects/first-listens/Calendar-Data_All.json')
	.then((data) => {
		let date = generateDate(data);

		let url = new URL('/projects/first-listens/', window.location.origin);
		url.searchParams.set('id', date.id);
		url.searchParams.set('date', date.stringDate);
		url.hash = '#vis';

		// Create the SVG container.
		let svg = d3.create('svg:svg')
			.attr("width", width)
			.attr("height", height)
			.attr("viewBox", [0, 0, width, height])
			.attr("style", "max-width: 100%; height: auto")
			.attr('xmlns', "http://www.w3.org/2000/svg")
			.attr('id', 'plot');
		
		let flowerLink = svg.append('a')
			.attr('href', url.href);

		drawFlower(reCentre(data, date.id), flowerLink, "main");

		svg.select(`#p${date.stringDate}`)
			.style('stroke', orange)
			.attr('cx', d => mainX(cX + ((d.logCount + 0.09) * Math.cos(d.angle * -1))))
			.attr('cy', d => mainY(cY - ((d.logCount + 0.09) * Math.sin(d.angle * -1))))
			// using transform as an attr allows this to be imported into inkscape (inkscape uses svg 1.1, which doesn't support transforms using css styling)
			.attr('transform', d => `rotate(${(d.angleJS + (Math.PI / 2)) * 180 / Math.PI} ${mainX(cX + ((d.logCount + 0.09) * Math.cos(d.angle * -1)))} ${mainY(cY - ((d.logCount + 0.09) * Math.sin(d.angle * -1)))})`)
			.raise();

		let count = svg.select(`#p${date.stringDate}`).datum().count;
		
		radialLines(date, svg);

		svg.select('g.radial').lower();
	
		let textData = generateTextData(date, count);

		svg.selectAll('text')
			.data(textData)
			.join('text')
			.attr('class', d => d.class)
			.attr('x', d => d.x)
			.attr('y', d => d.y)
			.attr('transform', (d, i) => {
				let mult = i === 0 ? 0.71 : 1;
				return d.trans ? skewUndo(d.y * mult) : '';
			})
			.html(d => d.html);
		
		generateButton(svg);
		
		d3.select("#vis").append(() => svg.node());
	});

