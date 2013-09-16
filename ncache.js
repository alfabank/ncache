var Cache = function () {
	this.crypto = require('crypto');
	this.cache = {};
	this.cacheTime = {};

	this.settings({
		cacheDefaultTime: 5 * 60 * 1000,
		cacheClearProb: 0.01
	});
};
Cache.prototype.settings = function (key, value) {
	if (typeof key == 'object') {
		this._settings = key;
		return true;
	}
	if (!value) {
		return this._settings[key];
	}
	this._settings[key] = value;
	return true;
};
Cache.prototype.md5 = function (str) {
	return this.crypto.createHash('md5').update(str).digest("hex");
};
Cache.prototype.check = function (key) {
	return this.cacheTime[key]
		&& this.cacheTime[key] >= new Date().valueOf()
		&& this.cache[key];
};
Cache.prototype.get = function (key) {
	if (this.check(key)) {
		return this.cache[key];
	} else {
		this._clearCheck();
		return null;
	}
};
Cache.prototype.set = function (key, value, livetime) {
	var cacheDefaultTime = this._settings.cacheDefaultTime,
		data = [];
	if (typeof key == 'object') {
		data.push(key);
	} else {
		data.push({
			"key": key,
			"value": value,
			"livetime": livetime
		})
	}
	data.forEach(function(d){
		this.cache[d.key] = d.value;
		this.cacheTime[d.key] = new Date().valueOf() + (d.livetime>>0 || cacheDefaultTime);
	});
};
Cache.prototype._clearCheck = function () {
	if (Math.random() < this._settings.cacheClearProb) {
		this.clear();
	}
};
Cache.prototype.clear = function () {
	for (var i in this.cacheTime) {
		if (
			this.cacheTime.hasOwnProperty(i)
				&& this.cacheTime[i] < new Date().valueOf()
			) {
			delete(this.cacheTime[i]);
			delete(this.cache[i]);
		}
	}
	if (typeof global.gc == 'function') { // perform GC if we can
		global.gc();
	}
};

module.exports = new Cache();