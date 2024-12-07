import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
// import("https://cdn.jsdelivr.net/npm/d3@7/+esm").then(m=> d3 = m);

const marginLeft = 120;
const height = 1200;
const width = ((height) * (8 / 13)) + marginLeft;
const popWidth = width;
const legendWidth = 200;
const legendHeight = 120;
const years = ['2018', '2024'];
const months = ['January', 'December'];

let window1190 = window.matchMedia('(max-width: 1190px');
let popMargin = window1190.matches ? 0 : 35;
window1190.onchange = (e) => {
	if (e.matches) {
		popMargin = 0;
	} else {
		popMargin = 35;
	}
};

let window858 = window.matchMedia(`(max-width: ${width}px)`);
let popOuterMargin = window858.matches ? window.innerWidth : width;

let favourite = document.querySelector('input#favourite');

const petalData = [
	{ x: 0.1875, h: 0.1025261, t: '1', p: '4_1' },
	{ x: 0.3750, h: 0.1625000, t: '2', p: '4_2' },
	{ x: 0.5625, h: 0.2050522, t: '3', p: '4_3' },
	{ x: 0.7500, h: 0.2380582, t: '4', p: '4_4' },
	{ x: 0.9375, h: 0.2650261, t: '5', p: '4_5' },
	{ x: 1.1250, h: 0.2878271, t: '6', p: '4_6' },
	{ x: 1.3125, h: 0.3075783, t: '7', p: '4_7' },
	{ x: 1.5000, h: 0.3250000, t: '8', p: '4_8' }
];

const palette = { "1_0": "#FFFFFF", "1_1": "#D1EEEA", "1_2": "#8DC9CD", "1_3": "#67AAB7", "1_4": "#4E8FA5", "1_5": "#407A95", "1_6": "#366B87", "1_7": "#30607E", "1_8": "#2A5674", "2_0": "#FFFFFF", "2_1": "#C7E5BE", "2_2": "#73C49C", "2_3": "#4BA28E", "2_4": "#348781", "2_5": "#267374", "2_6": "#1E646A", "2_7": "#195A63", "2_8": "#14505C", "3_0": "#FFFFFF", "3_1": "#B7F1B2", "3_2": "#62DEAD", "3_3": "#2CC5AF", "3_4": "#07AFAB", "3_5": "#009FA6", "3_6": "#0391A0", "3_7": "#0D889C", "3_8": "#177F97", "4_0": "#FFFFFF", "4_1": "#EDEF5C", "4_2": "#72C570", "4_3": "#16A67E", "4_4": "#018C7F", "4_5": "#00787B", "4_6": "#0E6A75", "4_7": "#1B606F", "4_8": "#255668", "5_0": "#FFFFFF", "5_1": "#F3CBD3", "5_2": "#E08FB0", "5_3": "#C9689C", "5_4": "#AF4D8D", "5_5": "#993B81", "5_6": "#872F77", "5_7": "#79286F", "5_8": "#6C2167", "6_0": "#FFFFFF", "6_1": "#F6D2A9", "6_2": "#F1A280", "6_3": "#E98071", "6_4": "#DC676C", "6_5": "#CF5868", "6_6": "#C24D66", "6_7": "#BA4665", "6_8": "#B13F64", "7_0": "#FFFFFF", "7_1": "#FCDE9C", "7_2": "#F27F6F", "7_3": "#E34E6F", "7_4": "#D73876", "7_5": "#C22A79", "7_6": "#A72376", "7_7": "#921F73", "7_8": "#7C1D6F", "8_0": "#FFFFFF", "8_1": "#AEB6E5", "8_2": "#B68DD1", "8_3": "#BC6DB8", "8_4": "#BC569D", "8_5": "#B94686", "8_6": "#B33B72", "8_7": "#AF3663", "8_8": "#A93154" };

const mainX = d3.scaleLinear()
	.domain([0, 8])
	.range([0, width-marginLeft]);

const mainY = d3.scaleLinear()
	.domain([0, -13])
	.range([0, height]);

const lg = d3.scaleLog()
	.domain([1, 9])
	.range([0, 0.325]);

const legX = d3.scaleLinear()
	.domain([0, 1.5])
	.range([0, legendWidth]);

const legY = d3.scaleLinear()
	.domain([0, -1.5])
	.range([0, legendWidth]);

const legPX = d3.scaleLinear()
	.domain([0, 1.7])
	.range([0, legendWidth]);

const legPY = d3.scaleLinear()
	.domain([0, -0.8])
	.range([0, legendHeight]);

const popX = d3.scaleLinear()
	.domain([0, 1.5])
	.range([0, popWidth]);

const popY = d3.scaleLinear()
	.domain([0, -1.5])
	.range([0, popWidth]);

function getOrdinal(_day) {
	let day = _day.toString();
	if (day === '1' || day === '21' || day === '31') {
		return "st"
	} else if (day === '2' || day === '22') {
		return "nd"
	} else if (day === '3' || day === '23') {
		return "rd"
	} else return "th";
}

function updatePrimaryInfo(d) {
	d3.select('#info')
		.selectAll('h4')
		.data(d)
		.join('h4')
		.text(d => `${d.fMonth} ${d.year}, ${d.total} albums`);
};

function updateSecondaryInfo(d) {
	d3.select('#info')
		.selectAll('h5')
		.data(d)
		.join('h5')
		.text(d => `${d.wDay} ${d.day}`)
		.append('sup')
		.text(d => getOrdinal(d.day))
		;

	d3.select('#info ol')
		.selectAll('li')
		.data(d[0].data)
		.join('li')
		.attr('class', d => d.fav ? 'favourite-album' : undefined)
		.html((d) => `<p style="grid-column:span 2">${d.album} by ${d.artist} (${d.released})<br/></p>`)
		.style('font-weight', 'initial')
		;
	
	d3.selectAll('.favourite-album')
		.style('font-weight', 700)

	let favouriteContainer = d3.selectAll('.favourite-album')
		.append('div')
		.attr('class', 'favourite-container');
	
	if (favouriteContainer._groups[0].length !== 0) { //this prevents an error with trying to read an empty variable
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
};

function drawFlower(_data, _dom, main) {
	let x, y, margin, cursor;
	switch (main) {
		case "main":
			x = mainX;
			y = mainY;
			margin = marginLeft;
			cursor = 'auto';
			break;
		case "leg":
			x = legX;
			y = legY;
			margin = 0;
			cursor = 'auto';
			break;
		case "pop":
			x = popX;
			y = popY;
			margin = popMargin;
			cursor = 'pointer';
			break;
	};

	let flower = _dom.append('g')
		.attr('class', 'flowers')
		.selectAll('g')
		.data(_data)
		.join('g')
		.attr('class', 'flower')
		.attr('id', d => d.id);

	if (main === 'main') {
		flower.on('mouseleave', () => {
				if (!document.querySelector('#popup')) d3.select('#info h4').text('');
			});
	};
	
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
		.style('translate', d => `${x(d.x0) + margin}px ${y(d.y0)}px`)
		.style('rotate', d => `${d.angleJS + (Math.PI / 2)}rad`)
		.style('fill', d => palette[d.palette])
		.style('fill-opacity', 0.85)
		.style('stroke', d => palette[d.palette])
		.style('stroke-width', `${x(0.006)}pt`)
		.style('cursor', cursor);
	
	if (main === 'pop') {
		petals.on('click', (e, d) => {
			d3.select(e.target.parentNode)
				.selectAll('.petal')
				.style('stroke', (d) => {
					if (favourite.checked) {
						return d.fav ? '#595959' : palette[d.palette]
					} else return palette[d.palette]
				})
				.style('translate', d => `${x(d.x0) + margin}px ${y(d.y0)}px`)
				;
			
			d3.select(e.target)
				.style('stroke', 'orange')
				.style('translate', d => `${x(0.75 + ((d.logCount + 0.09) * Math.cos(d.angle * -1))) + margin}px ${y(-0.75 - ((d.logCount + 0.09) * Math.sin(d.angle * -1)))}px`)
				;
			
			updateSecondaryInfo([d]);
		})
	};

	// Create the centre discs
	let discs = flower.append('circle')
		.attr('cx', d => x(d.x) + margin)
		.attr('cy', d => y(d.y))
		.attr('r', x(0.045))
		.style('fill', d => palette[d.centre_fill])
		.style('stroke', d => palette[d.centre_col])
		.style('stroke-width', `${x(0.006)}pt`);
	
	// Create rects for selection, if main
	if (main === 'main') {
		let clickers = flower.append('rect')
			.attr('id', d => d.id)
			.attr('x', d => x(d.x - 0.5) + margin)
			.attr('y', d => y(d.y + 0.5))
			.attr('width', x(1))
			.attr('height', y(-1))
			.style('fill', '#00000000')
			.style('cursor', 'pointer')
			.on('mousemove', (e, d) => updatePrimaryInfo([d]))
			.on('click', (e, d) => popupGenerator(d));
	};

};

// Re-centre the data at 1,-1 for individual plots
function reCentre(_data, _id, leg = false) {
	let newData;

	if (!_id) {
		newData = [structuredClone(_data)];
	} else {
		for (let i = 0; i < _data.length; i++) {
			if (_data[i].id === _id) {
				newData = [structuredClone(_data[i])];
				break;
			}
		}
	};

	newData[0].x = 0.75;
	newData[0].y = -0.75;
	for (let i = 0; i < newData.length; i++) {
		newData[i]['centre_col'] = leg ? newData[i]['centre_col'].replace(/\d_/, '4_') : newData[i]['centre_col'];
		newData[i]['centre_fill'] = leg ? newData[i]['centre_fill'].replace(/\d_/, '4_') : newData[i]['centre_fill'];
		for (let j = 0; j < newData[i]['petals'].length; j++) {
			newData[i]['petals'][j]['x0'] = newData[i]['x'] + (newData[i]['petals'][j]['logCount'] * Math.cos(newData[i]['petals'][j]['angle'] * -1));
			newData[i]['petals'][j]['y0'] = newData[i]['y'] - (newData[i]['petals'][j]['logCount'] * Math.sin(newData[i]['petals'][j]['angle'] * -1));
			newData[i]['petals'][j]['palette'] = leg ? newData[i]['petals'][j]['palette'].replace(/\d_/, '4_') : newData[i]['petals'][j]['palette'];
		};
	};
	return newData;
};

function popupGenerator(d) {

	let popup = d3.create('svg:svg')
		.attr("width", width)
		.attr("height", height)
		.attr("viewBox", [0, 0, width, height])
		.attr('id', 'popup')
		.attr("style", `max-width: 100%; height: auto; background: #F9F6EE80; margin-left: -${popOuterMargin}px; overflow: visible`);

	let popDefs = popup.append('defs');
	
	popDefs.append('filter')
		.attr('id', 'flowerShadow')
		.append('feDropShadow')
		.attr('dx', 0)
		.attr('dy', 0)
		.attr('stdDeviation', 5)
		.attr('flood-color', 'var(--main-font-colour)')
		.attr('flood-opacity', 0.5);
	
	popDefs.append('filter')
		.attr('id', 'boxShadow')
		.append('feDropShadow')
		.attr('dx', 0)
		.attr('dy', 0)
		.attr('stdDeviation', 5)
		.attr('flood-color', 'var(--main-font-colour)')
		.attr('flood-opacity', 0.2);

	popup.append('rect')
		.attr('x', popX(0.15) + popMargin)
		.attr('y', popY(-0.15))
		.attr('width', popX(1.2) + popMargin)
		.attr('height', popY(-1.3))
		.attr('rx', 5)
		.attr('ry', 5)
		.attr('filter', 'url(#boxShadow)')
		.style('fill', 'var(--main-background-color)')
		.on('click', (e, d) => {
			popup.select('.flower')
				.selectAll('.petal')
				.style('stroke', d => palette[d.palette])
				// .style('stroke-width', `${x(0.006)}pt`)
				.style('translate', d => `${popX(d.x0) + popMargin}px ${popY(d.y0)}px`)
				;
			
			d3.select('#info h5').text('');
			d3.selectAll('#info li').remove();
		});

	drawFlower(reCentre(d, false), popup, 'pop');
	if (favourite.checked) {
		popup.selectAll('.petal')
			.style('stroke', d => d.fav ? '#595959' : palette[d.palette])
			.style('fill-opacity', d => d.fav ? 1 : 0.85)
			.style('opacity', d => d.fav ? 1 : 0.3);
	}

	popup.append('path')
		.attr('d', `M ${popX(0.2) + popMargin},${popY(-0.2)} L ${popX(0.25) + popMargin},${popY(-0.25)} M ${popX(0.2) + popMargin},${popY(-0.25)} L ${popX(0.25) + popMargin},${popY(-0.2)}`)
		.attr('stroke-linecap', 'round');

	popup.append('rect')
		.attr('x', popX(0.17) + popMargin)
		.attr('y', popY(-0.17))
		.attr('width', popX(0.1) + popMargin)
		.attr('height', popY(-0.1))
		.attr('rx', 5)
		.attr('ry', 5)
		.attr('fill', '#00000000')
		.attr('id', 'close')
		.style('cursor', 'pointer')	
		.on('click', () => {
			d3.select('#popup').remove();
			d3.select('#info h4').text('');
			d3.select('#info h5').text('');
			d3.selectAll('#info li').remove();
		});
	
	popup.selectAll('text')
		.data([d])
		.join('text')
		.text(d => `${d.fMonth} ${d.year}`)
		.attr('x', popX(0.75) + popMargin)
		.attr('y', popY(-1.35))
		.attr('font-weight', 400)
		;

	d3.select('#vis').append(() => popup.node());
};


d3.json('Calendar-Data_All.json')
	.then(function (data) {

		// Create the SVG container.
		let svg = d3.create('svg:svg')
			.attr("width", width)
			.attr("height", height)
			.attr("viewBox", [0, 0, width, height])
			.attr("style", "max-width: 100%; height: auto")
			.attr('id', 'plot');			
		
		// Create the arrowhead for the axis lines
		let arrow = svg.append('svg:defs')
			.append('svg:marker')
			.attr('viewBox', [0, 0, 12, 12])
      		.attr('refX', 6)
      		.attr('refY', 6)
			.attr('markerWidth', 6)
			.attr('markerHeight', 6)
			.attr('orient', `auto-start-reverse`)
			.attr('id', 'arrowhead')
			.append('path')
			.attr('d', `M 1,1 L 11,6 L 1,11 z`)
			.attr('stroke-linejoin', 'round');
		
		// Create the axes
		let xAxis = svg.append('g')
			.attr('class', 'x-axis axis');
			
		xAxis.selectAll('text')
			.data(years)
			.join('text')
			.text(d => d)
			.each(function (d, i) {
				let xPos = i === 0 ? mainX(1) + marginLeft : mainX(7) + marginLeft;
				d3.select(this)
					.style('translate', `${xPos}px ${mainY(-0.28)}px`);
			});
		
		xAxis.append('line')
			.attr('x1', mainX(1.75) + marginLeft)
			.attr('y1', mainY(-0.3))
			.attr('x2', mainX(6.25) + marginLeft)
			.attr('y2', mainY(-0.3))
			.attr('marker-end', `url(#arrowhead)`);
		
		let yAxis = svg.append('g')
			.attr('class', 'y-axis axis');
		
		yAxis.selectAll('text')
			.data(months)
			.join('text')
			.text(d => d)
			.each(function (d, i) {
				let yPos = i === 0 ? mainY(-1) : mainY(-12);
				d3.select(this)
					.style('translate', `${marginLeft*0.7}px ${yPos}px`);
			});
		
		yAxis.append('line')
			.attr('x1', marginLeft * 0.7)
			.attr('y1', mainY(-1.5))
			.attr('x2', marginLeft * 0.7)
			.attr('y2', mainY(-11.5))
			.attr('marker-end', `url(#arrowhead)`);
	
		drawFlower(data, svg, "main");
		d3.select("#vis")
			.append(() => svg.node());
		
		// Legend flower plot
		let legDates = d3.create('svg:svg')
			.attr("width", legendWidth)
			.attr("height", legendWidth)
			.attr("viewBox", [0, 0, legendWidth, legendWidth])
			.attr("style", "max-width: 100%; height: auto;");
		
		let legDatesAnnot = legDates.append('g')
			.attr('class', 'annotation');
		
		legDatesAnnot.append('path')
			.attr('d', `M ${legX(0.75)},${legY(-0.1)} L ${legX(0.75)},${legY(-0.75)}`)
			.attr('stroke-dasharray', 5);
		
		legDatesAnnot.append('path')
			.attr('d', `M ${legX(0.75)},${legY(-0.1)} A ${legX(0.65)} ${legY(-0.65)} 0 1 1 ${legX(0.75 + (0.65 * Math.cos(Math.PI * 1.75) * -1))},${legY(-0.75 - (0.65 * Math.sin(Math.PI * 1.75) * -1))}`)
			.attr('fill', 'none')
			.attr('marker-end', `url(#arrowhead)`)
			.attr('stroke-linecap', 'square');
		
		legDatesAnnot.append('text')
			.attr('class', 'legText')
			.text("1")
			.attr('x', legX(0.65))
			.attr('y', legY(-0.1))
			.append('tspan') // tspan adds a separate span of text that can have its own styling within a larger text element
				.text('st')
				.attr('font-size', '0.7rem')
				.attr('dy', '-0.1rem');
		
		drawFlower(reCentre(data, "Aug_2022", true), legDates, "leg");

		d3.select("#dates").append(() => legDates.node());
		
		// Legend size petal plot
		let legPetals = d3.create('svg:svg')
			.attr("width", legendWidth)
			.attr("height", legendHeight)
			.attr("viewBox", [0, 0, legendWidth, legendHeight])
			.attr("style", "max-width: 100%; height: auto;");

		legPetals.selectAll('ellipse')
			.data(petalData)
			.join('ellipse')
			.attr('rx', d => legPX(d.h * 0.12))
			.attr('ry', d => legPY(d.h * -1))
			.style('translate', d => `${legPX(d.x)}px ${legPY(-0.65 + (d.h))}px`)
			.style('fill', d => palette[d.p])
			.style('stroke', d => palette[d.p]);
		
		legPetals.selectAll('text')
			.data(petalData)
			.join('text')
			.text(d => d.t)
			.attr('class', 'legText')
			.attr('x', d => legPX(d.x))
			.attr('y', legPY(-0.75));

		d3.select('#petals').append(() => legPetals.node());
		

		d3.select(favourite)
			.on('click', (e, d) => {
				if (favourite.checked) {
					d3.select('#vis')
						.selectAll('.petal')
						.style('stroke', d => d.fav ? '#595959' : palette[d.palette])
						.style('fill-opacity', d => d.fav ? 1 : 0.85)
						.style('opacity', d => d.fav ? 1 : 0.3);
				}
				else {
					d3.select('#vis')
						.selectAll('.petal')
						.style('stroke', d => palette[d.palette])
						.style('fill-opacity', 0.85)
						.style('opacity', 1);
				}
			});
	});