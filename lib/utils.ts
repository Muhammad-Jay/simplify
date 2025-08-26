import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import {Dexie} from "dexie"
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

export function indexDb({DBNAME, template, id}: {DBNAME: string, template: string, id: string}){
  const db = new Dexie(`${DBNAME}:${template}:${id}`)
  db.version(1).stores({
    files: "id, template, files, path, code, author_id, status",
    metadata: "id, name, description, dependencies, tags, template, author_id, status"
  })

  return db;
}
