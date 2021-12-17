import run from "aocrunner";

const parseInput = (rawInput: string) => {
  const splitted = rawInput.split('\n').map(s => s.trim());
  return {
    template: splitted[0],
    pairInsertions: splitted.slice(1, splitted.length).map(s => s.split(' -> ')),
  }
};

const shouldInsertPair = (pair: string, letterToInsert: string, template: string): boolean => {
  return template.includes(pair);
}

const part1 = (rawInput: string) => {
  let {template, pairInsertions} = parseInput(rawInput);
  console.log({template, pairInsertions});
  for (let i = 0; i < 10; i++) {
    let copy = template;
    pairInsertions.forEach((pairInsertion, index) => {
      if(shouldInsertPair(pairInsertion[0], pairInsertion[1], copy)) {
        const toInsert = `${pairInsertion[0][0]}${pairInsertion[1].toLowerCase()}${pairInsertion[0][1]}`;
        const matcher = new RegExp(pairInsertion[0], 'g');
        while(template.match(matcher)) {
          template = template.replace(new RegExp(pairInsertion[0], 'g'), toInsert);
        }
      };
    });
    template = template.toUpperCase();
    console.log(`After day ${i+1}: ${template.length}`)
    console.log('-------\n');
  }
  const dict = {};
  for (let index = 0; index < template.length; index++) {
    const char = template[index];
    if(Object.prototype.hasOwnProperty.call(dict, char)) {
      dict[char]+=1;
    } else {
      dict[char] = 1;
    }
  }
  return Math.max(...Object.values(dict)) - Math.min(...Object.values(dict));
};

const part2 = (rawInput: string) => {
  const {template, pairInsertions} = parseInput(rawInput);
  const insertionRules = Object.fromEntries(pairInsertions);
  let pairs = {};
  for (let index = 1; index < template.length; index++) {
    const key = `${template[index - 1]}${template[index]}`;
    if(Object.prototype.hasOwnProperty.call(pairs, key)) {
      pairs[key] = pairs[key] + 1;
    } else {
      pairs[key] = 1;
    }
  }
  for (let step = 0; step < 40; step++) {
    let newPairs = {};
    for (const [pair, count] of Object.entries(pairs)) {
      if(pair in insertionRules) {
        // split in new pairs
        const newPair1 = pair[0] + insertionRules[pair];
        const newPair2 = insertionRules[pair] + pair[1];

        if (!(newPair1 in newPairs)) newPairs[newPair1] = 0;
        if (!(newPair2 in newPairs)) newPairs[newPair2] = 0;

        newPairs[newPair1] += count;
        newPairs[newPair2] += count;
      }
    }

    pairs = {...newPairs};
  }

  const charDict = {};
  for(const [pair, count] of Object.entries(pairs)) {
    if (!(pair[0] in charDict)) charDict[pair[0]] = 0;
    if (!(pair[1] in charDict)) charDict[pair[1]] = 0;

    charDict[pair[0]] += count;
    charDict[pair[1]] += count;
  }

  return Math.max(...Object.values(charDict)) / 2 - Math.min(...Object.values(charDict)) / 2;
};

run({
  part1: {
    tests: [
      // 
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
