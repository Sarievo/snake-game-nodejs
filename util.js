const prompt = require("prompt-sync")({ sigint: true });

const assert = function (condition, message) {
  if (!condition) throw Error("Assert failed: " + (message || ""));
};

const getSize = (low = 5, high = 20) => {
  assert(low < high);
  let size;
  while (true) {
    const input = prompt(`Matrix size (${low}-${high}): `);
    const result = input.match(/^[0-9]+$/);
    if (!result) {
      console.log("Matrix size must be a number.");
      continue;
    }
    size = +result[0];
    if (size < low || size > high) {
      console.log(`Matrix size must be within (${low}-${high}).`);
      continue;
    }
    break;
  }
  return size;
};

module.exports = { getSize };
