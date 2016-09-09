const cache = require('../ncache');

exports.isRequired = (test) => {
	test.equal(typeof cache, 'object', 'must be an object');
	test.done();
};

exports.setGet = (test) => {
	test.expect(3);

	test.equal(cache.get('k0'), null, 'unsetted data must be null');

	cache.set('k1', 'v1', 1000);
	test.equal(cache.get('k1'), 'v1', 'set/get 1 failed');

	cache.set({ key: 'k2', value: 'v2' });
	test.equal(cache.get('k2'), 'v2', 'set/get 2 failed');

	test.done();
};

exports.remove = (test) => {
	test.expect(4);

	cache.set({ key: 'r1', value: 'v1' });
	cache.set({ key: 'r2', value: 'v2' });
	cache.set({ key: 'r3', value: 'v3' });
	cache.set({ key: 'nr1', value: 'v4' });

	cache.remove('r1');
	test.equal(cache.get('r1'), null, 'unsetted data must be null 1');

	cache.remove('r*');
	test.equal(cache.get('r2'), null, 'unsetted data must be null 2');
	test.equal(cache.get('r3'), null, 'unsetted data must be null 3');

	test.equal(cache.get('nr1'), 'v4', 'get failed');

	test.done();
};

exports.expire = (test) => {
	test.expect(2);

	cache.set('e1', 'v1', 10);
	test.equal(cache.get('e1'), 'v1', 'set/get failed');
	setTimeout(() => {
		test.equal(cache.get('eq'), null, 'data must expired');
		test.done();
	}, 20);
};
