import run from "aocrunner";

interface BingoNumber {
  value: number,
  marked: boolean
}

type BingoTable = BingoNumber[][];

const parseBingoTable = (rawTable: string[]): BingoTable => {
  const table: BingoTable = [];
  rawTable.forEach((line, index) => {
    table.push([]);
    line.split(' ').filter(val => val !== '').map(val => parseInt(val, 10)).forEach(value => table[index].push({value, marked: false}));
  })
  return table;
}

const parseInput = (rawInput: string) => {
  const [draws, ...bingoTables] = rawInput.split('\n').filter((val) => val !== '');
  const numberOfTables = bingoTables.length / 5;
  const tables = [];
  for (let i = 0; i < numberOfTables; i++) {
    tables.push([]);
    for (let j = 0; j < 5; j++) {
      tables[i].push(bingoTables[(i*5)+j]);
    }
  }
  return {draws: draws.split(',').map((v) => parseInt(v, 10)), bingoTables: tables.map(parseBingoTable)};
};

const markBingoTable = (draw: number, bingoTable: BingoTable) => {
  const bingoTableToMark = [...bingoTable];
  bingoTable.forEach((line, lIndex) => {
    line.forEach((bingoNumber, colIndex) => {
      if(bingoNumber.value === draw) bingoTableToMark[lIndex][colIndex].marked = true;
    })
  })

  return bingoTableToMark;
}

const checkLines = (table: BingoTable): boolean => {
  let win = false;
  for (let index = 0; index < 5; index++) {
    win = table[index].every(({marked}) => marked === true);
    if (win) break;
  }
  return win;
}

const checkColumn = (table: BingoTable): boolean => {
  let win = false;
  for (let colIndex = 0; colIndex < 5; colIndex++) {
    const column = table.map(line => line[colIndex]);
    win = column.every(({marked}) => marked === true);
    if(win) {
      // throw new Error('win')
    }
    if(win) break; 
  }
  return win;
}

const calculateScore = (table: BingoTable, draw: number): number => {
  let sum = 0;
  table.forEach(line => {
    line.forEach(num => {
      if(!num.marked) {
        sum+=num.value;
      }
    })
  });
  return draw * sum;
}

const checkBingoTable = (table: BingoTable): boolean => {
  if(checkLines(table) || checkColumn(table)) {
    return true;
  }
  return false;
}

const part1 = (rawInput: string) => {
  let score = null;
  const {draws, bingoTables} = parseInput(rawInput);
  draws.forEach((draw, drawIndex) => {
    if(!score) {
      bingoTables.forEach((t) => {
        markBingoTable(draw, t);
        if(checkBingoTable(t)) {
          score = calculateScore(t, draw);
        }
      });
    }
  });
  return score;
};

const part2 = (rawInput: string) => {
  let winningBoards = [];
  const {draws, bingoTables} = parseInput(rawInput);
  draws.forEach((draw) => {
    if(winningBoards.length < bingoTables.length) {
      bingoTables.forEach((t, tIndex) => {
        markBingoTable(draw, t);
        if(!winningBoards.includes(tIndex)) {
          if(checkBingoTable(t)) {
            winningBoards.push(tIndex);
            if(winningBoards.length === bingoTables.length) {
              console.log(calculateScore(t, draw));
            }
          }
        }
      });
    }
  });
  // return score;

  return;
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
