import createHttpError from 'http-errors';
import { SessionCollection } from '../db/models/session.js';
import { UsersCollection } from '../db/models/user.js';

export const authenticate = async (req, res, next) => {
  const auhtHeader = req.get('Authorization');

  if (!auhtHeader) {
    next(createHttpError(401, 'Please, provide Authorization header'));
    return;
  }

  const [bearer, token] = auhtHeader.split(' ');

  if (bearer !== 'Bearer' || !token) {
    next(createHttpError(401, 'Auth header should be of type Bearer'));
    return;
  }

  const session = await SessionCollection.findOne({ accessToken: token });

  if (!session) {
    next(createHttpError(401, 'Session not found'));
    return;
  }

  const isExpiredToken = new Date() > new Date(session.accessTokenValidUntil);

  if (isExpiredToken) {
    next(createHttpError(401, 'Access token expired'));
    return;
  }

  const user = await UsersCollection.findOne({ _id: session.userId });

  if (!user) {
    next(createHttpError(401, 'User not found'));
    return;
  }

  req.user = user;

  next();
};

// {
//   _id: new ObjectId('672a72175e1e4202eb68cc37'),
//   name: 'Jon test',
//   email: 'jhon@ukr.net',
//   password: '$2b$10$0Hq6iZoMDVWoPSUbT0khROJwGIr4jsUB5ZtXxGsqOEZLh/b25Ox3i',
//   createdAt: 2024-11-05T19:29:27.589Z,
//   updatedAt: 2024-11-05T19:29:27.589Z
// } user in authenticate
