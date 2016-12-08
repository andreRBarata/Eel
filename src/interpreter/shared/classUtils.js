module.exports = {
	bless(obj, parent) {
		let Output = function() {
			for (var index in obj) {
				if (obj.hasOwnProperty(index)) {
					this[index] = obj[index];
				}
			}
		};

		Output.prototype = parent;

		return new Output();
	}
};
