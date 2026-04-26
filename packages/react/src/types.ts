/**
 * React component prop types
 */

export interface TimestampConverterProps {
  /** Initial timestamp value */
  initialValue?: string;
  /** Callback when timestamp changes */
  onChange?: (timestamp: number | null) => void;
  /** Custom CSS class */
  className?: string;
}

export interface WorldClockProps {
  /** User's timezone (defaults to browser timezone) */
  userTimezone?: string;
  /** Custom list of cities to display */
  cities?: Array<{
    name: string;
    timezone: string;
    flag?: string;
    country?: string;
  }>;
  /** Custom CSS class */
  className?: string;
}

export interface TimeCalculatorProps {
  /** Initial timestamp value */
  initialValue?: string;
  /** Callback when result changes */
  onChange?: (result: number | null) => void;
  /** Custom CSS class */
  className?: string;
}

export interface CopyButtonProps {
  /** Text to copy */
  text: string;
  /** Custom CSS class */
  className?: string;
  /** Success message duration (ms) */
  successDuration?: number;
}
