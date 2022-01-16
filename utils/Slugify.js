function Slugify(text) {
  const words = [];
  text
    ?.trim()
    .split(" ")
    .map((word) => {
      if (word.trim()) {
        words.push(word.trim().toLowerCase());
      }
    });

  return words.join("-");
}
module.exports = Slugify;
