((top) => {
	const isBrowser = (typeof top.exports == 'undefined');

	class Cache {
		constructor(params = {}) {
			if (!isBrowser) {
				this.crypto = require('crypto');
			}

			this.cache = {};
			this.cacheTime = {};

			this.settings = Object.assign({
				cacheDefaultTime: 5 * 60 * 1000,
				cacheClearProb: 0.01
			}, params);
		}

		settings(key, value) {
			if (typeof key === 'object') {
				Object.assign(this._settings, key);
				return true;
			}

			if (!value) {
				return this._settings[key];
			}

			this._settings[key] = value;
			return true;
		}

		md5(str) {
			if (isBrowser) {
				throw new Error('Not implemented');
			}
			return this.crypto.createHash('md5').update(str).digest("hex");
		}

		hash(_str) {
			let hash = 0;
			const str = _str.toString();

			if (str.length === 0) {
				return hash;
			}

			for (let i = 0; i < str.length; i++) {
				const chr = str.charCodeAt(i);
				hash = ((hash << 5) - hash) + chr;
				hash |= 0;
			}

			return hash;
		}

		check(key) {
			return this.cacheTime[key] &&
				this.cacheTime[key] >= new Date().valueOf() &&
				this.cache[key];
		}

		get(key) {
			if (this.check(key)) {
				return this.cache[key];
			} else {
				this._clearCheck();
				return null;
			}
		}

		set(key, value, livetime) {
			const cacheDefaultTime = this._settings.cacheDefaultTime;
			const data = [];

			if (typeof key === 'object') {
				data.push(key);
			} else {
				data.push({ key, value, livetime });
			}

			data.forEach((d) => {
				this.cache[d.key] = d.value;
				this.cacheTime[d.key] = new Date().valueOf() + (d.livetime >> 0 || cacheDefaultTime);
			});
		}

		remove(key) {
			if (key.endsWith('*')) {
				const start = key.replace(/\*$/, '');

				Object.keys(this.cacheTime)
					.filter(key => key.startsWith(start))
					.forEach(key => this.remove(key));

				this.gc();
			} else {
				delete(this.cacheTime[key]);
				delete(this.cache[key]);
			}
		}

		_clearCheck() {
			if (Math.random() < this._settings.cacheClearProb) {
				this.clean();
			}
		}

		clean() {
			Object.keys(this.cacheTime).forEach((key) => {
				if (this.cacheTime[key] < new Date().valueOf()) {
					this.remove(key);
				}
			});

			this.gc();
		}

		clear() {
			Object.keys(this.cacheTime).forEach((key) => {
				this.remove(key);
			});

			this.gc();
		}

		gc() {
			if (typeof global !== 'undefined' && typeof global.gc === 'function') {
				// perform GC if we can
				global.gc();
			}
		}
	}

	if (!isBrowser) {
		top.exports = new Cache();
	} else {
		export default new Cache();
	}
})(typeof module !== 'undefined' ? module : window);
