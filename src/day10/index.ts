import run from "aocrunner";

const parseInput = (rawInput: string): string[][] => rawInput.split('\n').map(s => s.trim().split(''));



// {  (  [  (  <  {  }  [  <  >  [  ]  }  >  {  [  ]  {  [  (  <  (  )  >
// 1  2  3  4  5  6  -  7  8  -  9  -  -  -  10 11 -  12 13 14 15 16 -  -
// o  o  o  o  o  o  c  o  o  c  o  c  c

type Char = string;

const cleanLine = (line: string[]): string[] => {
  let lineAsStr = line.join('');
  lineAsStr = lineAsStr.replace('<>', '');
  lineAsStr = lineAsStr.replace('()', '');
  lineAsStr = lineAsStr.replace('[]', '');
  lineAsStr = lineAsStr.replace('{}', '');
  return lineAsStr.split('');
} 

const detectCorruptedChunk = (line: string[]): Char | null => {
  let corruptedChar = null;
  let counter = 0;
  let cleaned = false;

  while(!corruptedChar && counter < line.length) {
    const prevLength = line.length;
    if(!cleaned) {
      line = cleanLine(line);
    }
    if(prevLength > line.length) {
      continue;
    } else {
      cleaned = true;
    }
    const currentChar = line[counter];
    if(')]}>'.includes(currentChar)) {
      if(currentChar === ")" && line[counter - 1] === "(") {
        cleaned = false;
        line.splice(counter - 1, 2);
        counter = -1;
      }
      else if(currentChar === "]" && line[counter - 1] === "[") {
        cleaned = false;
        line.splice(counter - 1, 2);
        counter = -1;
      }
      else if(currentChar === "}" && line[counter - 1] === "{") {
        cleaned = false;
        line.splice(counter - 1, 2);
        counter = -1;
      }
      else if(currentChar === ">" && line[counter - 1] === "<") {
        cleaned = false;
        line.splice(counter - 1, 2);
        counter = -1;
      }else {
        corruptedChar = currentChar;
      }
    }
    counter++;
  }
  return corruptedChar
}

const calculateScore = (c: string): number => {
  if(c === ')') return 3;
  if(c === ']') return 57;
  if(c === '}') return 1197;
  if(c === '>') return 25137;
  throw new Error(`Invalid character ${c}`);
}

// each time you see a closing char, make sure all chunks between the opening and closing char are closed

// The rule to obey is: don't close a chunk before all your children chunks are closed
const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  return input.map(detectCorruptedChunk).filter(Boolean).reduce((acc, c) => acc + calculateScore(c as string), 0);
};

const cleanAllLine = (line: string[]): string[] => {
  let previous = line.length;
  let next = line.length - 1;

  while(next !== previous) {
    previous = next;
    line = cleanLine(line);
    next = line.length;
  }

  return line;
}

const getScore = (char: string) => {
  if(char === '(') return 1;
  if(char === '[') return 2;
  if(char === '{') return 3;
  if(char === '<') return 4;
  throw new Error('wtf')
}

const calculateLineScore = (line: string[]): number => {
  line.reverse();
  let score = 0;
  for (let index = 0; index < line.length; index++) {
    const element = line[index];
    score*=5;
    score+=getScore(element);
  }
  return score
}

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const filteredInput = input.filter(v => detectCorruptedChunk(v) === null).map((string) => (cleanAllLine(string)));
  const t = filteredInput.map(calculateLineScore).sort((a, b) => a - b);
  return t[(t.length - 1 )/ 2];

};

run({
  part1: {
    tests: [
      { input: `[({(<(())[]>[[{[]{<()<>>
        [(()[<>])]({[<{<<[]>>(
        {([(<{}[<>[]}>{[]{[(<()>
        (((({<>}<{<{<>}{[]{[]{}
        [[<[([]))<([[{}[[()]]]
        [{[{({}]{}}([{[{{{}}([]
        {<[[]]>}<{[{[{[]{()[[[]
        [<(<(<(<{}))><([]([]()
        <{([([[(<>()){}]>(<<{{
        <{([{{}}[<[[[<>{}]]]>[]]`, expected: 26397 },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      { input: `[({(<(())[]>[[{[]{<()<>>
        [(()[<>])]({[<{<<[]>>(
        {([(<{}[<>[]}>{[]{[(<()>
        (((({<>}<{<{<>}{[]{[]{}
        [[<[([]))<([[{}[[()]]]
        [{[{({}]{}}([{[{{{}}([]
        {<[[]]>}<{[{[{[]{()[[[]
        [<(<(<(<{}))><([]([]()
        <{([([[(<>()){}]>(<<{{
        <{([{{}}[<[[[<>{}]]]>[]]`, expected: 288957 },
    ],
    solution: part2,
  },
  trimTestInputs: true,
});
