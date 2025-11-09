import corporateData from "@/data/corporate.json";
import loremIpsumData from "@/data/lorem-ipsum.json";
import saganData from "@/data/sagan.json";

export interface SourceData {
  id: string;
  title: string;
  text: string;
}

/**
 * Registry of all available sources
 * Add new sources here by importing the JSON file and adding it to the array
 */
export const sources: SourceData[] = [
  loremIpsumData,
  corporateData,
  saganData,
];

/**
 * Get a source by its ID
 */
export function getSourceById(id: string): SourceData | undefined {
  return sources.find(source => source.id === id);
}

/**
 * Get all source IDs
 */
export function getAllSourceIds(): string[] {
  return sources.map(source => source.id);
}

