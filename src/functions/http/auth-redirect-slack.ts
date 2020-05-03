'use strict';
import { Handler } from 'aws-lambda';
import p from 'phin';

export interface ISlackTokenResponse {
  ok: boolean;
  app_id: string;
  authed_user: {
    id: string;
    scope: string;
    access_token: string;
    token_type: string;
  };
  scope: string;
  token_type: string;
  access_token: string;
  bot_user_id: string;
  team: {
    id: string;
    name: string;
  };
  enterprise: any;
}

/**
 * This function gets the response from Slack after the user has authorised access on their behalf
 * It handles the 2nd stage of the OAuth2 flow
 * https://api.slack.com/methods/oauth.v2.access
 */
export const handler: Handler = async (event) => {
  // Get the `code` query string from the incoming event
  console.log(event);
  const { queryStringParameters: { code, state } } = event;

  // Make the request to exchange the `code` for tokens
  const { body } = await p<ISlackTokenResponse>({
    url: 'https://slack.com/api/oauth.v2.access',
    parse: 'json',
    method: 'POST',
    data: `code=${code}&client_id=${process.env.SLACK_CLIENT_ID}&client_secret=${process.env.SLACK_CLIENT_SECRET}`,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
  });

  console.log(body, state);

  return JSON.stringify({ body, state });
};
