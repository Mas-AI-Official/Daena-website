import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "..");

const voiceDir = path.join(root, "assets", "pitch", "voice");

if (!fs.existsSync(voiceDir)) {
    console.error(`Voice directory not found: ${voiceDir}`);
    process.exit(1);
}

const files = fs.readdirSync(voiceDir)
  .filter(f => f.toLowerCase().endsWith(".mp3"))
  .map(f => {
    const m = f.match(/(\d+)/);
    const slide = m ? parseInt(m[1], 10) : 0;
    return { file: f, slide };
  })
  .sort((a, b) => a.slide - b.slide);

const manifest = { items: files };

fs.writeFileSync(
  path.join(voiceDir, "manifest.json"),
  JSON.stringify(manifest, null, 2),
  "utf8"
);

console.log(`Wrote voice manifest with ${files.length} items:`, path.join(voiceDir, "manifest.json"));

