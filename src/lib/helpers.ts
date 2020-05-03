import crypto from 'crypto';
import qs from 'qs';
import { GOOGLE_USER_SCOPE, SLACK_BOT_SCOPE, SLACK_USER_SCOPE } from '../constants';

export const decodeBase64 = (payload) => Buffer.from(payload, 'base64').toString('utf8');
export const parseQs = (arg) => qs.parse(arg);

/**
 * verifies messages from slack
 * @link https://api.slack.com/authentication/verifying-requests-from-slack
 * @param body - expected to be base64 encoded
 * @param timestamp - this comes from the `x-slack-request-timestamp` header
 * @param secret - our app signing secret from slack
 * @param signature - this comes from the `x-slack-signature` header
 */
const verify = (body, timestamp, secret, signature) => {
  const decodedBody = Buffer.from(body, 'base64').toString('utf8');
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(`v0:${timestamp}:${decodedBody}`, 'utf8');
  const output = `v0=${hmac.digest('hex')}`;

  return signature === output;
};

/**
 * This event should match the Lambda 2.0 payload schema.
 * @link https://medium.com/@lancers/amazon-api-gateway-explaining-lambda-payload-version-2-0-in-http-api-24b0b4db5d36
 * @param event
 */
export const verifySlackRequest = (event) => {
  return verify(
    event.body,
    event.headers['x-slack-request-timestamp'],
    process.env.SLACK_SIGNING_SECRET,
    event.headers['x-slack-signature']
  );
};

export const googleAuthUrl = (state: string) => {
  const url = 'https://accounts.google.com/o/oauth2/v2/auth';
  const params = {
    state,
    client_id: process.env.GOOGLE_CLIENT_ID,
    redirect_uri: `${process.env.HTTP_API_URL}/auth-redirect-google`,
    scope: GOOGLE_USER_SCOPE.join(' '),
    access_type: 'offline',
    prompt: 'consent', // <-- this makes sure we get a refresh token
    include_granted_scopes: 'true',
    response_type: 'code'
  };

  return `${url}?${qs.stringify(params)}`;
};

/**
 * when requesting scopes for slack, they need to be delimited with a comma.
 * @link https://api.slack.com/authentication/oauth-v2#asking
 */
export const slackAuthUrl = (state: string) => {
  const url = 'https://slack.com/oauth/v2/authorize';
  const params = {
    state,
    client_id: process.env.SLACK_CLIENT_ID,
    redirect_uri: `${process.env.HTTP_API_URL}/auth-redirect-slack`,
    scope: SLACK_BOT_SCOPE.join(','),
    user_scope: SLACK_USER_SCOPE.join(','),
  };

  return `${url}?${qs.stringify(params)}`;
};
