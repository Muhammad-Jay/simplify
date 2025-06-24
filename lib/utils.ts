import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import {Liveblocks} from "@liveblocks/node";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';

  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }

  return color;
}

export function parseStringify(value: any){
  return JSON.parse(JSON.stringify(value))
}
