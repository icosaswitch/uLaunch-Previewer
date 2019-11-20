const $ = require('jquery');
const fs = require('fs');
const ejs = require('ejs');
const path = require('path');
const url = require('url');
const platformFolder = require("platform-folders");
const {getCurrentWindow} = require("electron").remote;
let documents = platformFolder.getDocumentsFolder();
const html2canvas = require("html2canvas");
let ui = path.join(__dirname, "theme", "ui");
let manifest;
let emitter = require('events').EventEmitter;
let switchem = new emitter();
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
    if(keysdown[e.which]) return;
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
    }
    $(this).on('keyup', function() {
      delete keysdown[e.which];
    });
  });
  console.log('JQuery Initialized.');
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

let margin = "-5px 1px";

async function init(){
  if(!fs.existsSync(path.join(documents, "uLaunch-Tester"))){
    fs.mkdirSync(path.join(documents, "uLaunch-Tester"));
  }
  let ulaunchtester = path.join(documents, "uLaunch-Tester");
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
    fs.writeFileSync(path.join(ulaunchtester, "testersettings", "ulaunch.json"), JSON.stringify({"skipstartup":false,"isthemerestart":false,"currenttheme":"default","lang":"en","connected":false,"charging":false,"time":"auto","battery":"100%","firmware":"9.0.0","consolename":"uLaunchTester","viewer_enabled":"False","flog_enabled":"False","console_info_upload":"False","auto_titles_dl":"False","auto_update":"False","wireless_lan":"False","usb_30":"True","bluetooth":"False","nfc":"False"}, null, 2), function(err){if(err) throw err;});
  } if(!fs.existsSync(path.join(ulaunchtester, "testersettings", "menuitems.json"))){
    fs.writeFileSync(path.join(ulaunchtester, "testersettings", "menuitems.json"), JSON.stringify({"folders":{},"hb":[]}, null, 2), function(err){if(err) throw err;});
  }
  switchem.on("capture", () => {
    html2canvas(document.getElementById("switchcontainer"), {
        width: 1280,
        height: 720
    }).then(canvas => {
      canvas.setAttribute("style", "width:1280;height:720;visiblity: hidden;");
      document.body.appendChild(canvas);
      let img = $("canvas").get(0).toDataURL();
      let data = img.replace(/^data:image\/\w+;base64,/, "");
      let buf = Buffer.from(data, 'base64');
      fs.writeFileSync(path.join(__dirname, "screenshot.png"), buf, (err) => {if(err) throw err});
      document.body.removeChild(canvas);
    });
  });
  document.getElementById("switchcontainer").innerHTML = `<div id="ulaunchscreen"></div>`
  let testersettings = require(path.join(ulaunchtester, "testersettings", "ulaunch.json"));
  let currenttheme = testersettings.currenttheme;
  let user;
  let defaultui = (currenttheme === "default") ? path.join(__dirname, "ulaunch", "romFs", "default", "ui") : path.join(ulaunchtester, "sdmc", "ulaunch", "themes", currenttheme, "ui");
  let romfsui = path.join(__dirname, "ulaunch", "romFs", "default", "ui");
  let lang = require(path.join(__dirname, "ulaunch", "romFs", "LangDefault.json"));
  let uijson = InitializeUIJson(require(path.join(defaultui, "UI.json")));
  $(document.head).append("<style>@font-face {font-family: 'Font';font-style: normal;src: url('"+path.join(defaultui, "Font.ttf").replace(/\\/g, "/")+"');}</style>");
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
    quickmenucontrolleritem: existsUI("QuickMenuControllerItem.png", defaultui, romfsui),
    quickmenuhelpitem: existsUI("QuickMenuHelpItem.png", defaultui, romfsui),
    quickmenumain: existsUI("QuickMenuMain.png", defaultui, romfsui),
    quickmenusettingsitem: existsUI("QuickMenuSettingsItem.png", defaultui, romfsui),
    quickmenuthemesitem: existsUI("QuickMenuThemesItem.png", defaultui, romfsui),
    quickmenuwebitem: existsUI("QuickMenuWebItem.png", defaultui, romfsui),
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
  let size = InitializeSize({
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
    quickmenucontrolleritem: {w: 150,h: 150},
    quickmenuhelpitem: {w: 150,h: 150},
    quickmenumain: {w: 300,h: 300},
    quickmenusettingsitem: {w: 150,h: 150},
    quickmenuthemesitem: {w: 150,h: 150},
    quickmenuwebitem: {w: 150,h: 150},
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
  console.log(path.join(__dirname, "ulaunch", "romFs", "default" , "ui", "Font.ttf"))
  function startup(){
    return new Promise(function(resolve, reject) {
      let res = false;
      let selected = 0;
      let max = 0;
      let down,leftclick;
      let users = require(path.join(ulaunchtester, "testersettings", "users.json"));
      if(testersettings.skipstartup || testersettings.isthemerestart){
        if(testersettings.isthemerestart) {
          testersettings.isthemerestart = false;
          fs.writeFileSync(path.join(ulaunchtester, "testersettings", "ulaunch.json"), JSON.stringify(testersettings, null, 2), function(err){if(err) throw err;});
          ShowNotification(lang["theme_changed"]);
        }
        user = users[0];
        console.log(user);
        if(user === undefined){
          user = {"username": "Default User", "usericon": "default", "password": false}
        }
        mainmenu();
        resolve();
      } else {
        document.getElementById("ulaunchscreen").innerHTML = ejs.render(fs.readFileSync(path.join(__dirname, "ulaunch", "startup.ejs"), "utf8"), {defaulticon, lang, uijson, users, path});
        let inputs = $("#ulaunchscreen :input");
        max = inputs.length
        console.log(max);
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
            startup();
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
    return new Promise(function(resolve, reject) {
      let res = false;
      let interval = null;
      let logo = path.join(__dirname, "ulaunch", "romFs", "Logo.png");
      let gameimg = path.join(__dirname, "ulaunch", "game.png");
      let usericon = (user.usericon === "default") ? path.join(__dirname, "ulaunch", "User.png") : user.usericon;
      let games = require(path.join(__dirname, "ulaunch", "game", "games.json"));
      document.getElementById("ulaunchscreen").innerHTML = ejs.render(fs.readFileSync(path.join(__dirname, "ulaunch", "main.ejs"), "utf8"), {defaulticon, margin, games, testersettings, uijson, logo, size, usericon, gameimg});
      document.getElementById("in").innerHTML = games[0].name;
      document.getElementById("ia").innerHTML = games[0].author;
      document.getElementById("iv").innerHTML = "v"+games[0].version;
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
      $(':not(input,select,textarea)').disableSelection();
      $("#theme").click(() => {
        if(res) return;
        clearInterval(interval);
        theme();
        res = true;
        resolve();
      });
      $("#setting").click(() => {
        if(res) return;
        clearInterval(interval);
        settings();
        res = true;
        resolve();
      });
      function menuitems(){
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
              ifolders.push(`<img width="256" height="256" style="position: absolute;top: ${top}; left: ${left}" src="${defaulticon.folder}" alt="folder/${entry}/${name}"/><p style="position: absolute;top: ${uijson["menu_folder_text_y"]}; left: ${uijson["menu_folder_text_x"] + left};border: 0;font-family: 'Font'; font-size: ${uijson["menu_folder_text_size"]};margin: 0px 0px; background-color: transparent; border: 0; color: ${uijson["text_color"]}">${name}</p><input style="width:256;height:256;position: absolute;top: ${top}; left: ${left};z-index: 1;outline: none;border: none;background-color: transparent" type="button" id="${n}" alt="folder/${entry}/${name}"/>`)
            } else {
              let entry = `${titles.length} ${(titles.length < 2) ? lang["folder_entry_single"] : lang["folder_entry_mult"]}`;
              left += 276;
              ifolders.push(`<img width="256" height="256" style="position: absolute;top: ${top}; left: ${left}" src="${defaulticon.folder}" alt="folder/${entry}/${name}"/><p style="position: absolute;top: ${uijson["menu_folder_text_y"]}; left: ${uijson["menu_folder_text_x"] + left};border: 0;font-family: 'Font'; font-size: ${uijson["menu_folder_text_size"]};margin: 0px 0px; background-color: transparent; border: 0; color: ${uijson["text_color"]}">${name}</p><input style="width:256;height:256;position: absolute;top: ${top}; left: ${left};z-index: 1;outline: none;border: none;background-color: transparent" type="button" id="${n}" alt="folder/${entry}/${name}"/>`)
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
              document.getElementById("iv").innerHTML = "v"+game.version;
              left = 98;
              return `<img width="256" height="256" style="position: absolute;top: ${top}; left: ${left}" src="${path.join(__dirname, "ulaunch", "game", game.icon)}" alt="game/${game.id}"/><input style="width:256;height:256;position: absolute;top: ${top}; left: ${left};z-index: 1;outline: none;border: none;background-color: transparent" type="button" id="${n}" alt="game/${game.id}"/>`
            } else {
              left += 276;
              return `<img width="256" height="256" style="position: absolute;top: ${top}; left: ${left}" src="${path.join(__dirname, "ulaunch", "game", game.icon)}" alt="game/${game.id}"/><input style="width:256;height:256;position: absolute;top: ${top}; left: ${left};z-index: 1;outline: none;border: none;background-color: transparent" type="button" id="${n}" alt="game/${game.id}"/>`
            }
          });
          items = items.concat(igames);
          let hbi = menuitems.hb.map(file => {
            let ret = false;
            numf.map(f => {
              if(folders[f].includes(file)) ret = true;
            });
            if(ret) return "";
            file = path.join(ulaunchtester, "sdmc", "ulaunch", "entries", file);
            let content = require(file);
            if(content.icon == "" || content.icon == null || content.icon == undefined || !fs.existsSync(content.icon.replace("sdmc:", path.join(ulaunchtester, "sdmc")))) return "";
            left += 276;
            n += 1;
            return `<img width="256" height="256" style="position: absolute;top: ${top}; left: ${left}" src="${content.icon.replace("sdmc:", path.join(ulaunchtester, "sdmc"))}" alt="homebrew/${content.name.substring(0, 0x1FF)}/${content.author.substring(0, 0xFF)}/${content.version.substring(0, 0xF)}"/><input style="width:256;height:256;position: absolute;top: ${top}; left: ${left};z-index: 1;outline: none;border: none;background-color: transparent" type="button" id="${n}" alt="homebrew/${content.name.substring(0, 0x1FF)}/${content.author.substring(0, 0xFF)}/${content.version.substring(0, 0xF)}"/>`;
          });
          items = items.concat(hbi);
          items.push(`<img width="${size.cursor.w}" height="${size.cursor.h}" style="position: absolute;top: ${cursor}; left: ${98-(size.cursor.w-256)/2}" src="${defaulticon.cursor}" id="cursor"/>`)
          items.push(`<input type="button" style="position: absolute;border:none;outline:none;background-color:transparent;top:0;width:1;height:1;left:${left+256+86}"/>`)
          items = items.join("");
          document.getElementById("items").innerHTML = items;
          let max = 0;
          let selected = 0;
          let inputs = $("#items :input");
          console.log(inputs)
          max = inputs.length;
          let right;
          inputs.click((e) => {
            right = false;
            click(e.currentTarget.id);
          });
          switchem.on("arrowright", () => {
            right = true;
            click(selected+1);
          });
          switchem.on("lrightstart", () => {
            right = true;
            click(selected+1);
          });
          switchem.on("rrightstart", () => {
            right = true;
            click(selected+1);
          });
          switchem.on("arrowleft", () => {
            right = false;
            click(selected-1);
          });
          switchem.on("lleftstart", () => {
            right = false;
            click(selected-1);
          });
          switchem.on("rleftstart", () => {
            right = false;
            click(selected-1);
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
            let leftcursor = 98+276*parseInt(id)-20;
            selected = parseInt(id);
            document.getElementById("cursor").setAttribute("style", `position: absolute;top: ${cursor}; left: ${leftcursor}`);
            let alt = input.getAttribute("alt");
            if(alt.startsWith("game")){
              let game = games.find(g => g.id === alt.split("/")[1]);
              document.getElementById("in").innerHTML = game.name;
              document.getElementById("ia").innerHTML = game.author;
              document.getElementById("iv").innerHTML = "v"+game.version;
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
            if(right){
              if(selected*276-276*3 < scroll) return;
              $(`#items`).animate({
                  scrollLeft: selected*276-276*3
              }, 0);
            } else {
              if(selected*276 > scroll) return;
              $(`#items`).animate({
                  scrollLeft: selected*276
              }, 0);
            }
          }
          function dblclick(id){
            if(ress || res) return;
            let alt = document.getElementById(id).getAttribute("alt");
            if(alt.startsWith("folder")){
              ress = true;
              folderitems(alt.split("/")[2]);
              resolve();
            } else {

            }
          }
          $("#toggleclick").click(() => {
            hbmenu();
          });
          switchem.on("arrowup", () => {
            hbmenu();
          });
          switchem.on("ltopstart", () => {
            hbmenu();
          });
          switchem.on("rtopstart", () => {
            hbmenu();
          });
          function hbmenu(){
            if(ress || res) return;
            ress = true;
            hbitems();
          }
        });
      }
      function folderitems(name){
        return new Promise(function(resolve, reject) {
          let ress = false;
          document.getElementById("bi").setAttribute("style", document.getElementById("bi").getAttribute("style").replace("hidden", uijson["main_menu"]["banner_image"]["visible"]))
          document.getElementById("bf").setAttribute("style", document.getElementById("bf").getAttribute("style").replace("visible", "hidden"));
          document.getElementById("bh").setAttribute("style", document.getElementById("bh").getAttribute("style").replace("visible", "hidden"));
          let height = [size.cursor.h, size.multiselect.h, size.suspended.h].sort((a, b) => a > b)[0];
          let top = (height-256)/2;
          let left = 98;
          let n = -1;
          let folders = require(path.join(ulaunchtester, "testersettings", "menuitems.json")).folders[name];
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
              document.getElementById("iv").innerHTML = "v"+game.version;
              left = 98;
              return `<img width="256" height="256" style="position: absolute;top: ${top}; left: ${left}" src="${path.join(__dirname, "ulaunch", "game", game.icon)}" alt="game/${game.id}"/><input style="width:256;height:256;position: absolute;top: ${top}; left: ${left};z-index: 1;outline: none;border: none;background-color: transparent" type="button" id="${n}" alt="game/${game.id}"/>`
            } else {
              left += 276;
              return `<img width="256" height="256" style="position: absolute;top: ${top}; left: ${left}" src="${path.join(__dirname, "ulaunch", "game", game.icon)}" alt="game/${game.id}"/><input style="width:256;height:256;position: absolute;top: ${top}; left: ${left};z-index: 1;outline: none;border: none;background-color: transparent" type="button" id="${n}" alt="game/${game.id}"/>`
            }
          });
          let hb = folders.map(file => {
            file = path.join(ulaunchtester, "sdmc", "ulaunch", "entries", file);
            let content = require(file);
            if(content.icon == "" || content.icon == null || content.icon == undefined || !fs.existsSync(content.icon.replace("sdmc:", path.join(ulaunchtester, "sdmc")))) return "";
            left += 276;
            n += 1;
            return `<img width="256" height="256" style="position: absolute;top: ${top}; left: ${left}" src="${content.icon.replace("sdmc:", path.join(ulaunchtester, "sdmc"))}" alt="homebrew/${content.name.substring(0, 0x1FF)}/${content.author.substring(0, 0xFF)}/${content.version.substring(0, 0xF)}"/><input style="width:256;height:256;position: absolute;top: ${top}; left: ${left};z-index: 1;outline: none;border: none;background-color: transparent" type="button" id="${n}" alt="homebrew/${content.name.substring(0, 0x1FF)}/${content.author.substring(0, 0xFF)}/${content.version.substring(0, 0xF)}"/>`;
          });
          items = items.concat(hb);
          let cursor = (height-size.cursor.h)/2;
          items.push(`<img width="${size.cursor.w}" height="${size.cursor.h}" style="position: absolute;top: ${cursor}; left: ${98-(size.cursor.w-256)/2}" src="${defaulticon.cursor}" id="cursor"/>`)
          items.push(`<input type="button" style="position: absolute;border:none;outline:none;background-color:transparent;top:0;width:1;height:1;left:${left+256+86}"/>`)
          items = items.join("");
          document.getElementById("items").innerHTML = items;
          let max = 0;
          let selected = 0;
          let inputs = $("#items :input");
          console.log(inputs)
          max = inputs.length;
          let right;
          inputs.click((e) => {
            right = false;
            click(e.currentTarget.id);
          });
          switchem.on("arrowright", () => {
            right = true;
            click(selected+1);
          });
          switchem.on("lrightstart", () => {
            right = true;
            click(selected+1);
          });
          switchem.on("rrightstart", () => {
            right = true;
            click(selected+1);
          });
          switchem.on("arrowleft", () => {
            right = false;
            click(selected-1);
          });
          switchem.on("lleftstart", () => {
            right = false;
            click(selected-1);
          });
          switchem.on("rleftstart", () => {
            right = false;
            click(selected-1);
          });
          switchem.on("a", () => {
            dblclick(selected);
          });
          switchem.on("b", () => {
            if(ress || res) return;
            ress = true;
            menuitems();
          });
          inputs.dblclick((e) => {
            dblclick(e.currentTarget.id);
          });
          function click(id){
            if(ress || res) return;
            let input = document.getElementById(id);
            if(input === null) return;
            let cursor = ([size.cursor.h, size.multiselect.h, size.suspended.h].sort((a, b) => a > b)[0]-size.cursor.h)/2;
            let leftcursor = 98+276*parseInt(id)-20;
            selected = parseInt(id);
            document.getElementById("cursor").setAttribute("style", `position: absolute;top: ${cursor}; left: ${leftcursor}`);
            let alt = input.getAttribute("alt");
            if(alt.startsWith("game")){
              let game = games.find(g => g.id === alt.split("/")[1]);
              document.getElementById("in").innerHTML = game.name;
              document.getElementById("ia").innerHTML = game.author;
              document.getElementById("iv").innerHTML = "v"+game.version;
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
            if(right){
              if(selected*276-276*3 < scroll) return;
              $(`#items`).animate({
                  scrollLeft: selected*276-276*3
              }, 0);
            } else {
              if(selected*276 > scroll) return;
              $(`#items`).animate({
                  scrollLeft: selected*276
              }, 0);
            }
          }
          function dblclick(id){
            if(ress || res) return;

          }
          $("#toggleclick").click(() => {
            hbmenu();
          });
          switchem.on("arrowup", () => {
            hbmenu();
          });
          switchem.on("ltopstart", () => {
            hbmenu();
          });
          switchem.on("rtopstart", () => {
            hbmenu();
          });
          function hbmenu(){
            if(ress || res) return;
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
          document.getElementById("in").innerHTML = "Launch hbmenu";
          document.getElementById("ia").innerHTML = "";
          document.getElementById("iv").innerHTML = "";
          let height = [size.cursor.h, size.multiselect.h, size.suspended.h].sort((a, b) => a > b)[0];
          let top = (height-256)/2;
          let menuhb = require(path.join(ulaunchtester, "testersettings", "menuitems.json")).hb;
          let jsonsfiles = getFiles(path.join(ulaunchtester, "sdmc", "ulaunch", "entries"));
          let left = 98;
          let n = 0;
          let items = [];
          items.push(`<img width="256" height="256" style="position: absolute;top: ${top}; left: ${left}" src="${defaulticon.hbmenu}" alt="Launch hbmenu//"/><input style="width:256;height:256;position: absolute;top: ${top}; left: ${left};z-index: 1;outline: none;border: none;background-color: transparent" type="button" id="${n}" alt="Launch hbmenu//"/>`)
          let cursor = (height-size.cursor.h)/2;
          let hbi = jsonsfiles.map(file => {
            if(!file.endsWith(".json")) return "";
            if(menuhb.includes(path.basename(file))) return "";
            let content = require(file);
            if(content.icon == "" || content.icon == null || content.icon == undefined || !fs.existsSync(content.icon.replace("sdmc:", path.join(ulaunchtester, "sdmc")))) return "";
            left += 276;
            n += 1;
            return `<img width="256" height="256" style="position: absolute;top: ${top}; left: ${left}" src="${content.icon.replace("sdmc:", path.join(ulaunchtester, "sdmc"))}" alt="${content.name.substring(0, 0x1FF)}/${content.author.substring(0, 0xFF)}/${content.version.substring(0, 0xF)}"/><input style="width:256;height:256;position: absolute;top: ${top}; left: ${left};z-index: 1;outline: none;border: none;background-color: transparent" type="button" id="${n}" alt="${content.name.substring(0, 0x1FF)}/${content.author.substring(0, 0xFF)}/${content.version.substring(0, 0xF)}"/>`;
          });
          console.log(hbi);
          items = items.concat(hbi);
          items.push(`<img width="${size.cursor.w}" height="${size.cursor.h}" style="position: absolute;top: ${cursor}; left: ${98-(size.cursor.w-256)/2}" src="${defaulticon.cursor}" id="cursor"/>`)
          items.push(`<input type="button" style="position: absolute;border:none;outline:none;background-color:transparent;top:0;width:1;height:1;left:${left+256+86}"/>`)
          items = items.join("");
          document.getElementById("items").innerHTML = items;
          let max = 0;
          let selected = 0;
          let inputs = $("#items :input");
          console.log(inputs)
          max = inputs.length;
          let right;
          inputs.click((e) => {
            right = false;
            click(e.currentTarget.id);
          });
          switchem.on("arrowright", () => {
            right = true;
            click(selected+1);
          });
          switchem.on("lrightstart", () => {
            right = true;
            click(selected+1);
          });
          switchem.on("rrightstart", () => {
            right = true;
            click(selected+1);
          });
          switchem.on("arrowleft", () => {
            right = false;
            click(selected-1);
          });
          switchem.on("lleftstart", () => {
            right = false;
            click(selected-1);
          });
          switchem.on("rleftstart", () => {
            right = false;
            click(selected-1);
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
            let leftcursor = 98+276*parseInt(id)-20;
            selected = parseInt(id);
            document.getElementById("cursor").setAttribute("style", `position: absolute;top: ${cursor}; left: ${leftcursor}`);
            let alt = input.getAttribute("alt").split("/");
            document.getElementById("in").innerHTML = alt[0];
            document.getElementById("ia").innerHTML = alt[1];
            document.getElementById("iv").innerHTML = alt[2];
            let scroll = document.getElementById("items").scrollLeft;
            if(right){
              if(selected*276-276*3 < scroll) return;
              $(`#items`).animate({
                  scrollLeft: selected*276-276*3
              }, 0);
            } else {
              if(selected*276 > scroll) return;
              $(`#items`).animate({
                  scrollLeft: selected*276
              }, 0);
            }
          }
          function dblclick(id){
            if(ress || res) return;

          }
          $("#toggleclick").click(() => {
            menu();
          });
          switchem.on("arrowup", () => {
            menu();
          });
          switchem.on("ltopstart", () => {
            menu();
          });
          switchem.on("rtopstart", () => {
            menu();
          });
          function menu(){
            if(ress || res) return;
            ress = true;
            menuitems();
          }
        });
      }
      menuitems();
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
      let selected = 0;
      let themes = getFiles(path.join(ulaunchtester, "sdmc", "ulaunch", "themes")).filter(n => n.indexOf("Manifest") !== -1);
      themes = themes.map(n => {
        return {
          path: n.split("/")[1],
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
          return ShowNotification(lang["theme_no_custom"]);
        } else if(testersettings.currenttheme === tpath){
          return ShowNotification(lang["theme_active_this"]);
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
      let max = 0;
      let selected = 0;
      let settings = [
        {
          "value": `${lang["set_console_nickname"]}: ${testersettings.consolename}`,
          "id": 0
        },
        {
          "value": `${lang["set_console_timezone"]}: ${Intl.DateTimeFormat().resolvedOptions().timeZone}`,
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
          "value": `${lang["set_console_lang"]}: ${testersettings["lang"]}`,
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
      function dblclick(id){
        if(res) return;
        let input = document.getElementById(id);
        let setting = settings[id];
        if(setting.id === -1) return;
        if(id == 2){
          let p = document.getElementById(`${id}t`);
          if(p.innerHTML.indexOf("False") !== -1){
            testersettings["viewer_enabled"] = "True";
            fs.writeFileSync(path.join(ulaunchtester, "testersettings", "ulaunch.json"), JSON.stringify(testersettings, null, 2), function(err){if(err) throw err;});
            p.innerHTML = p.innerHTML.replace("False", "True");
          } else {
            testersettings["viewer_enabled"] = "False";
            fs.writeFileSync(path.join(ulaunchtester, "testersettings", "ulaunch.json"), JSON.stringify(testersettings, null, 2), function(err){if(err) throw err;});
            p.innerHTML = p.innerHTML.replace("True", "False");
          }
        } else if(id == 3){
          let p = document.getElementById(`${id}t`);
          if(p.innerHTML.indexOf("False") !== -1){
            testersettings["flog_enabled"] = "True";
            fs.writeFileSync(path.join(ulaunchtester, "testersettings", "ulaunch.json"), JSON.stringify(testersettings, null, 2), function(err){if(err) throw err;});
            p.innerHTML = p.innerHTML.replace("False", "True");
          } else {
            testersettings["flog_enabled"] = "False";
            fs.writeFileSync(path.join(ulaunchtester, "testersettings", "ulaunch.json"), JSON.stringify(testersettings, null, 2), function(err){if(err) throw err;});
            p.innerHTML = p.innerHTML.replace("True", "False");
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
          console.log("language");
        }
      }
    });
  }
  startup();
}

function makeid(length) {
   var result           = '';
   var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   var charactersLength = characters.length;
   for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}

async function ShowNotification(text, ms = 1500){
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
  let id = makeid(20);
  $(document.body).append(`<p id="${id}" style="font-family: 'Font';font-size:20;position:absolute;top:0;left:0;opacity:0;margin:0px 0px;padding: 0px">${text}</p>`)
  var test = document.getElementById(id);
  let textw = test.clientWidth;
  let texth = test.clientHeight;
  let toastw = textw + (texth * 4);
  let toasth = texth * 3;
  console.log(toastw);
  console.log(toasth);
  $("#"+id).remove();
  $("#switchcontainer").append(`<input type="button" id="notification" style="position: absolute;left: ${(1280 - toastw) / 2};top: 550;width: ${toastw};text-align: center;color: #e1e1e1;z-index: 2;height: ${toasth};font-size: 20;padding: 10 32.5;border: none;border-radius: 32.5px;background-color: #1e1e1e;opacity:0;" value="${text}"/>=`);
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
    if(typeof defjson[obj1] === "string"){
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

function InitializeSize(size, defaulticon, uijson){
  let sizeKeys = Object.keys(size);
  for(var i=0; i<sizeKeys.length; i++){
    let s = size[i];
    let k = sizeKeys[i];
    let img = fs.readFileSync(defaulticon[k]);
    img = {w: img.readUInt32BE(16),h: img.readUInt32BE(20)}
    if(size["topmenu"].w !== img.w && size["topmenu"].h !== img.h && k === "topmenu"){
      margin = "0px 0px";
    }
    size[k] = img;
  }
  return size;
}

function visibility(visible){
  if(visible === false){
    return "hidden";
  } else {
    return "visible";
  }
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
