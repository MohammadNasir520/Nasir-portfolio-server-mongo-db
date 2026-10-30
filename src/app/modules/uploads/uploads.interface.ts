import { UploadFolder } from "./uploads.constants";

export type IUploadSignatureRequest = {
  folder: UploadFolder;
  /** Optional stable name, so re-uploading an avatar replaces it. */
  publicId?: string;
};

export type IUploadSignature = {
  cloudName: string;
  apiKey: string;
  timestamp: number;
  folder: string;
  publicId?: string;
  signature: string;
  uploadUrl: string;
  allowedFormats: readonly string[];
  maxFileSizeBytes: number;
};
