/**
 * Clawd File Feed Mod — Disable / Restore Original
 *
 * 删除 app/ 目录，还原 app.asar，恢复出厂状态
 */

const fs = require("fs");
const path = require("path");
const { execSync, spawn } = require("child_process");

// ── Paths ──
const RESOURCES = path.resolve("D:/claude code pet/Clawd on Desk/resources");
const ASAR = path.join(RESOURCES, "app.asar");
const ASAR_DISABLED = path.join(RESOURCES, "app.asar.disabled");
const APP_DIR = path.join(RESOURCES, "app");
const EXE = path.resolve("D:/claude code pet/Clawd on Desk/Clawd on Desk.exe");

function log(msg) { console.log(`[Disable] ${msg}`); }

// ── Step 1: Kill Clawd if running ──
log("Stopping Clawd on Desk...");
try { execSync('taskkill /f /im "Clawd on Desk.exe" 2>nul', { stdio: "ignore" }); } catch {}
setTimeout(() => proceed(), 1500);

function proceed() {
  try {
    // ── Step 2: Remove patched app/ directory ──
    if (fs.existsSync(APP_DIR)) {
      fs.rmSync(APP_DIR, { recursive: true, force: true });
      log("Removed patched app/ directory");
    } else {
      log("No app/ directory found (already clean)");
    }

    // ── Step 3: Restore app.asar ──
    if (fs.existsSync(ASAR_DISABLED)) {
      if (fs.existsSync(ASAR)) {
        fs.unlinkSync(ASAR);
        log("Removed stale app.asar");
      }
      fs.renameSync(ASAR_DISABLED, ASAR);
      log("app.asar.disabled → app.asar (original restored)");
    } else {
      log("app.asar already in place");
    }

    // ── Done ──
    log("Mod disabled. Original Clawd restored.");

    // Restart
    spawn(EXE, [], { detached: true, stdio: "ignore" }).unref();
    log("Clawd on Desk restarted.");

    setTimeout(() => process.exit(0), 1000);
  } catch (err) {
    console.error("[Disable] FAILED:", err.message);
    process.exit(1);
  }
}
