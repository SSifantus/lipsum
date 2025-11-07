import { SelectionPane } from "./selection-pane";


const panes = [
  {
    title: "Characters",
    value: "characters",
    step: 1,
    min: 0,
    max: 5000,
  },
  {
    title: "Words",
    value: "words",
    step: 1,
    min: 0,
    max: 2000,
  },
  {
    title: "Sentences",
    value: "sentences",
    step: 1,
    min: 0,
    max: 100,
  },
  {
    title: "Paragraphs",
    value: "paragraphs",
    step: 1,
    min: 0,
    max: 100,
  },
];

export function SelectionSurface() {
  return (
    <div className="w-full h-full grid grid-cols-4 grid-rows-1 pb-20">
      {panes.map((pane) => (
        <SelectionPane key={pane.title} title={pane.title} value={pane.value} onChange={() => {
        }}/>
      ))}
    </div>
  );
}
