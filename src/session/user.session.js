import { userSessions } from './sessions.js';
import User from '../classes/models/user.class.js';
import { updateUserLocation } from '../db/user/user.db.js';

export const addUser = (socket, uuid, playerId, latency) => {
  const user = new User(socket, uuid, playerId, latency);
  userSessions.push(user);
  return user;
};

export const removeUser = async (socket) => {
  const index = userSessions.findIndex((user) => user.socket === socket);
  if (index !== -1) {
    await updateUserLocation(userSessions[index].x, userSessions[index].y, userSessions[index].id);
    return userSessions.splice(index, 1)[0];
  }
};

export const getUserById = (id) => {
  return userSessions.find((user) => user.id === id);
};

export const getUserBySocket = (socket) => {
  return userSessions.find((user) => user.socket === socket);
};

export const getAllUsers = () => {
  return userSessions;
};
