var arrangement, curConfig, targ, targets, zeroes, len, width,
	center_nums, left_nums, right_nums, centerScore, leftScore, rightScore, oppositeScore;
function do_setups() {
	arrangement = [
		[25, 60, 95, 30],
		[20, 70, 55, 25],
		[10, 20, 50, 55],
		[15, 45, 55, 65],
		[55, 90, 80, 90],
		[55, 60, 90, 85],
		[15, 55, 45, 95],
		[55, 55, 75, 65],
		[35, 55, 55, 70],
		[55, 55, 60, 75]
	];
	curConfig = arrangement;
	targ = 555;
	targets = [targ, targ, targ, targ];
	zeroes = [0, 0, 0, 0];
	len = 10
	width = 4
	center_nums = document.getElementsByClassName("row_center_num");
	left_nums = document.getElementsByClassName("row_left_num");
	right_nums = document.getElementsByClassName("row_right_num");
	centerScore = document.getElementsByClassName("center_score")[0].getElementsByTagName("p")[0];
	leftScore = document.getElementsByClassName("left_score")[0].getElementsByTagName("p")[0];
	rightScore = document.getElementsByClassName("right_score")[0].getElementsByTagName("p")[0];
	oppositeScore = document.getElementsByClassName("opposite_score")[0].getElementsByTagName("p")[0];
	displayConfig(arrangement);
}
var print = function (a) { console.log(a); };
//Assumes len is even and width <= 10
var memo1 = {}, memo2 = {};
var zeroPadBefore = function (str, n) {
var res = str;
	while(res.length < n) {
		res = "0" + res;
	}
	return res;
};
var findTotals = function(config) {
	var totals = [0, 0, 0, 0];
	for (var i = 0; i < len; i++) 
		for (var j = 0; j < width; j++) 
			totals[j] += config[i][j];
	return totals;
}

var genSols = function () {
	var config, totalsLeft, totalsGone, hashCode;
	for (var iter = 0; iter < Math.pow(width, -1 + len / 2); iter++) {
		totalsLeft = targets.slice();
		config = iter.toString(width);
		config = zeroPadBefore(config, len / 2);
		for (var i = 0; i < width; i++) {
			for (var j = 0; j < len / 2; j++) {
				totalsLeft[i] -= arrangement[j][(i + config[j] * 1) % width];
			}
		}
		hashCode = totalsLeft.join(",");
		if (config in memo1)
			memo1[hashCode] = memo1[hashCode].concat(config);
		else
			memo1[hashCode] = [config];
	}

	for (var iter = 0; iter < Math.pow(width, len / 2); iter++) {
		totalsGone = zeroes.slice();
		config = iter.toString(width);
		config = zeroPadBefore(config, len / 2);
		for (var i = 0; i < width; i++) {
			for (var j = 0; j < len / 2; j++) {
				totalsGone[i] += arrangement[j + len / 2][(i + config[j] * 1) % width];
			}
		}
		hashCode = totalsGone.join(",");
		if (config in memo2)
			memo2[hashCode] = memo2[hashCode].concat(config);
		else
			memo2[hashCode] = [config];
	}
	var numSols = 0;
	var solutions = [];
	for (var i in memo1) {
		if (i in memo2) {
			numSols += memo1[i].length * memo2[i].length;
			for (var k in memo1[i]) 
				for (var m in memo2[i])
					solutions = solutions.concat(memo1[i][k] + memo2[i][m]);
			//solutions = solutions.concat(memo1[i] + memo2[i]);
		}
	}
	//console.log(numSols);
	//console.log(solutions);
	return solutions;
}

var updateTotalsColors = function() {
	var totals = [centerScore, oppositeScore, leftScore, rightScore];
	for (var total, col, dif, i = 0; i < 4; i++) {
		total = totals[i].innerHTML * 1;
		dif = Math.abs(total - targ);
		if (dif == 0)
			col = "#00CC00";
		else if (dif < 20)
			col = "#FFFF00";
		else if (dif < 60)
			col = "#FF9900";
		else if (dif < 100)
			col = "#FF3300";
		else if (dif < 140)
			col = "red";
		else
			col = "brown";
		totals[i].style.color = col;
	}
}

var displayConfig = function(config) {
	for (var i = 0; i < len; i++) {
		center_nums[i].innerHTML = "<span>" + config[i][0] + "</span>";
		left_nums[i].innerHTML = "" + config[i][3];
		right_nums[i].innerHTML = "" + config[i][1];
	}
	var totals = findTotals(config);
	centerScore.innerHTML = "" + totals[0];
	leftScore.innerHTML = "" + totals[3];
	rightScore.innerHTML = "" + totals[1];
	oppositeScore.innerHTML = "" + totals[2];
	updateTotalsColors();
}
var rotateRowLeft = function(rowNum) {
	var oldRow = curConfig[rowNum];
	var newRow = oldRow.slice();
	for (var i = 0; i < width; i++)
		newRow[i] = oldRow[(i + 1) % width];
	curConfig[rowNum] = newRow;
}
var rotateRowRight = function(rowNum) {
	var oldRow = curConfig[rowNum];
	var newRow = oldRow.slice();
	for (var i = 0; i < width; i++)
		newRow[i] = oldRow[(i + 3) % width];
	curConfig[rowNum] = newRow;
}
var turnRight = function() {
	for (var i = 0; i < len; i++)
		rotateRowRight(i);
	displayConfig(curConfig);
}
var turnLeft = function() {
	for (var i = 0; i < len; i++)
		rotateRowLeft(i);
	displayConfig(curConfig);
}
