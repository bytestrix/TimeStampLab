import React, { useState, useEffect } from 'react';
import { fmtAll } from '@timestamplab/core';
import type { TimezoneInfoProps } from './types';

/**
 * Display timezone information for selected location
 */
export const TimezoneInfo: React.FC<TimezoneInfoProps> = ({
  timezone,
  coords,
  timestamp,
  className = '',
}) => {
  const [currentTime, setCurrentTime] = useState(timestamp || Date.now());

  useEffect(() => {
    if (!timestamp) {
      const interval = setInterval(() => {
        setCurrentTime(Date.now());
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timestamp]);

  const formatted = fmtAll(currentTime);

  if (!formatted) {
    return null;
  }

  return (
    <div className={`timezone-info ${className}`}>
      <h3>{timezone}</h3>
      <p>
        Coordinates: {coords.lat.toFixed(2)}°, {coords.lng.toFixed(2)}°
      </p>
      <div>
        <strong>Local Time:</strong> {formatted.local}
      </div>
      <div>
        <strong>UTC:</strong> {formatted.utc}
      </div>
      <div>
        <strong>ISO 8601:</strong> {formatted.iso}
      </div>
    </div>
  );
};
