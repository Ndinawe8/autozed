"use server";

import { prisma } from "@/lib/prisma";
import { auth, signIn, signOut } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// Thin server-action wrappers so Navbar (a Server Component) can trigger
// sign-in/out directly from a <form action={...}>, no client JS needed.
export async function signInAction(formData: FormData) {
  const callbackUrl = (formData.get("callbackUrl") as string) || "/";
  await signIn("google", { redirectTo: callbackUrl });
}

export async function signOutAction() {
  await signOut({ redirectTo: "/" });
}

// Create a new listing from the "Sell your car" form. Requires a seller
// account — selling without one is not allowed.
export async function createListing(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("You must sign in to list a car.");
  }

  const get = (k: string) => (formData.get(k) as string)?.trim() || "";
  const getInt = (k: string) => {
    const n = parseInt(get(k).replace(/\D/g, ""), 10);
    return Number.isFinite(n) ? n : null;
  };
  const getFloat = (k: string) => {
    const n = parseFloat(get(k));
    return Number.isFinite(n) ? n : null;
  };

  const make = get("make");
  const model = get("model");
  const year = parseInt(get("year"), 10);
  const price = parseInt(get("price").replace(/\D/g, ""), 10);
  const mileage = parseInt(get("mileage").replace(/\D/g, ""), 10);
  const features = formData.getAll("features").map((f) => f.toString());

  if (!make || !model || !year || !price || !mileage || !get("sellerName")) {
    throw new Error("Please fill in all required fields.");
  }

  const listing = await prisma.listing.create({
    data: {
      make,
      model,
      variant: get("variant") || null,
      year,
      price,
      mileage,
      fuelType: get("fuelType") || "Petrol",
      transmission: get("transmission") || "Manual",
      bodyType: get("bodyType") || "Hatchback",
      color: get("color") || null,
      engineSize: get("engineSize") || null,
      power: getInt("power"),
      doors: getInt("doors"),
      seats: getInt("seats"),
      driveType: get("driveType") || null,
      serviceHistory: get("serviceHistory") || null,
      previousOwners: getInt("previousOwners"),
      fuelConsumption: getFloat("fuelConsumption"),
      features: JSON.stringify(features),
      province: get("province") || "Lusaka",
      city: get("city") || null,
      description: get("description") || null,
      condition: get("condition") || "Used",
      sellerType: get("sellerType") || "Private",
      sellerName: get("sellerName"),
      sellerPhone: get("sellerPhone") || null,
      sellerEmail: session.user.email ?? null,
      userId: session.user.id,
      images: "[]",
    },
  });

  revalidatePath("/");
  redirect(`/cars/${listing.id}?new=1`);
}

// Leave a star rating + comment on a listing. Requires a signed-in
// customer account (unlike enquiries, which stay anonymous).
export async function createReview(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("You must sign in to leave a rating.");
  }

  const listingId = (formData.get("listingId") as string)?.trim();
  const rating = parseInt(formData.get("rating") as string, 10);
  const comment = (formData.get("comment") as string)?.trim() || null;

  if (!listingId || !rating || rating < 1 || rating > 5) {
    throw new Error("Please choose a rating between 1 and 5.");
  }

  await prisma.review.upsert({
    where: { listingId_userId: { listingId, userId: session.user.id } },
    update: { rating, comment },
    create: { listingId, userId: session.user.id, rating, comment },
  });

  revalidatePath(`/cars/${listingId}`);
}

// Delete a listing — only the owner can do this.
export async function deleteListing(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("You must be signed in to delete a listing.");
  }

  const id = (formData.get("id") as string)?.trim();
  if (!id) throw new Error("Missing listing id.");

  const listing = await prisma.listing.findUnique({ where: { id } });
  if (!listing || listing.userId !== session.user.id) {
    throw new Error("Listing not found or you don't have permission to delete it.");
  }

  await prisma.review.deleteMany({ where: { listingId: id } });
  await prisma.lead.deleteMany({ where: { listingId: id } });
  await prisma.listing.delete({ where: { id } });

  revalidatePath("/");
  redirect("/dashboard");
}

// Capture a buyer enquiry ("Contact seller").
export async function createLead(formData: FormData) {
  const get = (k: string) => (formData.get(k) as string)?.trim() || "";
  const listingId = get("listingId");

  if (!listingId || !get("name") || !get("email") || !get("message")) {
    throw new Error("Please complete the enquiry form.");
  }

  await prisma.lead.create({
    data: {
      listingId,
      name: get("name"),
      email: get("email"),
      phone: get("phone") || null,
      message: get("message"),
    },
  });

  revalidatePath(`/cars/${listingId}`);
  redirect(`/cars/${listingId}?sent=1`);
}
