'use strict';
import { WebClient } from '@slack/web-api';
import { Handler } from 'aws-lambda';

export const handler: Handler = async (event) => {
  const token = process.env.SLACK_TOKEN;
  const web = new WebClient();

  const profile: any = {
    status_text: `status set at ${(new Date().toISOString())}`,
    status_emoji: ':wave:',
    status_expiration: 0
  };

  const result = await web.users.profile.set({ profile, token });

  return { result, event };
};
