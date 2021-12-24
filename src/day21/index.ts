import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput;

class Die {
  private value = 0;
  private max: number;
  private rollCount = 0;

  constructor(max: number) {
    this.max = max;
  }

  public roll(): number {
    let newValue = null;
    if(this.value + 1 > 100) {
      newValue = 1;
    }else {
      newValue = this.value + 1;
    }
    this.value = newValue;
    this.rollCount++;
    return newValue;
  }

  public getRollCount(): number {
    return this.rollCount;
  }

  public getValue() {
    return this.value;
  }
}

interface Player {
  id: number,
  position: number,
  score: number,
}

class Board {
  private players: Player[] = [];
  private length: number;
  constructor(boardLength: number) {
    this.length = boardLength;
  }

  public addPlayer(position: number): Player {
    const player = {
      id: this.players.length+1,
      position: position,
      score: 0,
    }

    this.players.push(player);

    return player;
  }

  public getPlayer(id: number): Player {
    const player = this.players.find(player => player.id === id);
    if(!player) {
      throw new Error('No player');
    }

    return player;
  }

  public updatePlayer(playerId: number, player: Omit<Player, 'id'>): Player {
    const playerIndex = this.players.findIndex(({id}) => id === playerId);
    if(playerIndex >= 0) {
      this.players[playerIndex].position = player.position;
      this.players[playerIndex].score = player.score;

      return this.players[playerIndex];
    } else {
      throw new Error('no player at specified index');
    }
  }

  public movePlayer(id: number, movements: number) {
    const player = this.getPlayer(id);
    let newPosition = (player.position + movements) % this.length;

    if(newPosition === 0) {
      newPosition = this.length;
    }

    return this.updatePlayer(player.id, {
      position: newPosition,
      score: player.score + newPosition,
    })
  }
}




const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const die = new Die(100);

  const board = new Board(10);

  const {id: id1} = board.addPlayer(8);
  const {id: id2} = board.addPlayer(10);

  // for (let index = 0; index < 20; index++) {
  //   const newRoll = die.roll();
  //   const player = board.getPlayer(id1); 
  //   console.log({newRoll, player});
  //   console.log('--- after ---');
  //   const newPlayer = board.movePlayer(id1, newRoll);
  //   console.log({player: newPlayer}, '\n');
  // }

  let winner = null;

  while (true) {
    const player1 = board.getPlayer(id1);
    const player2 = board.getPlayer(id2);

    const player1Roll = die.roll() + die.roll() + die.roll();
    console.log({player1, player1Roll});
    console.log('--- after ---');
    console.log(board.movePlayer(id1, player1Roll));

    if(player1.score >= 1000) {
      winner = player1;
      break;
    }
    console.log("------");
    const player2Roll = die.roll() + die.roll() + die.roll();
    console.log({player2, player2Roll});
    console.log('--- after ---');
    console.log(board.movePlayer(id2, player2Roll));

    if(player2.score >= 1000) {
      winner = player2;
      break;
    }

    console.log("\n");
  }
  console.log(winner.id);
  console.log(die.getRollCount());
  console.log({player1: board.getPlayer(id1), player2: board.getPlayer(id2)})

  return 810*die.getRollCount();
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

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
