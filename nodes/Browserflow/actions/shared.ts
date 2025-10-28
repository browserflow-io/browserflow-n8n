// actions/shared.ts
import type { INodeProperties } from 'n8n-workflow';

export const RESOURCE: INodeProperties = {
  displayName: 'Resource',
  name: 'resource',
  type: 'options',
  noDataExpression: true,
  options: [{ name: '', value: 'linkedin' }],
  default: 'linkedin',
};

export const EXECUTION_OPTIONS: INodeProperties = {
  displayName: 'Execution',
  name: 'execution',
  type: 'collection',
  placeholder: 'Add option',
  default: {},
  // 👇 Hide this collection when operation is "getJobResult"
  displayOptions: {
    show: {
      resource: ['linkedin'],
    },
    hide: {
      operation: ['getJobResult'],
    },
  },
  options: [
    {
      displayName: 'Schedule as a Job (Polling)',
      name: 'use_polling',
      type: 'boolean',
      default: false,
      description: 'Whether to run the action in the background and return a job ID you can poll',
    },
    {
      displayName: 'Callback URL',
      name: 'callback_url',
      type: 'string',
      default: '',
      placeholder: 'https://example.com/webhooks/browserflow',
      description: 'If provided, the server will POST the result here when done',
      displayOptions: { show: { use_polling: [true] } },
    },
  ],
};

export const OPERATION: INodeProperties = {
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  options: [
    { name: 'Check if a Person Is a Connection', value: 'checkConnection', action: 'Check if a person is a connection' },
    { name: 'Export LinkedIn Chat History', value: 'getChatHistory', action: 'Export linked in chat history' },
    { name: 'Get Data From A Linkedin Profile', value: 'getProfileData', action: 'Get data from a linkedin profile' },
    { name: 'Get Job Result', value: 'getJobResult', action: 'Get the result of a job' },
    { name: 'Invite Connections to Follow a LinkedIn Page', value: 'inviteToFollowPage', action: 'Invite connections to follow a linkedin page' },
    { name: 'List LinkedIn Connections', value: 'listConnections', action: 'List your linkedin connections' },
    { name: 'Scrape LinkedIn Posts', value: 'scrapePosts', action: 'Scrape linkedin posts' },
    { name: 'Scrape Profiles From A LinkedIn Post', value: 'scrapeProfilesFromPostComments', action: 'Scrape profiles from a linkedin post' },
    { name: 'Scrape Profiles From A LinkedIn Search', value: 'scrapeProfilesFromSearch', action: 'Scrape profiles from a linkedin search' },
    { name: 'Send A LinkedIn Connection Invite', value: 'sendConnectionInvite', action: 'Send a linked in connection invite' },
    { name: 'Send A LinkedIn Message', value: 'sendMessage', action: 'Send a linkedin message' },
  ],
  default: 'checkConnection',
  displayOptions: { show: { resource: ['linkedin'] } },
};
