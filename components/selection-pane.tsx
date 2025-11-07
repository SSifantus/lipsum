import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface SelectionPaneProps {
  title: string;
  value: string;
  onChange: (value: string) => void;
}

export function SelectionPane(props: SelectionPaneProps) {
  const {title, value, onChange} = props;

  return (
    <div className="flex flex-col items-center justify-center">
      <h3 className="text-lg font-medium">{title}</h3>
      <p className="text-base text-muted-foreground">{value}</p>

      <Select>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select a fruit"/>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Fruits</SelectLabel>
            <SelectItem value="apple">Apple</SelectItem>
            <SelectItem value="banana">Banana</SelectItem>
            <SelectItem value="blueberry">Blueberry</SelectItem>
            <SelectItem value="grapes">Grapes</SelectItem>
            <SelectItem value="pineapple">Pineapple</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
