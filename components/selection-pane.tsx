import { SelectionSlider } from "@/components";

export interface SelectionPaneProps {
  title: string;
  value: string;
  onChange: ( value: string ) => void;
}

export function SelectionPane( props: SelectionPaneProps ) {
  const { title, value, onChange } = props;

  return (
    <div className="flex flex-col items-center justify-center">
      <h3 className="text-lg font-medium p-4">{title}</h3>

      <SelectionSlider orientation="vertical" defaultValue={[ 1000 ]} max={1000} step={1} />
    </div>
  );
}
