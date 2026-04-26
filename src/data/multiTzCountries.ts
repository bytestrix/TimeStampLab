/**
 * Countries with GENUINELY different timezones per city
 * Only include countries where cities have different UTC offsets
 */

export interface CityOption {
  name: string;
  tz: string;
  lat: number;
  lng: number;
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
    { name: 'Calgary',       tz: 'America/Edmonton',    lat: 51.05,  lng: -114.07 },
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
    { name: 'Bali',          tz: 'Asia/Makassar',       lat: -8.34,  lng: 115.09 },
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
    { name: 'Beijing',       tz: 'Asia/Shanghai',       lat: 39.91,  lng: 116.39 },
    { name: 'Urumqi',        tz: 'Asia/Urumqi',         lat: 43.80,  lng: 87.60 },
  ],
};

// One dot per unique timezone per country
// Rule: if a country has one timezone, show one dot (capital/main city)
export const MAP_CITIES: CityOption[] = [
  // North America
  { name: 'New York',      tz: 'America/New_York',                   lat: 40.71,  lng: -74.00 },
  { name: 'Chicago',       tz: 'America/Chicago',                    lat: 41.85,  lng: -87.65 },
  { name: 'Denver',        tz: 'America/Denver',                     lat: 39.74,  lng: -104.98 },
  { name: 'Los Angeles',   tz: 'America/Los_Angeles',                lat: 34.05,  lng: -118.24 },
  { name: 'Anchorage',     tz: 'America/Anchorage',                  lat: 61.22,  lng: -149.90 },
  { name: 'Honolulu',      tz: 'Pacific/Honolulu',                   lat: 21.31,  lng: -157.86 },
  { name: 'Toronto',       tz: 'America/Toronto',                    lat: 43.65,  lng: -79.38 },
  { name: 'Winnipeg',      tz: 'America/Winnipeg',                   lat: 49.90,  lng: -97.14 },
  { name: 'Vancouver',     tz: 'America/Vancouver',                  lat: 49.25,  lng: -123.12 },
  { name: 'Halifax',       tz: 'America/Halifax',                    lat: 44.65,  lng: -63.57 },
  { name: "St. John's",    tz: 'America/St_Johns',                   lat: 47.56,  lng: -52.71 },
  { name: 'Nuuk',          tz: 'America/Godthab',                    lat: 64.18,  lng: -51.74 },
  { name: 'Mexico City',   tz: 'America/Mexico_City',                lat: 19.43,  lng: -99.13 },
  { name: 'Tijuana',       tz: 'America/Tijuana',                    lat: 32.53,  lng: -117.04 },
  { name: 'Cancún',        tz: 'America/Cancun',                     lat: 21.16,  lng: -86.85 },
  // South America
  { name: 'São Paulo',     tz: 'America/Sao_Paulo',                  lat: -23.55, lng: -46.63 },
  { name: 'Manaus',        tz: 'America/Manaus',                     lat: -3.10,  lng: -60.02 },
  { name: 'Fortaleza',     tz: 'America/Fortaleza',                  lat: -3.72,  lng: -38.54 },
  { name: 'Buenos Aires',  tz: 'America/Argentina/Buenos_Aires',     lat: -34.60, lng: -58.38 },
  { name: 'Santiago',      tz: 'America/Santiago',                   lat: -33.46, lng: -70.65 },
  { name: 'Lima',          tz: 'America/Lima',                       lat: -12.05, lng: -77.04 },
  { name: 'Bogotá',        tz: 'America/Bogota',                     lat: 4.71,   lng: -74.07 },
  { name: 'Caracas',       tz: 'America/Caracas',                    lat: 10.48,  lng: -66.88 },
  // Europe
  { name: 'London',        tz: 'Europe/London',                      lat: 51.51,  lng: -0.13 },
  { name: 'Paris',         tz: 'Europe/Paris',                       lat: 48.85,  lng: 2.35 },
  { name: 'Berlin',        tz: 'Europe/Berlin',                      lat: 52.52,  lng: 13.40 },
  { name: 'Rome',          tz: 'Europe/Rome',                        lat: 41.90,  lng: 12.50 },
  { name: 'Madrid',        tz: 'Europe/Madrid',                      lat: 40.42,  lng: -3.70 },
  { name: 'Lisbon',        tz: 'Europe/Lisbon',                      lat: 38.72,  lng: -9.14 },
  { name: 'Amsterdam',     tz: 'Europe/Amsterdam',                   lat: 52.37,  lng: 4.90 },
  { name: 'Stockholm',     tz: 'Europe/Stockholm',                   lat: 59.33,  lng: 18.07 },
  { name: 'Warsaw',        tz: 'Europe/Warsaw',                      lat: 52.23,  lng: 21.01 },
  { name: 'Kyiv',          tz: 'Europe/Kiev',                        lat: 50.45,  lng: 30.52 },
  { name: 'Athens',        tz: 'Europe/Athens',                      lat: 37.98,  lng: 23.73 },
  { name: 'Istanbul',      tz: 'Europe/Istanbul',                    lat: 41.01,  lng: 28.95 },
  // Russia (one per timezone)
  { name: 'Moscow',        tz: 'Europe/Moscow',                      lat: 55.75,  lng: 37.62 },
  { name: 'Yekaterinburg', tz: 'Asia/Yekaterinburg',                 lat: 56.83,  lng: 60.60 },
  { name: 'Novosibirsk',   tz: 'Asia/Novosibirsk',                   lat: 54.99,  lng: 82.90 },
  { name: 'Krasnoyarsk',   tz: 'Asia/Krasnoyarsk',                   lat: 56.01,  lng: 92.79 },
  { name: 'Irkutsk',       tz: 'Asia/Irkutsk',                       lat: 52.29,  lng: 104.30 },
  { name: 'Vladivostok',   tz: 'Asia/Vladivostok',                   lat: 43.12,  lng: 131.90 },
  // Middle East
  { name: 'Dubai',         tz: 'Asia/Dubai',                         lat: 25.20,  lng: 55.27 },
  { name: 'Riyadh',        tz: 'Asia/Riyadh',                        lat: 24.69,  lng: 46.72 },
  { name: 'Tehran',        tz: 'Asia/Tehran',                        lat: 35.69,  lng: 51.42 },
  { name: 'Baghdad',       tz: 'Asia/Baghdad',                       lat: 33.34,  lng: 44.40 },
  // Africa
  { name: 'Cairo',         tz: 'Africa/Cairo',                       lat: 30.04,  lng: 31.24 },
  { name: 'Lagos',         tz: 'Africa/Lagos',                       lat: 6.45,   lng: 3.40 },
  { name: 'Nairobi',       tz: 'Africa/Nairobi',                     lat: -1.29,  lng: 36.82 },
  { name: 'Johannesburg',  tz: 'Africa/Johannesburg',                lat: -26.20, lng: 28.04 },
  { name: 'Casablanca',    tz: 'Africa/Casablanca',                  lat: 33.59,  lng: -7.62 },
  // Asia (one per country)
  { name: 'Kolkata',       tz: 'Asia/Kolkata',                       lat: 22.57,  lng: 88.36 },
  { name: 'Karachi',       tz: 'Asia/Karachi',                       lat: 24.86,  lng: 67.01 },
  { name: 'Dhaka',         tz: 'Asia/Dhaka',                         lat: 23.72,  lng: 90.41 },
  { name: 'Colombo',       tz: 'Asia/Colombo',                       lat: 6.93,   lng: 79.85 },
  { name: 'Kathmandu',     tz: 'Asia/Kathmandu',                     lat: 27.71,  lng: 85.32 },
  { name: 'Kabul',         tz: 'Asia/Kabul',                         lat: 34.53,  lng: 69.17 },
  { name: 'Tashkent',      tz: 'Asia/Tashkent',                      lat: 41.30,  lng: 69.24 },
  { name: 'Almaty',        tz: 'Asia/Almaty',                        lat: 43.25,  lng: 76.95 },
  { name: 'Ulaanbaatar',   tz: 'Asia/Ulaanbaatar',                   lat: 47.91,  lng: 106.88 },
  { name: 'Bangkok',       tz: 'Asia/Bangkok',                       lat: 13.75,  lng: 100.52 },
  { name: 'Singapore',     tz: 'Asia/Singapore',                     lat: 1.35,   lng: 103.82 },
  { name: 'Jakarta',       tz: 'Asia/Jakarta',                       lat: -6.21,  lng: 106.85 },
  { name: 'Bali',          tz: 'Asia/Makassar',                      lat: -8.34,  lng: 115.09 },
  { name: 'Jayapura',      tz: 'Asia/Jayapura',                      lat: -2.53,  lng: 140.72 },
  { name: 'Beijing',       tz: 'Asia/Shanghai',                      lat: 39.91,  lng: 116.39 },
  { name: 'Urumqi',        tz: 'Asia/Urumqi',                        lat: 43.80,  lng: 87.60 },
  { name: 'Tokyo',         tz: 'Asia/Tokyo',                         lat: 35.69,  lng: 139.69 },
  { name: 'Seoul',         tz: 'Asia/Seoul',                         lat: 37.57,  lng: 126.98 },
  { name: 'Taipei',        tz: 'Asia/Taipei',                        lat: 25.05,  lng: 121.53 },
  { name: 'Hong Kong',     tz: 'Asia/Hong_Kong',                     lat: 22.32,  lng: 114.17 },
  { name: 'Kuala Lumpur',  tz: 'Asia/Kuala_Lumpur',                  lat: 3.14,   lng: 101.69 },
  { name: 'Manila',        tz: 'Asia/Manila',                        lat: 14.60,  lng: 120.98 },
  { name: 'Ho Chi Minh',   tz: 'Asia/Ho_Chi_Minh',                   lat: 10.82,  lng: 106.63 },
  // Oceania
  { name: 'Sydney',        tz: 'Australia/Sydney',                   lat: -33.87, lng: 151.21 },
  { name: 'Adelaide',      tz: 'Australia/Adelaide',                 lat: -34.93, lng: 138.60 },
  { name: 'Darwin',        tz: 'Australia/Darwin',                   lat: -12.46, lng: 130.84 },
  { name: 'Perth',         tz: 'Australia/Perth',                    lat: -31.95, lng: 115.86 },
  { name: 'Auckland',      tz: 'Pacific/Auckland',                   lat: -36.86, lng: 174.77 },
  { name: 'Fiji',          tz: 'Pacific/Fiji',                       lat: -18.14, lng: 178.44 },
];
