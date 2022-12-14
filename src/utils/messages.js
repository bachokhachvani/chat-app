const generateMessage = (text, name) => {
  return {
    text,
    name,
    createdAt: new Date().getTime(),
  };
};
const generateLocationMessage = (url, name) => {
  return { url, name, createdAt: new Date().getTime() };
};

module.exports = {
  generateMessage,
  generateLocationMessage,
};
