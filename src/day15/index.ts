import run from "aocrunner";
import {Heap} from 'heap-js';

const parseInput = (rawInput: string): Graph => rawInput.split('\n').map(s => s.trim()).map(line => {
  const lineAsNumber = [];
  for (let index = 0; index < line.length; index++) {
    const element = line[index];
    lineAsNumber.push(Number(element));
  }
  return lineAsNumber;
});

type Graph = number[][];

type Coordinates = [number, number];

type Distances = Map<string, number>;

type Visited = Set<string>;

const getKey = (coordinates: Coordinates) => {
  return coordinates.join(',');
}

const getNeighbours = (graph: Graph, [x, y]: Coordinates, visited: Visited): Coordinates[] => {
  const neighbours: Coordinates[] = [];
  if(graph[x - 1]?.[y] && !visited.has(getKey([x - 1, y]))) {
    neighbours.push([x - 1, y]);
  }
  if(graph[x + 1]?.[y] && !visited.has(getKey([x + 1, y]))) {
    neighbours.push([x + 1, y]);
  }
  if(graph[x]?.[y - 1] && !visited.has(getKey([x, y - 1]))) {
    neighbours.push([x, y - 1]);
  }
  if(graph[x]?.[y + 1] && !visited.has(getKey([x, y + 1]))) {
    neighbours.push([x, y + 1]);
  }
  return neighbours;
}

const dijkstra = (graph: Graph, start: Coordinates) => {
  const distances = new Map<string, number>();
  const visited = new Set<string>();
  let current: Coordinates | null = start;
  distances.set(getKey(current), 0);
  // This won't work because it won't take into account left and up movements. Better use a queue for this
  // for (let i = 0; i < graph.length; i++) {
  //   for (let j = 0; j < graph[0].length; j++) {
  //     const current: Coordinates = [i, j];
  //     const currentKey = getKey(current);
  //     const currentDistance = distances.get(currentKey) || 0;
  //     visited.add(currentKey);
  //     const neighbours = getNeighbours(graph, current, visited);
  //     for (const neighbour of neighbours) {
  //       const neighbourKey = getKey(neighbour);
  //       if(!distances.has(neighbourKey)) {
  //         distances.set(neighbourKey, currentDistance+ graph[neighbour[0]][neighbour[1]])
  //       } else {
  //         if(currentDistance+ graph[neighbour[0]][neighbour[1]] < distances.get(neighbourKey)!) {
  //           distances.set(neighbourKey, currentDistance+ graph[neighbour[0]][neighbour[1]])
  //         }
  //       }
  //     }
  //   }
  // }
  const queue = [{pos: current, weight: 0}];
  while(queue.length) {
    const {
      pos: [x, y],
      weight,
    } = queue.shift() as {pos: Coordinates, weight: number};
    if(x === graph.length - 1 && y === graph[0].length - 1) return weight;

    const neighbours = getNeighbours(graph, [x, y], visited);
    neighbours.forEach(neighbour => {
      const neighbourKey = getKey(neighbour);
      visited.add(neighbourKey);
      queue.push({pos: neighbour, weight: weight + graph[neighbour[0]][neighbour[1]]});
    })
    queue.sort((a, b) => a.weight - b.weight);
  }
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  return dijkstra(input, [0, 0]);
};

const copyAndIncreaseGraph = (graph: Graph, indice: number): Graph => {
  return graph.map(line => line.map(col => {
    return col + indice <= 9 ? col+indice : (col+indice)%9;
  }))
};

const horizontalJoin = (initial: Graph | null, append: Graph): Graph => {
  if(!initial) return append;
  return initial.map((line, index) => [...line, ...append[index]]);
}

const verticalJoin = (initial: Graph | null, append: Graph): Graph => {
  if(!initial) return append;
  initial.push(...append);
  return initial;
}

const buildBiggerMap = (initialGraph: Graph): Graph => {
  let bigMap: Graph = null;
  for (let i = 0; i < 5; i++) {
    let row = null;
    for (let j = 0; j < 5; j++) {
      row = horizontalJoin(row, copyAndIncreaseGraph(initialGraph, i+j));
    }
    bigMap = verticalJoin(bigMap, row as Graph);
  }

  return bigMap;
}

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const biggerMap = buildBiggerMap(input);
  return dijkstra(biggerMap, [0, 0]);
};

run({
  part1: {
    tests: [
      { input: `1163751742
      1381373672
      2136511328
      3694931569
      7463417111
      1319128137
      1359912421
      3125421639
      1293138521
      2311944581`, expected: 40 },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      { input: `1163751742
      1381373672
      2136511328
      3694931569
      7463417111
      1319128137
      1359912421
      3125421639
      1293138521
      2311944581`, expected: 315 },
    ],
    solution: part2,
  },
  trimTestInputs: true,
});
