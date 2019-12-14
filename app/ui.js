let $,jQuery;
$ = jQuery = require("jquery");
const fs = require('fs');
const ejs = require('ejs');
const path = require('path');
const url = require('url');
const {Howler} = require('howler');
const platformFolder = require("platform-folders");
const {ipcRenderer} = require("electron");
const {getCurrentWindow, dialog} = require("electron").remote;
let documents = platformFolder.getDocumentsFolder();
const html2canvas = require("html2canvas");
let ui = path.join(__dirname, "theme", "ui");
let manifest;
let windowSize;
ipcRenderer.on("setSize", async (event, arg, data) => {
  windowSize = arg;
});
ipcRenderer.send("getSize", "");
let maker = false;
let emitter = require('events').EventEmitter;
let switchem = new emitter();
let makerem = new emitter();
switchem.setMaxListeners(Infinity);
let istyping = false;
function getWidth(w){
  if(windowSize == undefined){while(true){if(windowSize !== undefined){break}}}
  return (w*windowSize.w)/1810;
} function getHeight(h){
  if(windowSize == undefined){while(true){if(windowSize !== undefined){break}}}
  return (h*windowSize.h)/800;
} function getOrigWidth(w){
  if(windowSize == undefined){while(true){if(windowSize !== undefined){break}}}
  if(typeof w == "string"){
    if(w.indexOf("%") !== -1) return w;
    if(w.indexOf("em") !== -1){
      return 1.5+"em";
    }
    w = parseFloat(w.replace("px", ""));
  }
  return (w*1810)/windowSize.w;
} function getOrigHeight(h){
  if(windowSize == undefined){while(true){if(windowSize !== undefined){break}}}
  if(typeof h == "string"){
    if(h.indexOf("%") !== -1) return h;
    h = parseFloat(h.replace("px", ""));
  }
  return (h*800)/windowSize.h;
}
let ulaunchtester = path.join(documents, "uLaunch-Previewer");
$(function() {
  if(!fs.existsSync(ulaunchtester)){
    fs.mkdirSync(ulaunchtester);
  }
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
    fs.writeFileSync(path.join(ulaunchtester, "testersettings", "ulaunch.json"), JSON.stringify({"skipstartup":false,"isthemerestart":false,"volume":1,"currenttheme":"default","lang":"en-US","connected":false,"charging":false,"time":"auto","battery":"100%","firmware":"9.1.0","consolename":"uLaunchPreviewer","viewer_enabled":"False","flog_enabled":"False","console_info_upload":"False","auto_titles_dl":"False","auto_update":"False","wireless_lan":"False","usb_30":"True","bluetooth":"False","nfc":"False","joyconleft":"#00c3e3","joyconright":"#ff4554"}, null, 2), function(err){if(err) throw err;});
  } if(!fs.existsSync(path.join(ulaunchtester, "testersettings", "menuitems.json"))){
    fs.writeFileSync(path.join(ulaunchtester, "testersettings", "menuitems.json"), JSON.stringify({"folders":{},"hb":[]}, null, 2), function(err){if(err) throw err;});
  } if(!fs.existsSync(path.join(ulaunchtester, "screenshot"))){
    fs.mkdirSync(path.join(ulaunchtester, "screenshot"));
  }
  try{
    testersettings = require(path.join(ulaunchtester, "testersettings", "ulaunch.json"));
  } catch(e){
    corrupted(path.join(ulaunchtester, "testersettings", "ulaunch.json"));
  }
  $("#switchcss").html(ejs.render(fs.readFileSync(path.join(__dirname, "switch", "style.css"), "utf8")), {path, testersettings});
  $("#joystickcss").html(ejs.render(fs.readFileSync(path.join(__dirname, "switch", "joystick.css"), "utf8")));
  $("#ulaunchcss").html(ejs.render(fs.readFileSync(path.join(__dirname, "ulaunch", "style.css"), "utf8")));
  $("#switch").html(ejs.render(fs.readFileSync(path.join(__dirname, "switch.ejs"), "utf8")));
  $(".center").html(ejs.render(fs.readFileSync(path.join(__dirname, "center.ejs"), "utf8")));
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
  $.fn.getDefaultElement = function() {
    let div = this.get(0).cloneNode(true);
    div.id = "screenshot";
    div.style = "width:1280;height:720;position:absolute;top:10;left:50;z-index:-2;";
    document.body.appendChild(div);
    function transformAll(NodeList){
      NodeList.forEach((element) => {
        if(element.nodeType == 3) return;
        let name = element.nodeName;
        let top = getOrigHeight(element.style.top);
        let left = getOrigWidth(element.style.left);
        let fontsize = getOrigWidth(element.style.fontSize);
        let width,height;
        if(name === "IMG"){
          width = getOrigWidth(element.getAttribute("width"));
          height = getOrigHeight(element.getAttribute("height"));
        } else {
          width = getOrigWidth(element.style.width);
          height = getOrigHeight(element.style.height);
        }
        if(!isNaN(top)){
          element.style.top = top;
        } if(!isNaN(left)){
          element.style.left = left;
        } if(name === "IMG"){
          if(!isNaN(width)){
            element.width = width;
          } if(!isNaN(height)){
            element.height = height;
          }
        } else {
          if(!isNaN(width)){
            element.style.width = width;
          } if(!isNaN(height)){
            element.style.height = height;
          } if(!isNaN(fontsize) || fontsize.toString().endsWith("em")){
            element.style.fontSize = fontsize;
          }
        }
        if(name === "DIV"){
          if(`#ulaunchscreen #${element.id}` !== `#ulaunchscreen #`){
            element.scrollTop = $(`#ulaunchscreen #${element.id}`).get(0).scrollTop;
            element.scrollLeft = $(`#ulaunchscreen #${element.id}`).get(0).scrollLeft;
          }
          transformAll(element.childNodes);
        }
      });
      return;
    }
    transformAll(div.childNodes);
    return div;
  };
  let keysdown = {};
  $(document).keydown(function(e){
    if(e.which === 123){
      if(getCurrentWindow().isDevToolsOpened()){
        getCurrentWindow().webContents.closeDevTools();
      } else {
        getCurrentWindow().webContents.openDevTools({mode: "detach"});
      }
      e.preventDefault();
    } if(e.which === 38){
      makerem.emit("up");
      e.preventDefault();
    } if(e.which === 40){
      makerem.emit("down");
      e.preventDefault();
    } if(e.which === 37){
      makerem.emit("left");
      e.preventDefault();
    } if(e.which === 39){
      makerem.emit("right");
      e.preventDefault();
    }
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
    document.getElementById("ljoybutton").setAttribute("style", `position:relative;top:${getHeight(0)};left:${getWidth(-20)}`);
    ltopstart();
  }).on('mouseup mouseleave', function() {
    document.getElementById("ljoybutton").setAttribute("style", `position:relative;top:${getHeight(20)};left:${getWidth(-20)}`);
    ltopstop();
  });
  $('#ltopleft').on('mousedown', function() {
    document.getElementById("ljoybutton").setAttribute("style", `position:relative;top:${getHeight(0)};left:${getWidth(-40)}`);
    ltopleftstart();
  }).on('mouseup mouseleave', function() {
    document.getElementById("ljoybutton").setAttribute("style", `position:relative;top:${getHeight(20)};left:${getWidth(-20)}`);
    ltopleftstop();
  });
  $('#lleft').on('mousedown', function() {
    document.getElementById("ljoybutton").setAttribute("style", `position:relative;top:${getHeight(20)};left:${getWidth(-40)}`);
    lleftstart();
  }).on('mouseup mouseleave', function() {
    document.getElementById("ljoybutton").setAttribute("style", `position:relative;top:${getHeight(20)};left:${getWidth(-20)}`);
    lleftstop();
  });
  $('#lleftbottom').on('mousedown', function() {
    document.getElementById("ljoybutton").setAttribute("style", `position:relative;top:${getHeight(40)};left:${getWidth(-40)}`);
    lleftbottomstart();
  }).on('mouseup mouseleave', function() {
    document.getElementById("ljoybutton").setAttribute("style", `position:relative;top:${getHeight(20)};left:${getWidth(-20)}`);
    lleftbottomstop();
  });
  $('#lbottom').on('mousedown', function() {
    document.getElementById("ljoybutton").setAttribute("style", `position:relative;top:${getHeight(40)};left:${getWidth(-20)}`);
    lbottomstart();
  }).on('mouseup mouseleave', function() {
    document.getElementById("ljoybutton").setAttribute("style", `position:relative;top:${getHeight(20)};left:${getWidth(-20)}`);
    lbottomstop();
  });
  $('#lbottomright').on('mousedown', function() {
    document.getElementById("ljoybutton").setAttribute("style", `position:relative;top:${getHeight(40)};left:${getWidth(0)}`);
    lbottomrightstart();
  }).on('mouseup mouseleave', function() {
    document.getElementById("ljoybutton").setAttribute("style", `position:relative;top:${getHeight(20)};left:${getWidth(-20)}`);
    lbottomrightstop();
  });
  $('#lright').on('mousedown', function() {
    document.getElementById("ljoybutton").setAttribute("style", `position:relative;top:${getHeight(20)};left:${getWidth(0)}`);
    lrightstart();
  }).on('mouseup mouseleave', function() {
    document.getElementById("ljoybutton").setAttribute("style", `position:relative;top:${getHeight(20)};left:${getWidth(-20)}`);
    lrightstop();
  });
  $('#lrighttop').on('mousedown', function() {
    document.getElementById("ljoybutton").setAttribute("style", `position:relative;top:${getHeight(0)};left:${getWidth(0)}`);
    lrighttopstart();
  }).on('mouseup mouseleave', function() {
    document.getElementById("ljoybutton").setAttribute("style", `position:relative;top:${getHeight(20)};left:${getWidth(-20)}`);
    lrighttopstop();
  });
  $('#rtop').on('mousedown', function() {
    document.getElementById("rjoybutton").setAttribute("style", `position:relative;top:${getHeight(0)};left:${getWidth(-20)}`);
    rtopstart();
  }).on('mouseup mouseleave', function() {
    document.getElementById("rjoybutton").setAttribute("style", `position:relative;top:${getHeight(20)};left:${getWidth(-20)}`);
    rtopstop();
  });
  $('#rtopleft').on('mousedown', function() {
    document.getElementById("rjoybutton").setAttribute("style", `position:relative;top:${getHeight(0)};left:${getWidth(-40)}`);
    rtopleftstart();
  }).on('mouseup mouseleave', function() {
    document.getElementById("rjoybutton").setAttribute("style", `position:relative;top:${getHeight(20)};left:${getWidth(-20)}`);
    rtopleftstop();
  });
  $('#rleft').on('mousedown', function() {
    document.getElementById("rjoybutton").setAttribute("style", `position:relative;top:${getHeight(20)};left:${getWidth(-40)}`);
    rleftstart();
  }).on('mouseup mouseleave', function() {
    document.getElementById("rjoybutton").setAttribute("style", `position:relative;top:${getHeight(20)};left:${getWidth(-20)}`);
    rleftstop();
  });
  $('#rleftbottom').on('mousedown', function() {
    document.getElementById("rjoybutton").setAttribute("style", `position:relative;top:${getHeight(40)};left:${getWidth(-40)}`);
    rleftbottomstart();
  }).on('mouseup mouseleave', function() {
    document.getElementById("rjoybutton").setAttribute("style", `position:relative;top:${getHeight(20)};left:${getWidth(-20)}`);
    rleftbottomstop();
  });
  $('#rbottom').on('mousedown', function() {
    document.getElementById("rjoybutton").setAttribute("style", `position:relative;top:${getHeight(40)};left:${getWidth(-20)}`);
    rbottomstart();
  }).on('mouseup mouseleave', function() {
    document.getElementById("rjoybutton").setAttribute("style", `position:relative;top:${getHeight(20)};left:${getWidth(-20)}`);
    rbottomstop();
  });
  $('#rbottomright').on('mousedown', function() {
    document.getElementById("rjoybutton").setAttribute("style", `position:relative;top:${getHeight(40)};left:${getWidth(0)}`);
    rbottomrightstart();
  }).on('mouseup mouseleave', function() {
    document.getElementById("rjoybutton").setAttribute("style", `position:relative;top:${getHeight(20)};left:${getWidth(-20)}`);
    rbottomrightstop();
  });
  $('#rright').on('mousedown', function() {
    document.getElementById("rjoybutton").setAttribute("style", `position:relative;top:${getHeight(20)};left:${getWidth(0)}`);
    rrightstart();
  }).on('mouseup mouseleave', function() {
    document.getElementById("rjoybutton").setAttribute("style", `position:relative;top:${getHeight(20)};left:${getWidth(-20)}`);
    rrightstop();
  });
  $('#rrighttop').on('mousedown', function() {
    document.getElementById("rjoybutton").setAttribute("style", `position:relative;top:${getHeight(0)};left:${getWidth(0)}`);
    rrighttopstart();
  }).on('mouseup mouseleave', function() {
    document.getElementById("rjoybutton").setAttribute("style", `position:relative;top:${getHeight(20)};left:${getWidth(-20)}`);
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
let timeinterval = null;
let romfsui = undefined;
let lang = undefined;

async function init(){
  switchem.on("capture", () => {
    let div = $("#ulaunchscreen").getDefaultElement();
    html2canvas(div, {
        width: 1280,
        height: 720
    }).then(canvas => {
      document.body.removeChild(div);
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
  $("#switchcontainer").append(`<div id="ulaunchscreen"></div>`);
  let currenttheme = testersettings.currenttheme;
  let user;
  let timeout = null;
  document.getElementById("setvol").setAttribute("style", document.getElementById("setvol").getAttribute("style").replace(`width:300`, `width:${parseInt(testersettings.volume*getWidth(300))}`));
  let vnum = getWidth(15);
  switchem.on("volp", () => {
    clearTimeout(timeout);
    var HTMLvolume = parseFloat(document.getElementById("setvol").getAttribute("style").split("width:")[1].split(";")[0].replace("px", ""));
    if(HTMLvolume/getWidth(300) >= 1){
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
      document.getElementById("setvol").setAttribute("style", document.getElementById("setvol").getAttribute("style").replace(`width: ${HTMLvolume}`, `width: ${parseInt(HTMLvolume+vnum)}`).replace(`width:${HTMLvolume}`, `width:${parseInt(HTMLvolume+vnum)}`));
      $("#vol").fadeTo(100, 1, function(){
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          $("#vol").fadeTo(100, 0);
        }, 3000);
      });
      Howler.volume((HTMLvolume+vnum)/getWidth(300));
      testersettings.volume = (HTMLvolume+vnum)/getWidth(300);
      fs.writeFileSync(path.join(ulaunchtester, "testersettings", "ulaunch.json"), JSON.stringify(testersettings, null, 2), function(err){if(err) throw err;});
    }
  });
  switchem.on("volm", () => {
    clearTimeout(timeout);
    var HTMLvolume = parseInt(document.getElementById("setvol").getAttribute("style").split("width:")[1].split(";")[0].replace("px", ""));
    if(HTMLvolume/getWidth(300) <= 0){
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
      document.getElementById("setvol").setAttribute("style", document.getElementById("setvol").getAttribute("style").replace(`width: ${HTMLvolume}`, `width: ${parseInt(HTMLvolume-vnum)}`).replace(`width:${HTMLvolume}`, `width:${parseInt(HTMLvolume-vnum)}`));
      $("#vol").fadeTo(100, 1, function(){
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          $("#vol").fadeTo(100, 0);
        }, 3000);
      });
      Howler.volume((HTMLvolume-vnum)/getWidth(300));
      testersettings.volume = (HTMLvolume-vnum)/getWidth(300);
      fs.writeFileSync(path.join(ulaunchtester, "testersettings", "ulaunch.json"), JSON.stringify(testersettings, null, 2), function(err){if(err) throw err;});
    }
  });
  switchem.on("home", () => {
    if(maker) return;
    setTimeout(() => {
      if(sound){
        sound.pause();
        fadetimeout.pause();
      }
      maker = true;
      $("#ulaunchscreen").hide();
      $(document.head).append(`<style>@font-face {font-family: 'uLaunch';font-style: normal;src: url('data:font/ttf;base64,${fs.readFileSync(existsUI("Font.ttf", romfsui, romfsui)).toString("base64")}');}</style>`);
      if($("#maker").get(0) == undefined){
        $("#switchcontainer").append(`<div id="maker" style="background-color:#424242;font-family:'uLaunch';width:${getWidth(1280)};height:${getHeight(720)};color:#e1e1e1"></div>`);
        makermenu();
      } else {
        $("#maker").show();
      }
    }, 1);
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
  romfsui = path.join(__dirname, "ulaunch", "romFs", "default", "ui");
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
  lang = InitializeLang(testersettings.lang, Languages);
  let uijson = InitializeUIJson(require(existsUI("UI.json", defaultui, romfsui)));
  $(document.head).append(`<style>@font-face {font-family: 'Font';font-style: normal;src: url('data:font/ttf;base64,${fs.readFileSync(existsUI("Font.ttf", defaultui, romfsui)).toString("base64")}');}</style>`);
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
      let users
      try{
        users = require(path.join(ulaunchtester, "testersettings", "users.json"));
      }catch(e){
        corrupted(path.join(ulaunchtester, "testersettings", "users.json"));
      }
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
          let dialog = await createDialog(lang["ulaunch_about"], `uLaunch v0.2<br><br>${lang["ulaunch_desc"]}:<br>https://github.com/XorTroll/uLaunch`, [lang["ok"]], false, path.join(__dirname, "ulaunch", "romFs", "LogoLarge.png"));
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
            if(selected*getHeight(100)-getHeight(400) < scroll) return;
            $(`#users`).animate({
                scrollTop: selected*getHeight(100)-getHeight(400)
            }, 0);
          } else {
            if(selected*getHeight(100) > scroll) return;
            $(`#users`).animate({
                scrollTop: selected*getHeight(100)
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
        timeinterval = setInterval(() => {
          time = new Date();
          hour = hours[time.getHours()];
          minute = minutes[time.getMinutes()];
          times = `${hour}:${minute}`;
          document.getElementById("time").innerHTML = times;
        }, 1);
      }
      $("#theme").click(() => {
        if(res) return;
        clearInterval(timeinterval);
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
        clearInterval(timeinterval);
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
            clearInterval(timeinterval);
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
        let html = `<div style="background-color: #323232DC;z-index:99;position:absolute;top:0;left:0;width:${getWidth(1280)};height:${getHeight(720)};" id="quickmenu">`;
        let MainItemSize = 300;
        let SubItemsSize = 150;
        let CommonAreaSize = 50;
        let MainItemX = ((getWidth(1280) - getWidth(MainItemSize)) / 2);
        let MainItemY = ((getHeight(720) - getHeight(MainItemSize)) / 2);
        html += `<img width="${getWidth(MainItemSize)}" height="${getHeight(MainItemSize)}" style="position:absolute;top:${MainItemY};left:${MainItemX};" src="${defaulticon.quickmenumain}"/>`;
        let item_map = [
          ["up", defaulticon.usericon],
          ["upleft", defaulticon.powericon],
          ["upright", defaulticon.settingsicon],
          ["left", defaulticon.controllericon],
          ["right", defaulticon.themesicon],
          ["downleft", defaulticon.webicon],
          ["downright", defaulticon.albumicon],
          ["down", defaulticon.helpicon]
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
              let texw = getWidth(img.width);
              let texh = getHeight(img.height);
              x += (getWidth(SubItemsSize) - texw) / 2;
              y += (getHeight(SubItemsSize) - texh) / 2;
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
              x += ((getWidth(MainItemSize) - getWidth(SubItemsSize)) / 2);
              y -= getHeight(SubItemsSize);
              break
            case 'down':
              x += ((getWidth(MainItemSize) - getWidth(SubItemsSize)) / 2);
              y += getHeight(MainItemSize);
              break;
            case 'left':
              x -= getWidth(SubItemsSize);
              y += ((getHeight(MainItemSize) - getHeight(SubItemsSize)) / 2);
              break;
            case 'right':
              x += getWidth(MainItemSize);
              y += ((getHeight(MainItemSize) - getHeight(SubItemsSize)) / 2);
              break;
            case 'upleft':
              x -= (getWidth(SubItemsSize) - getWidth(CommonAreaSize));
              y -= (getHeight(SubItemsSize) - getHeight(CommonAreaSize));
              break;
            case 'upright':
              x += (getWidth(MainItemSize) - getWidth(CommonAreaSize));
              y -= (getHeight(SubItemsSize) - getHeight(CommonAreaSize));
              break;
            case 'downleft':
              x -= (getWidth(SubItemsSize) - getWidth(CommonAreaSize));
              y += (getHeight(MainItemSize) - getHeight(CommonAreaSize));
              break;
            case 'downright':
              x += (getWidth(MainItemSize) - getWidth(CommonAreaSize));
              y += (getHeight(MainItemSize) - getHeight(CommonAreaSize));
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
            case 'upleft':
              selected = 1;
              break;
            case 'upright':
              selected = 2;
              break;
            case 'left':
              selected = 3;
              break;
            case 'right':
              selected = 4;
              break;
            case 'downleft':
              selected = 5;
              break;
            case 'downright':
              selected = 6;
              break;
            case 'down':
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
          } else if(selected == 2){
            res = false;
            $("#setting").trigger("click");
          } else if(selected == 4){
            res = false;
            $("#theme").trigger("click");
          } else if(selected == 1){
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
      function mainmenugh(){
        return new Promise(async function(resolve, reject) {
          let ress = false;
          document.getElementById("bi").setAttribute("style", document.getElementById("bi").getAttribute("style").replace("hidden", uijson["main_menu"]["banner_image"]["visible"]))
          document.getElementById("bf").setAttribute("style", document.getElementById("bf").getAttribute("style").replace("visible", "hidden"));
          document.getElementById("bh").setAttribute("style", document.getElementById("bh").getAttribute("style").replace("visible", "hidden"));
          let menuitems;
          try{
            menuitems = require(path.join(ulaunchtester, "testersettings", "menuitems.json"));
          }catch(e){
            corrupted(path.join(ulaunchtester, "testersettings", "menuitems.json"));
          }
          let height = getHeight([size.cursor.h, size.multiselect.h, size.suspended.h].sort((a, b) => a > b)[0]);
          let top = (height-getHeight(256))/2;
          let left = 0;
          let n = -1;
          let cursor = (height-getHeight(size.cursor.h))/2;
          let suspendedd = (height-getHeight(size.suspended.h))/2;
          let multiselectt = (height-getHeight(size.multiselect.h))/2;
          let items = [];
          let folders = menuitems.folders;
          let ifolders = [];
          let numf = Object.keys(folders);
          let ids = [];
          let entryfiles = getFiles(path.join(ulaunchtester, "sdmc", "ulaunch", "entries"));
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
              left = getWidth(98);
              ifolders.push(`<img width="${getWidth(256)}" height="${getHeight(256)}" style="position: absolute;top: ${top}; left: ${left}" src="${defaulticon.folder}" alt="folder/${entry}/${name}"/><p style="position: absolute;top: ${getHeight(uijson["menu_folder_text_y"]) + top}; left: ${getWidth(uijson["menu_folder_text_x"]) + left};border: 0;font-family: 'Font'; font-size: ${getHeight(uijson["menu_folder_text_size"])};margin: 0px 0px; background-color: transparent; border: 0; color: ${uijson["text_color"]}">${name}</p><input style="width:${getWidth(256)};height:${getHeight(256)};position: absolute;top: ${top}; left: ${left};z-index: 1;outline: none;border: none;background-color: transparent;pointer-events:auto;" type="button" id="${n}" alt="folder/${entry}/${name}"/>`)
            } else {
              let entry = `${titles.length} ${(titles.length < 2) ? lang["folder_entry_single"] : lang["folder_entry_mult"]}`;
              left += getWidth(276);
              ifolders.push(`<img width="${getWidth(256)}" height="${getHeight(256)}" style="position: absolute;top: ${top}; left: ${left}" src="${defaulticon.folder}" alt="folder/${entry}/${name}"/><p style="position: absolute;top: ${getHeight(uijson["menu_folder_text_y"]) + top}; left: ${getWidth(uijson["menu_folder_text_x"]) + left};border: 0;font-family: 'Font'; font-size: ${getHeight(uijson["menu_folder_text_size"])};margin: 0px 0px; background-color: transparent; border: 0; color: ${uijson["text_color"]}">${name}</p><input style="width:${getWidth(256)};height:${getHeight(256)};position: absolute;top: ${top}; left: ${left};z-index: 1;outline: none;border: none;background-color: transparent;pointer-events:auto;" type="button" id="${n}" alt="folder/${entry}/${name}"/>`)
            }
          }
          items = items.concat(ifolders);
          let igames = games.map((game) => {
            if(ids.includes(game.id)) return "";
            let name = game.name;
            let author = game.author;
            let version = game.version;
            let icon = path.join(__dirname, "ulaunch", "game", game.icon);
            entryfiles.map(n => {
              let json = require(n);
              if(json.type !== 1) return;
              if(json.application_id !== game.id) return;
              if(json.icon) icon = json.icon;
              if(json.name) name = json.name;
              if(json.author) author = json.author;
              if(json.version) version = json.version;
            });
            n += 1;
            let width = 256;
            let height = 256;
            if(n == 0){
              document.getElementById("in").innerHTML = name;
              document.getElementById("ia").innerHTML = author;
              document.getElementById("iv").innerHTML = version;
              left = getWidth(98);
              return `<img width="${getWidth(256)}" height="${getHeight(256)}" style="position: absolute;top: ${top}; left: ${left}" src="${icon}" alt="game/${game.id}"/><input style="width:${getWidth(256)};height:${getHeight(256)};position: absolute;top: ${top}; left: ${left};z-index: 1;outline: none;border: none;background-color: transparent;pointer-events:auto;" type="button" id="${n}" alt="game/${game.id}"/>`
            } else {
              left += getWidth(276);
              return `<img width="${getWidth(256)}" height="${getHeight(256)}" style="position: absolute;top: ${top}; left: ${left}" src="${icon}" alt="game/${game.id}"/><input style="width:${getWidth(256)};height:${getHeight(256)};position: absolute;top: ${top}; left: ${left};z-index: 1;outline: none;border: none;background-color: transparent;pointer-events:auto;" type="button" id="${n}" alt="game/${game.id}"/>`
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
              left += getWidth(276);
              n += 1;
              return `<img width="${getWidth(256)}" height="${getHeight(256)}" style="position: absolute;top: ${top}; left: ${left}" src="${defaulticon.hbmenu}" alt="homebrew/${lang["hbmenu_launch"]}///hbmenu"/><input style="width:${getWidth(256)};height:${getHeight(256)};position: absolute;top: ${top}; left: ${left};z-index: 1;outline: none;border: none;background-color: transparent;pointer-events:auto;" type="button" id="${n}" alt="homebrew/${lang["hbmenu_launch"]}///hbmenu"/>`
            } else {
              let filename = file;
              file = path.join(ulaunchtester, "sdmc", "ulaunch", "entries", file);
              let content = require(file);
              if(content.icon == "" || content.icon == null || content.icon == undefined || !fs.existsSync(content.icon.replace("sdmc:", path.join(ulaunchtester, "sdmc"))) || content.type !== 2) return "";
              left += getWidth(276);
              n += 1;
              return `<img width="${getWidth(256)}" height="${getHeight(256)}" style="position: absolute;top: ${top}; left: ${left}" src="${content.icon.replace("sdmc:", path.join(ulaunchtester, "sdmc"))}" alt="homebrew/${content.name}/${content.author}/${content.version}/${filename}"/><input style="width:${getWidth(256)};height:${getHeight(256)};position: absolute;top: ${top}; left: ${left};z-index: 1;outline: none;border: none;background-color: transparent;pointer-events:auto;" type="button" id="${n}" alt="homebrew/${content.name}/${content.author}/${content.version}/${filename}"/>`;
            }
          });
          items = items.concat(hbi);
          items.push(`<img width="${getWidth(size.suspended.w)}" height="${getHeight(size.suspended.h)}" style="position: absolute;top: ${suspendedd}; left: ${getWidth(98)-(getWidth(size.suspended.w)-getWidth(256))/2};pointer-events:none;display:none;" src="${defaulticon.suspended}" id="suspended"/>`)
          items.push(`<div id="multiselect" style="position:absolute;top:${getHeight(multiselectt)};left:0;width:${getWidth(1280)};height:${height-multiselectt*2};background-color: transparent;pointer-events:none;"></div>`)
          items.push(`<img width="${getWidth(size.cursor.w)}" height="${getHeight(size.cursor.h)}" style="position: absolute;top: ${cursor}; left: ${getWidth(98)-(getWidth(size.cursor.w)-getWidth(256))/2}" src="${defaulticon.cursor}" id="cursor" alt="0"/>`)
          items.push(`<input type="button" style="position: absolute;border:none;outline:none;background-color:transparent;top:0;width:1;height:1;left:${left+getWidth(256)+getWidth(86)}"/>`)
          items = items.join("");
          document.getElementById("items").innerHTML = items;
          if(suspended !== undefined){
            try {
              let item = $(`input[alt="${suspended}"]`).get(0).getAttribute("style");
              let l = item.split("left:")[1].split(";")[0];
              document.getElementById("suspended").setAttribute("style", `position: absolute;top: ${suspendedd}; left: ${getWidth(l-(size.suspended.w-256)/2)};pointer-events:none;display:none;`);
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
              div.append(`<img width="${getWidth(size.multiselect.w)}" height="${getHeight(size.multiselect.h)}" style="position: absolute;top: 0; left: ${parseInt($("#cursor").get(0).getAttribute("style").split("left:")[1].split(";")[0])+(getWidth(size.cursor.w)-getWidth(256))/2-(getWidth(size.multiselect.w)-getWidth(256))/2}" src="${defaulticon.multiselect}" id="${selected}"/>`);
              inputs.click((e) => {
                click(e.currentTarget.id);
              });
              switchem.on("y", () => {
                select(selected);
              });
              function select(id){
                if(res || !multiselect[mid]) return;
                let leftmultiselect = getWidth(98)+getWidth(276)*parseInt(id)-(getWidth(size.multiselect.w)-getWidth(256))/2;
                if($(`#multiselect #${id}`).get(0) === undefined){
                  div.append(`<img width="${getWidth(size.multiselect.w)}" height="${getHeight(size.multiselect.h)}" style="position: absolute;top: 0; left: ${leftmultiselect}" src="${defaulticon.multiselect}" id="${id}"/>`)
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
                let cursor = getHeight(([size.cursor.h, size.multiselect.h, size.suspended.h].sort((a, b) => a > b)[0]-size.cursor.h)/2);
                let leftcursor = getWidth(98)+getWidth(276)*parseInt(id)-(getWidth(size.cursor.w)-getWidth(256))/2
                document.getElementById("cursor").setAttribute("alt", id);
                document.getElementById("cursor").setAttribute("style", `position: absolute;top: ${cursor}; left: ${leftcursor}`);
                selected = parseInt(id);
                document.getElementById("cursor").setAttribute("style", `position: absolute;top: 0; left: ${leftcursor}`);
                let alt = input.getAttribute("alt");
                if(alt.startsWith("game")){
                  let game = games.find(g => g.id === alt.split("/")[1]);
                  let name = game.name;
                  let author = game.author;
                  let version = game.version;
                  entryfiles.map(n => {
                    let json = require(n);
                    if(json.type !== 1) return;
                    if(json.application_id !== game.id) return;
                    if(json.name) name = json.name;
                    if(json.author) author = json.author;
                    if(json.version) version = json.version;
                  });
                  document.getElementById("in").innerHTML = name;
                  document.getElementById("ia").innerHTML = author;
                  document.getElementById("iv").innerHTML = version;
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
                if(selected*getWidth(276) > scroll){
                  if(selected*getWidth(276)-getWidth(276)*3 < scroll) return;
                  $(`#items`).animate({
                      scrollLeft: selected*getWidth(276)-getWidth(276)*3
                  }, 0);
                } else {
                  $(`#items`).animate({
                      scrollLeft: selected*getWidth(276)
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
                      $("#ulaunchscreen").append(`<div style="background-color: #3232327F;z-index:100;position:absolute;top:0;left:0;width:${getWidth(1280)};height:${getHeight(720)};" id="foldername"><div style="background-color: #e1e1e1;width:${getWidth(300)};height:${getHeight(100)};position:absolute;top:50%;left:50%;transform:translate(-50%, -50%)"><p style="font-family: 'OpenSans';font-size: ${getHeight(25)};margin:0px 0px;position:absolute;top: ${getHeight(10)};left:${getWidth(22.5)};" id="namep">Enter the folder name</p><input style="width:${getWidth(250)};height:${getHeight(30)};font-family: 'OpenSans';font-size: ${getHeight(20)};position:absolute;top:${getHeight(50)};left:${getWidth(25)}" type="text" id="name"/></div></div>`);
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
                          mainmenugh();
                          resolve();
                        }
                      });
                      $('#name').keyup(function(e){if(e.keyCode == 13){$(this).trigger("enterKey");}});
                    } else if(id == 1) {
                      resss = true;
                      let ressss = false;
                      $("#dialog").remove();
                      ShowNotification(lang["menu_move_select_folder"], uijson);
                      let cursor = getHeight(([size.cursor.h, size.multiselect.h, size.suspended.h].sort((a, b) => a > b)[0]-size.cursor.h)/2);
                      let leftcursor = getHeight(98-(size.cursor.w-256)/2);
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
                        let cursor = getHeight(([size.cursor.h, size.multiselect.h, size.suspended.h].sort((a, b) => a > b)[0]-size.cursor.h)/2);
                        let leftcursor = getWidth(98)+getWidth(276)*parseInt(id)-(getWidth(size.cursor.w)-getWidth(256))/2
                        selected = parseInt(id);
                        document.getElementById("cursor").setAttribute("alt", id);
                        document.getElementById("cursor").setAttribute("style", `position: absolute;top: ${cursor}; left: ${leftcursor}`);
                        let scroll = document.getElementById("items").scrollLeft;
                        if(selected*getWidth(276) > scroll){
                          if(selected*getWidth(276)-getWidth(276)*3 < scroll) return;
                          $(`#items`).animate({
                              scrollLeft: selected*getWidth(276)-getWidth(276)*3
                          }, 0);
                        } else {
                          $(`#items`).animate({
                              scrollLeft: selected*getWidth(276)
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
                        mainmenugh();
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
                      mainmenugh();
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
            let cursor = getHeight(([size.cursor.h, size.multiselect.h, size.suspended.h].sort((a, b) => a > b)[0]-size.cursor.h)/2);
            let leftcursor = getWidth(98)+getWidth(276)*parseInt(id)-(getWidth(size.cursor.w)-getWidth(256))/2
            selected = parseInt(id);
            document.getElementById("cursor").setAttribute("alt", id);
            document.getElementById("cursor").setAttribute("style", `position: absolute;top: ${cursor}; left: ${leftcursor}`);
            let alt = input.getAttribute("alt");
            if(alt.startsWith("game")){
              let game = games.find(g => g.id === alt.split("/")[1]);
              let name = game.name;
              let author = game.author;
              let version = game.version;
              entryfiles.map(n => {
                let json = require(n);
                if(json.type !== 1) return;
                if(json.application_id !== game.id) return;
                if(json.name) name = json.name;
                if(json.author) author = json.author;
                if(json.version) version = json.version;
              });
              document.getElementById("in").innerHTML = name;
              document.getElementById("ia").innerHTML = author;
              document.getElementById("iv").innerHTML = version;
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
            if(selected*getWidth(276) > scroll){
              if(selected*getWidth(276)-getWidth(276)*3 < scroll) return;
              $(`#items`).animate({
                  scrollLeft: selected*getWidth(276)-getWidth(276)*3
              }, 0);
            } else {
              $(`#items`).animate({
                  scrollLeft: selected*getWidth(276)
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
              $("#title").animate({width: getWidth(1280),height:getHeight(720),opacity:1}, 1000, () => {
                $("#title").remove();
                $("#ulaunchscreen").append(`<input type="button" style="background-color:#222;z-index:99;outline:none;border:none;position:absolute;top:0;left:0;width:${getWidth(1280)};height:${getHeight(720)}" id="title"/>`);
                setTimeout(() => {
                  $("#title").remove();
                  suspended = alt;
                  if(sound){
                    sound.play();
                    fadetimeout.resume();
                  };
                  $("#suspendedimg").append(`<input type="button" style="background-color:#222;outline:none;border:none;top:50%;left:50%;transform:translate(-50%, -50%);position:absolute;width:${getWidth(1280)};height:${getHeight(720)};" id="title"/>`);
                  $("#title").animate({width: getWidth(1008),height:getHeight(567),opacity:parseInt(uijson["suspended_final_alpha"])/255}, 1000, () => {
                    res = false;
                  });
                  let item = document.getElementById(iid).getAttribute("style");
                  let l = item.split("left:")[1].split(";")[0];
                  document.getElementById("suspended").setAttribute("style", `position: absolute;top: ${suspendedd}; left: ${getWidth(l-(size.suspended.w-256)/2)};pointer-events:none;display:none;`)
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
                      $("#ulaunchscreen").append(`<input type="button" style="background-color:#222;z-index:99;outline:none;border:none;position:absolute;top:0;left:0;width:${getWidth(1280)};height:${getHeight(720)}" id="title"/>`);
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
                      $("#ulaunchscreen").append(`<input type="button" style="background-color:#222;z-index:99;outline:none;border:none;position:absolute;top:0;left:0;width:${getWidth(1280)};height:${getHeight(720)}" id="title"/>`);
                      setTimeout(() => {
                        $("#title").remove();
                        suspended = alt;
                        if(sound){
                          sound.play();
                          fadetimeout.resume();
                        };
                        $("#suspendedimg").append(`<input type="button" style="background-color:#222;outline:none;border:none;top:50%;left:50%;transform:translate(-50%, -50%);position:absolute;width:${getWidth(1280)};height:${getHeight(720)};" id="title"/>`);
                        $("#title").animate({width: getWidth(1008),height:getHeight(567),opacity:parseInt(uijson["suspended_final_alpha"])/255}, 1000, () => {
                          res = false;
                        });
                        let item = document.getElementById(iid).getAttribute("style");
                        let l = item.split("left:")[1].split(";")[0];
                        document.getElementById("suspended").setAttribute("style", `position: absolute;top: ${suspendedd}; left: ${getWidth(l-(size.suspended.w-256)/2)};pointer-events:none;display:none;`)
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
                  $("#ulaunchscreen").append(`<input type="button" style="background-color:#222;z-index:99;outline:none;border:none;position:absolute;top:0;left:0;width:${getWidth(1280)};height:${getHeight(720)}" id="title"/>`);
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
                $("#ulaunchscreen").append(`<input type="button" style="background-color:#222;z-index:99;outline:none;border:none;position:absolute;top:0;left:0;width:${getWidth(1280)};height:${getHeight(720)}" id="title"/>`);
                setTimeout(() => {
                  $("#title").remove();
                  suspended = alt;
                  if(sound){
                    sound.play();
                    fadetimeout.resume();
                  };
                  $("#suspendedimg").append(`<input type="button" style="background-color:#222;outline:none;border:none;top:50%;left:50%;transform:translate(-50%, -50%);position:absolute;width:${getWidth(1280)};height:${getHeight(720)};" id="title"/>`);
                  $("#title").animate({width: getWidth(1008),height:getHeight(567),opacity:parseInt(uijson["suspended_final_alpha"])/255}, 1000, () => {
                    res = false;
                  });
                  let item = document.getElementById(iid).getAttribute("style");
                  let l = item.split("left:")[1].split(";")[0];
                  document.getElementById("suspended").setAttribute("style", `position: absolute;top: ${suspendedd}; left: ${getWidth(l-(size.suspended.w-256)/2)};pointer-events:none;display:none;`)
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
          let height = getHeight([size.cursor.h, size.multiselect.h, size.suspended.h].sort((a, b) => a > b)[0]);
          let top = (height-getHeight(256))/2;
          let left = getWidth(98);
          let n = -1;
          let menuitems;
          try{
            menuitems = require(path.join(ulaunchtester, "testersettings", "menuitems.json"));
          }catch(e){
            corrupted(path.join(ulaunchtester, "testersettings", "menuitems.json"));
          }
          let entryfiles = getFiles(path.join(ulaunchtester, "sdmc", "ulaunch", "entries"));
          let folders = menuitems.folders[fname];
          let items = games.filter((game) => {
            if(folders.includes(game.id)){
              folders = folders.filter(f => f !== game.id);
              return true
            }
          }).map((game) => {
            let name = game.name;
            let author = game.author;
            let version = game.version;
            let icon = path.join(__dirname, "ulaunch", "game", game.icon);
            entryfiles.map(n => {
              let json = require(n);
              if(json.type !== 1) return;
              if(json.application_id !== game.id) return;
              if(json.icon) icon = json.icon;
              if(json.name) name = json.name;
              if(json.author) author = json.author;
              if(json.version) version = json.version;
            });
            n += 1;
            if(n == 0){
              document.getElementById("in").innerHTML = name;
              document.getElementById("ia").innerHTML = author;
              document.getElementById("iv").innerHTML = version;
              document.getElementById("bi").setAttribute("style", document.getElementById("bi").getAttribute("style").replace("hidden", uijson["main_menu"]["banner_image"]["visible"]))
              document.getElementById("bf").setAttribute("style", document.getElementById("bf").getAttribute("style").replace("visible", "hidden"));
              document.getElementById("bh").setAttribute("style", document.getElementById("bh").getAttribute("style").replace("visible", "hidden"));
              left = getWidth(98);
              return `<img width="${getWidth(256)}" height="${getHeight(256)}" style="position: absolute;top: ${top}; left: ${left}" src="${icon}" alt="game/${game.id}"/><input style="width:${getWidth(256)};height:${getHeight(256)};position: absolute;top: ${top}; left: ${left};z-index: 1;outline: none;border: none;background-color: transparent;pointer-events:auto;" type="button" id="${n}" alt="game/${game.id}"/>`
            } else {
              left += getWidth(276);
              return `<img width="${getWidth(256)}" height="${getHeight(256)}" style="position: absolute;top: ${top}; left: ${left}" src="${icon}" alt="game/${game.id}"/><input style="width:${getWidth(256)};height:${getHeight(256)};position: absolute;top: ${top}; left: ${left};z-index: 1;outline: none;border: none;background-color: transparent;pointer-events:auto;" type="button" id="${n}" alt="game/${game.id}"/>`
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
                left = getWidth(98);
              } else {
                left += getWidth(276);
              }
              return `<img width="${getWidth(256)}" height="${getHeight(256)}" style="position: absolute;top: ${top}; left: ${left}" src="${defaulticon.hbmenu}" alt="homebrew/${lang["hbmenu_launch"]}///hbmenu"/><input style="width:${getWidth(256)};height:${getHeight(256)};position: absolute;top: ${top}; left: ${left};z-index: 1;outline: none;border: none;background-color: transparent;pointer-events:auto;" type="button" id="${n}" alt="homebrew/${lang["hbmenu_launch"]}///hbmenu"/>`
            } else {
              let filename = file;
              file = path.join(ulaunchtester, "sdmc", "ulaunch", "entries", file);
              let content = require(file);
              if(content.icon == "" || content.icon == null || content.icon == undefined || !fs.existsSync(content.icon.replace("sdmc:", path.join(ulaunchtester, "sdmc"))) || content.type !== 2) return "";
              n += 1;
              if(n == 0){
                document.getElementById("in").innerHTML = content.name;
                document.getElementById("ia").innerHTML = content.author;
                document.getElementById("iv").innerHTML = content.version;
                document.getElementById("bi").setAttribute("style", document.getElementById("bi").getAttribute("style").replace("visible", "hidden"))
                document.getElementById("bf").setAttribute("style", document.getElementById("bf").getAttribute("style").replace("visible", "hidden"));
                document.getElementById("bh").setAttribute("style", document.getElementById("bh").getAttribute("style").replace("hidden", uijson["main_menu"]["banner_image"]["visible"]));
                left = getWidth(98);
              } else {
                left += getWidth(276);
              }
              return `<img width="${getWidth(256)}" height="${getHeight(256)}" style="position: absolute;top: ${top}; left: ${left}" src="${content.icon.replace("sdmc:", path.join(ulaunchtester, "sdmc"))}" alt="homebrew/${content.name}/${content.author}/${content.version}/${filename}"/><input style="width:${getWidth(256)};height:${getHeight(256)};position: absolute;top: ${top}; left: ${left};z-index: 1;outline: none;border: none;background-color: transparent;pointer-events:auto;" type="button" id="${n}" alt="homebrew/${content.name}/${content.author}/${content.version}/${filename}"/>`;
            }
          });
          items = items.concat(hb);
          let cursor = (height-getHeight(size.cursor.h))/2;
          let suspendedd = (height-getHeight(size.suspended.h))/2;
          let multiselectt = (height-getHeight(size.multiselect.h))/2;
          items.push(`<img width="${getWidth(size.suspended.w)}" height="${getWidth(size.suspended.h)}" style="position: absolute;top: ${suspendedd}; left: ${98-(size.suspended.w-256)/2};pointer-events:none;display:none;" src="${defaulticon.suspended}" id="suspended"/>`)
          items.push(`<img width="${getWidth(size.cursor.w)}" height="${getWidth(size.cursor.h)}" style="position: absolute;top: ${cursor}; left: ${getWidth(98-(size.cursor.w-256)/2)}" src="${defaulticon.cursor}" id="cursor" alt="0"/>`)
          items.push(`<div id="multiselect" style="position:absolute;top:0;left:0;width:100%;height:100%;background-color: transparent;pointer-events:none;"></div>`)
          items.push(`<input type="button" style="position: absolute;border:none;outline:none;background-color:transparent;top:0;width:1;height:1;left:${left+getWidth(256)+getWidth(86)}"/>`)
          items = items.join("");
          document.getElementById("items").innerHTML = items;
          if(suspended !== undefined){
            try {
              let item = $(`input[alt="${suspended}"]`).get(0).getAttribute("style");
              let l = item.split("left:")[1].split(";")[0];
              document.getElementById("suspended").setAttribute("style", `position: absolute;top: ${suspendedd}; left: ${getWidth(l-(size.suspended.w-256)/2)};pointer-events:none;display:none;`);
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
              div.append(`<img width="${getWidth(size.multiselect.w)}" height="${getHeight(size.multiselect.h)}" style="position: absolute;top: 0; left: ${parseInt($("#cursor").get(0).getAttribute("style").split("left:")[1].split(";")[0])+getWidth((size.cursor.w-256)/2)-getWidth((size.multiselect.w-256)/2)}" src="${defaulticon.multiselect}" id="${selected}"/>`);
              inputs.click((e) => {
                click(e.currentTarget.id);
              });
              switchem.on("y", () => {
                select(selected);
              });
              function select(id){
                if(res || !multiselect[mid]) return;
                let leftmultiselect = getWidth(98+276*parseInt(id)-(size.multiselect.w-256)/2);
                if($(`#multiselect #${id}`).get(0) === undefined){
                  div.append(`<img width="${getWidth(size.multiselect.w)}" height="${getHeight(size.multiselect.h)}" style="position: absolute;top: 0; left: ${leftmultiselect}" src="${defaulticon.multiselect}" id="${id}"/>`)
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
                let cursor = getHeight(([size.cursor.h, size.multiselect.h, size.suspended.h].sort((a, b) => a > b)[0]-size.cursor.h)/2);
                let leftcursor = getWidth(98)+getWidth(276)*parseInt(id)-(getWidth(size.cursor.w)-getWidth(256))/2
                document.getElementById("cursor").setAttribute("alt", id);
                document.getElementById("cursor").setAttribute("style", `position: absolute;top: ${cursor}; left: ${leftcursor}`);
                selected = parseInt(id);
                document.getElementById("cursor").setAttribute("style", `position: absolute;top: 0; left: ${leftcursor}`);
                let alt = input.getAttribute("alt");
                if(alt.startsWith("game")){
                  let game = games.find(g => g.id === alt.split("/")[1]);
                  let name = game.name;
                  let author = game.author;
                  let version = game.version;
                  entryfiles.map(n => {
                    let json = require(n);
                    if(json.type !== 1) return;
                    if(json.application_id !== game.id) return;
                    if(json.name) name = json.name;
                    if(json.author) author = json.author;
                    if(json.version) version = json.version;
                  });
                  document.getElementById("in").innerHTML = name;
                  document.getElementById("ia").innerHTML = author;
                  document.getElementById("iv").innerHTML = version;
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
                if(selected*getWidth(276) > scroll){
                  if(selected*getWidth(276)-getWidth(276)*3 < scroll) return;
                  $(`#items`).animate({
                      scrollLeft: selected*getWidth(276)-getWidth(276)*3
                  }, 0);
                } else {
                  $(`#items`).animate({
                      scrollLeft: selected*getWidth(276)
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
                      mainmenugh();
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
            mainmenugh();
          });
          inputs.dblclick((e) => {
            dblclick(e.currentTarget.id);
          });
          function click(id){
            if(ress || res) return;
            let input = document.getElementById(id);
            if(input === null) return;
            let cursor = getHeight(([size.cursor.h, size.multiselect.h, size.suspended.h].sort((a, b) => a > b)[0]-size.cursor.h)/2);
            let leftcursor = getWidth(98)+getWidth(276)*parseInt(id)-(getWidth(size.cursor.w)-getWidth(256))/2
            selected = parseInt(id);
            document.getElementById("cursor").setAttribute("alt", id);
            document.getElementById("cursor").setAttribute("style", `position: absolute;top: ${cursor}; left: ${leftcursor}`);
            let alt = input.getAttribute("alt");
            if(alt.startsWith("game")){
              let game = games.find(g => g.id === alt.split("/")[1]);
              let name = game.name;
              let author = game.author;
              let version = game.version;
              entryfiles.map(n => {
                let json = require(n);
                if(json.type !== 1) return;
                if(json.application_id !== game.id) return;
                if(json.name) name = json.name;
                if(json.author) author = json.author;
                if(json.version) version = json.version;
              });
              document.getElementById("in").innerHTML = name;
              document.getElementById("ia").innerHTML = author;
              document.getElementById("iv").innerHTML = version;
              document.getElementById("bi").setAttribute("style", document.getElementById("bi").getAttribute("style").replace("hidden", uijson["main_menu"]["banner_image"]["visible"]))
              document.getElementById("bf").setAttribute("style", document.getElementById("bf").getAttribute("style").replace("visible", "hidden"));
              document.getElementById("bh").setAttribute("style", document.getElementById("bh").getAttribute("style").replace("visible", "hidden"));
            } else if(alt.startsWith("folder")){
              alt = alt.split("/");
              document.getElementById("in").innerHTML = alt[1];
              document.getElementById("ia").innerHTML = alt[2];
              document.getElementById("iv").innerHTML = alt[3];
              document.getElementById("bi").setAttribute("style", document.getElementById("bi").getAttribute("style").replace("visible", "hidden"))
              document.getElementById("bf").setAttribute("style", document.getElementById("bf").getAttribute("style").replace("visible", "hidden"));
              document.getElementById("bh").setAttribute("style", document.getElementById("bh").getAttribute("style").replace("hidden", uijson["main_menu"]["banner_image"]["visible"]));
            }
            let scroll = document.getElementById("items").scrollLeft;
            if(selected*getWidth(276) > scroll){
              if(selected*getWidth(276)-getWidth(276)*3 < scroll) return;
              $(`#items`).animate({
                  scrollLeft: selected*getWidth(276)-getWidth(276)*3
              }, 0);
            } else {
              $(`#items`).animate({
                  scrollLeft: selected*getWidth(276)
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
              $("#title").animate({width: getWidth(1280),height:getHeight(720),opacity:1}, 1000, () => {
                $("#title").remove();
                $("#ulaunchscreen").append(`<input type="button" style="background-color:#222;z-index:99;outline:none;border:none;position:absolute;top:0;left:0;width:${getWidth(1280)};height:${getHeight(720)}" id="title"/>`);
                setTimeout(() => {
                  $("#title").remove();
                  suspended = alt;
                  if(sound){
                    sound.play();
                    fadetimeout.resume();
                  };
                  $("#suspendedimg").append(`<input type="button" style="background-color:#222;outline:none;border:none;top:50%;left:50%;transform:translate(-50%, -50%);position:absolute;width:${getWidth(1280)};height:${getHeight(720)};" id="title"/>`);
                  $("#title").animate({width: getWidth(1008),height:getHeight(567),opacity:parseInt(uijson["suspended_final_alpha"])/255}, 1000, () => {
                    res = false;
                  });
                  let item = document.getElementById(iid).getAttribute("style");
                  let l = item.split("left:")[1].split(";")[0];
                  document.getElementById("suspended").setAttribute("style", `position: absolute;top: ${suspendedd}; left: ${getWidth(l-(size.suspended.w-256)/2)};pointer-events:none;display:none;`)
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
                      $("#ulaunchscreen").append(`<input type="button" style="background-color:#222;z-index:99;outline:none;border:none;position:absolute;top:0;left:0;width:${getWidth(1280)};height:${getHeight(720)}" id="title"/>`);
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
                      $("#ulaunchscreen").append(`<input type="button" style="background-color:#222;z-index:99;outline:none;border:none;position:absolute;top:0;left:0;width:${getWidth(1280)};height:${getHeight(720)}" id="title"/>`);
                      setTimeout(() => {
                        $("#title").remove();
                        suspended = alt;
                        if(sound){
                          sound.play();
                          fadetimeout.resume();
                        };
                        $("#suspendedimg").append(`<input type="button" style="background-color:#222;outline:none;border:none;top:50%;left:50%;transform:translate(-50%, -50%);position:absolute;width:${getWidth(1280)};height:${getHeight(720)};" id="title"/>`);
                        $("#title").animate({width: getWidth(1008),height:getHeight(567),opacity:parseInt(uijson["suspended_final_alpha"])/255}, 1000, () => {
                          res = false;
                        });
                        let item = document.getElementById(iid).getAttribute("style");
                        let l = item.split("left:")[1].split(";")[0];
                        document.getElementById("suspended").setAttribute("style", `position: absolute;top: ${suspendedd}; left: ${getWidth(l-(size.suspended.w-256)/2)};pointer-events:none;display:none;`)
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
                  $("#ulaunchscreen").append(`<input type="button" style="background-color:#222;z-index:99;outline:none;border:none;position:absolute;top:0;left:0;width:${getWidth(1280)};height:${getHeight(720)}" id="title"/>`);
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
                $("#ulaunchscreen").append(`<input type="button" style="background-color:#222;z-index:99;outline:none;border:none;position:absolute;top:0;left:0;width:${getWidth(1280)};height:${getHeight(720)}" id="title"/>`);
                setTimeout(() => {
                  $("#title").remove();
                  suspended = alt;
                  if(sound){
                    sound.play();
                    fadetimeout.resume();
                  };
                  $("#suspendedimg").append(`<input type="button" style="background-color:#222;outline:none;border:none;top:50%;left:50%;transform:translate(-50%, -50%);position:absolute;width:${getWidth(1280)};height:${getHeight(720)};" id="title"/>`);
                  $("#title").animate({width: getWidth(1008),height:getHeight(567),opacity:parseInt(uijson["suspended_final_alpha"])/255}, 1000, () => {
                    res = false;
                  });
                  let item = document.getElementById(iid).getAttribute("style");
                  let l = item.split("left:")[1].split(";")[0];
                  document.getElementById("suspended").setAttribute("style", `position: absolute;top: ${suspendedd}; left: ${getWidth(l-(size.suspended.w-256)/2)};pointer-events:none;display:none;`)
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
          let height = getHeight([size.cursor.h, size.multiselect.h, size.suspended.h].sort((a, b) => a > b)[0]);
          let top = (height-getHeight(256))/2;
          let menuitems;
          try{
            menuitems = require(path.join(ulaunchtester, "testersettings", "menuitems.json"));
          }catch(e){
            corrupted(path.join(ulaunchtester, "testersettings", "menuitems.json"));
          }
          let menuhb = menuitems.hb;
          let jsonsfiles = getFiles(path.join(ulaunchtester, "sdmc", "ulaunch", "entries"));
          let left = getWidth(98);
          let n = 0;
          let items = [];
          items.push(`<img width="${getWidth(256)}" height="${getHeight(256)}" style="position: absolute;top: ${top}; left: ${left}" src="${defaulticon.hbmenu}" alt="homebrew/${lang["hbmenu_launch"]}///hbmenu"/><input style="width:${getWidth(256)};height:${getHeight(256)};position: absolute;top: ${top}; left: ${left};z-index: 1;outline: none;border: none;background-color: transparent;pointer-events:auto;" type="button" id="${n}" alt="homebrew/${lang["hbmenu_launch"]}///hbmenu"/>`)
          let cursor = (height-getHeight(size.cursor.h))/2;
          let suspendedd = (height-getHeight(size.suspended.h))/2;
          let multiselectt = (height-getHeight(size.multiselect.h))/2;
          let hbi = jsonsfiles.map(file => {
            if(!file.endsWith(".json")) return "";
            let content = require(file);
            if(content.icon == "" || content.icon == null || content.icon == undefined || !fs.existsSync(content.icon.replace("sdmc:", path.join(ulaunchtester, "sdmc"))) || content.type !== 2) return "";
            left += getWidth(276);
            n += 1;
            return `<img width="${getWidth(256)}" height="${getWidth(256)}" style="position: absolute;top: ${top}; left: ${left}" src="${content.icon.replace("sdmc:", path.join(ulaunchtester, "sdmc"))}" alt="homebrew/${content.name}/${content.author}/${content.version}/${path.basename(file)}"/><input style="width:${getWidth(256)};height:${getHeight(256)};position: absolute;top: ${top}; left: ${left};z-index: 1;outline: none;border: none;background-color: transparent;pointer-events:auto;" type="button" id="${n}" alt="homebrew/${content.name}/${content.author}/${content.version}/${path.basename(file)}"/>`;
          });
          items = items.concat(hbi);
          items.push(`<img width="${getWidth(size.suspended.w)}" height="${getHeight(size.suspended.h)}" style="position: absolute;top: ${suspendedd}; left: ${getWidth(98-(size.suspended.w-256)/2)};pointer-events:none;display:none;" src="${defaulticon.suspended}" id="suspended"/>`)
          items.push(`<img width="${getWidth(size.cursor.w)}" height="${getHeight(size.cursor.h)}" style="position: absolute;top: ${cursor}; left: ${getWidth(98-(size.cursor.w-256)/2)};pointer-events:none;" src="${defaulticon.cursor}" id="cursor" alt="0"/>`)
          items.push(`<div id="multiselect" style="position:absolute;top:0;left:0;width:100%;height:100%;background-color: transparent;pointer-events:none;"></div>`)
          items.push(`<input type="button" style="position: absolute;border:none;outline:none;background-color:transparent;top:0;width:1;height:1;left:${left+getWidth(256)+getWidth(86)}"/>`)
          items = items.join("");
          document.getElementById("items").innerHTML = items;
          if(suspended !== undefined){
            try {
              let item = $(`input[alt="${suspended}"]`).get(0).getAttribute("style");
              let l = item.split("left:")[1].split(";")[0];
              document.getElementById("suspended").setAttribute("style", `position: absolute;top: ${suspendedd}; left: ${getWidth(l-(size.suspended.w-256)/2)};pointer-events:none;display:none;`);
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
              div.append(`<img width="${getWidth(size.multiselect.w)}" height="${getHeight(size.multiselect.h)}" style="position: absolute;top: 0; left: ${parseInt($("#cursor").get(0).getAttribute("style").split("left:")[1].split(";")[0])+getWidth((size.cursor.w-256)/2)-getWidth((size.multiselect.w-256)/2)}" src="${defaulticon.multiselect}" id="${selected}"/>`);
              inputs.click((e) => {
                click(e.currentTarget.id);
              });
              switchem.on("y", () => {
                select(selected);
              });
              function select(id){
                if(res || !multiselect[mid]) return;
                let leftmultiselect = getWidth(98+276*parseInt(id)-(size.multiselect.w-256)/2);
                if($(`#multiselect #${id}`).get(0) === undefined){
                  div.append(`<img width="${getWidth(size.multiselect.w)}" height="${getHeight(size.multiselect.h)}" style="position: absolute;top: 0; left: ${leftmultiselect}" src="${defaulticon.multiselect}" id="${id}"/>`)
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
                let cursor = getHeight(([size.cursor.h, size.multiselect.h, size.suspended.h].sort((a, b) => a > b)[0]-size.cursor.h)/2);
                let leftcursor = getWidth(98)+getWidth(276)*parseInt(id)-(getWidth(size.cursor.w)-getWidth(256))/2
                document.getElementById("cursor").setAttribute("alt", id);
                document.getElementById("cursor").setAttribute("style", `position: absolute;top: ${cursor}; left: ${leftcursor}`);
                selected = parseInt(id);
                document.getElementById("cursor").setAttribute("style", `position: absolute;top: 0; left: ${leftcursor}`);
                let alt = input.getAttribute("alt");
                if(alt.startsWith("game")){
                  let game = games.find(g => g.id === alt.split("/")[1]);
                  let name = game.name;
                  let author = game.author;
                  let version = game.version;
                  entryfiles.map(n => {
                    let json = require(n);
                    if(json.type !== 1) return;
                    if(json.application_id !== game.id) return;
                    if(json.name) name = json.name;
                    if(json.author) author = json.author;
                    if(json.version) version = json.version;
                  });
                  document.getElementById("in").innerHTML = name;
                  document.getElementById("ia").innerHTML = author;
                  document.getElementById("iv").innerHTML = version;
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
                if(selected*getWidth(276) > scroll){
                  if(selected*getWidth(276)-getWidth(276)*3 < scroll) return;
                  $(`#items`).animate({
                      scrollLeft: selected*getWidth(276)-getWidth(276)*3
                  }, 0);
                } else {
                  $(`#items`).animate({
                      scrollLeft: selected*getWidth(276)
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
            let cursor = getHeight(([size.cursor.h, size.multiselect.h, size.suspended.h].sort((a, b) => a > b)[0]-size.cursor.h)/2);
            let leftcursor = getWidth(98)+getWidth(276)*parseInt(id)-(getWidth(size.cursor.w)-getWidth(256))/2
            selected = parseInt(id);
            document.getElementById("cursor").setAttribute("alt", id);
            document.getElementById("cursor").setAttribute("style", `position: absolute;top: ${cursor}; left: ${leftcursor}`);
            let alt = input.getAttribute("alt").split("/");
            document.getElementById("in").innerHTML = alt[1];
            document.getElementById("ia").innerHTML = alt[2];
            document.getElementById("iv").innerHTML = alt[3];
            let scroll = document.getElementById("items").scrollLeft;
            if(selected*getWidth(276) > scroll){
              if(selected*getWidth(276)-getWidth(276)*3 < scroll) return;
              $(`#items`).animate({
                  scrollLeft: selected*getWidth(276)-getWidth(276)*3
              }, 0);
            } else {
              $(`#items`).animate({
                  scrollLeft: selected*getWidth(276)
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
              $("#title").animate({width: getWidth(1280),height:getHeight(720),opacity:1}, 1000, () => {
                $("#title").remove();
                $("#ulaunchscreen").append(`<input type="button" style="background-color:#222;z-index:99;outline:none;border:none;position:absolute;top:0;left:0;width:${getWidth(1280)};height:${getHeight(720)}" id="title"/>`);
                setTimeout(() => {
                  $("#title").remove();
                  suspended = alt;
                  if(sound){
                    sound.play();
                    fadetimeout.resume();
                  };
                  $("#suspendedimg").append(`<input type="button" style="background-color:#222;outline:none;border:none;top:50%;left:50%;transform:translate(-50%, -50%);position:absolute;width:${getWidth(1280)};height:${getHeight(720)};" id="title"/>`);
                  $("#title").animate({width: getWidth(1008),height:getHeight(567),opacity:parseInt(uijson["suspended_final_alpha"])/255}, 1000, () => {
                    res = false;
                  });
                  let item = document.getElementById(iid).getAttribute("style");
                  let l = item.split("left:")[1].split(";")[0];
                  document.getElementById("suspended").setAttribute("style", `position: absolute;top: ${suspendedd}; left: ${getWidth(l-(size.suspended.w-256)/2)};pointer-events:none;display:none;`)
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
                    $("#ulaunchscreen").append(`<input type="button" style="background-color:#222;z-index:99;outline:none;border:none;position:absolute;top:0;left:0;width:${getWidth(1280)};height:${getHeight(720)}" id="title"/>`);
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
                    $("#ulaunchscreen").append(`<input type="button" style="background-color:#222;z-index:99;outline:none;border:none;position:absolute;top:0;left:0;width:${getWidth(1280)};height:${getHeight(720)}" id="title"/>`);
                    setTimeout(() => {
                      $("#title").remove();
                      suspended = alt;
                      if(sound){
                        sound.play();
                        fadetimeout.resume();
                      };
                      $("#suspendedimg").append(`<input type="button" style="background-color:#222;outline:none;border:none;top:50%;left:50%;transform:translate(-50%, -50%);position:absolute;width:${getWidth(1280)};height:${getHeight(720)};" id="title"/>`);
                      $("#title").animate({width: getWidth(1008),height:getHeight(567),opacity:parseInt(uijson["suspended_final_alpha"])/255}, 1000, () => {
                        res = false;
                      });
                      let item = document.getElementById(iid).getAttribute("style");
                      let l = item.split("left:")[1].split(";")[0];
                      document.getElementById("suspended").setAttribute("style", `position: absolute;top: ${suspendedd}; left: ${getWidth(l-(size.suspended.w-256)/2)};pointer-events:none;display:none;`)
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
                $("#ulaunchscreen").append(`<input type="button" style="background-color:#222;z-index:99;outline:none;border:none;position:absolute;top:0;left:0;width:${getWidth(1280)};height:${getHeight(720)}" id="title"/>`);
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
            mainmenugh();
          }
        });
      }
      mainmenugh();
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
          if(selected*getHeight(100)-getHeight(400) < scroll) return;
          $(`#themes`).animate({
              scrollTop: selected*getHeight(100)-getHeight(400)
          }, 0);
        } else {
          if(selected*getHeight(100) > scroll) return;
          $(`#themes`).animate({
              scrollTop: selected*getHeight(100)
          }, 0);
        }
      }
      async function dblclick(id){
        if(res) return;
        let input = document.getElementById(id);
        let tpath = input.getAttribute("alt");
        if(tpath === "default"){
          if(testersettings.currenttheme === "default" && tpath === "default"){
            return ShowNotification(lang["theme_no_custom"], uijson);
          } else {
            res = true;
            let ress = false;
            let dialog = await createDialog(lang["theme_reset"], lang["theme_reset_conf"], [lang["yes"], lang["cancel"]]);
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
              return dblclick(selected);
            });
            inputs.dblclick((e) => {
              return dblclick(e.currentTarget.id);
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
                testersettings.currenttheme = tpath;
                testersettings.isthemerestart = true;
                fs.writeFileSync(path.join(ulaunchtester, "testersettings", "ulaunch.json"), JSON.stringify(testersettings, null, 2), function(err){if(err) throw err;});
                getCurrentWindow().loadURL(url.format({
                  pathname: path.join(__dirname, 'app.ejs'),
                  protocol: 'file:',
                  slashes: true
                }));
              } else {
                return;
              }
            }
          }
        } else {
          if(testersettings.currenttheme === tpath){
            return ShowNotification(lang["theme_active_this"], uijson);
          } else {
            res = true;
            let ress = false;
            let dialog = await createDialog(lang["theme_set"], lang["theme_set_conf"], [lang["yes"], lang["cancel"]]);
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
              return dblclick(selected);
            });
            inputs.dblclick((e) => {
              return dblclick(e.currentTarget.id);
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
                testersettings.currenttheme = tpath;
                testersettings.isthemerestart = true;
                fs.writeFileSync(path.join(ulaunchtester, "testersettings", "ulaunch.json"), JSON.stringify(testersettings, null, 2), function(err){if(err) throw err;});
                getCurrentWindow().loadURL(url.format({
                  pathname: path.join(__dirname, 'app.ejs'),
                  protocol: 'file:',
                  slashes: true
                }));
              } else {
                return;
              }
            }
          }
        }
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
          if(selected*getHeight(100)-getHeight(300) < scroll) return;
          $(`#settings`).animate({
              scrollTop: selected*getHeight(100)-getHeight(300)
          }, 0);
        } else {
          if(selected*getHeight(100) > scroll) return;
          $(`#settings`).animate({
              scrollTop: selected*getHeight(100)
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
          $("#ulaunchscreen").append(`<div style="background-color: #3232327F;z-index:100;position:absolute;top:0;left:0;width:${getWidth(1280)};height:${getHeight(720)};" id="consolename"><div style="background-color: #e1e1e1;width:${getWidth(350)};height:${getHeight(100)};position:absolute;top:50%;left:50%;transform:translate(-50%, -50%)"><p style="font-family: 'OpenSans';font-size: ${getHeight(25)};margin:0px 0px;position:absolute;top: ${getHeight(10)};left:${getWidth(28)};" id="namep">Enter your console name</p><input style="width:${getWidth(300)};height:${getHeight(30)};font-family: 'OpenSans';font-size: ${getHeight(20)};position:absolute;top:50;left:25" type="text" id="name"/></div></div>`);
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
          if(selected*getHeight(100)-getHeight(300) < scroll) return;
          $(`#settings`).animate({
              scrollTop: selected*getHeight(100)-getHeight(300)
          }, 0);
        } else {
          if(selected*getHeight(100) > scroll) return;
          $(`#settings`).animate({
              scrollTop: selected*getHeight(100)
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
  let toastw = getWidth(wh[0]) + (getHeight(wh[1]) * 4);
  let toasth = getHeight(wh[1]) * 3;
  $("#switchcontainer").append(`<input type="button" id="notification" style="position: absolute;left: ${(getHeight(1280) - toastw) / 2};top: ${getHeight(550)};width: ${toastw};text-align: center;color: ${uijson["toast_text_color"]};z-index: 2;height: ${toasth};font-size: ${getHeight(20)};padding: ${getHeight(10)} ${getWidth(32.5)};border: none;border-radius: ${getHeight(32.5)}px;background-color: ${uijson["toast_base_color"]};opacity:0;" value="${text}"/>`);
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
    let Path = path.join(defaultui, name);
    if(path.extname(Path) !== ".json" && path.extname(Path) !== ".ttf"){
      Path = `data:image/png;base64,${fs.readFileSync(Path).toString("base64")}`;
    }
    return Path
  } else {
    let Path = path.join(romfsui, name);
    if(path.extname(Path) !== ".json" && path.extname(Path) !== ".ttf"){
      Path = `data:image/png;base64,${fs.readFileSync(Path).toString("base64")}`;
    }
    return Path
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
    uijson["main_menu"]["controller_icon"] = ApplyConfigForElement(uijson, "main_menu", "controller_icon");
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
  let html = `<div style="background-color: #3232327D;z-index:99;position:absolute;top:0;left:0;width:1280;height:720;" id="dialog">`;
  if(hasCancel) opts.push("Cancel");
  if(opts.length !== 0){
    let dw = (getWidth(20) * (opts.length - 1)) + getWidth(250);
    for(var i = 0; i < opts.length; i++){
        let tw = getWidth(getTextWH(18, opts[i])[0]);
        dw += tw + getWidth(20);
    }
    if(dw > getWidth(1280)) dw = getWidth(1280);
    let icm = 30;
    let elemh = getHeight(60);
    let tdw = getWidth(getTextWH(20, content)[0]) + getWidth(157.5);
    if(tdw > dw) dw = tdw;
    tdw = getWidth(getTextWH(30, title)[0]) + getWidth(157.5);
    if(tdw > dw) dw = tdw;
    let ely = getHeight(getTextWH(20, content)[1]) + getHeight(getTextWH(30, title)[1]) + getHeight(140);
    if(icon){
      await new Promise(function(resolve, reject) {
        let img = new Image();
        img.onload = () => {
          let tely = getHeight(img.height) + getHeight(icm) + getHeight(25);
          if(tely > ely) ely = tely;
          tdw = getWidth(getTextWH(20, content)[0]) + getWidth(90) + getWidth(img.width) + getWidth(20);
          if(tdw > dw) dw = tdw;
          tdw = getWidth(getTextWH(30, title)[0]) + getWidth(90) + getWidth(img.width) + getWidth(20);
          if(tdw > dw) dw = tdw;
          resolve();
        }
        img.src = icon;
      });
    }
    if(dw > getWidth(1280)) dw = getWidth(1280);
    let dh = ely + elemh + getHeight(30);
    if(dh > getHeight(720)) dh = getHeight(720);
    let dx = (getWidth(1280) - dw) / 2;
    let dy = (getHeight(720) - dh) / 2;
    ely += dy;
    let elemw = ((dw - (getWidth(20) * (opts.length + 1))) / opts.length);
    let elx = dx + ((dw - ((elemw * opts.length) + (getWidth(20) * (opts.length - 1)))) / 2);
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
          let icw = getWidth(img.width);
          let icx = (dw - (icw + getWidth(icm)));
          let icy = getHeight(icm);
          iconwidth = icw+(bw-(icx+icw))-getWidth(20);
          console.log(icw);
          html += `<img width="${icw}" height="${getHeight(img.height)}" style="position:absolute;top:${icy};left:${icx}" src="${icon}"/>`;
          resolve();
        }
        img.src = icon;
      });
    }
    html += `<div style="background-color:transparent;position:absolute;top:0;left:${getWidth(45)};width:${bw-getWidth(90)-iconwidth};height:${bh};"><p style="user-select:none;margin:0px 0px;padding: 0px;font-size:${getHeight(30)};font-family: 'Font';position:relative;top:${getHeight(55)};left:0"><span style="word-break: break-all;">${title}</span></p><p style="user-select:none;margin:0px 0px;padding: 0px;font-size:${getHeight(20)};font-family: 'Font';position:relative;top:${getHeight(110)};left:0"><span style="word-break: break-all;">${content}</span></p></div>`
    for(var i=0; i<opts.length; i++){
      let n = i;
      let txt = opts[n];
      let tw = getWidth(getTextWH(18, txt)[0]);
      let th = getHeight(getTextWH(18, txt)[1]);
      let tx = elx + ((elemw - tw) / 2) + ((elemw + getWidth(20)) * i);
      let ty = ely + ((elemh - th) / 2);
      let rx = elx + ((elemw + getWidth(20)) * i);
      let ry = ely;
      let rr = (elemh / 2);
      let dclr = `#${nr}${ng}${nb}${(n == 0) ? "FF" : "00"}`;
      html += `<input type="button" style="outline:none;border:none;background-color:${dclr};font-size:${getHeight(18)};font-family:'Font';border-radius:${rr}px;width:${elemw};height:${elemh};top:${bh-elemh-getHeight(30)};padding:0px 0px 0px 0px;position:relative;margin: 0px 0px 0px ${getWidth(20)}px;" value="${txt}" id="${n}"/>`
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
  if(!ispower || maker) return
  switchem.emit('minus');
}
function plus(){
  if(!ispower || maker) return
  switchem.emit('plus');
}
function ltopstart(){
  if(!ispower || maker) return
  switchem.emit('ltopstart');
}
function ltopstop(){
  if(!ispower || maker) return
  switchem.emit('ltopstop');
}
function ltopleftstart(){
  if(!ispower || maker) return
  switchem.emit('ltopleftstart');
}
function ltopleftstop(){
  if(!ispower || maker) return
  switchem.emit('ltopleftstop');
}
function lleftstart(){
  if(!ispower || maker) return
  switchem.emit('lleftstart');
}
function lleftstop(){
  if(!ispower || maker) return
  switchem.emit('lleftstop');
}
function lleftbottomstart(){
  if(!ispower || maker) return
  switchem.emit('lleftbottomstart');
}
function lleftbottomstop(){
  if(!ispower || maker) return
  switchem.emit('lleftbottomstop');
}
function lbottomstart(){
  if(!ispower || maker) return
  switchem.emit('lbottomstart');
}
function lbottomstop(){
  if(!ispower || maker) return
  switchem.emit('lbottomstop');
}
function lbottomrightstart(){
  if(!ispower || maker) return
  switchem.emit('lbottomrightstart');
}
function lbottomrightstop(){
  if(!ispower || maker) return
  switchem.emit('lbottomrightstop');
}
function lrightstart(){
  if(!ispower || maker) return
  switchem.emit('lrightstart');
}
function lrightstop(){
  if(!ispower || maker) return
  switchem.emit('lrightstop');
}
function lrighttopstart(){
  if(!ispower || maker) return
  switchem.emit('lrighttopstart');
}
function lrighttopstop(){
  if(!ispower || maker) return
  switchem.emit('lrighttopstop');
}
function arrowup(){
  if(!ispower || maker) return
  switchem.emit('arrowup');
}
function arrowdown(){
  if(!ispower || maker) return
  switchem.emit('arrowdown');
}
function arrowright(){
  if(!ispower || maker) return
  switchem.emit('arrowright');
}
function arrowleft(){
  if(!ispower || maker) return
  switchem.emit('arrowleft');
}
function capture(){
  if(!ispower || maker) return
  switchem.emit('capture');
}
function l(){
  if(!ispower || maker) return
  switchem.emit('l');
}
function rtopstart(){
  if(!ispower || maker) return
  switchem.emit('rtopstart');
}
function rtopstop(){
  if(!ispower || maker) return
  switchem.emit('rtopstop');
}
function rtopleftstart(){
  if(!ispower || maker) return
  switchem.emit('rtopleftstart');
}
function rtopleftstop(){
  if(!ispower || maker) return
  switchem.emit('rtopleftstop');
}
function rleftstart(){
  if(!ispower || maker) return
  switchem.emit('rleftstart');
}
function rleftstop(){
  if(!ispower || maker) return
  switchem.emit('rleftstop');
}
function rleftbottomstart(){
  if(!ispower || maker) return
  switchem.emit('rleftbottomstart');
}
function rleftbottomstop(){
  if(!ispower || maker) return
  switchem.emit('rleftbottomstop');
}
function rbottomstart(){
  if(!ispower || maker) return
  switchem.emit('rbottomstart');
}
function rbottomstop(){
  if(!ispower || maker) return
  switchem.emit('rbottomstop');
}
function rbottomrightstart(){
  if(!ispower || maker) return
  switchem.emit('rbottomrightstart');
}
function rbottomrightstop(){
  if(!ispower || maker) return
  switchem.emit('rbottomrightstop');
}
function rrightstart(){
  if(!ispower || maker) return
  switchem.emit('rrightstart');
}
function rrightstop(){
  if(!ispower || maker) return
  switchem.emit('rrightstop');
}
function rrighttopstart(){
  if(!ispower || maker) return
  switchem.emit('rrighttopstart');
}
function rrighttopstop(){
  if(!ispower || maker) return
  switchem.emit('rrighttopstop');
}
function a(){
  if(!ispower || maker) return
  switchem.emit('a');
}
function b(){
  if(!ispower || maker) return
  switchem.emit('b');
}
function x(){
  if(!ispower || maker) return
  switchem.emit('x');
}
function y(){
  if(!ispower || maker) return
  switchem.emit('y');
}
function home(){
  if(!ispower) return
  switchem.emit('home');
}
function r(){
  if(!ispower || maker) return
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

function corrupted(file){
  alert(`"${file.replace(/\\/g, "/")}" is in incorrect format or corrupted`);
  getCurrentWindow().close();
}

function makermenu(){
  document.getElementById("maker").innerHTML = ejs.render(fs.readFileSync(path.join(__dirname, "ulaunch", "maker", "app.ejs"), "utf8"));
  let themes = getFiles(path.join(documents, "uLaunch-Previewer", "sdmc", "ulaunch", "themes")).filter(n => n.indexOf("Manifest") !== -1);
  themes = themes.map(n => {
    return {
      path: path.join(ulaunchtester, "sdmc", "ulaunch", "themes", n.replace(/\\/g, "/").split("sdmc/ulaunch/themes/")[1].split("/")[0]),
      manifest: JSON.parse(fs.readFileSync(n, "utf8"))
    }
  });
  themes.map((theme, n) => {
    theme = theme.manifest
    $("#mthemes").append(`<input type="button" style="background-color: #828282;cursor: pointer;border: none;border-radius: ${getHeight(10)}px;color: #f5f6fa;outline: none;text-align:center;padding: ${getHeight(10)}px ${getWidth(10)}px;font-weight:bold;font-size: ${getWidth(20)};margin-left:${getWidth(5)};margin-bottom:${getHeight(5)}" id="${n}" value="${theme.name}"/>`);
  });
  $("#create").click(() => {
    istyping = true;
    $("#maker").append(`<div id="divcreate" style="background-color: #3232328F;z-index:99;position:absolute;top:0;left:0;width:${getWidth(1280)};height:${getHeight(720)};"><div style="background-color:#626262;border:none;border-radius:${getHeight(50)}px;position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:${getWidth(1180)};height:${getWidth(620)}" id="createtheme"><p style="position:absolute;top:${getHeight(40)};left:0;font-size:${getWidth(40)};margin:0 0;width:${getWidth(1180)};height:${getHeight(620)};text-align:center">Create New Theme</p><p style="position:absolute;top:${getHeight(120)};left:${getWidth(50)};font-size:${getWidth(30)};margin:0 0;">Name:</p><input type="text" style="position:absolute;left:${getWidth(150)};top:${getHeight(105)};font-family:'uLaunch';width:${getWidth(980)};padding:${getWidth(10)};padding-top:${getHeight(15)};height:${getHeight(60)};border-radius:${getHeight(15)}px;border:none;outline:none;font-size:${getWidth(25)};background-color:#828282;color:#e1e1e1" placeholder="Default theme" id="name"/><p style="position:absolute;top:${getHeight(210)};left:${getWidth(50)};font-size:${getWidth(30)};margin:0 0;">Format Version:</p><input type="text" style="position:absolute;left:${getWidth(275)};top:${getHeight(195)};font-family:'uLaunch';width:${getWidth(855)};padding:${getWidth(10)};padding-top:${getHeight(15)};height:${getHeight(60)};border-radius:${getHeight(15)}px;border:none;outline:none;font-size:${getWidth(25)};background-color:#828282;color:#e1e1e1" placeholder="1" id="formatver"/><p style="position:absolute;top:${getHeight(300)};left:${getWidth(50)};font-size:${getWidth(30)};margin:0 0;">Release:</p><input type="text" style="position:absolute;left:${getWidth(175)};top:${getHeight(285)};font-family:'uLaunch';width:${getWidth(955)};padding:${getWidth(10)};padding-top:${getHeight(15)};height:${getHeight(60)};border-radius:${getHeight(15)}px;border:none;outline:none;font-size:${getWidth(25)};background-color:#828282;color:#e1e1e1" placeholder="1.0" id="release"/><p style="position:absolute;top:${getHeight(390)};left:${getWidth(50)};font-size:${getWidth(30)};margin:0 0;">Description:</p><input type="text" style="position:absolute;left:${getWidth(225)};top:${getHeight(375)};font-family:'uLaunch';width:${getWidth(905)};padding:${getWidth(10)};padding-top:${getHeight(15)};height:${getHeight(60)};border-radius:${getHeight(15)}px;border:none;outline:none;font-size:${getWidth(25)};background-color:#828282;color:#e1e1e1" placeholder="Default uLaunch theme" id="description"/><p style="position:absolute;top:${getHeight(480)};left:${getWidth(50)};font-size:${getWidth(30)};margin:0 0;">Author:</p><input type="text" style="position:absolute;left:${getWidth(160)};top:${getHeight(465)};font-family:'uLaunch';width:${getWidth(970)};padding:${getWidth(10)};padding-top:${getHeight(15)};height:${getHeight(60)};border-radius:${getHeight(15)}px;border:none;outline:none;font-size:${getWidth(25)};background-color:#828282;color:#e1e1e1" placeholder="XorTroll" id="author"/><input type="button" style="width:${getWidth(530)};height:${getHeight(35)};border:none;outline:none;border-radius:${getHeight(10)}px;font-family:'uLaunch';font-size:${getWidth(20)};padding-top:${getHeight(7)};cursor:pointer;background-color:#828282;color:#f5f6fa;position:absolute;top:${getHeight(555)};left:${getWidth(50)}" id="createthemebtn" value="Create"/><input type="button" style="width:${getWidth(530)};height:${getHeight(35)};border:none;outline:none;border-radius:${getHeight(10)}px;font-family:'uLaunch';font-size:${getWidth(20)};padding-top:${getHeight(7)};cursor:pointer;background-color:#828282;color:#f5f6fa;position:absolute;top:${getHeight(555)};left:${getWidth(600)}" id="cancel" value="Cancel"/></div></div>`);
    $("#createthemebtn").click(() => {
      let name = $("#name").val();
      name = (!name) ? "Default theme" : name;
      let format_version = $("#formatver").val();
      format_version = (!format_version) ? 1 : (isNaN(format_version)) ? 1 : parseFloat(format_version);
      let release = $("#release").val();
      release = (!release) ? "1.0" : release;
      let description = $("#description").val();
      description = (!description) ? "Default uLaunch theme" : description;
      let author = $("#author").val();
      author = (!author) ? "XorTroll" : author;
      let Manifest = {name,format_version,release,description,author};
      fs.mkdirSync(path.join(ulaunchtester, "sdmc", "ulaunch", "themes", name));
      fs.mkdirSync(path.join(ulaunchtester, "sdmc", "ulaunch", "themes", name, "theme"));
      fs.writeFileSync(path.join(ulaunchtester, "sdmc", "ulaunch", "themes", name, "theme", "Manifest.json"), JSON.stringify(Manifest, null, 2), function(err){if(err) throw err});
      istyping = false;
      $("#divcreate").remove();
      makermenu();
    });
    $("#cancel").click(() => {
      $("#divcreate").remove();
    });
  });
  let inputs = $("#mthemes :input");
  inputs.click((input) => {
    let id = input.currentTarget.id;
    let theme = themes[id].manifest;
    let tfolder = themes[id].path;
    let defaultui = path.join(tfolder, "ui");
    if(!fs.existsSync(defaultui)){
      fs.mkdirSync(defaultui);
    }
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
    let size = {
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
    };
    document.getElementById("maker").innerHTML = ejs.render(fs.readFileSync(path.join(__dirname, "ulaunch", "maker", "theme.ejs"), "utf8"), {theme});
    $("#edit").click(() => {
      istyping = true;
      $("#maker").append(`<div id="divedit" style="background-color: #3232328F;z-index:200;position:absolute;top:0;left:0;width:${getWidth(1280)};height:${getHeight(720)};"><div style="background-color:#626262;border:none;border-radius:${getHeight(50)}px;position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:${getWidth(1180)};height:${getWidth(620)}" id="createtheme"><p style="position:absolute;top:${getHeight(40)};left:0;font-size:${getWidth(40)};margin:0 0;width:${getWidth(1180)};height:${getHeight(620)};text-align:center">Edit the Theme</p><p style="position:absolute;top:${getHeight(120)};left:${getWidth(50)};font-size:${getWidth(30)};margin:0 0;">Name:</p><input type="text" style="position:absolute;left:${getWidth(150)};top:${getHeight(105)};font-family:'uLaunch';width:${getWidth(980)};padding:${getWidth(10)};padding-top:${getHeight(15)};height:${getHeight(60)};border-radius:${getHeight(15)}px;border:none;outline:none;font-size:${getWidth(25)};background-color:#828282;color:#e1e1e1" placeholder="Default theme" value="${(theme.name == "Default theme") ? "" : theme.name}" id="name"/><p style="position:absolute;top:${getHeight(210)};left:${getWidth(50)};font-size:${getWidth(30)};margin:0 0;">Format Version:</p><input type="text" style="position:absolute;left:${getWidth(275)};top:${getHeight(195)};font-family:'uLaunch';width:${getWidth(855)};padding:${getWidth(10)};padding-top:${getHeight(15)};height:${getHeight(60)};border-radius:${getHeight(15)}px;border:none;outline:none;font-size:${getWidth(25)};background-color:#828282;color:#e1e1e1" placeholder="1" value="${(theme.format_version == 1) ? "" : theme.format_version}" id="formatver"/><p style="position:absolute;top:${getHeight(300)};left:${getWidth(50)};font-size:${getWidth(30)};margin:0 0;">Release:</p><input type="text" style="position:absolute;left:${getWidth(175)};top:${getHeight(285)};font-family:'uLaunch';width:${getWidth(955)};padding:${getWidth(10)};padding-top:${getHeight(15)};height:${getHeight(60)};border-radius:${getHeight(15)}px;border:none;outline:none;font-size:${getWidth(25)};background-color:#828282;color:#e1e1e1" value="${(theme.release == "1.0") ? "" : theme.release}" placeholder="1.0" id="release"/><p style="position:absolute;top:${getHeight(390)};left:${getWidth(50)};font-size:${getWidth(30)};margin:0 0;">Description:</p><input type="text" style="position:absolute;left:${getWidth(225)};top:${getHeight(375)};font-family:'uLaunch';width:${getWidth(905)};padding:${getWidth(10)};padding-top:${getHeight(15)};height:${getHeight(60)};border-radius:${getHeight(15)}px;border:none;outline:none;font-size:${getWidth(25)};background-color:#828282;color:#e1e1e1" placeholder="Default uLaunch theme" value="${(theme.description == "Default uLaunch theme") ? "" : theme.description}" id="description"/><p style="position:absolute;top:${getHeight(480)};left:${getWidth(50)};font-size:${getWidth(30)};margin:0 0;">Author:</p><input type="text" style="position:absolute;left:${getWidth(160)};top:${getHeight(465)};font-family:'uLaunch';width:${getWidth(970)};padding:${getWidth(10)};padding-top:${getHeight(15)};height:${getHeight(60)};border-radius:${getHeight(15)}px;border:none;outline:none;font-size:${getWidth(25)};background-color:#828282;color:#e1e1e1" placeholder="XorTroll" value="${(theme.author == "XorTroll") ? "" : theme.author}" id="author"/><input type="button" style="width:${getWidth(530)};height:${getHeight(35)};border:none;outline:none;border-radius:${getHeight(10)}px;font-family:'uLaunch';font-size:${getWidth(20)};padding-top:${getHeight(7)};cursor:pointer;background-color:#828282;color:#f5f6fa;position:absolute;top:${getHeight(555)};left:${getWidth(50)}" id="editthemebtn" value="Edit"/><input type="button" style="width:${getWidth(530)};height:${getHeight(35)};border:none;outline:none;border-radius:${getHeight(10)}px;font-family:'uLaunch';font-size:${getWidth(20)};padding-top:${getHeight(7)};cursor:pointer;background-color:#828282;color:#f5f6fa;position:absolute;top:${getHeight(555)};left:${getWidth(600)}" id="cancel" value="Cancel"/></div></div>`);
      $("#editthemebtn").click(() => {
        let name = $("#name").val();
        name = (!name) ? "Default theme" : name;
        let format_version = $("#formatver").val();
        format_version = (!format_version) ? 1 : (isNaN(format_version)) ? 1 : parseFloat(format_version);
        let release = $("#release").val();
        release = (!release) ? "1.0" : release;
        let description = $("#description").val();
        description = (!description) ? "Default uLaunch theme" : description;
        let author = $("#author").val();
        author = (!author) ? "XorTroll" : author;
        let Manifest = {name,format_version,release,description,author};
        document.getElementById("themename").innerHTML = name;
        if(!fs.existsSync(path.join(tfolder, "theme"))){
          fs.mkdirSync(path.join(tfolder, "theme"));
        }
        theme = Manifest;
        themes[id].manifest = Manifest;
        fs.writeFileSync(path.join(tfolder, "theme", "Manifest.json"), JSON.stringify(Manifest, null, 2), function(err){if(err) throw err});
        istyping = false;
        $("#divedit").remove();
      });
      $("#cancel").click(() => {
        $("#divedit").remove();
      });
    });
    $("#delete").click(() => {
      delete themes[id];
      function deleterec(Path) {
        if (fs.existsSync(Path)) {
          fs.readdirSync(Path).forEach((file, index) => {
            const curPath = path.join(Path, file);
            if (fs.lstatSync(curPath).isDirectory()) {
              deleterec(curPath);
            } else {
              fs.unlinkSync(curPath);
            }
          });
          fs.rmdirSync(Path);
        }
      };
      deleterec(tfolder);
      makermenu();
    });
    $("#return").click(() => {
      makermenu();
    });
    let inputs = $("#theme :input");
    inputs.click((input) => {
      let id = input.currentTarget.id;
      let val = input.currentTarget.value;
      if(id !== "bgm" && id !== "titlelaunch" && id !== "menutoggle"){
        if(id !== "font"){
          if(id !== "icon"){
            let uijson = InitializeUIJson(require(existsUI("UI.json", defaultui, romfsui)));
            if(id !== "ui"){
              let dx = 0;
              let dy = 0;
              $("#maker").append(ejs.render(fs.readFileSync(path.join(__dirname, "ulaunch", "maker", "ui.ejs"), "utf8"), {val,defaulticon,id,size,dx,dy}));
              let defxy = getxy(id, InitializeUIJson(require(existsUI("UI.json", romfsui, romfsui))));
              $("#default").get(0).innerHTML = `Default: Width: ${size[id].w} | Height: ${size[id].h}${defxy}`
              let image = $("#image").get(0);
              let aload = false;
              image.onload = () => {
                if(aload) return;
                aload = true;
                $("#elemm").append(`<center><div style="position:absolute;top:${getHeight(195)+image.clientHeight+getHeight(20)};left:${getWidth(-10)};width:${getWidth(1280)};overflow-y:normal;overflow-x:hidden" id="button"><input type="button" style="background-color: #828282;cursor: pointer;border: none;border-radius: ${getHeight(10)}px;color: #f5f6fa;outline: none;text-align:center;padding: ${getHeight(10)}px ${getWidth(10)}px;font-weight:bold;font-size: ${getWidth(20)};margin-bottom:${getHeight(5)}" id="select" value="Select an Image"/><input type="button" style="background-color: #828282;cursor: pointer;border: none;border-radius: ${getHeight(10)}px;color: #f5f6fa;outline: none;text-align:center;padding: ${getHeight(10)}px ${getWidth(10)}px;font-weight:bold;font-size: ${getWidth(20)};margin-left:${getWidth(10)};margin-bottom:${getHeight(5)}" id="restore" value="Restore Image"/>${(defxy == "") ? "" : `<input type="button" style="background-color: #828282;cursor: pointer;border: none;border-radius: ${getHeight(10)}px;color: #f5f6fa;outline: none;text-align:center;padding: ${getHeight(10)}px ${getWidth(10)}px;font-weight:bold;font-size: ${getWidth(20)};margin-left:${getWidth(10)};margin-bottom:${getHeight(5)}" id="position" value="Set the position"/>`}</div></center>`)
                $("#select").click(() => {
                  let file = dialog.showOpenDialogSync({filters:[{name:"*",extensions: ['png'] }],properties:['openFile']});
                  if(file == undefined) return;
                  file = file[0];
                  let blob = `data:image/png;base64,${fs.readFileSync(file).toString("base64")}`;
                  image.src = blob;
                  let img = new Image();
                  img.onload = () => {
                    $("#current").get(0).innerHTML = `Current: Width: ${img.width} | Height: ${img.height}${getxy(id, uijson)}`;
                    document.getElementById("button").style.top = getHeight(195)+$("#image").get(0).clientHeight+getHeight(20)
                  };
                  img.src = blob;
                  fs.writeFileSync(path.join(tfolder, "ui", `${val}.png`), fs.readFileSync(file), function(err){if(err) throw err});
                });
                $("#restore").click(() => {
                  if(fs.existsSync(path.join(tfolder, "ui", `${val}.png`))){
                    fs.unlinkSync(path.join(tfolder, "ui", `${val}.png`));
                    let blob = existsUI(`${val}.png`, romfsui, romfsui);
                    let img = new Image();
                    img.onload = () => {
                      $("#current").get(0).innerHTML = `Current: Width: ${img.width} | Height: ${img.height}${getxy(id, uijson)}`;
                      document.getElementById("button").style.top = getHeight(195)+$("#image").get(0).clientHeight+getHeight(20)
                    };
                    img.src = blob;
                    image.src = blob
                  }
                });
                $("#position").click(() => {
                  let end = false;
                  let visible = getv(id, uijson);
                  $("#maker").append(`<div id="pos" style="background-color: #424242;z-index:110;position:absolute;top:0;left:0;overflow:hidden;width:${getWidth(1280)};height:${getHeight(720)};"><input type="button" id="postext" style="background-color:#525252;z-index:115;color:#e1e1e1;font-family:'uLaunch';font-size: ${getWidth(20)};padding: ${getHeight(5)}px ${getWidth(10)}px 0px ${getWidth(10)}px;border: ${getHeight(2)}px #323232;border-bottom-left-radius:${getHeight(10)}px;border-bottom-right-radius:${getHeight(10)}px;position:absolute;top:0;left:50%;transform:translate(-50%)" value="${getxy(id, uijson).split(" | ").filter((v, n) => n !== 0).map(v => {if(v.indexOf("X") !== -1){return "X: "+getWidth(parseInt(v.split("X: ")[1]))}else{return "Y: "+getHeight(parseInt(v.split("Y: ")[1]))}}).join(" | ")}"/><img style="position:relative;top:${getHeight(parseFloat(getxy(id, uijson).split("Y: ")[1]))};left:${getWidth(parseFloat(getxy(id, uijson).split("X: ")[1].split(" ")[0]))};width:${getWidth(size[id].w)};height:${getHeight(size[id].h)}" src="${$("#image").get(0).src}" id="posimage"><input type="button" style="position:absolute;bottom:${getHeight(5)};z-index:101;right:${getWidth(5)};background-color: #828282;cursor: pointer;border: none;border-radius: ${getHeight(10)}px;color: #f5f6fa;z-index: 115;outline: none;text-align:center;padding: ${getHeight(10)}px ${getWidth(10)}px;font-weight:bold;font-size: ${getWidth(20)};" id="finish" value="Finish"/><input type="button" style="position:absolute;bottom:${getHeight(5)};z-index:101;left:${getWidth(5)};background-color: #828282;cursor: pointer;border: none;border-radius: ${getHeight(10)}px;color: #f5f6fa;z-index: 115;outline: none;text-align:center;padding: ${getHeight(10)}px ${getWidth(10)}px;font-weight:bold;font-size: ${getWidth(20)};" id="visible" value="Visible: ${visible}"/></div>`)
                  let posimage = document.getElementById("posimage");
                  let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
                  posimage.onmousedown = (e) => {
                    pos3 = e.clientX;
                    pos4 = e.clientY;
                    e.preventDefault();
                    document.onmouseup = () => {
                      document.onmouseup = null;
                      document.onmousemove = null;
                    };
                    document.onmousemove = (e) => {
                      e.preventDefault();
                      pos1 = pos3 - e.clientX;
                      pos2 = pos4 - e.clientY;
                      pos3 = e.clientX;
                      pos4 = e.clientY;
                      posimage.style.top = Math.round((posimage.offsetTop - pos2)) + "px";
                      posimage.style.left = Math.round((posimage.offsetLeft - pos1)) + "px";
                      $("#postext").get(0).setAttribute("value", `X: ${getOrigWidth(Math.round((posimage.offsetLeft - pos1)))} | Y: ${getOrigHeight(Math.round((posimage.offsetTop - pos2)))}`);
                    };
                  }
                  makerem.on("up", () => {
                    if(end) return;
                    let y = Math.round(posimage.style.top.replace("px", ""));
                    let x = Math.round(posimage.style.left.replace("px", ""));
                    posimage.style.top = (y-getHeight(1)) + "px";
                    $("#postext").get(0).setAttribute("value", `X: ${getOrigWidth(x)} | Y: ${getOrigHeight(y)-1}`);
                  });
                  makerem.on("down", () => {
                    if(end) return;
                    let y = Math.round(posimage.style.top.replace("px", ""));
                    let x = Math.round(posimage.style.left.replace("px", ""));
                    posimage.style.top = (y+getHeight(1)) + "px";
                    $("#postext").get(0).setAttribute("value", `X: ${getOrigWidth(x)} | Y: ${getOrigHeight(y)+1}`);
                  });
                  makerem.on("left", () => {
                    if(end) return;
                    let y = Math.round(posimage.style.top.replace("px", ""));
                    let x = Math.round(posimage.style.left.replace("px", ""));
                    posimage.style.left = (x-getWidth(1)) + "px";
                    $("#postext").get(0).setAttribute("value", `X: ${getOrigWidth(x)-1} | Y: ${getOrigHeight(y)}`);
                  });
                  makerem.on("right", () => {
                    if(end) return;
                    let y = Math.round(posimage.style.top.replace("px", ""));
                    let x = Math.round(posimage.style.left.replace("px", ""));
                    posimage.style.left = (x+getWidth(1)) + "px";
                    $("#postext").get(0).setAttribute("value", `X: ${getOrigWidth(x)+1} | Y: ${getOrigHeight(y)}`);
                  });
                  $("#visible").click(() => {
                    if(visible){
                      visible = false;
                      $("#visible").get(0).value = "Visible: false"
                    } else {
                      visible = true;
                      $("#visible").get(0).value = "Visible: true"
                    }
                  });
                  $("#finish").click(() => {
                    if(end) return;
                    end = true;
                    let json = {};
                    if(fs.existsSync(path.join(tfolder, "ui", "UI.json"))) json = JSON.parse(fs.readFileSync(path.join(tfolder, "ui", "UI.json"), "utf8"));
                    let x = getOrigWidth(Math.round(posimage.style.left.replace("px", "")));
                    let y = getOrigHeight(Math.round(posimage.style.top.replace("px", "")));
                    json = setxy(id, json, x, y, visible);
                    fs.writeFileSync(path.join(tfolder, "ui", "UI.json"), JSON.stringify(json, null, 2), (err)=>{if(err) throw err});
                    let text = $("#current").get(0).innerHTML.split(" | ");
                    text[2] = `X: ${x}`;
                    text[3] = `Y: ${y}`;
                    $("#current").get(0).innerHTML = text.join(" | ");
                    $("#pos").remove();
                  });
                });
              }
              let imagedef = $("#imagedef").get(0);
              imagedef.onload = () => {
                $("#current").get(0).innerHTML = `Current: Width: ${imagedef.width} | Height: ${imagedef.height}${getxy(id, uijson)}`;
                $(imagedef).remove();
              }
              $("#ereturn").click(() => {
                $("#elem").remove();
              });
            } else {
              $("#maker").append(`<center id="uitheme"><div style="position:absolute;top:${getHeight(193)};left:0;height:${getHeight(472)};width:${getWidth(1280)};z-index:100;background-color:rgb(66,66,66);overflow-y:normal;overflow-x:hidden"><p style="font-size:${getWidth(40)};width:${getWidth(1280)};margin:0 0;text-align:center;">UI</p><input type="button" style="background-color: #828282;cursor: pointer;border: none;border-radius: ${getHeight(10)}px;color: #f5f6fa;outline: none;text-align:center;padding: ${getHeight(10)}px ${getWidth(10)}px;font-weight:bold;font-size: ${getWidth(20)};margin-left:${getWidth(5)};margin-bottom:${getHeight(5)}" id="suspended_final_alpha" value="Suspended Final Alpha"/><input type="button" style="background-color: #828282;cursor: pointer;border: none;border-radius: ${getHeight(10)}px;color: #f5f6fa;outline: none;text-align:center;padding: ${getHeight(10)}px ${getWidth(10)}px;font-weight:bold;font-size: ${getWidth(20)};margin-left:${getWidth(5)};margin-bottom:${getHeight(5)}" id="menu_focus_color" value="Menu Focus Color"/><input type="button" style="background-color: #828282;cursor: pointer;border: none;border-radius: ${getHeight(10)}px;color: #f5f6fa;outline: none;text-align:center;padding: ${getHeight(10)}px ${getWidth(10)}px;font-weight:bold;font-size: ${getWidth(20)};margin-left:${getWidth(5)};margin-bottom:${getHeight(5)}" id="menu_bg_color" value="Menu Background Color"/><input type="button" style="background-color: #828282;cursor: pointer;border: none;border-radius: ${getHeight(10)}px;color: #f5f6fa;outline: none;text-align:center;padding: ${getHeight(10)}px ${getWidth(10)}px;font-weight:bold;font-size: ${getWidth(20)};margin-left:${getWidth(5)};margin-bottom:${getHeight(5)}" id="text_color" value="Text Color"/><input type="button" style="background-color: #828282;cursor: pointer;border: none;border-radius: ${getHeight(10)}px;color: #f5f6fa;outline: none;text-align:center;padding: ${getHeight(10)}px ${getWidth(10)}px;font-weight:bold;font-size: ${getWidth(20)};margin-left:${getWidth(5)};margin-bottom:${getHeight(5)}" id="toast_text_color" value="Toast Text Color"/><input type="button" style="background-color: #828282;cursor: pointer;border: none;border-radius: ${getHeight(10)}px;color: #f5f6fa;outline: none;text-align:center;padding: ${getHeight(10)}px ${getWidth(10)}px;font-weight:bold;font-size: ${getWidth(20)};margin-left:${getWidth(5)};margin-bottom:${getHeight(5)}" id="toast_base_color" value="Toast Base Color"/><input type="button" style="background-color: #828282;cursor: pointer;border: none;border-radius: ${getHeight(10)}px;color: #f5f6fa;outline: none;text-align:center;padding: ${getHeight(10)}px ${getWidth(10)}px;font-weight:bold;font-size: ${getWidth(20)};margin-left:${getWidth(5)};margin-bottom:${getHeight(5)}" id="menu_folder_text" value="Menu Folder Text Pos"/><input type="button" style="background-color: #828282;cursor: pointer;border: none;border-radius: ${getHeight(10)}px;color: #f5f6fa;outline: none;text-align:center;padding: ${getHeight(10)}px ${getWidth(10)}px;font-weight:bold;font-size: ${getWidth(20)};margin-left:${getWidth(5)};margin-bottom:${getHeight(5)}" id="menu_folder_text_size" value="Menu Folder Text Size"/><input type="button" style="background-color: #828282;cursor: pointer;border: none;border-radius: ${getHeight(10)}px;color: #f5f6fa;outline: none;text-align:center;padding: ${getHeight(10)}px ${getWidth(10)}px;font-weight:bold;font-size: ${getWidth(20)};margin-left:${getWidth(5)};margin-bottom:${getHeight(5)}" id="startup_menu_info_text" value="Startup Menu Info Text"/><input type="button" style="background-color: #828282;cursor: pointer;border: none;border-radius: ${getHeight(10)}px;color: #f5f6fa;outline: none;text-align:center;padding: ${getHeight(10)}px ${getWidth(10)}px;font-weight:bold;font-size: ${getWidth(20)};margin-left:${getWidth(5)};margin-bottom:${getHeight(5)}" id="startup_menu_users_menu_item" value="Startup Menu Users Menu Item"/><input type="button" style="background-color: #828282;cursor: pointer;border: none;border-radius: ${getHeight(10)}px;color: #f5f6fa;outline: none;text-align:center;padding: ${getHeight(10)}px ${getWidth(10)}px;font-weight:bold;font-size: ${getWidth(20)};margin-left:${getWidth(5)};margin-bottom:${getHeight(5)}" id="main_menu_logo_icon" value="Main Menu Logo Icon"/><input type="button" style="background-color: #828282;cursor: pointer;border: none;border-radius: ${getHeight(10)}px;color: #f5f6fa;outline: none;text-align:center;padding: ${getHeight(10)}px ${getWidth(10)}px;font-weight:bold;font-size: ${getWidth(20)};margin-left:${getWidth(5)};margin-bottom:${getHeight(5)}" id="main_menu_user_icon" value="Main Menu User Icon"/><input type="button" style="background-color: #828282;cursor: pointer;border: none;border-radius: ${getHeight(10)}px;color: #f5f6fa;outline: none;text-align:center;padding: ${getHeight(10)}px ${getWidth(10)}px;font-weight:bold;font-size: ${getWidth(20)};margin-left:${getWidth(5)};margin-bottom:${getHeight(5)}" id="main_menu_time_text" value="Main Menu Time Text"/><input type="button" style="background-color: #828282;cursor: pointer;border: none;border-radius: ${getHeight(10)}px;color: #f5f6fa;outline: none;text-align:center;padding: ${getHeight(10)}px ${getWidth(10)}px;font-weight:bold;font-size: ${getWidth(20)};margin-left:${getWidth(5)};margin-bottom:${getHeight(5)}" id="main_menu_battery_text" value="Main Menu Battery Text"/><input type="button" style="background-color: #828282;cursor: pointer;border: none;border-radius: ${getHeight(10)}px;color: #f5f6fa;outline: none;text-align:center;padding: ${getHeight(10)}px ${getWidth(10)}px;font-weight:bold;font-size: ${getWidth(20)};margin-left:${getWidth(5)};margin-bottom:${getHeight(5)}" id="main_menu_firmware_text" value="Main Menu Firmware Text"/><input type="button" style="background-color: #828282;cursor: pointer;border: none;border-radius: ${getHeight(10)}px;color: #f5f6fa;outline: none;text-align:center;padding: ${getHeight(10)}px ${getWidth(10)}px;font-weight:bold;font-size: ${getWidth(20)};margin-left:${getWidth(5)};margin-bottom:${getHeight(5)}" id="main_menu_banner_name_text" value="Main Menu Banner Name Text"/><input type="button" style="background-color: #828282;cursor: pointer;border: none;border-radius: ${getHeight(10)}px;color: #f5f6fa;outline: none;text-align:center;padding: ${getHeight(10)}px ${getWidth(10)}px;font-weight:bold;font-size: ${getWidth(20)};margin-left:${getWidth(5)};margin-bottom:${getHeight(5)}" id="main_menu_banner_author_text" value="Main Menu Banner Author Text"/><input type="button" style="background-color: #828282;cursor: pointer;border: none;border-radius: ${getHeight(10)}px;color: #f5f6fa;outline: none;text-align:center;padding: ${getHeight(10)}px ${getWidth(10)}px;font-weight:bold;font-size: ${getWidth(20)};margin-left:${getWidth(5)};margin-bottom:${getHeight(5)}" id="main_menu_banner_version_text" value="Main Menu Banner Version Text"/><input type="button" style="background-color: #828282;cursor: pointer;border: none;border-radius: ${getHeight(10)}px;color: #f5f6fa;outline: none;text-align:center;padding: ${getHeight(10)}px ${getWidth(10)}px;font-weight:bold;font-size: ${getWidth(20)};margin-left:${getWidth(5)};margin-bottom:${getHeight(5)}" id="main_menu_items_menu" value="Main Menu Items Menu"/><input type="button" style="background-color: #828282;cursor: pointer;border: none;border-radius: ${getHeight(10)}px;color: #f5f6fa;outline: none;text-align:center;padding: ${getHeight(10)}px ${getWidth(10)}px;font-weight:bold;font-size: ${getWidth(20)};margin-left:${getWidth(5)};margin-bottom:${getHeight(5)}" id="themes_menu_themes_menu_item" value="Themes Menu Themes Menu Items"/><input type="button" style="background-color: #828282;cursor: pointer;border: none;border-radius: ${getHeight(10)}px;color: #f5f6fa;outline: none;text-align:center;padding: ${getHeight(10)}px ${getWidth(10)}px;font-weight:bold;font-size: ${getWidth(20)};margin-left:${getWidth(5)};margin-bottom:${getHeight(5)}" id="themes_menu_current_theme_text" value="Themes Menu Current Theme Text"/><input type="button" style="background-color: #828282;cursor: pointer;border: none;border-radius: ${getHeight(10)}px;color: #f5f6fa;outline: none;text-align:center;padding: ${getHeight(10)}px ${getWidth(10)}px;font-weight:bold;font-size: ${getWidth(20)};margin-left:${getWidth(5)};margin-bottom:${getHeight(5)}" id="themes_menu_current_theme_name_text" value="Themes Menu Current Theme Name Text"/><input type="button" style="background-color: #828282;cursor: pointer;border: none;border-radius: ${getHeight(10)}px;color: #f5f6fa;outline: none;text-align:center;padding: ${getHeight(10)}px ${getWidth(10)}px;font-weight:bold;font-size: ${getWidth(20)};margin-left:${getWidth(5)};margin-bottom:${getHeight(5)}" id="themes_menu_current_theme_author_text" value="Themes Menu Current Theme Author Text"/><input type="button" style="background-color: #828282;cursor: pointer;border: none;border-radius: ${getHeight(10)}px;color: #f5f6fa;outline: none;text-align:center;padding: ${getHeight(10)}px ${getWidth(10)}px;font-weight:bold;font-size: ${getWidth(20)};margin-left:${getWidth(5)};margin-bottom:${getHeight(5)}" id="themes_menu_current_theme_version_text" value="Themes Menu Current Theme Version Text"/><input type="button" style="background-color: #828282;cursor: pointer;border: none;border-radius: ${getHeight(10)}px;color: #f5f6fa;outline: none;text-align:center;padding: ${getHeight(10)}px ${getWidth(10)}px;font-weight:bold;font-size: ${getWidth(20)};margin-left:${getWidth(5)};margin-bottom:${getHeight(5)}" id="themes_menu_current_theme_icon" value="Themes Menu Current Theme Icon"/><input type="button" style="background-color: #828282;cursor: pointer;border: none;border-radius: ${getHeight(10)}px;color: #f5f6fa;outline: none;text-align:center;padding: ${getHeight(10)}px ${getWidth(10)}px;font-weight:bold;font-size: ${getWidth(20)};margin-left:${getWidth(5)};margin-bottom:${getHeight(5)}" id="languages_menu_info_text" value="Languages Menu Info Text"/><input type="button" style="background-color: #828282;cursor: pointer;border: none;border-radius: ${getHeight(10)}px;color: #f5f6fa;outline: none;text-align:center;padding: ${getHeight(10)}px ${getWidth(10)}px;font-weight:bold;font-size: ${getWidth(20)};margin-left:${getWidth(5)};margin-bottom:${getHeight(5)}" id="languages_menu_languages_menu_item" value="Languages Menu Languages Menu Item"/><input type="button" style="background-color: #828282;cursor: pointer;border: none;border-radius: ${getHeight(10)}px;color: #f5f6fa;outline: none;text-align:center;padding: ${getHeight(10)}px ${getWidth(10)}px;font-weight:bold;font-size: ${getWidth(20)};margin-left:${getWidth(5)};margin-bottom:${getHeight(5)}" id="settings_menu_info_text" value="Settings Menu Info Text"/><input type="button" style="background-color: #828282;cursor: pointer;border: none;border-radius: ${getHeight(10)}px;color: #f5f6fa;outline: none;text-align:center;padding: ${getHeight(10)}px ${getWidth(10)}px;font-weight:bold;font-size: ${getWidth(20)};margin-left:${getWidth(5)};margin-bottom:${getHeight(5)}" id="settings_menu_settings_menu_item" value="Settings Menu Settings Menu Item"/><input type="button" style="background-color: #828282;cursor: pointer;border: none;border-radius: ${getHeight(10)}px;color: #f5f6fa;outline: none;text-align:center;padding: ${getHeight(10)}px ${getWidth(10)}px;font-weight:bold;font-size: ${getWidth(20)};margin-left:${getWidth(5)};margin-bottom:${getHeight(5)}" id="returnback" value="Return Back"/></div></center>`);
              $("#returnback").click(() => {
                $("#uitheme").remove();
              });
              let inputs = $("#uitheme :input");
              inputs.click((input) => {
                let id = input.currentTarget.id;
                let val = input.currentTarget.value;
                if(id == "returnback") return;
                if(id == "suspended_final_alpha"){
                  let end = false;
                  $("#maker").append(`<div id="divcreate" style="background-color: #3232328F;z-index:110;position:absolute;top:0;left:0;width:${getWidth(1280)};height:${getHeight(720)};"><input type="button" style="background-color: transparent;border:none;outline:none;width:${getWidth(1280)};height:${getHeight(720)};z-index:111;position:absolute;top:0;left:0" id="areturn"/><div style="background-color:#626262;z-index:112;border:none;border-radius:${getHeight(25)}px;position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:${getWidth(1180)};height:${getWidth(225)}" id="createtheme"><p style="position:absolute;top:${getHeight(40)};left:0;font-size:${getWidth(40)};margin:0 0;width:${getWidth(1180)};text-align:center">Suspended Final Alpha</p><input type="range" min="0" max="255" value="${uijson["suspended_final_alpha"]}" class="slider" oninput="makerem.emit('alpha', this.value);" id="alpha"><p style="position:absolute;top:${getHeight(155)};left:0;font-size:${getWidth(40)};margin:0 0;width:${getWidth(1180)};text-align:center;opacity:${uijson["suspended_final_alpha"]/255}" id="alphaval">${uijson["suspended_final_alpha"]}</p></div></div>`);
                  makerem.on("alpha", (val) => {
                    if(end) return;
                    let alphaval = $("#alphaval").get(0);
                    alphaval.innerHTML = val;
                    alphaval.style.opacity = parseInt(val)/255;
                    set(val);
                  });
                  makerem.on("left", () => {
                    if(end) return;
                    let alphaval = $("#alphaval").get(0);
                    let val = parseInt(alphaval.innerHTML)-1;
                    alphaval.innerHTML = val;
                    alphaval.style.opacity = parseInt(val)/255;
                    $("#alpha").val(val);
                    set(val);
                  });
                  makerem.on("right", () => {
                    if(end) return;
                    let alphaval = $("#alphaval").get(0);
                    let val = parseInt(alphaval.innerHTML)+1;
                    alphaval.innerHTML = val;
                    alphaval.style.opacity = parseInt(val)/255;
                    $("#alpha").val(val);
                    set(val);
                  });
                  function set(val){
                    let json = {};
                    if(fs.existsSync(path.join(tfolder, "ui", "UI.json"))) json = JSON.parse(fs.readFileSync(path.join(tfolder, "ui", "UI.json"), "utf8"));
                    json.suspended_final_alpha = parseInt(val);
                    fs.writeFileSync(path.join(tfolder, "ui", "UI.json"), JSON.stringify(json, null, 2), (err)=>{if(err) throw err});
                    uijson = InitializeUIJson(json);
                  }
                  $("#areturn").click(() => {
                    if(end) return;
                    end = true;
                    $("#divcreate").remove();
                  });
                } else if(id == "menu_focus_color"){
                  getcolorui("menu_focus_color", "Menu Focus Color");
                } else if(id == "menu_bg_color"){
                  getcolorui("menu_bg_color", "Menu Background Color");
                } else if(id == "text_color"){
                  getcolorui("text_color", "Text Color");
                } else if(id == "toast_text_color"){
                  getcolorui("toast_text_color", "Toast Text Color");
                } else if(id == "toast_base_color"){
                  getcolorui("toast_base_color", "Toast Base Color");
                } else if(id == "menu_folder_text"){
                  let end = false;
                  $("#maker").append(`<div id="pos" style="background-color: #424242;z-index:150;position:absolute;top:0;left:0;overflow:hidden;width:${getWidth(1280)};height:${getHeight(720)};"><input type="button" id="postext" style="background-color:#525252;z-index:115;color:#e1e1e1;font-family:'uLaunch';font-size: ${getWidth(20)};padding: ${getHeight(5)}px ${getWidth(10)}px 0px ${getWidth(10)}px;border: ${getHeight(2)}px #323232;border-bottom-left-radius:${getHeight(10)}px;border-bottom-right-radius:${getHeight(10)}px;position:absolute;top:0;left:50%;transform:translate(-50%)" value="X: ${uijson["menu_folder_text_x"]} | Y: ${uijson["menu_folder_text_y"]}"/><input type="button" style="position:absolute;top:0;left:0;width:${getWidth(256)};height:${getHeight(256)};outline:none;border:none;background-color:#727272;padding:0;"/><p style="position:relative;top:${getHeight(uijson["menu_folder_text_y"])};margin:0;padding:0;left:${getWidth(uijson["menu_folder_text_x"])};font-size: ${getWidth(uijson["menu_folder_text_size"])}" id="posimage">Folder</p><input type="button" style="position:absolute;bottom:${getHeight(5)};z-index:101;right:${getWidth(5)};background-color: #828282;cursor: pointer;border: none;border-radius: ${getHeight(10)}px;color: #f5f6fa;z-index: 115;outline: none;text-align:center;padding: ${getHeight(10)}px ${getWidth(10)}px;font-weight:bold;font-size: ${getWidth(20)};" id="finish" value="Finish"/></div>`)
                  let posimage = document.getElementById("posimage");
                  let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
                  posimage.onmousedown = (e) => {
                    pos3 = e.clientX;
                    pos4 = e.clientY;
                    e.preventDefault();
                    document.onmouseup = () => {
                      document.onmouseup = null;
                      document.onmousemove = null;
                    };
                    document.onmousemove = (e) => {
                      e.preventDefault();
                      pos1 = pos3 - e.clientX;
                      pos2 = pos4 - e.clientY;
                      pos3 = e.clientX;
                      pos4 = e.clientY;
                      posimage.style.top = Math.round((posimage.offsetTop - pos2)) + "px";
                      posimage.style.left = Math.round((posimage.offsetLeft - pos1)) + "px";
                      $("#postext").get(0).setAttribute("value", `X: ${getOrigWidth(Math.round((posimage.offsetLeft - pos1)))} | Y: ${getOrigHeight(Math.round((posimage.offsetTop - pos2)))}`);
                    };
                  }
                  makerem.on("up", () => {
                    if(end) return;
                    let y = Math.round(posimage.style.top.replace("px", ""));
                    let x = Math.round(posimage.style.left.replace("px", ""));
                    posimage.style.top = (y-getHeight(1)) + "px";
                    $("#postext").get(0).setAttribute("value", `X: ${getOrigWidth(x)} | Y: ${getOrigHeight(y)-1}`);
                  });
                  makerem.on("down", () => {
                    if(end) return;
                    let y = Math.round(posimage.style.top.replace("px", ""));
                    let x = Math.round(posimage.style.left.replace("px", ""));
                    posimage.style.top = (y+getHeight(1)) + "px";
                    $("#postext").get(0).setAttribute("value", `X: ${getOrigWidth(x)} | Y: ${getOrigHeight(y)+1}`);
                  });
                  makerem.on("left", () => {
                    if(end) return;
                    let y = Math.round(posimage.style.top.replace("px", ""));
                    let x = Math.round(posimage.style.left.replace("px", ""));
                    posimage.style.left = (x-getWidth(1)) + "px";
                    $("#postext").get(0).setAttribute("value", `X: ${getOrigWidth(x)-1} | Y: ${getOrigHeight(y)}`);
                  });
                  makerem.on("right", () => {
                    if(end) return;
                    let y = Math.round(posimage.style.top.replace("px", ""));
                    let x = Math.round(posimage.style.left.replace("px", ""));
                    posimage.style.left = (x+getWidth(1)) + "px";
                    $("#postext").get(0).setAttribute("value", `X: ${getOrigWidth(x)+1} | Y: ${getOrigHeight(y)}`);
                  });
                  $("#finish").click(() => {
                    if(end) return;
                    end = true;
                    let json = {};
                    if(fs.existsSync(path.join(tfolder, "ui", "UI.json"))) json = JSON.parse(fs.readFileSync(path.join(tfolder, "ui", "UI.json"), "utf8"));
                    let x = getOrigWidth(Math.round(posimage.style.left.replace("px", "")));
                    let y = getOrigHeight(Math.round(posimage.style.top.replace("px", "")));
                    json.menu_folder_text_x = x;
                    json.menu_folder_text_y = y;
                    fs.writeFileSync(path.join(tfolder, "ui", "UI.json"), JSON.stringify(json, null, 2), (err)=>{if(err) throw err});
                    uijson = InitializeUIJson(json);
                    $("#pos").remove();
                  });
                } else if(id == "menu_folder_text_size"){
                  let end = false;
                  let size = uijson["menu_folder_text_size"];
                  $("#maker").append(`<div id="divcreate" style="background-color: #3232328F;z-index:110;position:absolute;top:0;left:0;width:${getWidth(1280)};height:${getHeight(720)};"><input type="button" style="background-color: transparent;border:none;outline:none;width:${getWidth(1280)};height:${getHeight(720)};z-index:111;position:absolute;top:0;left:0" id="areturn"/><div style="background-color:#626262;z-index:112;border:none;border-radius:${getHeight(25)}px;position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:${getWidth(1180)};height:${getWidth(225)}" id="createtheme"><p style="position:absolute;top:${getHeight(40)};left:0;font-size:${getWidth(40)};margin:0 0;width:${getWidth(1180)};text-align:center">Menu Folder Text Size</p><p style="position:absolute;top:${getHeight(105)};left:0;font-size:${getWidth(40)};margin:0 0;width:${getWidth(1180)};text-align:center;" id="textsize">${uijson["menu_folder_text_size"]}</p><center><div style="position:absolute;top:${getHeight(160)};width:${getWidth(1180)}"><input type="button" style="width:${getWidth(30)};height:${getHeight(30)};color:#e1e1e1;background-color:#727272;border:none;border-radius:${getHeight(5)}px;font-family:'uLaunch';outline:none;font-size:15;text-align:center;cursor:pointer;" value="-1" id="msize"><input type="button" style="width:${getWidth(30)};height:${getHeight(30)};color:#e1e1e1;background-color:#727272;border:none;outline:none;border-radius:${getHeight(5)}px;font-family:'uLaunch';font-size:15;text-align:center;margin-left:${getWidth(10)}px;cursor:pointer;" value="+1" id="psize"></div></center></div></div>`);
                  $("#msize").click(() => {
                    if(end) return;
                    if(size == 1) return;
                    size -= 1;
                    $("#textsize").get(0).innerHTML = size;
                    set();
                  });
                  $("#psize").click(() => {
                    if(end) return;
                    size += 1;
                    $("#textsize").get(0).innerHTML = size;
                    set();
                  });
                  makerem.on("left", () => {
                    if(end) return;
                    if(size == 1) return;
                    size -= 1;
                    $("#textsize").get(0).innerHTML = size;
                    set();
                  });
                  makerem.on("right", () => {
                    if(end) return;
                    size += 1;
                    $("#textsize").get(0).innerHTML = size;
                    set();
                  });
                  function set(val){
                    let json = {};
                    if(fs.existsSync(path.join(tfolder, "ui", "UI.json"))) json = JSON.parse(fs.readFileSync(path.join(tfolder, "ui", "UI.json"), "utf8"));
                    json.menu_folder_text_size = size;
                    fs.writeFileSync(path.join(tfolder, "ui", "UI.json"), JSON.stringify(json, null, 2), (err)=>{if(err) throw err});
                    uijson = InitializeUIJson(json);
                  }
                  $("#areturn").click(() => {
                    if(end) return;
                    end = true;
                    $("#divcreate").remove();
                  });
                } else if(id == "startup_menu_info_text"){
                  let end = false;
                  let visible = uijson["startup_menu"]["info_text"]["visible"] == "visible";
                  $("#maker").append(`<div id="pos" style="background-color: #424242;z-index:150;position:absolute;top:0;left:0;overflow:hidden;width:${getWidth(1280)};height:${getHeight(720)};"><input type="button" id="postext" style="background-color:#525252;z-index:115;color:#e1e1e1;font-family:'uLaunch';font-size: ${getWidth(20)};padding: ${getHeight(5)}px ${getWidth(10)}px 0px ${getWidth(10)}px;border: ${getHeight(2)}px #323232;border-bottom-left-radius:${getHeight(10)}px;border-bottom-right-radius:${getHeight(10)}px;position:absolute;top:0;left:50%;transform:translate(-50%)" value="X: ${uijson["startup_menu"]["info_text"]["x"]} | Y: ${uijson["startup_menu"]["info_text"]["y"]}"/><p style="position:relative;top:${getHeight(uijson["startup_menu"]["info_text"]["y"])};margin:0;padding:0;left:${getWidth(uijson["startup_menu"]["info_text"]["x"])};font-size: ${getWidth(25)}" id="posimage">${lang["startup_welcome_info"]}<br>${lang["startup_control_info"]}</p><input type="button" style="position:absolute;bottom:${getHeight(5)};z-index:101;right:${getWidth(5)};background-color: #828282;cursor: pointer;border: none;border-radius: ${getHeight(10)}px;color: #f5f6fa;z-index: 115;outline: none;text-align:center;padding: ${getHeight(10)}px ${getWidth(10)}px;font-weight:bold;font-size: ${getWidth(20)};" id="finish" value="Finish"/><input type="button" style="position:absolute;bottom:${getHeight(5)};z-index:101;left:${getWidth(5)};background-color: #828282;cursor: pointer;border: none;border-radius: ${getHeight(10)}px;color: #f5f6fa;z-index: 115;outline: none;text-align:center;padding: ${getHeight(10)}px ${getWidth(10)}px;font-weight:bold;font-size: ${getWidth(20)};" id="visible" value="Visible: ${visible}"/></div>`)
                  let posimage = document.getElementById("posimage");
                  let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
                  posimage.onmousedown = (e) => {
                    pos3 = e.clientX;
                    pos4 = e.clientY;
                    e.preventDefault();
                    document.onmouseup = () => {
                      document.onmouseup = null;
                      document.onmousemove = null;
                    };
                    document.onmousemove = (e) => {
                      e.preventDefault();
                      pos1 = pos3 - e.clientX;
                      pos2 = pos4 - e.clientY;
                      pos3 = e.clientX;
                      pos4 = e.clientY;
                      posimage.style.top = Math.round((posimage.offsetTop - pos2)) + "px";
                      posimage.style.left = Math.round((posimage.offsetLeft - pos1)) + "px";
                      $("#postext").get(0).setAttribute("value", `X: ${getOrigWidth(Math.round((posimage.offsetLeft - pos1)))} | Y: ${getOrigHeight(Math.round((posimage.offsetTop - pos2)))}`);
                    };
                  }
                  makerem.on("up", () => {
                    if(end) return;
                    let y = Math.round(posimage.style.top.replace("px", ""));
                    let x = Math.round(posimage.style.left.replace("px", ""));
                    posimage.style.top = (y-getHeight(1)) + "px";
                    $("#postext").get(0).setAttribute("value", `X: ${getOrigWidth(x)} | Y: ${getOrigHeight(y)-1}`);
                  });
                  makerem.on("down", () => {
                    if(end) return;
                    let y = Math.round(posimage.style.top.replace("px", ""));
                    let x = Math.round(posimage.style.left.replace("px", ""));
                    posimage.style.top = (y+getHeight(1)) + "px";
                    $("#postext").get(0).setAttribute("value", `X: ${getOrigWidth(x)} | Y: ${getOrigHeight(y)+1}`);
                  });
                  makerem.on("left", () => {
                    if(end) return;
                    let y = Math.round(posimage.style.top.replace("px", ""));
                    let x = Math.round(posimage.style.left.replace("px", ""));
                    posimage.style.left = (x-getWidth(1)) + "px";
                    $("#postext").get(0).setAttribute("value", `X: ${getOrigWidth(x)-1} | Y: ${getOrigHeight(y)}`);
                  });
                  makerem.on("right", () => {
                    if(end) return;
                    let y = Math.round(posimage.style.top.replace("px", ""));
                    let x = Math.round(posimage.style.left.replace("px", ""));
                    posimage.style.left = (x+getWidth(1)) + "px";
                    $("#postext").get(0).setAttribute("value", `X: ${getOrigWidth(x)+1} | Y: ${getOrigHeight(y)}`);
                  });
                  $("#visible").click(() => {
                    if(visible){
                      visible = false;
                      $("#visible").get(0).value = "Visible: false"
                    } else {
                      visible = true;
                      $("#visible").get(0).value = "Visible: true"
                    }
                  });
                  $("#finish").click(() => {
                    if(end) return;
                    end = true;
                    let json = {};
                    if(fs.existsSync(path.join(tfolder, "ui", "UI.json"))) json = JSON.parse(fs.readFileSync(path.join(tfolder, "ui", "UI.json"), "utf8"));
                    let x = getOrigWidth(Math.round(posimage.style.left.replace("px", "")));
                    let y = getOrigHeight(Math.round(posimage.style.top.replace("px", "")));
                    if(json.startup_menu  == undefined) json.startup_menu = {};
                    if(json.startup_menu.info_text  == undefined) json.startup_menu.info_text = {};
                    json.startup_menu.info_text.x = x
                    json.startup_menu.info_text.y = y
                    json.startup_menu.info_text.visible = visible
                    fs.writeFileSync(path.join(tfolder, "ui", "UI.json"), JSON.stringify(json, null, 2), (err)=>{if(err) throw err});
                    uijson = InitializeUIJson(json);
                    $("#pos").remove();
                  });
                } else if(id == "startup_menu_users_menu_item"){
                  let end = false;
                  let visible = uijson["startup_menu"]["users_menu_item"]["visible"] == "visible";
                  $("#maker").append(`<div id="pos" style="background-color: #424242;z-index:150;position:absolute;top:0;left:0;overflow:hidden;width:${getWidth(1280)};height:${getHeight(720)};"><input type="button" id="postext" style="background-color:#525252;z-index:115;color:#e1e1e1;font-family:'uLaunch';font-size: ${getWidth(20)};padding: ${getHeight(5)}px ${getWidth(10)}px 0px ${getWidth(10)}px;border: ${getHeight(2)}px #323232;border-bottom-left-radius:${getHeight(10)}px;border-bottom-right-radius:${getHeight(10)}px;position:absolute;top:0;left:50%;transform:translate(-50%)" value="X: ${uijson["startup_menu"]["users_menu_item"]["x"]} | Y: ${uijson["startup_menu"]["users_menu_item"]["y"]}"/><div style="position: relative;top: ${getHeight(uijson["startup_menu"]["users_menu_item"]["y"])}; left: ${getWidth(uijson["startup_menu"]["users_menu_item"]["x"])};width: ${getWidth(880)};height:${getHeight(500)};overflow-x: hidden;overflow-y: auto;margin: 0px 0px;padding: 0px" type="button" id="posimage"><input type="button" style="position:absolute;top:0;left:0;z-index: 0;width: ${getWidth(880)};height:${getHeight(100)};outline:none;border: none;background-color:${uijson["menu_focus_color"]};"/><input type="button" style="position:absolute;top:${getHeight(100)};left:0;z-index: 0;width: ${getWidth(880)};height:${getHeight(100)};outline:none;border: none;background-color:${uijson["menu_bg_color"]};"/><input type="button" style="position:absolute;top:${getHeight(200)};left:0;z-index: 0;width: ${getWidth(880)};height:${getHeight(100)};outline:none;border: none;background-color:${uijson["menu_bg_color"]};"/><input type="button" style="position:absolute;top:${getHeight(300)};left:0;z-index: 0;width: ${getWidth(880)};height:${getHeight(100)};outline:none;border: none;background-color:${uijson["menu_bg_color"]};"/><input type="button" style="position:absolute;top:${getHeight(400)};left:0;z-index: 0;width: ${getWidth(880)};height:${getHeight(100)};outline:none;border: none;background-color:${uijson["menu_bg_color"]};"/></div><input type="button" style="position:absolute;bottom:${getHeight(5)};z-index:101;right:${getWidth(5)};background-color: #828282;cursor: pointer;border: none;border-radius: ${getHeight(10)}px;color: #f5f6fa;z-index: 115;outline: none;text-align:center;padding: ${getHeight(10)}px ${getWidth(10)}px;font-weight:bold;font-size: ${getWidth(20)};" id="finish" value="Finish"/><input type="button" style="position:absolute;bottom:${getHeight(5)};z-index:101;left:${getWidth(5)};background-color: #828282;cursor: pointer;border: none;border-radius: ${getHeight(10)}px;color: #f5f6fa;z-index: 115;outline: none;text-align:center;padding: ${getHeight(10)}px ${getWidth(10)}px;font-weight:bold;font-size: ${getWidth(20)};" id="visible" value="Visible: ${visible}"/></div>`)
                  let posimage = document.getElementById("posimage");
                  let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
                  posimage.onmousedown = (e) => {
                    pos3 = e.clientX;
                    pos4 = e.clientY;
                    e.preventDefault();
                    document.onmouseup = () => {
                      document.onmouseup = null;
                      document.onmousemove = null;
                    };
                    document.onmousemove = (e) => {
                      e.preventDefault();
                      pos1 = pos3 - e.clientX;
                      pos2 = pos4 - e.clientY;
                      pos3 = e.clientX;
                      pos4 = e.clientY;
                      posimage.style.top = Math.round((posimage.offsetTop - pos2)) + "px";
                      posimage.style.left = Math.round((posimage.offsetLeft - pos1)) + "px";
                      $("#postext").get(0).setAttribute("value", `X: ${getOrigWidth(Math.round((posimage.offsetLeft - pos1)))} | Y: ${getOrigHeight(Math.round((posimage.offsetTop - pos2)))}`);
                    };
                  }
                  makerem.on("up", () => {
                    if(end) return;
                    let y = Math.round(posimage.style.top.replace("px", ""));
                    let x = Math.round(posimage.style.left.replace("px", ""));
                    posimage.style.top = (y-getHeight(1)) + "px";
                    $("#postext").get(0).setAttribute("value", `X: ${getOrigWidth(x)} | Y: ${getOrigHeight(y)-1}`);
                  });
                  makerem.on("down", () => {
                    if(end) return;
                    let y = Math.round(posimage.style.top.replace("px", ""));
                    let x = Math.round(posimage.style.left.replace("px", ""));
                    posimage.style.top = (y+getHeight(1)) + "px";
                    $("#postext").get(0).setAttribute("value", `X: ${getOrigWidth(x)} | Y: ${getOrigHeight(y)+1}`);
                  });
                  makerem.on("left", () => {
                    if(end) return;
                    let y = Math.round(posimage.style.top.replace("px", ""));
                    let x = Math.round(posimage.style.left.replace("px", ""));
                    posimage.style.left = (x-getWidth(1)) + "px";
                    $("#postext").get(0).setAttribute("value", `X: ${getOrigWidth(x)-1} | Y: ${getOrigHeight(y)}`);
                  });
                  makerem.on("right", () => {
                    if(end) return;
                    let y = Math.round(posimage.style.top.replace("px", ""));
                    let x = Math.round(posimage.style.left.replace("px", ""));
                    posimage.style.left = (x+getWidth(1)) + "px";
                    $("#postext").get(0).setAttribute("value", `X: ${getOrigWidth(x)+1} | Y: ${getOrigHeight(y)}`);
                  });
                  $("#visible").click(() => {
                    if(visible){
                      visible = false;
                      $("#visible").get(0).value = "Visible: false"
                    } else {
                      visible = true;
                      $("#visible").get(0).value = "Visible: true"
                    }
                  });
                  $("#finish").click(() => {
                    if(end) return;
                    end = true;
                    let json = {};
                    if(fs.existsSync(path.join(tfolder, "ui", "UI.json"))) json = JSON.parse(fs.readFileSync(path.join(tfolder, "ui", "UI.json"), "utf8"));
                    let x = getOrigWidth(Math.round(posimage.style.left.replace("px", "")));
                    let y = getOrigHeight(Math.round(posimage.style.top.replace("px", "")));
                    if(json.startup_menu  == undefined) json.startup_menu = {};
                    if(json.startup_menu.users_menu_item  == undefined) json.startup_menu.users_menu_item = {};
                    json.startup_menu.users_menu_item.x = x
                    json.startup_menu.users_menu_item.y = y
                    json.startup_menu.users_menu_item.visible = visible
                    fs.writeFileSync(path.join(tfolder, "ui", "UI.json"), JSON.stringify(json, null, 2), (err)=>{if(err) throw err});
                    uijson = InitializeUIJson(json);
                    $("#pos").remove();
                  });
                } else if(id == "main_menu_logo_icon"){
                  let end = false;
                  $("#maker").append(`<div id="pos" style="background-color: #424242;z-index:150;position:absolute;top:0;left:0;overflow:hidden;width:${getWidth(1280)};height:${getHeight(720)};"><input type="button" id="postext" style="background-color:#525252;z-index:115;color:#e1e1e1;font-family:'uLaunch';font-size: ${getWidth(20)};padding: ${getHeight(5)}px ${getWidth(10)}px 0px ${getWidth(10)}px;border: ${getHeight(2)}px #323232;border-bottom-left-radius:${getHeight(10)}px;border-bottom-right-radius:${getHeight(10)}px;position:absolute;top:0;left:50%;transform:translate(-50%)" value="X: ${uijson["main_menu"]["logo_icon"]["x"]} | Y: ${uijson["main_menu"]["logo_icon"]["y"]}"/><img width="${getWidth(60)}" height="${getHeight(60)}" style="position: absolute;top: ${getHeight(uijson["main_menu"]["logo_icon"]["y"] )}; left: ${getWidth(uijson["main_menu"]["logo_icon"]["x"] )};" src="${path.join(__dirname, "ulaunch", "romFs", "Logo.png")}" id="posimage"><input type="button" style="position:absolute;bottom:${getHeight(5)};z-index:101;right:${getWidth(5)};background-color: #828282;cursor: pointer;border: none;border-radius: ${getHeight(10)}px;color: #f5f6fa;z-index: 115;outline: none;text-align:center;padding: ${getHeight(10)}px ${getWidth(10)}px;font-weight:bold;font-size: ${getWidth(20)};" id="finish" value="Finish"/></div>`)
                  let posimage = document.getElementById("posimage");
                  let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
                  posimage.onmousedown = (e) => {
                    pos3 = e.clientX;
                    pos4 = e.clientY;
                    e.preventDefault();
                    document.onmouseup = () => {
                      document.onmouseup = null;
                      document.onmousemove = null;
                    };
                    document.onmousemove = (e) => {
                      e.preventDefault();
                      pos1 = pos3 - e.clientX;
                      pos2 = pos4 - e.clientY;
                      pos3 = e.clientX;
                      pos4 = e.clientY;
                      posimage.style.top = Math.round((posimage.offsetTop - pos2)) + "px";
                      posimage.style.left = Math.round((posimage.offsetLeft - pos1)) + "px";
                      $("#postext").get(0).setAttribute("value", `X: ${getOrigWidth(Math.round((posimage.offsetLeft - pos1)))} | Y: ${getOrigHeight(Math.round((posimage.offsetTop - pos2)))}`);
                    };
                  }
                  makerem.on("up", () => {
                    if(end) return;
                    let y = Math.round(posimage.style.top.replace("px", ""));
                    let x = Math.round(posimage.style.left.replace("px", ""));
                    posimage.style.top = (y-getHeight(1)) + "px";
                    $("#postext").get(0).setAttribute("value", `X: ${getOrigWidth(x)} | Y: ${getOrigHeight(y)-1}`);
                  });
                  makerem.on("down", () => {
                    if(end) return;
                    let y = Math.round(posimage.style.top.replace("px", ""));
                    let x = Math.round(posimage.style.left.replace("px", ""));
                    posimage.style.top = (y+getHeight(1)) + "px";
                    $("#postext").get(0).setAttribute("value", `X: ${getOrigWidth(x)} | Y: ${getOrigHeight(y)+1}`);
                  });
                  makerem.on("left", () => {
                    if(end) return;
                    let y = Math.round(posimage.style.top.replace("px", ""));
                    let x = Math.round(posimage.style.left.replace("px", ""));
                    posimage.style.left = (x-getWidth(1)) + "px";
                    $("#postext").get(0).setAttribute("value", `X: ${getOrigWidth(x)-1} | Y: ${getOrigHeight(y)}`);
                  });
                  makerem.on("right", () => {
                    if(end) return;
                    let y = Math.round(posimage.style.top.replace("px", ""));
                    let x = Math.round(posimage.style.left.replace("px", ""));
                    posimage.style.left = (x+getWidth(1)) + "px";
                    $("#postext").get(0).setAttribute("value", `X: ${getOrigWidth(x)+1} | Y: ${getOrigHeight(y)}`);
                  });
                  $("#visible").click(() => {
                    if(visible){
                      visible = false;
                      $("#visible").get(0).value = "Visible: false"
                    } else {
                      visible = true;
                      $("#visible").get(0).value = "Visible: true"
                    }
                  });
                  $("#finish").click(() => {
                    if(end) return;
                    end = true;
                    let json = {};
                    if(fs.existsSync(path.join(tfolder, "ui", "UI.json"))) json = JSON.parse(fs.readFileSync(path.join(tfolder, "ui", "UI.json"), "utf8"));
                    let x = getOrigWidth(Math.round(posimage.style.left.replace("px", "")));
                    let y = getOrigHeight(Math.round(posimage.style.top.replace("px", "")));
                    if(json.main_menu  == undefined) json.main_menu = {};
                    if(json.main_menu.logo_icon  == undefined) json.main_menu.logo_icon = {};
                    json.main_menu.logo_icon.x = x
                    json.main_menu.logo_icon.y = y
                    fs.writeFileSync(path.join(tfolder, "ui", "UI.json"), JSON.stringify(json, null, 2), (err)=>{if(err) throw err});
                    uijson = InitializeUIJson(json);
                    $("#pos").remove();
                  });
                } else if(id == "main_menu_user_icon"){
                  let end = false;
                  let visible = uijson["main_menu"]["user_icon"]["visible"] == "visible";
                  $("#maker").append(`<div id="pos" style="background-color: #424242;z-index:150;position:absolute;top:0;left:0;overflow:hidden;width:${getWidth(1280)};height:${getHeight(720)};"><input type="button" id="postext" style="background-color:#525252;z-index:115;color:#e1e1e1;font-family:'uLaunch';font-size: ${getWidth(20)};padding: ${getHeight(5)}px ${getWidth(10)}px 0px ${getWidth(10)}px;border: ${getHeight(2)}px #323232;border-bottom-left-radius:${getHeight(10)}px;border-bottom-right-radius:${getHeight(10)}px;position:absolute;top:0;left:50%;transform:translate(-50%)" value="X: ${uijson["main_menu"]["user_icon"]["x"]} | Y: ${uijson["main_menu"]["user_icon"]["y"]}"/><img width="${getWidth(50)}" height="${getHeight(50)}" style="position: absolute;top: ${getHeight(uijson["main_menu"]["user_icon"]["y"] )}; left: ${getWidth(uijson["main_menu"]["user_icon"]["x"] )};" src="${path.join(__dirname, "ulaunch", "User.png")}" id="posimage"><input type="button" style="position:absolute;bottom:${getHeight(5)};z-index:101;right:${getWidth(5)};background-color: #828282;cursor: pointer;border: none;border-radius: ${getHeight(10)}px;color: #f5f6fa;z-index: 115;outline: none;text-align:center;padding: ${getHeight(10)}px ${getWidth(10)}px;font-weight:bold;font-size: ${getWidth(20)};" id="finish" value="Finish"/><input type="button" style="position:absolute;bottom:${getHeight(5)};z-index:101;left:${getWidth(5)};background-color: #828282;cursor: pointer;border: none;border-radius: ${getHeight(10)}px;color: #f5f6fa;z-index: 115;outline: none;text-align:center;padding: ${getHeight(10)}px ${getWidth(10)}px;font-weight:bold;font-size: ${getWidth(20)};" id="visible" value="Visible: ${visible}"/></div>`)
                  let posimage = document.getElementById("posimage");
                  let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
                  posimage.onmousedown = (e) => {
                    pos3 = e.clientX;
                    pos4 = e.clientY;
                    e.preventDefault();
                    document.onmouseup = () => {
                      document.onmouseup = null;
                      document.onmousemove = null;
                    };
                    document.onmousemove = (e) => {
                      e.preventDefault();
                      pos1 = pos3 - e.clientX;
                      pos2 = pos4 - e.clientY;
                      pos3 = e.clientX;
                      pos4 = e.clientY;
                      posimage.style.top = Math.round((posimage.offsetTop - pos2)) + "px";
                      posimage.style.left = Math.round((posimage.offsetLeft - pos1)) + "px";
                      $("#postext").get(0).setAttribute("value", `X: ${getOrigWidth(Math.round((posimage.offsetLeft - pos1)))} | Y: ${getOrigHeight(Math.round((posimage.offsetTop - pos2)))}`);
                    };
                  }
                  makerem.on("up", () => {
                    if(end) return;
                    let y = Math.round(posimage.style.top.replace("px", ""));
                    let x = Math.round(posimage.style.left.replace("px", ""));
                    posimage.style.top = (y-getHeight(1)) + "px";
                    $("#postext").get(0).setAttribute("value", `X: ${getOrigWidth(x)} | Y: ${getOrigHeight(y)-1}`);
                  });
                  makerem.on("down", () => {
                    if(end) return;
                    let y = Math.round(posimage.style.top.replace("px", ""));
                    let x = Math.round(posimage.style.left.replace("px", ""));
                    posimage.style.top = (y+getHeight(1)) + "px";
                    $("#postext").get(0).setAttribute("value", `X: ${getOrigWidth(x)} | Y: ${getOrigHeight(y)+1}`);
                  });
                  makerem.on("left", () => {
                    if(end) return;
                    let y = Math.round(posimage.style.top.replace("px", ""));
                    let x = Math.round(posimage.style.left.replace("px", ""));
                    posimage.style.left = (x-getWidth(1)) + "px";
                    $("#postext").get(0).setAttribute("value", `X: ${getOrigWidth(x)-1} | Y: ${getOrigHeight(y)}`);
                  });
                  makerem.on("right", () => {
                    if(end) return;
                    let y = Math.round(posimage.style.top.replace("px", ""));
                    let x = Math.round(posimage.style.left.replace("px", ""));
                    posimage.style.left = (x+getWidth(1)) + "px";
                    $("#postext").get(0).setAttribute("value", `X: ${getOrigWidth(x)+1} | Y: ${getOrigHeight(y)}`);
                  });
                  $("#visible").click(() => {
                    if(visible){
                      visible = false;
                      $("#visible").get(0).value = "Visible: false"
                    } else {
                      visible = true;
                      $("#visible").get(0).value = "Visible: true"
                    }
                  });
                  $("#finish").click(() => {
                    if(end) return;
                    end = true;
                    let json = {};
                    if(fs.existsSync(path.join(tfolder, "ui", "UI.json"))) json = JSON.parse(fs.readFileSync(path.join(tfolder, "ui", "UI.json"), "utf8"));
                    let x = getOrigWidth(Math.round(posimage.style.left.replace("px", "")));
                    let y = getOrigHeight(Math.round(posimage.style.top.replace("px", "")));
                    if(json.main_menu  == undefined) json.main_menu = {};
                    if(json.main_menu.user_icon  == undefined) json.main_menu.user_icon = {};
                    json.main_menu.user_icon.x = x
                    json.main_menu.user_icon.y = y
                    json.main_menu.user_icon.visible = visible
                    fs.writeFileSync(path.join(tfolder, "ui", "UI.json"), JSON.stringify(json, null, 2), (err)=>{if(err) throw err});
                    uijson = InitializeUIJson(json);
                    $("#pos").remove();
                  });
                } else if(id == "main_menu_time_text"){
                  let end = false;
                  let visible = uijson["main_menu"]["time_text"]["visible"] == "visible";
                  $("#maker").append(`<div id="pos" style="background-color: #424242;z-index:150;position:absolute;top:0;left:0;overflow:hidden;width:${getWidth(1280)};height:${getHeight(720)};"><input type="button" id="postext" style="background-color:#525252;z-index:115;color:#e1e1e1;font-family:'uLaunch';font-size: ${getWidth(20)};padding: ${getHeight(5)}px ${getWidth(10)}px 0px ${getWidth(10)}px;border: ${getHeight(2)}px #323232;border-bottom-left-radius:${getHeight(10)}px;border-bottom-right-radius:${getHeight(10)}px;position:absolute;top:0;left:50%;transform:translate(-50%)" value="X: ${uijson["main_menu"]["time_text"]["x"]} | Y: ${uijson["main_menu"]["time_text"]["y"]}"/><p style="position:relative;top:${getHeight(uijson["main_menu"]["time_text"]["y"])};margin:0;padding:0;left:${getWidth(uijson["main_menu"]["time_text"]["x"])};font-size: 1.5em" id="posimage">00:00</p><input type="button" style="position:absolute;bottom:${getHeight(5)};z-index:101;right:${getWidth(5)};background-color: #828282;cursor: pointer;border: none;border-radius: ${getHeight(10)}px;color: #f5f6fa;z-index: 115;outline: none;text-align:center;padding: ${getHeight(10)}px ${getWidth(10)}px;font-weight:bold;font-size: ${getWidth(20)};" id="finish" value="Finish"/><input type="button" style="position:absolute;bottom:${getHeight(5)};z-index:101;left:${getWidth(5)};background-color: #828282;cursor: pointer;border: none;border-radius: ${getHeight(10)}px;color: #f5f6fa;z-index: 115;outline: none;text-align:center;padding: ${getHeight(10)}px ${getWidth(10)}px;font-weight:bold;font-size: ${getWidth(20)};" id="visible" value="Visible: ${visible}"/></div>`)
                  let posimage = document.getElementById("posimage");
                  let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
                  posimage.onmousedown = (e) => {
                    pos3 = e.clientX;
                    pos4 = e.clientY;
                    e.preventDefault();
                    document.onmouseup = () => {
                      document.onmouseup = null;
                      document.onmousemove = null;
                    };
                    document.onmousemove = (e) => {
                      e.preventDefault();
                      pos1 = pos3 - e.clientX;
                      pos2 = pos4 - e.clientY;
                      pos3 = e.clientX;
                      pos4 = e.clientY;
                      posimage.style.top = Math.round((posimage.offsetTop - pos2)) + "px";
                      posimage.style.left = Math.round((posimage.offsetLeft - pos1)) + "px";
                      $("#postext").get(0).setAttribute("value", `X: ${getOrigWidth(Math.round((posimage.offsetLeft - pos1)))} | Y: ${getOrigHeight(Math.round((posimage.offsetTop - pos2)))}`);
                    };
                  }
                  makerem.on("up", () => {
                    if(end) return;
                    let y = Math.round(posimage.style.top.replace("px", ""));
                    let x = Math.round(posimage.style.left.replace("px", ""));
                    posimage.style.top = (y-getHeight(1)) + "px";
                    $("#postext").get(0).setAttribute("value", `X: ${getOrigWidth(x)} | Y: ${getOrigHeight(y)-1}`);
                  });
                  makerem.on("down", () => {
                    if(end) return;
                    let y = Math.round(posimage.style.top.replace("px", ""));
                    let x = Math.round(posimage.style.left.replace("px", ""));
                    posimage.style.top = (y+getHeight(1)) + "px";
                    $("#postext").get(0).setAttribute("value", `X: ${getOrigWidth(x)} | Y: ${getOrigHeight(y)+1}`);
                  });
                  makerem.on("left", () => {
                    if(end) return;
                    let y = Math.round(posimage.style.top.replace("px", ""));
                    let x = Math.round(posimage.style.left.replace("px", ""));
                    posimage.style.left = (x-getWidth(1)) + "px";
                    $("#postext").get(0).setAttribute("value", `X: ${getOrigWidth(x)-1} | Y: ${getOrigHeight(y)}`);
                  });
                  makerem.on("right", () => {
                    if(end) return;
                    let y = Math.round(posimage.style.top.replace("px", ""));
                    let x = Math.round(posimage.style.left.replace("px", ""));
                    posimage.style.left = (x+getWidth(1)) + "px";
                    $("#postext").get(0).setAttribute("value", `X: ${getOrigWidth(x)+1} | Y: ${getOrigHeight(y)}`);
                  });
                  $("#visible").click(() => {
                    if(visible){
                      visible = false;
                      $("#visible").get(0).value = "Visible: false"
                    } else {
                      visible = true;
                      $("#visible").get(0).value = "Visible: true"
                    }
                  });
                  $("#finish").click(() => {
                    if(end) return;
                    end = true;
                    let json = {};
                    if(fs.existsSync(path.join(tfolder, "ui", "UI.json"))) json = JSON.parse(fs.readFileSync(path.join(tfolder, "ui", "UI.json"), "utf8"));
                    let x = getOrigWidth(Math.round(posimage.style.left.replace("px", "")));
                    let y = getOrigHeight(Math.round(posimage.style.top.replace("px", "")));
                    if(json.main_menu  == undefined) json.main_menu = {};
                    if(json.main_menu.time_text  == undefined) json.main_menu.time_text = {};
                    json.main_menu.time_text.x = x
                    json.main_menu.time_text.y = y
                    json.main_menu.time_text.visible = visible
                    fs.writeFileSync(path.join(tfolder, "ui", "UI.json"), JSON.stringify(json, null, 2), (err)=>{if(err) throw err});
                    uijson = InitializeUIJson(json);
                    $("#pos").remove();
                  });
                } else if(id == "main_menu_battery_text"){
                  let end = false;
                  let visible = uijson["main_menu"]["battery_text"]["visible"] == "visible";
                  $("#maker").append(`<div id="pos" style="background-color: #424242;z-index:150;position:absolute;top:0;left:0;overflow:hidden;width:${getWidth(1280)};height:${getHeight(720)};"><input type="button" id="postext" style="background-color:#525252;z-index:115;color:#e1e1e1;font-family:'uLaunch';font-size: ${getWidth(20)};padding: ${getHeight(5)}px ${getWidth(10)}px 0px ${getWidth(10)}px;border: ${getHeight(2)}px #323232;border-bottom-left-radius:${getHeight(10)}px;border-bottom-right-radius:${getHeight(10)}px;position:absolute;top:0;left:50%;transform:translate(-50%)" value="X: ${uijson["main_menu"]["battery_text"]["x"]} | Y: ${uijson["main_menu"]["battery_text"]["y"]}"/><p style="position:relative;top:${getHeight(uijson["main_menu"]["battery_text"]["y"])};margin:0;padding:0;left:${getWidth(uijson["main_menu"]["battery_text"]["x"])};font-size: 1.5em" id="posimage">100%</p><input type="button" style="position:absolute;bottom:${getHeight(5)};z-index:101;right:${getWidth(5)};background-color: #828282;cursor: pointer;border: none;border-radius: ${getHeight(10)}px;color: #f5f6fa;z-index: 115;outline: none;text-align:center;padding: ${getHeight(10)}px ${getWidth(10)}px;font-weight:bold;font-size: ${getWidth(20)};" id="finish" value="Finish"/><input type="button" style="position:absolute;bottom:${getHeight(5)};z-index:101;left:${getWidth(5)};background-color: #828282;cursor: pointer;border: none;border-radius: ${getHeight(10)}px;color: #f5f6fa;z-index: 115;outline: none;text-align:center;padding: ${getHeight(10)}px ${getWidth(10)}px;font-weight:bold;font-size: ${getWidth(20)};" id="visible" value="Visible: ${visible}"/></div>`)
                  let posimage = document.getElementById("posimage");
                  let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
                  posimage.onmousedown = (e) => {
                    pos3 = e.clientX;
                    pos4 = e.clientY;
                    e.preventDefault();
                    document.onmouseup = () => {
                      document.onmouseup = null;
                      document.onmousemove = null;
                    };
                    document.onmousemove = (e) => {
                      e.preventDefault();
                      pos1 = pos3 - e.clientX;
                      pos2 = pos4 - e.clientY;
                      pos3 = e.clientX;
                      pos4 = e.clientY;
                      posimage.style.top = Math.round((posimage.offsetTop - pos2)) + "px";
                      posimage.style.left = Math.round((posimage.offsetLeft - pos1)) + "px";
                      $("#postext").get(0).setAttribute("value", `X: ${getOrigWidth(Math.round((posimage.offsetLeft - pos1)))} | Y: ${getOrigHeight(Math.round((posimage.offsetTop - pos2)))}`);
                    };
                  }
                  makerem.on("up", () => {
                    if(end) return;
                    let y = Math.round(posimage.style.top.replace("px", ""));
                    let x = Math.round(posimage.style.left.replace("px", ""));
                    posimage.style.top = (y-getHeight(1)) + "px";
                    $("#postext").get(0).setAttribute("value", `X: ${getOrigWidth(x)} | Y: ${getOrigHeight(y)-1}`);
                  });
                  makerem.on("down", () => {
                    if(end) return;
                    let y = Math.round(posimage.style.top.replace("px", ""));
                    let x = Math.round(posimage.style.left.replace("px", ""));
                    posimage.style.top = (y+getHeight(1)) + "px";
                    $("#postext").get(0).setAttribute("value", `X: ${getOrigWidth(x)} | Y: ${getOrigHeight(y)+1}`);
                  });
                  makerem.on("left", () => {
                    if(end) return;
                    let y = Math.round(posimage.style.top.replace("px", ""));
                    let x = Math.round(posimage.style.left.replace("px", ""));
                    posimage.style.left = (x-getWidth(1)) + "px";
                    $("#postext").get(0).setAttribute("value", `X: ${getOrigWidth(x)-1} | Y: ${getOrigHeight(y)}`);
                  });
                  makerem.on("right", () => {
                    if(end) return;
                    let y = Math.round(posimage.style.top.replace("px", ""));
                    let x = Math.round(posimage.style.left.replace("px", ""));
                    posimage.style.left = (x+getWidth(1)) + "px";
                    $("#postext").get(0).setAttribute("value", `X: ${getOrigWidth(x)+1} | Y: ${getOrigHeight(y)}`);
                  });
                  $("#visible").click(() => {
                    if(visible){
                      visible = false;
                      $("#visible").get(0).value = "Visible: false"
                    } else {
                      visible = true;
                      $("#visible").get(0).value = "Visible: true"
                    }
                  });
                  $("#finish").click(() => {
                    if(end) return;
                    end = true;
                    let json = {};
                    if(fs.existsSync(path.join(tfolder, "ui", "UI.json"))) json = JSON.parse(fs.readFileSync(path.join(tfolder, "ui", "UI.json"), "utf8"));
                    let x = getOrigWidth(Math.round(posimage.style.left.replace("px", "")));
                    let y = getOrigHeight(Math.round(posimage.style.top.replace("px", "")));
                    if(json.main_menu  == undefined) json.main_menu = {};
                    if(json.main_menu.battery_text  == undefined) json.main_menu.battery_text = {};
                    json.main_menu.battery_text.x = x
                    json.main_menu.battery_text.y = y
                    json.main_menu.battery_text.visible = visible
                    fs.writeFileSync(path.join(tfolder, "ui", "UI.json"), JSON.stringify(json, null, 2), (err)=>{if(err) throw err});
                    uijson = InitializeUIJson(json);
                    $("#pos").remove();
                  });
                } else if(id == "main_menu_firmware_text"){
                  let end = false;
                  let visible = uijson["main_menu"]["firmware_text"]["visible"] == "visible";
                  $("#maker").append(`<div id="pos" style="background-color: #424242;z-index:150;position:absolute;top:0;left:0;overflow:hidden;width:${getWidth(1280)};height:${getHeight(720)};"><input type="button" id="postext" style="background-color:#525252;z-index:115;color:#e1e1e1;font-family:'uLaunch';font-size: ${getWidth(20)};padding: ${getHeight(5)}px ${getWidth(10)}px 0px ${getWidth(10)}px;border: ${getHeight(2)}px #323232;border-bottom-left-radius:${getHeight(10)}px;border-bottom-right-radius:${getHeight(10)}px;position:absolute;top:0;left:50%;transform:translate(-50%)" value="X: ${uijson["main_menu"]["firmware_text"]["x"]} | Y: ${uijson["main_menu"]["firmware_text"]["y"]}"/><p style="position:relative;top:${getHeight(uijson["main_menu"]["firmware_text"]["y"])};margin:0;padding:0;left:${getWidth(uijson["main_menu"]["firmware_text"]["x"])};font-size: 1.5em" id="posimage">9.1.0</p><input type="button" style="position:absolute;bottom:${getHeight(5)};z-index:101;right:${getWidth(5)};background-color: #828282;cursor: pointer;border: none;border-radius: ${getHeight(10)}px;color: #f5f6fa;z-index: 115;outline: none;text-align:center;padding: ${getHeight(10)}px ${getWidth(10)}px;font-weight:bold;font-size: ${getWidth(20)};" id="finish" value="Finish"/><input type="button" style="position:absolute;bottom:${getHeight(5)};z-index:101;left:${getWidth(5)};background-color: #828282;cursor: pointer;border: none;border-radius: ${getHeight(10)}px;color: #f5f6fa;z-index: 115;outline: none;text-align:center;padding: ${getHeight(10)}px ${getWidth(10)}px;font-weight:bold;font-size: ${getWidth(20)};" id="visible" value="Visible: ${visible}"/></div>`)
                  let posimage = document.getElementById("posimage");
                  let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
                  posimage.onmousedown = (e) => {
                    pos3 = e.clientX;
                    pos4 = e.clientY;
                    e.preventDefault();
                    document.onmouseup = () => {
                      document.onmouseup = null;
                      document.onmousemove = null;
                    };
                    document.onmousemove = (e) => {
                      e.preventDefault();
                      pos1 = pos3 - e.clientX;
                      pos2 = pos4 - e.clientY;
                      pos3 = e.clientX;
                      pos4 = e.clientY;
                      posimage.style.top = Math.round((posimage.offsetTop - pos2)) + "px";
                      posimage.style.left = Math.round((posimage.offsetLeft - pos1)) + "px";
                      $("#postext").get(0).setAttribute("value", `X: ${getOrigWidth(Math.round((posimage.offsetLeft - pos1)))} | Y: ${getOrigHeight(Math.round((posimage.offsetTop - pos2)))}`);
                    };
                  }
                  makerem.on("up", () => {
                    if(end) return;
                    let y = Math.round(posimage.style.top.replace("px", ""));
                    let x = Math.round(posimage.style.left.replace("px", ""));
                    posimage.style.top = (y-getHeight(1)) + "px";
                    $("#postext").get(0).setAttribute("value", `X: ${getOrigWidth(x)} | Y: ${getOrigHeight(y)-1}`);
                  });
                  makerem.on("down", () => {
                    if(end) return;
                    let y = Math.round(posimage.style.top.replace("px", ""));
                    let x = Math.round(posimage.style.left.replace("px", ""));
                    posimage.style.top = (y+getHeight(1)) + "px";
                    $("#postext").get(0).setAttribute("value", `X: ${getOrigWidth(x)} | Y: ${getOrigHeight(y)+1}`);
                  });
                  makerem.on("left", () => {
                    if(end) return;
                    let y = Math.round(posimage.style.top.replace("px", ""));
                    let x = Math.round(posimage.style.left.replace("px", ""));
                    posimage.style.left = (x-getWidth(1)) + "px";
                    $("#postext").get(0).setAttribute("value", `X: ${getOrigWidth(x)-1} | Y: ${getOrigHeight(y)}`);
                  });
                  makerem.on("right", () => {
                    if(end) return;
                    let y = Math.round(posimage.style.top.replace("px", ""));
                    let x = Math.round(posimage.style.left.replace("px", ""));
                    posimage.style.left = (x+getWidth(1)) + "px";
                    $("#postext").get(0).setAttribute("value", `X: ${getOrigWidth(x)+1} | Y: ${getOrigHeight(y)}`);
                  });
                  $("#visible").click(() => {
                    if(visible){
                      visible = false;
                      $("#visible").get(0).value = "Visible: false"
                    } else {
                      visible = true;
                      $("#visible").get(0).value = "Visible: true"
                    }
                  });
                  $("#finish").click(() => {
                    if(end) return;
                    end = true;
                    let json = {};
                    if(fs.existsSync(path.join(tfolder, "ui", "UI.json"))) json = JSON.parse(fs.readFileSync(path.join(tfolder, "ui", "UI.json"), "utf8"));
                    let x = getOrigWidth(Math.round(posimage.style.left.replace("px", "")));
                    let y = getOrigHeight(Math.round(posimage.style.top.replace("px", "")));
                    if(json.main_menu  == undefined) json.main_menu = {};
                    if(json.main_menu.firmware_text  == undefined) json.main_menu.firmware_text = {};
                    json.main_menu.firmware_text.x = x
                    json.main_menu.firmware_text.y = y
                    json.main_menu.firmware_text.visible = visible
                    fs.writeFileSync(path.join(tfolder, "ui", "UI.json"), JSON.stringify(json, null, 2), (err)=>{if(err) throw err});
                    uijson = InitializeUIJson(json);
                    $("#pos").remove();
                  });
                } else if(id == "main_menu_banner_name_text"){
                  let end = false;
                  let visible = uijson["main_menu"]["banner_name_text"]["visible"] == "visible";
                  $("#maker").append(`<div id="pos" style="background-color: #424242;z-index:150;position:absolute;top:0;left:0;overflow:hidden;width:${getWidth(1280)};height:${getHeight(720)};"><input type="button" id="postext" style="background-color:#525252;z-index:115;color:#e1e1e1;font-family:'uLaunch';font-size: ${getWidth(20)};padding: ${getHeight(5)}px ${getWidth(10)}px 0px ${getWidth(10)}px;border: ${getHeight(2)}px #323232;border-bottom-left-radius:${getHeight(10)}px;border-bottom-right-radius:${getHeight(10)}px;position:absolute;top:0;left:50%;transform:translate(-50%)" value="X: ${uijson["main_menu"]["banner_name_text"]["x"]} | Y: ${uijson["main_menu"]["banner_name_text"]["y"]}"/><p style="position:relative;top:${getHeight(uijson["main_menu"]["banner_name_text"]["y"])};margin:0;padding:0;left:${getWidth(uijson["main_menu"]["banner_name_text"]["x"])};font-size: ${getWidth(30)}" id="posimage">Name</p><input type="button" style="position:absolute;bottom:${getHeight(5)};z-index:101;right:${getWidth(5)};background-color: #828282;cursor: pointer;border: none;border-radius: ${getHeight(10)}px;color: #f5f6fa;z-index: 115;outline: none;text-align:center;padding: ${getHeight(10)}px ${getWidth(10)}px;font-weight:bold;font-size: ${getWidth(20)};" id="finish" value="Finish"/><input type="button" style="position:absolute;bottom:${getHeight(5)};z-index:101;left:${getWidth(5)};background-color: #828282;cursor: pointer;border: none;border-radius: ${getHeight(10)}px;color: #f5f6fa;z-index: 115;outline: none;text-align:center;padding: ${getHeight(10)}px ${getWidth(10)}px;font-weight:bold;font-size: ${getWidth(20)};" id="visible" value="Visible: ${visible}"/></div>`)
                  let posimage = document.getElementById("posimage");
                  let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
                  posimage.onmousedown = (e) => {
                    pos3 = e.clientX;
                    pos4 = e.clientY;
                    e.preventDefault();
                    document.onmouseup = () => {
                      document.onmouseup = null;
                      document.onmousemove = null;
                    };
                    document.onmousemove = (e) => {
                      e.preventDefault();
                      pos1 = pos3 - e.clientX;
                      pos2 = pos4 - e.clientY;
                      pos3 = e.clientX;
                      pos4 = e.clientY;
                      posimage.style.top = Math.round((posimage.offsetTop - pos2)) + "px";
                      posimage.style.left = Math.round((posimage.offsetLeft - pos1)) + "px";
                      $("#postext").get(0).setAttribute("value", `X: ${getOrigWidth(Math.round((posimage.offsetLeft - pos1)))} | Y: ${getOrigHeight(Math.round((posimage.offsetTop - pos2)))}`);
                    };
                  }
                  makerem.on("up", () => {
                    if(end) return;
                    let y = Math.round(posimage.style.top.replace("px", ""));
                    let x = Math.round(posimage.style.left.replace("px", ""));
                    posimage.style.top = (y-getHeight(1)) + "px";
                    $("#postext").get(0).setAttribute("value", `X: ${getOrigWidth(x)} | Y: ${getOrigHeight(y)-1}`);
                  });
                  makerem.on("down", () => {
                    if(end) return;
                    let y = Math.round(posimage.style.top.replace("px", ""));
                    let x = Math.round(posimage.style.left.replace("px", ""));
                    posimage.style.top = (y+getHeight(1)) + "px";
                    $("#postext").get(0).setAttribute("value", `X: ${getOrigWidth(x)} | Y: ${getOrigHeight(y)+1}`);
                  });
                  makerem.on("left", () => {
                    if(end) return;
                    let y = Math.round(posimage.style.top.replace("px", ""));
                    let x = Math.round(posimage.style.left.replace("px", ""));
                    posimage.style.left = (x-getWidth(1)) + "px";
                    $("#postext").get(0).setAttribute("value", `X: ${getOrigWidth(x)-1} | Y: ${getOrigHeight(y)}`);
                  });
                  makerem.on("right", () => {
                    if(end) return;
                    let y = Math.round(posimage.style.top.replace("px", ""));
                    let x = Math.round(posimage.style.left.replace("px", ""));
                    posimage.style.left = (x+getWidth(1)) + "px";
                    $("#postext").get(0).setAttribute("value", `X: ${getOrigWidth(x)+1} | Y: ${getOrigHeight(y)}`);
                  });
                  $("#visible").click(() => {
                    if(visible){
                      visible = false;
                      $("#visible").get(0).value = "Visible: false"
                    } else {
                      visible = true;
                      $("#visible").get(0).value = "Visible: true"
                    }
                  });
                  $("#finish").click(() => {
                    if(end) return;
                    end = true;
                    let json = {};
                    if(fs.existsSync(path.join(tfolder, "ui", "UI.json"))) json = JSON.parse(fs.readFileSync(path.join(tfolder, "ui", "UI.json"), "utf8"));
                    let x = getOrigWidth(Math.round(posimage.style.left.replace("px", "")));
                    let y = getOrigHeight(Math.round(posimage.style.top.replace("px", "")));
                    if(json.main_menu  == undefined) json.main_menu = {};
                    if(json.main_menu.banner_name_text  == undefined) json.main_menu.banner_name_text = {};
                    json.main_menu.banner_name_text.x = x
                    json.main_menu.banner_name_text.y = y
                    json.main_menu.banner_name_text.visible = visible
                    fs.writeFileSync(path.join(tfolder, "ui", "UI.json"), JSON.stringify(json, null, 2), (err)=>{if(err) throw err});
                    uijson = InitializeUIJson(json);
                    $("#pos").remove();
                  });
                } else if(id == "main_menu_banner_author_text"){
                  let end = false;
                  let visible = uijson["main_menu"]["banner_author_text"]["visible"] == "visible";
                  $("#maker").append(`<div id="pos" style="background-color: #424242;z-index:150;position:absolute;top:0;left:0;overflow:hidden;width:${getWidth(1280)};height:${getHeight(720)};"><input type="button" id="postext" style="background-color:#525252;z-index:115;color:#e1e1e1;font-family:'uLaunch';font-size: ${getWidth(20)};padding: ${getHeight(5)}px ${getWidth(10)}px 0px ${getWidth(10)}px;border: ${getHeight(2)}px #323232;border-bottom-left-radius:${getHeight(10)}px;border-bottom-right-radius:${getHeight(10)}px;position:absolute;top:0;left:50%;transform:translate(-50%)" value="X: ${uijson["main_menu"]["banner_author_text"]["x"]} | Y: ${uijson["main_menu"]["banner_author_text"]["y"]}"/><p style="position:relative;top:${getHeight(uijson["main_menu"]["banner_author_text"]["y"])};margin:0;padding:0;left:${getWidth(uijson["main_menu"]["banner_author_text"]["x"])};font-size: ${getWidth(20)}" id="posimage">Author</p><input type="button" style="position:absolute;bottom:${getHeight(5)};z-index:101;right:${getWidth(5)};background-color: #828282;cursor: pointer;border: none;border-radius: ${getHeight(10)}px;color: #f5f6fa;z-index: 115;outline: none;text-align:center;padding: ${getHeight(10)}px ${getWidth(10)}px;font-weight:bold;font-size: ${getWidth(20)};" id="finish" value="Finish"/><input type="button" style="position:absolute;bottom:${getHeight(5)};z-index:101;left:${getWidth(5)};background-color: #828282;cursor: pointer;border: none;border-radius: ${getHeight(10)}px;color: #f5f6fa;z-index: 115;outline: none;text-align:center;padding: ${getHeight(10)}px ${getWidth(10)}px;font-weight:bold;font-size: ${getWidth(20)};" id="visible" value="Visible: ${visible}"/></div>`)
                  let posimage = document.getElementById("posimage");
                  let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
                  posimage.onmousedown = (e) => {
                    pos3 = e.clientX;
                    pos4 = e.clientY;
                    e.preventDefault();
                    document.onmouseup = () => {
                      document.onmouseup = null;
                      document.onmousemove = null;
                    };
                    document.onmousemove = (e) => {
                      e.preventDefault();
                      pos1 = pos3 - e.clientX;
                      pos2 = pos4 - e.clientY;
                      pos3 = e.clientX;
                      pos4 = e.clientY;
                      posimage.style.top = Math.round((posimage.offsetTop - pos2)) + "px";
                      posimage.style.left = Math.round((posimage.offsetLeft - pos1)) + "px";
                      $("#postext").get(0).setAttribute("value", `X: ${getOrigWidth(Math.round((posimage.offsetLeft - pos1)))} | Y: ${getOrigHeight(Math.round((posimage.offsetTop - pos2)))}`);
                    };
                  }
                  makerem.on("up", () => {
                    if(end) return;
                    let y = Math.round(posimage.style.top.replace("px", ""));
                    let x = Math.round(posimage.style.left.replace("px", ""));
                    posimage.style.top = (y-getHeight(1)) + "px";
                    $("#postext").get(0).setAttribute("value", `X: ${getOrigWidth(x)} | Y: ${getOrigHeight(y)-1}`);
                  });
                  makerem.on("down", () => {
                    if(end) return;
                    let y = Math.round(posimage.style.top.replace("px", ""));
                    let x = Math.round(posimage.style.left.replace("px", ""));
                    posimage.style.top = (y+getHeight(1)) + "px";
                    $("#postext").get(0).setAttribute("value", `X: ${getOrigWidth(x)} | Y: ${getOrigHeight(y)+1}`);
                  });
                  makerem.on("left", () => {
                    if(end) return;
                    let y = Math.round(posimage.style.top.replace("px", ""));
                    let x = Math.round(posimage.style.left.replace("px", ""));
                    posimage.style.left = (x-getWidth(1)) + "px";
                    $("#postext").get(0).setAttribute("value", `X: ${getOrigWidth(x)-1} | Y: ${getOrigHeight(y)}`);
                  });
                  makerem.on("right", () => {
                    if(end) return;
                    let y = Math.round(posimage.style.top.replace("px", ""));
                    let x = Math.round(posimage.style.left.replace("px", ""));
                    posimage.style.left = (x+getWidth(1)) + "px";
                    $("#postext").get(0).setAttribute("value", `X: ${getOrigWidth(x)+1} | Y: ${getOrigHeight(y)}`);
                  });
                  $("#visible").click(() => {
                    if(visible){
                      visible = false;
                      $("#visible").get(0).value = "Visible: false"
                    } else {
                      visible = true;
                      $("#visible").get(0).value = "Visible: true"
                    }
                  });
                  $("#finish").click(() => {
                    if(end) return;
                    end = true;
                    let json = {};
                    if(fs.existsSync(path.join(tfolder, "ui", "UI.json"))) json = JSON.parse(fs.readFileSync(path.join(tfolder, "ui", "UI.json"), "utf8"));
                    let x = getOrigWidth(Math.round(posimage.style.left.replace("px", "")));
                    let y = getOrigHeight(Math.round(posimage.style.top.replace("px", "")));
                    if(json.main_menu  == undefined) json.main_menu = {};
                    if(json.main_menu.banner_author_text  == undefined) json.main_menu.banner_author_text = {};
                    json.main_menu.banner_author_text.x = x
                    json.main_menu.banner_author_text.y = y
                    json.main_menu.banner_author_text.visible = visible
                    fs.writeFileSync(path.join(tfolder, "ui", "UI.json"), JSON.stringify(json, null, 2), (err)=>{if(err) throw err});
                    uijson = InitializeUIJson(json);
                    $("#pos").remove();
                  });
                } else if(id == "main_menu_banner_version_text"){
                  let end = false;
                  let visible = uijson["main_menu"]["banner_version_text"]["visible"] == "visible";
                  $("#maker").append(`<div id="pos" style="background-color: #424242;z-index:150;position:absolute;top:0;left:0;overflow:hidden;width:${getWidth(1280)};height:${getHeight(720)};"><input type="button" id="postext" style="background-color:#525252;z-index:115;color:#e1e1e1;font-family:'uLaunch';font-size: ${getWidth(20)};padding: ${getHeight(5)}px ${getWidth(10)}px 0px ${getWidth(10)}px;border: ${getHeight(2)}px #323232;border-bottom-left-radius:${getHeight(10)}px;border-bottom-right-radius:${getHeight(10)}px;position:absolute;top:0;left:50%;transform:translate(-50%)" value="X: ${uijson["main_menu"]["banner_version_text"]["x"]} | Y: ${uijson["main_menu"]["banner_version_text"]["y"]}"/><p style="position:relative;top:${getHeight(uijson["main_menu"]["banner_version_text"]["y"])};margin:0;padding:0;left:${getWidth(uijson["main_menu"]["banner_version_text"]["x"])};font-size: ${getWidth(20)}" id="posimage">Version</p><input type="button" style="position:absolute;bottom:${getHeight(5)};z-index:101;right:${getWidth(5)};background-color: #828282;cursor: pointer;border: none;border-radius: ${getHeight(10)}px;color: #f5f6fa;z-index: 115;outline: none;text-align:center;padding: ${getHeight(10)}px ${getWidth(10)}px;font-weight:bold;font-size: ${getWidth(20)};" id="finish" value="Finish"/><input type="button" style="position:absolute;bottom:${getHeight(5)};z-index:101;left:${getWidth(5)};background-color: #828282;cursor: pointer;border: none;border-radius: ${getHeight(10)}px;color: #f5f6fa;z-index: 115;outline: none;text-align:center;padding: ${getHeight(10)}px ${getWidth(10)}px;font-weight:bold;font-size: ${getWidth(20)};" id="visible" value="Visible: ${visible}"/></div>`)
                  let posimage = document.getElementById("posimage");
                  let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
                  posimage.onmousedown = (e) => {
                    pos3 = e.clientX;
                    pos4 = e.clientY;
                    e.preventDefault();
                    document.onmouseup = () => {
                      document.onmouseup = null;
                      document.onmousemove = null;
                    };
                    document.onmousemove = (e) => {
                      e.preventDefault();
                      pos1 = pos3 - e.clientX;
                      pos2 = pos4 - e.clientY;
                      pos3 = e.clientX;
                      pos4 = e.clientY;
                      posimage.style.top = Math.round((posimage.offsetTop - pos2)) + "px";
                      posimage.style.left = Math.round((posimage.offsetLeft - pos1)) + "px";
                      $("#postext").get(0).setAttribute("value", `X: ${getOrigWidth(Math.round((posimage.offsetLeft - pos1)))} | Y: ${getOrigHeight(Math.round((posimage.offsetTop - pos2)))}`);
                    };
                  }
                  makerem.on("up", () => {
                    if(end) return;
                    let y = Math.round(posimage.style.top.replace("px", ""));
                    let x = Math.round(posimage.style.left.replace("px", ""));
                    posimage.style.top = (y-getHeight(1)) + "px";
                    $("#postext").get(0).setAttribute("value", `X: ${getOrigWidth(x)} | Y: ${getOrigHeight(y)-1}`);
                  });
                  makerem.on("down", () => {
                    if(end) return;
                    let y = Math.round(posimage.style.top.replace("px", ""));
                    let x = Math.round(posimage.style.left.replace("px", ""));
                    posimage.style.top = (y+getHeight(1)) + "px";
                    $("#postext").get(0).setAttribute("value", `X: ${getOrigWidth(x)} | Y: ${getOrigHeight(y)+1}`);
                  });
                  makerem.on("left", () => {
                    if(end) return;
                    let y = Math.round(posimage.style.top.replace("px", ""));
                    let x = Math.round(posimage.style.left.replace("px", ""));
                    posimage.style.left = (x-getWidth(1)) + "px";
                    $("#postext").get(0).setAttribute("value", `X: ${getOrigWidth(x)-1} | Y: ${getOrigHeight(y)}`);
                  });
                  makerem.on("right", () => {
                    if(end) return;
                    let y = Math.round(posimage.style.top.replace("px", ""));
                    let x = Math.round(posimage.style.left.replace("px", ""));
                    posimage.style.left = (x+getWidth(1)) + "px";
                    $("#postext").get(0).setAttribute("value", `X: ${getOrigWidth(x)+1} | Y: ${getOrigHeight(y)}`);
                  });
                  $("#visible").click(() => {
                    if(visible){
                      visible = false;
                      $("#visible").get(0).value = "Visible: false"
                    } else {
                      visible = true;
                      $("#visible").get(0).value = "Visible: true"
                    }
                  });
                  $("#finish").click(() => {
                    if(end) return;
                    end = true;
                    let json = {};
                    if(fs.existsSync(path.join(tfolder, "ui", "UI.json"))) json = JSON.parse(fs.readFileSync(path.join(tfolder, "ui", "UI.json"), "utf8"));
                    let x = getOrigWidth(Math.round(posimage.style.left.replace("px", "")));
                    let y = getOrigHeight(Math.round(posimage.style.top.replace("px", "")));
                    if(json.main_menu  == undefined) json.main_menu = {};
                    if(json.main_menu.banner_name_text  == undefined) json.main_menu.banner_name_text = {};
                    json.main_menu.banner_name_text.x = x
                    json.main_menu.banner_name_text.y = y
                    json.main_menu.banner_name_text.visible = visible
                    fs.writeFileSync(path.join(tfolder, "ui", "UI.json"), JSON.stringify(json, null, 2), (err)=>{if(err) throw err});
                    uijson = InitializeUIJson(json);
                    $("#pos").remove();
                  });
                } else if(id == "main_menu_items_menu"){
                  let end = false;
                  $("#maker").append(`<div id="pos" style="background-color: #424242;z-index:150;position:absolute;top:0;left:0;overflow:hidden;width:${getWidth(1280)};height:${getHeight(720)};"><input type="button" id="postext" style="background-color:#525252;z-index:115;color:#e1e1e1;font-family:'uLaunch';font-size: ${getWidth(20)};padding: ${getHeight(5)}px ${getWidth(10)}px 0px ${getWidth(10)}px;border: ${getHeight(2)}px #323232;border-bottom-left-radius:${getHeight(10)}px;border-bottom-right-radius:${getHeight(10)}px;position:absolute;top:0;left:50%;transform:translate(-50%)" value="Y: ${uijson["main_menu"]["items_menu"]["y"]}"/><img style="position:relative;width:${getWidth(1280)};height:${getHeight(296)};top:${getHeight(uijson["main_menu"]["items_menu"]["y"]-20)};left:0;" id="posimage" src="${path.join(__dirname, "ulaunch", "maker", "itemsmenu.png")}"><input type="button" style="position:absolute;bottom:${getHeight(5)};z-index:101;right:${getWidth(5)};background-color: #828282;cursor: pointer;border: none;border-radius: ${getHeight(10)}px;color: #f5f6fa;z-index: 115;outline: none;text-align:center;padding: ${getHeight(10)}px ${getWidth(10)}px;font-weight:bold;font-size: ${getWidth(20)};" id="finish" value="Finish"/></div>`)
                  let posimage = document.getElementById("posimage");
                  let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
                  posimage.onmousedown = (e) => {
                    pos3 = e.clientX;
                    pos4 = e.clientY;
                    e.preventDefault();
                    document.onmouseup = () => {
                      document.onmouseup = null;
                      document.onmousemove = null;
                    };
                    document.onmousemove = (e) => {
                      e.preventDefault();
                      pos1 = pos3 - e.clientX;
                      pos2 = pos4 - e.clientY;
                      pos3 = e.clientX;
                      pos4 = e.clientY;
                      posimage.style.top = Math.round((posimage.offsetTop - pos2)) + "px";
                      $("#postext").get(0).setAttribute("value", `Y: ${getOrigHeight(Math.round((posimage.offsetTop - pos2))+getHeight(20))}`);
                    };
                  }
                  makerem.on("up", () => {
                    if(end) return;
                    let y = Math.round(posimage.style.top.replace("px", ""));
                    let x = Math.round(posimage.style.left.replace("px", ""));
                    posimage.style.top = (y-getHeight(1)) + "px";
                    $("#postext").get(0).setAttribute("value", `Y: ${getOrigHeight(y)-1+20}`);
                  });
                  makerem.on("down", () => {
                    if(end) return;
                    let y = Math.round(posimage.style.top.replace("px", ""));
                    let x = Math.round(posimage.style.left.replace("px", ""));
                    posimage.style.top = (y+getHeight(1)) + "px";
                    $("#postext").get(0).setAttribute("value", `Y: ${getOrigHeight(y)+1+20}`);
                  });
                  $("#finish").click(() => {
                    if(end) return;
                    end = true;
                    let json = {};
                    if(fs.existsSync(path.join(tfolder, "ui", "UI.json"))) json = JSON.parse(fs.readFileSync(path.join(tfolder, "ui", "UI.json"), "utf8"));
                    let y = getOrigHeight(Math.round(posimage.style.top.replace("px", "")))+20;
                    if(json.main_menu  == undefined) json.main_menu = {};
                    if(json.main_menu.items_menu  == undefined) json.main_menu.items_menu = {};
                    json.main_menu.items_menu.y = y
                    fs.writeFileSync(path.join(tfolder, "ui", "UI.json"), JSON.stringify(json, null, 2), (err)=>{if(err) throw err});
                    uijson = InitializeUIJson(json);
                    $("#pos").remove();
                  });
                } else if(id == "themes_menu_themes_menu_item"){
                  let end = false;
                  let visible = uijson["themes_menu"]["themes_menu_item"]["visible"] == "visible";
                  $("#maker").append(`<div id="pos" style="background-color: #424242;z-index:150;position:absolute;top:0;left:0;overflow:hidden;width:${getWidth(1280)};height:${getHeight(720)};"><input type="button" id="postext" style="background-color:#525252;z-index:115;color:#e1e1e1;font-family:'uLaunch';font-size: ${getWidth(20)};padding: ${getHeight(5)}px ${getWidth(10)}px 0px ${getWidth(10)}px;border: ${getHeight(2)}px #323232;border-bottom-left-radius:${getHeight(10)}px;border-bottom-right-radius:${getHeight(10)}px;position:absolute;top:0;left:50%;transform:translate(-50%)" value="X: ${uijson["themes_menu"]["themes_menu_item"]["x"]} | Y: ${uijson["themes_menu"]["themes_menu_item"]["y"]}"/><div style="position: relative;top: ${getHeight(uijson["themes_menu"]["themes_menu_item"]["y"])}; left: ${getWidth(uijson["themes_menu"]["themes_menu_item"]["x"])};width: ${getWidth(880)};height:${getHeight(500)};overflow-x: hidden;overflow-y: auto;margin: 0px 0px;padding: 0px" type="button" id="posimage"><input type="button" style="position:absolute;top:0;left:0;z-index: 0;width: ${getWidth(880)};height:${getHeight(100)};outline:none;border: none;background-color:${uijson["menu_focus_color"]};"/><input type="button" style="position:absolute;top:${getHeight(100)};left:0;z-index: 0;width: ${getWidth(880)};height:${getHeight(100)};outline:none;border: none;background-color:${uijson["menu_bg_color"]};"/><input type="button" style="position:absolute;top:${getHeight(200)};left:0;z-index: 0;width: ${getWidth(880)};height:${getHeight(100)};outline:none;border: none;background-color:${uijson["menu_bg_color"]};"/><input type="button" style="position:absolute;top:${getHeight(300)};left:0;z-index: 0;width: ${getWidth(880)};height:${getHeight(100)};outline:none;border: none;background-color:${uijson["menu_bg_color"]};"/><input type="button" style="position:absolute;top:${getHeight(400)};left:0;z-index: 0;width: ${getWidth(880)};height:${getHeight(100)};outline:none;border: none;background-color:${uijson["menu_bg_color"]};"/></div><input type="button" style="position:absolute;bottom:${getHeight(5)};z-index:101;right:${getWidth(5)};background-color: #828282;cursor: pointer;border: none;border-radius: ${getHeight(10)}px;color: #f5f6fa;z-index: 115;outline: none;text-align:center;padding: ${getHeight(10)}px ${getWidth(10)}px;font-weight:bold;font-size: ${getWidth(20)};" id="finish" value="Finish"/><input type="button" style="position:absolute;bottom:${getHeight(5)};z-index:101;left:${getWidth(5)};background-color: #828282;cursor: pointer;border: none;border-radius: ${getHeight(10)}px;color: #f5f6fa;z-index: 115;outline: none;text-align:center;padding: ${getHeight(10)}px ${getWidth(10)}px;font-weight:bold;font-size: ${getWidth(20)};" id="visible" value="Visible: ${visible}"/></div>`)
                  let posimage = document.getElementById("posimage");
                  let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
                  posimage.onmousedown = (e) => {
                    pos3 = e.clientX;
                    pos4 = e.clientY;
                    e.preventDefault();
                    document.onmouseup = () => {
                      document.onmouseup = null;
                      document.onmousemove = null;
                    };
                    document.onmousemove = (e) => {
                      e.preventDefault();
                      pos1 = pos3 - e.clientX;
                      pos2 = pos4 - e.clientY;
                      pos3 = e.clientX;
                      pos4 = e.clientY;
                      posimage.style.top = Math.round((posimage.offsetTop - pos2)) + "px";
                      posimage.style.left = Math.round((posimage.offsetLeft - pos1)) + "px";
                      $("#postext").get(0).setAttribute("value", `X: ${getOrigWidth(Math.round((posimage.offsetLeft - pos1)))} | Y: ${getOrigHeight(Math.round((posimage.offsetTop - pos2)))}`);
                    };
                  }
                  makerem.on("up", () => {
                    if(end) return;
                    let y = Math.round(posimage.style.top.replace("px", ""));
                    let x = Math.round(posimage.style.left.replace("px", ""));
                    posimage.style.top = (y-getHeight(1)) + "px";
                    $("#postext").get(0).setAttribute("value", `X: ${getOrigWidth(x)} | Y: ${getOrigHeight(y)-1}`);
                  });
                  makerem.on("down", () => {
                    if(end) return;
                    let y = Math.round(posimage.style.top.replace("px", ""));
                    let x = Math.round(posimage.style.left.replace("px", ""));
                    posimage.style.top = (y+getHeight(1)) + "px";
                    $("#postext").get(0).setAttribute("value", `X: ${getOrigWidth(x)} | Y: ${getOrigHeight(y)+1}`);
                  });
                  makerem.on("left", () => {
                    if(end) return;
                    let y = Math.round(posimage.style.top.replace("px", ""));
                    let x = Math.round(posimage.style.left.replace("px", ""));
                    posimage.style.left = (x-getWidth(1)) + "px";
                    $("#postext").get(0).setAttribute("value", `X: ${getOrigWidth(x)-1} | Y: ${getOrigHeight(y)}`);
                  });
                  makerem.on("right", () => {
                    if(end) return;
                    let y = Math.round(posimage.style.top.replace("px", ""));
                    let x = Math.round(posimage.style.left.replace("px", ""));
                    posimage.style.left = (x+getWidth(1)) + "px";
                    $("#postext").get(0).setAttribute("value", `X: ${getOrigWidth(x)+1} | Y: ${getOrigHeight(y)}`);
                  });
                  $("#visible").click(() => {
                    if(visible){
                      visible = false;
                      $("#visible").get(0).value = "Visible: false"
                    } else {
                      visible = true;
                      $("#visible").get(0).value = "Visible: true"
                    }
                  });
                  $("#finish").click(() => {
                    if(end) return;
                    end = true;
                    let json = {};
                    if(fs.existsSync(path.join(tfolder, "ui", "UI.json"))) json = JSON.parse(fs.readFileSync(path.join(tfolder, "ui", "UI.json"), "utf8"));
                    let x = getOrigWidth(Math.round(posimage.style.left.replace("px", "")));
                    let y = getOrigHeight(Math.round(posimage.style.top.replace("px", "")));
                    if(json.themes_menu  == undefined) json.themes_menu = {};
                    if(json.themes_menu.themes_menu_item  == undefined) json.themes_menu.themes_menu_item = {};
                    json.themes_menu.themes_menu_item.x = x
                    json.themes_menu.themes_menu_item.y = y
                    json.themes_menu.themes_menu_item.visible = visible
                    fs.writeFileSync(path.join(tfolder, "ui", "UI.json"), JSON.stringify(json, null, 2), (err)=>{if(err) throw err});
                    uijson = InitializeUIJson(json);
                    $("#pos").remove();
                  });
                } else if(id == "themes_menu_current_theme_text"){
                  let end = false;
                  let visible = uijson["themes_menu"]["current_theme_text"]["visible"] == "visible";
                  $("#maker").append(`<div id="pos" style="background-color: #424242;z-index:150;position:absolute;top:0;left:0;overflow:hidden;width:${getWidth(1280)};height:${getHeight(720)};"><input type="button" id="postext" style="background-color:#525252;z-index:115;color:#e1e1e1;font-family:'uLaunch';font-size: ${getWidth(20)};padding: ${getHeight(5)}px ${getWidth(10)}px 0px ${getWidth(10)}px;border: ${getHeight(2)}px #323232;border-bottom-left-radius:${getHeight(10)}px;border-bottom-right-radius:${getHeight(10)}px;position:absolute;top:0;left:50%;transform:translate(-50%)" value="X: ${uijson["themes_menu"]["current_theme_text"]["x"]} | Y: ${uijson["themes_menu"]["current_theme_text"]["y"]}"/><p style="position:relative;top:${getHeight(uijson["themes_menu"]["current_theme_text"]["y"])};margin:0;padding:0;left:${getWidth(uijson["themes_menu"]["current_theme_text"]["x"])};font-size: ${getWidth(30)}" id="posimage">${lang["theme_no_custom"]}</p><input type="button" style="position:absolute;bottom:${getHeight(5)};z-index:101;right:${getWidth(5)};background-color: #828282;cursor: pointer;border: none;border-radius: ${getHeight(10)}px;color: #f5f6fa;z-index: 115;outline: none;text-align:center;padding: ${getHeight(10)}px ${getWidth(10)}px;font-weight:bold;font-size: ${getWidth(20)};" id="finish" value="Finish"/><input type="button" style="position:absolute;bottom:${getHeight(5)};z-index:101;left:${getWidth(5)};background-color: #828282;cursor: pointer;border: none;border-radius: ${getHeight(10)}px;color: #f5f6fa;z-index: 115;outline: none;text-align:center;padding: ${getHeight(10)}px ${getWidth(10)}px;font-weight:bold;font-size: ${getWidth(20)};" id="visible" value="Visible: ${visible}"/></div>`)
                  let posimage = document.getElementById("posimage");
                  let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
                  posimage.onmousedown = (e) => {
                    pos3 = e.clientX;
                    pos4 = e.clientY;
                    e.preventDefault();
                    document.onmouseup = () => {
                      document.onmouseup = null;
                      document.onmousemove = null;
                    };
                    document.onmousemove = (e) => {
                      e.preventDefault();
                      pos1 = pos3 - e.clientX;
                      pos2 = pos4 - e.clientY;
                      pos3 = e.clientX;
                      pos4 = e.clientY;
                      posimage.style.top = Math.round((posimage.offsetTop - pos2)) + "px";
                      posimage.style.left = Math.round((posimage.offsetLeft - pos1)) + "px";
                      $("#postext").get(0).setAttribute("value", `X: ${getOrigWidth(Math.round((posimage.offsetLeft - pos1)))} | Y: ${getOrigHeight(Math.round((posimage.offsetTop - pos2)))}`);
                    };
                  }
                  makerem.on("up", () => {
                    if(end) return;
                    let y = Math.round(posimage.style.top.replace("px", ""));
                    let x = Math.round(posimage.style.left.replace("px", ""));
                    posimage.style.top = (y-getHeight(1)) + "px";
                    $("#postext").get(0).setAttribute("value", `X: ${getOrigWidth(x)} | Y: ${getOrigHeight(y)-1}`);
                  });
                  makerem.on("down", () => {
                    if(end) return;
                    let y = Math.round(posimage.style.top.replace("px", ""));
                    let x = Math.round(posimage.style.left.replace("px", ""));
                    posimage.style.top = (y+getHeight(1)) + "px";
                    $("#postext").get(0).setAttribute("value", `X: ${getOrigWidth(x)} | Y: ${getOrigHeight(y)+1}`);
                  });
                  makerem.on("left", () => {
                    if(end) return;
                    let y = Math.round(posimage.style.top.replace("px", ""));
                    let x = Math.round(posimage.style.left.replace("px", ""));
                    posimage.style.left = (x-getWidth(1)) + "px";
                    $("#postext").get(0).setAttribute("value", `X: ${getOrigWidth(x)-1} | Y: ${getOrigHeight(y)}`);
                  });
                  makerem.on("right", () => {
                    if(end) return;
                    let y = Math.round(posimage.style.top.replace("px", ""));
                    let x = Math.round(posimage.style.left.replace("px", ""));
                    posimage.style.left = (x+getWidth(1)) + "px";
                    $("#postext").get(0).setAttribute("value", `X: ${getOrigWidth(x)+1} | Y: ${getOrigHeight(y)}`);
                  });
                  $("#visible").click(() => {
                    if(visible){
                      visible = false;
                      $("#visible").get(0).value = "Visible: false"
                    } else {
                      visible = true;
                      $("#visible").get(0).value = "Visible: true"
                    }
                  });
                  $("#finish").click(() => {
                    if(end) return;
                    end = true;
                    let json = {};
                    if(fs.existsSync(path.join(tfolder, "ui", "UI.json"))) json = JSON.parse(fs.readFileSync(path.join(tfolder, "ui", "UI.json"), "utf8"));
                    let x = getOrigWidth(Math.round(posimage.style.left.replace("px", "")));
                    let y = getOrigHeight(Math.round(posimage.style.top.replace("px", "")));
                    if(json.themes_menu  == undefined) json.themes_menu = {};
                    if(json.themes_menu.current_theme_text  == undefined) json.themes_menu.current_theme_text = {};
                    json.themes_menu.current_theme_text.x = x
                    json.themes_menu.current_theme_text.y = y
                    json.themes_menu.current_theme_text.visible = visible
                    fs.writeFileSync(path.join(tfolder, "ui", "UI.json"), JSON.stringify(json, null, 2), (err)=>{if(err) throw err});
                    uijson = InitializeUIJson(json);
                    $("#pos").remove();
                  });
                } else if(id == "themes_menu_current_theme_name_text"){
                  let end = false;
                  let visible = uijson["themes_menu"]["current_theme_name_text"]["visible"] == "visible";
                  $("#maker").append(`<div id="pos" style="background-color: #424242;z-index:150;position:absolute;top:0;left:0;overflow:hidden;width:${getWidth(1280)};height:${getHeight(720)};"><input type="button" id="postext" style="background-color:#525252;z-index:115;color:#e1e1e1;font-family:'uLaunch';font-size: ${getWidth(20)};padding: ${getHeight(5)}px ${getWidth(10)}px 0px ${getWidth(10)}px;border: ${getHeight(2)}px #323232;border-bottom-left-radius:${getHeight(10)}px;border-bottom-right-radius:${getHeight(10)}px;position:absolute;top:0;left:50%;transform:translate(-50%)" value="X: ${uijson["themes_menu"]["current_theme_name_text"]["x"]} | Y: ${uijson["themes_menu"]["current_theme_name_text"]["y"]}"/><p style="position:relative;top:${getHeight(uijson["themes_menu"]["current_theme_name_text"]["y"])};margin:0;padding:0;left:${getWidth(uijson["themes_menu"]["current_theme_name_text"]["x"])};font-size: ${getWidth(30)}" id="posimage">Name</p><input type="button" style="position:absolute;bottom:${getHeight(5)};z-index:101;right:${getWidth(5)};background-color: #828282;cursor: pointer;border: none;border-radius: ${getHeight(10)}px;color: #f5f6fa;z-index: 115;outline: none;text-align:center;padding: ${getHeight(10)}px ${getWidth(10)}px;font-weight:bold;font-size: ${getWidth(20)};" id="finish" value="Finish"/><input type="button" style="position:absolute;bottom:${getHeight(5)};z-index:101;left:${getWidth(5)};background-color: #828282;cursor: pointer;border: none;border-radius: ${getHeight(10)}px;color: #f5f6fa;z-index: 115;outline: none;text-align:center;padding: ${getHeight(10)}px ${getWidth(10)}px;font-weight:bold;font-size: ${getWidth(20)};" id="visible" value="Visible: ${visible}"/></div>`)
                  let posimage = document.getElementById("posimage");
                  let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
                  posimage.onmousedown = (e) => {
                    pos3 = e.clientX;
                    pos4 = e.clientY;
                    e.preventDefault();
                    document.onmouseup = () => {
                      document.onmouseup = null;
                      document.onmousemove = null;
                    };
                    document.onmousemove = (e) => {
                      e.preventDefault();
                      pos1 = pos3 - e.clientX;
                      pos2 = pos4 - e.clientY;
                      pos3 = e.clientX;
                      pos4 = e.clientY;
                      posimage.style.top = Math.round((posimage.offsetTop - pos2)) + "px";
                      posimage.style.left = Math.round((posimage.offsetLeft - pos1)) + "px";
                      $("#postext").get(0).setAttribute("value", `X: ${getOrigWidth(Math.round((posimage.offsetLeft - pos1)))} | Y: ${getOrigHeight(Math.round((posimage.offsetTop - pos2)))}`);
                    };
                  }
                  makerem.on("up", () => {
                    if(end) return;
                    let y = Math.round(posimage.style.top.replace("px", ""));
                    let x = Math.round(posimage.style.left.replace("px", ""));
                    posimage.style.top = (y-getHeight(1)) + "px";
                    $("#postext").get(0).setAttribute("value", `X: ${getOrigWidth(x)} | Y: ${getOrigHeight(y)-1}`);
                  });
                  makerem.on("down", () => {
                    if(end) return;
                    let y = Math.round(posimage.style.top.replace("px", ""));
                    let x = Math.round(posimage.style.left.replace("px", ""));
                    posimage.style.top = (y+getHeight(1)) + "px";
                    $("#postext").get(0).setAttribute("value", `X: ${getOrigWidth(x)} | Y: ${getOrigHeight(y)+1}`);
                  });
                  makerem.on("left", () => {
                    if(end) return;
                    let y = Math.round(posimage.style.top.replace("px", ""));
                    let x = Math.round(posimage.style.left.replace("px", ""));
                    posimage.style.left = (x-getWidth(1)) + "px";
                    $("#postext").get(0).setAttribute("value", `X: ${getOrigWidth(x)-1} | Y: ${getOrigHeight(y)}`);
                  });
                  makerem.on("right", () => {
                    if(end) return;
                    let y = Math.round(posimage.style.top.replace("px", ""));
                    let x = Math.round(posimage.style.left.replace("px", ""));
                    posimage.style.left = (x+getWidth(1)) + "px";
                    $("#postext").get(0).setAttribute("value", `X: ${getOrigWidth(x)+1} | Y: ${getOrigHeight(y)}`);
                  });
                  $("#visible").click(() => {
                    if(visible){
                      visible = false;
                      $("#visible").get(0).value = "Visible: false"
                    } else {
                      visible = true;
                      $("#visible").get(0).value = "Visible: true"
                    }
                  });
                  $("#finish").click(() => {
                    if(end) return;
                    end = true;
                    let json = {};
                    if(fs.existsSync(path.join(tfolder, "ui", "UI.json"))) json = JSON.parse(fs.readFileSync(path.join(tfolder, "ui", "UI.json"), "utf8"));
                    let x = getOrigWidth(Math.round(posimage.style.left.replace("px", "")));
                    let y = getOrigHeight(Math.round(posimage.style.top.replace("px", "")));
                    if(json.themes_menu  == undefined) json.themes_menu = {};
                    if(json.themes_menu.current_theme_text  == undefined) json.themes_menu.current_theme_text = {};
                    json.themes_menu.current_theme_text.x = x
                    json.themes_menu.current_theme_text.y = y
                    json.themes_menu.current_theme_text.visible = visible
                    fs.writeFileSync(path.join(tfolder, "ui", "UI.json"), JSON.stringify(json, null, 2), (err)=>{if(err) throw err});
                    uijson = InitializeUIJson(json);
                    $("#pos").remove();
                  });
                } else if(id == "themes_menu_current_theme_version_text"){
                  let end = false;
                  let visible = uijson["themes_menu"]["current_theme_version_text"]["visible"] == "visible";
                  $("#maker").append(`<div id="pos" style="background-color: #424242;z-index:150;position:absolute;top:0;left:0;overflow:hidden;width:${getWidth(1280)};height:${getHeight(720)};"><input type="button" id="postext" style="background-color:#525252;z-index:115;color:#e1e1e1;font-family:'uLaunch';font-size: ${getWidth(20)};padding: ${getHeight(5)}px ${getWidth(10)}px 0px ${getWidth(10)}px;border: ${getHeight(2)}px #323232;border-bottom-left-radius:${getHeight(10)}px;border-bottom-right-radius:${getHeight(10)}px;position:absolute;top:0;left:50%;transform:translate(-50%)" value="X: ${uijson["themes_menu"]["current_theme_version_text"]["x"]} | Y: ${uijson["themes_menu"]["current_theme_version_text"]["y"]}"/><p style="position:relative;top:${getHeight(uijson["themes_menu"]["current_theme_version_text"]["y"])};margin:0;padding:0;left:${getWidth(uijson["themes_menu"]["current_theme_version_text"]["x"])};font-size: ${getWidth(20)}" id="posimage">Version</p><input type="button" style="position:absolute;bottom:${getHeight(5)};z-index:101;right:${getWidth(5)};background-color: #828282;cursor: pointer;border: none;border-radius: ${getHeight(10)}px;color: #f5f6fa;z-index: 115;outline: none;text-align:center;padding: ${getHeight(10)}px ${getWidth(10)}px;font-weight:bold;font-size: ${getWidth(20)};" id="finish" value="Finish"/><input type="button" style="position:absolute;bottom:${getHeight(5)};z-index:101;left:${getWidth(5)};background-color: #828282;cursor: pointer;border: none;border-radius: ${getHeight(10)}px;color: #f5f6fa;z-index: 115;outline: none;text-align:center;padding: ${getHeight(10)}px ${getWidth(10)}px;font-weight:bold;font-size: ${getWidth(20)};" id="visible" value="Visible: ${visible}"/></div>`)
                  let posimage = document.getElementById("posimage");
                  let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
                  posimage.onmousedown = (e) => {
                    pos3 = e.clientX;
                    pos4 = e.clientY;
                    e.preventDefault();
                    document.onmouseup = () => {
                      document.onmouseup = null;
                      document.onmousemove = null;
                    };
                    document.onmousemove = (e) => {
                      e.preventDefault();
                      pos1 = pos3 - e.clientX;
                      pos2 = pos4 - e.clientY;
                      pos3 = e.clientX;
                      pos4 = e.clientY;
                      posimage.style.top = Math.round((posimage.offsetTop - pos2)) + "px";
                      posimage.style.left = Math.round((posimage.offsetLeft - pos1)) + "px";
                      $("#postext").get(0).setAttribute("value", `X: ${getOrigWidth(Math.round((posimage.offsetLeft - pos1)))} | Y: ${getOrigHeight(Math.round((posimage.offsetTop - pos2)))}`);
                    };
                  }
                  makerem.on("up", () => {
                    if(end) return;
                    let y = Math.round(posimage.style.top.replace("px", ""));
                    let x = Math.round(posimage.style.left.replace("px", ""));
                    posimage.style.top = (y-getHeight(1)) + "px";
                    $("#postext").get(0).setAttribute("value", `X: ${getOrigWidth(x)} | Y: ${getOrigHeight(y)-1}`);
                  });
                  makerem.on("down", () => {
                    if(end) return;
                    let y = Math.round(posimage.style.top.replace("px", ""));
                    let x = Math.round(posimage.style.left.replace("px", ""));
                    posimage.style.top = (y+getHeight(1)) + "px";
                    $("#postext").get(0).setAttribute("value", `X: ${getOrigWidth(x)} | Y: ${getOrigHeight(y)+1}`);
                  });
                  makerem.on("left", () => {
                    if(end) return;
                    let y = Math.round(posimage.style.top.replace("px", ""));
                    let x = Math.round(posimage.style.left.replace("px", ""));
                    posimage.style.left = (x-getWidth(1)) + "px";
                    $("#postext").get(0).setAttribute("value", `X: ${getOrigWidth(x)-1} | Y: ${getOrigHeight(y)}`);
                  });
                  makerem.on("right", () => {
                    if(end) return;
                    let y = Math.round(posimage.style.top.replace("px", ""));
                    let x = Math.round(posimage.style.left.replace("px", ""));
                    posimage.style.left = (x+getWidth(1)) + "px";
                    $("#postext").get(0).setAttribute("value", `X: ${getOrigWidth(x)+1} | Y: ${getOrigHeight(y)}`);
                  });
                  $("#visible").click(() => {
                    if(visible){
                      visible = false;
                      $("#visible").get(0).value = "Visible: false"
                    } else {
                      visible = true;
                      $("#visible").get(0).value = "Visible: true"
                    }
                  });
                  $("#finish").click(() => {
                    if(end) return;
                    end = true;
                    let json = {};
                    if(fs.existsSync(path.join(tfolder, "ui", "UI.json"))) json = JSON.parse(fs.readFileSync(path.join(tfolder, "ui", "UI.json"), "utf8"));
                    let x = getOrigWidth(Math.round(posimage.style.left.replace("px", "")));
                    let y = getOrigHeight(Math.round(posimage.style.top.replace("px", "")));
                    if(json.themes_menu  == undefined) json.themes_menu = {};
                    if(json.themes_menu.current_theme_name_text  == undefined) json.themes_menu.current_theme_name_text = {};
                    json.themes_menu.current_theme_name_text.x = x
                    json.themes_menu.current_theme_name_text.y = y
                    json.themes_menu.current_theme_name_text.visible = visible
                    fs.writeFileSync(path.join(tfolder, "ui", "UI.json"), JSON.stringify(json, null, 2), (err)=>{if(err) throw err});
                    uijson = InitializeUIJson(json);
                    $("#pos").remove();
                  });
                } else if(id == "themes_menu_current_theme_author_text"){
                  let end = false;
                  let visible = uijson["themes_menu"]["current_theme_author_text"]["visible"] == "visible";
                  $("#maker").append(`<div id="pos" style="background-color: #424242;z-index:150;position:absolute;top:0;left:0;overflow:hidden;width:${getWidth(1280)};height:${getHeight(720)};"><input type="button" id="postext" style="background-color:#525252;z-index:115;color:#e1e1e1;font-family:'uLaunch';font-size: ${getWidth(20)};padding: ${getHeight(5)}px ${getWidth(10)}px 0px ${getWidth(10)}px;border: ${getHeight(2)}px #323232;border-bottom-left-radius:${getHeight(10)}px;border-bottom-right-radius:${getHeight(10)}px;position:absolute;top:0;left:50%;transform:translate(-50%)" value="X: ${uijson["themes_menu"]["current_theme_author_text"]["x"]} | Y: ${uijson["themes_menu"]["current_theme_author_text"]["y"]}"/><p style="position:relative;top:${getHeight(uijson["themes_menu"]["current_theme_author_text"]["y"])};margin:0;padding:0;left:${getWidth(uijson["themes_menu"]["current_theme_author_text"]["x"])};font-size: ${getWidth(20)}" id="posimage">Author</p><input type="button" style="position:absolute;bottom:${getHeight(5)};z-index:101;right:${getWidth(5)};background-color: #828282;cursor: pointer;border: none;border-radius: ${getHeight(10)}px;color: #f5f6fa;z-index: 115;outline: none;text-align:center;padding: ${getHeight(10)}px ${getWidth(10)}px;font-weight:bold;font-size: ${getWidth(20)};" id="finish" value="Finish"/><input type="button" style="position:absolute;bottom:${getHeight(5)};z-index:101;left:${getWidth(5)};background-color: #828282;cursor: pointer;border: none;border-radius: ${getHeight(10)}px;color: #f5f6fa;z-index: 115;outline: none;text-align:center;padding: ${getHeight(10)}px ${getWidth(10)}px;font-weight:bold;font-size: ${getWidth(20)};" id="visible" value="Visible: ${visible}"/></div>`)
                  let posimage = document.getElementById("posimage");
                  let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
                  posimage.onmousedown = (e) => {
                    pos3 = e.clientX;
                    pos4 = e.clientY;
                    e.preventDefault();
                    document.onmouseup = () => {
                      document.onmouseup = null;
                      document.onmousemove = null;
                    };
                    document.onmousemove = (e) => {
                      e.preventDefault();
                      pos1 = pos3 - e.clientX;
                      pos2 = pos4 - e.clientY;
                      pos3 = e.clientX;
                      pos4 = e.clientY;
                      posimage.style.top = Math.round((posimage.offsetTop - pos2)) + "px";
                      posimage.style.left = Math.round((posimage.offsetLeft - pos1)) + "px";
                      $("#postext").get(0).setAttribute("value", `X: ${getOrigWidth(Math.round((posimage.offsetLeft - pos1)))} | Y: ${getOrigHeight(Math.round((posimage.offsetTop - pos2)))}`);
                    };
                  }
                  makerem.on("up", () => {
                    if(end) return;
                    let y = Math.round(posimage.style.top.replace("px", ""));
                    let x = Math.round(posimage.style.left.replace("px", ""));
                    posimage.style.top = (y-getHeight(1)) + "px";
                    $("#postext").get(0).setAttribute("value", `X: ${getOrigWidth(x)} | Y: ${getOrigHeight(y)-1}`);
                  });
                  makerem.on("down", () => {
                    if(end) return;
                    let y = Math.round(posimage.style.top.replace("px", ""));
                    let x = Math.round(posimage.style.left.replace("px", ""));
                    posimage.style.top = (y+getHeight(1)) + "px";
                    $("#postext").get(0).setAttribute("value", `X: ${getOrigWidth(x)} | Y: ${getOrigHeight(y)+1}`);
                  });
                  makerem.on("left", () => {
                    if(end) return;
                    let y = Math.round(posimage.style.top.replace("px", ""));
                    let x = Math.round(posimage.style.left.replace("px", ""));
                    posimage.style.left = (x-getWidth(1)) + "px";
                    $("#postext").get(0).setAttribute("value", `X: ${getOrigWidth(x)-1} | Y: ${getOrigHeight(y)}`);
                  });
                  makerem.on("right", () => {
                    if(end) return;
                    let y = Math.round(posimage.style.top.replace("px", ""));
                    let x = Math.round(posimage.style.left.replace("px", ""));
                    posimage.style.left = (x+getWidth(1)) + "px";
                    $("#postext").get(0).setAttribute("value", `X: ${getOrigWidth(x)+1} | Y: ${getOrigHeight(y)}`);
                  });
                  $("#visible").click(() => {
                    if(visible){
                      visible = false;
                      $("#visible").get(0).value = "Visible: false"
                    } else {
                      visible = true;
                      $("#visible").get(0).value = "Visible: true"
                    }
                  });
                  $("#finish").click(() => {
                    if(end) return;
                    end = true;
                    let json = {};
                    if(fs.existsSync(path.join(tfolder, "ui", "UI.json"))) json = JSON.parse(fs.readFileSync(path.join(tfolder, "ui", "UI.json"), "utf8"));
                    let x = getOrigWidth(Math.round(posimage.style.left.replace("px", "")));
                    let y = getOrigHeight(Math.round(posimage.style.top.replace("px", "")));
                    if(json.themes_menu  == undefined) json.themes_menu = {};
                    if(json.themes_menu.current_theme_author_text  == undefined) json.themes_menu.current_theme_author_text = {};
                    json.themes_menu.current_theme_author_text.x = x
                    json.themes_menu.current_theme_author_text.y = y
                    json.themes_menu.current_theme_author_text.visible = visible
                    fs.writeFileSync(path.join(tfolder, "ui", "UI.json"), JSON.stringify(json, null, 2), (err)=>{if(err) throw err});
                    uijson = InitializeUIJson(json);
                    $("#pos").remove();
                  });
                } else if(id == "themes_menu_current_theme_icon"){
                  let end = false;
                  let visible = uijson["themes_menu"]["current_theme_icon"]["visible"] == "visible";
                  $("#maker").append(`<div id="pos" style="background-color: #424242;z-index:150;position:absolute;top:0;left:0;overflow:hidden;width:${getWidth(1280)};height:${getHeight(720)};"><input type="button" id="postext" style="background-color:#525252;z-index:115;color:#e1e1e1;font-family:'uLaunch';font-size: ${getWidth(20)};padding: ${getHeight(5)}px ${getWidth(10)}px 0px ${getWidth(10)}px;border: ${getHeight(2)}px #323232;border-bottom-left-radius:${getHeight(10)}px;border-bottom-right-radius:${getHeight(10)}px;position:absolute;top:0;left:50%;transform:translate(-50%)" value="X: ${uijson["themes_menu"]["current_theme_icon"]["x"]} | Y: ${uijson["themes_menu"]["current_theme_icon"]["y"]}"/><img style="position:relative;top:${getHeight(uijson["themes_menu"]["current_theme_icon"]["y"])};left:${getWidth(uijson["themes_menu"]["current_theme_icon"]["x"])};" width="${getWidth(100)}" height="${getHeight(100)}" id="posimage" src="${path.join(__dirname, "ulaunch", "User.png")}"><input type="button" style="position:absolute;bottom:${getHeight(5)};z-index:101;right:${getWidth(5)};background-color: #828282;cursor: pointer;border: none;border-radius: ${getHeight(10)}px;color: #f5f6fa;z-index: 115;outline: none;text-align:center;padding: ${getHeight(10)}px ${getWidth(10)}px;font-weight:bold;font-size: ${getWidth(20)};" id="finish" value="Finish"/><input type="button" style="position:absolute;bottom:${getHeight(5)};z-index:101;left:${getWidth(5)};background-color: #828282;cursor: pointer;border: none;border-radius: ${getHeight(10)}px;color: #f5f6fa;z-index: 115;outline: none;text-align:center;padding: ${getHeight(10)}px ${getWidth(10)}px;font-weight:bold;font-size: ${getWidth(20)};" id="visible" value="Visible: ${visible}"/></div>`)
                  let posimage = document.getElementById("posimage");
                  let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
                  posimage.onmousedown = (e) => {
                    pos3 = e.clientX;
                    pos4 = e.clientY;
                    e.preventDefault();
                    document.onmouseup = () => {
                      document.onmouseup = null;
                      document.onmousemove = null;
                    };
                    document.onmousemove = (e) => {
                      e.preventDefault();
                      pos1 = pos3 - e.clientX;
                      pos2 = pos4 - e.clientY;
                      pos3 = e.clientX;
                      pos4 = e.clientY;
                      posimage.style.top = Math.round((posimage.offsetTop - pos2)) + "px";
                      posimage.style.left = Math.round((posimage.offsetLeft - pos1)) + "px";
                      $("#postext").get(0).setAttribute("value", `X: ${getOrigWidth(Math.round((posimage.offsetLeft - pos1)))} | Y: ${getOrigHeight(Math.round((posimage.offsetTop - pos2)))}`);
                    };
                  }
                  makerem.on("up", () => {
                    if(end) return;
                    let y = Math.round(posimage.style.top.replace("px", ""));
                    let x = Math.round(posimage.style.left.replace("px", ""));
                    posimage.style.top = (y-getHeight(1)) + "px";
                    $("#postext").get(0).setAttribute("value", `X: ${getOrigWidth(x)} | Y: ${getOrigHeight(y)-1}`);
                  });
                  makerem.on("down", () => {
                    if(end) return;
                    let y = Math.round(posimage.style.top.replace("px", ""));
                    let x = Math.round(posimage.style.left.replace("px", ""));
                    posimage.style.top = (y+getHeight(1)) + "px";
                    $("#postext").get(0).setAttribute("value", `X: ${getOrigWidth(x)} | Y: ${getOrigHeight(y)+1}`);
                  });
                  makerem.on("left", () => {
                    if(end) return;
                    let y = Math.round(posimage.style.top.replace("px", ""));
                    let x = Math.round(posimage.style.left.replace("px", ""));
                    posimage.style.left = (x-getWidth(1)) + "px";
                    $("#postext").get(0).setAttribute("value", `X: ${getOrigWidth(x)-1} | Y: ${getOrigHeight(y)}`);
                  });
                  makerem.on("right", () => {
                    if(end) return;
                    let y = Math.round(posimage.style.top.replace("px", ""));
                    let x = Math.round(posimage.style.left.replace("px", ""));
                    posimage.style.left = (x+getWidth(1)) + "px";
                    $("#postext").get(0).setAttribute("value", `X: ${getOrigWidth(x)+1} | Y: ${getOrigHeight(y)}`);
                  });
                  $("#visible").click(() => {
                    if(visible){
                      visible = false;
                      $("#visible").get(0).value = "Visible: false"
                    } else {
                      visible = true;
                      $("#visible").get(0).value = "Visible: true"
                    }
                  });
                  $("#finish").click(() => {
                    if(end) return;
                    end = true;
                    let json = {};
                    if(fs.existsSync(path.join(tfolder, "ui", "UI.json"))) json = JSON.parse(fs.readFileSync(path.join(tfolder, "ui", "UI.json"), "utf8"));
                    let x = getOrigWidth(Math.round(posimage.style.left.replace("px", "")));
                    let y = getOrigHeight(Math.round(posimage.style.top.replace("px", "")));
                    if(json.themes_menu  == undefined) json.themes_menu = {};
                    if(json.themes_menu.current_theme_icon  == undefined) json.themes_menu.current_theme_icon = {};
                    json.themes_menu.current_theme_icon.x = x
                    json.themes_menu.current_theme_icon.y = y
                    json.themes_menu.current_theme_icon.visible = visible
                    fs.writeFileSync(path.join(tfolder, "ui", "UI.json"), JSON.stringify(json, null, 2), (err)=>{if(err) throw err});
                    uijson = InitializeUIJson(json);
                    $("#pos").remove();
                  });
                } else if(id == "languages_menu_info_text"){
                  let end = false;
                  let visible = uijson["languages_menu"]["info_text"]["visible"] == "visible";
                  $("#maker").append(`<div id="pos" style="background-color: #424242;z-index:150;position:absolute;top:0;left:0;overflow:hidden;width:${getWidth(1280)};height:${getHeight(720)};"><input type="button" id="postext" style="background-color:#525252;z-index:115;color:#e1e1e1;font-family:'uLaunch';font-size: ${getWidth(20)};padding: ${getHeight(5)}px ${getWidth(10)}px 0px ${getWidth(10)}px;border: ${getHeight(2)}px #323232;border-bottom-left-radius:${getHeight(10)}px;border-bottom-right-radius:${getHeight(10)}px;position:absolute;top:0;left:50%;transform:translate(-50%)" value="Y: ${uijson["languages_menu"]["info_text"]["y"]}"/><p style="position:relative;top:${getHeight(uijson["languages_menu"]["info_text"]["y"])};margin:0;padding:0;left:50%;transform:translate(-50%);text-align:center;width:${getWidth(1280)};font-size: ${getWidth(25)}" id="posimage">${lang["lang_info_text"]}</p><input type="button" style="position:absolute;bottom:${getHeight(5)};z-index:101;right:${getWidth(5)};background-color: #828282;cursor: pointer;border: none;border-radius: ${getHeight(10)}px;color: #f5f6fa;z-index: 115;outline: none;text-align:center;padding: ${getHeight(10)}px ${getWidth(10)}px;font-weight:bold;font-size: ${getWidth(20)};" id="finish" value="Finish"/><input type="button" style="position:absolute;bottom:${getHeight(5)};z-index:101;left:${getWidth(5)};background-color: #828282;cursor: pointer;border: none;border-radius: ${getHeight(10)}px;color: #f5f6fa;z-index: 115;outline: none;text-align:center;padding: ${getHeight(10)}px ${getWidth(10)}px;font-weight:bold;font-size: ${getWidth(20)};" id="visible" value="Visible: ${visible}"/></div>`)
                  let posimage = document.getElementById("posimage");
                  let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
                  posimage.onmousedown = (e) => {
                    pos3 = e.clientX;
                    pos4 = e.clientY;
                    e.preventDefault();
                    document.onmouseup = () => {
                      document.onmouseup = null;
                      document.onmousemove = null;
                    };
                    document.onmousemove = (e) => {
                      e.preventDefault();
                      pos1 = pos3 - e.clientX;
                      pos2 = pos4 - e.clientY;
                      pos3 = e.clientX;
                      pos4 = e.clientY;
                      posimage.style.top = Math.round((posimage.offsetTop - pos2)) + "px";
                      $("#postext").get(0).setAttribute("value", `Y: ${getOrigHeight(Math.round((posimage.offsetTop - pos2)))}`);
                    };
                  }
                  makerem.on("up", () => {
                    if(end) return;
                    let y = Math.round(posimage.style.top.replace("px", ""));
                    posimage.style.top = (y-getHeight(1)) + "px";
                    $("#postext").get(0).setAttribute("value", `Y: ${getOrigHeight(y)-1}`);
                  });
                  makerem.on("down", () => {
                    if(end) return;
                    let y = Math.round(posimage.style.top.replace("px", ""));
                    posimage.style.top = (y+getHeight(1)) + "px";
                    $("#postext").get(0).setAttribute("value", `Y: ${getOrigHeight(y)+1}`);
                  });
                  $("#visible").click(() => {
                    if(visible){
                      visible = false;
                      $("#visible").get(0).value = "Visible: false"
                    } else {
                      visible = true;
                      $("#visible").get(0).value = "Visible: true"
                    }
                  });
                  $("#finish").click(() => {
                    if(end) return;
                    end = true;
                    let json = {};
                    if(fs.existsSync(path.join(tfolder, "ui", "UI.json"))) json = JSON.parse(fs.readFileSync(path.join(tfolder, "ui", "UI.json"), "utf8"));
                    let x = getOrigWidth(Math.round(posimage.style.left.replace("px", "")));
                    let y = getOrigHeight(Math.round(posimage.style.top.replace("px", "")));
                    if(json.languages_menu  == undefined) json.languages_menu = {};
                    if(json.languages_menu.info_text  == undefined) json.languages_menu.info_text = {};
                    json.languages_menu.info_text.y = y
                    json.languages_menu.info_text.visible = visible
                    fs.writeFileSync(path.join(tfolder, "ui", "UI.json"), JSON.stringify(json, null, 2), (err)=>{if(err) throw err});
                    uijson = InitializeUIJson(json);
                    $("#pos").remove();
                  });
                } else if(id == "languages_menu_languages_menu_item"){
                  let end = false;
                  let visible = uijson["languages_menu"]["languages_menu_item"]["visible"] == "visible";
                  $("#maker").append(`<div id="pos" style="background-color: #424242;z-index:150;position:absolute;top:0;left:0;overflow:hidden;width:${getWidth(1280)};height:${getHeight(720)};"><input type="button" id="postext" style="background-color:#525252;z-index:115;color:#e1e1e1;font-family:'uLaunch';font-size: ${getWidth(20)};padding: ${getHeight(5)}px ${getWidth(10)}px 0px ${getWidth(10)}px;border: ${getHeight(2)}px #323232;border-bottom-left-radius:${getHeight(10)}px;border-bottom-right-radius:${getHeight(10)}px;position:absolute;top:0;left:50%;transform:translate(-50%)" value="X: ${uijson["languages_menu"]["languages_menu_item"]["x"]} | Y: ${uijson["languages_menu"]["languages_menu_item"]["y"]}"/><div style="position: relative;top: ${getHeight(uijson["languages_menu"]["languages_menu_item"]["y"])}; left: ${getWidth(uijson["languages_menu"]["languages_menu_item"]["x"])};width: ${getWidth(880)};height:${getHeight(400)};overflow-x: hidden;overflow-y: auto;margin: 0px 0px;padding: 0px" type="button" id="posimage"><input type="button" style="position:absolute;top:0;left:0;z-index: 0;width: ${getWidth(880)};height:${getHeight(100)};outline:none;border: none;background-color:${uijson["menu_focus_color"]};"/><input type="button" style="position:absolute;top:${getHeight(100)};left:0;z-index: 0;width: ${getWidth(880)};height:${getHeight(100)};outline:none;border: none;background-color:${uijson["menu_bg_color"]};"/><input type="button" style="position:absolute;top:${getHeight(200)};left:0;z-index: 0;width: ${getWidth(880)};height:${getHeight(100)};outline:none;border: none;background-color:${uijson["menu_bg_color"]};"/><input type="button" style="position:absolute;top:${getHeight(300)};left:0;z-index: 0;width: ${getWidth(880)};height:${getHeight(100)};outline:none;border: none;background-color:${uijson["menu_bg_color"]};"/></div><input type="button" style="position:absolute;bottom:${getHeight(5)};z-index:101;right:${getWidth(5)};background-color: #828282;cursor: pointer;border: none;border-radius: ${getHeight(10)}px;color: #f5f6fa;z-index: 115;outline: none;text-align:center;padding: ${getHeight(10)}px ${getWidth(10)}px;font-weight:bold;font-size: ${getWidth(20)};" id="finish" value="Finish"/><input type="button" style="position:absolute;bottom:${getHeight(5)};z-index:101;left:${getWidth(5)};background-color: #828282;cursor: pointer;border: none;border-radius: ${getHeight(10)}px;color: #f5f6fa;z-index: 115;outline: none;text-align:center;padding: ${getHeight(10)}px ${getWidth(10)}px;font-weight:bold;font-size: ${getWidth(20)};" id="visible" value="Visible: ${visible}"/></div>`)
                  let posimage = document.getElementById("posimage");
                  let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
                  posimage.onmousedown = (e) => {
                    pos3 = e.clientX;
                    pos4 = e.clientY;
                    e.preventDefault();
                    document.onmouseup = () => {
                      document.onmouseup = null;
                      document.onmousemove = null;
                    };
                    document.onmousemove = (e) => {
                      e.preventDefault();
                      pos1 = pos3 - e.clientX;
                      pos2 = pos4 - e.clientY;
                      pos3 = e.clientX;
                      pos4 = e.clientY;
                      posimage.style.top = Math.round((posimage.offsetTop - pos2)) + "px";
                      posimage.style.left = Math.round((posimage.offsetLeft - pos1)) + "px";
                      $("#postext").get(0).setAttribute("value", `X: ${getOrigWidth(Math.round((posimage.offsetLeft - pos1)))} | Y: ${getOrigHeight(Math.round((posimage.offsetTop - pos2)))}`);
                    };
                  }
                  makerem.on("up", () => {
                    if(end) return;
                    let y = Math.round(posimage.style.top.replace("px", ""));
                    let x = Math.round(posimage.style.left.replace("px", ""));
                    posimage.style.top = (y-getHeight(1)) + "px";
                    $("#postext").get(0).setAttribute("value", `X: ${getOrigWidth(x)} | Y: ${getOrigHeight(y)-1}`);
                  });
                  makerem.on("down", () => {
                    if(end) return;
                    let y = Math.round(posimage.style.top.replace("px", ""));
                    let x = Math.round(posimage.style.left.replace("px", ""));
                    posimage.style.top = (y+getHeight(1)) + "px";
                    $("#postext").get(0).setAttribute("value", `X: ${getOrigWidth(x)} | Y: ${getOrigHeight(y)+1}`);
                  });
                  makerem.on("left", () => {
                    if(end) return;
                    let y = Math.round(posimage.style.top.replace("px", ""));
                    let x = Math.round(posimage.style.left.replace("px", ""));
                    posimage.style.left = (x-getWidth(1)) + "px";
                    $("#postext").get(0).setAttribute("value", `X: ${getOrigWidth(x)-1} | Y: ${getOrigHeight(y)}`);
                  });
                  makerem.on("right", () => {
                    if(end) return;
                    let y = Math.round(posimage.style.top.replace("px", ""));
                    let x = Math.round(posimage.style.left.replace("px", ""));
                    posimage.style.left = (x+getWidth(1)) + "px";
                    $("#postext").get(0).setAttribute("value", `X: ${getOrigWidth(x)+1} | Y: ${getOrigHeight(y)}`);
                  });
                  $("#visible").click(() => {
                    if(visible){
                      visible = false;
                      $("#visible").get(0).value = "Visible: false"
                    } else {
                      visible = true;
                      $("#visible").get(0).value = "Visible: true"
                    }
                  });
                  $("#finish").click(() => {
                    if(end) return;
                    end = true;
                    let json = {};
                    if(fs.existsSync(path.join(tfolder, "ui", "UI.json"))) json = JSON.parse(fs.readFileSync(path.join(tfolder, "ui", "UI.json"), "utf8"));
                    let x = getOrigWidth(Math.round(posimage.style.left.replace("px", "")));
                    let y = getOrigHeight(Math.round(posimage.style.top.replace("px", "")));
                    if(json.languages_menu  == undefined) json.languages_menu = {};
                    if(json.languages_menu.languages_menu_item  == undefined) json.languages_menu.languages_menu_item = {};
                    json.languages_menu.languages_menu_item.x = x
                    json.languages_menu.languages_menu_item.y = y
                    json.languages_menu.languages_menu_item.visible = visible
                    fs.writeFileSync(path.join(tfolder, "ui", "UI.json"), JSON.stringify(json, null, 2), (err)=>{if(err) throw err});
                    uijson = InitializeUIJson(json);
                    $("#pos").remove();
                  });
                } else if(id == "settings_menu_info_text"){
                  let end = false;
                  let visible = uijson["settings_menu"]["info_text"]["visible"] == "visible";
                  $("#maker").append(`<div id="pos" style="background-color: #424242;z-index:150;position:absolute;top:0;left:0;overflow:hidden;width:${getWidth(1280)};height:${getHeight(720)};"><input type="button" id="postext" style="background-color:#525252;z-index:115;color:#e1e1e1;font-family:'uLaunch';font-size: ${getWidth(20)};padding: ${getHeight(5)}px ${getWidth(10)}px 0px ${getWidth(10)}px;border: ${getHeight(2)}px #323232;border-bottom-left-radius:${getHeight(10)}px;border-bottom-right-radius:${getHeight(10)}px;position:absolute;top:0;left:50%;transform:translate(-50%)" value="Y: ${uijson["settings_menu"]["info_text"]["y"]}"/><p style="position:relative;top:${getHeight(uijson["settings_menu"]["info_text"]["y"])};margin:0;padding:0;left:50%;transform:translate(-50%);text-align:center;width:${getWidth(1280)};font-size: ${getWidth(25)}" id="posimage">${lang["set_info_text"]}</p><input type="button" style="position:absolute;bottom:${getHeight(5)};z-index:101;right:${getWidth(5)};background-color: #828282;cursor: pointer;border: none;border-radius: ${getHeight(10)}px;color: #f5f6fa;z-index: 115;outline: none;text-align:center;padding: ${getHeight(10)}px ${getWidth(10)}px;font-weight:bold;font-size: ${getWidth(20)};" id="finish" value="Finish"/><input type="button" style="position:absolute;bottom:${getHeight(5)};z-index:101;left:${getWidth(5)};background-color: #828282;cursor: pointer;border: none;border-radius: ${getHeight(10)}px;color: #f5f6fa;z-index: 115;outline: none;text-align:center;padding: ${getHeight(10)}px ${getWidth(10)}px;font-weight:bold;font-size: ${getWidth(20)};" id="visible" value="Visible: ${visible}"/></div>`)
                  let posimage = document.getElementById("posimage");
                  let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
                  posimage.onmousedown = (e) => {
                    pos3 = e.clientX;
                    pos4 = e.clientY;
                    e.preventDefault();
                    document.onmouseup = () => {
                      document.onmouseup = null;
                      document.onmousemove = null;
                    };
                    document.onmousemove = (e) => {
                      e.preventDefault();
                      pos1 = pos3 - e.clientX;
                      pos2 = pos4 - e.clientY;
                      pos3 = e.clientX;
                      pos4 = e.clientY;
                      posimage.style.top = Math.round((posimage.offsetTop - pos2)) + "px";
                      $("#postext").get(0).setAttribute("value", `Y: ${getOrigHeight(Math.round((posimage.offsetTop - pos2)))}`);
                    };
                  }
                  makerem.on("up", () => {
                    if(end) return;
                    let y = Math.round(posimage.style.top.replace("px", ""));
                    posimage.style.top = (y-getHeight(1)) + "px";
                    $("#postext").get(0).setAttribute("value", `Y: ${getOrigHeight(y)-1}`);
                  });
                  makerem.on("down", () => {
                    if(end) return;
                    let y = Math.round(posimage.style.top.replace("px", ""));
                    posimage.style.top = (y+getHeight(1)) + "px";
                    $("#postext").get(0).setAttribute("value", `Y: ${getOrigHeight(y)+1}`);
                  });
                  $("#visible").click(() => {
                    if(visible){
                      visible = false;
                      $("#visible").get(0).value = "Visible: false"
                    } else {
                      visible = true;
                      $("#visible").get(0).value = "Visible: true"
                    }
                  });
                  $("#finish").click(() => {
                    if(end) return;
                    end = true;
                    let json = {};
                    if(fs.existsSync(path.join(tfolder, "ui", "UI.json"))) json = JSON.parse(fs.readFileSync(path.join(tfolder, "ui", "UI.json"), "utf8"));
                    let x = getOrigWidth(Math.round(posimage.style.left.replace("px", "")));
                    let y = getOrigHeight(Math.round(posimage.style.top.replace("px", "")));
                    if(json.settings_menu  == undefined) json.settings_menu = {};
                    if(json.settings_menu.info_text  == undefined) json.settings_menu.info_text = {};
                    json.settings_menu.info_text.y = y
                    json.settings_menu.info_text.visible = visible
                    fs.writeFileSync(path.join(tfolder, "ui", "UI.json"), JSON.stringify(json, null, 2), (err)=>{if(err) throw err});
                    uijson = InitializeUIJson(json);
                    $("#pos").remove();
                  });
                } else if(id == "settings_menu_settings_menu_item"){
                  let end = false;
                  let visible = uijson["settings_menu"]["settings_menu_item"]["visible"] == "visible";
                  $("#maker").append(`<div id="pos" style="background-color: #424242;z-index:150;position:absolute;top:0;left:0;overflow:hidden;width:${getWidth(1280)};height:${getHeight(720)};"><input type="button" id="postext" style="background-color:#525252;z-index:115;color:#e1e1e1;font-family:'uLaunch';font-size: ${getWidth(20)};padding: ${getHeight(5)}px ${getWidth(10)}px 0px ${getWidth(10)}px;border: ${getHeight(2)}px #323232;border-bottom-left-radius:${getHeight(10)}px;border-bottom-right-radius:${getHeight(10)}px;position:absolute;top:0;left:50%;transform:translate(-50%)" value="X: ${uijson["settings_menu"]["settings_menu_item"]["x"]} | Y: ${uijson["settings_menu"]["settings_menu_item"]["y"]}"/><div style="position: relative;top: ${getHeight(uijson["settings_menu"]["settings_menu_item"]["y"])}; left: ${getWidth(uijson["settings_menu"]["settings_menu_item"]["x"])};width: ${getWidth(880)};height:${getHeight(400)};overflow-x: hidden;overflow-y: auto;margin: 0px 0px;padding: 0px" type="button" id="posimage"><input type="button" style="position:absolute;top:0;left:0;z-index: 0;width: ${getWidth(880)};height:${getHeight(100)};outline:none;border: none;background-color:${uijson["menu_focus_color"]};"/><input type="button" style="position:absolute;top:${getHeight(100)};left:0;z-index: 0;width: ${getWidth(880)};height:${getHeight(100)};outline:none;border: none;background-color:${uijson["menu_bg_color"]};"/><input type="button" style="position:absolute;top:${getHeight(200)};left:0;z-index: 0;width: ${getWidth(880)};height:${getHeight(100)};outline:none;border: none;background-color:${uijson["menu_bg_color"]};"/><input type="button" style="position:absolute;top:${getHeight(300)};left:0;z-index: 0;width: ${getWidth(880)};height:${getHeight(100)};outline:none;border: none;background-color:${uijson["menu_bg_color"]};"/></div><input type="button" style="position:absolute;bottom:${getHeight(5)};z-index:101;right:${getWidth(5)};background-color: #828282;cursor: pointer;border: none;border-radius: ${getHeight(10)}px;color: #f5f6fa;z-index: 115;outline: none;text-align:center;padding: ${getHeight(10)}px ${getWidth(10)}px;font-weight:bold;font-size: ${getWidth(20)};" id="finish" value="Finish"/><input type="button" style="position:absolute;bottom:${getHeight(5)};z-index:101;left:${getWidth(5)};background-color: #828282;cursor: pointer;border: none;border-radius: ${getHeight(10)}px;color: #f5f6fa;z-index: 115;outline: none;text-align:center;padding: ${getHeight(10)}px ${getWidth(10)}px;font-weight:bold;font-size: ${getWidth(20)};" id="visible" value="Visible: ${visible}"/></div>`)
                  let posimage = document.getElementById("posimage");
                  let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
                  posimage.onmousedown = (e) => {
                    pos3 = e.clientX;
                    pos4 = e.clientY;
                    e.preventDefault();
                    document.onmouseup = () => {
                      document.onmouseup = null;
                      document.onmousemove = null;
                    };
                    document.onmousemove = (e) => {
                      e.preventDefault();
                      pos1 = pos3 - e.clientX;
                      pos2 = pos4 - e.clientY;
                      pos3 = e.clientX;
                      pos4 = e.clientY;
                      posimage.style.top = Math.round((posimage.offsetTop - pos2)) + "px";
                      posimage.style.left = Math.round((posimage.offsetLeft - pos1)) + "px";
                      $("#postext").get(0).setAttribute("value", `X: ${getOrigWidth(Math.round((posimage.offsetLeft - pos1)))} | Y: ${getOrigHeight(Math.round((posimage.offsetTop - pos2)))}`);
                    };
                  }
                  makerem.on("up", () => {
                    if(end) return;
                    let y = Math.round(posimage.style.top.replace("px", ""));
                    let x = Math.round(posimage.style.left.replace("px", ""));
                    posimage.style.top = (y-getHeight(1)) + "px";
                    $("#postext").get(0).setAttribute("value", `X: ${getOrigWidth(x)} | Y: ${getOrigHeight(y)-1}`);
                  });
                  makerem.on("down", () => {
                    if(end) return;
                    let y = Math.round(posimage.style.top.replace("px", ""));
                    let x = Math.round(posimage.style.left.replace("px", ""));
                    posimage.style.top = (y+getHeight(1)) + "px";
                    $("#postext").get(0).setAttribute("value", `X: ${getOrigWidth(x)} | Y: ${getOrigHeight(y)+1}`);
                  });
                  makerem.on("left", () => {
                    if(end) return;
                    let y = Math.round(posimage.style.top.replace("px", ""));
                    let x = Math.round(posimage.style.left.replace("px", ""));
                    posimage.style.left = (x-getWidth(1)) + "px";
                    $("#postext").get(0).setAttribute("value", `X: ${getOrigWidth(x)-1} | Y: ${getOrigHeight(y)}`);
                  });
                  makerem.on("right", () => {
                    if(end) return;
                    let y = Math.round(posimage.style.top.replace("px", ""));
                    let x = Math.round(posimage.style.left.replace("px", ""));
                    posimage.style.left = (x+getWidth(1)) + "px";
                    $("#postext").get(0).setAttribute("value", `X: ${getOrigWidth(x)+1} | Y: ${getOrigHeight(y)}`);
                  });
                  $("#visible").click(() => {
                    if(visible){
                      visible = false;
                      $("#visible").get(0).value = "Visible: false"
                    } else {
                      visible = true;
                      $("#visible").get(0).value = "Visible: true"
                    }
                  });
                  $("#finish").click(() => {
                    if(end) return;
                    end = true;
                    let json = {};
                    if(fs.existsSync(path.join(tfolder, "ui", "UI.json"))) json = JSON.parse(fs.readFileSync(path.join(tfolder, "ui", "UI.json"), "utf8"));
                    let x = getOrigWidth(Math.round(posimage.style.left.replace("px", "")));
                    let y = getOrigHeight(Math.round(posimage.style.top.replace("px", "")));
                    if(json.settings_menu  == undefined) json.settings_menu = {};
                    if(json.settings_menu.settings_menu_item  == undefined) json.settings_menu.settings_menu_item = {};
                    json.settings_menu.settings_menu_item.x = x
                    json.settings_menu.settings_menu_item.y = y
                    json.settings_menu.settings_menu_item.visible = visible
                    fs.writeFileSync(path.join(tfolder, "ui", "UI.json"), JSON.stringify(json, null, 2), (err)=>{if(err) throw err});
                    uijson = InitializeUIJson(json);
                    $("#pos").remove();
                  });
                }
                function getcolorui(ui, name){
                  let end = false;
                  let color = uijson[ui];
                  let r = parseInt(color.substring(1, 3), 16);
                  let g = parseInt(color.substring(3, 5), 16);
                  let b = parseInt(color.substring(5, 7), 16);
                  let a = parseInt(color.substring(7, 9), 16);
                  $("#maker").append(`<div id="divcreate" style="background-color: #3232328F;z-index:110;position:absolute;top:0;left:0;width:${getWidth(1280)};height:${getHeight(720)};"><input type="button" style="background-color: transparent;border:none;outline:none;width:${getWidth(1280)};height:${getHeight(720)};z-index:111;position:absolute;top:0;left:0" id="areturn"/><div style="background-color:${color};z-index:112;border:none;border-radius:${getHeight(25)}px;position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:${getWidth(780)};height:${getWidth(355)}" id="createtheme"><p style="position:absolute;top:${getHeight(40)};left:0;font-size:${getWidth(40)};margin:0 0;width:${getWidth(780)};text-align:center" id="tcolor">${name}</p><input type="range" min="0" max="255" value="${r}" class="r" oninput="makerem.emit('r', this);" id="ri"><p style="position:absolute;top:${getHeight(120)};left:88%;transform:translate(-12%);font-size:${getWidth(30)};margin:0 0;text-align:center" id="rtxt">${r}</p><input type="range" min="0" max="255" value="${g}" class="g" oninput="makerem.emit('g', this);" id="gi"><p style="position:absolute;top:${getHeight(170)};left:88%;transform:translate(-12%);font-size:${getWidth(30)};margin:0 0;text-align:center" id="gtxt">${g}</p><input type="range" min="0" max="255" value="${b}" class="b" oninput="makerem.emit('b', this);" id="bi"><p style="position:absolute;top:${getHeight(220)};left:88%;transform:translate(-12%);font-size:${getWidth(30)};margin:0 0;text-align:center" id="btxt">${b}</p><input type="range" min="0" max="255" value="${a}" class="a" oninput="makerem.emit('a', this);" id="ai"><p style="position:absolute;top:${getHeight(270)};left:88%;transform:translate(-12%);font-size:${getWidth(30)};margin:0 0;text-align:center" id="atxt">${a}</p></div></div>`);
                  $("#ri").get(0).style.background = 'linear-gradient(to right, #ff0000 0%, #ff0000 ' + getperc(r) + '%, #a1a1a1 ' + getperc(r) + '%, #a1a1a1 100%)';
                  $("#gi").get(0).style.background = 'linear-gradient(to right, #00ff00 0%, #00ff00 ' + getperc(g) + '%, #a1a1a1 ' + getperc(g) + '%, #a1a1a1 100%)';
                  $("#bi").get(0).style.background = 'linear-gradient(to right, #0000ff 0%, #0000ff ' + getperc(b) + '%, #a1a1a1 ' + getperc(b) + '%, #a1a1a1 100%)';
                  tcolor();
                  function getperc(n){
                    n = parseInt(n);
                    return (n*100)/255
                  }
                  function dth(number){
                    if(number < 0){
                      number = 0xFFFFFFFF + number + 1;
                    }
                    number = number.toString(16);
                    if(number.length == 1){
                      number = "0"+number;
                    }
                    return number;
                  }
                  function tcolor(){
                    let lum = 16-parseInt((Math.floor((r+b+g)/3)/255)*16)+((255-a)/255)*16;
                    if(lum > 16) lum = 16;
                    lum = parseInt(lum);
                    lum = dth(lum);
                    if(lum == "10") lum = "f";
                    if(lum != "10") lum = lum.substring(1);
                    $("#rtxt").get(0).style.color = `#${lum}${lum}${lum}`;
                    $("#gtxt").get(0).style.color = `#${lum}${lum}${lum}`;
                    $("#btxt").get(0).style.color = `#${lum}${lum}${lum}`;
                    $("#atxt").get(0).style.color = `#${lum}${lum}${lum}`;
                    $("#tcolor").get(0).style.color = `#${lum}${lum}${lum}`;
                  }
                  makerem.on("r", (elem) => {
                    if(end) return;
                    elem.style.background = 'linear-gradient(to right, #ff0000 0%, #ff0000 ' + getperc(elem.value) + '%, #a1a1a1 ' + getperc(elem.value) + '%, #a1a1a1 100%)';
                    r = parseInt(elem.value);
                    $("#rtxt").get(0).innerHTML = elem.value;
                    $("#createtheme").get(0).style.background = `#${dth(r)}${dth(g)}${dth(b)}${dth(a)}`;
                    tcolor();
                    set();
                  });
                  makerem.on("g", (elem) => {
                    if(end) return;
                    elem.style.background = 'linear-gradient(to right, #00ff00 0%, #00ff00 ' + getperc(elem.value) + '%, #a1a1a1 ' + getperc(elem.value) + '%, #a1a1a1 100%)';
                    g = parseInt(elem.value);
                    $("#gtxt").get(0).innerHTML = elem.value;
                    $("#createtheme").get(0).style.background = `#${dth(r)}${dth(g)}${dth(b)}${dth(a)}`;
                    tcolor();
                    set();
                  });
                  makerem.on("b", (elem) => {
                    if(end) return;
                    elem.style.background = 'linear-gradient(to right, #0000ff 0%, #0000ff ' + getperc(elem.value) + '%, #a1a1a1 ' + getperc(elem.value) + '%, #a1a1a1 100%)';
                    b = parseInt(elem.value);
                    $("#btxt").get(0).innerHTML = elem.value;
                    $("#createtheme").get(0).style.background = `#${dth(r)}${dth(g)}${dth(b)}${dth(a)}`;
                    tcolor();
                    set();
                  });
                  makerem.on("a", (elem) => {
                    if(end) return;
                    a = parseInt(elem.value);
                    $("#atxt").get(0).innerHTML = elem.value;
                    $("#createtheme").get(0).style.background = `#${dth(r)}${dth(g)}${dth(b)}${dth(a)}`;
                    tcolor();
                    set();
                  });
                  $("#areturn").click(() => {
                    if(end) return;
                    end = true;
                    $("#divcreate").remove();
                  });
                  function set(){
                    let json = {};
                    if(fs.existsSync(path.join(tfolder, "ui", "UI.json"))) json = JSON.parse(fs.readFileSync(path.join(tfolder, "ui", "UI.json"), "utf8"));
                    json[ui] = `#${dth(r)}${dth(g)}${dth(b)}${dth(a)}`;
                    fs.writeFileSync(path.join(tfolder, "ui", "UI.json"), JSON.stringify(json, null, 2), (err)=>{if(err) throw err});
                    uijson = InitializeUIJson(json);
                  }
                }
              });
            }
          } else {
            let icon = `<p style="position:absolute;top:0;width:${getWidth(1280)};text-align:center;font-size:${getWidth(25)}">You don't seem to have an icon for your theme</p>`;
            if(fs.existsSync(path.join(tfolder, "theme", "Icon.png"))){
              icon = `<img width="${getWidth(100)}" height="${getHeight(100)}" style="position:absolute;top:0;left:50%;transform:translate(-50%)" src="data:image/png;base64,${fs.readFileSync(path.join(tfolder, "theme", "Icon.png")).toString("base64")}">`
            }
            $("#maker").append(`<div id="elem" style="background-color: #424242;z-index:99;position:absolute;top:0;left:0;overflow:hidden;width:${getWidth(1280)};height:${getHeight(720)};"><div id="elemm" style="background-color: #424242;position:absolute;top:50%;left:50%;z-index:100;transform:translate(-50%, -50%);overflow-y:normal;overflow-x:hidden;width:${getWidth(1260)};height:${getHeight(700)};"><p style="position:absolute;top:${getHeight(30)};left:50%;transform:translate(-50%);z-index:101;font-size:${getWidth(50)};width:${getWidth(1260)};margin:0 0;text-align:center;">Icon</p><div style="position:absolute;top:${getHeight(105)};width:${getWidth(1280)};height:${getWidth(100)};left:${getWidth(-10)}" id="icondiv">${icon}</div></div><input type="button" style="position:absolute;bottom:${getHeight(5)};z-index:101;left:${getWidth(5)};background-color: #828282;cursor: pointer;border: none;border-radius: ${getHeight(10)}px;color: #f5f6fa;outline: none;text-align:center;padding: ${getHeight(10)}px ${getWidth(10)}px;font-weight:bold;font-size: ${getWidth(20)};" id="ereturn" value="Return"/></div>`);
            $("#elemm").append(`<center><div style="position:absolute;top:${getHeight(105)+icondiv.clientHeight+getHeight(20)};left:${getWidth(-10)};width:${getWidth(1280)};overflow-y:normal;overflow-x:hidden" id="button"><input type="button" style="background-color: #828282;cursor: pointer;border: none;border-radius: ${getHeight(10)}px;color: #f5f6fa;outline: none;text-align:center;padding: ${getHeight(10)}px ${getWidth(10)}px;font-weight:bold;font-size: ${getWidth(20)};margin-bottom:${getHeight(5)}" id="select" value="Select an Icon File"/><input type="button" style="background-color: #828282;cursor: pointer;border: none;border-radius: ${getHeight(10)}px;color: #f5f6fa;outline: none;text-align:center;padding: ${getHeight(10)}px ${getWidth(10)}px;font-weight:bold;font-size: ${getWidth(20)};margin-bottom:${getHeight(5)};margin-left:${getWidth(10)}" id="deleteicon" value="Delete Icon"/></div></center>`)
            $("#select").click(() => {
              let file = dialog.showOpenDialogSync({filters:[{name:"*",extensions: ['png'] }],properties:['openFile']});
              if(file == undefined) return;
              file = file[0];
              let blob = `data:image/png;base64,${fs.readFileSync(file).toString("base64")}`;
              $("#icondiv").get(0).innerHTML = `<img width="${getWidth(100)}" height="${getHeight(100)}" style="position:absolute;top:0;left:50%;transform:translate(-50%)" src="${blob}">`
              fs.writeFileSync(path.join(tfolder, "theme", `Icon.png`), fs.readFileSync(file), function(err){if(err) throw err});
            });
            $("#deleteicon").click(() => {
              if(fs.existsSync(path.join(tfolder, "theme", "Icon.png"))){
                fs.unlinkSync(path.join(tfolder, "theme", "Icon.png"));
                $("#icondiv").get(0).innerHTML = `<p style="position:absolute;top:0;width:${getWidth(1280)};text-align:center;font-size:${getWidth(25)}">You don't seem to have an icon for your theme</p>`;
              }
            });
            $("#ereturn").click(() => {
              $("#elem").remove();
            });
          }
        } else {
          let font = fs.readFileSync(existsUI("Font.ttf", defaultui, romfsui)).toString("base64");
          $("#maker").append(ejs.render(fs.readFileSync(path.join(__dirname, "ulaunch", "maker", "font.ejs"), "utf8"), {font}));
          $("#ereturn").click(() => {
            $("#elem").remove();
          });
          $("#select").click(() => {
            let file = dialog.showOpenDialogSync({filters:[{name: "*",extensions: ['ttf']}],properties:['openFile']});
            if(file == undefined) return;
            file = file[0];
            fs.writeFileSync(path.join(tfolder, "ui", `Font.ttf`), fs.readFileSync(file), function(err){if(err) throw err});
            $("#preview").get(0).innerHTML = `@font-face {font-family: 'Preview';font-style: normal;src: url('data:font/ttf;base64,${fs.readFileSync(existsUI("Font.ttf", defaultui, romfsui)).toString("base64")}');}`
          });
        }
      } else {
        if(val == "BGM"){
          let bgm = path.join(tfolder, "sound", "BGM.mp3");
          let bgmblob = "";
          if(fs.existsSync(bgm)){
            bgmblob = `data:audio/mpeg;base64,${fs.readFileSync(bgm).toString("base64")}`
          }
          $("#maker").append(`<div id="elem" style="background-color: #424242;z-index:99;position:absolute;top:0;left:0;overflow:hidden;width:${getWidth(1280)};height:${getHeight(720)};"><div id="elemm" style="background-color: #424242;position:absolute;top:50%;left:50%;z-index:100;transform:translate(-50%, -50%);overflow-y:normal;overflow-x:hidden;width:${getWidth(1260)};height:${getHeight(700)};"><p style="position:absolute;top:${getHeight(30)};left:50%;transform:translate(-50%);z-index:101;font-size:${getWidth(50)};width:${getWidth(1260)};margin:0 0;text-align:center;">BGM</p><audio controls="" autoplay="" name="audio" id="audio" style="position:absolute;outline:none;top:${getHeight(105)};left:50%;transform:translate(-50%)"><source id="audiosrc" src="${bgmblob}""></audio></div><input type="button" style="position:absolute;bottom:${getHeight(5)};z-index:101;left:${getWidth(5)};background-color: #828282;cursor: pointer;border: none;border-radius: ${getHeight(10)}px;color: #f5f6fa;outline: none;text-align:center;padding: ${getHeight(10)}px ${getWidth(10)}px;font-weight:bold;font-size: ${getWidth(20)};" id="ereturn" value="Return"/></div>`);
          let audio = $("#audio").get(0);
          $("#elemm").append(`<center><div style="position:absolute;top:${getHeight(105)+audio.clientHeight+getHeight(20)};left:${getWidth(-10)};width:${getWidth(1280)};overflow-y:normal;overflow-x:hidden" id="button"><input type="button" style="background-color: #828282;cursor: pointer;border: none;border-radius: ${getHeight(10)}px;color: #f5f6fa;outline: none;text-align:center;padding: ${getHeight(10)}px ${getWidth(10)}px;font-weight:bold;font-size: ${getWidth(20)};margin-bottom:${getHeight(5)}" id="select" value="Select an MP3 File"/><input type="button" style="background-color: #828282;cursor: pointer;border: none;border-radius: ${getHeight(10)}px;color: #f5f6fa;outline: none;text-align:center;padding: ${getHeight(10)}px ${getWidth(10)}px;font-weight:bold;font-size: ${getWidth(20)};margin-bottom:${getHeight(5)};margin-left:${getWidth(10)}" id="deletebgm" value="Delete BGM"/><input type="button" style="background-color: #828282;cursor: pointer;border: none;border-radius: ${getHeight(10)}px;color: #f5f6fa;outline: none;text-align:center;padding: ${getHeight(10)}px ${getWidth(10)}px;font-weight:bold;font-size: ${getWidth(20)};margin-bottom:${getHeight(5)};margin-left:${getWidth(10)}" id="bgmjson" value="BGM Json"/></div></center>`)
          $("#select").click(() => {
            if(!fs.existsSync(path.join(tfolder, "sound"))) fs.mkdirSync(path.join(tfolder, "sound"));
            let file = dialog.showOpenDialogSync({filters:[{name:"*",extensions: ['mp3'] }],properties:['openFile']});
            if(file == undefined) return;
            file = file[0];
            let blob = `data:audio/mpeg;base64,${fs.readFileSync(file).toString("base64")}`;
            $("#audiosrc").get(0).src = blob;
            $("#audio").get(0).load();
            fs.writeFileSync(path.join(tfolder, "sound", `BGM.mp3`), fs.readFileSync(file), function(err){if(err) throw err});
          });
          $("#deletebgm").click(() => {
            if(fs.existsSync(path.join(tfolder, "sound", "BGM.mp3"))){
              fs.unlinkSync(path.join(tfolder, "sound", "BGM.mp3"));
              $("#audiosrc").get(0).src = "";
              $("#audio").get(0).load();
            }
          });
          $("#bgmjson").click(() => {
            istyping = true;
            let defbgm = require(path.join(__dirname, "ulaunch", "romFs", "default", "sound", "BGM.json"));
            let bgmjson = defbgm;
            if(fs.existsSync(path.join(tfolder, "sound", "BGM.json"))) bgmjson = JSON.parse(fs.readFileSync(path.join(tfolder, "sound", "BGM.json")));
            if(bgmjson.loop === undefined){
              bgmjson.loop = defbgm.loop;
            } if(bgmjson.fade_in_ms === undefined){
              bgmjson.fade_in_ms = defbgm.fade_in_ms;
            } if(bgmjson.fade_out_ms === undefined){
              bgmjson.fade_out_ms = defbgm.fade_out_ms;
            }
            $("#maker").append(`<div id="divedit" style="background-color: #3232328F;z-index:200;position:absolute;top:0;left:0;width:${getWidth(1280)};height:${getHeight(720)};"><div style="background-color:#626262;border:none;border-radius:${getHeight(50)}px;position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:${getWidth(1180)};height:${getWidth(420)}" id="createtheme"><p style="position:absolute;top:${getHeight(40)};left:0;font-size:${getWidth(40)};margin:0 0;width:${getWidth(1180)};height:${getHeight(620)};text-align:center">Edit BGM Json</p><p style="position:absolute;top:${getHeight(120)};left:${getWidth(50)};font-size:${getWidth(30)};margin:0 0;">Fade In:</p><input type="text" style="position:absolute;left:${getWidth(170)};top:${getHeight(105)};font-family:'uLaunch';width:${getWidth(960)};padding:${getWidth(10)};padding-top:${getHeight(15)};height:${getHeight(60)};border-radius:${getHeight(15)}px;border:none;outline:none;font-size:${getWidth(25)};background-color:#828282;color:#e1e1e1" placeholder="${defbgm.fade_in_ms} (in milliseconds)" value="${(bgmjson.fade_in_ms == defbgm.fade_in_ms) ? "" : bgmjson.fade_in_ms}" id="fadein"/><p style="position:absolute;top:${getHeight(210)};left:${getWidth(50)};font-size:${getWidth(30)};margin:0 0;">Fade Out:</p><input type="text" style="position:absolute;left:${getWidth(197)};top:${getHeight(195)};font-family:'uLaunch';width:${getWidth(933)};padding:${getWidth(10)};padding-top:${getHeight(15)};height:${getHeight(60)};border-radius:${getHeight(15)}px;border:none;outline:none;font-size:${getWidth(25)};background-color:#828282;color:#e1e1e1" placeholder="${defbgm.fade_out_ms} (in milliseconds)" value="${(bgmjson.fade_out_ms == defbgm.fade_out_ms) ? "" : bgmjson.fade_out_ms}" id="fadeout"/><p style="position:absolute;top:${getHeight(300)};left:${getWidth(50)};font-size:${getWidth(30)};margin:0 0;">Loop:</p><input type="button" style="position:absolute;left:${getWidth(150)};top:${getHeight(285)};font-family:'uLaunch';width:${getWidth(980)};cursor:pointer;padding:${getWidth(10)};padding-top:${getHeight(15)};height:${getHeight(60)};border-radius:${getHeight(15)}px;border:none;outline:none;font-size:${getWidth(25)};background-color:#828282;color:#e1e1e1" value="${bgmjson.loop}" id="loopbgm"/><input type="button" style="width:${getWidth(530)};height:${getHeight(35)};border:none;outline:none;border-radius:${getHeight(10)}px;font-family:'uLaunch';font-size:${getWidth(20)};padding-top:${getHeight(7)};cursor:pointer;background-color:#828282;color:#f5f6fa;position:absolute;top:${getHeight(365)};left:${getWidth(50)}" id="editbgmbtn" value="Edit"/><input type="button" style="width:${getWidth(530)};height:${getHeight(35)};border:none;outline:none;border-radius:${getHeight(10)}px;font-family:'uLaunch';font-size:${getWidth(20)};padding-top:${getHeight(7)};cursor:pointer;background-color:#828282;color:#f5f6fa;position:absolute;top:${getHeight(365)};left:${getWidth(600)}" id="cancel" value="Cancel"/></div></div>`);
            $("#loopbgm").click(() => {
              let val = $("#loopbgm").get(0).value;
              if(val == "true"){
                $("#loopbgm").get(0).value = "false";
              } else {
                $("#loopbgm").get(0).value = "true";
              }
            });
            $("#editbgmbtn").click(() => {
              let fade_in_ms = $("#fadein").val().match(/\d+/)[0];
              let fade_out_ms = $("#fadeout").val().match(/\d+/)[0];
              let loop = $("#loopbgm").val() == "true";
              if(fade_in_ms == undefined) fade_in_ms = defbgm.fade_in_ms;
              if(fade_out_ms == undefined) fade_out_ms = defbgm.fade_out_ms;
              let json = {fade_in_ms,fade_out_ms,loop};
              if(!fs.existsSync(path.join(tfolder, "sound"))) fs.mkdirSync(path.join(tfolder, "sound"));
              fs.writeFileSync(path.join(tfolder, "sound", `BGM.json`), JSON.stringify(json, null, 2), function(err){if(err) throw err});
              $("#divedit").remove();
            });
            $("#cancel").click(() => {
              $("#divedit").remove();
            });
          });
          $("#ereturn").click(() => {
            $("#elem").remove();
          });
        } else if(val == "TitleLaunch"){
          let bgm = path.join(tfolder, "sound", "TitleLaunch.wav");
          let bgmblob = "";
          if(fs.existsSync(bgm)){
            bgmblob = `data:audio/wav;base64,${fs.readFileSync(bgm).toString("base64")}`
          }
          $("#maker").append(`<div id="elem" style="background-color: #424242;z-index:99;position:absolute;top:0;left:0;overflow:hidden;width:${getWidth(1280)};height:${getHeight(720)};"><div id="elemm" style="background-color: #424242;position:absolute;top:50%;left:50%;z-index:100;transform:translate(-50%, -50%);overflow-y:normal;overflow-x:hidden;width:${getWidth(1260)};height:${getHeight(700)};"><p style="position:absolute;top:${getHeight(30)};left:50%;transform:translate(-50%);z-index:101;font-size:${getWidth(50)};width:${getWidth(1260)};margin:0 0;text-align:center;">TitleLaunch</p><audio controls="" autoplay="" name="audio" id="audio" style="position:absolute;outline:none;top:${getHeight(105)};left:50%;transform:translate(-50%)"><source id="audiosrc" src="${bgmblob}""></audio></div><input type="button" style="position:absolute;bottom:${getHeight(5)};z-index:101;left:${getWidth(5)};background-color: #828282;cursor: pointer;border: none;border-radius: ${getHeight(10)}px;color: #f5f6fa;outline: none;text-align:center;padding: ${getHeight(10)}px ${getWidth(10)}px;font-weight:bold;font-size: ${getWidth(20)};" id="ereturn" value="Return"/></div>`);
          let audio = $("#audio").get(0);
          $("#elemm").append(`<center><div style="position:absolute;top:${getHeight(105)+audio.clientHeight+getHeight(20)};left:${getWidth(-10)};width:${getWidth(1280)};overflow-y:normal;overflow-x:hidden" id="button"><input type="button" style="background-color: #828282;cursor: pointer;border: none;border-radius: ${getHeight(10)}px;color: #f5f6fa;outline: none;text-align:center;padding: ${getHeight(10)}px ${getWidth(10)}px;font-weight:bold;font-size: ${getWidth(20)};margin-bottom:${getHeight(5)}" id="select" value="Select an WAV File"/><input type="button" style="background-color: #828282;cursor: pointer;border: none;border-radius: ${getHeight(10)}px;color: #f5f6fa;outline: none;text-align:center;padding: ${getHeight(10)}px ${getWidth(10)}px;font-weight:bold;font-size: ${getWidth(20)};margin-bottom:${getHeight(5)};margin-left:${getWidth(10)}" id="deletebgm" value="Delete TitleLaunch"/></div></center>`)
          $("#select").click(() => {
            if(!fs.existsSync(path.join(tfolder, "sound"))) fs.mkdirSync(path.join(tfolder, "sound"));
            let file = dialog.showOpenDialogSync({filters:[{name:"*",extensions: ['wav'] }],properties:['openFile']});
            if(file == undefined) return;
            file = file[0];
            let blob = `data:audio/wav;base64,${fs.readFileSync(file).toString("base64")}`;
            $("#audiosrc").get(0).src = blob;
            $("#audio").get(0).load();
            fs.writeFileSync(path.join(tfolder, "sound", `TitleLaunch.wav`), fs.readFileSync(file), function(err){if(err) throw err});
          });
          $("#deletebgm").click(() => {
            if(fs.existsSync(path.join(tfolder, "sound", "TitleLaunch.wav"))){
              fs.unlinkSync(path.join(tfolder, "sound", "TitleLaunch.wav"));
              $("#audiosrc").get(0).src = "";
              $("#audio").get(0).load();
            }
          });
          $("#ereturn").click(() => {
            $("#elem").remove();
          });
        } else if(val == "MenuToggle"){
          let bgm = path.join(tfolder, "sound", "MenuToggle.wav");
          let bgmblob = "";
          if(fs.existsSync(bgm)){
            bgmblob = `data:audio/wav;base64,${fs.readFileSync(bgm).toString("base64")}`
          }
          $("#maker").append(`<div id="elem" style="background-color: #424242;z-index:99;position:absolute;top:0;left:0;overflow:hidden;width:${getWidth(1280)};height:${getHeight(720)};"><div id="elemm" style="background-color: #424242;position:absolute;top:50%;left:50%;z-index:100;transform:translate(-50%, -50%);overflow-y:normal;overflow-x:hidden;width:${getWidth(1260)};height:${getHeight(700)};"><p style="position:absolute;top:${getHeight(30)};left:50%;transform:translate(-50%);z-index:101;font-size:${getWidth(50)};width:${getWidth(1260)};margin:0 0;text-align:center;">MenuToggle</p><audio controls="" autoplay="" name="audio" id="audio" style="position:absolute;outline:none;top:${getHeight(105)};left:50%;transform:translate(-50%)"><source id="audiosrc" src="${bgmblob}""></audio></div><input type="button" style="position:absolute;bottom:${getHeight(5)};z-index:101;left:${getWidth(5)};background-color: #828282;cursor: pointer;border: none;border-radius: ${getHeight(10)}px;color: #f5f6fa;outline: none;text-align:center;padding: ${getHeight(10)}px ${getWidth(10)}px;font-weight:bold;font-size: ${getWidth(20)};" id="ereturn" value="Return"/></div>`);
          let audio = $("#audio").get(0);
          $("#elemm").append(`<center><div style="position:absolute;top:${getHeight(105)+audio.clientHeight+getHeight(20)};left:${getWidth(-10)};width:${getWidth(1280)};overflow-y:normal;overflow-x:hidden" id="button"><input type="button" style="background-color: #828282;cursor: pointer;border: none;border-radius: ${getHeight(10)}px;color: #f5f6fa;outline: none;text-align:center;padding: ${getHeight(10)}px ${getWidth(10)}px;font-weight:bold;font-size: ${getWidth(20)};margin-bottom:${getHeight(5)}" id="select" value="Select an WAV File"/><input type="button" style="background-color: #828282;cursor: pointer;border: none;border-radius: ${getHeight(10)}px;color: #f5f6fa;outline: none;text-align:center;padding: ${getHeight(10)}px ${getWidth(10)}px;font-weight:bold;font-size: ${getWidth(20)};margin-bottom:${getHeight(5)};margin-left:${getWidth(10)}" id="deletebgm" value="Delete MenuToggle"/></div></center>`)
          $("#select").click(() => {
            if(!fs.existsSync(path.join(tfolder, "sound"))) fs.mkdirSync(path.join(tfolder, "sound"));
            let file = dialog.showOpenDialogSync({filters:[{name:"*",extensions: ['wav'] }],properties:['openFile']});
            if(file == undefined) return;
            file = file[0];
            let blob = `data:audio/wav;base64,${fs.readFileSync(file).toString("base64")}`;
            $("#audiosrc").get(0).src = blob;
            $("#audio").get(0).load();
            fs.writeFileSync(path.join(tfolder, "sound", `MenuToggle.wav`), fs.readFileSync(file), function(err){if(err) throw err});
          });
          $("#deletebgm").click(() => {
            if(fs.existsSync(path.join(tfolder, "sound", "MenuToggle.wav"))){
              fs.unlinkSync(path.join(tfolder, "sound", "MenuToggle.wav"));
              $("#audiosrc").get(0).src = "";
              $("#audio").get(0).load();
            }
          });
          $("#ereturn").click(() => {
            $("#elem").remove();
          });
        }
      }
    });
  });
  $("#return").click(() => {
    if(sound){
      sound.play();
      fadetimeout.resume();
    }
    maker = false;
    $("#maker").hide();
    $("#ulaunchscreen").show();
  });
  switchem.on("home", () => {
    if(!maker) return;
    if(sound){
      sound.play();
      fadetimeout.resume();
    }
    maker = false;
    $("#maker").hide();
    $("#ulaunchscreen").show();
  });
}

function getxy(elem, uijson){
  if(elem === "bannerfolder"){
    return ` | X: ${uijson["main_menu"]["banner_image"]["x"]} | Y: ${uijson["main_menu"]["banner_image"]["y"]}`;
  } else if(elem === "bannerhomebrew"){
    return ` | X: ${uijson["main_menu"]["banner_image"]["x"]} | Y: ${uijson["main_menu"]["banner_image"]["y"]}`;
  } else if(elem === "bannerinstalled"){
    return ` | X: ${uijson["main_menu"]["banner_image"]["x"]} | Y: ${uijson["main_menu"]["banner_image"]["y"]}`;
  } else if(elem === "bannertheme"){
    return ` | X: ${uijson["themes_menu"]["banner_image"]["x"]} | Y: ${uijson["themes_menu"]["banner_image"]["y"]}`;
  } else if(elem === "batterychargingicon"){
    return ` | X: ${uijson["main_menu"]["battery_icon"]["x"]} | Y: ${uijson["main_menu"]["battery_icon"]["y"]}`;
  } else if(elem === "batterynormalicon"){
    return ` | X: ${uijson["main_menu"]["battery_icon"]["x"]} | Y: ${uijson["main_menu"]["battery_icon"]["y"]}`;
  } else if(elem === "connectionicon"){
    return ` | X: ${uijson["main_menu"]["connection_icon"]["x"]} | Y: ${uijson["main_menu"]["connection_icon"]["y"]}`;
  } else if(elem === "controllericon"){
    return ` | X: ${uijson["main_menu"]["controller_icon"]["x"]} | Y: ${uijson["main_menu"]["controller_icon"]["y"]}`;
  } else if(elem === "noconnectionicon"){
    return ` | X: ${uijson["main_menu"]["connection_icon"]["x"]} | Y: ${uijson["main_menu"]["connection_icon"]["y"]}`;
  } else if(elem === "settingsicon"){
    return ` | X: ${uijson["main_menu"]["settings_icon"]["x"]} | Y: ${uijson["main_menu"]["settings_icon"]["y"]}`;
  } else if(elem === "themesicon"){
    return ` | X: ${uijson["main_menu"]["themes_icon"]["x"]} | Y: ${uijson["main_menu"]["themes_icon"]["y"]}`;
  } else if(elem === "toggleclick"){
    return ` | X: ${uijson["main_menu"]["menu_toggle_button"]["x"]} | Y: ${uijson["main_menu"]["menu_toggle_button"]["y"]}`;
  } else if(elem === "topmenu"){
    return ` | X: ${uijson["main_menu"]["top_menu_bg"]["x"]} | Y: ${uijson["main_menu"]["top_menu_bg"]["y"]}`;
  } else {
    return "";
  }
}

function getv(elem, uijson){
  if(elem === "bannerfolder"){
    return uijson["main_menu"]["banner_image"]["visible"] == "visible";
  } else if(elem === "bannerhomebrew"){
    return uijson["main_menu"]["banner_image"]["visible"] == "visible";
  } else if(elem === "bannerinstalled"){
    return uijson["main_menu"]["banner_image"]["visible"] == "visible";
  } else if(elem === "bannertheme"){
    return uijson["themes_menu"]["banner_image"]["visible"] == "visible";
  } else if(elem === "batterychargingicon"){
    return uijson["main_menu"]["battery_icon"]["visible"] == "visible";
  } else if(elem === "batterynormalicon"){
    return uijson["main_menu"]["battery_icon"]["visible"] == "visible";
  } else if(elem === "connectionicon"){
    return uijson["main_menu"]["connection_icon"]["visible"] == "visible";
  } else if(elem === "controllericon"){
    return uijson["main_menu"]["controller_icon"]["visible"] == "visible";
  } else if(elem === "noconnectionicon"){
    return uijson["main_menu"]["connection_icon"]["visible"] == "visible";
  } else if(elem === "settingsicon"){
    return uijson["main_menu"]["settings_icon"]["visible"] == "visible";
  } else if(elem === "themesicon"){
    return uijson["main_menu"]["themes_icon"]["visible"] == "visible";
  } else if(elem === "toggleclick"){
    return uijson["main_menu"]["menu_toggle_button"]["visible"] == "visible";
  } else if(elem === "topmenu"){
    return uijson["main_menu"]["top_menu_bg"]["visible"] == "visible";
  } else {
    return "";
  }
}

function setxy(elem, uijson, x, y, visible){
  if(elem === "bannerfolder"){
    if(uijson["main_menu"] == undefined){
      uijson["main_menu"] = {};
    } if(uijson["main_menu"]["banner_image"] == undefined){
      uijson["main_menu"]["banner_image"] = {};
    } uijson["main_menu"]["banner_image"] = {x,y,visible}
  } else if(elem === "bannerhomebrew"){
    if(uijson["main_menu"] == undefined){
      uijson["main_menu"] = {};
    } if(uijson["main_menu"]["banner_image"] == undefined){
      uijson["main_menu"]["banner_image"] = {};
    } uijson["main_menu"]["banner_image"] = {x,y,visible}
  } else if(elem === "bannerinstalled"){
    if(uijson["main_menu"] == undefined){
      uijson["main_menu"] = {};
    } if(uijson["main_menu"]["banner_image"] == undefined){
      uijson["main_menu"]["banner_image"] = {};
    } uijson["main_menu"]["banner_image"] = {x,y,visible}
  } else if(elem === "bannertheme"){
    if(uijson["themes_menu"] == undefined){
      uijson["themes_menu"] = {};
    } if(uijson["themes_menu"]["banner_image"] == undefined){
      uijson["themes_menu"]["banner_image"] = {};
    } uijson["themes_menu"]["banner_image"] = {x,y,visible}
  } else if(elem === "batterychargingicon"){
    if(uijson["main_menu"] == undefined){
      uijson["main_menu"] = {};
    } if(uijson["main_menu"]["battery_icon"] == undefined){
      uijson["main_menu"]["battery_icon"] = {};
    } uijson["main_menu"]["battery_icon"] = {x,y,visible}
  } else if(elem === "batterynormalicon"){
    if(uijson["main_menu"] == undefined){
      uijson["main_menu"] = {};
    } if(uijson["main_menu"]["battery_icon"] == undefined){
      uijson["main_menu"]["battery_icon"] = {};
    } uijson["main_menu"]["battery_icon"] = {x,y,visible}
  } else if(elem === "connectionicon"){
    if(uijson["main_menu"] == undefined){
      uijson["main_menu"] = {};
    } if(uijson["main_menu"]["connection_icon"] == undefined){
      uijson["main_menu"]["connection_icon"] = {};
    } uijson["main_menu"]["connection_icon"] = {x,y,visible}
  } else if(elem === "controllericon"){
    if(uijson["main_menu"] == undefined){
      uijson["main_menu"] = {};
    } if(uijson["main_menu"]["controller_icon"] == undefined){
      uijson["main_menu"]["controller_icon"] = {};
    } uijson["main_menu"]["controller_icon"] = {x,y,visible}
  } else if(elem === "noconnectionicon"){
    if(uijson["main_menu"] == undefined){
      uijson["main_menu"] = {};
    } if(uijson["main_menu"]["connection_icon"] == undefined){
      uijson["main_menu"]["connection_icon"] = {};
    } uijson["main_menu"]["connection_icon"] = {x,y,visible}
  } else if(elem === "settingsicon"){
    if(uijson["main_menu"] == undefined){
      uijson["main_menu"] = {};
    } if(uijson["main_menu"]["settings_icon"] == undefined){
      uijson["main_menu"]["settings_icon"] = {};
    } uijson["main_menu"]["settings_icon"] = {x,y,visible}
  } else if(elem === "themesicon"){
    if(uijson["main_menu"] == undefined){
      uijson["main_menu"] = {};
    } if(uijson["main_menu"]["themes_icon"] == undefined){
      uijson["main_menu"]["themes_icon"] = {};
    } uijson["main_menu"]["themes_icon"] = {x,y,visible}
  } else if(elem === "toggleclick"){
    if(uijson["main_menu"] == undefined){
      uijson["main_menu"] = {};
    } if(uijson["main_menu"]["menu_toggle_button"] == undefined){
      uijson["main_menu"]["menu_toggle_button"] = {};
    } uijson["main_menu"]["menu_toggle_button"] = {x,y,visible}
  } else if(elem === "topmenu"){
    if(uijson["main_menu"] == undefined){
      uijson["main_menu"] = {};
    } if(uijson["main_menu"]["top_menu_bg"] == undefined){
      uijson["main_menu"]["top_menu_bg"] = {};
    } uijson["main_menu"]["top_menu_bg"] = {x,y,visible}
  }
  return uijson;
}
