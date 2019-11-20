const fs = require("fs");
function getFiles(dir, files_) {
    files_ = files_ || [];
    if(fs.existsSync(dir)) {
        var files = fs.readdirSync(dir);
        for(var i in files) {
            var name = dir + '/' + files[i];
            if(fs.statSync(name).isDirectory()) {
                getFiles(name, files_);
            }
            else {
                files_.push(name);
            }
        }
    }
    return files_;
}

let files = getFiles("./").map(n => n.split("/").slice(-1)[0]).filter(n => n.endsWith(".png"));

let text = "  let defaulticon = {\n    "
files.map(n => {
  text += `${n.split(".png")[0].toLowerCase()}: existsUI("${n}", defaultui, romfsui),\n    `
});
text = text.substring(0, text.length-2)+"}\n  let size = InitializeSize({\n    ";
files.map(n => {
  text += `${n.split(".png")[0].toLowerCase()}: {w: ${fs.readFileSync(n).readUInt32BE(16)},h: ${fs.readFileSync(n).readUInt32BE(20)}},\n    `
});
text = text.substring(0, text.length-2)+"}, defaulticon, uijson);";

console.log(text);