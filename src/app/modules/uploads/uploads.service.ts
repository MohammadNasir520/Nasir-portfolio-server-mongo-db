import crypto from "crypto";
import httpStatus from "http-status";
import config from "../../../config";
import ApiError from "../../../errors/ApiError";
import {
  ALLOWED_IMAGE_FORMATS,
  MAX_UPLOAD_BYTES,
} from "./uploads.constants";
import { IUploadSignature, IUploadSignatureRequest } from "./uploads.interface";

/**
 * Cloudinary's signature: take the params to be signed, sort them by key, join
 * as `k=v&k=v`, append the api secret, SHA-1 it. That is the whole algorithm -
 * which is why this module needs no `cloudinary` package.
 */
const sign = (params: Record<string, string | number>, apiSecret: string) => {
  const payload = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&");
  return crypto.createHash("sha1").update(payload + apiSecret).digest("hex");
};

const createUploadSignature = async ({
  folder,
  publicId,
}: IUploadSignatureRequest): Promise<IUploadSignature> => {
  const { cloudName, apiKey, apiSecret, baseFolder } = config.cloudinary;

  // A clear error beats a mystery 401 from Cloudinary later.
  if (!cloudName || !apiKey || !apiSecret) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET."
    );
  }

  const scopedFolder = `${baseFolder}/${folder}`;
  // Cloudinary rejects signatures older than an hour; that is the expiry.
  const timestamp = Math.floor(Date.now() / 1000);
  const allowedFormats = ALLOWED_IMAGE_FORMATS.join(",");

  // Signing allowed_formats is what makes the format restriction real: the
  // client must send back the identical value or the signature will not match.
  const signedParams: Record<string, string | number> = {
    allowed_formats: allowedFormats,
    folder: scopedFolder,
    timestamp,
  };
  if (publicId) signedParams.public_id = publicId;

  return {
    cloudName,
    apiKey,
    timestamp,
    folder: scopedFolder,
    publicId,
    signature: sign(signedParams, apiSecret),
    uploadUrl: `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    allowedFormats: ALLOWED_IMAGE_FORMATS,
    maxFileSizeBytes: MAX_UPLOAD_BYTES,
  };
};

export const UploadsService = {
  createUploadSignature,
};
