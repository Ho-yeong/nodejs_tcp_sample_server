class User {
  constructor(socket, id, playerId, latency, coords) {
    this.id = id;
    this.socket = socket;
    this.playerId = playerId;
    this.latency = latency;
    this.x = coords.x ? coords.x : 0;
    this.y = coords.y ? coords.y : 0;
    this.lastX = 0; // 이전 위치 저장
    this.lastY = 0; // 이전 위치 저장
    this.lastUpdateTime = Date.now();
    this.speed = 3; // 고정 속도
  }

  updatePosition(x, y) {
    this.lastX = this.x;
    this.lastY = this.y;
    this.x = x;
    this.y = y;
    this.lastUpdateTime = Date.now();
  }

  calculatePosition(latency) {
    if (this.x === this.lastX && this.y === this.lastY) {
      return {
        x: this.x,
        y: this.y,
      };
    }

    const timeDiff = (Date.now() - this.lastUpdateTime + latency) / 1000; // 초 단위로 변환

    // 유저가 움직였을 경우 고정 속도를 사용하여 새로운 위치 계산
    const distance = this.speed * timeDiff;
    // Math.sign 함수는 주어진 숫자의 부호를 반환
    const directionX = this.x !== this.lastX ? Math.sign(this.x - this.lastX) : 0;
    const directionY = this.y !== this.lastY ? Math.sign(this.y - this.lastY) : 0;

    return {
      x: this.x + directionX * distance,
      y: this.y + directionY * distance,
    };
  }
}

export default User;
