import { v4 as uuidv4 } from 'uuid';
import { addUser } from '../../session/user.session.js';
import { createResponse } from '../../utils/response/createResponse.js';
import { HANDLER_IDS, RESPONSE_SUCCESS_CODE } from '../../constants/handlerIds.js';
import { handlerError } from '../../utils/error/errorHandler.js';
import { getGameSession } from '../../session/game.session.js';
import { createUser, findUserByDeviceID, updateUserLogin } from '../../db/user/user.db.js';

const initialHandler = async ({ socket, _, payload }) => {
  try {
    const { deviceId, latency, playerId } = payload;

    let user = await findUserByDeviceID(deviceId);

    if (!user) {
      await createUser(deviceId);
    } else {
      await updateUserLogin(user.id);
    }

    user = addUser(socket, deviceId, playerId, latency);
    const gameSession = getGameSession();
    gameSession.addUser(user);

    const initialResponse = createResponse(HANDLER_IDS.INITIAL, RESPONSE_SUCCESS_CODE, {
      userId: deviceId,
    });

    socket.write(initialResponse);
  } catch (e) {
    handlerError(socket, e);
  }
};

export default initialHandler;
