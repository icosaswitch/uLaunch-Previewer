const {app, Menu, BrowserWindow, ipcMain, screen, globalShortcut} = require('electron');
const path = require('path');
const url = require('url');
const ejse = require('ejs-electron');
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = true;

let frame;

app.disableHardwareAcceleration();

app.on("ready", async () => {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  let w = 1810,
  h = 800;

  if(width <= 1860){
    w = parseInt((1810*width)/1920);
  } if(height <= 850){
    h = parseInt((800*height)/1080);
  }

  ipcMain.on("getSize", async (event, arg, data) => {
    event.sender.send('setSize', {w,h});
  });

  frame = new BrowserWindow({
    width: w,
    height: h,
    minWidth: w,
    minHeight: h,
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
