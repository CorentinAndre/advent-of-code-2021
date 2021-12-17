import run from "aocrunner";

type Bounds = [number, number];

type Coordinates = [x: number, y: number];

type Velocity = [vx: number, vy: number];

const parseInput = (rawInput: string): Bounds[] => {
  const trenchBoundaries = [];
  for (const match of rawInput.matchAll(/-?\d+..-?\d+/gm)) {
   trenchBoundaries.push(match[0].split('..').map(v => parseInt(v, 10)));
  }

  return trenchBoundaries;
};

const updateVelocity = ([vx, vy]: Velocity): Velocity => {
  let nextX = vx <= 0 ? 0 : (vx - 1);
  let nextY = vy - 1;

  return [nextX, nextY];
}

const calculateCoordinates = (coordinates: Coordinates, velocity: Velocity): Coordinates => {
  return [coordinates[0]+velocity[0], coordinates[1]+velocity[1]];
}

const generateVelocity = (): Velocity[] => {
  let velocities: Velocity[] = [];
  for (let x = 0; x < 140; x++) {
    for (let y = -176; y < 40000; y++) {
      velocities.push([x, y]);
    }
  }

  return velocities;
}

const isInBounds = (bounds: Bounds[], coordinates: Coordinates) => {
  return coordinates[0] >= bounds[0][0] && coordinates[0]<= bounds[0][1] && coordinates[1] >= bounds[1][0] && coordinates[1] <= bounds[1][1];
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  let velocities = generateVelocity();
  let maxHeight = 0;
  velocities.forEach((velocity) => {
    let coordinates: Coordinates = [0, 0];
    // console.log(velocity);
    let localMaxHeight = 0;
    let inBounds = false;
    for (let index = 0; index < 500; index++) {
      coordinates = calculateCoordinates(coordinates, velocity);

      // if overshoot
      if(coordinates[0] > input[0][1] || coordinates[1]<input[1][0]) {
        break;
      }
      velocity = updateVelocity(velocity);
      if(isInBounds(input, coordinates)) {
        inBounds = true;
      }
      if(coordinates[1] > localMaxHeight) {
        localMaxHeight = coordinates[1];
      }
    }
    if(inBounds && localMaxHeight > maxHeight) {
      maxHeight = localMaxHeight;
    }
  })
  return maxHeight;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  let velocities = generateVelocity();
  let matches = 0;
  velocities.forEach((velocity) => {
    let coordinates: Coordinates = [0, 0];
    for (let index = 0; index < 500; index++) {
      coordinates = calculateCoordinates(coordinates, velocity);

      // if overshoot
      if(coordinates[0] > input[0][1] || coordinates[1]<input[1][0]) {
        break;
      }
      velocity = updateVelocity(velocity);
      if(isInBounds(input, coordinates)) {
        matches++;
        break;
      }
    }
  })
  return matches;
};

run({
  part1: {
    tests: [
      // { input: `target area: x=20..30, y=-10..-5`, expected: 45 },
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
