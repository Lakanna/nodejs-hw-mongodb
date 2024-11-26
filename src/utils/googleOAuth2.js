import { OAuth2Client } from 'google-auth-library';
import path from 'node:path';
import { readFile } from 'fs/promises';

import { env } from './env.js';
import createHttpError from 'http-errors';

const PATH_JSON = path.resolve('google-oauth.json');

const oauthConfig = JSON.parse(await readFile(PATH_JSON));

console.log(oauthConfig, 'oauthconfig in util googleOAuth2');

const googleOAuthClient = new OAuth2Client({
  clientId: env('GOOGLE_AUTH_CLIENT_ID'),
  clientSecret: env('GOOGLE_AUTH_CLIENT_SECRET'),
  redirectUri: oauthConfig.web.redirect_uris[0],
});

export const generateAuthUrl = () => {
  googleOAuthClient.generateAuthUrl({
    scope: [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
    ],
  });
};

export const validateCode = async (code) => {
  const respons = await googleOAuthClient.getToken(code);

  console.log(respons, 'respons in google utils');

  if (!respons.tokens.id_token) throw createHttpError(401, 'Unauthorized');

  const ticket = await googleOAuthClient.verifyIdToken({
    idToken: respons.tokens.id_token,
  });
  console.log(ticket, 'ticket');
  return ticket;
};

export const getFullNameFromGoogleTokenPayload = (payload) => {
  let fullName = 'Guest';

  if (payload.given_name && payload.family_name) {
    fullName = `${payload.given_name} ${payload.family_name}`;
  } else if (payload.given_name) {
    fullName = payload.given_name;
  }
  return fullName;
};
