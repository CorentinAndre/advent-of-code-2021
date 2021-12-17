import run from "aocrunner";

const parseInput = (rawInput: string) => {
  return rawInput.split('\n').map<[string, string]>(s => (s.trim().split('-')) as [string, string]);
};

type CaveID = string;

enum CaveSize {
  SMALL = 'SMALL',
  BIG = 'BIG',
}

interface Cave {
  id: CaveID;
  siblings: CaveID[];
  size: CaveSize;
}

const getCaveSize = (id: CaveID): CaveSize => {
  return /[A-Z]/.test(id) ? CaveSize.BIG : CaveSize.SMALL;
}

interface Caves {
  [key: CaveID]: Cave;
}

const START_ID = 'start';
const END_ID = 'end';

class Graph {
  public caves: Caves = {};
  private start: Cave;
  private end: Cave;
  constructor(input: [CaveID, CaveID][]) {
    input.forEach(([firstEdge, secondEdge]) => {
      this.parseVertice([firstEdge, secondEdge]);
    })
  }

  private parseVertice([firstEdge, secondEdge]: [CaveID, CaveID]): void {
    this.parseEdge(firstEdge, secondEdge);

    this.parseEdge(secondEdge, firstEdge);
  }

  private parseEdge(edge: CaveID, sibling: CaveID): void {
    if(edge === START_ID) {
      if(this.start) {
        this.start.siblings.push(sibling);
      } else {
        this.start = {
          id: edge,
          siblings: [sibling],
          size: getCaveSize(edge)
        }
      }

      return;
    }

    if(edge === END_ID) {
      if(this.end) {
        this.end.siblings.push(sibling);
      } else {
        this.end = {
          id: edge,
          siblings: [sibling],
          size: getCaveSize(edge)
        }
      }

      return;
    }

    if(Object.prototype.hasOwnProperty.call(this.caves, edge)) {
      this.caves[edge].siblings.push(sibling);
    } else {
      this.caves[edge] = {
        id: edge,
        siblings: [sibling],
        size: getCaveSize(edge),
      }
    }
  }

  exploreEdge(edge: CaveID, stack: CaveID[]) {
    if(edge === this.end.id) {
      return stack.join('-');
    }

    return this.caves[edge].siblings.filter(sibling => {
      if(sibling === START_ID) return false;
      if(sibling === END_ID) return true;
      if(this.caves[sibling].size === CaveSize.SMALL) {
        return !stack.includes(sibling);
      }
      return true;
    }).map(sibling => {
      return this.exploreEdge(sibling, [...stack, sibling])
    });
  }

  exploreEdgeWithRepeat(edge: CaveID, stack: CaveID[], repeat = true) {
    if(edge === this.end.id) {
      return stack.join('-');
    }

    return this.caves[edge].siblings.map(sibling => {
      if(sibling === START_ID) return [];
      if(sibling === END_ID) return this.exploreEdgeWithRepeat(sibling, [...stack, sibling], repeat);
      let nextRepeat = repeat;
      const shouldSkip = this.caves[sibling].size === CaveSize.SMALL && stack.includes(sibling);

      if(nextRepeat && shouldSkip) {
        nextRepeat = false;
      } else if (shouldSkip) {
        return [];
      }

      return this.exploreEdgeWithRepeat(sibling, [...stack, sibling], nextRepeat);

    })
  }

  depthFirstSearch(withRepeat = false) {
    const stack = [];
    this.start.siblings.forEach(sibling => {
      withRepeat ? stack.push(this.exploreEdgeWithRepeat(sibling, ['start', sibling], true)) : stack.push(this.exploreEdge(sibling, ['start', sibling]));
    })

    return stack;
  }
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const graph = new Graph(input);
  return graph.depthFirstSearch().flat(Infinity).length;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const graph = new Graph(input);
  console.log(graph.depthFirstSearch(true).flat(Infinity));
  return graph.depthFirstSearch(true).flat(Infinity).length;
};

run({
  part1: {
    tests: [
      { input: `start-A
      start-b
      A-c
      A-b
      b-d
      A-end
      b-end`, expected: 10 },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      { input: `start-A
      start-b
      A-c
      A-b
      b-d
      A-end
      b-end`, expected: 36 },
    ],
    solution: part2,
  },
  trimTestInputs: true,
});
