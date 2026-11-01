import { z } from "zod";

/**
 * Hosts the frontend's next.config.js `remotePatterns` allows. next/image
 * throws at render time for any other host, so an image URL from elsewhere
 * (imgur, GitHub, ...) saved through the dashboard would crash public pages.
 * Keep this list in sync with Frontend/next.config.js.
 */
export const ALLOWED_IMAGE_HOSTS = [
  "res.cloudinary.com",
  "i.ibb.co",
  "ibb.co",
  "upload.wikimedia.org",
];

export const isAllowedImageRef = (v: string): boolean => {
  if (v.startsWith("/")) return true; // site-root path in the Next public folder
  try {
    const u = new URL(v);
    return u.protocol === "https:" && ALLOWED_IMAGE_HOSTS.includes(u.hostname);
  } catch {
    return false;
  }
};

const message = `must be a site-root path (/images/...) or an https URL on ${ALLOWED_IMAGE_HOSTS.join(", ")}`;

/** A required image reference. */
export const imageRef = z.string().min(1).refine(isAllowedImageRef, { message });

/** An optional image reference; "" means "not set". */
export const optionalImageRef = z
  .string()
  .refine((v) => v === "" || isAllowedImageRef(v), { message });
