import Image from "next/image";

/**
 * Renders an image when `src` is set, and an on-brand placeholder slot when it
 * is not — so the layout is final before the real photography lands.
 *
 * To fill a slot: drop the file in /public and set the matching entry in the
 * IMAGES map at the top of the page that uses it. Nothing else changes.
 */
export default function MediaFrame({
  src,
  alt,
  label,
  hint,
  className = "",
  imageClassName = "",
  objectPosition = "center",
  sizes = "(max-width: 768px) 100vw, 50vw",
  priority = false,
}) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className={`object-cover ${imageClassName}`}
          style={{ objectPosition }}
        />
      ) : (
        <div
          role="img"
          aria-label={alt}
          className="flex h-full w-full flex-col items-center justify-center gap-3 border-2 border-dashed border-outline-variant bg-surface-container-highest p-6 text-center"
        >
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="h-10 w-10 fill-primary/40"
          >
            <path d="M21 19V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2ZM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5Z" />
          </svg>
          <p className="font-display text-body-md font-bold text-on-surface-variant">
            {label ?? "Image placeholder"}
          </p>
          {hint ? (
            <p className="max-w-xs font-body text-body-sm text-outline">{hint}</p>
          ) : null}
        </div>
      )}
    </div>
  );
}
