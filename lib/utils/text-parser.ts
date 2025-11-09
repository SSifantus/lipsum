import { SourceType } from "@/types";

interface SourceData {
  id: string;
  title: string;
  text: string;
}

type TextType = "characters" | "words" | "sentences" | "paragraphs";

/**
 * Loads the source data based on the source type
 */
async function loadSourceData( sourceType: SourceType ): Promise<SourceData> {
  switch ( sourceType ) {
    case SourceType.LOREM_IPSUM:
      return ( await import( "@/data/lorem-ipsum.json" ) ).default;
    case SourceType.CORPORATE:
      return ( await import( "@/data/corporate.json" ) ).default;
    default:
      throw new Error( `Unknown source type: ${sourceType}` );
  }
}

/**
 * Splits text into words
 */
function splitWords( text: string ): string[] {
  return text.trim().split( /\s+/ ).filter( word => word.length > 0 );
}

/**
 * Splits text into sentences
 */
function splitSentences( text: string ): string[] {
  // Split by sentence-ending punctuation followed by whitespace or end of string
  return text
    .split( /([.!?]+[\s\n]+|[.!?]+$)/ )
    .filter( s => s.trim().length > 0 )
    .reduce<string[]>( ( acc, curr, idx ) => {
      // Reattach punctuation to sentences
      if ( idx % 2 === 0 ) {
        acc.push( curr.trim() );
      } else if ( acc.length > 0 ) {
        acc[ acc.length - 1 ] += curr;
      }
      return acc;
    }, [] )
    .filter( s => s.trim().length > 0 );
}

/**
 * Splits text into paragraphs
 */
function splitParagraphs( text: string ): string[] {
  return text
    .split( /\n\s*\n/ )
    .map( p => p.trim() )
    .filter( p => p.length > 0 );
}

/**
 * Gets a random starting position within the available text
 */
function getRandomStartPosition( availableLength: number, neededLength: number ): number {
  if ( availableLength <= neededLength ) {
    return 0;
  }
  return Math.floor( Math.random() * ( availableLength - neededLength ) );
}

/**
 * Extracts text based on type and amount
 */
export async function extractText(
  sourceType: SourceType,
  type: TextType,
  amount: number
): Promise<string> {
  if ( amount <= 0 ) {
    return "";
  }

  const sourceData = await loadSourceData( sourceType );
  const text = sourceData.text;

  switch ( type ) {
    case "characters": {
      if ( amount >= text.length ) {
        return text;
      }
      const start = getRandomStartPosition( text.length, amount );
      return text.slice( start, start + amount );
    }

    case "words": {
      const words = splitWords( text );
      if ( amount >= words.length ) {
        return words.join( " " );
      }
      const start = getRandomStartPosition( words.length, amount );
      return words.slice( start, start + amount ).join( " " );
    }

    case "sentences": {
      const sentences = splitSentences( text );
      if ( amount >= sentences.length ) {
        return sentences.join( " " );
      }
      const start = getRandomStartPosition( sentences.length, amount );
      return sentences.slice( start, start + amount ).join( " " );
    }

    case "paragraphs": {
      const paragraphs = splitParagraphs( text );
      if ( amount >= paragraphs.length ) {
        return paragraphs.join( "\n\n" );
      }
      const start = getRandomStartPosition( paragraphs.length, amount );
      return paragraphs.slice( start, start + amount ).join( "\n\n" );
    }

    default:
      throw new Error( `Unknown text type: ${type}` );
  }
}

/**
 * Extracts text and copies it to clipboard
 */
export async function extractAndCopyText(
  sourceType: SourceType,
  type: TextType,
  amount: number
): Promise<string> {
  const extractedText = await extractText( sourceType, type, amount );

  if ( extractedText && typeof navigator !== "undefined" && navigator.clipboard ) {
    try {
      await navigator.clipboard.writeText( extractedText );
    } catch ( error ) {
      console.error( "Failed to copy to clipboard:", error );
    }
  }

  return extractedText;
}

