const {app, Menu, BrowserWindow, globalShortcut} = require('electron');
const path = require('path');
const url = require('url');
const ejse = require('ejs-electron');
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = true;

let frame;

app.disableHardwareAcceleration();

app.on("ready", () => {
  frame = new BrowserWindow({
    width: 1810,
    height: 800,
    minWidth: 1810,
    minHeight: 800,
    frame: false,
    transparent: true,
    resizable: false,
    maximizable: false,
    backgroundColor: "#00FFFFFF",
    fullscreen: false,
    icon: getPlatformIcon('icon'),
    webPreferences: {
        nodeIntegration: true
    }
  });

  //frame.webContents.openDevTools({mode: "detach"});

  frame.loadURL(url.format({
    pathname: path.join(__dirname, 'app', 'app.ejs'),
    protocol: 'file:',
    slashes: true
  }));

  frame.on('closed', () => {
    frame = null;
  });
});

function getPlatformIcon(filename) {
    const os = process.platform;
    if(os === 'darwin') {
        filename = filename + '.icns';
    }
    else if(os === 'win32') {
        filename = filename + '.ico';
    }
    else {
        filename = filename + '.png';
    }
    return path.join(__dirname, 'build', filename);
}
