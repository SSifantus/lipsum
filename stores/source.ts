import { getSourceById, sources } from "@/lib/utils/sources";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SourceInfo {
  id: string;
  title: string;
}

interface SourceStore {
  source: SourceInfo | null;
  setSource: (source: string | SourceInfo | null) => void;
  getSource: () => string | null;
  getSourceId: () => string | null;
  getSourceTitle: () => string | null;
}

const defaultSource: SourceInfo | null = sources[0]
  ? {id: sources[0].id, title: sources[0].title}
  : null;

export const useSourceStore = create<SourceStore>()(
  persist(
    (set, get) => ({
      source: defaultSource,
      setSource: (source) => {
        if(source === null) {
          set({source: null});
          return;
        }

        if(typeof source === "string") {
          const sourceData = getSourceById(source);
          if(sourceData) {
            set({source: {id: sourceData.id, title: sourceData.title}});
          } else {
            set({source: null});
          }
        } else {
          set({source});
        }
      },
      getSource: () => get().source?.id || null,
      getSourceId: () => get().source?.id || null,
      getSourceTitle: () => get().source?.title || null,
    }),
    {
      name: "selected-source", // localStorage key
    }
  )
);

