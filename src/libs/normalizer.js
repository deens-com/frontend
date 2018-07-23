/**
 * This similar to lodash's keyBy method
 */
export function keyBy(arr, key) {
  const obj = {};
  arr.forEach(element => {
    obj[element[key]] = element;
  });
  return obj;
}
