const {app, Menu, BrowserWindow, ipcMain, screen, globalShortcut} = require('electron');
const path = require('path');
const url = require('url');
const ejse = require('ejs-electron');
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = true;

let frame;

app.disableHardwareAcceleration();

/* the binary Great Common Divisor calculator */
function gcd (u, v) {
    if (u === v) return u;
    if (u === 0) return v;
    if (v === 0) return u;

    if (~u & 1)
        if (v & 1)
            return gcd(u >> 1, v);
        else
            return gcd(u >> 1, v >> 1) << 1;

    if (~v & 1) return gcd(u, v >> 1);

    if (u > v) return gcd((u - v) >> 1, v);

    return gcd((v - u) >> 1, u);
}

/* returns an array with the ratio */
function ratio (w, h) {
	var d = gcd(w,h);
	return [w/d, h/d];
}

app.on("ready", async () => {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize

  let w = parseInt((1810*width)/1920);
  let h = parseInt((800*height)/1040);

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
