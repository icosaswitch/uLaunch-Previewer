const $ = require('jquery');
const fs = require('fs');
const ejs = require('ejs');
const path = require('path');
const url = require('url');
const {Howler} = require('howler');
const platformFolder = require("platform-folders");
const {getCurrentWindow} = require("electron").remote;
let documents = platformFolder.getDocumentsFolder();
const html2canvas = require("html2canvas");
let ui = path.join(__dirname, "theme", "ui");
let manifest;
let emitter = require('events').EventEmitter;
let switchem = new emitter();
switchem.setMaxListeners(Infinity);
let istyping = false;
$(function() {
  $.fn.ctrlCmd = function(key) {
    var allowDefault = true;
    if (!$.isArray(key)) {
      key = [key];
    }
    return this.keydown(function(e) {
      for (var i = 0, l = key.length; i < l; i++) {
        if(e.keyCode === key[i].toUpperCase().charCodeAt(0) && e.metaKey) {
          allowDefault = false;
        }
      };
      return allowDefault;
    });
  };
  $.fn.disableSelection = function() {
    this.ctrlCmd(['a', 'c']);
    return this.attr('unselectable', 'on')
     .css({'-moz-user-select':'-moz-none',
           '-moz-user-select':'none',
           '-o-user-select':'none',
           '-khtml-user-select':'none',
           '-webkit-user-select':'none',
           '-ms-user-select':'none',
           'user-select':'none'})
     .bind('selectstart', false)
     .on('mousedown', false);
  };
  let keysdown = {};
  $(document).keydown(function(e){
    if(keysdown[e.which] || istyping) return;
    keysdown[e.which] = true;
    if(e.which === 80){
      power();
    } if(e.which === 38){
      arrowup();
      e.preventDefault();
    } if(e.which === 40){
      arrowdown();
      e.preventDefault();
    } if(e.which === 37){
      arrowleft();
      e.preventDefault();
    } if(e.which === 39){
      arrowright();
      e.preventDefault();
    } if(e.which === 107){
      volp();
      e.preventDefault();
    } if(e.which === 109){
      volm();
      e.preventDefault();
    }
    $(this).on('keyup', function() {
      delete keysdown[e.which];
    });
  });
  $("#plus").click(() => {
    plus();
  });
  $("#pluss").click(() => {
    plus();
  });
  $("#plusss").click(() => {
    plus();
  });
  $("#minus").click(() => {
    minus();
  });
  $("#arrowup").click(() => {
    arrowup();
  });
  $("#arrowdown").click(() => {
    arrowdown();
  });
  $("#arrowleft").click(() => {
    arrowleft();
  });
  $("#arrowright").click(() => {
    arrowright();
  });
  $("#capturebg").click(() => {
    capture();
  });
  $("#capture").click(() => {
    capture();
  });
  $("#l").click(() => {
    l();
  });
  $("#a").click(() => {
    a();
  });
  $("#b").click(() => {
    b();
  });
  $("#x").click(() => {
    x();
  });
  $("#y").click(() => {
    y();
  });
  $("#home").click(() => {
    home();
  });
  $("#r").click(() => {
    r();
  });
  $("#volp").click(() => {
    volp();
  });
  $("#volm").click(() => {
    volm();
  });
  $("#power").click(() => {
    power();
  });
  $('#ltop').on('mousedown', function() {
    document.getElementById("ljoybutton").setAttribute("style", "position:relative;top:0;left:-20");
    ltopstart();
  }).on('mouseup mouseleave', function() {
    document.getElementById("ljoybutton").setAttribute("style", "position:relative;top:20;left:-20");
    ltopstop();
  });
  $('#ltopleft').on('mousedown', function() {
    document.getElementById("ljoybutton").setAttribute("style", "position:relative;top:0;left:-40");
    ltopleftstart();
  }).on('mouseup mouseleave', function() {
    document.getElementById("ljoybutton").setAttribute("style", "position:relative;top:20;left:-20");
    ltopleftstop();
  });
  $('#lleft').on('mousedown', function() {
    document.getElementById("ljoybutton").setAttribute("style", "position:relative;top:20;left:-40");
    lleftstart();
  }).on('mouseup mouseleave', function() {
    document.getElementById("ljoybutton").setAttribute("style", "position:relative;top:20;left:-20");
    lleftstop();
  });
  $('#lleftbottom').on('mousedown', function() {
    document.getElementById("ljoybutton").setAttribute("style", "position:relative;top:40;left:-40");
    lleftbottomstart();
  }).on('mouseup mouseleave', function() {
    document.getElementById("ljoybutton").setAttribute("style", "position:relative;top:20;left:-20");
    lleftbottomstop();
  });
  $('#lbottom').on('mousedown', function() {
    document.getElementById("ljoybutton").setAttribute("style", "position:relative;top:40;left:-20");
    lbottomstart();
  }).on('mouseup mouseleave', function() {
    document.getElementById("ljoybutton").setAttribute("style", "position:relative;top:20;left:-20");
    lbottomstop();
  });
  $('#lbottomright').on('mousedown', function() {
    document.getElementById("ljoybutton").setAttribute("style", "position:relative;top:40;left:0");
    lbottomrightstart();
  }).on('mouseup mouseleave', function() {
    document.getElementById("ljoybutton").setAttribute("style", "position:relative;top:20;left:-20");
    lbottomrightstop();
  });
  $('#lright').on('mousedown', function() {
    document.getElementById("ljoybutton").setAttribute("style", "position:relative;top:20;left:0");
    lrightstart();
  }).on('mouseup mouseleave', function() {
    document.getElementById("ljoybutton").setAttribute("style", "position:relative;top:20;left:-20");
    lrightstop();
  });
  $('#lrighttop').on('mousedown', function() {
    document.getElementById("ljoybutton").setAttribute("style", "position:relative;top:0;left:0");
    lrighttopstart();
  }).on('mouseup mouseleave', function() {
    document.getElementById("ljoybutton").setAttribute("style", "position:relative;top:20;left:-20");
    lrighttopstop();
  });
  $('#rtop').on('mousedown', function() {
    document.getElementById("rjoybutton").setAttribute("style", "position:relative;top:0;left:-20");
    rtopstart();
  }).on('mouseup mouseleave', function() {
    document.getElementById("rjoybutton").setAttribute("style", "position:relative;top:20;left:-20");
    rtopstop();
  });
  $('#rtopleft').on('mousedown', function() {
    document.getElementById("rjoybutton").setAttribute("style", "position:relative;top:0;left:-40");
    rtopleftstart();
  }).on('mouseup mouseleave', function() {
    document.getElementById("rjoybutton").setAttribute("style", "position:relative;top:20;left:-20");
    rtopleftstop();
  });
  $('#rleft').on('mousedown', function() {
    document.getElementById("rjoybutton").setAttribute("style", "position:relative;top:20;left:-40");
    rleftstart();
  }).on('mouseup mouseleave', function() {
    document.getElementById("rjoybutton").setAttribute("style", "position:relative;top:20;left:-20");
    rleftstop();
  });
  $('#rleftbottom').on('mousedown', function() {
    document.getElementById("rjoybutton").setAttribute("style", "position:relative;top:40;left:-40");
    rleftbottomstart();
  }).on('mouseup mouseleave', function() {
    document.getElementById("rjoybutton").setAttribute("style", "position:relative;top:20;left:-20");
    rleftbottomstop();
  });
  $('#rbottom').on('mousedown', function() {
    document.getElementById("rjoybutton").setAttribute("style", "position:relative;top:40;left:-20");
    rbottomstart();
  }).on('mouseup mouseleave', function() {
    document.getElementById("rjoybutton").setAttribute("style", "position:relative;top:20;left:-20");
    rbottomstop();
  });
  $('#rbottomright').on('mousedown', function() {
    document.getElementById("rjoybutton").setAttribute("style", "position:relative;top:40;left:0");
    rbottomrightstart();
  }).on('mouseup mouseleave', function() {
    document.getElementById("rjoybutton").setAttribute("style", "position:relative;top:20;left:-20");
    rbottomrightstop();
  });
  $('#rright').on('mousedown', function() {
    document.getElementById("rjoybutton").setAttribute("style", "position:relative;top:20;left:0");
    rrightstart();
  }).on('mouseup mouseleave', function() {
    document.getElementById("rjoybutton").setAttribute("style", "position:relative;top:20;left:-20");
    rrightstop();
  });
  $('#rrighttop').on('mousedown', function() {
    document.getElementById("rjoybutton").setAttribute("style", "position:relative;top:0;left:0");
    rrighttopstart();
  }).on('mouseup mouseleave', function() {
    document.getElementById("rjoybutton").setAttribute("style", "position:relative;top:20;left:-20");
    rrighttopstop();
  });
  $('#a').disableSelection();
  $('#b').disableSelection();
  $('#y').disableSelection();
  $('#x').disableSelection();
  init();
})

let Timer = function(callback, delay) {
    var timerId, start, remaining = delay;
    this.stop = function() {
      window.clearTimeout(timerId);
      remaining = delay;
    };
    this.pause = function() {
      window.clearTimeout(timerId);
      remaining -= Date.now() - start;
    };
    this.resume = function() {
      start = Date.now();
      window.clearTimeout(timerId);
      timerId = window.setTimeout(callback, remaining);
    };
    this.resume();
};
let fadetimeout = undefined;
let sound = undefined;
let titlelaunch = undefined;
let menutoggle = undefined;
let testersettings;

async function init(){
  if(!fs.existsSync(path.join(documents, "uLaunch-Previewer"))){
    fs.mkdirSync(path.join(documents, "uLaunch-Previewer"));
  }
  let ulaunchtester = path.join(documents, "uLaunch-Previewer");
  if(!fs.existsSync(path.join(ulaunchtester, "sdmc"))){
    fs.mkdirSync(path.join(ulaunchtester, "sdmc"));
  } if(!fs.existsSync(path.join(ulaunchtester, "sdmc", "ulaunch"))){
    fs.mkdirSync(path.join(ulaunchtester, "sdmc", "ulaunch"));
  } if(!fs.existsSync(path.join(ulaunchtester, "sdmc", "ulaunch", "entries"))){
    fs.mkdirSync(path.join(ulaunchtester, "sdmc", "ulaunch", "entries"));
  } if(!fs.existsSync(path.join(ulaunchtester, "sdmc", "ulaunch", "lang"))){
    fs.mkdirSync(path.join(ulaunchtester, "sdmc", "ulaunch", "lang"));
  } if(!fs.existsSync(path.join(ulaunchtester, "sdmc", "ulaunch", "themes"))){
    fs.mkdirSync(path.join(ulaunchtester, "sdmc", "ulaunch", "themes"));
  } if(!fs.existsSync(path.join(ulaunchtester, "testersettings"))){
    fs.mkdirSync(path.join(ulaunchtester, "testersettings"));
  } if(!fs.existsSync(path.join(ulaunchtester, "testersettings", "users.json"))){
    fs.writeFileSync(path.join(ulaunchtester, "testersettings", "users.json"), JSON.stringify([{"username": "Default User", "usericon": "default", "password": false}], null, 2), function(err){if(err) throw err;});
  } if(!fs.existsSync(path.join(ulaunchtester, "testersettings", "ulaunch.json"))){
    fs.writeFileSync(path.join(ulaunchtester, "testersettings", "ulaunch.json"), JSON.stringify({"skipstartup":false,"isthemerestart":false,"volume":1,"currenttheme":"default","lang":"en-US","connected":false,"charging":false,"time":"auto","battery":"100%","firmware":"9.0.0","consolename":"uLaunchPreviewer","viewer_enabled":"False","flog_enabled":"False","console_info_upload":"False","auto_titles_dl":"False","auto_update":"False","wireless_lan":"False","usb_30":"True","bluetooth":"False","nfc":"False"}, null, 2), function(err){if(err) throw err;});
  } if(!fs.existsSync(path.join(ulaunchtester, "testersettings", "menuitems.json"))){
    fs.writeFileSync(path.join(ulaunchtester, "testersettings", "menuitems.json"), JSON.stringify({"folders":{},"hb":[]}, null, 2), function(err){if(err) throw err;});
  } if(!fs.existsSync(path.join(ulaunchtester, "screenshot"))){
    fs.mkdirSync(path.join(ulaunchtester, "screenshot"));
  }
  switchem.on("capture", () => {
    html2canvas(document.getElementById("switchcontainer"), {
        width: 1280,
        height: 720
    }).then(canvas => {
      canvas.setAttribute("style", "width:1280;height:720;display: none;");
      document.body.appendChild(canvas);
      let img = $("canvas").get(0).toDataURL();
      let data = img.replace(/^data:image\/\w+;base64,/, "");
      let buf = Buffer.from(data, 'base64');
      let date = new Date();
      let nums = [];
      for(var i=1; i<61; i++){
        nums.push((i.toString().length == 1) ? `0${i}` : `${i}`);
      }
      let filename = `${date.getFullYear()}-${nums[date.getMonth()]}-${nums[date.getDay()]} ${nums[date.getHours()]}-${nums[date.getMinutes()]}-${nums[date.getSeconds()]}.png`;
      fs.writeFileSync(path.join(ulaunchtester, "screenshot", filename), buf, (err) => {if(err) throw err});
      document.body.removeChild(canvas);
    });
  });
  document.getElementById("switchcontainer").innerHTML = `<div id="ulaunchscreen"></div>`
  testersettings = require(path.join(ulaunchtester, "testersettings", "ulaunch.json"));
  let currenttheme = testersettings.currenttheme;
  let user;
  let timeout = null;
  document.getElementById("setvol").setAttribute("style", document.getElementById("setvol").getAttribute("style").replace(`width:300`, `width:${testersettings.volume*300}`));
  let vnum = 15;
  switchem.on("volp", () => {
    clearTimeout(timeout);
    var HTMLvolume = parseFloat(document.getElementById("setvol").getAttribute("style").split("width:")[1].split(";")[0].replace("px", ""));
    if(HTMLvolume/300 >= 1){
      $("#vol").fadeTo(100, 1, function(){
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          $("#vol").fadeTo(100, 0);
        }, 3000);
      });
      Howler.volume(1);
      testersettings.volume = 1;
      fs.writeFileSync(path.join(ulaunchtester, "testersettings", "ulaunch.json"), JSON.stringify(testersettings, null, 2), function(err){if(err) throw err;});
    } else {
      document.getElementById("setvol").setAttribute("style", document.getElementById("setvol").getAttribute("style").replace(`width: ${HTMLvolume}`, `width: ${HTMLvolume+vnum}`).replace(`width:${HTMLvolume}`, `width:${HTMLvolume+vnum}`));
      $("#vol").fadeTo(100, 1, function(){
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          $("#vol").fadeTo(100, 0);
        }, 3000);
      });
      Howler.volume((HTMLvolume+vnum)/300);
      testersettings.volume = (HTMLvolume+vnum)/300;
      fs.writeFileSync(path.join(ulaunchtester, "testersettings", "ulaunch.json"), JSON.stringify(testersettings, null, 2), function(err){if(err) throw err;});
    }
  });
  switchem.on("volm", () => {
    clearTimeout(timeout);
    var HTMLvolume = parseInt(document.getElementById("setvol").getAttribute("style").split("width:")[1].split(";")[0].replace("px", ""));
    if(HTMLvolume/300 <= 0){
      $("#vol").fadeTo(100, 1, function(){
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          $("#vol").fadeTo(100, 0);
        }, 3000);
      });
      Howler.volume(0);
      testersettings.volume = 0;
      fs.writeFileSync(path.join(ulaunchtester, "testersettings", "ulaunch.json"), JSON.stringify(testersettings, null, 2), function(err){if(err) throw err;});
    } else {
      document.getElementById("setvol").setAttribute("style", document.getElementById("setvol").getAttribute("style").replace(`width: ${HTMLvolume}`, `width: ${HTMLvolume-vnum}`).replace(`width:${HTMLvolume}`, `width:${HTMLvolume-vnum}`));
      $("#vol").fadeTo(100, 1, function(){
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          $("#vol").fadeTo(100, 0);
        }, 3000);
      });
      Howler.volume((HTMLvolume-vnum)/300);
      testersettings.volume = (HTMLvolume-vnum)/300;
      fs.writeFileSync(path.join(ulaunchtester, "testersettings", "ulaunch.json"), JSON.stringify(testersettings, null, 2), function(err){if(err) throw err;});
    }
  });
  let defaultui;
  if(currenttheme !== "default"){
    if(fs.existsSync(path.join(ulaunchtester, "sdmc", "ulaunch", "themes", currenttheme))){
      defaultui = path.join(ulaunchtester, "sdmc", "ulaunch", "themes", currenttheme, "ui");
      if(fs.existsSync(path.join(ulaunchtester, "sdmc", "ulaunch", "themes", currenttheme, "sound", "BGM.mp3"))){
        let bgm;
        let defbgm = require(path.join(__dirname, "ulaunch", "romFs", "default", "sound", "BGM.json"));
        if(fs.existsSync(path.join(ulaunchtester, "sdmc", "ulaunch", "themes", currenttheme, "sound", "BGM.json"))){
          bgm = require(path.join(ulaunchtester, "sdmc", "ulaunch", "themes", currenttheme, "sound", "BGM.json"));
          if(bgm.loop === undefined){
            bgm.loop = defbgm.loop;
          } if(bgm.fade_in_ms === undefined){
            bgm.fade_in_ms = defbgm.fade_in_ms;
          } if(bgm.fade_out_ms === undefined){
            bgm.fade_out_ms = defbgm.fade_out_ms;
          }
        } else {
          bgm = defbgm;
        }
        sound = new Howl({
          src: [path.join(ulaunchtester, "sdmc", "ulaunch", "themes", currenttheme, "sound", "BGM.mp3")],
          autoplay: true,
          loop: bgm.loop
        });
        sound.on('load', () => {
          Howler.volume(testersettings.volume);
          fade(sound.duration());
        });
        let fadein = parseFloat(bgm.fade_in_ms);
        let fadeout = parseFloat(bgm.fade_out_ms);
        if(isNaN(fadein)){
          fadein = 0;
        } if(isNaN(fadeout)){
          fadeout = 0;
        }
        function fade(duration){
          sound.fade(0,1,fadein);
          fadetimeout = new Timer(() => {
            sound.fade(1,0,fadeout);
            setTimeout(() => {
              if(bgm.loop) fade(duration);
            }, fadeout);
          }, duration*1000-fadeout);
        }
      } if(fs.existsSync(path.join(ulaunchtester, "sdmc", "ulaunch", "themes", currenttheme, "sound", "TitleLaunch.wav"))){
        titlelaunch = new Howl({
          src: [path.join(ulaunchtester, "sdmc", "ulaunch", "themes", currenttheme, "sound", "TitleLaunch.wav")],
          autoplay: false,
          loop: false
        });
        titlelaunch.on('load', () => {
          Howler.volume(testersettings.volume);
        });
      } if(fs.existsSync(path.join(ulaunchtester, "sdmc", "ulaunch", "themes", currenttheme, "sound", "MenuToggle.wav"))){
        menutoggle = new Howl({
          src: [path.join(ulaunchtester, "sdmc", "ulaunch", "themes", currenttheme, "sound", "MenuToggle.wav")],
          autoplay: false,
          loop: false
        });
        menutoggle.on('load', () => {
          Howler.volume(testersettings.volume);
        });
      }
    } else {
      defaultui = path.join(__dirname, "ulaunch", "romFs", "default", "ui");
      testersettings.currenttheme = "default";
      fs.writeFileSync(path.join(ulaunchtester, "testersettings", "ulaunch.json"), JSON.stringify(testersettings, null, 2), function(err){if(err) throw err;});
    }
  } else {
    defaultui = path.join(__dirname, "ulaunch", "romFs", "default", "ui");
  }
  let suspended;
  let romfsui = path.join(__dirname, "ulaunch", "romFs", "default", "ui");
  let Languages = {
      ja: "Japanese",
      "en-US": "American English",
      fr: "Français",
      de: "Deutsch",
      it: "Italiano",
      es: "Español",
      "zh-CN": "Chinese",
      ko: "Korean",
      nl: "Nederlands",
      pt: "Português",
      ru: "Русский",
      "zh-TW": "Taiwanese",
      "en-GB": "British English",
      "fr-CA": "Français canadien",
      "es-419": "Español latino",
      "zn-Hans": "Chinese (simplified)",
      "zn-Hant": "Chinese (traditional)"
  };
  let lang = InitializeLang(testersettings.lang, Languages);
  let uijson = InitializeUIJson(require(existsUI("UI.json", defaultui, romfsui)));
  $(document.head).append("<style>@font-face {font-family: 'Font';font-style: normal;src: url('"+existsUI("Font.ttf", defaultui, romfsui).replace(/\\/g, "/")+"');}</style>");
  let defaulticon = {
    albumicon: existsUI("AlbumIcon.png", defaultui, romfsui),
    background: existsUI("Background.png", defaultui, romfsui),
    bannerfolder: existsUI("BannerFolder.png", defaultui, romfsui),
    bannerhomebrew: existsUI("BannerHomebrew.png", defaultui, romfsui),
    bannerinstalled: existsUI("BannerInstalled.png", defaultui, romfsui),
    bannertheme: existsUI("BannerTheme.png", defaultui, romfsui),
    batterychargingicon: existsUI("BatteryChargingIcon.png", defaultui, romfsui),
    batterynormalicon: existsUI("BatteryNormalIcon.png", defaultui, romfsui),
    connectionicon: existsUI("ConnectionIcon.png", defaultui, romfsui),
    controllericon: existsUI("ControllerIcon.png", defaultui, romfsui),
    cursor: existsUI("Cursor.png", defaultui, romfsui),
    folder: existsUI("Folder.png", defaultui, romfsui),
    hbmenu: existsUI("Hbmenu.png", defaultui, romfsui),
    helpicon: existsUI("HelpIcon.png", defaultui, romfsui),
    multiselect: existsUI("Multiselect.png", defaultui, romfsui),
    noconnectionicon: existsUI("NoConnectionIcon.png", defaultui, romfsui),
    powericon: existsUI("PowerIcon.png", defaultui, romfsui),
    quickmenumain: existsUI("QuickMenuMain.png", defaultui, romfsui),
    settingeditable: existsUI("SettingEditable.png", defaultui, romfsui),
    settingnoeditable: existsUI("SettingNoEditable.png", defaultui, romfsui),
    settingsicon: existsUI("SettingsIcon.png", defaultui, romfsui),
    suspended: existsUI("Suspended.png", defaultui, romfsui),
    themesicon: existsUI("ThemesIcon.png", defaultui, romfsui),
    toggleclick: existsUI("ToggleClick.png", defaultui, romfsui),
    topmenu: existsUI("TopMenu.png", defaultui, romfsui),
    usericon: existsUI("UserIcon.png", defaultui, romfsui),
    webicon: existsUI("WebIcon.png", defaultui, romfsui),
  }
  let size = await InitializeSize({
    albumicon: {w: 50,h: 50},
    background: {w: 1280,h: 720},
    bannerfolder: {w: 1280,h: 135},
    bannerhomebrew: {w: 1280,h: 135},
    bannerinstalled: {w: 1280,h: 135},
    bannertheme: {w: 1280,h: 135},
    batterychargingicon: {w: 30,h: 30},
    batterynormalicon: {w: 30,h: 30},
    connectionicon: {w: 50,h: 50},
    controllericon: {w: 50,h: 50},
    cursor: {w: 296,h: 296},
    folder: {w: 256,h: 256},
    hbmenu: {w: 256,h: 256},
    helpicon: {w: 50,h: 50},
    multiselect: {w: 296,h: 296},
    noconnectionicon: {w: 50,h: 50},
    powericon: {w: 50,h: 50},
    quickmenumain: {w: 300,h: 300},
    settingeditable: {w: 100,h: 100},
    settingnoeditable: {w: 100,h: 100},
    settingsicon: {w: 50,h: 50},
    suspended: {w: 296,h: 296},
    themesicon: {w: 50,h: 50},
    toggleclick: {w: 240,h: 70},
    topmenu: {w: 1200,h: 85},
    usericon: {w: 50,h: 50},
    webicon: {w: 50,h: 50},
  }, defaulticon, uijson);
  function startup(logoff){
    return new Promise(function(resolve, reject) {
      let res = false;
      let selected = 0;
      let max = 0;
      let down,leftclick;
      let users = require(path.join(ulaunchtester, "testersettings", "users.json"));
      if((testersettings.skipstartup || testersettings.isthemerestart) && !logoff){
        if(testersettings.isthemerestart) {
          testersettings.isthemerestart = false;
          fs.writeFileSync(path.join(ulaunchtester, "testersettings", "ulaunch.json"), JSON.stringify(testersettings, null, 2), function(err){if(err) throw err;});
          ShowNotification(lang["theme_changed"], uijson);
        }
        user = users[0];
        if(user === undefined){
          user = {"username": "Default User", "usericon": "default", "password": false}
        }
        mainmenu();
        resolve();
      } else {
        document.getElementById("ulaunchscreen").innerHTML = ejs.render(fs.readFileSync(path.join(__dirname, "ulaunch", "startup.ejs"), "utf8"), {defaulticon, lang, uijson, users, path});
        let inputs = $("#ulaunchscreen :input");
        max = inputs.length
        inputs.click((e) => {
          leftclick = true;
          click(e.currentTarget.id);
        });
        switchem.on("arrowdown", () => {
          leftclick = false;
          down = true;
          click(selected+1);
        });
        switchem.on("lbottomstart", () => {
          leftclick = false;
          down = true;
          click(selected+1);
        });
        switchem.on("rbottomstart", () => {
          leftclick = false;
          down = true;
          click(selected+1);
        });
        switchem.on("arrowup", () => {
          leftclick = false;
          down = false;
          click(selected-1);
        });
        switchem.on("ltopstart", () => {
          leftclick = false;
          down = false;
          click(selected-1);
        });
        switchem.on("rtopstart", () => {
          leftclick = false;
          down = false;
          click(selected-1);
        });
        switchem.on("a", () => {
          dblclick(selected);
        });
        switchem.on("plus", async () => {
          if(res) return;
          res = true;
          let ress = false;
          let dialog = await createDialog(lang["ulaunch_about"], `uLaunch v0.1<br><br>${lang["ulaunch_desc"]}:<br>https://github.com/XorTroll/uLaunch`, [lang["ok"]], false, path.join(__dirname, "ulaunch", "romFs", "LogoLarge.png"));
          $("#ulaunchscreen").append(dialog);
          let inputs = $("#dialog :input");
          let selected = 0;
          let max = inputs.length;
          switchem.on("a", () => {
            dblclick(selected);
          });
          inputs.dblclick((e) => {
            dblclick(e.currentTarget.id);
          });
          function dblclick(id){
            if(ress) return;
            ress = true;
            res = false;
            $("#dialog").remove();
          }
        });
        inputs.dblclick((e) => {
          dblclick(e.currentTarget.id);
        });
        function click(id){
          if(res) return;
          let input = document.getElementById(id+"g");
          let before = document.getElementById(selected+"g");
          if(input === null) return;
          selected = parseInt(id);
          before.setAttribute("style", before.getAttribute("style").replace(uijson["menu_focus_color"], uijson["menu_bg_color"]));
          input.setAttribute("style", input.getAttribute("style").replace(uijson["menu_bg_color"], uijson["menu_focus_color"]));
          if(leftclick) return;
          let scroll = document.getElementById("users").scrollTop;
          if(down){
            if(selected*100-400 < scroll) return;
            $(`#users`).animate({
                scrollTop: selected*100-400
            }, 0);
          } else {
            if(selected*100 > scroll) return;
            $(`#users`).animate({
                scrollTop: selected*100
            }, 0);
          }
        }
        function dblclick(id){
          if(res) return;
          let input = document.getElementById(id);
          if(users.length == parseInt(id)){
            users.push({
              "username": "New User",
              "usericon": "default",
              "password": false
            });
            fs.writeFileSync(path.join(ulaunchtester, "testersettings", "users.json"), JSON.stringify(users, null, 2), function(err){if(err) throw err;});
            startup(logoff);
            res = true;
            resolve();
          } else {
            user = users[id];
            mainmenu();
            res = true;
            resolve();
          }
        }
      }
    });
  }
  function mainmenu(){
    return new Promise(async function(resolve, reject) {
      let multiselect = [];
      let res = false;
      let interval = null;
      let logo = path.join(__dirname, "ulaunch", "romFs", "Logo.png");
      let gameimg = path.join(__dirname, "ulaunch", "game.png");
      let usericon = (user.usericon === "default") ? path.join(__dirname, "ulaunch", "User.png") : user.usericon;
      let games = require(path.join(__dirname, "ulaunch", "game", "games.json"));
      document.getElementById("ulaunchscreen").innerHTML = ejs.render(fs.readFileSync(path.join(__dirname, "ulaunch", "main.ejs"), "utf8"), {defaulticon, games, testersettings, uijson, logo, size, usericon, gameimg});
      if(suspended !== undefined){
        $("#suspendedimgg").show();
      }
      document.getElementById("in").innerHTML = games[0].name;
      document.getElementById("ia").innerHTML = games[0].author;
      document.getElementById("iv").innerHTML = games[0].version;
      if(testersettings.time === "auto"){
        let time = new Date();
        let minutes = [];
        let hours = [];
        for(var i=0; i<61; i++){
          minutes.push((i.toString().length == 1) ? "0"+i : i);
          if(i < 24){
            hours.push((i.toString().length == 1) ? "0"+i : i);
          }
        }
        let hour = hours[time.getHours()];
        let minute = minutes[time.getMinutes()];
        let times = `${hour}:${minute}`;
        document.getElementById("time").innerHTML = times;
        interval = setInterval(() => {
          time = new Date();
          hour = hours[time.getHours()];
          minute = minutes[time.getMinutes()];
          times = `${hour}:${minute}`;
          document.getElementById("time").innerHTML = times;
        }, 1);
      }
      $("#theme").click(() => {
        if(res) return;
        clearInterval(interval);
        if(multiselect.filter(n => n == true)[0]){
          multiselect = multiselect.map(n => false);
          $("#multiselect").hide();
          document.getElementById("multiselect").innerHTML = "";
          ShowNotification(lang["menu_multiselect_cancel"], uijson);
        }
        theme();
        res = true;
        resolve();
      });
      $("#setting").click(() => {
        if(res) return;
        clearInterval(interval);
        if(multiselect.filter(n => n == true)[0]){
          multiselect = multiselect.map(n => false);
          $("#multiselect").hide();
          document.getElementById("multiselect").innerHTML = "";
          ShowNotification(lang["menu_multiselect_cancel"], uijson);
        }
        settings();
        res = true;
        resolve();
      });
      $("#logo").click(() => {
        ulaunch();
      });
      switchem.on("plus", async () => {
        ulaunch();
      });
      async function ulaunch(){
        if(res) return;
        res = true;
        let ress = false;
        let dialog = await createDialog(lang["ulaunch_about"], `uLaunch v0.1<br><br>${lang["ulaunch_desc"]}:<br>https://github.com/XorTroll/uLaunch`, [lang["ok"]], false, path.join(__dirname, "ulaunch", "romFs", "LogoLarge.png"));
        $("#ulaunchscreen").append(dialog);
        let inputs = $("#dialog :input");
        let selected = 0;
        let max = inputs.length;
        switchem.on("a", () => {
          dblclick(selected);
        });
        inputs.dblclick((e) => {
          dblclick(e.currentTarget.id);
        });
        function dblclick(id){
          if(ress) return;
          ress = true;
          res = false;
          $("#dialog").remove();
        }
      }
      $("#user").click(async () => {
        if(res) return;
        res = true;
        let ress = false;
        let dialog = await createDialog(lang["user_settings"], `${lang["user_selected"]}: ${user.username}<br>${lang["user_option"]}`, [`${(user.password) ? lang["user_pass_ch"] : lang["user_pass_reg"]}`, lang["user_view_page"], lang["user_logoff"], lang["cancel"]], false, usericon);
        $("#ulaunchscreen").append(dialog);
        let inputs = $("#dialog :input");
        let selected = 0;
        let max = inputs.length;
        inputs.click((e) => {
          click(e.currentTarget.id);
        });
        switchem.on("arrowright", () => {
          click(selected+1);
        });
        switchem.on("lrightstart", () => {
          click(selected+1);
        });
        switchem.on("rrightstart", () => {
          click(selected+1);
        });
        switchem.on("arrowleft", () => {
          click(selected-1);
        });
        switchem.on("lleftstart", () => {
          click(selected-1);
        });
        switchem.on("rleftstart", () => {
          click(selected-1);
        });
        switchem.on("a", () => {
          dblclick(selected);
        });
        inputs.dblclick((e) => {
          dblclick(e.currentTarget.id);
        });
        function click(id){
          if(ress) return;
          let input = $(`#dialog #${id}`).get(0);
          let before = $(`#dialog #${selected}`).get(0);
          if(input === undefined) return;
          before.setAttribute("style", before.getAttribute("style").replace("#B4B4C8FF", "#B4B4C800"));
          input.setAttribute("style", input.getAttribute("style").replace("#B4B4C800", "#B4B4C8FF"));
          selected = parseInt(id);
        }
        function dblclick(id){
          if(ress) return;
          if(id == "2"){
            ress = true;
            clearInterval(interval);
            if(multiselect.filter(n => n == true)[0]){
              multiselect = multiselect.map(n => false);
              $("#multiselect").hide();
              document.getElementById("multiselect").innerHTML = "";
              ShowNotification(lang["menu_multiselect_cancel"], uijson);
            }
            $("#dialog").remove();
            startup(true);
          } else {
            ress = true;
            res = false;
            $("#dialog").remove();
          }
        }
      });
      switchem.on("l", () => {
        if(res) return;
        quickmenu();
      });
      switchem.on("r", () => {
        if(res) return;
        quickmenu();
      });
      async function quickmenu(){
        res = true;
        let quick = false;
        let html = `<div style="background-color: #3232327F;z-index:99;position:absolute;top:0;left:0;width:1280;height:720;" id="quickmenu">`;
        let MainItemSize = 300;
        let SubItemsSize = 150;
        let CommonAreaSize = 50;
        let MainItemX = (1280 - MainItemSize) / 2;
        let MainItemY = (720 - MainItemSize) / 2;
        html += `<img width="${MainItemSize}" height="${MainItemSize}" style="position:absolute;top:${MainItemY};left:${MainItemX};" src="${defaulticon.quickmenumain}"/>`;
        let item_map = [
          ["up", defaulticon.usericon],
          ["down", defaulticon.settingsicon],
          ["left", defaulticon.webicon],
          ["right", defaulticon.themesicon],
          ["upleft", defaulticon.controllericon],
          ["upright", defaulticon.albumicon],
          ["downleft", defaulticon.powericon],
          ["downright", defaulticon.helpicon]
        ]
        for(var i=0; i<item_map.length; i++){
          let item = item_map[i];
          await new Promise(function(resolve, reject) {
            let pos = ComputePositionForDirection(item[0]);
            let x = pos[0];
            let y = pos[1];
            let tex = item[1];
            let img = new Image();
            img.onload = () => {
              let texw = img.width;
              let texh = img.height;
              x += (SubItemsSize - texw) / 2;
              y += (SubItemsSize - texh) / 2;
              html += `<img width="${texw}" height="${texh}" style="position:absolute;top:${y};left:${x};color:rgb(150, 150, 200);" src="${tex}" id="img${i}"/>`;
              resolve();
            }
            img.src = tex;
          });
        };
        html += "</div>";
        $("#ulaunchscreen").append(html);
        let selected = 0;
        await SetTextureColorMod(item_map[0][1], "img0", 150, 150, 255);
        function ComputePositionForDirection(direction){
          let x = MainItemX;
          let y = MainItemY;
          switch(direction){
            case 'up':
              x += ((MainItemSize - SubItemsSize) / 2);
              y -= SubItemsSize;
              break
            case 'down':
              x += ((MainItemSize - SubItemsSize) / 2);
              y += MainItemSize;
              break;
            case 'left':
              x -= SubItemsSize;
              y += ((MainItemSize - SubItemsSize) / 2);
              break;
            case 'right':
              x += MainItemSize;
              y += ((MainItemSize - SubItemsSize) / 2);
              break;
            case 'upleft':
              x -= (SubItemsSize - CommonAreaSize);
              y -= (SubItemsSize - CommonAreaSize);
              break;
            case 'upright':
              x += (MainItemSize - CommonAreaSize);
              y -= (SubItemsSize - CommonAreaSize);
              break;
            case 'downleft':
              x -= (SubItemsSize - CommonAreaSize);
              y += (MainItemSize - CommonAreaSize);
              break;
            case 'downright':
              x += (MainItemSize - CommonAreaSize);
              y += (MainItemSize - CommonAreaSize);
              break;
            default:
              break;
          }
          return [x, y];
        }
        async function select(direction){
          if(quick) return;
          await SetTextureColorMod(item_map[selected][1], `img${selected}`, 255, 255, 255);
          switch(direction){
            case 'up':
              selected = 0;
              break
            case 'down':
              selected = 1;
              break;
            case 'left':
              selected = 2;
              break;
            case 'right':
              selected = 3;
              break;
            case 'upleft':
              selected = 4;
              break;
            case 'upright':
              selected = 5;
              break;
            case 'downleft':
              selected = 6;
              break;
            case 'downright':
              selected = 7;
              break;
            default:
              break;
          }
          await SetTextureColorMod(item_map[selected][1], `img${selected}`, 150, 150, 200);
        }
        switchem.on("ltopstart", () => {
          select("up");
        });
        switchem.on("rtopstart", () => {
          select("up");
        });
        switchem.on("lbottomstart", () => {
          select("down");
        });
        switchem.on("rbottomstart", () => {
          select("down");
        });
        switchem.on("lleftstart", () => {
          select("left");
        });
        switchem.on("rleftstart", () => {
          select("left");
        });
        switchem.on("lrightstart", () => {
          select("right");
        });
        switchem.on("rrightstart", () => {
          select("right");
        });
        switchem.on("ltopleftstart", () => {
          select("upleft");
        });
        switchem.on("rtopleftstart", () => {
          select("upleft");
        });
        switchem.on("lrighttopstart", () => {
          select("upright");
        });
        switchem.on("rrighttopstart", () => {
          select("upright");
        });
        switchem.on("lleftbottomstart", () => {
          select("downleft");
        });
        switchem.on("rleftbottomstart", () => {
          select("downleft");
        });
        switchem.on("lbottomrightstart", () => {
          select("downright");
        });
        switchem.on("rbottomrightstart", () => {
          select("downright");
        });
        switchem.on("arrowup", () => {
          select("up");
        });
        switchem.on("arrowdown", () => {
          select("down");
        });
        switchem.on("arrowleft", () => {
          select("left");
        });
        switchem.on("arrowright", () => {
          select("right");
        });
        switchem.on("b", () => {
          if(quick) return;
          res = false;
          quick = true;
          $("#quickmenu").remove();
        });
        switchem.on("a", async () => {
          if(quick) return;
          quick = true;
          $("#quickmenu").remove();
          if(selected == 0){
            res = false;
            $("#user").trigger("click");
          } else if(selected == 1){
            res = false;
            $("#setting").trigger("click");
          } else if(selected == 3){
            res = false;
            $("#theme").trigger("click");
          } else if(selected == 6){
            res = false;
            let ress = false;
            res = true;
            let dialog = await createDialog(lang["power_dialog"], lang["power_dialog_info"], [lang["power_sleep"],lang["power_power_off"],lang["power_reboot"],lang["cancel"]]);
            $("#ulaunchscreen").append(dialog);
            let inputs = $("#dialog :input");
            selected = 0;
            let max = inputs.length;
            inputs.click((e) => {
              click(e.currentTarget.id);
            });
            switchem.on("arrowright", () => {
              click(selected+1);
            });
            switchem.on("lrightstart", () => {
              click(selected+1);
            });
            switchem.on("rrightstart", () => {
              click(selected+1);
            });
            switchem.on("arrowleft", () => {
              click(selected-1);
            });
            switchem.on("lleftstart", () => {
              click(selected-1);
            });
            switchem.on("rleftstart", () => {
              click(selected-1);
            });
            switchem.on("a", () => {
              dblclick(selected);
            });
            inputs.dblclick((e) => {
              dblclick(e.currentTarget.id);
            });
            function click(id){
              if(ress) return;
              let input = $(`#dialog #${id}`).get(0);
              let before = $(`#dialog #${selected}`).get(0);
              if(input === undefined) return;
              before.setAttribute("style", before.getAttribute("style").replace("#B4B4C8FF", "#B4B4C800"));
              input.setAttribute("style", input.getAttribute("style").replace("#B4B4C800", "#B4B4C8FF"));
              selected = parseInt(id);
            }
            function dblclick(id){
              if(ress) return;
              if(id == 0){
                ress = true;
                res = false;
                $("#dialog").remove();
                power();
              } else if(id == 1){
                ress = true;
                res = false;
                $("#dialog").remove();
                getCurrentWindow().close();
              } else if(id == 2){
                ress = true;
                res = false;
                $("#dialog").remove();
                getCurrentWindow().loadURL(url.format({
                  pathname: path.join(__dirname, 'app.ejs'),
                  protocol: 'file:',
                  slashes: true
                }));
              } else {
                ress = true;
                res = false;
                $("#dialog").remove();
              }
            }
          } else if(selected == 7){
            res = false;
            let ress = false;
            res = true;
            let msg = "";
            msg += " - " + lang["help_launch"] + "<br>";
            msg += " - " + lang["help_close"] + "<br>";
            msg += " - " + lang["help_quick"] + "<br>";
            msg += " - " + lang["help_multiselect"] + "<br>";
            msg += " - " + lang["help_back"] + "<br>";
            msg += " - " + lang["help_minus"] + "<br>";
            msg += " - " + lang["help_plus"] + "<br>";
            let dialog = await createDialog(lang["help_title"], msg, [lang["ok"]]);
            $("#ulaunchscreen").append(dialog);
            let inputs = $("#dialog :input");
            selected = 0;
            let max = inputs.length;
            switchem.on("a", () => {
              dblclick(selected);
            });
            inputs.dblclick((e) => {
              dblclick(e.currentTarget.id);
            });
            function dblclick(id){
              if(ress) return;
              ress = true;
              res = false;
              $("#dialog").remove();
            }
          } else {
            res = false;
          }
        });
      }
      function lmenuitems(){
        return new Promise(async function(resolve, reject) {
          let ress = false;
          document.getElementById("bi").setAttribute("style", document.getElementById("bi").getAttribute("style").replace("hidden", uijson["main_menu"]["banner_image"]["visible"]))
          document.getElementById("bf").setAttribute("style", document.getElementById("bf").getAttribute("style").replace("visible", "hidden"));
          document.getElementById("bh").setAttribute("style", document.getElementById("bh").getAttribute("style").replace("visible", "hidden"));
          let menuitems = require(path.join(ulaunchtester, "testersettings", "menuitems.json"));
          let height = [size.cursor.h, size.multiselect.h, size.suspended.h].sort((a, b) => a > b)[0];
          let top = (height-256)/2;
          let left = 0;
          let n = -1;
          let cursor = (height-size.cursor.h)/2;
          let suspendedd = (height-size.suspended.h)/2;
          let multiselectt = (height-size.multiselect.h)/2;
          let items = [];
          let folders = menuitems.folders;
          let ifolders = [];
          let numf = Object.keys(folders);
          let ids = [];
          for(var i=0; i<numf.length; i++){
            n += 1;
            let name = numf[i];
            let titles = folders[name];
            ids = ids.concat(titles);
            if(n == 0){
              let entry = `${titles.length} ${(titles.length < 2) ? lang["folder_entry_single"] : lang["folder_entry_mult"]}`;
              document.getElementById("in").innerHTML = name;
              document.getElementById("ia").innerHTML = entry;
              document.getElementById("iv").innerHTML = "";
              document.getElementById("bi").setAttribute("style", document.getElementById("bi").getAttribute("style").replace("visible", "hidden"))
              document.getElementById("bf").setAttribute("style", document.getElementById("bf").getAttribute("style").replace("hidden", uijson["main_menu"]["banner_image"]["visible"]));
              document.getElementById("bh").setAttribute("style", document.getElementById("bh").getAttribute("style").replace("visible", "hidden"));
              left = 98;
              ifolders.push(`<img width="256" height="256" style="position: absolute;top: ${top}; left: ${left}" src="${defaulticon.folder}" alt="folder/${entry}/${name}"/><p style="position: absolute;top: ${uijson["menu_folder_text_y"] + top}; left: ${uijson["menu_folder_text_x"] + left};border: 0;font-family: 'Font'; font-size: ${uijson["menu_folder_text_size"]};margin: 0px 0px; background-color: transparent; border: 0; color: ${uijson["text_color"]}">${name}</p><input style="width:256;height:256;position: absolute;top: ${top}; left: ${left};z-index: 1;outline: none;border: none;background-color: transparent;pointer-events:auto;" type="button" id="${n}" alt="folder/${entry}/${name}"/>`)
            } else {
              let entry = `${titles.length} ${(titles.length < 2) ? lang["folder_entry_single"] : lang["folder_entry_mult"]}`;
              left += 276;
              ifolders.push(`<img width="256" height="256" style="position: absolute;top: ${top}; left: ${left}" src="${defaulticon.folder}" alt="folder/${entry}/${name}"/><p style="position: absolute;top: ${uijson["menu_folder_text_y"] + top}; left: ${uijson["menu_folder_text_x"] + left};border: 0;font-family: 'Font'; font-size: ${uijson["menu_folder_text_size"]};margin: 0px 0px; background-color: transparent; border: 0; color: ${uijson["text_color"]}">${name}</p><input style="width:256;height:256;position: absolute;top: ${top}; left: ${left};z-index: 1;outline: none;border: none;background-color: transparent;pointer-events:auto;" type="button" id="${n}" alt="folder/${entry}/${name}"/>`)
            }
          }
          items = items.concat(ifolders);
          let igames = games.map((game) => {
            if(ids.includes(game.id)) return "";
            n += 1;
            let width = 256;
            let height = 256;
            if(n == 0){
              document.getElementById("in").innerHTML = game.name;
              document.getElementById("ia").innerHTML = game.author;
              document.getElementById("iv").innerHTML = game.version;
              left = 98;
              return `<img width="256" height="256" style="position: absolute;top: ${top}; left: ${left}" src="${path.join(__dirname, "ulaunch", "game", game.icon)}" alt="game/${game.id}"/><input style="width:256;height:256;position: absolute;top: ${top}; left: ${left};z-index: 1;outline: none;border: none;background-color: transparent;pointer-events:auto;" type="button" id="${n}" alt="game/${game.id}"/>`
            } else {
              left += 276;
              return `<img width="256" height="256" style="position: absolute;top: ${top}; left: ${left}" src="${path.join(__dirname, "ulaunch", "game", game.icon)}" alt="game/${game.id}"/><input style="width:256;height:256;position: absolute;top: ${top}; left: ${left};z-index: 1;outline: none;border: none;background-color: transparent;pointer-events:auto;" type="button" id="${n}" alt="game/${game.id}"/>`
            }
          });
          items = items.concat(igames);
          let hbi = menuitems.hb.map(file => {
            let ret = false;
            numf.map(f => {
              if(folders[f].includes(file)) ret = true;
            });
            if(ret) return "";
            if(file === "hbmenu"){
              left += 276;
              n += 1;
              return `<img width="256" height="256" style="position: absolute;top: ${top}; left: ${left}" src="${defaulticon.hbmenu}" alt="homebrew/${lang["hbmenu_launch"]}///hbmenu"/><input style="width:256;height:256;position: absolute;top: ${top}; left: ${left};z-index: 1;outline: none;border: none;background-color: transparent;pointer-events:auto;" type="button" id="${n}" alt="homebrew/${lang["hbmenu_launch"]}///hbmenu"/>`
            } else {
              let filename = file;
              file = path.join(ulaunchtester, "sdmc", "ulaunch", "entries", file);
              let content = require(file);
              if(content.icon == "" || content.icon == null || content.icon == undefined || !fs.existsSync(content.icon.replace("sdmc:", path.join(ulaunchtester, "sdmc"))) || content.type !== 2) return "";
              left += 276;
              n += 1;
              return `<img width="256" height="256" style="position: absolute;top: ${top}; left: ${left}" src="${content.icon.replace("sdmc:", path.join(ulaunchtester, "sdmc"))}" alt="homebrew/${content.name.substring(0, 0x1FF)}/${content.author.substring(0, 0xFF)}/${content.version.substring(0, 0xF)}/${filename}"/><input style="width:256;height:256;position: absolute;top: ${top}; left: ${left};z-index: 1;outline: none;border: none;background-color: transparent;pointer-events:auto;" type="button" id="${n}" alt="homebrew/${content.name.substring(0, 0x1FF)}/${content.author.substring(0, 0xFF)}/${content.version.substring(0, 0xF)}/${filename}"/>`;
            }
          });
          items = items.concat(hbi);
          items.push(`<img width="${size.suspended.w}" height="${size.suspended.h}" style="position: absolute;top: ${suspendedd}; left: ${98-(size.suspended.w-256)/2};pointer-events:none;display:none;" src="${defaulticon.suspended}" id="suspended"/>`)
          items.push(`<div id="multiselect" style="position:absolute;top:${multiselectt};left:0;width:1280;height:${height-multiselectt*2};background-color: transparent;pointer-events:none;"></div>`)
          items.push(`<img width="${size.cursor.w}" height="${size.cursor.h}" style="position: absolute;top: ${cursor}; left: ${98-(size.cursor.w-256)/2}" src="${defaulticon.cursor}" id="cursor" alt="0"/>`)
          items.push(`<input type="button" style="position: absolute;border:none;outline:none;background-color:transparent;top:0;width:1;height:1;left:${left+256+86}"/>`)
          items = items.join("");
          document.getElementById("items").innerHTML = items;
          if(suspended !== undefined){
            try {
              let item = $(`input[alt="${suspended}"]`).get(0).getAttribute("style");
              let l = item.split("left:")[1].split(";")[0];
              document.getElementById("suspended").setAttribute("style", `position: absolute;top: ${suspendedd}; left: ${l-(size.suspended.w-256)/2};pointer-events:none;display:none;`);
              $("#suspended").show();
            }catch(e){}
          }
          let max = 0;
          let selected = 0;
          let inputs = $("#items :input");
          max = inputs.length;
          switchem.on("y", () => {
            if(res || ress) return;
            ress = true;
            return new Promise(function(resolve, reject) {
              let mid = multiselect.length;
              multiselect.push(true);
              let div = $("#multiselect");
              div.show();
              div.append(`<img width="${size.multiselect.w}" height="${size.multiselect.h}" style="position: absolute;top: 0; left: ${parseInt($("#cursor").get(0).getAttribute("style").split("left:")[1].split(";")[0])+(size.cursor.w-256)/2-(size.multiselect.w-256)/2}" src="${defaulticon.multiselect}" id="${selected}"/>`);
              inputs.click((e) => {
                click(e.currentTarget.id);
              });
              switchem.on("y", () => {
                select(selected);
              });
              function select(id){
                if(res || !multiselect[mid]) return;
                let leftmultiselect = 98+276*parseInt(id)-(size.multiselect.w-256)/2;
                if($(`#multiselect #${id}`).get(0) === undefined){
                  div.append(`<img width="${size.multiselect.w}" height="${size.multiselect.h}" style="position: absolute;top: 0; left: ${leftmultiselect}" src="${defaulticon.multiselect}" id="${id}"/>`)
                }
              }
              switchem.on("arrowright", () => {
                click(selected+1);
              });
              switchem.on("lrightstart", () => {
                click(selected+1);
              });
              switchem.on("rrightstart", () => {
                click(selected+1);
              });
              switchem.on("arrowleft", () => {
                click(selected-1);
              });
              switchem.on("lleftstart", () => {
                click(selected-1);
              });
              switchem.on("rleftstart", () => {
                click(selected-1);
              });
              switchem.on("a", () => {
                dblclick(selected);
              });
              switchem.on("b", () => {
                if(res || !multiselect[mid]) return;
                multiselect[mid] = false;
                $("#multiselect").hide();
                document.getElementById("multiselect").innerHTML = "";
                ShowNotification(lang["menu_multiselect_cancel"], uijson);
                ress = false;
                res = false;
                resolve();
              });
              inputs.dblclick((e) => {
                dblclick(e.currentTarget.id);
              });
              function click(id){
                if(res || !multiselect[mid]) return;
                let input = document.getElementById(id);
                if(input === null) return;
                let cursor = ([size.cursor.h, size.multiselect.h, size.suspended.h].sort((a, b) => a > b)[0]-size.cursor.h)/2;
                let leftcursor = 98+276*parseInt(id)-(size.cursor.w-256)/2
                document.getElementById("cursor").setAttribute("alt", id);
                document.getElementById("cursor").setAttribute("style", `position: absolute;top: ${cursor}; left: ${leftcursor}`);
                selected = parseInt(id);
                document.getElementById("cursor").setAttribute("style", `position: absolute;top: 0; left: ${leftcursor}`);
                let alt = input.getAttribute("alt");
                if(alt.startsWith("game")){
                  let game = games.find(g => g.id === alt.split("/")[1]);
                  document.getElementById("in").innerHTML = game.name;
                  document.getElementById("ia").innerHTML = game.author;
                  document.getElementById("iv").innerHTML = game.version;
                  document.getElementById("bi").setAttribute("style", document.getElementById("bi").getAttribute("style").replace("hidden", uijson["main_menu"]["banner_image"]["visible"]))
                  document.getElementById("bf").setAttribute("style", document.getElementById("bf").getAttribute("style").replace("visible", "hidden"));
                  document.getElementById("bh").setAttribute("style", document.getElementById("bh").getAttribute("style").replace("visible", "hidden"));
                } else if(alt.startsWith("folder")){
                  let name = alt.split("/")[2];
                  let entry = alt.split("/")[1];
                  document.getElementById("in").innerHTML = name;
                  document.getElementById("ia").innerHTML = entry;
                  document.getElementById("iv").innerHTML = "";
                  document.getElementById("bi").setAttribute("style", document.getElementById("bi").getAttribute("style").replace("visible", "hidden"))
                  document.getElementById("bf").setAttribute("style", document.getElementById("bf").getAttribute("style").replace("hidden", uijson["main_menu"]["banner_image"]["visible"]));
                  document.getElementById("bh").setAttribute("style", document.getElementById("bh").getAttribute("style").replace("visible", "hidden"));
                } else if(alt.startsWith("homebrew")){
                  alt = alt.split("/");
                  document.getElementById("in").innerHTML = alt[1];
                  document.getElementById("ia").innerHTML = alt[2];
                  document.getElementById("iv").innerHTML = alt[3];
                  document.getElementById("bi").setAttribute("style", document.getElementById("bi").getAttribute("style").replace("visible", "hidden"))
                  document.getElementById("bf").setAttribute("style", document.getElementById("bf").getAttribute("style").replace("visible", "hidden"));
                  document.getElementById("bh").setAttribute("style", document.getElementById("bh").getAttribute("style").replace("hidden", uijson["main_menu"]["banner_image"]["visible"]));
                }
                let scroll = document.getElementById("items").scrollLeft;
                if(selected*276 > scroll){
                  if(selected*276-276*3 < scroll) return;
                  $(`#items`).animate({
                      scrollLeft: selected*276-276*3
                  }, 0);
                } else {
                  $(`#items`).animate({
                      scrollLeft: selected*276
                  }, 0);
                }
              }
              async function dblclick(){
                if(res || !multiselect[mid]) return;
                let resss = false;
                res = true;
                let imgs = $("#multiselect img");
                let onlyfolder = true;
                for(var i=0; i<imgs.length; i++){
                  if($(`#items #${imgs.get(i).id}`).get(0).getAttribute("alt").startsWith("game") || $(`#items #${imgs.get(i).id}`).get(0).getAttribute("alt").startsWith("homebrew")) onlyfolder = false;
                }
                if(onlyfolder === false){
                  let dialog = await createDialog(lang["menu_multiselect"], lang["menu_move_to_folder"], [lang["menu_move_new_folder"], lang["menu_move_existing_folder"], lang["no"]]);
                  $("#ulaunchscreen").append(dialog);
                  let inputs = $("#dialog :input");
                  selected = 0;
                  let max = inputs.length;
                  inputs.click((e) => {
                    click(e.currentTarget.id);
                  });
                  switchem.on("arrowright", () => {
                    click(selected+1);
                  });
                  switchem.on("lrightstart", () => {
                    click(selected+1);
                  });
                  switchem.on("rrightstart", () => {
                    click(selected+1);
                  });
                  switchem.on("arrowleft", () => {
                    click(selected-1);
                  });
                  switchem.on("lleftstart", () => {
                    click(selected-1);
                  });
                  switchem.on("rleftstart", () => {
                    click(selected-1);
                  });
                  switchem.on("a", () => {
                    dblclick(selected);
                  });
                  inputs.dblclick((e) => {
                    dblclick(e.currentTarget.id);
                  });
                  function click(id){
                    if(resss) return;
                    let input = $(`#dialog #${id}`).get(0);
                    let before = $(`#dialog #${selected}`).get(0);
                    if(input === undefined) return;
                    before.setAttribute("style", before.getAttribute("style").replace("#B4B4C8FF", "#B4B4C800"));
                    input.setAttribute("style", input.getAttribute("style").replace("#B4B4C800", "#B4B4C8FF"));
                    selected = parseInt(id);
                  }
                  function dblclick(id){
                    if(resss) return;
                    if(id == 0){
                      resss = true;
                      let finish = false;
                      istyping = true;
                      $("#ulaunchscreen").append(`<div style="background-color: #3232327F;z-index:100;position:absolute;top:0;left:0;width:1280;height:720;" id="foldername"><div style="background-color: #e1e1e1;width:300;height:100;position:absolute;top:50%;left:50%;transform:translate(-50%, -50%)"><p style="font-family: 'OpenSans';font-size: 25;margin:0px 0px;position:absolute;top: 10;left:22.5;" id="namep">Enter the folder name</p><input style="width:250;height:30;font-family: 'OpenSans';font-size: 20;position:absolute;top:50;left:25" type="text" id="name"/></div></div>`);
                      $('#name').bind("enterKey",function(e){
                        if(finish) return;
                        let foldername = $(e.currentTarget).val();
                        if(foldername == ""){
                          alert("The folder name is empty!");
                        } else {
                          istyping = false;
                          $("#foldername").remove();
                          let imgs = $("#multiselect img");
                          let folder = [];
                          for(var i=0; i<imgs.length; i++){
                            let img = imgs.get(i);
                            let title = $(`#items #${img.id}`).get(0);
                            let titlealt = title.getAttribute("alt");
                            if(titlealt.startsWith("game")){
                              folder.push(titlealt.split("/")[1]);
                            } else if(titlealt.startsWith("homebrew")){
                              folder.push(titlealt.split("/")[4]);
                            } else if(titlealt.startsWith("folder")){
                              folder = folder.concat(menuitems.folders[titlealt.split("/")[2]]);
                              delete menuitems.folders[titlealt.split("/")[2]];
                            }
                          }
                          menuitems.folders[foldername] = folder;
                          fs.writeFileSync(path.join(ulaunchtester, "testersettings", "menuitems.json"), JSON.stringify(menuitems, null, 2), (err) => {if(err) throw err});
                          multiselect[mid] = false;
                          $("#multiselect").hide();
                          document.getElementById("multiselect").innerHTML = "";
                          resss = true;
                          ress = true;
                          res = false;
                          $("#dialog").remove();
                          if(multiselect.filter(n => n == true)[0]){
                            multiselect = multiselect.map(n => false);
                            $("#multiselect").hide();
                            document.getElementById("multiselect").innerHTML = "";
                            ShowNotification(lang["menu_multiselect_cancel"], uijson);
                          }
                          $(`#items`).animate({
                            scrollLeft: 0
                          }, 0);
                          lmenuitems();
                          resolve();
                        }
                      });
                      $('#name').keyup(function(e){if(e.keyCode == 13){$(this).trigger("enterKey");}});
                    } else if(id == 1) {
                      resss = true;
                      let ressss = false;
                      $("#dialog").remove();
                      ShowNotification(lang["menu_move_select_folder"], uijson);
                      let cursor = ([size.cursor.h, size.multiselect.h, size.suspended.h].sort((a, b) => a > b)[0]-size.cursor.h)/2;
                      let leftcursor = 98-(size.cursor.w-256)/2;
                      document.getElementById("cursor").setAttribute("alt", 0);
                      document.getElementById("cursor").setAttribute("style", `position: absolute;top: ${cursor}; left: ${leftcursor}`);
                      $(`#items`).animate({
                        scrollLeft: 0
                      }, 0);
                      selected = 0;
                      inputs.click((e) => {
                        click(e.currentTarget.id);
                      });
                      switchem.on("arrowright", () => {
                        click(selected+1);
                      });
                      switchem.on("lrightstart", () => {
                        click(selected+1);
                      });
                      switchem.on("rrightstart", () => {
                        click(selected+1);
                      });
                      switchem.on("arrowleft", () => {
                        click(selected-1);
                      });
                      switchem.on("lleftstart", () => {
                        click(selected-1);
                      });
                      switchem.on("rleftstart", () => {
                        click(selected-1);
                      });
                      switchem.on("a", () => {
                        dblclick(selected);
                      });
                      switchem.on("b", () => {
                        if(ressss) return;
                        multiselect[mid] = false;
                        $("#multiselect").hide();
                        document.getElementById("multiselect").innerHTML = "";
                        ShowNotification(lang["menu_move_select_folder_cancel"], uijson)
                        ressss = true;
                        resss = true;
                        selected = 0;
                        ress = false;
                        res = false;
                        resolve();
                      });
                      inputs.dblclick((e) => {
                        dblclick(e.currentTarget.id);
                      });
                      function click(id){
                        if(ressss) return;
                        let input = document.getElementById(id);
                        if(input === null) return;
                        let alt = input.getAttribute("alt");
                        if(alt.startsWith("game")){
                          return;
                        } else if(alt.startsWith("folder")){
                          let name = alt.split("/")[2];
                          let entry = alt.split("/")[1];
                          document.getElementById("in").innerHTML = name;
                          document.getElementById("ia").innerHTML = entry;
                          document.getElementById("iv").innerHTML = "";
                          document.getElementById("bi").setAttribute("style", document.getElementById("bi").getAttribute("style").replace("visible", "hidden"))
                          document.getElementById("bf").setAttribute("style", document.getElementById("bf").getAttribute("style").replace("hidden", uijson["main_menu"]["banner_image"]["visible"]));
                          document.getElementById("bh").setAttribute("style", document.getElementById("bh").getAttribute("style").replace("visible", "hidden"));
                        } else if(alt.startsWith("homebrew")){
                          return;
                        }
                        let cursor = ([size.cursor.h, size.multiselect.h, size.suspended.h].sort((a, b) => a > b)[0]-size.cursor.h)/2;
                        let leftcursor = 98+276*parseInt(id)-(size.cursor.w-256)/2
                        selected = parseInt(id);
                        document.getElementById("cursor").setAttribute("alt", id);
                        document.getElementById("cursor").setAttribute("style", `position: absolute;top: ${cursor}; left: ${leftcursor}`);
                        let scroll = document.getElementById("items").scrollLeft;
                        if(selected*276 > scroll){
                          if(selected*276-276*3 < scroll) return;
                          $(`#items`).animate({
                              scrollLeft: selected*276-276*3
                          }, 0);
                        } else {
                          $(`#items`).animate({
                              scrollLeft: selected*276
                          }, 0);
                        }
                      }
                      function dblclick(id){
                        if(ressss) return;
                        let alt = document.getElementById(id).getAttribute("alt");
                        let name = alt.split("/")[2];
                        let imgs = $("#multiselect img");
                        let folder = [];
                        for(var i=0; i<imgs.length; i++){
                          let img = imgs.get(i);
                          let title = $(`#items #${img.id}`).get(0);
                          let titlealt = title.getAttribute("alt");
                          if(titlealt.startsWith("game")){
                            folder.push(titlealt.split("/")[1]);
                          } else if(titlealt.startsWith("homebrew")){
                            folder.push(titlealt.split("/")[4]);
                          } else if(titlealt.startsWith("folder")){
                            if(titlealt.split("/")[2] !== name){
                              folder = folder.concat(menuitems.folders[titlealt.split("/")[2]]);
                              delete menuitems.folders[titlealt.split("/")[2]];
                            }
                          }
                        }
                        menuitems.folders[name] = menuitems.folders[name].concat(folder);
                        fs.writeFileSync(path.join(ulaunchtester, "testersettings", "menuitems.json"), JSON.stringify(menuitems, null, 2), (err) => {if(err) throw err});
                        multiselect[mid] = false;
                        $("#multiselect").hide();
                        document.getElementById("multiselect").innerHTML = "";
                        ressss = true;
                        resss = true;
                        selected = 0;
                        ress = true;
                        res = false;
                        if(multiselect.filter(n => n == true)[0]){
                          multiselect = multiselect.map(n => false);
                          $("#multiselect").hide();
                          document.getElementById("multiselect").innerHTML = "";
                          ShowNotification(lang["menu_multiselect_cancel"], uijson);
                        }
                        $(`#items`).animate({
                          scrollLeft: 0
                        }, 0);
                        lmenuitems();
                        resolve();
                      }
                    } else {
                      multiselect[mid] = false;
                      $("#multiselect").hide();
                      document.getElementById("multiselect").innerHTML = "";
                      ShowNotification(lang["menu_multiselect_cancel"], uijson);
                      resss = true;
                      ress = false;
                      res = false;
                      $("#dialog").remove();
                      resolve();
                    }
                  }
                } else {
                  let dialog = await createDialog(lang["menu_multiselect"], lang["menu_move_from_folder"], [lang["yes"], lang["no"]]);
                  $("#ulaunchscreen").append(dialog);
                  let inputs = $("#dialog :input");
                  selected = 0;
                  let max = inputs.length;
                  inputs.click((e) => {
                    click(e.currentTarget.id);
                  });
                  switchem.on("arrowright", () => {
                    click(selected+1);
                  });
                  switchem.on("lrightstart", () => {
                    click(selected+1);
                  });
                  switchem.on("rrightstart", () => {
                    click(selected+1);
                  });
                  switchem.on("arrowleft", () => {
                    click(selected-1);
                  });
                  switchem.on("lleftstart", () => {
                    click(selected-1);
                  });
                  switchem.on("rleftstart", () => {
                    click(selected-1);
                  });
                  switchem.on("a", () => {
                    dblclick(selected);
                  });
                  inputs.dblclick((e) => {
                    dblclick(e.currentTarget.id);
                  });
                  function click(id){
                    if(resss) return;
                    let input = $(`#dialog #${id}`).get(0);
                    let before = $(`#dialog #${selected}`).get(0);
                    if(input === undefined) return;
                    before.setAttribute("style", before.getAttribute("style").replace("#B4B4C8FF", "#B4B4C800"));
                    input.setAttribute("style", input.getAttribute("style").replace("#B4B4C800", "#B4B4C8FF"));
                    selected = parseInt(id);
                  }
                  function dblclick(id){
                    if(resss) return;
                    if(id == 0){
                      let imgs = $("#multiselect img");
                      let folders = [];
                      for(var i=0; i<imgs.length; i++){
                        let img = imgs.get(i);
                        let title = $(`#items #${img.id}`).get(0);
                        let titlealt = title.getAttribute("alt");
                        let name = titlealt.split("/")[2];
                        folders.push(name);
                        delete menuitems.folders[name];
                      }
                      fs.writeFileSync(path.join(ulaunchtester, "testersettings", "menuitems.json"), JSON.stringify(menuitems, null, 2), (err) => {if(err) throw err});
                      multiselect[mid] = false;
                      $("#dialog").remove();
                      $("#multiselect").hide();
                      document.getElementById("multiselect").innerHTML = "";
                      resss = true;
                      selected = 0;
                      ress = true;
                      res = false;
                      if(multiselect.filter(n => n == true)[0]){
                        multiselect = multiselect.map(n => false);
                        $("#multiselect").hide();
                        document.getElementById("multiselect").innerHTML = "";
                        ShowNotification(lang["menu_multiselect_cancel"], uijson);
                      }
                      $(`#items`).animate({
                        scrollLeft: 0
                      }, 0);
                      lmenuitems();
                      resolve();
                    } else {
                      multiselect[mid] = false;
                      $("#multiselect").hide();
                      document.getElementById("multiselect").innerHTML = "";
                      resss = true;
                      ress = false;
                      res = false;
                      $("#dialog").remove();
                      resolve();
                    }
                  }
                }
              }
            });
          });
          inputs.click((e) => {
            click(e.currentTarget.id);
          });
          switchem.on("arrowright", () => {
            click(selected+1);
          });
          switchem.on("lrightstart", () => {
            click(selected+1);
          });
          switchem.on("rrightstart", () => {
            click(selected+1);
          });
          switchem.on("arrowleft", () => {
            click(selected-1);
          });
          switchem.on("lleftstart", () => {
            click(selected-1);
          });
          switchem.on("rleftstart", () => {
            click(selected-1);
          });
          switchem.on("x", async () => {
            if(res || ress) return;
            if(document.getElementById($("#cursor").get(0).getAttribute("alt")).getAttribute("alt") !== suspended) return;
            let resss = false;
            res = true;
            let dialog = await createDialog(lang["suspended_app"], lang["suspended_close"], [lang["yes"], lang["cancel"]]);
            $("#ulaunchscreen").append(dialog);
            let inputs = $("#dialog :input");
            let selected = 0;
            let max = inputs.length;
            inputs.click((e) => {
              click(e.currentTarget.id);
            });
            switchem.on("arrowright", () => {
              click(selected+1);
            });
            switchem.on("lrightstart", () => {
              click(selected+1);
            });
            switchem.on("rrightstart", () => {
              click(selected+1);
            });
            switchem.on("arrowleft", () => {
              click(selected-1);
            });
            switchem.on("lleftstart", () => {
              click(selected-1);
            });
            switchem.on("rleftstart", () => {
              click(selected-1);
            });
            switchem.on("a", () => {
              dblclick(selected);
            });
            inputs.dblclick((e) => {
              dblclick(e.currentTarget.id);
            });
            function click(id){
              if(resss) return;
              let input = $(`#dialog #${id}`).get(0);
              let before = $(`#dialog #${selected}`).get(0);
              if(input === undefined) return;
              before.setAttribute("style", before.getAttribute("style").replace("#B4B4C8FF", "#B4B4C800"));
              input.setAttribute("style", input.getAttribute("style").replace("#B4B4C800", "#B4B4C8FF"));
              selected = parseInt(id);
            }
            function dblclick(id){
              if(resss) return;
              if(id == 0){
                $("#title").remove();
                $("#suspended").hide();
                $("#suspendedimgg").hide();
                suspended = undefined;
                resss = true;
                res = false;
                $("#dialog").remove();
              } else {
                resss = true;
                res = false;
                $("#dialog").remove();
              }
            }
          });
          switchem.on("a", () => {
            dblclick(selected);
          });
          inputs.dblclick((e) => {
            dblclick(e.currentTarget.id);
          });
          function click(id){
            if(ress || res) return;
            let input = document.getElementById(id);
            if(input === null) return;
            let cursor = ([size.cursor.h, size.multiselect.h, size.suspended.h].sort((a, b) => a > b)[0]-size.cursor.h)/2;
            let leftcursor = 98+276*parseInt(id)-(size.cursor.w-256)/2
            selected = parseInt(id);
            document.getElementById("cursor").setAttribute("alt", id);
            document.getElementById("cursor").setAttribute("style", `position: absolute;top: ${cursor}; left: ${leftcursor}`);
            let alt = input.getAttribute("alt");
            if(alt.startsWith("game")){
              let game = games.find(g => g.id === alt.split("/")[1]);
              document.getElementById("in").innerHTML = game.name;
              document.getElementById("ia").innerHTML = game.author;
              document.getElementById("iv").innerHTML = game.version;
              document.getElementById("bi").setAttribute("style", document.getElementById("bi").getAttribute("style").replace("hidden", uijson["main_menu"]["banner_image"]["visible"]))
              document.getElementById("bf").setAttribute("style", document.getElementById("bf").getAttribute("style").replace("visible", "hidden"));
              document.getElementById("bh").setAttribute("style", document.getElementById("bh").getAttribute("style").replace("visible", "hidden"));
            } else if(alt.startsWith("folder")){
              let name = alt.split("/")[2];
              let entry = alt.split("/")[1];
              document.getElementById("in").innerHTML = name;
              document.getElementById("ia").innerHTML = entry;
              document.getElementById("iv").innerHTML = "";
              document.getElementById("bi").setAttribute("style", document.getElementById("bi").getAttribute("style").replace("visible", "hidden"))
              document.getElementById("bf").setAttribute("style", document.getElementById("bf").getAttribute("style").replace("hidden", uijson["main_menu"]["banner_image"]["visible"]));
              document.getElementById("bh").setAttribute("style", document.getElementById("bh").getAttribute("style").replace("visible", "hidden"));
            } else if(alt.startsWith("homebrew")){
              alt = alt.split("/");
              document.getElementById("in").innerHTML = alt[1];
              document.getElementById("ia").innerHTML = alt[2];
              document.getElementById("iv").innerHTML = alt[3];
              document.getElementById("bi").setAttribute("style", document.getElementById("bi").getAttribute("style").replace("visible", "hidden"))
              document.getElementById("bf").setAttribute("style", document.getElementById("bf").getAttribute("style").replace("visible", "hidden"));
              document.getElementById("bh").setAttribute("style", document.getElementById("bh").getAttribute("style").replace("hidden", uijson["main_menu"]["banner_image"]["visible"]));
            }
            let scroll = document.getElementById("items").scrollLeft;
            if(selected*276 > scroll){
              if(selected*276-276*3 < scroll) return;
              $(`#items`).animate({
                  scrollLeft: selected*276-276*3
              }, 0);
            } else {
              $(`#items`).animate({
                  scrollLeft: selected*276
              }, 0);
            }
          }
          async function dblclick(id){
            if(ress || res) return;
            let alt = document.getElementById(id).getAttribute("alt");
            if(document.getElementById(id).getAttribute("alt") === suspended){
              res = true;
              if(sound){
                sound.stop();
                fadetimeout.stop();
              };
              if(titlelaunch !== undefined){
                if(titlelaunch.playing()) titlelaunch.stop();
                titlelaunch.play();
              }
              $("#title").animate({width: 1280,height:720,opacity:1}, 1000, () => {
                $("#title").remove();
                $("#ulaunchscreen").append(`<input type="button" style="background-color:#222;z-index:99;outline:none;border:none;position:absolute;top:0;left:0;width:1280;height:720" id="title"/>`);
                setTimeout(() => {
                  $("#title").remove();
                  suspended = alt;
                  if(sound){
                    sound.play();
                    fadetimeout.resume();
                  };
                  $("#suspendedimg").append(`<input type="button" style="background-color:#222;outline:none;border:none;top:50%;left:50%;transform:translate(-50%, -50%);position:absolute;width:1280;height:720;" id="title"/>`);
                  $("#title").animate({width: 1008,height:567,opacity:parseInt(uijson["suspended_final_alpha"])/255}, 1000, () => {
                    res = false;
                  });
                  let item = document.getElementById(iid).getAttribute("style");
                  let l = item.split("left:")[1].split(";")[0];
                  document.getElementById("suspended").setAttribute("style", `position: absolute;top: ${suspendedd}; left: ${l-(size.suspended.w-256)/2};pointer-events:none;display:none;`)
                  $("#suspended").show();
                }, 1000);
              });
            } else {
              let iid = id;
              if(alt.startsWith("folder")){
                ress = true;
                folderitems(alt.split("/")[2]);
                resolve();
              } else if(alt.startsWith("homebrew")) {
                if(suspended !== undefined){
                  let ret = await new Promise(async function(resolve, reject) {
                    let resss = false;
                    res = true;
                    let dialog = await createDialog(lang["suspended_app"], lang["suspended_close"], [lang["yes"], lang["cancel"]]);
                    $("#ulaunchscreen").append(dialog);
                    let inputs = $("#dialog :input");
                    let selected = 0;
                    let max = inputs.length;
                    inputs.click((e) => {
                      click(e.currentTarget.id);
                    });
                    switchem.on("arrowright", () => {
                      click(selected+1);
                    });
                    switchem.on("lrightstart", () => {
                      click(selected+1);
                    });
                    switchem.on("rrightstart", () => {
                      click(selected+1);
                    });
                    switchem.on("arrowleft", () => {
                      click(selected-1);
                    });
                    switchem.on("lleftstart", () => {
                      click(selected-1);
                    });
                    switchem.on("rleftstart", () => {
                      click(selected-1);
                    });
                    switchem.on("a", () => {
                      dblclick(selected);
                    });
                    inputs.dblclick((e) => {
                      dblclick(e.currentTarget.id);
                    });
                    function click(id){
                      if(ress) return;
                      let input = $(`#dialog #${id}`).get(0);
                      let before = $(`#dialog #${selected}`).get(0);
                      if(input === undefined) return;
                      before.setAttribute("style", before.getAttribute("style").replace("#B4B4C8FF", "#B4B4C800"));
                      input.setAttribute("style", input.getAttribute("style").replace("#B4B4C800", "#B4B4C8FF"));
                      selected = parseInt(id);
                    }
                    function dblclick(id){
                      if(resss) return;
                      if(id == 0){
                        $("#title").remove();
                        $("#suspended").hide();
                        suspended = undefined;
                        resss = true;
                        res = false;
                        $("#dialog").remove();
                        resolve(false);
                      } else {
                        resss = true;
                        res = false;
                        $("#dialog").remove();
                        resolve(true);
                      }
                    }
                  });
                  if(ret) return;
                }
                if(testersettings["flog_enabled"] == "True"){
                  res = true;
                  let dialog = await createDialog(lang["hb_launch"], lang["hb_launch_conf"], [lang["hb_applet"], lang["hb_app"], lang["cancel"]]);
                  $("#ulaunchscreen").append(dialog);
                  let inputs = $("#dialog :input");
                  let selected = 0;
                  let max = inputs.length;
                  inputs.click((e) => {
                    click(e.currentTarget.id);
                  });
                  switchem.on("arrowright", () => {
                    click(selected+1);
                  });
                  switchem.on("lrightstart", () => {
                    click(selected+1);
                  });
                  switchem.on("rrightstart", () => {
                    click(selected+1);
                  });
                  switchem.on("arrowleft", () => {
                    click(selected-1);
                  });
                  switchem.on("lleftstart", () => {
                    click(selected-1);
                  });
                  switchem.on("rleftstart", () => {
                    click(selected-1);
                  });
                  switchem.on("a", () => {
                    dblclick(selected);
                  });
                  inputs.dblclick((e) => {
                    dblclick(e.currentTarget.id);
                  });
                  function click(id){
                    if(ress) return;
                    let input = $(`#dialog #${id}`).get(0);
                    let before = $(`#dialog #${selected}`).get(0);
                    if(input === undefined) return;
                    before.setAttribute("style", before.getAttribute("style").replace("#B4B4C8FF", "#B4B4C800"));
                    input.setAttribute("style", input.getAttribute("style").replace("#B4B4C800", "#B4B4C8FF"));
                    selected = parseInt(id);
                  }
                  function dblclick(id){
                    if(ress) return;
                    if(id == 0){
                      $("#dialog").remove();
                      if(sound){
                        sound.stop();
                        fadetimeout.stop();
                      };
                      if(titlelaunch !== undefined){
                        if(titlelaunch.playing()) titlelaunch.stop();
                        titlelaunch.play();
                      }
                      $("#ulaunchscreen").append(`<input type="button" style="background-color:#222;z-index:99;outline:none;border:none;position:absolute;top:0;left:0;width:1280;height:720" id="title"/>`);
                      setTimeout(() => {
                        $("#title").remove();
                        if(sound){
                          sound.play();
                          fadetimeout.resume();
                        };
                        res = false;
                      }, 1000);
                    } else if(id == 1){
                      $("#dialog").remove();
                      if(sound){
                        sound.stop();
                        fadetimeout.stop();
                      };
                      if(titlelaunch !== undefined){
                        if(titlelaunch.playing()) titlelaunch.stop();
                        titlelaunch.play();
                      }
                      $("#ulaunchscreen").append(`<input type="button" style="background-color:#222;z-index:99;outline:none;border:none;position:absolute;top:0;left:0;width:1280;height:720" id="title"/>`);
                      setTimeout(() => {
                        $("#title").remove();
                        suspended = alt;
                        if(sound){
                          sound.play();
                          fadetimeout.resume();
                        };
                        $("#suspendedimg").append(`<input type="button" style="background-color:#222;outline:none;border:none;top:50%;left:50%;transform:translate(-50%, -50%);position:absolute;width:1280;height:720;" id="title"/>`);
                        $("#title").animate({width: 1008,height:567,opacity:parseInt(uijson["suspended_final_alpha"])/255}, 1000, () => {
                          res = false;
                        });
                        let item = document.getElementById(iid).getAttribute("style");
                        let l = item.split("left:")[1].split(";")[0];
                        document.getElementById("suspended").setAttribute("style", `position: absolute;top: ${suspendedd}; left: ${l-(size.suspended.w-256)/2};pointer-events:none;display:none;`)
                        $("#suspended").show();
                      }, 1000);
                    } else if(id == 2){
                      res = false;
                      $("#dialog").remove();
                    }
                  }
                } else {
                  $("#dialog").remove();
                  if(sound){
                    sound.stop();
                    fadetimeout.stop();
                  };
                  if(titlelaunch !== undefined){
                    if(titlelaunch.playing()) titlelaunch.stop();
                    titlelaunch.play();
                  }
                  $("#ulaunchscreen").append(`<input type="button" style="background-color:#222;z-index:99;outline:none;border:none;position:absolute;top:0;left:0;width:1280;height:720" id="title"/>`);
                  setTimeout(() => {
                    $("#title").remove();
                    if(sound){
                      sound.play();
                      fadetimeout.resume();
                    };
                    res = false;
                  }, 1000);
                }
              } else {
                if(suspended !== undefined){
                  let ret = await new Promise(async function(resolve, reject) {
                    let resss = false;
                    res = true;
                    let dialog = await createDialog(lang["suspended_app"], lang["suspended_close"], [lang["yes"], lang["cancel"]]);
                    $("#ulaunchscreen").append(dialog);
                    let inputs = $("#dialog :input");
                    let selected = 0;
                    let max = inputs.length;
                    inputs.click((e) => {
                      click(e.currentTarget.id);
                    });
                    switchem.on("arrowright", () => {
                      click(selected+1);
                    });
                    switchem.on("lrightstart", () => {
                      click(selected+1);
                    });
                    switchem.on("rrightstart", () => {
                      click(selected+1);
                    });
                    switchem.on("arrowleft", () => {
                      click(selected-1);
                    });
                    switchem.on("lleftstart", () => {
                      click(selected-1);
                    });
                    switchem.on("rleftstart", () => {
                      click(selected-1);
                    });
                    switchem.on("a", () => {
                      dblclick(selected);
                    });
                    inputs.dblclick((e) => {
                      dblclick(e.currentTarget.id);
                    });
                    function click(id){
                      if(ress) return;
                      let input = $(`#dialog #${id}`).get(0);
                      let before = $(`#dialog #${selected}`).get(0);
                      if(input === undefined) return;
                      before.setAttribute("style", before.getAttribute("style").replace("#B4B4C8FF", "#B4B4C800"));
                      input.setAttribute("style", input.getAttribute("style").replace("#B4B4C800", "#B4B4C8FF"));
                      selected = parseInt(id);
                    }
                    function dblclick(id){
                      if(resss) return;
                      if(id == 0){
                        $("#title").remove();
                        $("#suspended").hide();
                        suspended = undefined;
                        resss = true;
                        res = false;
                        $("#dialog").remove();
                        resolve(false);
                      } else {
                        resss = true;
                        res = false;
                        $("#dialog").remove();
                        resolve(true);
                      }
                    }
                  });
                  if(ret) return;
                }
                if(sound){
                  sound.stop();
                  fadetimeout.stop();
                };
                if(titlelaunch !== undefined){
                  if(titlelaunch.playing()) titlelaunch.stop();
                  titlelaunch.play();
                }
                $("#ulaunchscreen").append(`<input type="button" style="background-color:#222;z-index:99;outline:none;border:none;position:absolute;top:0;left:0;width:1280;height:720" id="title"/>`);
                setTimeout(() => {
                  $("#title").remove();
                  suspended = alt;
                  if(sound){
                    sound.play();
                    fadetimeout.resume();
                  };
                  $("#suspendedimg").append(`<input type="button" style="background-color:#222;outline:none;border:none;top:50%;left:50%;transform:translate(-50%, -50%);position:absolute;width:1280;height:720;" id="title"/>`);
                  $("#title").animate({width: 1008,height:567,opacity:parseInt(uijson["suspended_final_alpha"])/255}, 1000, () => {
                    res = false;
                  });
                  let item = document.getElementById(iid).getAttribute("style");
                  let l = item.split("left:")[1].split(";")[0];
                  document.getElementById("suspended").setAttribute("style", `position: absolute;top: ${suspendedd}; left: ${l-(size.suspended.w-256)/2};pointer-events:none;display:none;`)
                  $("#suspended").show();
                }, 1000);
              }
            }
          }
          $("#toggleclick").click(() => {
            hbmenu();
          });
          switchem.on("minus", () => {
            hbmenu();
          });
          function hbmenu(){
            if((ress || res) && !multiselect[0]) return;
            if(menutoggle !== undefined){
              if(menutoggle.playing()) menutoggle.stop();
              menutoggle.play();
            }
            if(multiselect.filter(n => n == true)[0]){
              multiselect = multiselect.map(n => false);
              $("#multiselect").hide();
              document.getElementById("multiselect").innerHTML = "";
              ShowNotification(lang["menu_multiselect_cancel"], uijson);
            }
            ress = true;
            hbitems();
          }
        });
      }
      function folderitems(fname){
        return new Promise(function(resolve, reject) {
          let ress = false;
          document.getElementById("bi").setAttribute("style", document.getElementById("bi").getAttribute("style").replace("hidden", uijson["main_menu"]["banner_image"]["visible"]))
          document.getElementById("bf").setAttribute("style", document.getElementById("bf").getAttribute("style").replace("visible", "hidden"));
          document.getElementById("bh").setAttribute("style", document.getElementById("bh").getAttribute("style").replace("visible", "hidden"));
          let height = [size.cursor.h, size.multiselect.h, size.suspended.h].sort((a, b) => a > b)[0];
          let top = (height-256)/2;
          let left = 98;
          let n = -1;
          let menuitems = require(path.join(ulaunchtester, "testersettings", "menuitems.json"));
          let folders = menuitems.folders[fname];
          let items = games.filter((game) => {
            if(folders.includes(game.id)){
              folders = folders.filter(f => f !== game.id);
              return true
            }
          }).map((game) => {
            n += 1;
            if(n == 0){
              document.getElementById("in").innerHTML = game.name;
              document.getElementById("ia").innerHTML = game.author;
              document.getElementById("iv").innerHTML = game.version;
              document.getElementById("bi").setAttribute("style", document.getElementById("bi").getAttribute("style").replace("hidden", uijson["main_menu"]["banner_image"]["visible"]))
              document.getElementById("bf").setAttribute("style", document.getElementById("bf").getAttribute("style").replace("visible", "hidden"));
              document.getElementById("bh").setAttribute("style", document.getElementById("bh").getAttribute("style").replace("visible", "hidden"));
              left = 98;
              return `<img width="256" height="256" style="position: absolute;top: ${top}; left: ${left}" src="${path.join(__dirname, "ulaunch", "game", game.icon)}" alt="game/${game.id}"/><input style="width:256;height:256;position: absolute;top: ${top}; left: ${left};z-index: 1;outline: none;border: none;background-color: transparent;pointer-events:auto;" type="button" id="${n}" alt="game/${game.id}"/>`
            } else {
              left += 276;
              return `<img width="256" height="256" style="position: absolute;top: ${top}; left: ${left}" src="${path.join(__dirname, "ulaunch", "game", game.icon)}" alt="game/${game.id}"/><input style="width:256;height:256;position: absolute;top: ${top}; left: ${left};z-index: 1;outline: none;border: none;background-color: transparent;pointer-events:auto;" type="button" id="${n}" alt="game/${game.id}"/>`
            }
          });
          let hb = folders.map(file => {
            if(file === "hbmenu"){
              n += 1;
              if(n == 0){
                document.getElementById("in").innerHTML = lang["hbmenu_launch"];
                document.getElementById("ia").innerHTML = "";
                document.getElementById("iv").innerHTML = "";
                document.getElementById("bi").setAttribute("style", document.getElementById("bi").getAttribute("style").replace("visible", "hidden"))
                document.getElementById("bf").setAttribute("style", document.getElementById("bf").getAttribute("style").replace("visible", "hidden"));
                document.getElementById("bh").setAttribute("style", document.getElementById("bh").getAttribute("style").replace("hidden", uijson["main_menu"]["banner_image"]["visible"]));
                left = 98;
              } else {
                left += 276;
              }
              return `<img width="256" height="256" style="position: absolute;top: ${top}; left: ${left}" src="${defaulticon.hbmenu}" alt="homebrew/${lang["hbmenu_launch"]}///hbmenu"/><input style="width:256;height:256;position: absolute;top: ${top}; left: ${left};z-index: 1;outline: none;border: none;background-color: transparent;pointer-events:auto;" type="button" id="${n}" alt="homebrew/${lang["hbmenu_launch"]}///hbmenu"/>`
            } else {
              let filename = file;
              file = path.join(ulaunchtester, "sdmc", "ulaunch", "entries", file);
              let content = require(file);
              if(content.icon == "" || content.icon == null || content.icon == undefined || !fs.existsSync(content.icon.replace("sdmc:", path.join(ulaunchtester, "sdmc"))) || content.type !== 2) return "";
              n += 1;
              if(n == 0){
                document.getElementById("in").innerHTML = content.name.substring(0, 0x1FF);
                document.getElementById("ia").innerHTML = content.author.substring(0, 0xFF);
                document.getElementById("iv").innerHTML = content.version.substring(0, 0xF);
                left = 98;
              } else {
                left += 276;
              }
              return `<img width="256" height="256" style="position: absolute;top: ${top}; left: ${left}" src="${content.icon.replace("sdmc:", path.join(ulaunchtester, "sdmc"))}" alt="homebrew/${content.name.substring(0, 0x1FF)}/${content.author.substring(0, 0xFF)}/${content.version.substring(0, 0xF)}/${filename}"/><input style="width:256;height:256;position: absolute;top: ${top}; left: ${left};z-index: 1;outline: none;border: none;background-color: transparent;pointer-events:auto;" type="button" id="${n}" alt="homebrew/${content.name.substring(0, 0x1FF)}/${content.author.substring(0, 0xFF)}/${content.version.substring(0, 0xF)}/${filename}"/>`;
            }
          });
          items = items.concat(hb);
          let cursor = (height-size.cursor.h)/2;
          let suspendedd = (height-size.suspended.h)/2;
          let multiselectt = (height-size.multiselect.h)/2;
          items.push(`<img width="${size.suspended.w}" height="${size.suspended.h}" style="position: absolute;top: ${suspendedd}; left: ${98-(size.suspended.w-256)/2};pointer-events:none;display:none;" src="${defaulticon.suspended}" id="suspended"/>`)
          items.push(`<img width="${size.cursor.w}" height="${size.cursor.h}" style="position: absolute;top: ${cursor}; left: ${98-(size.cursor.w-256)/2}" src="${defaulticon.cursor}" id="cursor" alt="0"/>`)
          items.push(`<div id="multiselect" style="position:absolute;top:0;left:0;width:100%;height:100%;background-color: transparent;pointer-events:none;"></div>`)
          items.push(`<input type="button" style="position: absolute;border:none;outline:none;background-color:transparent;top:0;width:1;height:1;left:${left+256+86}"/>`)
          items = items.join("");
          document.getElementById("items").innerHTML = items;
          if(suspended !== undefined){
            try {
              let item = $(`input[alt="${suspended}"]`).get(0).getAttribute("style");
              let l = item.split("left:")[1].split(";")[0];
              document.getElementById("suspended").setAttribute("style", `position: absolute;top: ${suspendedd}; left: ${l-(size.suspended.w-256)/2};pointer-events:none;display:none;`);
              $("#suspended").show();
            }catch(e){}
          }
          let max = 0;
          let selected = 0;
          let inputs = $("#items :input");
          max = inputs.length;
          switchem.on("y", () => {
            if(res || ress) return;
            ress = true;
            return new Promise(function(resolve, reject) {
              let mid = multiselect.length;
              multiselect.push(true);
              let div = $("#multiselect");
              div.show();
              div.append(`<img width="${size.multiselect.w}" height="${size.multiselect.h}" style="position: absolute;top: 0; left: ${parseInt($("#cursor").get(0).getAttribute("style").split("left:")[1].split(";")[0])+(size.cursor.w-256)/2-(size.multiselect.w-256)/2}" src="${defaulticon.multiselect}" id="${selected}"/>`);
              inputs.click((e) => {
                click(e.currentTarget.id);
              });
              switchem.on("y", () => {
                select(selected);
              });
              function select(id){
                if(res || !multiselect[mid]) return;
                let leftmultiselect = 98+276*parseInt(id)-(size.multiselect.w-256)/2;
                if($(`#multiselect #${id}`).get(0) === undefined){
                  div.append(`<img width="${size.multiselect.w}" height="${size.multiselect.h}" style="position: absolute;top: 0; left: ${leftmultiselect}" src="${defaulticon.multiselect}" id="${id}"/>`)
                }
              }
              switchem.on("arrowright", () => {
                click(selected+1);
              });
              switchem.on("lrightstart", () => {
                click(selected+1);
              });
              switchem.on("rrightstart", () => {
                click(selected+1);
              });
              switchem.on("arrowleft", () => {
                click(selected-1);
              });
              switchem.on("lleftstart", () => {
                click(selected-1);
              });
              switchem.on("rleftstart", () => {
                click(selected-1);
              });
              switchem.on("a", () => {
                dblclick(selected);
              });
              switchem.on("b", () => {
                if(res || !multiselect[mid]) return;
                multiselect[mid] = false;
                $("#multiselect").hide();
                document.getElementById("multiselect").innerHTML = "";
                ShowNotification(lang["menu_multiselect_cancel"], uijson);
                ress = false;
                res = false;
                resolve();
              });
              inputs.dblclick((e) => {
                dblclick(e.currentTarget.id);
              });
              function click(id){
                if(res || !multiselect[mid]) return;
                let input = document.getElementById(id);
                if(input === null) return;
                let cursor = ([size.cursor.h, size.multiselect.h, size.suspended.h].sort((a, b) => a > b)[0]-size.cursor.h)/2;
                let leftcursor = 98+276*parseInt(id)-(size.cursor.w-256)/2
                document.getElementById("cursor").setAttribute("alt", id);
                document.getElementById("cursor").setAttribute("style", `position: absolute;top: ${cursor}; left: ${leftcursor}`);
                selected = parseInt(id);
                document.getElementById("cursor").setAttribute("style", `position: absolute;top: 0; left: ${leftcursor}`);
                let alt = input.getAttribute("alt");
                if(alt.startsWith("game")){
                  let game = games.find(g => g.id === alt.split("/")[1]);
                  document.getElementById("in").innerHTML = game.name;
                  document.getElementById("ia").innerHTML = game.author;
                  document.getElementById("iv").innerHTML = game.version;
                  document.getElementById("bi").setAttribute("style", document.getElementById("bi").getAttribute("style").replace("hidden", uijson["main_menu"]["banner_image"]["visible"]))
                  document.getElementById("bf").setAttribute("style", document.getElementById("bf").getAttribute("style").replace("visible", "hidden"));
                  document.getElementById("bh").setAttribute("style", document.getElementById("bh").getAttribute("style").replace("visible", "hidden"));
                } else if(alt.startsWith("folder")){
                  let name = alt.split("/")[2];
                  let entry = alt.split("/")[1];
                  document.getElementById("in").innerHTML = name;
                  document.getElementById("ia").innerHTML = entry;
                  document.getElementById("iv").innerHTML = "";
                  document.getElementById("bi").setAttribute("style", document.getElementById("bi").getAttribute("style").replace("visible", "hidden"))
                  document.getElementById("bf").setAttribute("style", document.getElementById("bf").getAttribute("style").replace("hidden", uijson["main_menu"]["banner_image"]["visible"]));
                  document.getElementById("bh").setAttribute("style", document.getElementById("bh").getAttribute("style").replace("visible", "hidden"));
                } else if(alt.startsWith("homebrew")){
                  alt = alt.split("/");
                  document.getElementById("in").innerHTML = alt[1];
                  document.getElementById("ia").innerHTML = alt[2];
                  document.getElementById("iv").innerHTML = alt[3];
                  document.getElementById("bi").setAttribute("style", document.getElementById("bi").getAttribute("style").replace("visible", "hidden"))
                  document.getElementById("bf").setAttribute("style", document.getElementById("bf").getAttribute("style").replace("visible", "hidden"));
                  document.getElementById("bh").setAttribute("style", document.getElementById("bh").getAttribute("style").replace("hidden", uijson["main_menu"]["banner_image"]["visible"]));
                }
                let scroll = document.getElementById("items").scrollLeft;
                if(selected*276 > scroll){
                  if(selected*276-276*3 < scroll) return;
                  $(`#items`).animate({
                      scrollLeft: selected*276-276*3
                  }, 0);
                } else {
                  $(`#items`).animate({
                      scrollLeft: selected*276
                  }, 0);
                }
              }
              async function dblclick(){
                if(res || !multiselect[mid]) return;
                let resss = false;
                res = true;
                let dialog = await createDialog(lang["menu_multiselect"], lang["menu_move_from_folder"], [lang["yes"], lang["no"]]);
                $("#ulaunchscreen").append(dialog);
                let inputs = $("#dialog :input");
                selected = 0;
                let max = inputs.length;
                inputs.click((e) => {
                  click(e.currentTarget.id);
                });
                switchem.on("arrowright", () => {
                  click(selected+1);
                });
                switchem.on("lrightstart", () => {
                  click(selected+1);
                });
                switchem.on("rrightstart", () => {
                  click(selected+1);
                });
                switchem.on("arrowleft", () => {
                  click(selected-1);
                });
                switchem.on("lleftstart", () => {
                  click(selected-1);
                });
                switchem.on("rleftstart", () => {
                  click(selected-1);
                });
                switchem.on("a", () => {
                  dblclick(selected);
                });
                inputs.dblclick((e) => {
                  dblclick(e.currentTarget.id);
                });
                function click(id){
                  if(resss) return;
                  let input = $(`#dialog #${id}`).get(0);
                  let before = $(`#dialog #${selected}`).get(0);
                  if(input === undefined) return;
                  before.setAttribute("style", before.getAttribute("style").replace("#B4B4C8FF", "#B4B4C800"));
                  input.setAttribute("style", input.getAttribute("style").replace("#B4B4C800", "#B4B4C8FF"));
                  selected = parseInt(id);
                }
                function dblclick(id){
                  if(resss) return;
                  if(id == 0){
                    let imgs = $("#multiselect img");
                    for(var i=0; i<imgs.length; i++){
                      let img = imgs.get(i);
                      let title = $(`#items #${img.id}`).get(0);
                      let titlealt = title.getAttribute("alt");
                      let name;
                      if(titlealt.startsWith("game")){
                        name = titlealt.split("/")[1];
                      } else if(titlealt.startsWith("homebrew")){
                        name = titlealt.split("/")[4];
                      }
                      menuitems.folders[fname] = menuitems.folders[fname].filter(i => i !== name);
                    }
                    if(`${menuitems.folders[fname]}`.length == 0){
                      delete menuitems.folders[fname];
                    }
                    fs.writeFileSync(path.join(ulaunchtester, "testersettings", "menuitems.json"), JSON.stringify(menuitems, null, 2), (err) => {if(err) throw err});
                    multiselect[mid] = false;
                    $("#dialog").remove();
                    $("#multiselect").hide();
                    document.getElementById("multiselect").innerHTML = "";
                    resss = true;
                    selected = 0;
                    ress = true;
                    res = false;
                    if(multiselect.filter(n => n == true)[0]){
                      multiselect = multiselect.map(n => false);
                      $("#multiselect").hide();
                      document.getElementById("multiselect").innerHTML = "";
                      ShowNotification(lang["menu_multiselect_cancel"], uijson);
                    }
                    $(`#items`).animate({
                      scrollLeft: 0
                    }, 0);
                    if(menuitems.folders[fname] == undefined){
                      lmenuitems();
                    } else {
                      folderitems(fname);
                    }
                    resolve();
                  } else {
                    multiselect[mid] = false;
                    $("#multiselect").hide();
                    document.getElementById("multiselect").innerHTML = "";
                    resss = true;
                    ress = false;
                    res = false;
                    $("#dialog").remove();
                    resolve();
                  }
                }
              }
            });
          });
          inputs.click((e) => {
            click(e.currentTarget.id);
          });
          switchem.on("arrowright", () => {
            click(selected+1);
          });
          switchem.on("lrightstart", () => {
            click(selected+1);
          });
          switchem.on("rrightstart", () => {
            click(selected+1);
          });
          switchem.on("arrowleft", () => {
            click(selected-1);
          });
          switchem.on("lleftstart", () => {
            click(selected-1);
          });
          switchem.on("rleftstart", () => {
            click(selected-1);
          });
          switchem.on("a", () => {
            dblclick(selected);
          });
          switchem.on("x", async () => {
            if(res || ress) return;
            if(document.getElementById($("#cursor").get(0).getAttribute("alt")).getAttribute("alt") !== suspended) return;
            let resss = false;
            res = true;
            let dialog = await createDialog(lang["suspended_app"], lang["suspended_close"], [lang["yes"], lang["cancel"]]);
            $("#ulaunchscreen").append(dialog);
            let inputs = $("#dialog :input");
            let selected = 0;
            let max = inputs.length;
            inputs.click((e) => {
              click(e.currentTarget.id);
            });
            switchem.on("arrowright", () => {
              click(selected+1);
            });
            switchem.on("lrightstart", () => {
              click(selected+1);
            });
            switchem.on("rrightstart", () => {
              click(selected+1);
            });
            switchem.on("arrowleft", () => {
              click(selected-1);
            });
            switchem.on("lleftstart", () => {
              click(selected-1);
            });
            switchem.on("rleftstart", () => {
              click(selected-1);
            });
            switchem.on("a", () => {
              dblclick(selected);
            });
            inputs.dblclick((e) => {
              dblclick(e.currentTarget.id);
            });
            function click(id){
              if(ress) return;
              let input = $(`#dialog #${id}`).get(0);
              let before = $(`#dialog #${selected}`).get(0);
              if(input === undefined) return;
              before.setAttribute("style", before.getAttribute("style").replace("#B4B4C8FF", "#B4B4C800"));
              input.setAttribute("style", input.getAttribute("style").replace("#B4B4C800", "#B4B4C8FF"));
              selected = parseInt(id);
            }
            function dblclick(id){
              if(resss) return;
              if(id == 0){
                $("#title").remove();
                $("#suspended").hide();
                $("#suspendedimgg").hide();
                suspended = undefined;
                resss = true;
                res = false;
                $("#dialog").remove();
                resolve();
              } else {
                resss = true;
                res = false;
                $("#dialog").remove();
                resolve();
              }
            }
          });
          switchem.on("b", () => {
            if(ress || res) return;
            ress = true;
            lmenuitems();
          });
          inputs.dblclick((e) => {
            dblclick(e.currentTarget.id);
          });
          function click(id){
            if(ress || res) return;
            let input = document.getElementById(id);
            if(input === null) return;
            let cursor = ([size.cursor.h, size.multiselect.h, size.suspended.h].sort((a, b) => a > b)[0]-size.cursor.h)/2;
            let leftcursor = 98+276*parseInt(id)-(size.cursor.w-256)/2
            selected = parseInt(id);
            document.getElementById("cursor").setAttribute("alt", id);
            document.getElementById("cursor").setAttribute("style", `position: absolute;top: ${cursor}; left: ${leftcursor}`);
            let alt = input.getAttribute("alt");
            if(alt.startsWith("game")){
              let game = games.find(g => g.id === alt.split("/")[1]);
              document.getElementById("in").innerHTML = game.name;
              document.getElementById("ia").innerHTML = game.author;
              document.getElementById("iv").innerHTML = game.version;
              document.getElementById("bi").setAttribute("style", document.getElementById("bi").getAttribute("style").replace("hidden", uijson["main_menu"]["banner_image"]["visible"]))
              document.getElementById("bf").setAttribute("style", document.getElementById("bf").getAttribute("style").replace("visible", "hidden"));
              document.getElementById("bh").setAttribute("style", document.getElementById("bh").getAttribute("style").replace("visible", "hidden"));
            } else if(alt.startsWith("homebrew")){
              alt = alt.split("/");
              document.getElementById("in").innerHTML = alt[1];
              document.getElementById("ia").innerHTML = alt[2];
              document.getElementById("iv").innerHTML = alt[3];
              document.getElementById("bi").setAttribute("style", document.getElementById("bi").getAttribute("style").replace("visible", "hidden"))
              document.getElementById("bf").setAttribute("style", document.getElementById("bf").getAttribute("style").replace("visible", "hidden"));
              document.getElementById("bh").setAttribute("style", document.getElementById("bh").getAttribute("style").replace("hidden", uijson["main_menu"]["banner_image"]["visible"]));
            }
            let scroll = document.getElementById("items").scrollLeft;
            if(selected*276 > scroll){
              if(selected*276-276*3 < scroll) return;
              $(`#items`).animate({
                  scrollLeft: selected*276-276*3
              }, 0);
            } else {
              $(`#items`).animate({
                  scrollLeft: selected*276
              }, 0);
            }
          }
          async function dblclick(id){
            if(ress || res) return;
            let alt = document.getElementById(id).getAttribute("alt");
            if(document.getElementById(id).getAttribute("alt") === suspended){
              res = true;
              if(sound){
                sound.stop();
                fadetimeout.stop();
              };
              if(titlelaunch !== undefined){
                if(titlelaunch.playing()) titlelaunch.stop();
                titlelaunch.play();
              }
              $("#title").animate({width: 1280,height:720,opacity:1}, 1000, () => {
                $("#title").remove();
                $("#ulaunchscreen").append(`<input type="button" style="background-color:#222;z-index:99;outline:none;border:none;position:absolute;top:0;left:0;width:1280;height:720" id="title"/>`);
                setTimeout(() => {
                  $("#title").remove();
                  suspended = alt;
                  if(sound){
                    sound.play();
                    fadetimeout.resume();
                  };
                  $("#suspendedimg").append(`<input type="button" style="background-color:#222;outline:none;border:none;top:50%;left:50%;transform:translate(-50%, -50%);position:absolute;width:1280;height:720;" id="title"/>`);
                  $("#title").animate({width: 1008,height:567,opacity:parseInt(uijson["suspended_final_alpha"])/255}, 1000, () => {
                    res = false;
                  });
                  let item = document.getElementById(iid).getAttribute("style");
                  let l = item.split("left:")[1].split(";")[0];
                  document.getElementById("suspended").setAttribute("style", `position: absolute;top: ${suspendedd}; left: ${l-(size.suspended.w-256)/2};pointer-events:none;display:none;`)
                  $("#suspended").show();
                }, 1000);
              });
            } else {
              let iid = id;
              if(suspended !== undefined){
                let ret = await new Promise(async function(resolve, reject) {
                  let resss = false;
                  res = true;
                  let dialog = await createDialog(lang["suspended_app"], lang["suspended_close"], [lang["yes"], lang["cancel"]]);
                  $("#ulaunchscreen").append(dialog);
                  let inputs = $("#dialog :input");
                  let selected = 0;
                  let max = inputs.length;
                  inputs.click((e) => {
                    click(e.currentTarget.id);
                  });
                  switchem.on("arrowright", () => {
                    click(selected+1);
                  });
                  switchem.on("lrightstart", () => {
                    click(selected+1);
                  });
                  switchem.on("rrightstart", () => {
                    click(selected+1);
                  });
                  switchem.on("arrowleft", () => {
                    click(selected-1);
                  });
                  switchem.on("lleftstart", () => {
                    click(selected-1);
                  });
                  switchem.on("rleftstart", () => {
                    click(selected-1);
                  });
                  switchem.on("a", () => {
                    dblclick(selected);
                  });
                  inputs.dblclick((e) => {
                    dblclick(e.currentTarget.id);
                  });
                  function click(id){
                    if(ress) return;
                    let input = $(`#dialog #${id}`).get(0);
                    let before = $(`#dialog #${selected}`).get(0);
                    if(input === undefined) return;
                    before.setAttribute("style", before.getAttribute("style").replace("#B4B4C8FF", "#B4B4C800"));
                    input.setAttribute("style", input.getAttribute("style").replace("#B4B4C800", "#B4B4C8FF"));
                    selected = parseInt(id);
                  }
                  function dblclick(id){
                    if(resss) return;
                    if(id == 0){
                      $("#title").remove();
                      $("#suspended").hide();
                      $("#suspendedimgg").hide();
                      suspended = undefined;
                      resss = true;
                      res = false;
                      $("#dialog").remove();
                      resolve(false);
                    } else {
                      resss = true;
                      res = false;
                      $("#dialog").remove();
                      resolve(true);
                    }
                  }
                });
                if(ret) return;
              }
              if(alt.startsWith("homebrew")) {
                if(testersettings["flog_enabled"] == "True"){
                  res = true;
                  let dialog = await createDialog(lang["hb_launch"], lang["hb_launch_conf"], [lang["hb_applet"], lang["hb_app"], lang["cancel"]]);
                  $("#ulaunchscreen").append(dialog);
                  let inputs = $("#dialog :input");
                  let selected = 0;
                  let max = inputs.length;
                  inputs.click((e) => {
                    click(e.currentTarget.id);
                  });
                  switchem.on("arrowright", () => {
                    click(selected+1);
                  });
                  switchem.on("lrightstart", () => {
                    click(selected+1);
                  });
                  switchem.on("rrightstart", () => {
                    click(selected+1);
                  });
                  switchem.on("arrowleft", () => {
                    click(selected-1);
                  });
                  switchem.on("lleftstart", () => {
                    click(selected-1);
                  });
                  switchem.on("rleftstart", () => {
                    click(selected-1);
                  });
                  switchem.on("a", () => {
                    dblclick(selected);
                  });
                  inputs.dblclick((e) => {
                    dblclick(e.currentTarget.id);
                  });
                  function click(id){
                    if(ress) return;
                    let input = $(`#dialog #${id}`).get(0);
                    let before = $(`#dialog #${selected}`).get(0);
                    if(input === undefined) return;
                    before.setAttribute("style", before.getAttribute("style").replace("#B4B4C8FF", "#B4B4C800"));
                    input.setAttribute("style", input.getAttribute("style").replace("#B4B4C800", "#B4B4C8FF"));
                    selected = parseInt(id);
                  }
                  function dblclick(id){
                    if(ress) return;
                    if(id == 0){
                      $("#dialog").remove();
                      if(sound){
                        sound.stop();
                        fadetimeout.stop();
                      };
                      if(titlelaunch !== undefined){
                        if(titlelaunch.playing()) titlelaunch.stop();
                        titlelaunch.play();
                      }
                      $("#ulaunchscreen").append(`<input type="button" style="background-color:#222;z-index:99;outline:none;border:none;position:absolute;top:0;left:0;width:1280;height:720" id="title"/>`);
                      setTimeout(() => {
                        $("#title").remove();
                        if(sound){
                          sound.play();
                          fadetimeout.resume();
                        };
                        res = false;
                      }, 1000);
                    } else if(id == 1){
                      $("#dialog").remove();
                      if(sound){
                        sound.stop();
                        fadetimeout.stop();
                      };
                      if(titlelaunch !== undefined){
                        if(titlelaunch.playing()) titlelaunch.stop();
                        titlelaunch.play();
                      }
                      $("#ulaunchscreen").append(`<input type="button" style="background-color:#222;z-index:99;outline:none;border:none;position:absolute;top:0;left:0;width:1280;height:720" id="title"/>`);
                      setTimeout(() => {
                        $("#title").remove();
                        suspended = alt;
                        if(sound){
                          sound.play();
                          fadetimeout.resume();
                        };
                        $("#suspendedimg").append(`<input type="button" style="background-color:#222;outline:none;border:none;top:50%;left:50%;transform:translate(-50%, -50%);position:absolute;width:1280;height:720;" id="title"/>`);
                        $("#title").animate({width: 1008,height:567,opacity:parseInt(uijson["suspended_final_alpha"])/255}, 1000, () => {
                          res = false;
                        });
                        let item = document.getElementById(iid).getAttribute("style");
                        let l = item.split("left:")[1].split(";")[0];
                        document.getElementById("suspended").setAttribute("style", `position: absolute;top: ${suspendedd}; left: ${l-(size.suspended.w-256)/2};pointer-events:none;display:none;`)
                        $("#suspended").show();
                      }, 1000);
                    } else if(id == 2){
                      res = false;
                      $("#dialog").remove();
                    }
                  }
                } else {
                  $("#dialog").remove();
                  if(sound){
                    sound.stop();
                    fadetimeout.stop();
                  };
                  if(titlelaunch !== undefined){
                    if(titlelaunch.playing()) titlelaunch.stop();
                    titlelaunch.play();
                  }
                  $("#ulaunchscreen").append(`<input type="button" style="background-color:#222;z-index:99;outline:none;border:none;position:absolute;top:0;left:0;width:1280;height:720" id="title"/>`);
                  setTimeout(() => {
                    $("#title").remove();
                    if(sound){
                      sound.play();
                      fadetimeout.resume();
                    };
                    res = false;
                  }, 1000);
                }
              } else {
                if(sound){
                  sound.stop();
                  fadetimeout.stop();
                };
                if(titlelaunch !== undefined){
                  if(titlelaunch.playing()) titlelaunch.stop();
                  titlelaunch.play();
                }
                $("#ulaunchscreen").append(`<input type="button" style="background-color:#222;z-index:99;outline:none;border:none;position:absolute;top:0;left:0;width:1280;height:720" id="title"/>`);
                setTimeout(() => {
                  $("#title").remove();
                  suspended = alt;
                  if(sound){
                    sound.play();
                    fadetimeout.resume();
                  };
                  $("#suspendedimg").append(`<input type="button" style="background-color:#222;outline:none;border:none;top:50%;left:50%;transform:translate(-50%, -50%);position:absolute;width:1280;height:720;" id="title"/>`);
                  $("#title").animate({width: 1008,height:567,opacity:parseInt(uijson["suspended_final_alpha"])/255}, 1000, () => {
                    res = false;
                  });
                  let item = document.getElementById(iid).getAttribute("style");
                  let l = item.split("left:")[1].split(";")[0];
                  document.getElementById("suspended").setAttribute("style", `position: absolute;top: ${suspendedd}; left: ${l-(size.suspended.w-256)/2};pointer-events:none;display:none;`)
                  $("#suspended").show();
                }, 1000);
              }
            }
          }
          $("#toggleclick").click(() => {
            hbmenu();
          });
          switchem.on("minus", () => {
            hbmenu();
          });
          function hbmenu(){
            if(ress || res) return;
            if(menutoggle !== undefined){
              if(menutoggle.playing()) menutoggle.stop();
              menutoggle.play();
            }
            if(multiselect.filter(n => n == true)[0]){
              multiselect = multiselect.map(n => false);
              $("#multiselect").hide();
              document.getElementById("multiselect").innerHTML = "";
              ShowNotification(lang["menu_multiselect_cancel"], uijson);
            }
            ress = true;
            hbitems();
          }
        });
      }
      function hbitems(){
        return new Promise(function(resolve, reject) {
          let ress = false;
          document.getElementById("bi").setAttribute("style", document.getElementById("bi").getAttribute("style").replace("visible", "hidden"))
          document.getElementById("bf").setAttribute("style", document.getElementById("bf").getAttribute("style").replace("visible", "hidden"));
          document.getElementById("bh").setAttribute("style", document.getElementById("bh").getAttribute("style").replace("hidden", uijson["main_menu"]["banner_image"]["visible"]));
          document.getElementById("in").innerHTML = lang["hbmenu_launch"];
          document.getElementById("ia").innerHTML = "";
          document.getElementById("iv").innerHTML = "";
          let height = [size.cursor.h, size.multiselect.h, size.suspended.h].sort((a, b) => a > b)[0];
          let top = (height-256)/2;
          let menuitems = require(path.join(ulaunchtester, "testersettings", "menuitems.json"));
          let menuhb = menuitems.hb;
          let jsonsfiles = getFiles(path.join(ulaunchtester, "sdmc", "ulaunch", "entries"));
          let left = 98;
          let n = 0;
          let items = [];
          items.push(`<img width="256" height="256" style="position: absolute;top: ${top}; left: ${left}" src="${defaulticon.hbmenu}" alt="homebrew/${lang["hbmenu_launch"]}///hbmenu"/><input style="width:256;height:256;position: absolute;top: ${top}; left: ${left};z-index: 1;outline: none;border: none;background-color: transparent;pointer-events:auto;" type="button" id="${n}" alt="homebrew/${lang["hbmenu_launch"]}///hbmenu"/>`)
          let cursor = (height-size.cursor.h)/2;
          let suspendedd = (height-size.suspended.h)/2;
          let multiselectt = (height-size.multiselect.h)/2;
          let hbi = jsonsfiles.map(file => {
            if(!file.endsWith(".json")) return "";
            let content = require(file);
            if(content.icon == "" || content.icon == null || content.icon == undefined || !fs.existsSync(content.icon.replace("sdmc:", path.join(ulaunchtester, "sdmc"))) || content.type !== 2) return "";
            left += 276;
            n += 1;
            return `<img width="256" height="256" style="position: absolute;top: ${top}; left: ${left}" src="${content.icon.replace("sdmc:", path.join(ulaunchtester, "sdmc"))}" alt="homebrew/${content.name.substring(0, 0x1FF)}/${content.author.substring(0, 0xFF)}/${content.version.substring(0, 0xF)}/${path.basename(file)}"/><input style="width:256;height:256;position: absolute;top: ${top}; left: ${left};z-index: 1;outline: none;border: none;background-color: transparent;pointer-events:auto;" type="button" id="${n}" alt="homebrew/${content.name.substring(0, 0x1FF)}/${content.author.substring(0, 0xFF)}/${content.version.substring(0, 0xF)}/${path.basename(file)}"/>`;
          });
          items = items.concat(hbi);
          items.push(`<img width="${size.suspended.w}" height="${size.suspended.h}" style="position: absolute;top: ${suspendedd}; left: ${98-(size.suspended.w-256)/2};pointer-events:none;display:none;" src="${defaulticon.suspended}" id="suspended"/>`)
          items.push(`<img width="${size.cursor.w}" height="${size.cursor.h}" style="position: absolute;top: ${cursor}; left: ${98-(size.cursor.w-256)/2};pointer-events:none;" src="${defaulticon.cursor}" id="cursor" alt="0"/>`)
          items.push(`<div id="multiselect" style="position:absolute;top:0;left:0;width:100%;height:100%;background-color: transparent;pointer-events:none;"></div>`)
          items.push(`<input type="button" style="position: absolute;border:none;outline:none;background-color:transparent;top:0;width:1;height:1;left:${left+256+86}"/>`)
          items = items.join("");
          document.getElementById("items").innerHTML = items;
          if(suspended !== undefined){
            try {
              let item = $(`input[alt="${suspended}"]`).get(0).getAttribute("style");
              let l = item.split("left:")[1].split(";")[0];
              document.getElementById("suspended").setAttribute("style", `position: absolute;top: ${suspendedd}; left: ${l-(size.suspended.w-256)/2};pointer-events:none;display:none;`);
              $("#suspended").show();
            }catch(e){}
          }
          let max = 0;
          let selected = 0;
          let inputs = $("#items :input");
          max = inputs.length;
          switchem.on("y", () => {
            if(res || ress) return;
            ress = true;
            return new Promise(function(resolve, reject) {
              let mid = multiselect.length;
              multiselect.push(true);
              let div = $("#multiselect");
              div.show();
              div.append(`<img width="${size.multiselect.w}" height="${size.multiselect.h}" style="position: absolute;top: 0; left: ${parseInt($("#cursor").get(0).getAttribute("style").split("left:")[1].split(";")[0])+(size.cursor.w-256)/2-(size.multiselect.w-256)/2}" src="${defaulticon.multiselect}" id="${selected}"/>`);
              inputs.click((e) => {
                click(e.currentTarget.id);
              });
              switchem.on("y", () => {
                select(selected);
              });
              function select(id){
                if(res || !multiselect[mid]) return;
                let leftmultiselect = 98+276*parseInt(id)-(size.multiselect.w-256)/2;
                if($(`#multiselect #${id}`).get(0) === undefined){
                  div.append(`<img width="${size.multiselect.w}" height="${size.multiselect.h}" style="position: absolute;top: 0; left: ${leftmultiselect}" src="${defaulticon.multiselect}" id="${id}"/>`)
                }
              }
              switchem.on("arrowright", () => {
                click(selected+1);
              });
              switchem.on("lrightstart", () => {
                click(selected+1);
              });
              switchem.on("rrightstart", () => {
                click(selected+1);
              });
              switchem.on("arrowleft", () => {
                click(selected-1);
              });
              switchem.on("lleftstart", () => {
                click(selected-1);
              });
              switchem.on("rleftstart", () => {
                click(selected-1);
              });
              switchem.on("a", () => {
                dblclick(selected);
              });
              switchem.on("b", () => {
                if(res || !multiselect[mid]) return;
                multiselect[mid] = false;
                $("#multiselect").hide();
                document.getElementById("multiselect").innerHTML = "";
                ShowNotification(lang["menu_multiselect_cancel"], uijson);
                ress = false;
                res = false;
                resolve();
              });
              inputs.dblclick((e) => {
                dblclick(e.currentTarget.id);
              });
              function click(id){
                if(res || !multiselect[mid]) return;
                let input = document.getElementById(id);
                if(input === null) return;
                let cursor = ([size.cursor.h, size.multiselect.h, size.suspended.h].sort((a, b) => a > b)[0]-size.cursor.h)/2;
                let leftcursor = 98+276*parseInt(id)-(size.cursor.w-256)/2
                document.getElementById("cursor").setAttribute("alt", id);
                document.getElementById("cursor").setAttribute("style", `position: absolute;top: ${cursor}; left: ${leftcursor}`);
                selected = parseInt(id);
                document.getElementById("cursor").setAttribute("style", `position: absolute;top: 0; left: ${leftcursor}`);
                let alt = input.getAttribute("alt");
                if(alt.startsWith("game")){
                  let game = games.find(g => g.id === alt.split("/")[1]);
                  document.getElementById("in").innerHTML = game.name;
                  document.getElementById("ia").innerHTML = game.author;
                  document.getElementById("iv").innerHTML = game.version;
                  document.getElementById("bi").setAttribute("style", document.getElementById("bi").getAttribute("style").replace("hidden", uijson["main_menu"]["banner_image"]["visible"]))
                  document.getElementById("bf").setAttribute("style", document.getElementById("bf").getAttribute("style").replace("visible", "hidden"));
                  document.getElementById("bh").setAttribute("style", document.getElementById("bh").getAttribute("style").replace("visible", "hidden"));
                } else if(alt.startsWith("folder")){
                  let name = alt.split("/")[2];
                  let entry = alt.split("/")[1];
                  document.getElementById("in").innerHTML = name;
                  document.getElementById("ia").innerHTML = entry;
                  document.getElementById("iv").innerHTML = "";
                  document.getElementById("bi").setAttribute("style", document.getElementById("bi").getAttribute("style").replace("visible", "hidden"))
                  document.getElementById("bf").setAttribute("style", document.getElementById("bf").getAttribute("style").replace("hidden", uijson["main_menu"]["banner_image"]["visible"]));
                  document.getElementById("bh").setAttribute("style", document.getElementById("bh").getAttribute("style").replace("visible", "hidden"));
                } else if(alt.startsWith("homebrew")){
                  alt = alt.split("/");
                  document.getElementById("in").innerHTML = alt[1];
                  document.getElementById("ia").innerHTML = alt[2];
                  document.getElementById("iv").innerHTML = alt[3];
                  document.getElementById("bi").setAttribute("style", document.getElementById("bi").getAttribute("style").replace("visible", "hidden"))
                  document.getElementById("bf").setAttribute("style", document.getElementById("bf").getAttribute("style").replace("visible", "hidden"));
                  document.getElementById("bh").setAttribute("style", document.getElementById("bh").getAttribute("style").replace("hidden", uijson["main_menu"]["banner_image"]["visible"]));
                }
                let scroll = document.getElementById("items").scrollLeft;
                if(selected*276 > scroll){
                  if(selected*276-276*3 < scroll) return;
                  $(`#items`).animate({
                      scrollLeft: selected*276-276*3
                  }, 0);
                } else {
                  $(`#items`).animate({
                      scrollLeft: selected*276
                  }, 0);
                }
              }
              async function dblclick(){
                if(res || !multiselect[mid]) return;
                let resss = false;
                res = true;
                let dialog = await createDialog(lang["menu_multiselect"], lang["hb_mode_entries_add"], [lang["yes"], lang["no"]]);
                $("#ulaunchscreen").append(dialog);
                let inputs = $("#dialog :input");
                selected = 0;
                let max = inputs.length;
                inputs.click((e) => {
                  click(e.currentTarget.id);
                });
                switchem.on("arrowright", () => {
                  click(selected+1);
                });
                switchem.on("lrightstart", () => {
                  click(selected+1);
                });
                switchem.on("rrightstart", () => {
                  click(selected+1);
                });
                switchem.on("arrowleft", () => {
                  click(selected-1);
                });
                switchem.on("lleftstart", () => {
                  click(selected-1);
                });
                switchem.on("rleftstart", () => {
                  click(selected-1);
                });
                switchem.on("a", () => {
                  dblclick(selected);
                });
                inputs.dblclick((e) => {
                  dblclick(e.currentTarget.id);
                });
                function click(id){
                  if(resss) return;
                  let input = $(`#dialog #${id}`).get(0);
                  let before = $(`#dialog #${selected}`).get(0);
                  if(input === undefined) return;
                  before.setAttribute("style", before.getAttribute("style").replace("#B4B4C8FF", "#B4B4C800"));
                  input.setAttribute("style", input.getAttribute("style").replace("#B4B4C800", "#B4B4C8FF"));
                  selected = parseInt(id);
                }
                function dblclick(id){
                  if(resss) return;
                  if(id == 0){
                    let imgs = $("#multiselect img");
                    let hb = [];
                    for(var i=0; i<imgs.length; i++){
                      let img = imgs.get(i);
                      let title = $(`#items #${img.id}`).get(0);
                      let titlealt = title.getAttribute("alt");
                      hb.push(titlealt.split("/")[4]);
                    }
                    hb = menuitems.hb.concat(hb);
                    menuitems.hb = menuitems.hb.concat(hb).filter((v,i) => hb.indexOf(v) === i);
                    fs.writeFileSync(path.join(ulaunchtester, "testersettings", "menuitems.json"), JSON.stringify(menuitems, null, 2), (err) => {if(err) throw err});
                    multiselect[mid] = false;
                    $("#dialog").remove();
                    $("#multiselect").hide();
                    document.getElementById("multiselect").innerHTML = "";
                    resss = true;
                    selected = 0;
                    ress = true;
                    res = false;
                    if(multiselect.filter(n => n == true)[0]){
                      multiselect = multiselect.map(n => false);
                      $("#multiselect").hide();
                      document.getElementById("multiselect").innerHTML = "";
                      ShowNotification(lang["menu_multiselect_cancel"], uijson);
                    }
                    $(`#items`).animate({
                      scrollLeft: 0
                    }, 0);
                    ShowNotification(lang["hb_mode_entries_added"], uijson);
                    hbitems();
                    resolve();
                  } else {
                    multiselect[mid] = false;
                    $("#multiselect").hide();
                    document.getElementById("multiselect").innerHTML = "";
                    resss = true;
                    ress = false;
                    res = false;
                    $("#dialog").remove();
                    resolve();
                  }
                }
              }
            });
          });
          inputs.click((e) => {
            click(e.currentTarget.id);
          });
          switchem.on("arrowright", () => {
            click(selected+1);
          });
          switchem.on("lrightstart", () => {
            click(selected+1);
          });
          switchem.on("rrightstart", () => {
            click(selected+1);
          });
          switchem.on("arrowleft", () => {
            click(selected-1);
          });
          switchem.on("lleftstart", () => {
            click(selected-1);
          });
          switchem.on("rleftstart", () => {
            click(selected-1);
          });
          switchem.on("a", () => {
            dblclick(selected);
          });
          switchem.on("x", async () => {
            if(res || ress) return;
            if(document.getElementById($("#cursor").get(0).getAttribute("alt")).getAttribute("alt") !== suspended) return;
            let resss = false;
            res = true;
            let dialog = await createDialog(lang["suspended_app"], lang["suspended_close"], [lang["yes"], lang["cancel"]]);
            $("#ulaunchscreen").append(dialog);
            let inputs = $("#dialog :input");
            let selected = 0;
            let max = inputs.length;
            inputs.click((e) => {
              click(e.currentTarget.id);
            });
            switchem.on("arrowright", () => {
              click(selected+1);
            });
            switchem.on("lrightstart", () => {
              click(selected+1);
            });
            switchem.on("rrightstart", () => {
              click(selected+1);
            });
            switchem.on("arrowleft", () => {
              click(selected-1);
            });
            switchem.on("lleftstart", () => {
              click(selected-1);
            });
            switchem.on("rleftstart", () => {
              click(selected-1);
            });
            switchem.on("a", () => {
              dblclick(selected);
            });
            inputs.dblclick((e) => {
              dblclick(e.currentTarget.id);
            });
            function click(id){
              if(ress) return;
              let input = $(`#dialog #${id}`).get(0);
              let before = $(`#dialog #${selected}`).get(0);
              if(input === undefined) return;
              before.setAttribute("style", before.getAttribute("style").replace("#B4B4C8FF", "#B4B4C800"));
              input.setAttribute("style", input.getAttribute("style").replace("#B4B4C800", "#B4B4C8FF"));
              selected = parseInt(id);
            }
            function dblclick(id){
              if(resss) return;
              if(id == 0){
                $("#title").remove();
                $("#suspended").hide();
                $("#suspendedimgg").hide();
                suspended = undefined;
                resss = true;
                res = false;
                $("#dialog").remove();
                resolve();
              } else {
                resss = true;
                res = false;
                $("#dialog").remove();
                resolve();
              }
            }
          });
          inputs.dblclick((e) => {
            dblclick(e.currentTarget.id);
          });
          function click(id){
            if(ress || res) return;
            let input = document.getElementById(id);
            if(input === null) return;
            let cursor = ([size.cursor.h, size.multiselect.h, size.suspended.h].sort((a, b) => a > b)[0]-size.cursor.h)/2;
            let leftcursor = 98+276*parseInt(id)-(size.cursor.w-256)/2
            selected = parseInt(id);
            document.getElementById("cursor").setAttribute("alt", id);
            document.getElementById("cursor").setAttribute("style", `position: absolute;top: ${cursor}; left: ${leftcursor}`);
            let alt = input.getAttribute("alt").split("/");
            document.getElementById("in").innerHTML = alt[1];
            document.getElementById("ia").innerHTML = alt[2];
            document.getElementById("iv").innerHTML = alt[3];
            let scroll = document.getElementById("items").scrollLeft;
            if(selected*276 > scroll){
              if(selected*276-276*3 < scroll) return;
              $(`#items`).animate({
                  scrollLeft: selected*276-276*3
              }, 0);
            } else {
              $(`#items`).animate({
                  scrollLeft: selected*276
              }, 0);
            }
          }
          async function dblclick(id){
            if(ress || res) return;
            let alt = document.getElementById(id).getAttribute("alt");
            if(document.getElementById(id).getAttribute("alt") === suspended){
              res = true;
              if(sound){
                sound.stop();
                fadetimeout.stop();
              };
              if(titlelaunch !== undefined){
                if(titlelaunch.playing()) titlelaunch.stop();
                titlelaunch.play();
              }
              $("#title").animate({width: 1280,height:720,opacity:1}, 1000, () => {
                $("#title").remove();
                $("#ulaunchscreen").append(`<input type="button" style="background-color:#222;z-index:99;outline:none;border:none;position:absolute;top:0;left:0;width:1280;height:720" id="title"/>`);
                setTimeout(() => {
                  $("#title").remove();
                  suspended = alt;
                  if(sound){
                    sound.play();
                    fadetimeout.resume();
                  };
                  $("#suspendedimg").append(`<input type="button" style="background-color:#222;outline:none;border:none;top:50%;left:50%;transform:translate(-50%, -50%);position:absolute;width:1280;height:720;" id="title"/>`);
                  $("#title").animate({width: 1008,height:567,opacity:parseInt(uijson["suspended_final_alpha"])/255}, 1000, () => {
                    res = false;
                  });
                  let item = document.getElementById(iid).getAttribute("style");
                  let l = item.split("left:")[1].split(";")[0];
                  document.getElementById("suspended").setAttribute("style", `position: absolute;top: ${suspendedd}; left: ${l-(size.suspended.w-256)/2};pointer-events:none;display:none;`)
                  $("#suspended").show();
                }, 1000);
              });
            } else {
              if(suspended !== undefined){
                let ret = await new Promise(async function(resolve, reject) {
                  let resss = false;
                  res = true;
                  let dialog = await createDialog(lang["suspended_app"], lang["suspended_close"], [lang["yes"], lang["cancel"]]);
                  $("#ulaunchscreen").append(dialog);
                  let inputs = $("#dialog :input");
                  let selected = 0;
                  let max = inputs.length;
                  inputs.click((e) => {
                    click(e.currentTarget.id);
                  });
                  switchem.on("arrowright", () => {
                    click(selected+1);
                  });
                  switchem.on("lrightstart", () => {
                    click(selected+1);
                  });
                  switchem.on("rrightstart", () => {
                    click(selected+1);
                  });
                  switchem.on("arrowleft", () => {
                    click(selected-1);
                  });
                  switchem.on("lleftstart", () => {
                    click(selected-1);
                  });
                  switchem.on("rleftstart", () => {
                    click(selected-1);
                  });
                  switchem.on("a", () => {
                    dblclick(selected);
                  });
                  inputs.dblclick((e) => {
                    dblclick(e.currentTarget.id);
                  });
                  function click(id){
                    if(ress) return;
                    let input = $(`#dialog #${id}`).get(0);
                    let before = $(`#dialog #${selected}`).get(0);
                    if(input === undefined) return;
                    before.setAttribute("style", before.getAttribute("style").replace("#B4B4C8FF", "#B4B4C800"));
                    input.setAttribute("style", input.getAttribute("style").replace("#B4B4C800", "#B4B4C8FF"));
                    selected = parseInt(id);
                  }
                  function dblclick(id){
                    if(resss) return;
                    if(id == 0){
                      $("#title").remove();
                      $("#suspended").hide();
                      $("#suspendedimgg").hide();
                      suspended = undefined;
                      resss = true;
                      res = false;
                      $("#dialog").remove();
                      resolve(false);
                    } else {
                      resss = true;
                      res = false;
                      $("#dialog").remove();
                      resolve(true);
                    }
                  }
                });
                if(ret) return;
              }
              let iid = id;
              if(testersettings["flog_enabled"] == "True"){
                res = true;
                let dialog = await createDialog(lang["hb_launch"], lang["hb_launch_conf"], [lang["hb_applet"], lang["hb_app"], lang["cancel"]]);
                $("#ulaunchscreen").append(dialog);
                let inputs = $("#dialog :input");
                let selected = 0;
                let max = inputs.length;
                inputs.click((e) => {
                  click(e.currentTarget.id);
                });
                switchem.on("arrowright", () => {
                  click(selected+1);
                });
                switchem.on("lrightstart", () => {
                  click(selected+1);
                });
                switchem.on("rrightstart", () => {
                  click(selected+1);
                });
                switchem.on("arrowleft", () => {
                  click(selected-1);
                });
                switchem.on("lleftstart", () => {
                  click(selected-1);
                });
                switchem.on("rleftstart", () => {
                  click(selected-1);
                });
                switchem.on("a", () => {
                  dblclick(selected);
                });
                inputs.dblclick((e) => {
                  dblclick(e.currentTarget.id);
                });
                function click(id){
                  if(ress) return;
                  let input = $(`#dialog #${id}`).get(0);
                  let before = $(`#dialog #${selected}`).get(0);
                  if(input === undefined) return;
                  before.setAttribute("style", before.getAttribute("style").replace("#B4B4C8FF", "#B4B4C800"));
                  input.setAttribute("style", input.getAttribute("style").replace("#B4B4C800", "#B4B4C8FF"));
                  selected = parseInt(id);
                }
                function dblclick(id){
                  if(ress) return;
                  if(id == 0){
                    $("#dialog").remove();
                    if(sound){
                      sound.stop();
                      fadetimeout.stop();
                    };
                    if(titlelaunch !== undefined){
                      if(titlelaunch.playing()) titlelaunch.stop();
                      titlelaunch.play();
                    }
                    $("#ulaunchscreen").append(`<input type="button" style="background-color:#222;z-index:99;outline:none;border:none;position:absolute;top:0;left:0;width:1280;height:720" id="title"/>`);
                    setTimeout(() => {
                      $("#title").remove();
                      if(sound){
                        sound.play();
                        fadetimeout.resume();
                      };
                      res = false;
                    }, 1000);
                  } else if(id == 1){
                    $("#dialog").remove();
                    if(sound){
                      sound.stop();
                      fadetimeout.stop();
                    };
                    if(titlelaunch !== undefined){
                      if(titlelaunch.playing()) titlelaunch.stop();
                      titlelaunch.play();
                    }
                    $("#ulaunchscreen").append(`<input type="button" style="background-color:#222;z-index:99;outline:none;border:none;position:absolute;top:0;left:0;width:1280;height:720" id="title"/>`);
                    setTimeout(() => {
                      $("#title").remove();
                      suspended = alt;
                      if(sound){
                        sound.play();
                        fadetimeout.resume();
                      };
                      $("#suspendedimg").append(`<input type="button" style="background-color:#222;outline:none;border:none;top:50%;left:50%;transform:translate(-50%, -50%);position:absolute;width:1280;height:720;" id="title"/>`);
                      $("#title").animate({width: 1008,height:567,opacity:parseInt(uijson["suspended_final_alpha"])/255}, 1000, () => {
                        res = false;
                      });
                      let item = document.getElementById(iid).getAttribute("style");
                      let l = item.split("left:")[1].split(";")[0];
                      document.getElementById("suspended").setAttribute("style", `position: absolute;top: ${suspendedd}; left: ${l-(size.suspended.w-256)/2};pointer-events:none;display:none;`)
                      $("#suspended").show();
                    }, 1000);
                  } else if(id == 2){
                    res = false;
                    $("#dialog").remove();
                  }
                }
              } else {
                $("#dialog").remove();
                if(sound){
                  sound.stop();
                  fadetimeout.stop();
                };
                if(titlelaunch !== undefined){
                  if(titlelaunch.playing()) titlelaunch.stop();
                  titlelaunch.play();
                }
                $("#ulaunchscreen").append(`<input type="button" style="background-color:#222;z-index:99;outline:none;border:none;position:absolute;top:0;left:0;width:1280;height:720" id="title"/>`);
                setTimeout(() => {
                  $("#title").remove();
                  if(sound){
                    sound.play();
                    fadetimeout.resume();
                  };
                  res = false;
                }, 1000);
              }
            }
          }
          $("#toggleclick").click(() => {
            menu();
          });
          switchem.on("minus", () => {
            menu();
          });
          function menu(){
            if(ress || res) return;
            if(menutoggle !== undefined){
              if(menutoggle.playing()) menutoggle.stop();
              menutoggle.play();
            }
            if(multiselect.filter(n => n == true)[0]){
              multiselect = multiselect.map(n => false);
              $("#multiselect").hide();
              document.getElementById("multiselect").innerHTML = "";
              ShowNotification(lang["menu_multiselect_cancel"], uijson);
            }
            ress = true;
            lmenuitems();
          }
        });
      }
      lmenuitems();
    });
  }
  function theme(){
    return new Promise(function(resolve, reject) {
      let res = false;
      switchem.on("b", () => {
        if(res) return;
        res = true;
        mainmenu();
        resolve();
      });
      switchem.on("plus", async () => {
        if(res) return;
        res = true;
        let ress = false;
        let dialog = await createDialog(lang["ulaunch_about"], `uLaunch v0.1<br><br>${lang["ulaunch_desc"]}:<br>https://github.com/XorTroll/uLaunch`, [lang["ok"]], false, path.join(__dirname, "ulaunch", "romFs", "LogoLarge.png"));
        $("#ulaunchscreen").append(dialog);
        let inputs = $("#dialog :input");
        let selected = 0;
        let max = inputs.length;
        switchem.on("a", () => {
          dblclick(selected);
        });
        inputs.dblclick((e) => {
          dblclick(e.currentTarget.id);
        });
        function dblclick(id){
          if(ress) return;
          ress = true;
          res = false;
          $("#dialog").remove();
        }
      });
      let selected = 0;
      let themes = getFiles(path.join(ulaunchtester, "sdmc", "ulaunch", "themes")).filter(n => n.indexOf("Manifest") !== -1);
      themes = themes.map(n => {
        return {
          path: n.replace(/\\/g, "/").split("sdmc/ulaunch/themes/")[1].split("/")[0],
          manifest: require(n)
        }
      });
      document.getElementById("ulaunchscreen").innerHTML = ejs.render(fs.readFileSync(path.join(__dirname, "ulaunch", "theme.ejs"), "utf8"), {ulaunchtester, defaulticon, themes, path, size, uijson, lang});
      if(currenttheme === "default"){
        document.getElementById("text").innerHTML = lang["theme_no_custom"];
      } else {
        let manifest = require(path.join(ulaunchtester, "sdmc", "ulaunch", "themes", currenttheme, "theme", "Manifest.json"));
        document.getElementById("text").innerHTML = lang["theme_current"]+":";
        document.getElementById("name").innerHTML = manifest.name;
        document.getElementById("author").innerHTML = manifest.author;
        document.getElementById("version").innerHTML = "v"+manifest.release;
        if(fs.existsSync(path.join(ulaunchtester, "sdmc", "ulaunch", "themes", currenttheme, "theme", "Icon.png"))){
          document.getElementById("logo").setAttribute("style", document.getElementById("logo").getAttribute("style").replace("hidden", uijson["themes_menu"]["current_theme_icon"]["visible"]));
          document.getElementById("logo").setAttribute("src", path.join(ulaunchtester, "sdmc", "ulaunch", "themes", currenttheme, "theme", "Icon.png"));
        }
      }
      let down,leftclick;
      let inputs = $("#ulaunchscreen :input");
      inputs.click((e) => {
        leftclick = true;
        click(e.currentTarget.id);
      });
      switchem.on("arrowdown", () => {
        leftclick = false;
        down = true;
        click(selected+1);
      });
      switchem.on("lbottomstart", () => {
        leftclick = false;
        down = true;
        click(selected+1);
      });
      switchem.on("rbottomstart", () => {
        leftclick = false;
        down = true;
        click(selected+1);
      });
      switchem.on("arrowup", () => {
        leftclick = false;
        down = false;
        click(selected-1);
      });
      switchem.on("ltopstart", () => {
        leftclick = false;
        down = false;
        click(selected-1);
      });
      switchem.on("rtopstart", () => {
        leftclick = false;
        down = false;
        click(selected-1);
      });
      switchem.on("a", () => {
        dblclick(selected);
      });
      inputs.dblclick((e) => {
        dblclick(e.currentTarget.id);
      });
      function click(id){
        if(res) return;
        let input = document.getElementById(id+"g");
        let before = document.getElementById(selected+"g");
        if(input === null) return;
        selected = parseInt(id);
        before.setAttribute("style", before.getAttribute("style").replace(uijson["menu_focus_color"], uijson["menu_bg_color"]));
        input.setAttribute("style", input.getAttribute("style").replace(uijson["menu_bg_color"], uijson["menu_focus_color"]));
        if(leftclick) return;
        let scroll = document.getElementById("themes").scrollTop;
        if(down){
          if(selected*100-400 < scroll) return;
          $(`#themes`).animate({
              scrollTop: selected*100-400
          }, 0);
        } else {
          if(selected*100 > scroll) return;
          $(`#themes`).animate({
              scrollTop: selected*100
          }, 0);
        }
      }
      function dblclick(id){
        if(res) return;
        let input = document.getElementById(id);
        let tpath = input.getAttribute("alt");
        if(testersettings.currenttheme === "default" && tpath === "default"){
          return ShowNotification(lang["theme_no_custom"], uijson);
        } else if(testersettings.currenttheme === tpath){
          return ShowNotification(lang["theme_active_this"], uijson);
        }
        testersettings.currenttheme = tpath;
        testersettings.isthemerestart = true;
        fs.writeFileSync(path.join(ulaunchtester, "testersettings", "ulaunch.json"), JSON.stringify(testersettings, null, 2), function(err){if(err) throw err;});
        getCurrentWindow().loadURL(url.format({
          pathname: path.join(__dirname, 'app.ejs'),
          protocol: 'file:',
          slashes: true
        }));
      }
    });
  }
  function settings(){
    return new Promise(function(resolve, reject) {
      let res = false;
      switchem.on("b", () => {
        if(res) return;
        res = true;
        mainmenu();
        resolve();
      });
      switchem.on("plus", async () => {
        if(res) return;
        res = true;
        let ress = false;
        let dialog = await createDialog(lang["ulaunch_about"], `uLaunch v0.1<br><br>${lang["ulaunch_desc"]}:<br>https://github.com/XorTroll/uLaunch`, [lang["ok"]], false, path.join(__dirname, "ulaunch", "romFs", "LogoLarge.png"));
        $("#ulaunchscreen").append(dialog);
        let inputs = $("#dialog :input");
        let selected = 0;
        let max = inputs.length;
        switchem.on("a", () => {
          dblclick(selected);
        });
        inputs.dblclick((e) => {
          dblclick(e.currentTarget.id);
        });
        function dblclick(id){
          if(ress) return;
          ress = true;
          res = false;
          $("#dialog").remove();
        }
      });
      let max = 0;
      let selected = 0;
      let settings = [
        {
          "value": `${lang["set_console_nickname"]}: "${testersettings.consolename}"`,
          "id": 0
        },
        {
          "value": `${lang["set_console_timezone"]}: "${Intl.DateTimeFormat().resolvedOptions().timeZone}"`,
          "id": -1
        },
        {
          "value": `${lang["set_viewer_enabled"]}: ${testersettings["viewer_enabled"]}`,
          "id": 1
        },
        {
          "value": `${lang["set_flog_enabled"]}: ${testersettings["flog_enabled"]}`,
          "id": 2
        },
        {
          "value": `${lang["set_wifi_name"]}: ${(testersettings.connected) ? "SSID" : lang["set_wifi_none"]}`,
          "id": 3
        },
        {
          "value": `${lang["set_console_lang"]}: "${Languages[testersettings["lang"]]}"`,
          "id": 4
        },
        {
          "value": `${lang["set_console_info_upload"]}: ${testersettings["console_info_upload"]}`,
          "id": 5
        },
        {
          "value": `${lang["set_auto_titles_dl"]}: ${testersettings["auto_titles_dl"]}`,
          "id": 6
        },
        {
          "value": `${lang["set_auto_update"]}: ${testersettings["auto_update"]}`,
          "id": 7
        },
        {
          "value": `${lang["set_wireless_lan"]}: ${testersettings["wireless_lan"]}`,
          "id": 8
        },
        {
          "value": `${lang["set_bluetooth"]}: ${testersettings["bluetooth"]}`,
          "id": 9
        },
        {
          "value": `${lang["set_usb_30"]}: ${testersettings["usb_30"]}`,
          "id": 10
        },
        {
          "value": `${lang["set_nfc"]}: ${testersettings["nfc"]}`,
          "id": 11
        },
        {
          "value": `${lang["set_serial_no"]}: XAW10074000000`,
          "id": -1
        },
        {
          "value": `${lang["set_mac_addr"]}: 00:00:00:00:00:00`,
          "id": -1
        }
      ]
      document.getElementById("ulaunchscreen").innerHTML = ejs.render(fs.readFileSync(path.join(__dirname, "ulaunch", "settings.ejs"), "utf8"), {ulaunchtester, settings, defaulticon, path, size, uijson, lang});
      let down,leftclick;
      let inputs = $("#ulaunchscreen :input");
      max = inputs.length
      inputs.click((e) => {
        leftclick = true;
        click(e.currentTarget.id);
      });
      switchem.on("arrowdown", () => {
        leftclick = false;
        down = true;
        click(selected+1);
      });
      switchem.on("lbottomstart", () => {
        leftclick = false;
        down = true;
        click(selected+1);
      });
      switchem.on("rbottomstart", () => {
        leftclick = false;
        down = true;
        click(selected+1);
      });
      switchem.on("arrowup", () => {
        leftclick = false;
        down = false;
        click(selected-1);
      });
      switchem.on("ltopstart", () => {
        leftclick = false;
        down = false;
        click(selected-1);
      });
      switchem.on("rtopstart", () => {
        leftclick = false;
        down = false;
        click(selected-1);
      });
      switchem.on("a", () => {
        dblclick(selected);
      });
      inputs.dblclick((e) => {
        dblclick(e.currentTarget.id);
      });
      function click(id){
        if(res) return;
        let input = document.getElementById(id+"g");
        let before = document.getElementById(selected+"g");
        if(input === null) return;
        selected = parseInt(id);
        before.setAttribute("style", before.getAttribute("style").replace(uijson["menu_focus_color"], uijson["menu_bg_color"]));
        input.setAttribute("style", input.getAttribute("style").replace(uijson["menu_bg_color"], uijson["menu_focus_color"]));
        if(leftclick) return;
        let scroll = document.getElementById("settings").scrollTop;
        if(down){
          if(selected*100-300 < scroll) return;
          $(`#settings`).animate({
              scrollTop: selected*100-300
          }, 0);
        } else {
          if(selected*100 > scroll) return;
          $(`#settings`).animate({
              scrollTop: selected*100
          }, 0);
        }
      }
      async function dblclick(id){
        if(res) return;
        let input = document.getElementById(id);
        let setting = settings[id];
        if(setting.id === -1) return;
        if(id == 2){
          res = true;
          let p = document.getElementById(`${id}t`);
          let dialog = await createDialog(lang["set_viewer_enabled"], `${lang["set_viewer_info"]}<br>${(p.innerHTML.indexOf("False") !== -1) ? lang["set_enable_conf"] : lang["set_disable_conf"]}`, [lang["yes"],lang["cancel"]]);
          $("#ulaunchscreen").append(dialog);
          let ress = false;
          let inputs = $("#dialog :input");
          let selected = 0;
          let max = inputs.length;
          inputs.click((e) => {
            click(e.currentTarget.id);
          });
          switchem.on("arrowright", () => {
            click(selected+1);
          });
          switchem.on("lrightstart", () => {
            click(selected+1);
          });
          switchem.on("rrightstart", () => {
            click(selected+1);
          });
          switchem.on("arrowleft", () => {
            click(selected-1);
          });
          switchem.on("lleftstart", () => {
            click(selected-1);
          });
          switchem.on("rleftstart", () => {
            click(selected-1);
          });
          switchem.on("a", () => {
            dblclick(selected);
          });
          inputs.dblclick((e) => {
            dblclick(e.currentTarget.id);
          });
          function click(id){
            if(ress) return;
            let input = $(`#dialog #${id}`).get(0);
            let before = $(`#dialog #${selected}`).get(0);
            if(input === undefined) return;
            before.setAttribute("style", before.getAttribute("style").replace("#B4B4C8FF", "#B4B4C800"));
            input.setAttribute("style", input.getAttribute("style").replace("#B4B4C800", "#B4B4C8FF"));
            selected = parseInt(id);
          }
          function dblclick(id){
            if(ress) return;
            ress = true;
            res = false;
            $("#dialog").remove();
            if(id == 0){
              if(p.innerHTML.indexOf("False") !== -1){
                testersettings["viewer_enabled"] = "True";
                fs.writeFileSync(path.join(ulaunchtester, "testersettings", "ulaunch.json"), JSON.stringify(testersettings, null, 2), function(err){if(err) throw err;});
                p.innerHTML = p.innerHTML.replace("False", "True");
              } else {
                testersettings["viewer_enabled"] = "False";
                fs.writeFileSync(path.join(ulaunchtester, "testersettings", "ulaunch.json"), JSON.stringify(testersettings, null, 2), function(err){if(err) throw err;});
                p.innerHTML = p.innerHTML.replace("True", "False");
              }
            }
          }
        } else if(id == 3){
          res = true;
          let p = document.getElementById(`${id}t`);
          let dialog = await createDialog(lang["set_flog_enabled"], `${lang["set_flog_info"]}<br>${(p.innerHTML.indexOf("False") !== -1) ? lang["set_enable_conf"] : lang["set_disable_conf"]}`, [lang["yes"],lang["cancel"]]);
          $("#ulaunchscreen").append(dialog);
          let ress = false;
          let inputs = $("#dialog :input");
          let selected = 0;
          let max = inputs.length;
          inputs.click((e) => {
            click(e.currentTarget.id);
          });
          switchem.on("arrowright", () => {
            click(selected+1);
          });
          switchem.on("lrightstart", () => {
            click(selected+1);
          });
          switchem.on("rrightstart", () => {
            click(selected+1);
          });
          switchem.on("arrowleft", () => {
            click(selected-1);
          });
          switchem.on("lleftstart", () => {
            click(selected-1);
          });
          switchem.on("rleftstart", () => {
            click(selected-1);
          });
          switchem.on("a", () => {
            dblclick(selected);
          });
          inputs.dblclick((e) => {
            dblclick(e.currentTarget.id);
          });
          function click(id){
            if(ress) return;
            let input = $(`#dialog #${id}`).get(0);
            let before = $(`#dialog #${selected}`).get(0);
            if(input === undefined) return;
            before.setAttribute("style", before.getAttribute("style").replace("#B4B4C8FF", "#B4B4C800"));
            input.setAttribute("style", input.getAttribute("style").replace("#B4B4C800", "#B4B4C8FF"));
            selected = parseInt(id);
          }
          function dblclick(id){
            if(ress) return;
            ress = true;
            res = false;
            $("#dialog").remove();
            if(id == 0){
              if(p.innerHTML.indexOf("False") !== -1){
                testersettings["flog_enabled"] = "True";
                fs.writeFileSync(path.join(ulaunchtester, "testersettings", "ulaunch.json"), JSON.stringify(testersettings, null, 2), function(err){if(err) throw err;});
                p.innerHTML = p.innerHTML.replace("False", "True");
              } else {
                testersettings["flog_enabled"] = "False";
                fs.writeFileSync(path.join(ulaunchtester, "testersettings", "ulaunch.json"), JSON.stringify(testersettings, null, 2), function(err){if(err) throw err;});
                p.innerHTML = p.innerHTML.replace("True", "False");
              }
            }
          }
        } else if(id == 6){
          let p = document.getElementById(`${id}t`);
          if(p.innerHTML.indexOf("False") !== -1){
            testersettings["console_info_upload"] = "True";
            fs.writeFileSync(path.join(ulaunchtester, "testersettings", "ulaunch.json"), JSON.stringify(testersettings, null, 2), function(err){if(err) throw err;});
            p.innerHTML = p.innerHTML.replace("False", "True");
          } else {
            testersettings["console_info_upload"] = "False";
            fs.writeFileSync(path.join(ulaunchtester, "testersettings", "ulaunch.json"), JSON.stringify(testersettings, null, 2), function(err){if(err) throw err;});
            p.innerHTML = p.innerHTML.replace("True", "False");
          }
        } else if(id == 7){
          let p = document.getElementById(`${id}t`);
          if(p.innerHTML.indexOf("False") !== -1){
            testersettings["auto_titles_dl"] = "True";
            fs.writeFileSync(path.join(ulaunchtester, "testersettings", "ulaunch.json"), JSON.stringify(testersettings, null, 2), function(err){if(err) throw err;});
            p.innerHTML = p.innerHTML.replace("False", "True");
          } else {
            testersettings["auto_titles_dl"] = "False";
            fs.writeFileSync(path.join(ulaunchtester, "testersettings", "ulaunch.json"), JSON.stringify(testersettings, null, 2), function(err){if(err) throw err;});
            p.innerHTML = p.innerHTML.replace("True", "False");
          }
        } else if(id == 8){
          let p = document.getElementById(`${id}t`);
          if(p.innerHTML.indexOf("False") !== -1){
            testersettings["auto_update"] = "True";
            fs.writeFileSync(path.join(ulaunchtester, "testersettings", "ulaunch.json"), JSON.stringify(testersettings, null, 2), function(err){if(err) throw err;});
            p.innerHTML = p.innerHTML.replace("False", "True");
          } else {
            testersettings["auto_update"] = "False";
            fs.writeFileSync(path.join(ulaunchtester, "testersettings", "ulaunch.json"), JSON.stringify(testersettings, null, 2), function(err){if(err) throw err;});
            p.innerHTML = p.innerHTML.replace("True", "False");
          }
        } else if(id == 9){
          let p = document.getElementById(`${id}t`);
          if(p.innerHTML.indexOf("False") !== -1){
            testersettings["wireless_lan"] = "True";
            fs.writeFileSync(path.join(ulaunchtester, "testersettings", "ulaunch.json"), JSON.stringify(testersettings, null, 2), function(err){if(err) throw err;});
            p.innerHTML = p.innerHTML.replace("False", "True");
          } else {
            testersettings["wireless_lan"] = "False";
            fs.writeFileSync(path.join(ulaunchtester, "testersettings", "ulaunch.json"), JSON.stringify(testersettings, null, 2), function(err){if(err) throw err;});
            p.innerHTML = p.innerHTML.replace("True", "False");
          }
        } else if(id == 10){
          let p = document.getElementById(`${id}t`);
          if(p.innerHTML.indexOf("False") !== -1){
            testersettings["bluetooth"] = "True";
            fs.writeFileSync(path.join(ulaunchtester, "testersettings", "ulaunch.json"), JSON.stringify(testersettings, null, 2), function(err){if(err) throw err;});
            p.innerHTML = p.innerHTML.replace("False", "True");
          } else {
            testersettings["bluetooth"] = "False";
            fs.writeFileSync(path.join(ulaunchtester, "testersettings", "ulaunch.json"), JSON.stringify(testersettings, null, 2), function(err){if(err) throw err;});
            p.innerHTML = p.innerHTML.replace("True", "False");
          }
        } else if(id == 11){
          let p = document.getElementById(`${id}t`);
          if(p.innerHTML.indexOf("False") !== -1){
            testersettings["usb_30"] = "True";
            fs.writeFileSync(path.join(ulaunchtester, "testersettings", "ulaunch.json"), JSON.stringify(testersettings, null, 2), function(err){if(err) throw err;});
            p.innerHTML = p.innerHTML.replace("False", "True");
          } else {
            testersettings["usb_30"] = "False";
            fs.writeFileSync(path.join(ulaunchtester, "testersettings", "ulaunch.json"), JSON.stringify(testersettings, null, 2), function(err){if(err) throw err;});
            p.innerHTML = p.innerHTML.replace("True", "False");
          }
        } else if(id == 12){
          let p = document.getElementById(`${id}t`);
          if(p.innerHTML.indexOf("False") !== -1){
            testersettings["nfc"] = "True";
            fs.writeFileSync(path.join(ulaunchtester, "testersettings", "ulaunch.json"), JSON.stringify(testersettings, null, 2), function(err){if(err) throw err;});
            p.innerHTML = p.innerHTML.replace("False", "True");
          } else {
            testersettings["nfc"] = "False";
            fs.writeFileSync(path.join(ulaunchtester, "testersettings", "ulaunch.json"), JSON.stringify(testersettings, null, 2), function(err){if(err) throw err;});
            p.innerHTML = p.innerHTML.replace("True", "False");
          }
        } else if(id == 5){
          res = true;
          languages();
          resolve();
        } else if(id == 0){
          res = true;
          let finish = false;
          istyping = true;
          $("#ulaunchscreen").append(`<div style="background-color: #3232327F;z-index:100;position:absolute;top:0;left:0;width:1280;height:720;" id="consolename"><div style="background-color: #e1e1e1;width:350;height:100;position:absolute;top:50%;left:50%;transform:translate(-50%, -50%)"><p style="font-family: 'OpenSans';font-size: 25;margin:0px 0px;position:absolute;top: 10;left:28;" id="namep">Enter your console name</p><input style="width:300;height:30;font-family: 'OpenSans';font-size: 20;position:absolute;top:50;left:25" type="text" id="name"/></div></div>`);
          $('#name').bind("enterKey",function(e){
            if(finish) return;
            let consolename = $(e.currentTarget).val();
            if(consolename == ""){
              alert("The console name is empty");
            } else {
              finish = true;
              istyping = false;
              testersettings.consolename = consolename
              fs.writeFileSync(path.join(ulaunchtester, "testersettings", "ulaunch.json"), JSON.stringify(testersettings, null, 2), function(err){if(err) throw err;});
              document.getElementById(`${id}t`).innerHTML = `${lang["set_console_nickname"]}: "${testersettings.consolename}"`;
              res = false;
              $("#consolename").remove();
            }
          });
          $('#name').keyup(function(e){if(e.keyCode == 13){$(this).trigger("enterKey")}});
        }
      }
    });
  }
  function languages(){
    return new Promise(function(resolve, reject) {
      let res = false;
      switchem.on("b", () => {
        if(res) return;
        res = true;
        settings();
        resolve();
      });
      switchem.on("plus", async () => {
        if(res) return;
        res = true;
        let ress = false;
        let dialog = await createDialog(lang["ulaunch_about"], `uLaunch v0.1<br><br>${lang["ulaunch_desc"]}:<br>https://github.com/XorTroll/uLaunch`, [lang["ok"]], false, path.join(__dirname, "ulaunch", "romFs", "LogoLarge.png"));
        $("#ulaunchscreen").append(dialog);
        let inputs = $("#dialog :input");
        let selected = 0;
        let max = inputs.length;
        switchem.on("a", () => {
          dblclick(selected);
        });
        inputs.dblclick((e) => {
          dblclick(e.currentTarget.id);
        });
        function dblclick(id){
          if(ress) return;
          ress = true;
          res = false;
          $("#dialog").remove();
        }
      });
      document.getElementById("ulaunchscreen").innerHTML = ejs.render(fs.readFileSync(path.join(__dirname, "ulaunch", "languages.ejs"), "utf8"), {testersettings, Languages, defaulticon, path, size, uijson, lang});
      let down,leftclick;
      let inputs = $("#ulaunchscreen :input");
      let selected = 0;
      max = inputs.length
      inputs.click((e) => {
        leftclick = true;
        click(e.currentTarget.id);
      });
      switchem.on("arrowdown", () => {
        leftclick = false;
        down = true;
        click(selected+1);
      });
      switchem.on("lbottomstart", () => {
        leftclick = false;
        down = true;
        click(selected+1);
      });
      switchem.on("rbottomstart", () => {
        leftclick = false;
        down = true;
        click(selected+1);
      });
      switchem.on("arrowup", () => {
        leftclick = false;
        down = false;
        click(selected-1);
      });
      switchem.on("ltopstart", () => {
        leftclick = false;
        down = false;
        click(selected-1);
      });
      switchem.on("rtopstart", () => {
        leftclick = false;
        down = false;
        click(selected-1);
      });
      switchem.on("a", () => {
        dblclick(selected);
      });
      inputs.dblclick((e) => {
        dblclick(e.currentTarget.id);
      });
      function click(id){
        if(res) return;
        let input = document.getElementById(id+"g");
        let before = document.getElementById(selected+"g");
        if(input === null) return;
        selected = parseInt(id);
        before.setAttribute("style", before.getAttribute("style").replace(uijson["menu_focus_color"], uijson["menu_bg_color"]));
        input.setAttribute("style", input.getAttribute("style").replace(uijson["menu_bg_color"], uijson["menu_focus_color"]));
        if(leftclick) return;
        let scroll = document.getElementById("settings").scrollTop;
        if(down){
          if(selected*100-300 < scroll) return;
          $(`#settings`).animate({
              scrollTop: selected*100-300
          }, 0);
        } else {
          if(selected*100 > scroll) return;
          $(`#settings`).animate({
              scrollTop: selected*100
          }, 0);
        }
      }
      async function dblclick(id){
        if(res) return;
        let key = Object.keys(Languages)[id];
        let langu = Languages[key];
        if(key == testersettings.lang) return ShowNotification(lang["lang_active_this"], uijson);
        let dialog = await createDialog(lang["lang_set"], lang["lang_set_conf"], [lang["yes"], lang["no"]]);
        $("#ulaunchscreen").append(dialog);
        let ress = false;
        res = true;
        let inputs = $("#dialog :input");
        let selected = 0;
        let max = inputs.length;
        inputs.click((e) => {
          click(e.currentTarget.id);
        });
        switchem.on("arrowright", () => {
          click(selected+1);
        });
        switchem.on("lrightstart", () => {
          click(selected+1);
        });
        switchem.on("rrightstart", () => {
          click(selected+1);
        });
        switchem.on("arrowleft", () => {
          click(selected-1);
        });
        switchem.on("lleftstart", () => {
          click(selected-1);
        });
        switchem.on("rleftstart", () => {
          click(selected-1);
        });
        switchem.on("a", () => {
          dblclick(selected);
        });
        inputs.dblclick((e) => {
          dblclick(e.currentTarget.id);
        });
        function click(id){
          if(ress) return;
          let input = $(`#dialog #${id}`).get(0);
          let before = $(`#dialog #${selected}`).get(0);
          if(input === undefined) return;
          before.setAttribute("style", before.getAttribute("style").replace("#B4B4C8FF", "#B4B4C800"));
          input.setAttribute("style", input.getAttribute("style").replace("#B4B4C800", "#B4B4C8FF"));
          selected = parseInt(id);
        }
        async function dblclick(id){
          if(ress) return;
          if(id == 0){
            $("#dialog").remove();
            testersettings.lang = key;
            fs.writeFileSync(path.join(ulaunchtester, "testersettings", "ulaunch.json"), JSON.stringify(testersettings, null, 2), function(err){if(err) throw err;});
            ress = true;
            let dialog = await createDialog(lang["lang_set"], lang["lang_set_ok"], [lang["ok"]]);
            $("#ulaunchscreen").append(dialog);
            let resss = false;
            let inputs = $("#dialog :input");
            switchem.on("a", () => {
              dblclick(selected);
            });
            inputs.dblclick((e) => {
              dblclick(e.currentTarget.id);
            });
            function dblclick(){
              if(resss) return;
              resss = true;
              ress = true;
              res = false;
              $("#dialog").remove();
              getCurrentWindow().loadURL(url.format({
                pathname: path.join(__dirname, 'app.ejs'),
                protocol: 'file:',
                slashes: true
              }));
            }
          } else {
            ress = true;
            res = false;
            $("#dialog").remove();
          }
        }
      }
    });
  }
  startup();
}

function getTextWH(fontSize, text, width = "auto", height = "auto"){
   var id = '';
   var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   var charactersLength = characters.length;
   for ( var i = 0; i < 25; i++ ) {
      id += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   $(document.body).append(`<p id="${id}" style="font-family: 'Font';font-size:${fontSize};width:${width};height:${height};position:absolute;top:0;left:0;opacity:0;margin:0px 0px;padding: 0px"><span style="word-break: break-all;">${text}</span></p>`)
   var test = document.getElementById(id);
   let textw = test.clientWidth;
   let texth = test.clientHeight;
   let ret = [test.clientWidth, test.clientHeight];
   $(`#${id}`).remove();
   return ret;
}

async function ShowNotification(text, uijson, ms = 1500){
  if(document.getElementById("notification") !== null){
    await new Promise(function(resolve, reject) {
      let interval = null;
      interval = setInterval(() => {
        if(document.getElementById("notification") == null){
          stop();
        }
      });
      function stop(){
        clearInterval(interval);
        resolve();
      }
    });
  }
  let wh = getTextWH(20, text);
  let toastw = wh[0] + (wh[1] * 4);
  let toasth = wh[1] * 3;
  $("#switchcontainer").append(`<input type="button" id="notification" style="position: absolute;left: ${(1280 - toastw) / 2};top: 550;width: ${toastw};text-align: center;color: ${uijson["toast_text_color"]};z-index: 2;height: ${toasth};font-size: 20;padding: 10 32.5;border: none;border-radius: 32.5px;background-color: ${uijson["toast_base_color"]};opacity:0;" value="${text}"/>`);
  $("#notification").fadeTo(350, 200/255, function(){
    setTimeout(() => {
      $("#notification").fadeTo(350, 0, function(){
        setTimeout(() => {$("#notification").remove();}, 150);
      });
    }, ms);
  });
}

function existsUI(name, defaultui, romfsui){
  if(fs.existsSync(path.join(defaultui, name))){
    return path.join(defaultui, name)
  } else {
    return path.join(romfsui, name)
  }
}

function InitializeUIJson(uijson){
  uijson["suspended_final_alpha"] = ApplyConfigForElement(uijson, "suspended_final_alpha");
  uijson["menu_focus_color"] = ApplyConfigForElement(uijson, "menu_focus_color");
  uijson["menu_bg_color"] = ApplyConfigForElement(uijson, "menu_bg_color");
  uijson["text_color"] = ApplyConfigForElement(uijson, "text_color");
  uijson["toast_text_color"] = ApplyConfigForElement(uijson, "toast_text_color");
  uijson["toast_base_color"] = ApplyConfigForElement(uijson, "toast_base_color");
  uijson["menu_folder_text_x"] = ApplyConfigForElement(uijson, "menu_folder_text_x");
  uijson["menu_folder_text_y"] = ApplyConfigForElement(uijson, "menu_folder_text_y");
  uijson["menu_folder_text_size"] = ApplyConfigForElement(uijson, "menu_folder_text_size");
  if(uijson["settings_menu"] === undefined){
    uijson["settings_menu"] = ApplyConfigForElement(uijson, "settings_menu");
  } else {
    uijson["settings_menu"]["info_text"] = ApplyConfigForElement(uijson, "settings_menu", "info_text");
    uijson["settings_menu"]["settings_menu_item"] = ApplyConfigForElement(uijson, "settings_menu", "settings_menu_item");
  }
  if(uijson["languages_menu"] === undefined){
    uijson["languages_menu"] = ApplyConfigForElement(uijson, "languages_menu");
  } else {
    uijson["languages_menu"]["info_text"] = ApplyConfigForElement(uijson, "languages_menu", "info_text");
    uijson["languages_menu"]["languages_menu_item"] = ApplyConfigForElement(uijson, "languages_menu", "languages_menu_item");
  }
  if(uijson["startup_menu"] === undefined){
    uijson["startup_menu"] = ApplyConfigForElement(uijson, "startup_menu");
  } else {
    uijson["startup_menu"]["info_text"] = ApplyConfigForElement(uijson, "startup_menu", "info_text");
    uijson["startup_menu"]["users_menu_item"] = ApplyConfigForElement(uijson, "startup_menu", "users_menu_item");
  }
  if(uijson["main_menu"] === undefined){
    uijson["main_menu"] = ApplyConfigForElement(uijson, "main_menu");
  } else {
    uijson["main_menu"]["top_menu_bg"] = ApplyConfigForElement(uijson, "main_menu", "top_menu_bg");
    uijson["main_menu"]["banner_image"] = ApplyConfigForElement(uijson, "main_menu", "banner_image");
    uijson["main_menu"]["connection_icon"] = ApplyConfigForElement(uijson, "main_menu", "connection_icon");
    uijson["main_menu"]["user_icon"] = ApplyConfigForElement(uijson, "main_menu", "user_icon");
    uijson["main_menu"]["logo_icon"] = ApplyConfigForElement(uijson, "main_menu", "logo_icon");
    uijson["main_menu"]["web_icon"] = ApplyConfigForElement(uijson, "main_menu", "web_icon");
    uijson["main_menu"]["time_text"] = ApplyConfigForElement(uijson, "main_menu", "time_text");
    uijson["main_menu"]["battery_text"] = ApplyConfigForElement(uijson, "main_menu", "battery_text");
    uijson["main_menu"]["battery_icon"] = ApplyConfigForElement(uijson, "main_menu", "battery_icon");
    uijson["main_menu"]["settings_icon"] = ApplyConfigForElement(uijson, "main_menu", "settings_icon");
    uijson["main_menu"]["themes_icon"] = ApplyConfigForElement(uijson, "main_menu", "themes_icon");
    uijson["main_menu"]["firmware_text"] = ApplyConfigForElement(uijson, "main_menu", "firmware_text");
    uijson["main_menu"]["menu_toggle_button"] = ApplyConfigForElement(uijson, "main_menu", "menu_toggle_button");
    uijson["main_menu"]["banner_name_text"] = ApplyConfigForElement(uijson, "main_menu", "banner_name_text");
    uijson["main_menu"]["banner_author_text"] = ApplyConfigForElement(uijson, "main_menu", "banner_author_text");
    uijson["main_menu"]["banner_version_text"] = ApplyConfigForElement(uijson, "main_menu", "banner_version_text");
    uijson["main_menu"]["items_menu"] = ApplyConfigForElement(uijson, "main_menu", "items_menu");
  }
  if(uijson["themes_menu"] === undefined){
    uijson["themes_menu"] = ApplyConfigForElement(uijson, "themes_menu");
  } else {
    uijson["themes_menu"]["banner_image"] = ApplyConfigForElement(uijson, "themes_menu", "banner_image");
    uijson["themes_menu"]["themes_menu_item"] = ApplyConfigForElement(uijson, "themes_menu", "themes_menu_item");
    uijson["themes_menu"]["current_theme_text"] = ApplyConfigForElement(uijson, "themes_menu", "current_theme_text");
    uijson["themes_menu"]["current_theme_name_text"] = ApplyConfigForElement(uijson, "themes_menu", "current_theme_name_text");
    uijson["themes_menu"]["current_theme_author_text"] = ApplyConfigForElement(uijson, "themes_menu", "current_theme_author_text");
    uijson["themes_menu"]["current_theme_version_text"] = ApplyConfigForElement(uijson, "themes_menu", "current_theme_version_text");
    uijson["themes_menu"]["current_theme_icon"] = ApplyConfigForElement(uijson, "themes_menu", "current_theme_icon");
  }
  return uijson;
}

function getFiles(dir, files_) {
  files_ = files_ || [];
  if(fs.existsSync(dir)) {
    var files = fs.readdirSync(dir);
    for(var i in files) {
      var name = dir + '/' + files[i];
      if(fs.statSync(name).isDirectory()) {
        getFiles(name, files_);
      } else {
        files_.push(name);
      }
    }
  }
  return files_;
}

function ApplyConfigForElement(json, obj1, obj2){
  let defjson = require(path.join(__dirname, "ulaunch", "default.json"));
  if(obj2 === undefined) {
    if(typeof defjson[obj1] === "string" || typeof defjson[obj1] === "number"){
      return (json[obj1] !== undefined) ? json[obj1] : defjson[obj1];
    } else {
      let obj = Object.keys(defjson[obj1]);
      for(var i in obj){
        let element = obj[i];
        defjson[obj1][element]["visible"] = visibility(defjson[obj1][element]["visible"])
      }
      return defjson[obj1];
    }
  } else {
    return {
      "x": (json[obj1][obj2] !== undefined) ? ((json[obj1][obj2]["x"] !== undefined) ? json[obj1][obj2]["x"] : defjson[obj1][obj2]["x"]) : defjson[obj1][obj2]["x"],
      "y": (json[obj1][obj2] !== undefined) ? ((json[obj1][obj2]["y"] !== undefined) ? json[obj1][obj2]["y"] : defjson[obj1][obj2]["y"]) : defjson[obj1][obj2]["y"],
      "visible": (json[obj1][obj2] !== undefined) ? ((json[obj1][obj2]["visible"] === false) ? visibility(json[obj1][obj2]["visible"]) : visibility(defjson[obj1][obj2]["visible"])) : visibility(defjson[obj1][obj2]["visible"])
    }
  }
}

async function InitializeSize(size, defaulticon, uijson){
  let sizeKeys = Object.keys(size);
  for(var i=0; i<sizeKeys.length; i++){
    await new Promise(function(resolve, reject) {
      let s = size[i];
      let k = sizeKeys[i];
      let img = new Image();
      img.onload = () => {
        size[k] = {w: img.width,h: img.height}
        resolve();
      };
      img.src = defaulticon[k];
    });
  }
  return size;
}

function InitializeLang(lang, Languages){
  let langdefault = require(path.join(__dirname, "ulaunch", "romFs", "LangDefault.json"));
  if(lang === "en-US"){
    lang = langdefault;
  } else {
    if(Languages[lang] === undefined){
      lang = langdefault;
      testersettings.lang = "en-US";
      fs.writeFileSync(path.join(ulaunchtester, "testersettings", "ulaunch.json"), JSON.stringify(testersettings, null, 2), function(err){if(err) throw err;});
    } else {
      if(!fs.existsSync(path.join(documents, "uLaunch-Previewer", "sdmc", "ulaunch", "lang", `${lang}.json`))){
        lang = langdefault;
      } else {
        lang = require(path.join(documents, "uLaunch-Previewer", "sdmc", "ulaunch", "lang", `${lang}.json`));
        let dkeys = Object.keys(langdefault);
        for(var i=0; i<dkeys.length; i++){
          let dkey = dkeys[i];
          if(lang[dkey] === undefined){
            lang[dkey] = langdefault[dkey];
          }
        }
      }
    }
  }
  let langKeys = Object.keys(lang);
  for(var i=0; i<langKeys.length; i++){
    let k = langKeys[i];
    let l = lang[k];
    lang[k] = l.replace(/\n/g, "<br>");
  }
  return lang;
}

async function createDialog(title, content, opts, hasCancel = false, icon){
  let html = `<div style="background-color: #3232327F;z-index:99;position:absolute;top:0;left:0;width:1280;height:720;" id="dialog">`;
  if(hasCancel) opts.push("Cancel");
  if(opts.length !== 0){
    let dw = (20 * (opts.length - 1)) + 250;
    for(var i = 0; i < opts.length; i++){
        let tw = getTextWH(18, opts[i])[0];
        dw += tw + 20;
    }
    if(dw > 1280) dw = 1280;
    let icm = 30;
    let elemh = 60;
    let tdw = getTextWH(20, content)[0] + 157.5;
    if(tdw > dw) dw = tdw;
    tdw = getTextWH(30, title)[0] + 157.5;
    if(tdw > dw) dw = tdw;
    let ely = getTextWH(20, content)[1] + getTextWH(30, title)[1] + 140;
    if(icon){
      await new Promise(function(resolve, reject) {
        let img = new Image();
        img.onload = () => {
          let tely = img.height + icm + 25;
          if(tely > ely) ely = tely;
          tdw = getTextWH(20, content)[0] + 90 + img.width + 20;
          if(tdw > dw) dw = tdw;
          tdw = getTextWH(30, title)[0] + 90 + img.width + 20;
          if(tdw > dw) dw = tdw;
          resolve();
        }
        img.src = icon;
      });
    }
    if(dw > 1280) dw = 1280;
    let dh = ely + elemh + 30;
    if(dh > 720) dh = 720;
    let dx = (1280 - dw) / 2;
    let dy = (720 - dh) / 2;
    ely += dy;
    let elemw = ((dw - (20 * (opts.length + 1))) / opts.length);
    let elx = dx + ((dw - ((elemw * opts.length) + (20 * (opts.length - 1)))) / 2);
    let r = 35;
    let nr = "B4";
    let ng = "B4";
    let nb = "C8";
    let end = false;
    let initfact = 0;
    let bw = dw;
    let bh = dh;
    let fw = bw - (r * 2);
    let fh = bh - (r * 2);
    let clr = "#e1e1e1";
    html += `<div style="background-color:transparent;width:${bw};height:${bh};position:absolute;overflow:hidden;top:${dy};left:${dx};"><input type="button" style="z-index:-1;outline:none;border:none;width:${bw};height:${bh};position:absolute;top:0;left:0;border-radius:${r}px;background-color:${clr};" disabled/>`
    let iconwidth = 0;
    if(icon){
      await new Promise(function(resolve, reject) {
        let img = new Image();
        img.onload = () => {
          let icw = img.width;
          let icx = (dw - (icw + icm));
          let icy = icm;
          iconwidth = icw+(bw-(icx+icw))-20;
          html += `<img style="position:absolute;top:${icy};left:${icx}" src="${icon}"/>`;
          resolve();
        }
        img.src = icon;
      });
    }
    html += `<div style="background-color:transparent;position:absolute;top:0;left:45;width:${bw-90-iconwidth};height:${bh};"><p style="user-select:none;margin:0px 0px;padding: 0px;font-size:30;font-family: 'Font';position:relative;top:55;left:0"><span style="word-break: break-all;">${title}</span></p><p style="user-select:none;margin:0px 0px;padding: 0px;font-size:20;font-family: 'Font';position:relative;top:110;left:0"><span style="word-break: break-all;">${content}</span></p></div>`
    for(var i=0; i<opts.length; i++){
      let n = i;
      let txt = opts[n];
      let tw = getTextWH(18, txt)[0];
      let th = getTextWH(18, txt)[1];
      let tx = elx + ((elemw - tw) / 2) + ((elemw + 20) * i);
      let ty = ely + ((elemh - th) / 2);
      let rx = elx + ((elemw + 20) * i);
      let ry = ely;
      let rr = (elemh / 2);
      let dclr = `#${nr}${ng}${nb}${(n == 0) ? "FF" : "00"}`;
      html += `<input type="button" style="outline:none;border:none;background-color:${dclr};font-size:18;font-family:'Font';border-radius:${rr}px;width:${elemw};height:${elemh};top:${bh-elemh-30};padding:0px 0px 0px 0px;position:relative;margin: 0px 0px 0px 20px;" value="${txt}" id="${n}"/>`
    }
    html += "</div>";
  };
  html += "</div>";
  return html;
}

function visibility(visible){
  if(visible === false){
    return "hidden";
  } else {
    return "visible";
  }
}

async function SetTextureColorMod(src, id, r, g, b){
  await new Promise(function(resolve, reject) {
    let img = new Image();
    img.onload = () => {
      var can = document.createElement("canvas");
      can.width = img.width;
      can.height = img.height;
      var ctx = can.getContext('2d');
      ctx.scale(can.width / img.width, can.height / img.height);
      ctx.drawImage(img, 0, 0);

      var imageData = ctx.getImageData(0,0,can.width, can.height);
      var pixels = imageData.data;
      var numPixels = pixels.length;

      ctx.clearRect(0, 0, can.width, can.height);

      for (var i = 0; i < numPixels; i++) {
          pixels[i*4] = pixels[i*4]*(r/255);
          pixels[i*4+1] = pixels[i*4+1]*(g/255);
          pixels[i*4+2] = pixels[i*4+2]*(b/255);
      }
      ctx.putImageData(imageData, 0, 0);
      if(id !== undefined){
        document.getElementById(id).setAttribute("src", can.toDataURL());
      } else {
        img = document.createElement("img");
        img.width = can.width;
        img.height = can.height;
        img.src = can.toDataURL();
        document.body.appendChild(img);
      }
      resolve();
    }
    img.src = src;
  });
}

let ispower = true;
function minus(){
  if(!ispower) return
  switchem.emit('minus');
}
function plus(){
  if(!ispower) return
  switchem.emit('plus');
}
function ltopstart(){
  if(!ispower) return
  switchem.emit('ltopstart');
}
function ltopstop(){
  if(!ispower) return
  switchem.emit('ltopstop');
}
function ltopleftstart(){
  if(!ispower) return
  switchem.emit('ltopleftstart');
}
function ltopleftstop(){
  if(!ispower) return
  switchem.emit('ltopleftstop');
}
function lleftstart(){
  if(!ispower) return
  switchem.emit('lleftstart');
}
function lleftstop(){
  if(!ispower) return
  switchem.emit('lleftstop');
}
function lleftbottomstart(){
  if(!ispower) return
  switchem.emit('lleftbottomstart');
}
function lleftbottomstop(){
  if(!ispower) return
  switchem.emit('lleftbottomstop');
}
function lbottomstart(){
  if(!ispower) return
  switchem.emit('lbottomstart');
}
function lbottomstop(){
  if(!ispower) return
  switchem.emit('lbottomstop');
}
function lbottomrightstart(){
  if(!ispower) return
  switchem.emit('lbottomrightstart');
}
function lbottomrightstop(){
  if(!ispower) return
  switchem.emit('lbottomrightstop');
}
function lrightstart(){
  if(!ispower) return
  switchem.emit('lrightstart');
}
function lrightstop(){
  if(!ispower) return
  switchem.emit('lrightstop');
}
function lrighttopstart(){
  if(!ispower) return
  switchem.emit('lrighttopstart');
}
function lrighttopstop(){
  if(!ispower) return
  switchem.emit('lrighttopstop');
}
function arrowup(){
  if(!ispower) return
  switchem.emit('arrowup');
}
function arrowdown(){
  if(!ispower) return
  switchem.emit('arrowdown');
}
function arrowright(){
  if(!ispower) return
  switchem.emit('arrowright');
}
function arrowleft(){
  if(!ispower) return
  switchem.emit('arrowleft');
}
function capture(){
  if(!ispower) return
  switchem.emit('capture');
}
function l(){
  if(!ispower) return
  switchem.emit('l');
}
function rtopstart(){
  if(!ispower) return
  switchem.emit('rtopstart');
}
function rtopstop(){
  if(!ispower) return
  switchem.emit('rtopstop');
}
function rtopleftstart(){
  if(!ispower) return
  switchem.emit('rtopleftstart');
}
function rtopleftstop(){
  if(!ispower) return
  switchem.emit('rtopleftstop');
}
function rleftstart(){
  if(!ispower) return
  switchem.emit('rleftstart');
}
function rleftstop(){
  if(!ispower) return
  switchem.emit('rleftstop');
}
function rleftbottomstart(){
  if(!ispower) return
  switchem.emit('rleftbottomstart');
}
function rleftbottomstop(){
  if(!ispower) return
  switchem.emit('rleftbottomstop');
}
function rbottomstart(){
  if(!ispower) return
  switchem.emit('rbottomstart');
}
function rbottomstop(){
  if(!ispower) return
  switchem.emit('rbottomstop');
}
function rbottomrightstart(){
  if(!ispower) return
  switchem.emit('rbottomrightstart');
}
function rbottomrightstop(){
  if(!ispower) return
  switchem.emit('rbottomrightstop');
}
function rrightstart(){
  if(!ispower) return
  switchem.emit('rrightstart');
}
function rrightstop(){
  if(!ispower) return
  switchem.emit('rrightstop');
}
function rrighttopstart(){
  if(!ispower) return
  switchem.emit('rrighttopstart');
}
function rrighttopstop(){
  if(!ispower) return
  switchem.emit('rrighttopstop');
}
function a(){
  if(!ispower) return
  switchem.emit('a');
}
function b(){
  if(!ispower) return
  switchem.emit('b');
}
function x(){
  if(!ispower) return
  switchem.emit('x');
}
function y(){
  if(!ispower) return
  switchem.emit('y');
}
function home(){
  if(!ispower) return
  switchem.emit('home');
}
function r(){
  if(!ispower) return
  switchem.emit('r');
}
function volp(){
  if(!ispower) return
  switchem.emit('volp');
}
function volm(){
  if(!ispower) return
  switchem.emit('volm');
}
let istounpower = false;
let istopower = false;
let ispowerpressed = false;
async function power(){
  switchem.emit('power');
  ispowerpressed = true;
  if(ispower){
    unpower();
  } else {
    onpower();
  }
  function unpower(){
    if(istounpower) return;
    ispowerpressed = false;
    istounpower = true
    $('#switchcontainer').find('input, textarea, button, select').prop('disabled', true);
    $("#switchcontainer").fadeTo(300, 0, function(){
      if(sound){
        sound.pause();
        fadetimeout.pause();
      };
      istounpower = false;
      ispower = false;
      if(ispowerpressed){
        onpower();
        ispowerpressed = false;
      }
    });
  }
  function onpower(){
    if(istopower) return;
    if(sound){
      sound.play();
      fadetimeout.resume();
    };
    ispowerpressed = false;
    istopower = true
    $("#switchcontainer").fadeTo(300, 1, function(){
      istopower = false;
      ispower = true;
      $('#switchcontainer').find('input, textarea, button, select').prop("disabled", false);
      if(ispowerpressed){
        unpower();
        ispowerpressed = false;
      }
    });
  }
}
