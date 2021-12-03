import run from "aocrunner";

const parseInput = (input: string): string[] => {
  const binaryNumbers = input.split('\n');
  
  return binaryNumbers;
}

const getMostCommonValue = (result: string[], index: number) => {
  const numberOfOne = result.reduce((acc, v) => v[index] === '1' ? acc+1 : acc, 0);
  if(numberOfOne >= (result.length/2)) return 1;
  return 0;
}

const getOxygenGeneratorRatingValue = (bNumbers: string[]): string => {
  let result = bNumbers;
  let index = 0;
  while(result.length > 1) {
    const mostCommon = getMostCommonValue(result, index);
    console.log(mostCommon)
    result = result.filter(num => parseInt(num[index], 10) === mostCommon);
    index++;
  }

  return result[0];
}

const getLeastCommonValue = (result: string[], index: number) => {
  const numberOfOne = result.reduce((acc, v) => v[index] === '1' ? acc+1 : acc, 0);
  if(numberOfOne < (result.length / 2)) return 1;
  return 0;
}

const getCO2ScrubberRating = (bNumbers: string[]): string => {
  let result = bNumbers;
  let index = 0;
  while(result.length > 1) {
    const mostCommon = getLeastCommonValue(result, index);
    console.log(mostCommon)
    result = result.filter(num => parseInt(num[index], 10) === mostCommon);
    index++;
  }

  return result[0];
}

const getAgggregatedBNumbers = (input: string[]): [number, number][] => {
  const aggregatedBNumbers = new Array(12).fill([0, 0]);
  input.forEach(bNumber => {
    for (let index = 0; index < bNumber.length; index++) {
      const [zeroCount, oneCount] = aggregatedBNumbers[index];
      aggregatedBNumbers[index] = bNumber[index] === '1' ? [zeroCount, oneCount+1] : [zeroCount+1, oneCount];
    }
  });

  return aggregatedBNumbers;
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const aggregatedBNumbers = getAgggregatedBNumbers(input);
  const gammaRate = aggregatedBNumbers.reduce((acc, array) => {
    return `${acc}${array[0] > array[1] ? '0' : '1'}`
  }, '');
  console.log(gammaRate);
  const epsilonRate = gammaRate.split('').map(digit => String(1 - parseInt(digit, 10))).join('');
  console.log(epsilonRate);
  return parseInt(gammaRate, 2) * parseInt(epsilonRate, 2);
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const oxygen = getOxygenGeneratorRatingValue(input);
  const co2 = getCO2ScrubberRating(input);
  return parseInt(oxygen, 2) * parseInt(co2, 2);
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
