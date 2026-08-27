import sharp from "sharp";
import { readdirSync, statSync } from "node:fs";
const dir = new URL("../public/", import.meta.url).pathname;
const files = readdirSync(dir).filter(f => /\.(jpg|jpeg|webp|png)$/i.test(f) && !/^(logo|qr|Asset)/i.test(f));
console.log("file".padEnd(26) + "size".padStart(9) + "dims".padStart(13) + "contrast".padStart(10));
for (const f of files.sort()) {
  try {
    const st = await sharp(`${dir}${f}`).stats();
    const m  = await sharp(`${dir}${f}`).metadata();
    const sd = st.channels.slice(0,3).reduce((a,c)=>a+c.stdev,0) / 3;
    const kb = Math.round(statSync(`${dir}${f}`).size/1024);
    console.log(f.padEnd(26) + `${kb}KB`.padStart(9) + `${m.width}x${m.height}`.padStart(13) + sd.toFixed(1).padStart(10));
  } catch(e) { console.log(f.padEnd(26) + "  ERR " + e.message.slice(0,36)); }
}
