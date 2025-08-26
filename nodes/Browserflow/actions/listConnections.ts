import type {
  INodeProperties,
  IHttpRequestMethods,
  INodePropertyRouting,
} from 'n8n-workflow';
import { withErrorSurfacing } from './shared';

export const listConnectionsFields: INodeProperties[] = [
  {
    displayName: 'Limit',
    name: 'limit',
    type: 'number',
    default: 50,
    typeOptions: { minValue: 1 },
    description: 'Max number of results to return',
    displayOptions: {
      show: { resource: ['linkedin'], operation: ['listConnections'] },
    },
  },
  {
    displayName: 'Offset',
    name: 'offset',
    type: 'number',
    default: 0,
    description: 'The number of connections to skip before starting to scrape',
    displayOptions: {
      show: { resource: ['linkedin'], operation: ['listConnections'] },
    },
  },
  {
    displayName: 'Filter',
    name: 'filter',
    type: 'options',
    options: [
      { name: 'Recently Added', value: 'recently added' },
      { name: 'First Name', value: 'first name' },
      { name: 'Last Name', value: 'last name' },
    ],
    default: 'recently added',
    description: 'The sort filter to apply to the connections list',
    displayOptions: {
      show: { resource: ['linkedin'], operation: ['listConnections'] },
    },
  },
  // Hidden request carrier
  {
    displayName: 'List LinkedIn Connections',
    name: 'listConnections',
    type: 'hidden',
    default: {},
    displayOptions: {
      show: { resource: ['linkedin'], operation: ['listConnections'] },
    },
    routing: withErrorSurfacing({
      request: {
        method: 'POST' as IHttpRequestMethods,
        url: '/linkedin-list-connections',
        body: {
          limit: '={{$parameter["limit"]}}',
          offset: '={{$parameter["offset"]}}',
          filter: '={{$parameter["filter"]}}',
        },
        json: true,
      },
    } as unknown as INodePropertyRouting),
  },
];
