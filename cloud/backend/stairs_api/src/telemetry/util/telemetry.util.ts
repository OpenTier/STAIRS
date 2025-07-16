// Function to parse the timespan into seconds
export function parseTimespanToSeconds(timespan) {
  const match = timespan.match(/^-(\d+)([smhdw])$/); // Regex to match format like '-1d', '-30m'
  if (!match) {
    throw new Error('Invalid timespan format');
  }

  const value = parseInt(match[1], 10); // Extract the numeric part
  const unit = match[2]; // Extract the time unit

  // Convert to seconds based on the unit
  const unitToSeconds = {
    s: 1, // seconds
    m: 60, // minutes
    h: 3600, // hours
    d: 86400, // days
    w: 604800, // weeks
  };

  return value * unitToSeconds[unit];
}
