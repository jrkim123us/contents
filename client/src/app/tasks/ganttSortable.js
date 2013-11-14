angular.module('tasks.ganttSortable', [])
.factory('ganttSortable', function() {
	function sortByWbs(itemA, itemB) {
		var splliter = '.', result = 0,
			arrayA = itemA.wbs.split(splliter), arrayB = itemB.wbs.split(splliter),
			lengthA = arrayA.length, lengthB = arrayB.length;

		if (lengthA === lengthB) {
			for(var inx = 0 ; inx < lengthA ; inx++) {
				var valA = parseInt(arrayA[inx], 10), valB = parseInt(arrayB[inx], 10);
				if(valA === valB)
					continue;
				else if(valA > valB) {
					result = 1;
					break;
				} else {
					result = -1;
					break;
				}
			}
		} else
			result = lengthA > lengthB ? 1 : -1;
		return result;
	}

	function sort(type) {
		var fn;
		switch(type) {
			case 'wbs' : fn = sortByWbs; break;
			default: fn = sortByWbs; break;
		}
		gantt.sort(fn);
	}

	return {
		sort : sort
	}
})