import { config } from '../config/config.js';
import { PACKET_TYPE } from '../constants/header.js';
import { packetParser } from '../utils/parser/packetParser.js';
import { getHandlerById } from '../handlers/index.js';
import { handlerError } from '../utils/error/errorHandler.js';
import readLittleEndianPacket from '../utils/readLittleEndianPacket.js';

export const onData = (socket) => async (data) => {
  socket.buffer = Buffer.concat([socket.buffer, data]);

  const totalHeaderLength = config.packet.totalLength + config.packet.typeLength;

  while (socket.buffer.length >= totalHeaderLength) {
    const { length, packetType } = readLittleEndianPacket(socket.buffer);
    // const length = socket.buffer.readUInt32BE(0);
    // const packetType = socket.buffer.readUInt8(config.packet.totalLength);

    if (socket.buffer.length >= length) {
      const packet = socket.buffer.slice(totalHeaderLength, length);
      socket.buffer = socket.buffer.slice(length);

      try {
        let type;
        switch (packetType) {
          case PACKET_TYPE.C_ENTER:
            type = PACKET_TYPE.C_ENTER;
            break;
          case PACKET_TYPE.C_MOVE:
            type = PACKET_TYPE.C_MOVE;
            break;
        }

        const reqData = packetParser(packet, type);
        const handler = getHandlerById(type);

        handler(socket, reqData);
      } catch (e) {
        handlerError(socket, e);
      }
    } else {
      // 아직 전체 패킷이 도착않았음
      break;
    }
  }
};
