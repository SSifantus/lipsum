import Column from "components/Column";


export default function Home() {
  return (
    <div className="selector">
      <Column type={"characters"}/>
      <Column type={"words"}/>
      <Column type={"sentences"}/>
      <Column type={"paragraphs"}/>
    </div>
  );
}
