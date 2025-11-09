import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select";

export function SourceSelector() {
  return (
    <Select>
      <SelectTrigger size="sm" className="w-45">
        <SelectValue placeholder="Select a generator" />
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
