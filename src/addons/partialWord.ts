export const partialWord = (word: string, search: string) => {
  const lowerCaseWord = word.toLowerCase();
  const lowerCaseSearch = search.toLowerCase();

  if (lowerCaseWord.includes(lowerCaseSearch)) {
    return word;
  } else {
    return null;
  }
};
