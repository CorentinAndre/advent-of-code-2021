import run from "aocrunner";

interface Instruction {
  foldLine: number,
  foldWay: 'x' | 'y',
}

type Coordinate = [number, number];

interface Input {
  coordinates: Coordinate[],
  fold: Instruction[],
}

type Grid = boolean[][];

const parseInput = (rawInput: string): Input => {
  const strings =  rawInput.split('\n').map(s => s.trim());

  return {
    coordinates: strings.filter(str => str.includes(',')).map(coordinates => coordinates.split(',').map(v => parseInt(v, 10))) as [number, number][],
    fold: strings.filter(str => str.includes('fold')).map(instruction => {
      const array = instruction.split('=');
      return {
        foldLine: parseInt(array[array.length - 1], 10),
        foldWay: array[0][array[0].length - 1] as ('x' | 'y')
      }
    }),
  }
};

const buildGrid = (coordinates: [number, number][]): Grid => {
  let grid: Grid = [];
  const maxRow = coordinates.reduce((acc, [row, col]) => {
    return row > acc ? row : acc;
  }, 0);

  const maxCol = coordinates.reduce((acc, [row, col]) => {
    return col > acc ? col : acc;
  }, 0);
  for (let row = 0; row <= maxRow; row++) {
    let col = new Array(maxCol+1).fill(undefined);
    grid.push(col);
  }


  coordinates.forEach(([row, col]) => {
    grid[row][col] = true;
  })

  return grid;
}

const reverseGridVertically = (grid: Grid): Grid => {
  for (let x = 0; x < grid.length; x++) {
    grid[x].reverse();
  }

  return grid;
}

const reverseGridHorizontally = (grid: Grid): Grid => {
  return grid.reverse();
}

const multiplyGrid = (grid1: Grid, grid2: Grid): Grid => {
  const newGrid = [...grid1];
  for (let x = 0; x < newGrid.length; x++) {
    for (let y = 0; y < newGrid[x].length; y++) {
      newGrid[x][y] = grid1[x][y] || grid2[x]?.[y];
    }
  }
  return newGrid;
}

const addRows = (grid: Grid, rowsToAdd: number): Grid => {
  grid.forEach(col => {
    for (let index = 0; index < rowsToAdd; index++) {
      col.push(false)
    }
  })
  return grid;
}

const addCols = (grid: Grid, colsToAdd: number): Grid => {
  for (let index = 0; index < colsToAdd; index++) {
    grid.push(new Array(grid[0].length).fill(false));
  }
  return grid;
}

const foldGrid = (grid: Grid, {foldLine, foldWay}: Instruction): Grid => {
  // vert
  if(foldWay === 'y') {
    let firstSubGrid = grid.map(col => col.filter((v, index) => index < foldLine));
    let secondSubGrid = grid.map(col => col.filter((v, index) => index > foldLine));
    if(firstSubGrid[0].length > secondSubGrid[0].length) {
      // reverse second
      secondSubGrid = addRows(secondSubGrid, firstSubGrid[0].length - secondSubGrid[0].length);
      secondSubGrid = reverseGridVertically(secondSubGrid);

      return multiplyGrid(firstSubGrid, secondSubGrid);
    } else {
      // reverse first
      firstSubGrid = addRows(firstSubGrid,secondSubGrid[0].length - firstSubGrid[0].length);
      firstSubGrid = reverseGridVertically(firstSubGrid);

      return multiplyGrid(secondSubGrid, firstSubGrid);
    }
  } else {
    let firstSubGrid = grid.filter((row, index) => index < foldLine);
    let secondSubGrid = grid.filter((_, index) => index > foldLine);

    if(firstSubGrid.length > secondSubGrid.length) {
      // reverse second

      secondSubGrid = addCols(secondSubGrid, firstSubGrid.length - secondSubGrid.length);
      secondSubGrid = reverseGridHorizontally(secondSubGrid);

      return multiplyGrid(firstSubGrid, secondSubGrid);
    } else {
      // reverse first

      firstSubGrid = addCols(firstSubGrid,secondSubGrid.length - firstSubGrid.length);
      firstSubGrid = reverseGridHorizontally(firstSubGrid);
      
      return multiplyGrid(secondSubGrid, firstSubGrid);
    }
  }
  

}


const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  console.log(input.coordinates.length);
  let grid = buildGrid(input.coordinates);
  grid = foldGrid(grid, input.fold[0]);
  let count = 0;
  grid.forEach(row => row.forEach(v => {
    if(v) count+=1;
  }))
  return count;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  console.log(input.coordinates.length);
  let grid = buildGrid(input.coordinates);
  input.fold.forEach(instruction => {
    grid = foldGrid(grid, instruction);
  });
  for (let index = 0; index < grid[0].length; index++) {
    let line = '';
    for (let row = 0; row < grid.length; row++) {
      line+=(grid[row][index] ? "#" : '.');
    }
    console.log(line);
  }
  return 'LRFJBJEH';
};

run({
  part1: {
    tests: [
      { input: `6,10
      0,14
      9,10
      0,3
      10,4
      4,11
      6,0
      6,12
      4,1
      0,13
      10,12
      3,4
      3,0
      8,4
      1,10
      2,14
      8,10
      9,0
      
      fold along x=5
      fold along x=5`, expected: 17 },
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
