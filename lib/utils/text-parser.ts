import {getSourceById, type SourceData} from "@/lib/utils/sources";

type TextType = "characters" | "words" | "sentences" | "paragraphs";

/**
 * Loads the source data based on the source ID
 */
async function loadSourceData(sourceId: string): Promise<SourceData> {
  const source = getSourceById(sourceId);
  if (!source) {
    throw new Error(`Unknown source ID: ${sourceId}`);
  }
  return source;
}

/**
 * Splits text into words
 */
function splitWords(text: string): string[] {
  return text.trim().split(/\s+/).filter(word => word.length > 0);
}

/**
 * Splits text into sentences
 */
function splitSentences(text: string): string[] {
  // Split by sentence-ending punctuation followed by whitespace or end of string
  return text
    .split(/([.!?]+[\s\n]+|[.!?]+$)/)
    .filter(s => s.trim().length > 0)
    .reduce<string[]>((acc, curr, idx) => {
      // Reattach punctuation to sentences
      if (idx % 2 === 0) {
        acc.push(curr.trim());
      } else if (acc.length > 0) {
        acc[ acc.length - 1 ] += curr;
      }
      return acc;
    }, [])
    .filter(s => s.trim().length > 0);
}

/**
 * Splits text into paragraphs
 */
function splitParagraphs(text: string): string[] {
  return text
    .split(/\n\s*\n/)
    .map(p => p.trim())
    .filter(p => p.length > 0);
}

/**
 * Gets a random starting position within the available text
 */
function getRandomStartPosition(availableLength: number, neededLength: number): number {
  if (availableLength <= neededLength) {
    return 0;
  }
  return Math.floor(Math.random() * (availableLength - neededLength));
}

/**
 * Cleans extracted text based on type:
 * - Characters and words: strip all punctuation marks (periods, dashes, etc.)
 * - All except paragraphs: strip line breaks
 * - Characters: strip all spaces
 * - Words: strip double spaces (normalize to single spaces)
 */
function cleanExtractedText(text: string, type: TextType): string {
  let cleaned = text;

  // Strip all punctuation from character and word results
  if (type === "characters" || type === "words") {
    // Remove all punctuation marks (everything that's not alphanumeric or whitespace)
    cleaned = cleaned.replace(/[^\w\s]/g, "").toLowerCase();
  }

  // Strip line breaks from all except paragraphs
  if (type !== "paragraphs") {
    cleaned = cleaned.replace(/\n/g, " ").replace(/\r/g, "");
  }

  // Strip all spaces from character results
  if (type === "characters") {
    cleaned = cleaned.replace(/\s+/g, "");
  }

  // Normalize multiple spaces to single spaces in word results
  if (type === "words" || type === "sentences") {
    cleaned = cleaned.replace(/\s+/g, " ").trim();
  }

  return cleaned;
}

/**
 * Extracts text based on type and amount
 */
export async function extractText(
  sourceId: string,
  type: TextType,
  amount: number
): Promise<string> {
  if (amount <= 0) {
    return "";
  }

  const sourceData = await loadSourceData(sourceId);
  const text = sourceData.text;

  let extracted: string;

  switch (type) {
    case "characters": {
      if (amount >= text.length) {
        extracted = text;
      } else {
        const start = getRandomStartPosition(text.length, amount);
        extracted = text.slice(start, start + amount);
      }
      break;
    }

    case "words": {
      const words = splitWords(text);
      if (amount >= words.length) {
        extracted = words.join(" ");
      } else {
        const start = getRandomStartPosition(words.length, amount);
        extracted = words.slice(start, start + amount).join(" ");
      }
      break;
    }

    case "sentences": {
      const sentences = splitSentences(text);
      if (amount >= sentences.length) {
        extracted = sentences.join(" ");
      } else {
        const start = getRandomStartPosition(sentences.length, amount);
        extracted = sentences.slice(start, start + amount).join(" ");
      }
      break;
    }

    case "paragraphs": {
      const paragraphs = splitParagraphs(text);
      if (amount >= paragraphs.length) {
        extracted = paragraphs.join("\n\n");
      } else {
        const start = getRandomStartPosition(paragraphs.length, amount);
        extracted = paragraphs.slice(start, start + amount).join("\n\n");
      }
      break;
    }

    default:
      throw new Error(`Unknown text type: ${type}`);
  }

  return cleanExtractedText(extracted, type);
}

/**
 * Extracts text and copies it to clipboard
 */
export async function extractAndCopyText(
  sourceId: string,
  type: TextType,
  amount: number
): Promise<string> {
  const extractedText = await extractText(sourceId, type, amount);

  if (extractedText && typeof navigator !== "undefined" && navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(extractedText);

      // Track Google Analytics event
      if (typeof window !== "undefined" && "gtag" in window) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).gtag("event", "text_extracted", {
          event_category: "text_generation",
          event_label: type,
          value: amount,
          text_type: type,
          text_amount: amount,
          source_id: sourceId,
        });
      }
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
    }
  }

  return extractedText;
}

