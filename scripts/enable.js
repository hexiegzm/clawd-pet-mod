/**
 * Clawd File Feed Mod — Enable
 *
 * 工作原理：Electron 优先加载 app/ 目录而非 app.asar
 * 1. 备份 app.asar（只做一次）
 * 2. 从 app.asar 解包（保持原名才能关联 .unpacked 目录）
 * 3. 打补丁 → 改名 app.asar → app.asar.disabled
 * 4. Electron 自动加载 app/ 中的修改版代码
 */

const fs = require("fs");
const path = require("path");
const { execSync, spawn } = require("child_process");

// ── Paths ──
const RESOURCES = path.resolve("D:/claude code pet/Clawd on Desk/resources");
const ASAR = path.join(RESOURCES, "app.asar");
const ASAR_ORIGINAL = path.join(RESOURCES, "app.asar.original");
const ASAR_DISABLED = path.join(RESOURCES, "app.asar.disabled");
const APP_DIR = path.join(RESOURCES, "app");
const PATCHES_SRC = path.resolve(__dirname, "..", "patches", "src");
const EXE = path.resolve("D:/claude code pet/Clawd on Desk/Clawd on Desk.exe");

function log(msg) { console.log(`[Enable] ${msg}`); }

// ── Step 1: Kill Clawd if running ──
log("Stopping Clawd on Desk...");
try { execSync('taskkill /f /im "Clawd on Desk.exe" 2>nul', { stdio: "ignore" }); } catch {}
setTimeout(() => proceed(), 1500);

function proceed() {
  try {
    // ── Step 2: First-time backup ──
    if (!fs.existsSync(ASAR_ORIGINAL)) {
      if (fs.existsSync(ASAR)) {
        fs.copyFileSync(ASAR, ASAR_ORIGINAL);
        log("Created pristine backup: app.asar.original");
      } else if (fs.existsSync(ASAR_DISABLED)) {
        // Mod was previously enabled then disabled — asar.disabled exists
        fs.copyFileSync(ASAR_DISABLED, ASAR_ORIGINAL);
        log("Created pristine backup from app.asar.disabled");
      } else {
        console.error("[Enable] ERROR: No app.asar found!");
        process.exit(1);
      }
    } else {
      log("Pristine backup already exists");
    }

    // ── Step 3: Restore app.asar from backup if needed ──
    // If app.asar doesn't exist (mod was previously enabled), restore it
    // from the disabled copy so we can extract from it with the correct name.
    if (!fs.existsSync(ASAR)) {
      if (fs.existsSync(ASAR_DISABLED)) {
        fs.copyFileSync(ASAR_DISABLED, ASAR);
        log("Restored app.asar from app.asar.disabled for extraction");
      } else if (fs.existsSync(ASAR_ORIGINAL)) {
        fs.copyFileSync(ASAR_ORIGINAL, ASAR);
        log("Restored app.asar from app.asar.original for extraction");
      }
    } else {
      // app.asar already exists — skip
    }

    // ── Step 4: Remove old patched app/ if exists ──
    if (fs.existsSync(APP_DIR)) {
      fs.rmSync(APP_DIR, { recursive: true, force: true });
      log("Removed old app/");
    }

    // ── Step 5: Extract from app.asar (MUST be named app.asar so it finds .unpacked) ──
    log("Extracting app.asar (this may take ~30s)...");
    execSync(`npx @electron/asar extract "${ASAR}" "${APP_DIR}"`, {
      stdio: "inherit",
      timeout: 180000,
    });

    // ── Step 6: Apply patches ──
    const patchFiles = ["hit-renderer.js", "pet-interaction-ipc.js", "renderer.js"];
    for (const file of patchFiles) {
      const src = path.join(PATCHES_SRC, file);
      const dest = path.join(APP_DIR, "src", file);
      if (fs.existsSync(src)) {
        fs.copyFileSync(src, dest);
        log(`Patched: src/${file}`);
      } else {
        console.error(`[Enable] WARNING: patch not found: ${file}`);
      }
    }

    // ── Step 7: Rename app.asar → app.asar.disabled ──
    // Electron: if app/ directory exists, it takes priority over app.asar.
    if (fs.existsSync(ASAR) && !fs.existsSync(ASAR_DISABLED)) {
      fs.renameSync(ASAR, ASAR_DISABLED);
      log("app.asar → app.asar.disabled (app/ now takes priority)");
    } else if (fs.existsSync(ASAR) && fs.existsSync(ASAR_DISABLED)) {
      fs.unlinkSync(ASAR);
      log("Removed temporary app.asar (app.asar.disabled kept)");
    }

    // ── Done ──
    log("Mod enabled successfully!");
    log("Restarting Clawd on Desk...");

    spawn(EXE, [], { detached: true, stdio: "ignore" }).unref();
    log("Clawd started. Drag a file onto the pet to test!");

    setTimeout(() => process.exit(0), 2000);
  } catch (err) {
    console.error("[Enable] FAILED:", err.message);
    process.exit(1);
  }
}
