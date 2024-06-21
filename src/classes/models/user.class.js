class User {
  constructor(socket, id, playerId, latency) {
    this.id = id;
    this.socket = socket;
    this.playerId = playerId;
    this.latency = latency;
    this.x = 0;
    this.y = 0;
    this.lastUpdateTime = Date.now();
  }

  updatePosition(x, y) {
    this.x = x;
    this.y = y;
    this.lastUpdateTime = Date.now();
  }

  calculatePosition(latency) {
    const timeDiff = latency / 1000; // 초 단위
    const speed = 1;
    const distance = speed * timeDiff;

    return {
      x: this.x,
      y: this.y,
    };
  }
}

export default User;
