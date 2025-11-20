"use client";

import { useState, useEffect } from "react";
import { Share } from "@/components/share";
import { url } from "@/lib/metadata";

const fruits = ["Apple", "Banana", "Cherry", "Lemon"] as const;
type Fruit = typeof fruits[number];

function randomFruit(): Fruit {
  return fruits[Math.floor(Math.random() * fruits.length)];
}

export default function SlotMachine() {
  const [grid, setGrid] = useState<Fruit[][]>([
    [randomFruit(), randomFruit(), randomFruit()],
    [randomFruit(), randomFruit(), randomFruit()],
    [randomFruit(), randomFruit(), randomFruit()],
  ]);
  const [spinning, setSpinning] = useState(false);
  const [win, setWin] = useState(false);

  useEffect(() => {
    if (!spinning) return;
    const interval = setInterval(() => {
      setGrid((prev) => {
        const newRow = [randomFruit(), randomFruit(), randomFruit()];
        const [, ...rest] = prev;
        return [newRow, ...rest];
      });
    }, 200);
    const timeout = setTimeout(() => {
      clearInterval(interval);
      setSpinning(false);
    }, 2000);
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [spinning]);

  // Check win condition directly in render
  const hasWin =
    (grid[0][0] === grid[0][1] && grid[0][1] === grid[0][2]) ||
    (grid[1][0] === grid[1][1] && grid[1][1] === grid[1][2]) ||
    (grid[2][0] === grid[2][1] && grid[2][1] === grid[2][2]) ||
    (grid[0][0] === grid[1][0] && grid[1][0] === grid[2][0]) ||
    (grid[0][1] === grid[1][1] && grid[1][1] === grid[2][1]) ||
    (grid[0][2] === grid[1][2] && grid[1][2] === grid[2][2]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="grid grid-cols-3 gap-2">
        {grid.flat().map((fruit, idx) => (
          <div key={idx} className="w-16 h-16 flex items-center justify-center border rounded">
            <img
              src={`/${fruit.toLowerCase()}.png`}
              alt={fruit}
              width={64}
              height={64}
            />
          </div>
        ))}
      </div>
      <button
        className="px-4 py-2 bg-primary text-primary-foreground rounded"
        onClick={() => setSpinning(true)}
        disabled={spinning}
      >
        {spinning ? "Spinning..." : "Spin"}
      </button>
      {hasWin && !spinning && (
        <div className="flex flex-col items-center gap-2">
          <span className="text-xl font-bold text-green-600">You Win!</span>
          <Share text={`I just won the Fruit Slot Machine! ${url}`} />
        </div>
      )}
    </div>
  );
}
