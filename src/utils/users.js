const users = [];

//adduser, removeuser, getuser, getusersinroom

const addUser = ({ id, username, room }) => {
  //clean data
  username = username.trim().toLowerCase();
  room = room.trim().toLowerCase();

  //Validate data
  if (!room || !username) {
    return {
      error: "Username and room are required!",
    };
  }

  //check for existing user
  const existingUser = users.find((user) => {
    return user.room === room && user.username === username;
  });

  //validate username
  if (existingUser) {
    return {
      error: "Username is in use!",
    };
  }

  //store user
  const user = { id, username, room };
  users.push(user);
  return { user };
};

const removeUser = (id) => {
  const index = users.findIndex((user) => {
    return user.id === id;
  });
  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

const getUser = (id) => {
  const index = users.findIndex((user) => {
    return user.id === id;
  });
  if (index !== -1) {
    return users[index];
  }
  return undefined;
};

const getUsersRoom = (room) => {
  const usersRoom = users.filter((user) => {
    return user.room === room;
  });
  return usersRoom;
};

module.exports = {
  addUser,
  getUser,
  removeUser,
  getUsersRoom,
};
