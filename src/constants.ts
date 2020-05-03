export const SLACK_BOT_SCOPE = [
  'commands',
  'chat:write',
  'team:read'
];

export const SLACK_USER_SCOPE = [
  'users.profile:read',
  'users.profile:write',
  'users:read',
  'users:read.email'
];

export const GOOGLE_USER_SCOPE = [
  'https://www.googleapis.com/auth/tasks',
  'https://www.googleapis.com/auth/calendar.events',
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile'
];
