import { create } from "zustand";
import { sources } from "@/lib/utils/sources";

interface SourceStore {
  source: string | null;
  setSource: ( source: string | null ) => void;
  getSource: () => string | null;
}

export const useSourceStore = create<SourceStore>( ( set, get ) => ( {
  source: sources[ 0 ]?.id || null,
  setSource: ( source ) => set( { source } ),
  getSource: () => get().source,
} ) );

