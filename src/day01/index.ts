import run from "aocrunner";

const parseInput = (input: string) => {
  const depths = input.split('\n').map(depth => {
    const depthAsNumber = parseInt(depth, 10);
    return depthAsNumber;
  });
  return depths;
}

const getNumberOfIncreases = (depths: number[]) => {
  let counter = 0;
  depths.forEach((currentDepth, index) => {
    const previousDepth = index > 0 ? depths[index - 1] : null;
    if(previousDepth && currentDepth > previousDepth) {
      counter++;
    }
  });

  return counter;
}

const getSlidingWindowAtIndex = (depths: number[], index: number): number[] | null => {
  if(depths.length - index + 1 >= 2) {
    return [depths[index], depths[index+1], depths[index+2]];
  }

  return null;
}

const getNumberOfIncreasesPart2 = (depths: number[]) => {
  let counter = 0;
  depths.forEach((_, index) => {
    const currentSlidingWindowSum = getSlidingWindowAtIndex(depths, index)?.reduce((prev, curr) => (prev + curr), 0);
    const nextSlidingWindowSum = index === depths.length - 1 ? null : getSlidingWindowAtIndex(depths, index + 1)?.reduce((prev, curr) => (prev + curr), 0);
    if(nextSlidingWindowSum && currentSlidingWindowSum && nextSlidingWindowSum > currentSlidingWindowSum) {
      counter++;
    }
  });

  return counter;
}

const part1 = (rawInput: string) => {
  const depths = parseInput(rawInput);
  const nb = getNumberOfIncreases(depths);
  return nb;
};

const part2 = (rawInput: string) => {
  const depths = parseInput(rawInput);
  const nb = getNumberOfIncreasesPart2(depths);
  return nb;
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
