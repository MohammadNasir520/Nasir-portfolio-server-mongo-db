const fs = require("node:fs");
const path = require("node:path");
const mongoose = require("mongoose");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const fields = {
  projects: ["title", "overview", "stack", "newLearnings", "features"],
  blogs: ["title", "text"],
  experience: [
    "role",
    "employmentType",
    "location",
    "description",
    "responsibilities",
    "achievements",
  ],
  about: ["title", "description"],
  siteProfile: ["name", "headline", "tagline", "bio", "location"],
  achivement: ["title", "description"],
  extraActivites: ["title", "description"],
};

const run = async () => {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not set");
  await mongoose.connect(process.env.DATABASE_URL);
  const output = {};

  for (const [collection, selectedFields] of Object.entries(fields)) {
    const docs = await mongoose.connection.db.collection(collection).find({}).toArray();
    output[collection] = {};
    for (const doc of docs) {
      const content = {};
      for (const field of selectedFields) {
        if (doc[field] !== undefined) content[field] = doc[field];
      }
      output[collection][String(doc._id)] = content;
    }
    console.log(`${collection}: ${docs.length} documents`);
  }

  const destination = path.join(__dirname, "content-english.json");
  fs.writeFileSync(destination, `${JSON.stringify(output, null, 2)}\n`);
  console.log(`Wrote ${destination}`);
};

run()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());
