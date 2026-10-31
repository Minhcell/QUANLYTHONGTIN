// Sổ Thuê Bao - bản PC (Electron, chạy offline)
const { app, BrowserWindow, ipcMain, dialog, shell, Menu } = require("electron");
const path = require("path");
const fs = require("fs");

const DATA_DIR_NAME = "SoThueBao_DuLieu";
const DATA_FILE = "thuebao.json";
const CONFIG_NAME = "SoThueBao.config.json";

// Thư mục chứa file exe (bản portable chạy từ thư mục tạm nên dùng biến PORTABLE_EXECUTABLE_DIR)
const exeDir = process.env.PORTABLE_EXECUTABLE_DIR || path.dirname(app.getPath("exe"));
let dataDir = null;

function isDir(p) { try { return fs.statSync(p).isDirectory(); } catch { return false; } }
function readJson(p) { try { return JSON.parse(fs.readFileSync(p, "utf8")); } catch { return null; } }

function findDataDir() {
  // 1. Thư mục dữ liệu nằm cùng chỗ với exe (trường hợp copy sang máy khác)
  const besideExe = path.join(exeDir, DATA_DIR_NAME);
  if (isDir(besideExe)) return besideExe;
  // 2. exe đặt ngay bên trong thư mục dữ liệu
  if (fs.existsSync(path.join(exeDir, DATA_FILE))) return exeDir;
  // 3. Cấu hình đã lưu khi chọn lần đầu
  for (const cfgPath of [path.join(exeDir, CONFIG_NAME), path.join(app.getPath("userData"), CONFIG_NAME)]) {
    const cfg = readJson(cfgPath);
    if (cfg && cfg.dataDir && isDir(cfg.dataDir)) return cfg.dataDir;
  }
  return null;
}

function resolveChosen(folder) {
  if (path.basename(folder) === DATA_DIR_NAME || fs.existsSync(path.join(folder, DATA_FILE))) return folder;
  return path.join(folder, DATA_DIR_NAME);
}

function writeAtomic(file, data) {
  const tmp = file + ".tmp";
  fs.writeFileSync(tmp, data);
  if (fs.existsSync(file)) { try { fs.copyFileSync(file, file + ".bak"); } catch {} }
  fs.renameSync(tmp, file);
}

function safeName(n) { return String(n).replace(/[\\/:*?"<>|]/g, "_").slice(0, 180); }

ipcMain.handle("store:status", () => ({
  platform: "pc",
  configured: !!dataDir,
  folder: dataDir,
  suggest: path.join(exeDir, DATA_DIR_NAME)
}));

ipcMain.handle("store:choose", async (e) => {
  const win = BrowserWindow.fromWebContents(e.sender);
  const r = await dialog.showOpenDialog(win, {
    title: "Chọn nơi lưu dữ liệu Sổ Thuê Bao",
    defaultPath: exeDir,
    properties: ["openDirectory", "createDirectory"]
  });
  if (r.canceled || !r.filePaths[0]) return null;
  const folder = resolveChosen(r.filePaths[0]);
  return { folder, hasData: fs.existsSync(path.join(folder, DATA_FILE)) };
});

ipcMain.handle("store:confirm", (e, folder) => {
  try {
    const dir = resolveChosen(folder || path.join(exeDir, DATA_DIR_NAME));
    fs.mkdirSync(dir, { recursive: true });
    for (const sub of ["TepDaNhap", "BaoCao"]) fs.mkdirSync(path.join(dir, sub), { recursive: true });
    if (!fs.existsSync(path.join(dir, DATA_FILE))) writeAtomic(path.join(dir, DATA_FILE), JSON.stringify({ ungDung: "SoThueBao", phienBan: 1, thueBao: [] }));
    const cfg = JSON.stringify({ dataDir: dir }, null, 2);
    try { fs.writeFileSync(path.join(exeDir, CONFIG_NAME), cfg); } catch {}
    try { fs.mkdirSync(app.getPath("userData"), { recursive: true }); fs.writeFileSync(path.join(app.getPath("userData"), CONFIG_NAME), cfg); } catch {}
    dataDir = dir;
    return { folder: dir };
  } catch (err) {
    return { error: err.message };
  }
});

ipcMain.handle("store:load", () => {
  if (!dataDir) return "";
  const f = path.join(dataDir, DATA_FILE);
  if (fs.existsSync(f)) return fs.readFileSync(f, "utf8");
  if (fs.existsSync(f + ".bak")) return fs.readFileSync(f + ".bak", "utf8");
  return "";
});

ipcMain.handle("store:save", (e, text) => {
  if (!dataDir) throw new Error("Chưa chọn thư mục dữ liệu");
  writeAtomic(path.join(dataDir, DATA_FILE), text);
  return "ok";
});

ipcMain.handle("store:saveFile", (e, sub, name, b64) => {
  if (!dataDir) throw new Error("Chưa chọn thư mục dữ liệu");
  const dir = path.join(dataDir, safeName(sub));
  fs.mkdirSync(dir, { recursive: true });
  const p = path.join(dir, safeName(name));
  fs.writeFileSync(p, Buffer.from(b64, "base64"));
  return p;
});

ipcMain.handle("store:reveal", (e, p) => { if (p) shell.showItemInFolder(p); return true; });

function createWindow() {
  const win = new BrowserWindow({
    width: 1280, height: 820, minWidth: 380, minHeight: 500,
    title: "Sổ Thuê Bao",
    backgroundColor: "#f2f5f7",
    autoHideMenuBar: true,
    webPreferences: { preload: path.join(__dirname, "preload.js"), contextIsolation: true, nodeIntegration: false, spellcheck: false }
  });
  win.webContents.setWindowOpenHandler(() => ({ action: "deny" }));
  win.webContents.on("will-navigate", (ev) => ev.preventDefault());
  win.loadFile(path.join(__dirname, "web", "index.html"));
}

app.whenReady().then(() => {
  Menu.setApplicationMenu(null);
  dataDir = findDataDir();
  createWindow();
});
app.on("window-all-closed", () => app.quit());
