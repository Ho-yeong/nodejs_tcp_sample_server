import { config } from '../../config/config.js';
import { getProtoMessages } from '../../init/loadProtos.js';
import { PACKET_TYPE } from '../../constants/header.js';

const makeNotification = (message, type) => {
  const packetLength = Buffer.alloc(config.packet.totalLength);
  packetLength.writeUInt32BE(
    message.length + config.packet.totalLength + config.packet.typeLength,
    0,
  );

  const packetType = Buffer.alloc(config.packet.typeLength);
  packetType.writeUInt8(type, 0);

  return Buffer.concat([packetLength, packetType, message]);
};

export const createSpawnPacket = (players) => {
  const protoMessage = getProtoMessages();
  const Location = protoMessage.game.S_Spawn;

  const payload = { players };
  const message = Location.create(payload);
  const locationPacket = Location.encode(message).finish();
  return makeNotification(locationPacket, PACKET_TYPE.SPAWN);
};

export const createLocationPacket = (posInfo) => {
  const protoMessage = getProtoMessages();
  const Location = protoMessage.game.S_Move;

  const message = Location.create({ ...posInfo });
  const locationPacket = Location.encode(message).finish();
  return makeNotification(locationPacket, PACKET_TYPE.S_MOVE);
};
