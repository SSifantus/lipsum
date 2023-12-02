
export const ColumnTypes = {
  characters: "characters",
  words: "words",
  sentences: "sentences",
  paragraphs: "paragraphs",
} as const;

export type ColumnType = (typeof ColumnTypes)[keyof typeof ColumnTypes];

export type ColumnProps = {
  type: ColumnType;
}

export default function Column({ type }: ColumnProps) {
  return (
    <div className={`column type-${type}`}>

      Column {type}
    </div>
  );
}
