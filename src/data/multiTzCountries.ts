/**
 * Countries with multiple timezones - city picker data
 * When user clicks these countries, show a city selector
 */

export interface CityOption {
  name: string;
  tz: string;
}

export const MULTI_TZ_COUNTRIES: Record<string, CityOption[]> = {
  'United States of America': [
    { name: 'New York', tz: 'America/New_York' },
    { name: 'Chicago', tz: 'America/Chicago' },
    { name: 'Denver', tz: 'America/Denver' },
    { name: 'Los Angeles', tz: 'America/Los_Angeles' },
    { name: 'Anchorage', tz: 'America/Anchorage' },
    { name: 'Honolulu', tz: 'Pacific/Honolulu' },
  ],
  'USA': [
    { name: 'New York', tz: 'America/New_York' },
    { name: 'Chicago', tz: 'America/Chicago' },
    { name: 'Denver', tz: 'America/Denver' },
    { name: 'Los Angeles', tz: 'America/Los_Angeles' },
    { name: 'Anchorage', tz: 'America/Anchorage' },
    { name: 'Honolulu', tz: 'Pacific/Honolulu' },
  ],
  'Canada': [
    { name: 'Toronto', tz: 'America/Toronto' },
    { name: 'Vancouver', tz: 'America/Vancouver' },
    { name: 'Calgary', tz: 'America/Edmonton' },
    { name: 'Winnipeg', tz: 'America/Winnipeg' },
    { name: 'Halifax', tz: 'America/Halifax' },
    { name: 'St. Johns', tz: 'America/St_Johns' },
  ],
  'Russia': [
    { name: 'Moscow', tz: 'Europe/Moscow' },
    { name: 'St. Petersburg', tz: 'Europe/Moscow' },
    { name: 'Yekaterinburg', tz: 'Asia/Yekaterinburg' },
    { name: 'Novosibirsk', tz: 'Asia/Novosibirsk' },
    { name: 'Krasnoyarsk', tz: 'Asia/Krasnoyarsk' },
    { name: 'Irkutsk', tz: 'Asia/Irkutsk' },
    { name: 'Vladivostok', tz: 'Asia/Vladivostok' },
  ],
  'Australia': [
    { name: 'Sydney', tz: 'Australia/Sydney' },
    { name: 'Melbourne', tz: 'Australia/Melbourne' },
    { name: 'Brisbane', tz: 'Australia/Brisbane' },
    { name: 'Adelaide', tz: 'Australia/Adelaide' },
    { name: 'Perth', tz: 'Australia/Perth' },
    { name: 'Darwin', tz: 'Australia/Darwin' },
  ],
  'Brazil': [
    { name: 'São Paulo', tz: 'America/Sao_Paulo' },
    { name: 'Rio de Janeiro', tz: 'America/Sao_Paulo' },
    { name: 'Brasília', tz: 'America/Sao_Paulo' },
    { name: 'Manaus', tz: 'America/Manaus' },
    { name: 'Fortaleza', tz: 'America/Fortaleza' },
    { name: 'Belém', tz: 'America/Belem' },
  ],
  'India': [
    { name: 'Mumbai', tz: 'Asia/Kolkata' },
    { name: 'Delhi', tz: 'Asia/Kolkata' },
    { name: 'Bangalore', tz: 'Asia/Kolkata' },
    { name: 'Kolkata', tz: 'Asia/Kolkata' },
    { name: 'Chennai', tz: 'Asia/Kolkata' },
    { name: 'Hyderabad', tz: 'Asia/Kolkata' },
  ],
  'China': [
    { name: 'Beijing', tz: 'Asia/Shanghai' },
    { name: 'Shanghai', tz: 'Asia/Shanghai' },
    { name: 'Shenzhen', tz: 'Asia/Shanghai' },
    { name: 'Chengdu', tz: 'Asia/Shanghai' },
    { name: 'Urumqi', tz: 'Asia/Urumqi' },
  ],
  'Indonesia': [
    { name: 'Jakarta', tz: 'Asia/Jakarta' },
    { name: 'Surabaya', tz: 'Asia/Jakarta' },
    { name: 'Bali', tz: 'Asia/Makassar' },
    { name: 'Makassar', tz: 'Asia/Makassar' },
    { name: 'Jayapura', tz: 'Asia/Jayapura' },
  ],
  'Mexico': [
    { name: 'Mexico City', tz: 'America/Mexico_City' },
    { name: 'Guadalajara', tz: 'America/Mexico_City' },
    { name: 'Monterrey', tz: 'America/Monterrey' },
    { name: 'Tijuana', tz: 'America/Tijuana' },
    { name: 'Cancún', tz: 'America/Cancun' },
  ],
  'Kazakhstan': [
    { name: 'Almaty', tz: 'Asia/Almaty' },
    { name: 'Nur-Sultan', tz: 'Asia/Almaty' },
    { name: 'Aktau', tz: 'Asia/Aqtau' },
  ],
  'Mongolia': [
    { name: 'Ulaanbaatar', tz: 'Asia/Ulaanbaatar' },
    { name: 'Hovd', tz: 'Asia/Hovd' },
  ],
};

// Get country name from timezone (reverse lookup for user's local tz)
export function getCountryFromTz(tz: string): string | null {
  for (const [country, cities] of Object.entries(MULTI_TZ_COUNTRIES)) {
    if (cities.some(c => c.tz === tz)) return country;
  }
  return null;
}
