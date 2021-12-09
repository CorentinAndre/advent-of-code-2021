import run from "aocrunner";

interface Coordinates {
  x: number,
  y: number,
}

interface CoordinatesWithHeight extends Coordinates {
  height: number;
}

type HeightMap = number[][];

const parseInput = (rawInput: string): HeightMap => {
  return rawInput.split('\n').map(line => {
    return line.trim().split('').map(height => parseInt(height, 10))
  });
};

const getAdjacentValues = ({x, y}: Coordinates, heightMap: HeightMap): number[] => {
  let adjacents = [];
  // top
  if(heightMap[x] && heightMap[x][y - 1] !== null) {
    adjacents.push(heightMap[x][y - 1]);
  }
  // bottom
  if(heightMap[x] && heightMap[x][y + 1] !== null) {
    adjacents.push(heightMap[x][y + 1]);
  }
  // left
  if(heightMap[x - 1] && heightMap[x - 1][y] !== null) {
    adjacents.push(heightMap[x - 1][y]);
  }
  // right
  if(heightMap[x + 1] && heightMap[x + 1][y] !== null) {
    adjacents.push(heightMap[x + 1][y]);
  }

  return adjacents.filter(adj => adj >= 0);
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  let lowPointsCount = 0;
  input.forEach((line, x) => {
    line.forEach((height, y) => {
      if(getAdjacentValues({x,y}, input).every(adj => adj > height)) {
        lowPointsCount+=(height+1);
      }
    })
  });

  return lowPointsCount;
};

const getLowPointsCoordinates = (heightMap: HeightMap): Coordinates[] => {
  let lowPointsCoordinates: Coordinates[] = [];
  heightMap.forEach((line, x) => {
    line.forEach((height, y) => {
      if(getAdjacentValues({x,y}, heightMap).every(adj => adj > height)) {
        lowPointsCoordinates.push({x, y})
      }
    })
  });
  return lowPointsCoordinates;
}

const existInBasin = (basinCoordinates: CoordinatesWithHeight[], toCheck: Coordinates): boolean => {
  return basinCoordinates.findIndex(v => v.x === toCheck.x && v.y === toCheck.y) >= 0;
}

const expandBasin = (basinCoordinates: CoordinatesWithHeight[], counter: number, heightMap: HeightMap): CoordinatesWithHeight[] => {
  basinCoordinates.forEach(({x, y, height}) => {
    if(heightMap[x] && heightMap[x][y - 1] < 9 && height === counter && !existInBasin(basinCoordinates, {x, y: y - 1})) {
      basinCoordinates.push({x, y: y - 1, height: heightMap[x][y - 1]});
    }
    // bottom
    if(heightMap[x] && heightMap[x][y + 1] < 9 && height === counter && !existInBasin(basinCoordinates, {x, y: y + 1})) {
      basinCoordinates.push({x, y: y + 1, height: heightMap[x][y + 1]});
    }
    // left
    if(heightMap[x - 1] && heightMap[x - 1][y] < 9 && height === counter && !existInBasin(basinCoordinates, {x: x - 1, y})) {
      basinCoordinates.push({x: x - 1, y, height: heightMap[x - 1][y]});
    }
    // right
    if(heightMap[x + 1] && heightMap[x + 1][y] < 9 && height === counter && !existInBasin(basinCoordinates, {x: x + 1, y})) {
      basinCoordinates.push({x: x + 1, y, height: heightMap[x + 1][y]});
    }
  })

  return basinCoordinates;
}

const calculateBasin = (heightMap: HeightMap, lpCoordinates: Coordinates, lowestPointValue: number): CoordinatesWithHeight[] => {
  let basinCoordinates: CoordinatesWithHeight[] = [{...lpCoordinates, height: lowestPointValue}];
  let counter = lowestPointValue;
  while(counter < 9) {
    basinCoordinates = [...expandBasin(basinCoordinates, counter, heightMap)];
    counter+=1;
  }

  return basinCoordinates;
} 

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const lpCoordinates = getLowPointsCoordinates(input);
  let basins: CoordinatesWithHeight[][] = [];
  lpCoordinates.forEach((lp) => basins.push(calculateBasin(input, lp, input[lp.x][lp.y])));
  const sortedBasinsLength = basins.reduce<number[]>((acc, basin) => {
    return [...acc, basin.length];
  }, []).sort((a, b) => b - a);
  return sortedBasinsLength[0]*sortedBasinsLength[1]*sortedBasinsLength[2];
};

run({
  part1: {
    tests: [
      { input: `2199943210
      3987894921
      9856789892
      8767896789
      9899965678`, expected: 15 },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      { input: `2199943210
      3987894921
      9856789892
      8767896789
      9899965678`, expected: 1134 },
    ],
    solution: part2,
  },
  trimTestInputs: true,
});
