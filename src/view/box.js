const boxen = require("boxen");

const boxenOptions = {
  padding: 1,
  margin: 1,
  borderStyle: "round",
  borderColor: "green",
  backgroundColor: "#555555"
};

exports.createBox = (message) => boxen(message, boxenOptions)
