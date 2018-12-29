
function progressLine() {

	var line = new ProgressBar.Line(container_line, {
	strokeWidth : 5,
	easing : 'linear',
	duration : 3000,
	color : '#FFFF70',
	trailColor : '#eee',
	trailWidth : 5,
	});
	return line;
}

function progressStart(line){
	line.animate(1.0);
}