import { Slider } from "@/components";

export interface SelectionPaneProps {
  title: string;
  value: string;
  onChange: (value: string) => void;
}

export function SelectionPane(props: SelectionPaneProps) {
  const {title, value, onChange} = props;

  return (
    <div className="flex flex-col items-center justify-center">
      <h3 className="text-lg font-medium p-4">{title}</h3>

      <Slider orientation="vertical" defaultValue={[100]} max={100} step={.025}/>
    </div>
  );
}
