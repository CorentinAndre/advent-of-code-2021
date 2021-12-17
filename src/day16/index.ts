import run from "aocrunner";

const map = {
  '0' : '0000',
  '1' : '0001',
  '2' : '0010',
  '3' : '0011',
  '4' : '0100',
  '5' : '0101',
  '6' : '0110',
  '7' : '0111',
  '8' : '1000',
  '9' : '1001',
  'A' : '1010',
  'B' : '1011',
  'C' : '1100',
  'D' : '1101',
  'E' : '1110',
  'F' : '1111',
}

const operations = [
  (v: number[]) => v.reduce((acc, v) => v+acc, 0),
  (v: number[]) => v.reduce((acc, v) => v*acc, 1),
  (v: number[]) => Math.min(...v),
  (v: number[]) => Math.max(...v),
  (v: number[]) => {throw new Error('should not happen')},
  ([first, second]: number[]) => first > second ? 1 : 0,
  ([first, second]: number[]) => first < second ? 1 : 0,
  ([first, second]: number[]) => first === second ? 1 : 0,
]

const hexaToBinary = (hexa: string): string => {
  let binary = '';
  for (let index = 0; index < hexa.length; index++) {
    binary+=map[hexa[index]];
  }
  return binary;
}

const isLiteralPacket = (type: number) => type === 4;

const parseInput = (rawInput: string) => hexaToBinary(rawInput.trim());

const getDecimalValue = (str: string, cursor: number, length: number): number => parseInt(str.slice(cursor, cursor + length), 2);

const parsePacket = (packets, input: string, cursor: number, level = 0) => {
  const version = getDecimalValue(input, cursor, 3)
  cursor+=3;
  const type = getDecimalValue(input, cursor, 3);
  cursor+=3;
  if(isLiteralPacket(type)) {
    let literalValue: string = '';
    let loop = true;
    while(loop) {
      if(input[cursor] === '0') {
        loop = false;
      }
      cursor+=1;
      literalValue += input.slice(cursor, cursor+4);
      cursor+=4;
    }
    packets.push({version, type, value: parseInt(literalValue, 2), level});
  } else {
    const lengthType = input[cursor];
    cursor+=1;
    level++;
    if(lengthType === '0') {
      const subPacketsLength = getDecimalValue(input, cursor, 15);
      cursor+=15;
      const end = cursor+subPacketsLength;
      do {
        let [nextCursor] = parsePacket(packets, input, cursor, level);
        cursor = nextCursor;
      } while(cursor < end);
      cursor = end;
    } else {
      const subPacketsCount = getDecimalValue(input, cursor, 11);
      cursor+=11;

      for (let index = 0; index < subPacketsCount; index++) {
        let [nextCursor] = parsePacket(packets, input, cursor, level);
        cursor = nextCursor;
      }
    }
    packets.push({version, type, level});
  }
  return [cursor, packets];
}

const getMaxLevel = (packets) => {
  return Math.max(...packets.map(({level}) => {
    return level;
  }));
}

const calculate = (packets: any[], currentLevel) => {
  let numbers = [];
  while(currentLevel > 0) {
    for (let index = 0; index < packets.length; index++) {
      const packet = packets[index];
      if(packet.level === currentLevel) {
        if(packet.type === 4) {
          numbers.push(packet.value);
          packets.splice(index, 1);
          index--;
        } else {
          // to keep precedence
          packets[index] = {type: 4, value: operations[packet.type](numbers), level: (currentLevel - 1)};
          numbers = [];
        }
      }
    }
    currentLevel--;
  }
}

const part1 = (rawInput: string) => {
  let packets = [];
  const input = parseInput(rawInput);
  parsePacket(packets, input, 0);
  const sum = packets.reduce((acc, {version}) => acc + version, 0);
  return sum;
};

const part2 = (rawInput: string) => {
  let packets = [];
  const input = parseInput(rawInput);
  parsePacket(packets, input, 0)
  const highestLevel = getMaxLevel(packets);
  calculate(packets, highestLevel);
  console.log(packets[packets.length - 1]);

  return packets[packets.length - 1].value;
};

run({
  part1: {
    tests: [
    ],
    solution: part1,
  },
  part2: {
    tests: [
      { input: `3600888023024C01150044C0118330A440118330E44011833085C0118522008C29870`, expected: 1 },
      { input: `9C005AC2F8F0`, expected: 0 },
    ],
    solution: part2,
  },
  trimTestInputs: true,
});
