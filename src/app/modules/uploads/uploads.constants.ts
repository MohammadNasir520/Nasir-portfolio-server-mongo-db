/**
 * Upload targets. The client picks one of these; the server prefixes it with
 * config.cloudinary.baseFolder, so an upload can never land outside the
 * portfolio's own folder tree.
 */
export const UPLOAD_FOLDERS = [
  "avatar",
  "hero",
  "skills",
  "blogs",
  "achievements",
  "extra-activities",
  "travel",
  "projects",
  "logos",
  "education",
  "testimonials",
] as const;

export type UploadFolder = (typeof UPLOAD_FOLDERS)[number];

export const ALLOWED_IMAGE_FORMATS = ["jpg", "jpeg", "png", "webp", "avif"] as const;

/**
 * Advisory: enforced by the client before upload and by the Cloudinary upload
 * preset. The bytes never pass through this API, so the server cannot enforce
 * it directly - that is the one trade-off of signed direct uploads.
 */
export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
