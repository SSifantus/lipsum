"use client";

import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select";
import { sources } from "@/lib/utils/sources";
import { useSourceStore } from "@/stores/source";

export function SourceSelector(){
  const {setSource, source} = useSourceStore((state) => state);

  return (
    <Select value={source?.id || undefined} onValueChange={(value) => setSource(value)}>
      <SelectTrigger size="sm" className="w-45">
        <SelectValue placeholder="Select a generator"/>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {sources.map((sourceItem) => (
            <SelectItem key={sourceItem.id} value={sourceItem.id}>{sourceItem.title}</SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
