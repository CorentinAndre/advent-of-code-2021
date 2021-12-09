import run from "aocrunner";

type UniqueSignalPattern = string;
type DigitOutput = string;

interface Entry {
  patterns: UniqueSignalPattern[],
  output: DigitOutput[],
}

const parseInput = (rawInput: string): Entry[] => {
  const test = rawInput.split('\n').map(entry => entry.split('|').map(string => {
    const trimmed = string.trim();
    return trimmed.split(' ').map(d => d.split('').sort().join(''));
  })).map(entry => ({
    patterns: entry[0],
    output: entry[1],
  }));

  return test;
};


const is8Digit = (digit: DigitOutput): boolean => digit.length === 7;
const is7Digit = (digit: DigitOutput): boolean => digit.length === 3;
const is4Digit = (digit: DigitOutput): boolean => digit.length === 4;
const is1Digit = (digit: DigitOutput): boolean => digit.length === 2;


const part1 = (rawInput: string) => {
  const entries = parseInput(rawInput);
  let count = 0;
  entries.forEach(({output}) => {
    output.forEach(outputEntry => {
      if([2,4,3,7].includes(outputEntry.length)) {
        count++;
      }
    })
  })
  return count;
};

const guessPatterns = (patterns: UniqueSignalPattern[]): string[] => {
  const digitPatterns: string[] = new Array(10).fill(null);

  const index8 = patterns.findIndex(p => p.length === 7) as number;
  digitPatterns[8] = patterns[index8];
  patterns.splice(index8, 1);

  const index7 = patterns.findIndex(p => p.length === 3) as number;
  digitPatterns[7] = patterns[index7];
  patterns.splice(index7, 1);

  const index4 = patterns.findIndex(p => p.length === 4) as number;
  digitPatterns[4] = patterns[index4];
  patterns.splice(index4, 1);

  const index1 = patterns.findIndex(p => p.length === 2) as number;
  digitPatterns[1] = patterns[index1];
  patterns.splice(index1, 1);
  
  // a 9 has 6 length and the same chars as a 4
  const index9 = patterns.findIndex(p => p.length === 6 && digitPatterns[4].split('').every(c => p.includes(c))) as number;
  digitPatterns[9] = patterns[index9];
  patterns.splice(index9, 1);

  const index0 = patterns.findIndex(p => p.length === 6 && digitPatterns[1].split('').every(c => p.includes(c))) as number;
  digitPatterns[0] = patterns[index0];
  patterns.splice(index0, 1);

  const index6 = patterns.findIndex(p => p.length === 6);
  digitPatterns[6] = patterns[index6];
  patterns.splice(index6, 1);

  const index3 = patterns.findIndex(p => p.length === 5 && digitPatterns[7].split('').every(c => p.includes(c))) as number;
  digitPatterns[3] = patterns[index3];
  patterns.splice(index3, 1);
  const index5 = patterns.findIndex(p => p.length === 5 && p.split('').every(c => digitPatterns[9].split('').includes(c))) as number;
  digitPatterns[5] = patterns[index5];
  patterns.splice(index5, 1);
  digitPatterns[2] = patterns[0];

  return digitPatterns;
}

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const count = input.map(({output, patterns}, index) => {
    const guessedPatterns = guessPatterns(patterns);
    const v = parseInt(output.map(digit => guessedPatterns.findIndex(p => p === digit)).join(''), 10);
    return v;
  }).reduce((acc, n) => {
    return n+acc;
  }, 0)
  return count;
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
