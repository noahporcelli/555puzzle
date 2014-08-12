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
var width = arrangement[0].length;
var len = arrangement.length;
var targ = 555;

//Returns the length of an object
function length(obj) {
	//done
	var res = 0;
	for (var key in obj) 
		res ++;
	return res;
}

function print(txt) {
	//done
	console.log(txt);
}

//Returns whether or not a configuration works, given the (global) arrangement of the numbers
function configWorks(config) {
	var sums = {};
	for (var i = 0; i < width; i++) 
		sums[i] = 0;


	if (length(config) > len) 
		return 0;
	
	for (var i = 0; i < len; i++) {
		for (var j = 0; j < width; j++) 
			if (sums[j] > targ) 
				return 0;

		for (var j = 0; j < width; j++) 
			sums[j] += arrangement[i][(config[i] + j) % width];
	}

	for (var i = 0; i < width; i++) 
		if (sums[i] != targ) 
			return 0;
		
	return 1;
}

//Iterator that generatesconfiguration
function generateConfig(iter) {
	var len = arrangement.length;
	var numConfigs = Math.pow(4, len - 1);
	if (iter >= numConfigs) 
		return 0;
	
	var ans1 = iter.toString(4).split("");
	var ans2 = {}
	for (var m = 0; m < len; m++) 
		ans2[m] = 0;

	for (var k = 0; k < ans1.length; k++) {
		ans2[k] = Number(ans1[k]);
		if (k >= len) {
			print(ans1);//////////////////////////
			return 0;
		}
	}
	return ans2;
}

//Solves the 555 thing
function doStuff() {
	var iter = 0;
	var j = generateConfig(iter);
	var numSolutions = 0;

	while (j != 0) {
		if (configWorks(j)) {
			print(j);
			numSolutions++;
		}
		iter++;
		j = generateConfig(iter);
	}

	print(numSolutions);
}

////////////////////////////////////////////////////////////////////////////////////////////////   Method #2

arrangement = arrangement;
width = width;
targ = targ;
len = len;

memo = {};
function absMod (a, b) {
	//returns a % b but the positive value
	if (a >= 0)
		return a % b;
	else
		return (a % b) + b;
}

function shift(arr, n) {
	//Rotates arr by n to the right
	var res = [];
	for (var i = 0; i < arr.length; i++) {
		res.push(arr[absMod(i - n, arr.length)]);
	}
	return res;
}

function subtract(arr1, arr2) {
	//Subtractrs arr2 from arr1
	var res = [];
	for (var i = 0; i < arr1.length; i++) 
		res.push(arr1[i] - arr2[i]);

	return res;
}

function concat(arr1, arr2) {
	//returns an array which is arr1 concatenated to arr2
	var res = [];
	for (var i = 0; i < arr1.length; i++)
		res.push(arr1[i]);
	for (var j = 0; j < arr2.length; j++)
		res.push(arr2[j]);

	return res;
}

