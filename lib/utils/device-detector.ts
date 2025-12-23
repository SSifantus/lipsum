/**
 * Detects if a device is a desktop based on user agent string.
 * This utility can be used both server-side (with userAgent from next/server)
 * and client-side (with navigator.userAgent).
 *
 * @param userAgentString - The user agent string to analyze
 * @returns true if the device is a desktop, false otherwise
 */
export function isDesktopDevice( userAgentString: string ): boolean {
  if ( !userAgentString ) {
    // Default to desktop if user agent not available
    return true;
  }

  const ua = userAgentString.toLowerCase();

  // Check for mobile devices
  const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;
  if ( mobileRegex.test( ua ) ) {
    return false;
  }

  // Check for tablets (some tablets might not be caught by mobile regex)
  const tabletRegex = /tablet|ipad|playbook|silk/i;
  if ( tabletRegex.test( ua ) ) {
    return false;
  }

  // Check for touch devices that aren't mobile/tablet
  const touchDeviceRegex = /touch/i;
  if ( touchDeviceRegex.test( ua ) && !/windows/i.test( ua ) ) {
    return false;
  }

  // Default to desktop for other devices
  return true;
}

