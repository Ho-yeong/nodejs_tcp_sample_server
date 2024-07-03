import IntervalManager from '../managers/interval.manager.js';
import { createLocationPacket } from '../../utils/notification/game.notification.js';

class Game {
  constructor(id) {
    this.id = id;
    this.users = [];
    this.intervalManager = new IntervalManager();
  }

  addUser(user) {
    this.users.push(user);
  }

  getUser(userId) {
    return this.users.find((user) => user.id === userId);
  }

  removeUser(socket) {
    const index = this.users.findIndex((user) => user.socket === socket);
    if (index !== -1) {
      return this.users.splice(index, 1)[0];
    }
  }

  getMaxLatency() {
    let maxLatency = 0;
    this.users.forEach((user) => {
      maxLatency = Math.max(maxLatency, user.latency);
    });
    return maxLatency;
  }

  getAllLocation(excludeUserId) {
    const maxLatency = this.getMaxLatency();

    const locationData = this.users
      // .filter((user) => user.id !== excludeUserId) // excludeUserId와 일치하는 유저 제외
      .map((user) => {
        const { x, y } = user.calculatePosition(maxLatency);
        return { id: user.id, playerId: user.playerId, x, y };
      });

    return createLocationPacket(locationData);
  }
}

export default Game;
