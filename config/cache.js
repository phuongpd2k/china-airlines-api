const cache = new Map();

function setData(key, value) {
  cache.set(key, value);
}

function getData(key) {
  return cache.get(key);
}

module.exports = { setData, getData };
