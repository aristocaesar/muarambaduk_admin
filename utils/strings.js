function ucwords(words) {
  return words
    .split(' ')
    .map((word) => `${word[0].toUpperCase()}${word.slice(1)}`)
    .join(' ');
}

module.exports = {
  ucwords,
};
