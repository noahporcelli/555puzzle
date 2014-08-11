//555puzzle.js
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
// var arrangement = [
// [5, 10, 15, 20],
// [20, 15, 10, 5]
// ];
var len = arrangement.length;
var targ = 555;
// var targ = 25;

//Returns the length of an object
function length(obj) {
	//done
	var res = 0;
	for (var key in obj) {
		res ++;
	}
	return res;
}

function print(txt) {
	//done
	console.log(txt);
}

//Returns whether or not a configuration works, given the (global) arrangement of the numbers
function configWorks(config) {
	//This function needs to be changed so it takes arrangement as an argument and also has support if puzzle has a different number of sides than 4.
	var sum1 = 0;
	var sum2 = 0;
	var sum3 = 0;
	var sum4 = 0;
	if (length(config) > len) {
		// print(config);
		return 0;
	}
	for (var i = 0; i < len; i++) {
		if (sum1 > targ || sum2 > targ || sum3 > targ || sum4 > targ) {
			return 0;
		}
		sum1 += arrangement[i][(config[i] + 1) % 4];
		sum2 += arrangement[i][(config[i] + 2) % 4];
		sum3 += arrangement[i][(config[i] + 3) % 4];
		sum4 += arrangement[i][(config[i] + 4) % 4];
	}
	return (sum1 == targ && sum2 == targ && sum3 == targ && sum4 == targ);
}

//Iterator that generates next configuration
var __generateNextConfig_iteratorCount = 0;
function generateNextConfig() {
	//This funciton needs to be changed so that it takes the iterator as an argument
	var len = arrangement.length;
	var numConfigs = Math.pow(4, len - 1);
	//numConfigs /= 4;
	if (__generateNextConfig_iteratorCount >= numConfigs) {
		return 0;
	}
	var ans1 = __generateNextConfig_iteratorCount.toString(4).split("");
	var ans2 = {}
	for (var m = 0; m < len; m++) {
		ans2[m] = 0;
	}
	for (var k = 0; k < ans1.length; k++) {
		ans2[k] = Number(ans1[k]);
		if (k >= len) {
			print(ans1);
			return 0;
		}
	}
	__generateNextConfig_iteratorCount++;
	return ans2;
}
print(Math.pow(4, len-1));
print(Math.pow(4, len-1).toString(4));
//Solves the 555 thing
function doStuff() {
	//This function needs to be changed?
	var j = generateNextConfig();
	var numSolutions = 0;
	while (j != 0) {
		if (configWorks(j)) {
			print(j);
			numSolutions++;
		}
		j = generateNextConfig();
	}
	print(numSolutions);
}
