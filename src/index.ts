// menu handler
import * as fs from "fs";

const modules = new Map();

const loadModules = async () => {
  const menuModules = fs
    .readdirSync("./modules")
    .filter((file: any) => file.endsWith(".js"));


  for (const file of menuModules) {
    const files = await import(`./modules/${file}`);
    modules.set(files.id, files);
  }
};

loadModules();
const argv = process.argv.slice(2);

const menu = argv[0];
const args = argv.slice(1);

function execute() {
  const menuData = modules.get(menu);
  if (!menuData) {
    const helpMap = Array.from(modules)
      .map((x) => `	${x[1].id} - ${x[1].help}`)
      .join("\n");
    console.log("vulcanjs - help\n" + helpMap + "\nmade by @realmotylek");
    return;
  }

  menuData.run(args);
}

execute();
