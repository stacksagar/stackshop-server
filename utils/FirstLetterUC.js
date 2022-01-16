const FirstLetterUC = (fullText) => {
  if (fullText) {
    return (
      fullText.split("")[0].toUpperCase() + fullText.substr(1).toLowerCase()
    );
  } else {
    return "";
  }
};

module.exports = FirstLetterUC;
