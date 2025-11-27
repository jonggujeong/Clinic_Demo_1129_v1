import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'src/data');
const CASES_FILE = path.join(DATA_DIR, 'cases.json');
const POPUPS_FILE = path.join(DATA_DIR, 'popups.json');

export interface Case {
  id: string;
  title: string;
  category: string;
  content: string;
  imageUrl: string;
  createdAt: string;
}

export interface Popup {
  id: string;
  imageUrl: string;
  link: string;
  isActive: boolean;
}

function readJsonFile<T>(filePath: string): T[] {
  try {
    const fileContents = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileContents);
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
    return [];
  }
}

function writeJsonFile<T>(filePath: string, data: T[]): void {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error(`Error writing file ${filePath}:`, error);
  }
}

export const getCases = (): Case[] => readJsonFile<Case>(CASES_FILE);
export const saveCases = (cases: Case[]) => writeJsonFile<Case>(CASES_FILE, cases);

export const getPopups = (): Popup[] => readJsonFile<Popup>(POPUPS_FILE);
export const savePopups = (popups: Popup[]) => writeJsonFile<Popup>(POPUPS_FILE, popups);
