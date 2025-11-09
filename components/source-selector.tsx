"use client";

import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select";
import { useSourceStore } from "@/stores/source";
import { SourceType } from "@/types";

export function SourceSelector(){
  const source = useSourceStore((state) => state.source);
  const setSource = useSourceStore((state) => state.setSource);

  return (
    <Select value={source || undefined} onValueChange={(value) => setSource(value as SourceType)}>
      <SelectTrigger size="sm" className="w-45">
        <SelectValue placeholder="Select a generator"/>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="lorem-ipsum">Lorem Ipsum</SelectItem>
          <SelectItem value="corporate">Corporate</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
