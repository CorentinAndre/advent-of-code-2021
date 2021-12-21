import run from "aocrunner";
import { urlToHttpOptions } from "url";

type SnailFishNumber = [number | SnailFishNumber, number | SnailFishNumber];

const parseInput = (rawInput: string): SnailFishNumber[] => {
  return rawInput.split('\n').map(v => v.trim()).map(v => eval(v));
};

class Addition {
  private sum: SnailFishNumber = null;
  private leftovers: SnailFishNumber[] = null;
  constructor(numbers: SnailFishNumber[]) {
    this.sum = numbers.shift();
    this.leftovers = numbers;
  }

  hasLeft(): boolean {
    return Boolean(this.leftovers.length);
  }

  getElement(array: number[]): SnailFishNumber {
    return array.reduce<SnailFishNumber>((acc, elem) => {
      return acc[elem] as SnailFishNumber;
    }, this.sum);
  }

  getSum(): SnailFishNumber {
    return this.sum;
  }

  setSum(v: string): void {
    this.sum = eval(v);
  }
  
  public calculateMagnitude(): number {
    let sum = JSON.stringify(this.getSum());

    while(true) {
      let regex = /\[([0-9]+),([0-9]+)\]/g;
      const match = regex.exec(sum);
      if(!match) break;
      const [strToReplace, left, right] = match;

      sum = sum.replace(strToReplace, (parseInt(left, 10)*3+parseInt(right, 10)*2).toString())
    }

    return parseInt(sum, 10);
  }

  private reduce() {
    let sumAsString = JSON.stringify(this.getSum());
    let exploded = true;
    let splitted = true;
    let i = 0;
    let bracketCount = 0;
    let count = 0;
    const reset = () => {
      i = 0;
      bracketCount = 0;
      count++;
    }

    while(splitted || exploded) {
      splitted = false;
      exploded = false;

      reset();
      while(i < sumAsString.length) {
        const char = sumAsString[i];

        if(char === '[') {
          bracketCount+=1;
        } else if(char === ']') {
          bracketCount-=1;
        }
        if(bracketCount === 5) {
          exploded = true;
          let indexToReplace = i - 1;
          let numberToExplode = '';
          let numberToExplodeIndex = 0;
          while(sumAsString[i + numberToExplodeIndex] !== ']') {
            numberToExplode+=sumAsString[i + numberToExplodeIndex];
            numberToExplodeIndex++;
          }
          numberToExplode+=']';
          const [leftValue, rightValue] = numberToExplode.match(/[0-9]+/g).map(v => parseInt(v));

          // right part
          for (let rightIndex = indexToReplace+numberToExplode.length; rightIndex < sumAsString.length ; rightIndex++) {
            let element = sumAsString[rightIndex];
            if(element.match(/[0-9]+/g)) {
              const shift = sumAsString[rightIndex + 1].match(/[0-9]+/g) ? 2 : 1;
              if(shift === 2) element+=sumAsString[rightIndex + 1];
              const left = sumAsString.slice(0, rightIndex);
              const right = sumAsString.slice(rightIndex+shift);
              const newValue = parseInt(element, 10) + rightValue;
              sumAsString = `${left}${newValue}${right}`;
              break;
            }
          }

          // middle part
          sumAsString = sumAsString.slice(0, i) + '0' + sumAsString.slice(i+numberToExplode.length);

          // left part
          for (let leftIndex = indexToReplace; leftIndex >=0; leftIndex--) {
            let element = sumAsString[leftIndex];
            if(element.match(/[0-9]+/g)) {
              let isPreviousDouble = sumAsString[leftIndex - 1].match(/[0-9]/g)?.length > 0;
              if(isPreviousDouble) {
                element = sumAsString[leftIndex - 1] + element;
              }
              const left = sumAsString.slice(0, leftIndex - (isPreviousDouble ? 1 : 0));
              const right = sumAsString.slice(leftIndex+1);
              const newValue = parseInt(element, 10) + leftValue;
              sumAsString = `${left}${newValue}${right}`;
              break;
            }
          }

          exploded = true;
          break;
        }
        i++;
        exploded = false;
      }

      i = 0;

      while(!exploded && i < sumAsString.length) {
        const char = sumAsString[i];
        
        const number = parseInt(sumAsString[i-1]+char, 10);
        if(!exploded && !isNaN(number) && number >= 10) {
          const left = Math.floor(number / 2);
          const right = Math.ceil(number / 2);
          const newString = `[${left},${right}]`;
          sumAsString = sumAsString.replace(number.toString(), newString);
          splitted = true;
          reset();
          break;
        }
        i++;
        splitted = false;
      }
    }

    this.setSum(sumAsString);
  }

  add(): void {
    this.sum = addNumbers(this.sum, this.leftovers.shift());
    this.reduce();
  }

  sumAll(): void {
    while(this.hasLeft()) {
      this.add();
    }
  }
}
const toto = [[[[2,4],7],[6,[0,5]]],[[[6,8],[2,8]],[[2,1],[4,5]]]]

const addNumbers = (one: SnailFishNumber, two: SnailFishNumber): SnailFishNumber => {
  return [one, two];
}

const part1 = (rawInput: string) => {
  const numbers = parseInput(rawInput);
  const Operation = new Addition(numbers);

  Operation.sumAll();

  return Operation.calculateMagnitude();
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  let maxMagnitude: number = 0;
  for (let i = 0; i < input.length; i++) {
    for (let j = 0; j < input.length; j++) {
      if(j === i) continue;
      const operation = new Addition([input[i], input[j]]);
      operation.sumAll();
      const magnitude = operation.calculateMagnitude();
      if(magnitude > maxMagnitude) {
        maxMagnitude = magnitude;
      }
    }
  }
  return maxMagnitude;
};

run({
  part1: {
    tests: [
      { 
        input: `[[[0,[5,8]],[[1,7],[9,6]]],[[4,[1,2]],[[1,4],2]]]
        [[[5,[2,8]],4],[5,[[9,9],0]]]
        [6,[[[6,2],[5,6]],[[7,6],[4,7]]]]
        [[[6,[0,7]],[0,9]],[4,[9,[9,0]]]]
        [[[7,[6,4]],[3,[1,3]]],[[[5,5],1],9]]
        [[6,[[7,3],[3,2]]],[[[3,8],[5,7]],4]]
        [[[[5,4],[7,7]],8],[[8,3],8]]
        [[9,3],[[9,9],[6,[4,9]]]]
        [[2,[[7,7],7]],[[5,8],[[9,3],[0,2]]]]
        [[[[5,2],5],[8,[3,7]]],[[5,[7,5]],[4,4]]]`, 
        expected: 4140,
      },
      {
        input: `[[[[8,7],[7,7]],[[8,6],[7,7]]],[[[0,7],[6,6]],[8,7]]]`,
        expected: 3488
      },
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
