import { SourceType } from "@/types";
import { create } from "zustand";

interface SourceStore {
  source: SourceType | null;
  setSource: ( source: SourceType | null ) => void;
  getSource: () => SourceType | null;
}

export const useSourceStore = create<SourceStore>( ( set, get ) => ( {
  source: SourceType.LOREM_IPSUM,
  setSource: ( source ) => set( { source } ),
  getSource: () => get().source,
} ) );

