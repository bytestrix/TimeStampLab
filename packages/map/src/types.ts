/**
 * Map component prop types
 */

export interface TimezoneMapProps {
  /** Callback when a location is selected */
  onSelect?: (timezone: string, coords: { lat: number; lng: number }) => void;
  /** Timezone to highlight on the map */
  highlightTimezone?: string;
  /** Base map color */
  mapColor?: string;
  /** Hover color */
  hoverColor?: string;
  /** Selected area color */
  selectedColor?: string;
  /** Show coordinate grid */
  showGrid?: boolean;
  /** Custom CSS class */
  className?: string;
}

export interface TimezoneInfoProps {
  /** Timezone identifier (e.g., 'America/New_York') */
  timezone: string;
  /** Geographic coordinates */
  coords: { lat: number; lng: number };
  /** Timestamp to display (defaults to current time) */
  timestamp?: number;
  /** Custom CSS class */
  className?: string;
}
