// Shared reference data + small formatting helpers for the marketplace.

export const PROVINCES = [
  "Lusaka",
  "Copperbelt",
  "Central",
  "Eastern",
  "Southern",
  "Northern",
  "Muchinga",
  "Luapula",
  "North-Western",
  "Western",
] as const;

export const BODY_TYPES = [
  "Hatchback",
  "Sedan",
  "SUV",
  "Pickup",
  "Coupe",
  "MPV",
  "Convertible",
  "Wagon",
] as const;

export const FUEL_TYPES = ["Petrol", "Diesel", "Hybrid", "Electric"] as const;
export const TRANSMISSIONS = ["Manual", "Automatic"] as const;
export const CONDITIONS = ["New", "Used"] as const;
export const SELLER_TYPES = ["Private", "Dealer"] as const;
export const DRIVE_TYPES = ["FWD", "RWD", "AWD", "4x4"] as const;
export const SERVICE_HISTORY_OPTIONS = ["Full", "Partial", "None"] as const;

// Feature checklist, similar to AutoTrader's listing spec sheet.
export const FEATURES = [
  "Air conditioning",
  "Electric windows",
  "Central locking",
  "Alarm/Immobiliser",
  "Leather seats",
  "Sunroof/Moonroof",
  "Navigation system",
  "Reverse camera",
  "Bluetooth",
  "Cruise control",
  "Parking sensors",
  "Alloy wheels",
  "Tow bar",
  "Heated seats",
  "Keyless entry",
  "Roof rack",
  "Service plan",
] as const;

// A small make -> models map. In production this becomes a proper
// reference dataset (every trim/variant/year). Good enough to vibe with.
export const MAKES: Record<string, string[]> = {
  Toyota: ["Hilux", "Corolla", "Fortuner", "RAV4", "Corolla Cross", "Land Cruiser"],
  Mitsubishi: ["Pajero", "Triton", "Outlander", "ASX"],
  Volkswagen: ["Polo", "Polo Vivo", "Golf", "T-Cross", "Tiguan", "Amarok"],
  Ford: ["Ranger", "Fiesta", "EcoSport", "Everest", "Figo"],
  BMW: ["3 Series", "1 Series", "X3", "X5", "5 Series"],
  Mercedes: ["A-Class", "C-Class", "GLC", "E-Class"],
  Audi: ["A3", "A4", "Q3", "Q5"],
  Hyundai: ["i20", "Grand i10", "Tucson", "Creta", "Venue"],
  Suzuki: ["Swift", "Vitara Brezza", "Baleno", "Jimny", "Ertiga"],
  Nissan: ["Navara", "Hardbody", "Qashqai", "X-Trail"],
  Kia: ["Picanto", "Sonet", "Seltos", "Sportage"],
  Isuzu: ["D-Max", "MU-X"],
  Mazda: ["BT-50", "CX-5", "Mazda3"],
};

export const MAKE_NAMES = Object.keys(MAKES);

/** Format a Kwacha amount, e.g. 249900 -> "K 249,900". */
export function formatZmw(amount: number): string {
  return "K " + amount.toLocaleString("en-US");
}

/** Format kilometres, e.g. 84500 -> "84,500 km". */
export function formatKm(km: number): string {
  return km.toLocaleString("en-US") + " km";
}

/**
 * Estimate a monthly instalment (very rough) for the finance calculator.
 * Standard amortisation formula. Defaults: 28% p.a., 60 months, 20% deposit
 * (typical for Zambian vehicle asset finance).
 */
export function estimateMonthly(
  price: number,
  opts: { rate?: number; months?: number; depositPct?: number } = {}
): number {
  const { rate = 0.28, months = 60, depositPct = 0.2 } = opts;
  const principal = price * (1 - depositPct);
  const r = rate / 12;
  const payment = (principal * r) / (1 - Math.pow(1 + r, -months));
  return Math.round(payment);
}

/**
 * Build a wa.me link from a local Zambian number (e.g. "0977 555 0123")
 * and a pre-filled message. Converts the leading 0 to the 260 country code.
 */
export function buildWhatsAppLink(phone: string, message: string): string {
  const digits = phone.replace(/\D/g, "");
  const international = digits.startsWith("0") ? "260" + digits.slice(1) : digits;
  return `https://wa.me/${international}?text=${encodeURIComponent(message)}`;
}

/** Parse the JSON image array stored on a Listing row. */
export function parseImages(images: string): string[] {
  try {
    const arr = JSON.parse(images);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

/** Parse the JSON features array stored on a Listing row. */
export function parseFeatures(features: string): string[] {
  try {
    const arr = JSON.parse(features);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}
