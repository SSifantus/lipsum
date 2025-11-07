import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import * as React from "react";

export function SourceSelector() {
  return (
    <Select>
      <SelectTrigger className="w-45">
        <SelectValue placeholder="Select a generator"/>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Source Texts</SelectLabel>
          <SelectItem value="ipsum">Lorem Ipsum</SelectItem>
          <SelectItem value="business">Corporate</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
