/**
 * Convert slider/column position into values depending on how high the number is (curved calculation)
 * Curve is heavily weighted at the beginning - 16% of slider should give ~40 characters
 */
export function pixelConversion(n: number): number {
  if (n < 1) return 1;

  // slow growth at the beginning (1-50: returns n * 0.4, so 50 → 20)
  if (n >= 1 && n <= 50) {
    return Math.round(n * 0.4);
  }
  // slow growth (50-160: returns 20 + (n - 50) * 0.18, so 160 → ~40)
  else if (n > 50 && n <= 160) {
    return Math.round(20 + (n - 50) * 0.18);
  }
  // gradual acceleration (160-300: returns 40 + (n - 160) * 0.35, so 300 → ~89)
  else if (n > 160 && n <= 300) {
    return Math.round(40 + (n - 160) * 0.35);
  }
  // moderate growth (300-500: returns 89 + (n - 300) * 1.5, so 500 → ~389)
  else if (n > 300 && n <= 500) {
    return Math.round(89 + (n - 300) * 1.5);
  }
  // faster growth (500-1000: returns 389 + (n - 500) * 3, so 1000 → ~1889)
  else if (n > 500 && n <= 1000) {
    return Math.round(389 + (n - 500) * 3);
  }
  // even faster growth (1000-2000: returns 1889 + (n - 1000) * 5, so 2000 → ~6889)
  else if (n > 1000 && n <= 2000) {
    return Math.round(1889 + (n - 1000) * 5);
  }
  // very fast growth (2000+: returns 6889 + (n - 2000) * 6)
  else if (n > 2000) {
    return Math.round(6889 + (n - 2000) * 6);
  }

  return n;
}

/**
 * Calculate the maximum position value needed to reach a target max value after pixelConversion.
 * Uses binary search to find the inverse of pixelConversion.
 */
export function calculateMaxPosition(targetMax: number, maxSearchRange: number = 10000): number {
  let low = 1;
  let high = maxSearchRange;
  let result = 1;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const converted = pixelConversion(mid);

    if (converted >= targetMax) {
      result = mid;
      high = mid - 1;
    } else {
      low = mid + 1;
    }
  }

  return result;
}

/**
 * Convert a target value back to a position using binary search.
 */
export function valueToPosition(targetValue: number, minValue: number, maxPosition: number): number {
  if (targetValue <= minValue) return 0;

  let low = 1;
  let high = maxPosition;
  let result = 1;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const converted = pixelConversion(mid);

    if (converted >= targetValue) {
      result = mid;
      high = mid - 1;
    } else {
      low = mid + 1;
    }
  }

  return result;
}

/**
 * Clamp a value based on the type ID and maximum value.
 */
export function clampValueByType(
  value: number,
  typeId: string,
  max: number
): number {
  let finalValue = value;

  // Clamp to max based on type
  if (typeId === "characters" && finalValue > 5000) {
    finalValue = 5000;
  } else if (typeId === "words" && finalValue > 1500) {
    finalValue = 1500;
  } else if (typeId === "sentences" && finalValue > 500) {
    finalValue = 500;
  } else if (typeId === "paragraphs" && finalValue > 200) {
    finalValue = 200;
  }

  // Also clamp to the prop max
  if (finalValue > max) {
    finalValue = max;
  }

  return finalValue;
}

/**
 * Convert a position to a clamped value based on type and max.
 */
export function positionToClampedValue(
  position: number,
  typeId: string,
  max: number,
  min: number = 0
): number {
  if (position < 1) return min;

  const converted = pixelConversion(position);
  return clampValueByType(converted, typeId, max);
}

