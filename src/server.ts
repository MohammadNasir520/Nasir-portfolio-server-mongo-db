import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";
import config from "./config";

let server: Server;

async function bootstrap() {
  try {
    await mongoose.connect(config.database_url as string);
    console.log("database is connected");

    server = app.listen(config.port, () => {
      console.log(`Server running on port ${config.port}`);
    });
  } catch (error) {
    console.log("failed to connect database", error);
    process.exit(1);
  }

  const exitHandler = () => {
    if (server) {
      server.close(() => {
        console.log("Server closed");
        process.exit(1);
      });
    } else {
      process.exit(1);
    }
  };

  const unexpectedErrorHandler = (error: unknown) => {
    console.error(error);
    exitHandler();
  };

  process.on("uncaughtException", unexpectedErrorHandler);
  process.on("unhandledRejection", unexpectedErrorHandler);

  process.on("SIGTERM", () => {
    console.log("SIGTERM received");
    if (server) {
      server.close(() => process.exit(0));
    } else {
      process.exit(0);
    }
  });
}

bootstrap();
