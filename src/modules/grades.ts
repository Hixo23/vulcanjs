import { Keystore, AccountTools, VulcanHebe } from "vulcan-api-js";
import { fetchStudent } from "../addons/studentFetch";
import { partialWord } from "../addons/partialWord";
import * as fs from 'fs';
export default {
  id: "grades",
  help: "check if you studied well",
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
    if (!fs.existsSync("./auth/student"))
      return console.log("Student is not selected.");
    await client.selectStudent(fetchStudent());
    const grades = await client.getGrades(new Date());

    const subject =
      args.join(" ").charAt(0).toUpperCase() + args.join(" ").slice(1);
    if (!subject) {
      const subjects: string[] = [];
      grades.forEach((g) => {
        // count grades
        const gradeSubject = g.column.subject.name;
        const count = grades.filter(
          (gr) => gr.column.subject.name === gradeSubject,
        ).length;
        if (subjects.includes(`${gradeSubject} - ${count} grades`)) return;
        subjects.push(`${gradeSubject} - ${count} grades`);
      });
      // filter grades from most grades to least
      subjects.sort((a, b) => {
        const numA = parseInt(a.split("-")[1]);
        const numB = parseInt(b.split("-")[1]);
        return numB - numA;
      });
      console.log(`Please select a subject that you want to check grades for:`);
      console.log("Usage: vjs grades <subject>");
      console.log(subjects.join("\n"));
    } else {
      // the rest of grade fetch logic
      const rawSubjects: string[] = [];
      grades.forEach((g) => {
        const gradeSubject = g.column.subject.name;
        if (rawSubjects.includes(gradeSubject)) return;
        rawSubjects.push(gradeSubject);
      });

      const findpartial =
        rawSubjects.find((s) => partialWord(s, subject)) || subject;
      const gradesFromSubject = grades.filter(
        (g) => g.column.subject.name === findpartial,
      );
      if (gradesFromSubject.length === 0)
        return console.log(`No grades found for ${findpartial}`);
      const gradesarray: string[] = [];
      gradesFromSubject.forEach((g) => {
        const gradeString = `${g.column.name || "Unspecified"} | ${g.contentRaw} || W: ${g.column.weight}`;
        gradesarray.push(gradeString);
      });
      // sort the array, best grade to the worst grade, number+ is counted normally, same with number-, the + grades is on the bottom
      gradesarray.sort((a, b) => {
        const unparsedA = a
          .split("|")[1]
          .replace(/\+/g, "_")
          .replace(/\-/g, "_")
          .replace(/\(%)/g, "")
        const unparsedB = b
          .split("|")[1]
          .replace(/\+/g, "_")
          .replace(/\-/g, "_")
          .replace(/\(%)/g, "")
        const parseA = parseFloat(unparsedA);
        const parseB = parseFloat(unparsedB);
        return parseB - parseA;
      });
      console.log(`Grades for ${findpartial}:`);
      console.log(gradesarray.join("\n"));
    }
  },
};
