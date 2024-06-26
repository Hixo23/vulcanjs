import * as fs from "fs";

export const fetchStudent = () => {
  const studentData = fs.readFileSync("./auth/student", { encoding: "utf-8" });
  if (studentData === "first") {
    return "";
  } else {
    return JSON.parse(studentData);
  }
};
