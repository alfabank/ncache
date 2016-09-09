# NCache

**Version 1.2.0**

## Purpose
Lightweight node.js and browser module for cache data in memory.

## Features
- lightweight script;
- easy to use;
- no requires except node.js or browser.

## Installation
Via [npm](http://github.com/isaacs/npm):
```
// may be later
```
Manually:
```
git clone git@github.com:alfabank/ncache.git
// var cache = require('./ncache');
```

## Example
```javascript
const cache = require('./ncache');

cache.set('foo', 'bar', 100500);
console.log(cache.get('foo'));
```

## API

### .settings(key, value) | .settings(data) | .settings(key)
This function designed for work with settings of cache.
First two forms is a setters, and the last one is a getter.
'data' in second form means a key-value object with settings.

In this moment this settings exists:
- `cacheDefaultTime` (def: 5 * 60 * 1000) - default time for cache;
- `cacheClearProb` (def: 0.01) - probability of calling clear routine.

### .md5(string)
Return md5 hash of given string. In [0-9a-h] format.
Internal function but can be useful in external cases.
Inplemented only under node.js. Throw an error in browser.

### .hash(string)
Return hash of given string. In Int32 format.
Internal function but can be useful in external cases.

### .check(key)
Return flag with state of cached value found by 'key'.
Meant the true only if value by key exists an not become rotten.

### .get(key)
Return value by key. If absent or rotten returns `null`.

### remove(key)
Remove value from storage by given key. If end with '*' will remove all key-values starts with key.

### .set(key, value, lifetime) | .set(data)
Function for cache values.
Getting one value per time in first form, or array of values in second form.
'data' must by an array of objects with keys matching first form.

