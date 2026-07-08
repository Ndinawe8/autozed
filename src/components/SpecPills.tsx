import { formatKm } from "@/lib/constants";

export default function SpecPills({
  condition,
  mileage,
  transmission,
  fuelType,
}: {
  condition: string;
  mileage: number;
  transmission: string;
  fuelType: string;
}) {
  const items = [condition, formatKm(mileage), transmission, fuelType];
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((item) => (
        <span
          key={item}
          className="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600"
        >
          {item}
        </span>
      ))}
    </div>
  );
}
