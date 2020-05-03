'use strict';
import { Handler } from 'aws-lambda';
import { decodeBase64, googleAuthUrl, parseQs, slackAuthUrl, verifySlackRequest } from '../../lib/helpers';
import bambooModal from './../../lib/blocks/bamboohr-modal.json';
import greeting from './../../lib/blocks/greeting.json';

/**
 * edit the url for this lambda
 * @link https://api.slack.com/apps/A012KLX3DF0/slash-commands?
 */
export const handler: Handler = async (event) => {
  const isValid = verifySlackRequest(event);

  if (!isValid) {
    // something is wrong, someone is pretending to be slack
    // so lets just return the command without throwing an exception
    return { statusCode: 200, body: 'signature verification failed', isBase64Encoded: false, headers: {} };
  }

  const payload = parseQs(decodeBase64(event.body));
  const { command, text, user_id } = payload;

  // someone said the magic word
  if (command === '/spark') {
    switch (text) {
      case 'help':
        return {
          statusCode: 200,
          isBase64Encoded: false,
          headers: {
            'content-type': 'application/json'
          },
          body: JSON.stringify(greeting as any)
        };
      case 'connect bamboo':
        return {
          statusCode: 200,
          isBase64Encoded: false,
          headers: {
            'content-type': 'application/json'
          },
          body: JSON.stringify(bambooModal as any)
        };
      case 'connect google':
        return {
          statusCode: 200,
          isBase64Encoded: false,
          headers: {
            'content-type': 'application/json'
          },
          body: JSON.stringify({
            blocks: [
              {
                type: 'section',
                text: {
                  type: 'mrkdwn',
                  text: `<${googleAuthUrl(user_id)}|Click here to connect your account with Google>`
                }
              }
            ]
          })
        };
      case 'connect slack':
        return {
          statusCode: 200,
          isBase64Encoded: false,
          headers: {
            'content-type': 'application/json'
          },
          body: JSON.stringify({
            blocks: [
              {
                type: 'section',
                text: {
                  type: 'mrkdwn',
                  text: `<${slackAuthUrl(user_id)}|Click here to connect your account with Slack>`
                }
              }
            ]
          })
        };
      default:
        return { statusCode: 200, body: 'bad command', isBase64Encoded: false, headers: {} };
    }
  }

  return { statusCode: 200, body: 'unknown command', isBase64Encoded: false, headers: {} };
};
