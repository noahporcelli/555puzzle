var arrangement, curConfig, targ, targets, zeroes, len, width, center_nums, left_nums, right_nums, centerScore, leftScore, rightScore, oppositeScore, cube_lefts, cube_fronts, cube_rights;
var right_num_Rs, right_num_Ls, left_num_Rs, left_num_Ls, wait, start_btn, startTime, timer, cheated, numTimes;
var top_time, times = [];
var center_score_L, center_score_R, left_score_L, left_score_R, right_score_L, right_score_R, opposite_score_L, opposite_score_R;
wait = 500;
numTimes = 0;
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
	center_nums = $(".row_center_num").map(function () {
		return $(this).find("span");
	}).get();
	left_nums = document.getElementsByClassName("row_left_num");
	right_nums = document.getElementsByClassName("row_right_num");
	centerScore = document.getElementsByClassName("center_score")[0].getElementsByTagName("p")[1];
	leftScore = document.getElementsByClassName("left_score")[0].getElementsByTagName("p")[1];
	rightScore = document.getElementsByClassName("right_score")[0].getElementsByTagName("p")[1];
	oppositeScore = document.getElementsByClassName("opposite_score")[0].getElementsByTagName("p")[1];

	left_num_Rs = document.getElementsByClassName("row_left_num_R");
	left_num_Ls = document.getElementsByClassName("row_left_num_L");
	right_num_Rs = document.getElementsByClassName("row_right_num_R");
	right_num_Ls = document.getElementsByClassName("row_right_num_L");

	center_score_L = document.getElementsByClassName("center_score")[0].getElementsByTagName("p")[0];
	center_score_R = document.getElementsByClassName("center_score")[0].getElementsByTagName("p")[2];
	left_score_L = document.getElementsByClassName("left_score")[0].getElementsByTagName("p")[0];
	left_score_R = document.getElementsByClassName("left_score")[0].getElementsByTagName("p")[2];
	right_score_L = document.getElementsByClassName("right_score")[0].getElementsByTagName("p")[0];
	right_score_R = document.getElementsByClassName("right_score")[0].getElementsByTagName("p")[2];
	opposite_score_L = document.getElementsByClassName("opposite_score")[0].getElementsByTagName("p")[0];
	opposite_score_R = document.getElementsByClassName("opposite_score")[0].getElementsByTagName("p")[2];

	displayConfig(arrangement);
	cube_lefts = {};
	cube_fronts = {};
	cube_rights = {};
	for (var i = 0; i < len; i++) {
		cube_lefts[i] = $("#row_" + i + " .cube_left");
		cube_rights[i] = $("#row_" + i + " .cube_right");
		cube_fronts[i] = $("#row_" + i + " .cube_front");
	}
	start_btn = document.getElementsByClassName("timer_container")[0].getElementsByClassName("btn")[0];
	timer = document.getElementById("timer");
	top_time = document.getElementById("top_time");
}
var print = function (a) { console.log(a); };
//Assumes len is even and width <= 10
var memo1 = {}, memo2 = {};
var zeroPadBefore = function (str, n) {
	var res = str + "";
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
	var totals = [[centerScore, right_score_L, left_score_R], 
				  [oppositeScore, left_score_L, right_score_R],
				  [leftScore, center_score_L, opposite_score_L],
				  [rightScore, center_score_R, opposite_score_R]];
	for (var total, col, dif, i = 0; i < 4; i++) {
		total = totals[i][0].innerHTML * 1;
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
		for (var j = 0; j < 3; j++)
			totals[i][j].style.color = col;
	}
}
var displayRow = function (rowNum) {
	var i = rowNum;
	center_nums[i][1].innerHTML = "" + curConfig[i][0];
	left_nums[i].innerHTML = "" + curConfig[i][3];
	center_nums[i][0].innerHTML = "" + curConfig[i][3];
	right_nums[i].innerHTML = "" + curConfig[i][1];
	center_nums[i][2].innerHTML = "" + curConfig[i][1];
	left_num_Rs[i].innerHTML = "" + curConfig[i][0];
	left_num_Ls[i].innerHTML = "" + curConfig[i][2];
	right_num_Rs[i].innerHTML = "" + curConfig[i][2];
	right_num_Ls[i].innerHTML = "" + curConfig[i][0];
}
var displayTotals = function () {
	var totals = findTotals(curConfig);
	centerScore.innerHTML = "" + totals[0];
	right_score_L.innerHTML = "" + totals[0];
	left_score_R.innerHTML = "" + totals[0];
	leftScore.innerHTML = "" + totals[3];
	center_score_L.innerHTML = "" + totals[3];
	opposite_score_L.innerHTML = "" + totals[3];
	rightScore.innerHTML = "" + totals[1];
	center_score_R.innerHTML = "" + totals[1];
	opposite_score_R.innerHTML = "" + totals[1];
	oppositeScore.innerHTML = "" + totals[2];
	left_score_L.innerHTML = "" + totals[2];
	right_score_R.innerHTML = "" + totals[2];
	updateTotalsColors();
}
var displayConfig = function() {
	// console.log("displayConfig");
	for (var i = 0; i < len; i++) {
		displayRow(i);
	}
	displayTotals();
}
var _rotateRowLeft = function(rowNum) {
	// console.log("rotateRowLeft(" + rowNum + ")");
	var oldRow = curConfig[rowNum];
	var newRow = oldRow.slice();
	for (var i = 0; i < width; i++)
		newRow[i] = oldRow[(i + 1) % width];
	curConfig[rowNum] = newRow;
	animateRowLeft(rowNum);
}
var _rotateRowRight = function(rowNum) {
	// console.log("rotateRowRight(" + rowNum + ")");
	var oldRow = curConfig[rowNum];
	var newRow = oldRow.slice();
	for (var i = 0; i < width; i++)
		newRow[i] = oldRow[(i + 3) % width];
	curConfig[rowNum] = newRow;
	animateRowRight(rowNum);
}
var _turnRight = function() {
	// console.log("turnRight");

	for (var i = 0; i < len; i++)
		_rotateRowRight(i);
	slideTotalsToRight();
}
var _turnLeft = function() {
	// console.log("turnLeft");
	for (var i = 0; i < len; i++)
		_rotateRowLeft(i);
	slideTotalsToLeft();
}
var animateRowLeft = function(rowNum) {
	// console.log("animateRowLeft(" + rowNum + ")");
	cube_lefts[rowNum].addClass("cube_left_L");
	cube_rights[rowNum].addClass("cube_right_L");
	cube_fronts[rowNum].addClass("cube_front_L");
	slideToLeftAndReset(rowNum);
	setTimeout(resetRow(rowNum), wait * 1);
}
var animateRowRight = function(rowNum) {
	// console.log("animateRowRight(" + rowNum + ")");
	cube_lefts[rowNum].addClass("cube_left_R");
	cube_rights[rowNum].addClass("cube_right_R");
	cube_fronts[rowNum].addClass("cube_front_R");
	slideToRightAndReset(rowNum);
	setTimeout(resetRow(rowNum), wait * 1);
}
var resetRow = function(rowNum) {
	// console.log("resetRow(" + rowNum + ")");
	return function () {
		// console.log("resetting " + rowNum);
		cube_lefts[rowNum].removeClass("transit");
		cube_rights[rowNum].removeClass("transit");
		cube_fronts[rowNum].removeClass("transit");
		if (cube_lefts[rowNum].hasClass("cube_left_L"))
			cube_lefts[rowNum].removeClass("cube_left_L");
		else if (cube_lefts[rowNum].hasClass("cube_left_R"))
			cube_lefts[rowNum].removeClass("cube_left_R");

		if (cube_rights[rowNum].hasClass("cube_right_L"))
			cube_rights[rowNum].removeClass("cube_right_L");
		else if (cube_rights[rowNum].hasClass("cube_right_R"))
			cube_rights[rowNum].removeClass("cube_right_R");

		if (cube_fronts[rowNum].hasClass("cube_front_L"))
			cube_fronts[rowNum].removeClass("cube_front_L");
		else if (cube_fronts[rowNum].hasClass("cube_front_R"))
			cube_fronts[rowNum].removeClass("cube_front_R");
		displayRow(rowNum);
		displayTotals();
		setTimeout(function () {
			cube_lefts[rowNum].addClass("transit");
			cube_rights[rowNum].addClass("transit");
			cube_fronts[rowNum].addClass("transit");
		}, 200);
	};
}
var slideTotalsToLeft = function () {
	leftScore.classList.add("fadeToLeft");
	left_score_R.classList.add("fadeFromRight");
	rightScore.classList.add("fadeToLeft");
	right_score_R.classList.add("fadeFromRight");
	centerScore.classList.add("fadeToLeft");
	center_score_R.classList.add("fadeFromRight");
	oppositeScore.classList.add("fadeToRight");
	opposite_score_L.classList.add("fadeFromLeft")
	setTimeout(function () {
		leftScore.classList.remove("fadeToLeft");
		left_score_R.classList.remove("fadeFromRight");
		rightScore.classList.remove("fadeToLeft");
		right_score_R.classList.remove("fadeFromRight");
		centerScore.classList.remove("fadeToLeft");
		center_score_R.classList.remove("fadeFromRight");
		oppositeScore.classList.remove("fadeToRight");
		opposite_score_L.classList.remove("fadeFromLeft")
	}, wait);
}

var slideTotalsToRight = function () {
	leftScore.classList.add("fadeToRight");
	left_score_L.classList.add("fadeFromLeft");
	rightScore.classList.add("fadeToRight");
	right_score_L.classList.add("fadeFromLeft");
	centerScore.classList.add("fadeToRight");
	center_score_L.classList.add("fadeFromLeft");
	oppositeScore.classList.add("fadeToLeft");
	opposite_score_R.classList.add("fadeFromRight")
	setTimeout(function () {
		leftScore.classList.remove("fadeToRight");
		left_score_L.classList.remove("fadeFromLeft");
		rightScore.classList.remove("fadeToRight");
		right_score_L.classList.remove("fadeFromLeft");
		centerScore.classList.remove("fadeToRight");
		center_score_L.classList.remove("fadeFromLeft");
		oppositeScore.classList.remove("fadeToLeft");
		opposite_score_R.classList.remove("fadeFromRight")
	}, wait);
}

var slideToLeftAndReset = function (rowNum) {
	left_nums[rowNum].classList.add("fadeToLeft");
	left_num_Rs[rowNum].classList.add("fadeFromRight");
	right_nums[rowNum].classList.add("fadeToLeft");
	right_num_Rs[rowNum].classList.add("fadeFromRight");
	setTimeout(function () {
		left_nums[rowNum].classList.remove("fadeToLeft");
		left_num_Rs[rowNum].classList.remove("fadeFromRight");
		right_nums[rowNum].classList.remove("fadeToLeft");
		right_num_Rs[rowNum].classList.remove("fadeFromRight");
	}, wait);
}
var slideToRightAndReset = function (rowNum) {
	left_nums[rowNum].classList.add("fadeToRight");
	left_num_Ls[rowNum].classList.add("fadeFromLeft");
	right_nums[rowNum].classList.add("fadeToRight");
	right_num_Ls[rowNum].classList.add("fadeFromLeft");
	setTimeout(function () {
		left_nums[rowNum].classList.remove("fadeToRight");
		left_num_Ls[rowNum].classList.remove("fadeFromLeft");
		right_nums[rowNum].classList.remove("fadeToRight");
		right_num_Ls[rowNum].classList.remove("fadeFromLeft");
	}, wait);
}
var solve = function () {
	cheated = true;
	memo1 = {};
	memo2 = {};
	var sols = genSols(curConfig);
	var sol = sols[0].split("");
	for (var i = 0; i < len; i++)
		sol[i] = (4 - sol[i]) % 4;
	// console.log(sol); return;
	// console.log(sols);
	showConfig(sol);
}
var showConfig = function (config, callback) {
	var sol = config.slice();
	for (var i = 0; i < len; i++) {
		// if (sol[i] != "0") {
		// 	if (sol)
		// 	sol[i]--;
		// 	_rotateRowRight(i);
		// }
		if (sol[i] == "3") {
			sol[i] = "0";
			_rotateRowLeft(i);
		} else if (sol[i] != "0") {
			sol[i]--;
			_rotateRowRight(i);
		}
	}
	var isDone = true;
	for (var i = 0; i < len; i++)
		if (sol[i] != 0)
			isDone = false;
	if (isDone) {
		if (callback)
			callback();
		return;
	}
	setTimeout(function () {showConfig(sol, callback); }, wait * 1.3);
	// showConfig(sol);
}
rotateRowLeft = _.throttle(_rotateRowLeft, wait * 1.8);
rotateRowRight = _.throttle(_rotateRowRight, wait * 1.8);
turnLeft = _.throttle(_turnLeft, wait * 1.8);
turnRight = _.throttle(_turnRight, wait * 1.8);
var isPuzzleDone = function () {
	var totals = [0, 0, 0, 0];
	for (var i = 0; i < len; i++) 
		for (var j = 0; j < width; j++) {
			totals[j] += curConfig[i][j];
		 	if (totals[j] > targ)
		 		return false;
		}
	return true;
}
var start = function () {
	cheated = false;
	start_btn.innerHTML = "Restart";
	start_btn.style.paddingLeft = "31px";
	start_btn.style.paddingRight = "30px";
	startTimer();
}
var startTimer = function () {
	startTime = new Date();
	interval = window.setInterval(function () { 
		displayTime();
		checkForDone();
	}, 11);
}
var checkForDone = function () {
	var done = isPuzzleDone();
	if (!done)
		return;
	if (!cheated)
		alert("Congratulations!");
	else {
		window.clearInterval(interval);
		return;
	}
	numTimes++;
	setTopTime();
	window.clearInterval(interval);
}
var displayTime = function () {
	var curTime = new Date();
	var eTime = curTime - startTime;
	var milliseconds = Math.floor((eTime % 1000)/ 10);
	var secs = Math.floor(eTime / 1000) % 60;
	var mins = Math.floor(eTime / 60000);
	milliseconds = zeroPadBefore(milliseconds, 2);
	secs = zeroPadBefore(secs, 2);
	mins = zeroPadBefore(mins, 2);
	// console.log(milliseconds);
	timer.innerHTML = mins + ":" + secs + ":" + milliseconds;
}
var startGame = function () {
	var randomConfig = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	for (var i = 0; i < len; i++)
		randomConfig[i] = Math.floor(width * Math.random());
	showConfig(randomConfig, start);
}
var setTopTime = function () {

}
