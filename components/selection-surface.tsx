
import { SelectionPane } from "./selection-pane";


const panes = [
  {
    title: "Characters",
    value: "characters",
  },
  {
    title: "Words",
    value: "words",
  },
  {
    title: "Sentences",
    value: "sentences",
  },
  {
    title: "Paragraphs",
    value: "paragraphs",
  },
];

export function SelectionSurface() {
  return (
    <div className="w-full h-full grid grid-cols-4 grid-rows-1 pb-20">
      {panes.map( ( pane ) => (
        <SelectionPane key={pane.title} title={pane.title} value={pane.value} onChange={() => { }} />
      ) )}
    </div>
  );
}