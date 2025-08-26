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

export const OPERATION: INodeProperties = {
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  options: [
    { name: 'Check if a Person Is a Connection', value: 'checkConnection', action: 'Check if a person is a connection' },
    { name: 'Export LinkedIn Chat History', value: 'getChatHistory', action: 'Export linked in chat history' },
    { name: 'Get Data From A Linkedin Profile', value: 'getProfileData', action: 'Get data from a linkedin profile' },
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
