import { ONE_MOUNTH } from '../constants/index.js';
import { loginUser, registerUser } from '../services/auth.js';

export const registerController = async (req, res) => {
  const payload = req.body;
  console.log(payload, 'body in controller');

  const user = await registerUser(payload);

  res
    .status(201)
    .json({ status: 201, message: 'User successfully registred', data: user });
};

export const loginUserController = async (req, res) => {
  const session = await loginUser(req.body);

  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + ONE_MOUNTH),
  });

  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: new Date(Date.now() + ONE_MOUNTH),
  });

  res.status(200).json({
    status: 200,
    message: 'Successfully logged in an user!',
    data: { accessToken: session.accessToken },
  });
};
