/**
 * Countries with GENUINELY different timezones per city
 * Only include countries where cities have different UTC offsets
 */

export interface CityOption {
  name: string;
  tz: string;
  lat: number;
  lng: number;
  flag?: string;
  country?: string;
}

// Only countries where cities actually have DIFFERENT UTC offsets
export const MULTI_TZ_COUNTRIES: Record<string, CityOption[]> = {
  'United States of America': [
    { name: 'New York',      tz: 'America/New_York',    lat: 40.71,  lng: -74.00 },
    { name: 'Chicago',       tz: 'America/Chicago',     lat: 41.85,  lng: -87.65 },
    { name: 'Denver',        tz: 'America/Denver',      lat: 39.74,  lng: -104.98 },
    { name: 'Los Angeles',   tz: 'America/Los_Angeles', lat: 34.05,  lng: -118.24 },
    { name: 'Anchorage',     tz: 'America/Anchorage',   lat: 61.22,  lng: -149.90 },
    { name: 'Honolulu',      tz: 'Pacific/Honolulu',    lat: 21.31,  lng: -157.86 },
  ],
  'USA': [
    { name: 'New York',      tz: 'America/New_York',    lat: 40.71,  lng: -74.00 },
    { name: 'Chicago',       tz: 'America/Chicago',     lat: 41.85,  lng: -87.65 },
    { name: 'Denver',        tz: 'America/Denver',      lat: 39.74,  lng: -104.98 },
    { name: 'Los Angeles',   tz: 'America/Los_Angeles', lat: 34.05,  lng: -118.24 },
    { name: 'Anchorage',     tz: 'America/Anchorage',   lat: 61.22,  lng: -149.90 },
    { name: 'Honolulu',      tz: 'Pacific/Honolulu',    lat: 21.31,  lng: -157.86 },
  ],
  'Canada': [
    { name: 'Toronto',       tz: 'America/Toronto',     lat: 43.65,  lng: -79.38 },
    { name: 'Winnipeg',      tz: 'America/Winnipeg',    lat: 49.90,  lng: -97.14 },
    { name: 'Edmonton',      tz: 'America/Edmonton',    lat: 51.05,  lng: -114.07 },
    { name: 'Vancouver',     tz: 'America/Vancouver',   lat: 49.25,  lng: -123.12 },
    { name: 'Halifax',       tz: 'America/Halifax',     lat: 44.65,  lng: -63.57 },
    { name: "St. John's",    tz: 'America/St_Johns',    lat: 47.56,  lng: -52.71 },
  ],
  'Russia': [
    { name: 'Moscow',        tz: 'Europe/Moscow',       lat: 55.75,  lng: 37.62 },
    { name: 'Yekaterinburg', tz: 'Asia/Yekaterinburg',  lat: 56.83,  lng: 60.60 },
    { name: 'Novosibirsk',   tz: 'Asia/Novosibirsk',    lat: 54.99,  lng: 82.90 },
    { name: 'Krasnoyarsk',   tz: 'Asia/Krasnoyarsk',    lat: 56.01,  lng: 92.79 },
    { name: 'Irkutsk',       tz: 'Asia/Irkutsk',        lat: 52.29,  lng: 104.30 },
    { name: 'Vladivostok',   tz: 'Asia/Vladivostok',    lat: 43.12,  lng: 131.90 },
  ],
  'Australia': [
    { name: 'Sydney',        tz: 'Australia/Sydney',    lat: -33.87, lng: 151.21 },
    { name: 'Brisbane',      tz: 'Australia/Brisbane',  lat: -27.47, lng: 153.02 },
    { name: 'Adelaide',      tz: 'Australia/Adelaide',  lat: -34.93, lng: 138.60 },
    { name: 'Darwin',        tz: 'Australia/Darwin',    lat: -12.46, lng: 130.84 },
    { name: 'Perth',         tz: 'Australia/Perth',     lat: -31.95, lng: 115.86 },
  ],
  'Brazil': [
    { name: 'São Paulo',     tz: 'America/Sao_Paulo',   lat: -23.55, lng: -46.63 },
    { name: 'Manaus',        tz: 'America/Manaus',      lat: -3.10,  lng: -60.02 },
    { name: 'Fortaleza',     tz: 'America/Fortaleza',   lat: -3.72,  lng: -38.54 },
    { name: 'Belém',         tz: 'America/Belem',       lat: -1.46,  lng: -48.50 },
    { name: 'Porto Velho',   tz: 'America/Porto_Velho', lat: -8.76,  lng: -63.90 },
  ],
  'Indonesia': [
    { name: 'Jakarta',       tz: 'Asia/Jakarta',        lat: -6.21,  lng: 106.85 },
    { name: 'Makassar',      tz: 'Asia/Makassar',       lat: -5.13,  lng: 119.42 },
    { name: 'Jayapura',      tz: 'Asia/Jayapura',       lat: -2.53,  lng: 140.72 },
  ],
  'Mexico': [
    { name: 'Mexico City',   tz: 'America/Mexico_City', lat: 19.43,  lng: -99.13 },
    { name: 'Monterrey',     tz: 'America/Monterrey',   lat: 25.67,  lng: -100.31 },
    { name: 'Tijuana',       tz: 'America/Tijuana',     lat: 32.53,  lng: -117.04 },
    { name: 'Cancún',        tz: 'America/Cancun',      lat: 21.16,  lng: -86.85 },
  ],
  'Kazakhstan': [
    { name: 'Almaty',        tz: 'Asia/Almaty',         lat: 43.25,  lng: 76.95 },
    { name: 'Aktau',         tz: 'Asia/Aqtau',          lat: 43.65,  lng: 51.17 },
  ],
  'Mongolia': [
    { name: 'Ulaanbaatar',   tz: 'Asia/Ulaanbaatar',    lat: 47.91,  lng: 106.88 },
    { name: 'Hovd',          tz: 'Asia/Hovd',           lat: 48.01,  lng: 91.64 },
  ],
  'China': [
    { name: 'Shanghai',      tz: 'Asia/Shanghai',       lat: 31.23,  lng: 121.47 },
    { name: 'Urumqi',        tz: 'Asia/Urumqi',         lat: 43.80,  lng: 87.60 },
  ],
};

// One dot per unique timezone per country
// Rule: if a country has one timezone, show one dot (capital/main city)
export const MAP_CITIES: CityOption[] = [
  // North America
  { name: 'New York',      tz: 'America/New_York',                   lat: 40.71,  lng: -74.00,   flag: '🇺🇸', country: 'USA' },
  { name: 'Chicago',       tz: 'America/Chicago',                    lat: 41.85,  lng: -87.65,   flag: '🇺🇸', country: 'USA' },
  { name: 'Denver',        tz: 'America/Denver',                     lat: 39.74,  lng: -104.98,  flag: '🇺🇸', country: 'USA' },
  { name: 'Los Angeles',   tz: 'America/Los_Angeles',                lat: 34.05,  lng: -118.24,  flag: '🇺🇸', country: 'USA' },
  { name: 'Anchorage',     tz: 'America/Anchorage',                  lat: 61.22,  lng: -149.90,  flag: '🇺🇸', country: 'USA' },
  { name: 'Honolulu',      tz: 'Pacific/Honolulu',                   lat: 21.31,  lng: -157.86,  flag: '🇺🇸', country: 'USA' },
  { name: 'Toronto',       tz: 'America/Toronto',                    lat: 43.65,  lng: -79.38,   flag: '🇨🇦', country: 'Canada' },
  { name: 'Winnipeg',      tz: 'America/Winnipeg',                   lat: 49.90,  lng: -97.14,   flag: '🇨🇦', country: 'Canada' },
  { name: 'Vancouver',     tz: 'America/Vancouver',                  lat: 49.25,  lng: -123.12,  flag: '🇨🇦', country: 'Canada' },
  { name: 'Halifax',       tz: 'America/Halifax',                    lat: 44.65,  lng: -63.57,   flag: '🇨🇦', country: 'Canada' },
  { name: "St. John's",    tz: 'America/St_Johns',                   lat: 47.56,  lng: -52.71,   flag: '🇨🇦', country: 'Canada' },
  { name: 'Nuuk',          tz: 'America/Godthab',                    lat: 64.18,  lng: -51.74,   flag: '🇬🇱', country: 'Greenland' },
  { name: 'Mexico City',   tz: 'America/Mexico_City',                lat: 19.43,  lng: -99.13,   flag: '🇲🇽', country: 'Mexico' },
  { name: 'Tijuana',       tz: 'America/Tijuana',                    lat: 32.53,  lng: -117.04,  flag: '🇲🇽', country: 'Mexico' },
  { name: 'Cancún',        tz: 'America/Cancun',                     lat: 21.16,  lng: -86.85,   flag: '🇲🇽', country: 'Mexico' },
  // South America
  { name: 'São Paulo',     tz: 'America/Sao_Paulo',                  lat: -23.55, lng: -46.63,   flag: '🇧🇷', country: 'Brazil' },
  { name: 'Manaus',        tz: 'America/Manaus',                     lat: -3.10,  lng: -60.02,   flag: '🇧🇷', country: 'Brazil' },
  { name: 'Fortaleza',     tz: 'America/Fortaleza',                  lat: -3.72,  lng: -38.54,   flag: '🇧🇷', country: 'Brazil' },
  { name: 'Buenos Aires',  tz: 'America/Argentina/Buenos_Aires',     lat: -34.60, lng: -58.38,   flag: '🇦🇷', country: 'Argentina' },
  { name: 'Santiago',      tz: 'America/Santiago',                   lat: -33.46, lng: -70.65,   flag: '🇨🇱', country: 'Chile' },
  { name: 'Lima',          tz: 'America/Lima',                       lat: -12.05, lng: -77.04,   flag: '🇵🇪', country: 'Peru' },
  { name: 'Bogotá',        tz: 'America/Bogota',                     lat: 4.71,   lng: -74.07,   flag: '🇨🇴', country: 'Colombia' },
  { name: 'Caracas',       tz: 'America/Caracas',                    lat: 10.48,  lng: -66.88,   flag: '🇻🇪', country: 'Venezuela' },
  // Europe
  { name: 'London',        tz: 'Europe/London',                      lat: 51.51,  lng: -0.13,    flag: '🇬🇧', country: 'UK' },
  { name: 'Paris',         tz: 'Europe/Paris',                       lat: 48.85,  lng: 2.35,     flag: '🇫🇷', country: 'France' },
  { name: 'Berlin',        tz: 'Europe/Berlin',                      lat: 52.52,  lng: 13.40,    flag: '🇩🇪', country: 'Germany' },
  { name: 'Rome',          tz: 'Europe/Rome',                        lat: 41.90,  lng: 12.50,    flag: '🇮🇹', country: 'Italy' },
  { name: 'Madrid',        tz: 'Europe/Madrid',                      lat: 40.42,  lng: -3.70,    flag: '🇪🇸', country: 'Spain' },
  { name: 'Lisbon',        tz: 'Europe/Lisbon',                      lat: 38.72,  lng: -9.14,    flag: '🇵🇹', country: 'Portugal' },
  { name: 'Amsterdam',     tz: 'Europe/Amsterdam',                   lat: 52.37,  lng: 4.90,     flag: '🇳🇱', country: 'Netherlands' },
  { name: 'Stockholm',     tz: 'Europe/Stockholm',                   lat: 59.33,  lng: 18.07,    flag: '🇸🇪', country: 'Sweden' },
  { name: 'Warsaw',        tz: 'Europe/Warsaw',                      lat: 52.23,  lng: 21.01,    flag: '🇵🇱', country: 'Poland' },
  { name: 'Kyiv',          tz: 'Europe/Kiev',                        lat: 50.45,  lng: 30.52,    flag: '🇺🇦', country: 'Ukraine' },
  { name: 'Athens',        tz: 'Europe/Athens',                      lat: 37.98,  lng: 23.73,    flag: '🇬🇷', country: 'Greece' },
  { name: 'Istanbul',      tz: 'Europe/Istanbul',                    lat: 41.01,  lng: 28.95,    flag: '🇹🇷', country: 'Turkey' },
  // Russia (one per timezone)
  { name: 'Moscow',        tz: 'Europe/Moscow',                      lat: 55.75,  lng: 37.62,    flag: '🇷🇺', country: 'Russia' },
  { name: 'Yekaterinburg', tz: 'Asia/Yekaterinburg',                 lat: 56.83,  lng: 60.60,    flag: '🇷🇺', country: 'Russia' },
  { name: 'Novosibirsk',   tz: 'Asia/Novosibirsk',                   lat: 54.99,  lng: 82.90,    flag: '🇷🇺', country: 'Russia' },
  { name: 'Krasnoyarsk',   tz: 'Asia/Krasnoyarsk',                   lat: 56.01,  lng: 92.79,    flag: '🇷🇺', country: 'Russia' },
  { name: 'Irkutsk',       tz: 'Asia/Irkutsk',                       lat: 52.29,  lng: 104.30,   flag: '🇷🇺', country: 'Russia' },
  { name: 'Vladivostok',   tz: 'Asia/Vladivostok',                   lat: 43.12,  lng: 131.90,   flag: '🇷🇺', country: 'Russia' },
  // Middle East
  { name: 'Dubai',         tz: 'Asia/Dubai',                         lat: 25.20,  lng: 55.27,    flag: '🇦🇪', country: 'UAE' },
  { name: 'Riyadh',        tz: 'Asia/Riyadh',                        lat: 24.69,  lng: 46.72,    flag: '🇸🇦', country: 'Saudi Arabia' },
  { name: 'Tehran',        tz: 'Asia/Tehran',                        lat: 35.69,  lng: 51.42,    flag: '🇮🇷', country: 'Iran' },
  { name: 'Baghdad',       tz: 'Asia/Baghdad',                       lat: 33.34,  lng: 44.40,    flag: '🇮🇶', country: 'Iraq' },
  // Africa
  { name: 'Cairo',         tz: 'Africa/Cairo',                       lat: 30.04,  lng: 31.24,    flag: '🇪🇬', country: 'Egypt' },
  { name: 'Lagos',         tz: 'Africa/Lagos',                       lat: 6.45,   lng: 3.40,     flag: '🇳🇬', country: 'Nigeria' },
  { name: 'Nairobi',       tz: 'Africa/Nairobi',                     lat: -1.29,  lng: 36.82,    flag: '🇰🇪', country: 'Kenya' },
  { name: 'Johannesburg',  tz: 'Africa/Johannesburg',                lat: -26.20, lng: 28.04,    flag: '🇿🇦', country: 'South Africa' },
  { name: 'Casablanca',    tz: 'Africa/Casablanca',                  lat: 33.59,  lng: -7.62,    flag: '🇲🇦', country: 'Morocco' },
  // Asia
  { name: 'Kolkata',       tz: 'Asia/Kolkata',                       lat: 22.57,  lng: 88.36,    flag: '🇮🇳', country: 'India' },
  { name: 'Karachi',       tz: 'Asia/Karachi',                       lat: 24.86,  lng: 67.01,    flag: '🇵🇰', country: 'Pakistan' },
  { name: 'Dhaka',         tz: 'Asia/Dhaka',                         lat: 23.72,  lng: 90.41,    flag: '🇧🇩', country: 'Bangladesh' },
  { name: 'Sri Lanka',     tz: 'Asia/Colombo',                       lat: 7.87,   lng: 80.77,    flag: '🇱🇰', country: 'Sri Lanka' },
  { name: 'Kathmandu',     tz: 'Asia/Kathmandu',                     lat: 27.71,  lng: 85.32,    flag: '🇳🇵', country: 'Nepal' },
  { name: 'Kabul',         tz: 'Asia/Kabul',                         lat: 34.53,  lng: 69.17,    flag: '🇦🇫', country: 'Afghanistan' },
  { name: 'Tashkent',      tz: 'Asia/Tashkent',                      lat: 41.30,  lng: 69.24,    flag: '🇺🇿', country: 'Uzbekistan' },
  { name: 'Almaty',        tz: 'Asia/Almaty',                        lat: 43.25,  lng: 76.95,    flag: '🇰🇿', country: 'Kazakhstan' },
  { name: 'Ulaanbaatar',   tz: 'Asia/Ulaanbaatar',                   lat: 47.91,  lng: 106.88,   flag: '🇲🇳', country: 'Mongolia' },
  { name: 'Bangkok',       tz: 'Asia/Bangkok',                       lat: 13.75,  lng: 100.52,   flag: '🇹🇭', country: 'Thailand' },
  { name: 'Singapore',     tz: 'Asia/Singapore',                     lat: 1.35,   lng: 103.82,   flag: '🇸🇬', country: 'Singapore' },
  { name: 'Jakarta',       tz: 'Asia/Jakarta',                       lat: -6.21,  lng: 106.85,   flag: '🇮🇩', country: 'Indonesia' },
  { name: 'Makassar',      tz: 'Asia/Makassar',                      lat: -5.13,  lng: 119.42,   flag: '🇮🇩', country: 'Indonesia' },
  { name: 'Jayapura',      tz: 'Asia/Jayapura',                      lat: -2.53,  lng: 140.72,   flag: '🇮🇩', country: 'Indonesia' },
  { name: 'Shanghai',      tz: 'Asia/Shanghai',                      lat: 31.23,  lng: 121.47,   flag: '🇨🇳', country: 'China' },
  { name: 'Urumqi',        tz: 'Asia/Urumqi',                        lat: 43.80,  lng: 87.60,    flag: '🇨🇳', country: 'China' },
  { name: 'Tokyo',         tz: 'Asia/Tokyo',                         lat: 35.69,  lng: 139.69,   flag: '🇯🇵', country: 'Japan' },
  { name: 'Seoul',         tz: 'Asia/Seoul',                         lat: 37.57,  lng: 126.98,   flag: '🇰🇷', country: 'South Korea' },
  { name: 'Taipei',        tz: 'Asia/Taipei',                        lat: 25.05,  lng: 121.53,   flag: '🇹🇼', country: 'Taiwan' },
  { name: 'Hong Kong',     tz: 'Asia/Hong_Kong',                     lat: 22.32,  lng: 114.17,   flag: '🇭🇰', country: 'Hong Kong' },
  { name: 'Kuala Lumpur',  tz: 'Asia/Kuala_Lumpur',                  lat: 3.14,   lng: 101.69,   flag: '🇲🇾', country: 'Malaysia' },
  { name: 'Manila',        tz: 'Asia/Manila',                        lat: 14.60,  lng: 120.98,   flag: '🇵🇭', country: 'Philippines' },
  { name: 'Ho Chi Minh',   tz: 'Asia/Ho_Chi_Minh',                   lat: 10.82,  lng: 106.63,   flag: '🇻🇳', country: 'Vietnam' },
  // Oceania
  { name: 'Sydney',        tz: 'Australia/Sydney',                   lat: -33.87, lng: 151.21,   flag: '🇦🇺', country: 'Australia' },
  { name: 'Adelaide',      tz: 'Australia/Adelaide',                 lat: -34.93, lng: 138.60,   flag: '🇦🇺', country: 'Australia' },
  { name: 'Darwin',        tz: 'Australia/Darwin',                   lat: -12.46, lng: 130.84,   flag: '🇦🇺', country: 'Australia' },
  { name: 'Perth',         tz: 'Australia/Perth',                    lat: -31.95, lng: 115.86,   flag: '🇦🇺', country: 'Australia' },
  { name: 'Auckland',      tz: 'Pacific/Auckland',                   lat: -36.86, lng: 174.77,   flag: '🇳🇿', country: 'New Zealand' },
  { name: 'Fiji',          tz: 'Pacific/Fiji',                       lat: -18.14, lng: 178.44,   flag: '🇫🇯', country: 'Fiji' },
];
