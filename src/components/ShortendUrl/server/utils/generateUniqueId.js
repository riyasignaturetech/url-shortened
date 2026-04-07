const { nanoid } = require("nanoid");
const Url = require("../models/Url");

module.exports = async () => {
  let shortCode = nanoid(6);
  while (await Url.findOne({ shortCode })) {
    shortCode = nanoid(6);
  }
  return shortCode;
};
