import fs from 'fs/promises';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'src/data/cases.json');

export interface Case {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  content: string;
  date: string;
}

export async function getCases(): Promise<Case[]> {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading cases:', error);
    // Return empty array if file doesn't exist or is invalid
    return [];
  }
}

export async function saveCases(cases: Case[]): Promise<void> {
  await fs.writeFile(DATA_FILE, JSON.stringify(cases, null, 2), 'utf-8');
}

export async function addCase(newCase: Omit<Case, 'id'>): Promise<Case> {
  const cases = await getCases();
  const id = Date.now().toString(); // Simple ID generation
  const caseWithId = { ...newCase, id };
  cases.unshift(caseWithId); // Add to top
  await saveCases(cases);
  return caseWithId;
}

export async function deleteCase(id: string): Promise<void> {
  const cases = await getCases();
  const filteredCases = cases.filter((c) => c.id !== id);
  await saveCases(filteredCases);
}
