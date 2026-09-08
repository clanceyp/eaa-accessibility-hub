/**
 * Jurisdiction display name -> ISO 3166-1 alpha-2 code, for rendering a
 * flag emoji next to news entries. Covers the EU-27 plus a few common
 * near-EU jurisdictions the WAD/EAA news pipeline may surface (Norway is
 * covered by the Web Accessibility Directive monitoring alongside the
 * EU-27). "EU" isn't a real ISO code, but the two-letter regional
 * indicator trick used below happens to render the EU flag for it too.
 */
const JURISDICTION_TO_ISO: Record<string, string> = {
  austria: 'AT',
  belgium: 'BE',
  bulgaria: 'BG',
  croatia: 'HR',
  cyprus: 'CY',
  czechia: 'CZ',
  'czech republic': 'CZ',
  denmark: 'DK',
  estonia: 'EE',
  finland: 'FI',
  france: 'FR',
  germany: 'DE',
  greece: 'GR',
  hungary: 'HU',
  iceland: 'IS',
  ireland: 'IE',
  italy: 'IT',
  latvia: 'LV',
  liechtenstein: 'LI',
  lithuania: 'LT',
  luxembourg: 'LU',
  malta: 'MT',
  netherlands: 'NL',
  norway: 'NO',
  poland: 'PL',
  portugal: 'PT',
  romania: 'RO',
  slovakia: 'SK',
  slovenia: 'SI',
  spain: 'ES',
  sweden: 'SE',
  eu: 'EU'
}

function isoToFlagEmoji(isoCode: string): string {
  return [...isoCode.toUpperCase()]
    .map((char) => String.fromCodePoint(127397 + char.charCodeAt(0)))
    .join('')
}

/** Returns a flag emoji for a jurisdiction name, or null if unrecognised. */
export function jurisdictionFlagEmoji(jurisdiction: string): string | null {
  const isoCode = JURISDICTION_TO_ISO[jurisdiction.trim().toLowerCase()]
  return isoCode ? isoToFlagEmoji(isoCode) : null
}
