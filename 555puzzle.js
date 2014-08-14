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
// arrangement = [
// [7, 8, 9, 6],
// [4, 5, 6, 7],
// [10, 8, 6, 4]
// ];
var width = arrangement[0].length;
var len = arrangement.length;
var targ = 555;
// targ = 20;

function toArr(objArr) {
	var res = [];
	var l = length(objArr);
	for (var i = 0; i < l; i++) {
		res.push(objArr[i]);
	}
	return res;
}

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
		if (sums[i] != targ) //
			return 0;//
		
	return 1;//
}

//Iterator that generates configuration
function generateConfig(iter) {
	var len = arrangement.length;
	var numConfigs = Math.pow(width, len - 1);
	if (iter >= numConfigs) 
		return 0;
	
	var ans1 = iter.toString(width).split("").reverse();
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
function doStuff1() {
	print("METHOD #1");
	var iter = 0;
	var j = generateConfig(iter);
	var numSolutions = 0;

	while (j != 0) {
		if (configWorks(j) && j != -1) {
			//print(toArr(j));
			numSolutions++;
		}
		iter++;
		//print(iter);
		j = generateConfig(iter);
	}

	print(numSolutions);
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////   Method #2

arrangement = arrangement;
width = width;
targ = targ;
len = len;

memo = {};
function absMod (a, b) {
	//returns a % b but the positive value
	return ((a % b) + b) % b
} //return ((a % b) + b) % b

function shift(arr, n) {
	//Rotates arr by n to the right
	var res = [];
	for (var i = 0; i < arr.length; i++) {
		res.push(arr[absMod(i + n, arr.length)]);
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

function times(arr, m) {
	//returns an array which is m lots of arr e.g. [1, 2] * 2 = [1, 2, 1, 2]
	var res = [];
	for (var i = 0; i < m; i++) 
		for (var j = 0; j < arr.length; j++) 
			res.push(arr[j]);
		
	return res;
}

function equals(arr1, arr2) {
	if (arr1.length != arr2.length) 
		return 0;
	for (var i = 0; i < arr1.length; i++) 
		if (arr1[i] != arr2[i])
			return 0;
	return 1;
}
var k = 0;
function generateSuccessfulConfigs(totalsLeft, rowsLeft) {
	//returns -1 for an invalid base case or a value in totalsLeft is negative; 
	//else returns the rotation values for arrangement. 
	var hashStr = totalsLeft.join(",") + ";" + rowsLeft;
	var hashVal = memo[hashStr];
	if (hashVal != undefined) {
		k ++;
		return hashVal;
	}
	// print(totalsLeft);
	// print(rowsLeft);
	// print("---");
	
	var res = [];
	if (rowsLeft < 1)
		return -1;

	for (var i = 0; i < totalsLeft.length; i++) 
		if (totalsLeft[i] < 0) 
			return -1;

	if (rowsLeft == 1) {
		zeroes = times([0], totalsLeft.length);
		for (var i = 0; i < width; i++) {
			if (equals(zeroes, subtract(totalsLeft, shift(arrangement[len - 1], i))))////
				res.push([i]);
		}
		if (res.length)
			return res;
		else 
			return -1;
	}

	var newConfig;
	for (var i = 0; i < width; i++) {
		var configs = generateSuccessfulConfigs(subtract(totalsLeft, shift(arrangement[rowsLeft - 1], i)), rowsLeft - 1);///
		if (configs != -1) {
			for (var j = 0; j < configs.length; j++) {
				newConfig = concat(configs[j], [i]);
				res.push(newConfig);
			}
		}
	}

	memo[hashStr] = res;
	return res;
}

function findSuccessfulConfigs() {
	var targets = times([targ], width);

	var res = generateSuccessfulConfigs(subtract(targets, arrangement[0]), len - 1);///
	for (var i = 0; i < res.length; i++)
		res[i] = concat([0], res[i]);
	return res;
}

function doStuff2() {
	print("METHOD #2");
	var successfulConfigs = findSuccessfulConfigs();
	for (var i = 0; i < successfulConfigs.length; i++) {
		print(successfulConfigs[i]);
	}

	var decodedConfigs = [];
	print(successfulConfigs.length);

	for (var i = 0; i < successfulConfigs.length; i++) {
		decodedConfigs.push([]);
		for (var j = 0; j < length; j++)
			decodedConfigs[i].push((4 - successfulConfigs[length - j - 1]) % 4);
	}
	memo = {}
}