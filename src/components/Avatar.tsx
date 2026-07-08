// Falls back to a generic placeholder icon when a user has no profile photo.
export default function Avatar({
  src,
  name,
  size = 28,
}: {
  src?: string | null;
  name?: string | null;
  size?: number;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src || "/default-avatar.svg"}
      alt={name ?? "User"}
      width={size}
      height={size}
      className="rounded-full object-cover"
      style={{ width: size, height: size }}
    />
  );
}
