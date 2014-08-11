var arrangement = [[25, 60, 95, 30],
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
var len = arrangement.length;
var targ = 555;

//Returns the length of an object
function length(obj) {
	var res = 0;
	for (var key in obj) {
		res ++;
	}
	return res;
}

function print(txt) {//
	console.log(txt);
}

