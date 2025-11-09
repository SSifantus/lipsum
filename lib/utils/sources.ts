import legalData from "@/data/legal.json";
import loremIpsumData from "@/data/lorem-ipsum.json";
import pirateData from "@/data/pirate.json";
import saganData from "@/data/sagan.json";
import shakespeareData from "@/data/shakespeare.json";
import whitmanData from "@/data/whitman.json";

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
  legalData,
  pirateData,
  saganData,
  shakespeareData,
  whitmanData,
];

/**
 * Get a source by its ID
 */
export function getSourceById(id: string): SourceData | undefined{
  return sources.find(source => source.id === id);
}
