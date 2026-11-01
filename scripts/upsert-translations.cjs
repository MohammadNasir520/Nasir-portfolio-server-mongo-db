const fs = require("node:fs");
const path = require("node:path");
const mongoose = require("mongoose");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const flatten = (value, prefix = "", output = {}) => {
  for (const [key, child] of Object.entries(value || {})) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (child && typeof child === "object" && !Array.isArray(child)) {
      flatten(child, fullKey, output);
    } else {
      output[fullKey] = child;
    }
  }
  return output;
};

const run = async () => {
  const [route, file] = process.argv.slice(2);
  if (!route || !file) throw new Error("Usage: node scripts/upsert-translations.cjs <route> <file>");
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not set");
  const translations = JSON.parse(fs.readFileSync(path.resolve(file), "utf8"));
  await mongoose.connect(process.env.DATABASE_URL);
  const collection = mongoose.connection.db.collection("translations");

  for (const [lang, messages] of Object.entries(translations)) {
    const flattened = flatten(messages);
    const set = Object.fromEntries(
      Object.entries(flattened).map(([key, value]) => [`translations.${key}`, value])
    );
    const result = await collection.updateOne(
      { route, lang },
      { $set: set, $setOnInsert: { route, lang } },
      { upsert: true }
    );
    console.log(`${route}/${lang}: matched=${result.matchedCount} modified=${result.modifiedCount} upserted=${result.upsertedCount}`);
  }
};

run()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());
