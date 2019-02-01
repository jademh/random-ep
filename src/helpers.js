export function generateRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function chooseRandomArrayItem(arr) {
  return arr[generateRandomInt(0, arr.length - 1)];
}
