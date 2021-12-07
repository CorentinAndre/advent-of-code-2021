import run from "aocrunner";

type CrabPosition = number;

const parseInput = (rawInput: string): CrabPosition[] => {
  return rawInput.split(",").map((v) => parseInt(v, 10));
};

const getMedianValue = (input: CrabPosition[]): number => {
  const length = input.length;
  input.sort((a, b) => a - b);
  if (length % 2 === 0) {
    return (input[length / 2 - 1] + input[length / 2]) / 2;
  } else {
    return input[Math.floor(length)];
  }
};

const getAverageValue = (crabs: CrabPosition[]) => {
  return Math.floor(
    Object.values(crabs).reduce((acc, v) => acc + v, 0) / crabs.length
  );
};

const computeFuel = (value: number, crabs: CrabPosition[]) => {
  let fuel = 0;
  crabs.forEach((crab) => {
    fuel += Math.abs(crab - value);
  });

  return fuel;
};

const computeSumSerie = (start: number, end: number) => {
  let counter = 0;
  for (let index = start; index <= end; index++) {
    counter += index;
  }

  return counter;
};

const computeFuelPart2 = (value: number, crabs: CrabPosition[]) => {
  let fuel = 0;
  crabs.forEach((crab) => {
    fuel += computeSumSerie(1, Math.abs(crab - value));
  });
  return fuel;
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return computeFuel(getMedianValue(input), input);
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return computeFuelPart2(getAverageValue(input), input);
};

run({
  part1: {
    tests: [
      // { input: ``, expected: "" },
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
