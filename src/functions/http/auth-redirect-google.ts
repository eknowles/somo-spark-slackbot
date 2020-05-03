'use strict';
import { Handler } from 'aws-lambda/handler';
import p from 'phin';
import qs from 'qs';

type GoogleTokenResponse = Record<'access_token' | 'expires_in' | 'id_token' | 'scope' | 'token_type' | 'refresh_token', string>;

/**
 * This lambda handles the callback from google, we need to exchange the code for tokens and then
 * link the google account to a slack account
 * @link https://developers.google.com/identity/protocols/oauth2/openid-connect#exchangecode
 */
export const handler: Handler = async (event) => {
  // extract the code from the incoming events query string
  const { queryStringParameters: { code, state } } = event;

  // get the tokens from google
  const { body } = await p<GoogleTokenResponse>({
    url: 'https://oauth2.googleapis.com/token',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    method: 'POST',
    parse: 'json',
    data: qs.stringify({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: `${process.env.HTTP_API_URL}/auth-redirect-google`,
      grant_type: 'authorization_code'
    })
  });

  const { access_token, refresh_token } = body;

  const model = {
    UserName: state,
    GoogleAccessToken: access_token,
    GoogleRefreshToken: refresh_token,
  };

  // todo do something here with this...
  console.log(body);

  return JSON.stringify({ model, body });
};
