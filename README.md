# Spark

Slack bot for Somo workspace.

<a href="https://slack.com/oauth/v2/authorize?client_id=2315041478.1087711115510&scope=commands,chat:write,team:read&user_scope=users.profile:read,users.profile:write,users:read,users:read.email"><img alt="Add to Slack" height="40" width="139" src="https://platform.slack-edge.com/img/add_to_slack.png" srcset="https://platform.slack-edge.com/img/add_to_slack.png 1x, https://platform.slack-edge.com/img/add_to_slack@2x.png 2x"></a>

## Development

Project has a two main aims.

1. Build a slack bot with AWS and serverless framework.
2. Document findings to educate others

### Project Structure

```
├── functions
│   ├── http ........ HTTP functions
│   ├── events ...... Event functions
│   ├── queues ...... Queue functions
│   ├── scheduled ... Scheduled functions
│   ├── tables ...... DynamoDB Table Stream functions
│   ├── ws .......... WebSocket functions
│   ├── shared ...... Code shared by ALL functions
│   └── views ....... Code shared by HTTP GET functions
```

### TODO

- [ ] Setup local dynamodb
- [X] Add ES7 import/exports (solved with babel)
- [ ] Get mocks working offline for all functions
- [ ] Add domain name for api via CloudFormation (this is the only manual part atm)
- [ ] fix https validation errors when communicating with slack when deployed offline

One function I'd like to do is update users status every 30 mins, this is fine when working with a single user, however I'd like to scale this to 'n' users.
A DynamoDB Scan is not the right thing, so I'll need a new solution for this.

![account_binding](https://a.slack-edge.com/80588/img/api/articles/account_binding.png)

---

Without realising it I've figured out this part of the flow https://api.slack.com/best-practices/blueprints/account-binding

However I'd like to abstract various things like the DB lookup for a user and put those in a middleware, maybe using https://middy.js.org/

### Manual tasks needed

Since we want a pretty url for our api we need to add a domain name to the new HTTP API Gateway, you can do this here
https://eu-west-2.console.aws.amazon.com/apigateway/main/publish/domain-names?region=eu-west-2

- add an SSL certificate in the same region as the API Gateway
- verify the SSL certificate with DNS (this can take 2mins or 30mins)

---

## Features

### Sync Slack Status from Google Calendar

Sometimes it might not be the right time to message someone, connect Spark to your Google Calendar to let your colleges know your availability.

Set up rules based on event colors (https://support.google.com/calendar/thread/4053448?hl=en).

Examples:
> When event is green, set status to "Out at Lunch"

> Set to only show "busy" when in a meeting.

> If event has a zoom link, set status to "On a Zoom Call"

### Set Status from BambooHR

#### Annual Leave

At midnight each day Spark will check if you're on Annual Leave, if so it can update your Slack status to reflect a message of your choice.
It can even display when you'll return.

#### Sick Day

Automatically set Slack to a custom status when out sick.
