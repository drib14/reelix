// Helper to convert 2-letter ISO country code to Emoji Flag
export const getCountryFlag = (countryCode) => {
  if (!countryCode || countryCode === "" || countryCode === "ALL" || countryCode === "All") {
    return "🌐";
  }
  const code = countryCode.toUpperCase();
  if (code.length !== 2) return "🌐";
  const normCode = code === "UK" ? "GB" : code;
  const first = normCode.charCodeAt(0) + 127397;
  const second = normCode.charCodeAt(1) + 127397;
  return String.fromCodePoint(first, second);
};

export const getCountryNameWithFlag = (countryCode, englishName) => {
  const flag = getCountryFlag(countryCode);
  if (!countryCode) return `${flag} All Countries / Worldwide`;
  const name = englishName || countryCode;
  return `${flag} ${name} (${countryCode.toUpperCase()})`;
};

export const GLOBAL_COUNTRIES = [
  { code: "", name: "All Countries / Worldwide" },
  { code: "US", name: "United States" },
  { code: "PH", name: "Philippines" },
  { code: "KR", name: "South Korea" },
  { code: "JP", name: "Japan" },
  { code: "GB", name: "United Kingdom" },
  { code: "FR", name: "France" },
  { code: "IN", name: "India" },
  { code: "ES", name: "Spain" },
  { code: "TH", name: "Thailand" },
  { code: "CA", name: "Canada" },
  { code: "MX", name: "Mexico" },
  { code: "DE", name: "Germany" },
  { code: "IT", name: "Italy" },
  { code: "BR", name: "Brazil" },
  { code: "AU", name: "Australia" },
  { code: "CN", name: "China" },
  { code: "TW", name: "Taiwan" },
  { code: "HK", name: "Hong Kong" },
  { code: "SG", name: "Singapore" },
  { code: "ID", name: "Indonesia" },
  { code: "VN", name: "Vietnam" },
  { code: "MY", name: "Malaysia" },
  { code: "TR", name: "Turkey" },
  { code: "EG", name: "Egypt" },
  { code: "AR", name: "Argentina" },
  { code: "CL", name: "Chile" },
  { code: "CO", name: "Colombia" },
  { code: "ZA", name: "South Africa" },
  { code: "NG", name: "Nigeria" },
  { code: "RU", name: "Russia" },
  { code: "UA", name: "Ukraine" },
  { code: "PL", name: "Poland" },
  { code: "NL", name: "Netherlands" },
  { code: "SE", name: "Sweden" },
  { code: "NO", name: "Norway" },
  { code: "DK", name: "Denmark" },
  { code: "FI", name: "Finland" },
  { code: "IE", name: "Ireland" },
  { code: "NZ", name: "New Zealand" },
  { code: "AE", name: "United Arab Emirates" },
  { code: "SA", name: "Saudi Arabia" },
];
