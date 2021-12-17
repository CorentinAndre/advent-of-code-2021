import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput.split('\n').map(row => row.trim().split('').map(Number));

type Octopuses = number[][];

type Coordinates = [row: number, col: number];

const increaseEnergyLevel = (octopuses: Octopuses): Octopuses => {
  return octopuses.map(row => row.map(energyLevel => energyLevel+1));
}

const displayOctopuses = (day: number, octopuses: Octopuses): void => {
  console.log(`day ${day+1}`)
  console.log(octopuses.map(row => row.map(octo => (octo === 0 ? `\x1b[91m ${octo}\x1b[39m` : `${octo}`.padStart(2, ' '))).join('')).join('\n'));
  console.log('--------\n')
}

interface FlashOctopusesOutput {
  octopuses: Octopuses,
  flashCount: number,
}

const increaseNearbyOctopuses = (octopuses: Octopuses, [row, col]: Coordinates): Octopuses => {
    // left
    if(octopuses[row] && octopuses[row][col - 1]) {
      octopuses[row][col-1]+=1;
    }
    // right
    if(octopuses[row] && octopuses[row][col + 1]) {
      octopuses[row][col+1]+=1;
    }
    // top
    if(octopuses[row - 1] && octopuses[row - 1][col]) {
      octopuses[row-1][col]+=1;
    }
    // bottom
    if(octopuses[row + 1] && octopuses[row + 1][col]) {
      octopuses[row+1][col]+=1;
    }
    // top left
    if(octopuses[row - 1] && octopuses[row - 1][col - 1]) {
      octopuses[row-1][col-1]+=1;
    }
    // top right
    if(octopuses[row - 1] && octopuses[row - 1][col + 1]) {
      octopuses[row-1][col+1]+=1;
    }
    // bottom left
    if(octopuses[row + 1] && octopuses[row + 1][col - 1]) {
      octopuses[row+1][col-1]+=1;
    }
    // bottom right
    if(octopuses[row + 1] && octopuses[row + 1][col + 1]) {
      octopuses[row+1][col+1]+=1;
    }
  return octopuses;
} 

const flashOctopuses = (octopuses: Octopuses): FlashOctopusesOutput => {
  let flashCount = 0;
  for (let row = 0; row < octopuses.length; row++) {
    for (let col = 0; col < octopuses[row].length; col++) {
      const octopus = octopuses[row][col];
      if(octopus > 9) {
        // flash
        octopuses[row][col] = 0;
        flashCount+=1;
        // increase nearby octopuses
        octopuses = increaseNearbyOctopuses(octopuses, [row, col]);
        row = 0;
        col = -1;
        continue;
      }
    }
  }
  return {flashCount, octopuses};
}

const part1 = (rawInput: string) => {
  let input = parseInput(rawInput);
  let flashes = 0;
  // if(input.length === 10) {
  //   displayOctopuses(0, input);
  // }
  for (let day = 0; day < 100; day++) {
    input = increaseEnergyLevel(input);
    let {octopuses, flashCount} = flashOctopuses(input);
    input = octopuses;
    flashes+=flashCount;
    // if(input.length === 10) {
    //   displayOctopuses(day, input);
    //   console.log({flashCount})
    // }
  }
  return flashes;
};

const part2 = (rawInput: string) => {
  let input = parseInput(rawInput);
  let day = 0;
  let flag = false;
  while(!flag) {
    input = increaseEnergyLevel(input);
    let {octopuses, flashCount} = flashOctopuses(input);
    input = octopuses;
    if(flashCount === 100) {
      flag = true;
      displayOctopuses(day, input)
    }
    day+=1;
  }
  return day;
};

run({
  part1: {
    tests: [
      { input: `5483143223
      2745854711
      5264556173
      6141336146
      6357385478
      4167524645
      2176841721
      6882881134
      4846848554
      5283751526`, expected: 204 }, // for 10 steps 204, for 100 steps 1656
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
