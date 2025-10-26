/**
 * Country list with flags for filtering
 */

export interface Country {
  code: string;
  name: string;
  flag: string;
  popular?: boolean;
}

export const COUNTRIES: Country[] = [
  { code: 'US', name: 'United States', flag: '🇺🇸', popular: true },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', popular: true },
  { code: 'CA', name: 'Canada', flag: '🇨🇦', popular: true },
  { code: 'AU', name: 'Australia', flag: '🇦🇺', popular: true },
  { code: 'DE', name: 'Germany', flag: '🇩🇪', popular: true },
  { code: 'FR', name: 'France', flag: '🇫🇷', popular: true },
  { code: 'ES', name: 'Spain', flag: '🇪🇸' },
  { code: 'IT', name: 'Italy', flag: '🇮🇹' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵' },
  { code: 'CN', name: 'China', flag: '🇨🇳' },
  { code: 'IN', name: 'India', flag: '🇮🇳' },
  { code: 'BR', name: 'Brazil', flag: '🇧🇷' },
  { code: 'MX', name: 'Mexico', flag: '🇲🇽' },
  { code: 'RU', name: 'Russia', flag: '🇷🇺' },
  { code: 'ZA', name: 'South Africa', flag: '🇿🇦' },
  { code: 'NL', name: 'Netherlands', flag: '🇳🇱' },
  { code: 'BE', name: 'Belgium', flag: '🇧🇪' },
  { code: 'CH', name: 'Switzerland', flag: '🇨🇭' },
  { code: 'SE', name: 'Sweden', flag: '🇸🇪' },
  { code: 'NO', name: 'Norway', flag: '🇳🇴' },
  { code: 'DK', name: 'Denmark', flag: '🇩🇰' },
  { code: 'FI', name: 'Finland', flag: '🇫🇮' },
  { code: 'IE', name: 'Ireland', flag: '🇮🇪' },
  { code: 'NZ', name: 'New Zealand', flag: '🇳🇿' },
  { code: 'SG', name: 'Singapore', flag: '🇸🇬' },
  { code: 'KR', name: 'South Korea', flag: '🇰🇷' },
];
