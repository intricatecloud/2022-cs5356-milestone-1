const casual = require("casual");
const fetch = require("node-fetch");

const userFeed = [];

const get = async () => {
  if (userFeed.length === 0) {
    const response = await fetch("https://dog.ceo/api/breeds/image/random/5");
    const body = await response.json();
    for (const dogUrl of body.message) {
      userFeed.push({
        name: casual.full_name,
        nameHandle: `@${casual.username}`,
        message: `${casual.sentence}. ${casual.sentence}`,
        imageSource: dogUrl,
      });
    }
  } else {
    return userFeed;
  }

  return userFeed;
};

const add = async (user, message) => {
  const response = await fetch("https://dog.ceo/api/breeds/image/random/1");
  const body = await response.json();
  const nameExtractor = user.email.split("@");
  userFeed.unshift({
    // name: user.name,
    name: nameExtractor[0],
    nameHandle: user.email,
    message: message,
    imageSource: body.message,
  });
};

module.exports = {
  get,
  add,
};
