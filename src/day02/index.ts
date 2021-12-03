import run from "aocrunner";

const parseInput = (input: string): string[] => {
  const commands = input.split('\n');
  
  return commands;
}

const parseCommand = (command: string) => {
  const [instruction, value] = command.split(' ');

  return {instruction, value: parseInt(value, 10)};
};

const part1 = (rawInput: string) => {
  const commands = parseInput(rawInput);
  let horizontalPos = 0;
  let depth = 0;
  commands.forEach(command => {
    const {instruction, value} = parseCommand(command);
    switch (instruction) {
      case 'forward':
        horizontalPos+=value;
        break;
      case 'up':
        depth-=value;
      default:
        break;
      case 'down':
        depth+=value;
    }
  });
  return horizontalPos*depth;
};

const part2 = (rawInput: string) => {
  const commands = parseInput(rawInput);
  let horizontalPos = 0;
  let depth = 0;
  let aim = 0;
  commands.forEach(command => {
    const {instruction, value} = parseCommand(command);
    switch (instruction) {
      case 'forward':
        horizontalPos+=value;
        depth+=aim*value;
        break;
      case 'up':
        aim-=value;
      default:
        break;
      case 'down':
        aim+=value;
    }
  });
  return horizontalPos*depth;
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
