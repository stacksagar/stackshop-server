function WordsFirstLetterUC(text) {
  const words = [];
  text
    ?.trim()
    .split(" ")
    .map((word) => {
      if (word.trim()) {
        words.push(
          word.trim().split("")[0].toUpperCase() + word.trim().substr(1)
        );
      }
    });

  return words.join(" ");
}

module.exports = WordsFirstLetterUC;
