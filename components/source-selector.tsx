import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select";

export function SourceSelector() {
  return (
    <Select>
      <SelectTrigger size="sm" className="w-45">
        <SelectValue placeholder="Select a generator"/>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="ipsum">Lorem Ipsum</SelectItem>
          <SelectItem value="business">Corporate</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
