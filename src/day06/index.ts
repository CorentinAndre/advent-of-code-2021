import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput.split(',').map(v => parseInt(v, 10));

const part1 = (rawInput: string) => {
  let input = parseInput(rawInput);
  for (let day = 1; day <= 80; day++) {
    let newborn = [];
    for (let fishIndex = 0; fishIndex < input.length; fishIndex++) {
      if(input[fishIndex] === 0) {
        newborn.push(8);
        input[fishIndex] = 6;
      } else {
        input[fishIndex] = input[fishIndex] - 1;
      }
    }
    input = [...input, ...newborn];
  }
  return input.length;
};

interface Fishes {
  [key: number]: number,
}



const part2 = (rawInput: string) => {
  const fishes: Fishes = {
    0: 0,
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
    7: 0,
    8: 0,
  }
  const input = parseInput(rawInput);
  input.forEach(v => {
    fishes[v] = fishes[v]+1;
  })
  for (let day = 1; day <= 256; day++) {
    let newbornFishes = 0;
    for (const key of Object.keys(fishes)) {
      const parsedKey = parseInt(key, 10);
      if(parsedKey === 0) {
        newbornFishes = fishes[parsedKey];
      } else {
        fishes[parsedKey - 1] = fishes[parsedKey];
      }
    }
    fishes[8] = newbornFishes;
    fishes[6] = fishes[6]+newbornFishes;
  }
  return Object.values(fishes).reduce((acc, v) => acc+v, 0);
};

run({
  part1: {
    tests: [
      // { input: `3,4,3,1,2`, expected: 26 },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      // { input: ``, expected: "" },
    ],
    solution: part2,
  },
  trimTestInputs: true,
});
