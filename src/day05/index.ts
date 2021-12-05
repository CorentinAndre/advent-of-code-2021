import run from "aocrunner";

interface Coordinates {
  x: number,
  y: number,
}

type HydrothermalVent = [start: Coordinates, end: Coordinates];

const parseCoordinates = (rawCoordinates: string): Coordinates => {
  const c = rawCoordinates.split(',');

  return {
    x: parseInt(c[0], 10),
    y: parseInt(c[1], 10),
  }
}

const parseHydrothermalVent = (rawVent: string): HydrothermalVent => {
  const [rawStartCoordinates, rawEndCoordinates] = rawVent.split('->').map(x => x.trim());
  return [parseCoordinates(rawStartCoordinates), parseCoordinates(rawEndCoordinates)];
}

const parseInput = (rawInput: string) => {
  const coordinates = rawInput.split('\n');
  return coordinates.map((rawVent) => {
    return parseHydrothermalVent(rawVent)
  });
};

const isHorizontal = (vent: HydrothermalVent) => {
  return vent[0].y === vent[1].y;
}

const isVertical = (vent: HydrothermalVent) => {
  return vent[0].x === vent[1].x;
}

const isDiagonal = (vent: HydrothermalVent) => {
  return Math.abs(vent[0].x - vent[1].x) === Math.abs(vent[0].y - vent[1].y)
}

interface Grid {
  [key: string]: number;
}

const markHydrothermalVent = (grid: Grid, vent: HydrothermalVent, countDiagonals: boolean) => {
  if(isHorizontal(vent)) {
    for (let i = Math.min(vent[0].x, vent[1].x); i <= Math.max(vent[0].x, vent[1].x); i++) {
      grid[`${i},${vent[0].y}`] = (grid[`${i},${vent[0].y}`] ?? 0) + 1;
    }
  } else if(isVertical(vent)) {
    for (let i = Math.min(vent[0].y, vent[1].y); i <= Math.max(vent[0].y, vent[1].y); i++) {
      grid[`${vent[0].x},${i}`] = (grid[`${vent[0].x},${i}`] ?? 0) + 1;
    }
  } else if(isDiagonal(vent) && countDiagonals) {
    const orderedVent = vent[0].x > vent[1].x ? [vent[1], vent[0]] : [vent[0], vent[1]];
    console.log(orderedVent);
    const verticalSign = orderedVent[0].y > orderedVent[1].y ? -1 : 1;
    for (let i = 0; i <= orderedVent[1].x - orderedVent[0].x; i++) {
      grid[`${orderedVent[0].x+i},${orderedVent[0].y+(i*verticalSign)}`] = (grid[`${orderedVent[0].x+i},${orderedVent[0].y+(i*verticalSign)}`] ?? 0) + 1;
    }
  }
}

const countOverlappingVentCoordinates = (grid: Grid) => {
  return Object.values(grid).filter(c => c > 1).length
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const grid: Grid = {};
  input.forEach(vent => {
    markHydrothermalVent(grid, vent, false);
  });
  return countOverlappingVentCoordinates(grid);
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const grid: Grid = {};
  input.forEach(vent => {
    markHydrothermalVent(grid, vent, true);
  });
  return countOverlappingVentCoordinates(grid);
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
