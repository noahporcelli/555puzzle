var arrangement = [
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
var targ = 555;
var targets = [targ, targ, targ, targ];
zeroes = [0, 0, 0, 0];
var len = arrangement.length;
var width = arrangement[0].length;

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

function doStuff1() {
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
			solutions = solutions.concat(memo1[i] + memo2[i]);
		}
	}
	console.log(numSols);
	console.log(solutions);
}
