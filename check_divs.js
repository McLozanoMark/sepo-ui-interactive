const fs = require("fs");
const html = fs.readFileSync("index.html", "utf8");

const lines = html.split("\n");
let divBalance = 0;
let screenStack = [];

lines.forEach((line, index) => {
  let p = 0;
  while ((p = line.indexOf("<div", p)) !== -1) {
    divBalance++;
    if (line.includes('class="screen')) {
      let id = line.match(/id="([^"]+)"/);
      screenStack.push({
        id: id ? id[1] : "unknown",
        line: index + 1,
        balance: divBalance,
      });
    }
    p += 4;
  }

  p = 0;
  while ((p = line.indexOf("</div", p)) !== -1) {
    if (screenStack.length > 0) {
      const currentScreen = screenStack[screenStack.length - 1];
      if (currentScreen.balance === divBalance) {
        screenStack.pop();
      }
    }
    divBalance--;
    if (divBalance < 0) {
      console.log("Negative balance at line", index + 1);
    }
    p += 5;
  }
});

console.log("Final div balance:", divBalance);
if (screenStack.length > 0) {
  console.log("UNCLOSED SCREENS:", screenStack);
}
