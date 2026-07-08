import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Hand-written sample inventory so the marketplace feels alive on first run.
// Prices in Zambian Kwacha (ZMW), mileage in km — realistic-ish for the
// Zambian used-import market.
const listings = [
  {
    make: "Volkswagen", model: "Polo", variant: "1.0 TSI Comfortline", year: 2021,
    price: 389900, mileage: 48000, fuelType: "Petrol", transmission: "Manual",
    bodyType: "Hatchback", color: "White", province: "Lusaka", city: "Lusaka",
    condition: "Used", sellerType: "Dealer", sellerName: "Lusaka Auto Centre",
    sellerPhone: "0211 255 0100", featured: true, rating: 4.6, reviewCount: 132,
    engineSize: "1.0L", power: 70, doors: 5, seats: 5, driveType: "FWD",
    serviceHistory: "Full", previousOwners: 1, fuelConsumption: 5.4,
    features: JSON.stringify(["Air conditioning", "Electric windows", "Central locking", "Bluetooth", "Alarm/Immobiliser", "Alloy wheels"]),
    description: "Full service history, one owner, balance of motorplan. Spotless.",
  },
  {
    make: "Toyota", model: "Hilux", variant: "2.4 GD-6 RB Raider D/Cab", year: 2020,
    price: 729900, mileage: 96000, fuelType: "Diesel", transmission: "Manual",
    bodyType: "Pickup", color: "Silver", province: "Lusaka", city: "Lusaka",
    condition: "Used", sellerType: "Dealer", sellerName: "Great East Motors",
    sellerPhone: "0966 555 0144", featured: true, rating: 4.2, reviewCount: 89,
    engineSize: "2.4L", power: 110, doors: 4, seats: 5, driveType: "4x4",
    serviceHistory: "Full", previousOwners: 2, fuelConsumption: 7.9,
    features: JSON.stringify(["Air conditioning", "Tow bar", "Reverse camera", "Bluetooth", "Alloy wheels", "Cruise control"]),
    description: "Tough and reliable. Tow bar, canopy, full service history.",
  },
  {
    make: "Toyota", model: "Corolla Cross", variant: "1.8 Hybrid XS", year: 2023,
    price: 649900, mileage: 22000, fuelType: "Hybrid", transmission: "Automatic",
    bodyType: "SUV", color: "Grey", province: "Copperbelt", city: "Ndola",
    condition: "Used", sellerType: "Dealer", sellerName: "Ndola Hybrid Cars",
    sellerPhone: "0212 555 0188", featured: true, rating: 4.8, reviewCount: 54,
    engineSize: "1.8L Hybrid", power: 90, doors: 5, seats: 5, driveType: "FWD",
    serviceHistory: "Full", previousOwners: 1, fuelConsumption: 4.3,
    features: JSON.stringify(["Air conditioning", "Navigation system", "Reverse camera", "Cruise control", "Keyless entry", "Leather seats"]),
    description: "Sips fuel. Still under factory warranty and service plan.",
  },
  {
    make: "Ford", model: "Ranger", variant: "2.0 BiTurbo Wildtrak 4x4", year: 2022,
    price: 909900, mileage: 54000, fuelType: "Diesel", transmission: "Automatic",
    bodyType: "Pickup", color: "Blue", province: "Copperbelt", city: "Kitwe",
    condition: "Used", sellerType: "Dealer", sellerName: "Kitwe Bush Motors",
    sellerPhone: "0212 555 0166", rating: 3.9, reviewCount: 41,
    engineSize: "2.0L BiTurbo", power: 157, doors: 4, seats: 5, driveType: "4x4",
    serviceHistory: "Full", previousOwners: 1, fuelConsumption: 8.4,
    features: JSON.stringify(["Leather seats", "Navigation system", "Reverse camera", "Cruise control", "Parking sensors", "Sunroof/Moonroof", "Tow bar"]),
    description: "Loaded Wildtrak. Leather, nav, 360 camera. Immaculate.",
  },
  {
    make: "Volkswagen", model: "Polo Vivo", variant: "1.4 Trendline", year: 2019,
    price: 229900, mileage: 78000, fuelType: "Petrol", transmission: "Manual",
    bodyType: "Hatchback", color: "Red", province: "Lusaka", city: "Kabwata",
    condition: "Used", sellerType: "Private", sellerName: "Mutale B.",
    sellerPhone: "0977 555 0123",
    engineSize: "1.4L", power: 63, doors: 5, seats: 5, driveType: "FWD",
    serviceHistory: "Partial", previousOwners: 2, fuelConsumption: 6.2,
    features: JSON.stringify(["Air conditioning", "Electric windows", "Central locking"]),
    description: "Great first car. Economical, reliable, papers in order.",
  },
  {
    make: "Suzuki", model: "Swift", variant: "1.2 GL", year: 2022,
    price: 269900, mileage: 31000, fuelType: "Petrol", transmission: "Manual",
    bodyType: "Hatchback", color: "White", province: "Southern", city: "Livingstone",
    condition: "Used", sellerType: "Private", sellerName: "Chanda K.",
    sellerPhone: "0955 555 0199",
    engineSize: "1.2L", power: 61, doors: 5, seats: 5, driveType: "FWD",
    serviceHistory: "Full", previousOwners: 1, fuelConsumption: 5.0,
    features: JSON.stringify(["Air conditioning", "Electric windows", "Bluetooth", "Alarm/Immobiliser"]),
    description: "Like new, low mileage, fuel saver. Reason for sale: relocating.",
  },
  {
    make: "BMW", model: "3 Series", variant: "320d M Sport", year: 2021,
    price: 779900, mileage: 62000, fuelType: "Diesel", transmission: "Automatic",
    bodyType: "Sedan", color: "Black", province: "Lusaka", city: "Lusaka",
    condition: "Used", sellerType: "Dealer", sellerName: "Premium Auto Lusaka",
    sellerPhone: "0211 555 0177", rating: 4.5, reviewCount: 203,
    engineSize: "2.0L Diesel", power: 140, doors: 4, seats: 5, driveType: "RWD",
    serviceHistory: "Full", previousOwners: 1, fuelConsumption: 4.7,
    features: JSON.stringify(["Leather seats", "Navigation system", "Sunroof/Moonroof", "Heated seats", "Cruise control", "Parking sensors", "Keyless entry"]),
    description: "M Sport package, full house. BMW service history.",
  },
  {
    make: "Mitsubishi", model: "Pajero", variant: "3.2 DI-D GLS", year: 2020,
    price: 599900, mileage: 88000, fuelType: "Diesel", transmission: "Automatic",
    bodyType: "SUV", color: "Grey", province: "Eastern", city: "Chipata",
    condition: "Used", sellerType: "Dealer", sellerName: "Chipata 4x4 Hub",
    sellerPhone: "0216 555 0155", rating: 4.1, reviewCount: 27,
    engineSize: "3.2L Diesel", power: 130, doors: 5, seats: 7, driveType: "4x4",
    serviceHistory: "Partial", previousOwners: 2, fuelConsumption: 9.5,
    features: JSON.stringify(["Air conditioning", "Tow bar", "Cruise control", "Alloy wheels", "Roof rack"]),
    description: "Spacious 7-seater, perfect for rough roads. Well maintained.",
  },
  {
    make: "Hyundai", model: "Grand i10", variant: "1.0 Motion", year: 2021,
    price: 244900, mileage: 45000, fuelType: "Petrol", transmission: "Manual",
    bodyType: "Hatchback", color: "Silver", province: "Central", city: "Kabwe",
    condition: "Used", sellerType: "Private", sellerName: "Joseph M.",
    sellerPhone: "0966 555 0111",
    engineSize: "1.0L", power: 49, doors: 5, seats: 5, driveType: "FWD",
    serviceHistory: "Partial", previousOwners: 1, fuelConsumption: 5.5,
    features: JSON.stringify(["Air conditioning", "Electric windows", "Central locking"]),
    description: "Economical city car, well looked after, full service history.",
  },
  {
    make: "Mercedes", model: "C-Class", variant: "C200 AMG Line", year: 2020,
    price: 749900, mileage: 71000, fuelType: "Petrol", transmission: "Automatic",
    bodyType: "Sedan", color: "White", province: "Lusaka", city: "Lusaka",
    condition: "Used", sellerType: "Dealer", sellerName: "Star Motors Zambia",
    sellerPhone: "0211 555 0133", rating: 4.7, reviewCount: 168,
    engineSize: "1.5L Turbo", power: 135, doors: 4, seats: 5, driveType: "RWD",
    serviceHistory: "Full", previousOwners: 1, fuelConsumption: 6.0,
    features: JSON.stringify(["Leather seats", "Sunroof/Moonroof", "Navigation system", "Heated seats", "Keyless entry", "Cruise control", "Parking sensors"]),
    description: "AMG Line, panoramic roof, premium sound. Showroom condition.",
  },
  {
    make: "Suzuki", model: "Jimny", variant: "1.5 GLX", year: 2022,
    price: 449900, mileage: 27000, fuelType: "Petrol", transmission: "Manual",
    bodyType: "SUV", color: "Green", province: "Southern", city: "Choma",
    condition: "Used", sellerType: "Private", sellerName: "Bwalya N.",
    sellerPhone: "0979 555 0188",
    engineSize: "1.5L", power: 75, doors: 3, seats: 4, driveType: "4x4",
    serviceHistory: "Full", previousOwners: 1, fuelConsumption: 6.4,
    features: JSON.stringify(["Air conditioning", "Alloy wheels", "Bluetooth"]),
    description: "Fun little 4x4. Always garaged. Sought-after GLX manual.",
  },
  {
    make: "Kia", model: "Picanto", variant: "1.0 Street", year: 2023,
    price: 259900, mileage: 12000, fuelType: "Petrol", transmission: "Manual",
    bodyType: "Hatchback", color: "Blue", province: "Copperbelt", city: "Kitwe",
    condition: "Used", sellerType: "Dealer", sellerName: "Kitwe City Cars",
    sellerPhone: "0212 555 0122", rating: 3.6, reviewCount: 47,
    engineSize: "1.0L", power: 49, doors: 5, seats: 5, driveType: "FWD",
    serviceHistory: "Full", previousOwners: 1, fuelConsumption: 5.0,
    features: JSON.stringify(["Air conditioning", "Electric windows", "Bluetooth", "Alarm/Immobiliser"]),
    description: "Nearly new. Balance of warranty and service plan included.",
  },
  {
    make: "Toyota", model: "Fortuner", variant: "2.8 GD-6 4x4", year: 2019,
    price: 689900, mileage: 112000, fuelType: "Diesel", transmission: "Automatic",
    bodyType: "SUV", color: "White", province: "Northern", city: "Kasama",
    condition: "Used", sellerType: "Dealer", sellerName: "Kasama 4x4 Motors",
    sellerPhone: "0214 555 0144", rating: 4.0, reviewCount: 19,
    engineSize: "2.8L Diesel", power: 130, doors: 5, seats: 7, driveType: "4x4",
    serviceHistory: "Full", previousOwners: 2, fuelConsumption: 8.1,
    features: JSON.stringify(["Air conditioning", "Tow bar", "Reverse camera", "Cruise control", "Leather seats", "Parking sensors"]),
    description: "7-seater family SUV. Tow bar, full service history at Toyota.",
  },
  {
    make: "Audi", model: "A3", variant: "1.4 TFSI S line", year: 2020,
    price: 489900, mileage: 58000, fuelType: "Petrol", transmission: "Automatic",
    bodyType: "Hatchback", color: "Grey", province: "Lusaka", city: "Lusaka",
    condition: "Used", sellerType: "Private", sellerName: "Mwansa P.",
    sellerPhone: "0971 555 0166",
    engineSize: "1.4L Turbo", power: 92, doors: 5, seats: 5, driveType: "FWD",
    serviceHistory: "Full", previousOwners: 1, fuelConsumption: 5.2,
    features: JSON.stringify(["Leather seats", "Navigation system", "Bluetooth", "Alloy wheels", "Cruise control"]),
    description: "S line spec, virtual cockpit. Well maintained, dealer serviced.",
  },
  {
    make: "Isuzu", model: "D-Max", variant: "3.0 TD LX D/Cab", year: 2021,
    price: 569900, mileage: 65000, fuelType: "Diesel", transmission: "Manual",
    bodyType: "Pickup", color: "Orange", province: "North-Western", city: "Solwezi",
    condition: "Used", sellerType: "Private", sellerName: "Given S.",
    sellerPhone: "0976 555 0177",
    engineSize: "3.0L Diesel", power: 130, doors: 4, seats: 5, driveType: "4x4",
    serviceHistory: "Partial", previousOwners: 1, fuelConsumption: 8.3,
    features: JSON.stringify(["Air conditioning", "Tow bar", "Alloy wheels"]),
    description: "Mine-spec workhorse. Tough, dependable, well serviced.",
  },
  {
    make: "Ford", model: "Everest", variant: "2.0 BiTurbo Platinum 4WD", year: 2023,
    price: 1149900, mileage: 19000, fuelType: "Diesel", transmission: "Automatic",
    bodyType: "SUV", color: "Black", province: "Lusaka", city: "Lusaka",
    condition: "Used", sellerType: "Dealer", sellerName: "Helderberg Premium Lusaka",
    sellerPhone: "0211 555 0199", featured: true, rating: 4.9, reviewCount: 95,
    engineSize: "2.0L BiTurbo", power: 157, doors: 5, seats: 7, driveType: "4x4",
    serviceHistory: "Full", previousOwners: 1, fuelConsumption: 8.0,
    features: JSON.stringify(["Leather seats", "Navigation system", "Sunroof/Moonroof", "Heated seats", "Cruise control", "Parking sensors", "Keyless entry", "Tow bar"]),
    description: "Top-spec Platinum. 7 seats, every option. As new condition.",
  },
];

async function main() {
  console.log("Seeding database…");
  await prisma.review.deleteMany();
  await prisma.lead.deleteMany();
  await prisma.listing.deleteMany();

  for (const l of listings) {
    await prisma.listing.create({
      data: { ...l, images: "[]" },
    });
  }
  console.log(`Seeded ${listings.length} listings.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
