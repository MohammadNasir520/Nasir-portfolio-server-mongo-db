import mongoose from "mongoose";
import app from "../src/app";
import config from "../src/config";

type GlobalMongoState = typeof globalThis & {
  __mongooseConnectPromise?: Promise<typeof mongoose>;
};

const globalState = globalThis as GlobalMongoState;

/**
 * Serverless invocations reuse the module scope, so cache the connect promise
 * to avoid opening a new pool on every warm request.
 */
const ensureDbConnection = async (): Promise<void> => {
  if (mongoose.connection.readyState === 1) {
    return;
  }

  if (!globalState.__mongooseConnectPromise) {
    globalState.__mongooseConnectPromise = mongoose
      .connect(config.database_url as string)
      .catch((error) => {
        globalState.__mongooseConnectPromise = undefined;
        throw error;
      });
  }

  await globalState.__mongooseConnectPromise;
};

export default async function handler(req: any, res: any): Promise<void> {
  try {
    await ensureDbConnection();
    app(req, res);
  } catch (error) {
    console.error("Serverless request bootstrap failed", error);

    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
}
