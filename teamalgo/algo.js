function square(x) { return x * x; }

// Compute euclidean distance between 2 vectors (weighted)
function euclid_nd(vectora, vectorb, relation_factor) {
	v_sum = 0.0;
	// Assume vectora.length = vectorb.length and each skill from 1-10
	for (var i = 0; i < vectora.length; i++)
		v_sum += square(vectora[i]/10.0 - vectorb[i]/10.0);
	// Temporary use of relation (relation_factor is 0, 1 or 2)
	v_sum /= (1.0 + relation_factor);
	return v_sum;
}

// Convert edge_list to adj. matrix
function convert_matrix(edge_list, n) {
	// Create 2D Matrix
	var arr = new Array(n);
	for (var i = 0; i < n; i++) {
		arr[i] = new Array(n);
		for (var j = 0; j < n; j++){
			arr[i][j] = 0;
		}
	}

	// Populate 2D Matrix
	for (i = 0; i < edge_list.length; i++){
		arr[edge_list[i]['source']][edge_list[i]['target']] = 1;
	}
	return arr;
}

function kruskal(n, edge_list, group_limit) {
	// Kruskal's implementation
	var rep = new Array(n);
	var size = new Array(n);
	for (var i = 0; i < n; i++) {
		rep[i] = i;
		size[i] = 1;
	}

	function find(k) {
		if(k == rep[k]) return k;
		return (rep[k] = find(rep[k]));
	}

	function join_limit(a, b, k) {
		var ra = find(a), rb = find(b);
		if (ra == rb || size[ra] + size[rb] > k) return false;
		if (size[ra] >= size[rb]) {
			rep[rb] = ra;
			size[ra] += size[rb];
			return true;
		} else if (size[ra] < size[rb]) {
			rep[ra] = rb;
			size[rb] += size[ra];
			return true;
		}
		return false;
	}

	edge_list.sort(function(a, b) { return a['distance'] - b['distance']; })
	// Processing edge list by forming groups
	for (var i = 0; i < edge_list.length; i++) {
		var edge = edge_list[i];
		join_limit(edge['a_id'], edge['b_id'], group_limit);
	}

	// Return team allocation
	var teams = new Array();
	var teams_count = 0;
	for (var i = 0; i < n; i++) {
		if (rep[i] != i) continue;
		teams[teams_count] = new Array();
		var team_size = 0;
		for (var j = 0; j < n; j++)
			if (rep[j] == i)
				teams[teams_count][team_size++] = j;
		teams_count++;
	}
	return teams;
}

// Matching Routine
function match(people, relations, group_limit) {
	// Convert relations to matrix
	relation_matrix = convert_matrix(relations, people.length);
	match_results = new Array();
	match_count = 0;
	// Compute distance between 2 people (lower factor = like + more similar)
	for (var i = 0; i < people.length; i++) {
		for (var j = i + 1; j < people.length; j++) {
			var ij_distance = euclid_nd(people[i]['skill_list'], people[j]['skill_list'], relation_matrix[i][j] + relation_matrix[j][i]);
			match_results[match_count++] = {'a_id': i,'b_id': j, 'distance': ij_distance };
		}
	}
	// Perform Kruskal's algorithm
	return kruskal(people.length, match_results, group_limit);
}
module.exports = match;
