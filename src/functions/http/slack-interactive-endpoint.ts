'use strict';
import { Handler } from 'aws-lambda';
import { verifySlackRequest, decodeBase64, parseQs } from '../../lib/helpers';

/**
 * @link https://api.slack.com/apps/A012KLX3DF0/interactive-messages?
 */
export const handler: Handler = (event) => {
  const isValid = verifySlackRequest(event);

  if (!isValid) {
    // something is wrong, someone is pretending to be slack
    return { statusCode: 200 };
  }

  const payload = parseQs(decodeBase64(event.body));

  // todo something here...
  console.log(payload);

  return payload;
};
