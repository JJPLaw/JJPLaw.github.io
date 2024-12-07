import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { DateTime } from 'https://cdn.jsdelivr.net/npm/luxon@3.5.0/+esm';
// import("https://cdn.jsdelivr.net/npm/d3@7/+esm").then(m=> d3 = m);

const width = 500;
const height = 500;
const marginLeft = 0;

const palette = { "1_0": "#FFFFFF", "1_1": "#D1EEEA", "1_2": "#8DC9CD", "1_3": "#67AAB7", "1_4": "#4E8FA5", "1_5": "#407A95", "1_6": "#366B87", "1_7": "#30607E", "1_8": "#2A5674", "2_0": "#FFFFFF", "2_1": "#C7E5BE", "2_2": "#73C49C", "2_3": "#4BA28E", "2_4": "#348781", "2_5": "#267374", "2_6": "#1E646A", "2_7": "#195A63", "2_8": "#14505C", "3_0": "#FFFFFF", "3_1": "#B7F1B2", "3_2": "#62DEAD", "3_3": "#2CC5AF", "3_4": "#07AFAB", "3_5": "#009FA6", "3_6": "#0391A0", "3_7": "#0D889C", "3_8": "#177F97", "4_0": "#FFFFFF", "4_1": "#EDEF5C", "4_2": "#72C570", "4_3": "#16A67E", "4_4": "#018C7F", "4_5": "#00787B", "4_6": "#0E6A75", "4_7": "#1B606F", "4_8": "#255668", "5_0": "#FFFFFF", "5_1": "#F3CBD3", "5_2": "#E08FB0", "5_3": "#C9689C", "5_4": "#AF4D8D", "5_5": "#993B81", "5_6": "#872F77", "5_7": "#79286F", "5_8": "#6C2167", "6_0": "#FFFFFF", "6_1": "#F6D2A9", "6_2": "#F1A280", "6_3": "#E98071", "6_4": "#DC676C", "6_5": "#CF5868", "6_6": "#C24D66", "6_7": "#BA4665", "6_8": "#B13F64", "7_0": "#FFFFFF", "7_1": "#FCDE9C", "7_2": "#F27F6F", "7_3": "#E34E6F", "7_4": "#D73876", "7_5": "#C22A79", "7_6": "#A72376", "7_7": "#921F73", "7_8": "#7C1D6F", "8_0": "#FFFFFF", "8_1": "#AEB6E5", "8_2": "#B68DD1", "8_3": "#BC6DB8", "8_4": "#BC569D", "8_5": "#B94686", "8_6": "#B33B72", "8_7": "#AF3663", "8_8": "#A93154" };

const years = ['2018', '2019', '2020', '2021', '2022', '2023', '2024'];

const mainX = d3.scaleLinear()
	.domain([0, 1.5])
	.range([0, width]);

const mainY = d3.scaleLinear()
	.domain([0, -1.5])
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
		for (let i = 0; i < _data.length; i++) {
			if (_data[i].id === _id) {
				newData = [structuredClone(_data[i])];
				break;
			}
		}
	}

	newData[0].x = 0.75;
	newData[0].y = -0.75;
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

d3.json('./projects/flowers/Calendar-Data_All.json')
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
			.style('stroke', 'orange')
			.attr('cx', d => mainX(0.75 + ((d.logCount + 0.09) * Math.cos(d.angle * -1))))
			.attr('cy', d => mainY(-0.75 - ((d.logCount + 0.09) * Math.sin(d.angle * -1))))
			.attr('transform', d => `rotate(${(d.angleJS + (Math.PI / 2)) * 180 / Math.PI} ${mainX(0.75 + ((d.logCount + 0.09) * Math.cos(d.angle * -1)))} ${mainY(-0.75 - ((d.logCount + 0.09) * Math.sin(d.angle * -1))) })`)
			// .attr('transform-origin', d => `${mainX(0.75 + ((d.logCount + 0.09) * Math.cos(d.angle * -1)))}px ${mainY(-0.75 - ((d.logCount + 0.09) * Math.sin(d.angle * -1))) }px`)
		// .style('translate', d => `${mainX(0.75 + ((d.logCount + 0.09) * Math.cos(d.angle * -1)))}px ${mainY(-0.75 - ((d.logCount + 0.09) * Math.sin(d.angle * -1)))}px`);
			// .style('rotate', d => `${d.angleJS + (Math.PI / 2)}rad`)

		d3.select("#vis")
			.append(() => svg.node());
		
		let info = d3.select('#info');
					
		info.select('h1')
			.html(`${date.date.day}<sup>${getOrdinal(date.date.day)}</sup> ${date.date.toFormat('LLLL')}`);
		
		info.select('p')
			.html(`On this day in ${date.date.year} I listened to:`);

		updateSecondaryInfo([d3.select(`#p${date.stringDate}`).datum()]);
	});