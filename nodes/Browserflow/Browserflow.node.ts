import type { INodeType, INodeTypeDescription, NodeConnectionType } from 'n8n-workflow';

import {
  RESOURCE,
  OPERATION,
  checkConnectionFields,
  getProfileDataFields,
  getChatHistoryFields,
  sendConnectionInviteFields,
  sendMessageFields,
  listConnectionsFields,
  scrapeProfilesFromSearchFields,
  scrapeProfilesFromPostCommentsFields,
  scrapePostsFields,
} from './actions';

export class Browserflow implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Browserflow for LinkedIn',
    name: 'browserflow',
    icon: 'file:browserflow.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Automate LinkedIn with Browserflow',
    defaults: { name: 'Browserflow' },
    inputs: ['main'] as NodeConnectionType[],
    outputs: ['main'] as NodeConnectionType[],
    credentials: [{ name: 'browserflowApi', required: true }],
    requestDefaults: {
      baseURL: 'https://app.browserflow.io/api/',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    },
    properties: [
      RESOURCE,
      OPERATION,
      ...checkConnectionFields,
      ...getProfileDataFields,
      ...getChatHistoryFields,
      ...sendConnectionInviteFields,
      ...sendMessageFields,
      ...listConnectionsFields,
      ...scrapeProfilesFromSearchFields,
      ...scrapeProfilesFromPostCommentsFields,
      ...scrapePostsFields,
    ],
  };
}
