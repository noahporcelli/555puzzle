//Puzzle pieces
var pieces = [
    [25,60,95,30],
    [20,70,55,25],
    [20,50,55,10],
    [65,15,45,55],
    [90,80,90,55],
    [90,85,55,60],
    [45,95,15,55],
    [55,75,65,55],
    [70,35,55,55],
    [55,55,60,75]
];

var total = 555;

var clone = function(array) {
    var newArray = [];
    for (var i = 0; i < array.length; i++) newArray[i] = array[i];
    return newArray;
};

var sum = function(array) {
    var total = 0;
    for (var i = 0; i < array.length; i++) total = total + array[i];
    return total;
}

var totals = function(pieces, solution) {
    var columns = [0,0,0,0];
    for (x = 0; x < columns.length; x++) {
        for (y = 0; y < solution.length; y++) {
            columns[x] += pieces[y][(solution[y] + parseInt(x)) % 4];
        }
    }
    return columns;
};

var error = function(total, pieces, solution) {
    var columns = totals(pieces, solution);
    var error = 0;
    for (i = 0; i < columns.length; i++) error += Math.abs(total - columns[i]);
    return error;
};

var randomSolution = function() {
    var solution = [0];
    for (i = 1; i < 10; i++) solution[i] = parseInt(Math.random() * 4);
    return solution;
};

// Multiplies all pieces by a factor
// to simplify the problem
var multiplier = function(total, pieces, factor) {
    var simplePieces = [];
    for (y = 0; y < pieces.length; y++) {
        simplePieces[y] = [];
        for (x = 0; x < pieces[y].length; x++) {
            simplePieces[y].push(pieces[y][x] * factor);
        }
    }
    return [total * factor, simplePieces];
};

var solvers = {
    // Iterates over all possible solutions
    iterator: function(total, pieces) {
        var solution = [0,0,0,0,0,0,0,0,0,0];
        var err = error(total, pieces, solution);
        var solutions = [];

        var increment = function(solution, i) {
            i = i || 1;
            solution[i] = (solution[i] + 1) % 4;
            if (solution[i] == 0) {
                if (i == solution.length - 1) return false;
                return increment(solution, i + 1);
            }
            return true;
        };

        while (increment(solution)) {
            err = error(total, pieces, solution);
            if (err == 0) solutions.push(clone(solution));
        }
        return solutions;
    },

    // Generates a random solution and randomly mutates it find a better one
    gradientDescent: function(total, pieces) {
        var solution = randomSolution();
        var err = error(total, pieces, solution);

        while (err > 0) {
            var y = 1 + parseInt(Math.random() * (pieces.length - 1));
            var current = solution[y];
            solution[y] = parseInt(Math.random() * 4);
            if (error(total, pieces, solution) < err || Math.random() > 0.99) err = error(total, pieces, solution);
            else solution[y] = current;
        }
        return [solution];
    },

    // Iterates through solutions and eliminates ones above or below the solution value
    minMax: function(total, pieces) {
        var solution, i, potential, y;
        var solutions = [[0]];
        var mins = [], maxes = [];

        for (y = 1; y < pieces.length; y++) {
            mins[y] = Math.min.apply(this, pieces[y])
            maxes[y] = Math.max.apply(this, pieces[y]);
        }

        var viable = function(solution) {
            var columns = totals(pieces, solution);
            for (var x = 0; x < 4; x++) {
                if (columns[x] + sum(maxes.slice(solution.length)) < total) return false;
                if (columns[x] + sum(mins.slice(solution.length)) > total) return false;
            }
            return true;
        };

        while (solutions.length > 0 && solutions[0].length < pieces.length) {
            solution = solutions.shift();
            for (i = 0; i < 4; i++) {
                potential = clone(solution);
                potential[potential.length] = i;
                if (viable(potential)) solutions.push(potential);
            }
        }
        return solutions;
    },

    // Iterates through solutions and eliminates ones above or below the solution value,
    // normalising values beforehand to avoid the min check
    minMax2: function(total, pieces) {
        var solution, i, potential, key, total, y;
        var solutions = [[0]];
        var mins = [];
        var maxes = [];

        pieces = pieces.map(function(row) {
            var min = Math.min.apply(this, row);
            total -= min;
            return row.map(function(value) {
                return (value - min);
            });
        });

        for (y = pieces.length - 1; y >= 1; y--) {
            maxes[y] = Math.max.apply(this, pieces[y]) + (maxes[y + 1] || 0);
        }

        var viable = function(solution) {
            var columns = totals(pieces, solution);
            for (var x = 0; x < 4; x++) {
                if (columns[x] > total) return false;
                if (columns[x] + maxes[solution.length] < total) return false;
            }
            return true;
        };

        while (solutions.length > 0 && solutions[0].length < pieces.length) {
            solution = solutions.shift();
            for (i = 0; i < 4; i++) {
                potential = clone(solution);
                potential[potential.length] = i;
                if (viable(potential)) solutions.push(potential);
            }
        }
        return solutions;
    }
};


