import { registerUser } from '../services/auth.js';

export const registerController = async (req, res) => {
  const payload = req.body;
  console.log(payload, 'body in controller');

  const user = await registerUser(payload);

  res
    .status(201)
    .json({ status: 201, message: 'User successfully registred', data: user });
};
