export class StrongMap<K, V> {
  map: Array<[K, V]> = [];

  set(key: K, value: V) {
    const index = this.map.findIndex(([_key]) => _key === key);
    if (index === -1) {
      this.map.push([key, value]);
    } else {
      this.map[index] = [key, value];
    }
  }

  get(key: K) {
    const item = this.map.find(([_key]) => _key === key);
    return item && item[1];
  }

  has(key: K) {
    return this.map.some(([_key]) => _key === key);
  }

  forEach(callback: (key: K, value: V) => void) {
    this.map.forEach(([key, value]) => callback(key, value));
  }
}
