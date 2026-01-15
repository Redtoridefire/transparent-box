const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

let mainWindow;
let isFrameless = true;

const createWindow = () => {
  if (mainWindow) {
    mainWindow.close();
  }

  mainWindow = new BrowserWindow({
    width: 1100,
    height: 760,
    transparent: true,
    backgroundColor: "#00000000",
    alwaysOnTop: true,
    frame: !isFrameless ? true : false,
    titleBarStyle: isFrameless ? "hidden" : "default",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  mainWindow.setAlwaysOnTop(true, "floating");
  mainWindow.loadFile("index.html");
};

app.whenReady().then(() => {
  createWindow();

  ipcMain.handle("toggle-frame", () => {
    isFrameless = !isFrameless;
    createWindow();
    return isFrameless;
  });

  ipcMain.handle("get-frame-state", () => isFrameless);

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
