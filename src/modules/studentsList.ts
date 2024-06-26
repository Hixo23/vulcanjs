import { Keystore, AccountTools, VulcanHebe } from "vulcan-api-js";
import  * as fs from 'fs'

module.exports = {
  id: "studentslist",
  help: "list all students",
  async run(args: string[]) {
    if (
      !fs.existsSync("./auth/keystore.json") ||
      !fs.existsSync("./auth/account.json")
    )
      return console.log("No account or keystore found, please register first");
    const keystore = new Keystore();
    keystore.loadFromJsonString(
      fs.readFileSync("./auth/keystore.json", { encoding: "utf-8" }),
    );
    const client = new VulcanHebe(
      keystore,
      AccountTools.loadFromJsonString(
        fs.readFileSync("./auth/account.json", { encoding: "utf-8" }),
      ),
    );
    const students = await client.getStudents();
    const studentsMap = students.map(
      (x) => `${x.pupil.firstName} ${x.pupil.surname} | ID: ${x.pupil.id}`,
    );
    console.log(studentsMap.join("\n"));
  },
};
