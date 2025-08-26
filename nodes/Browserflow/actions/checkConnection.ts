import type { INodeProperties } from 'n8n-workflow';

export const checkConnectionFields: INodeProperties[] = [
  {
    displayName: 'LinkedIn URL',
    name: 'linkedinUrl',
    type: 'string',
    default: '',
    required: true,
    description: 'The LinkedIn profile URL to check connection status',
    displayOptions: {
      show: {
        resource: ['linkedin'],
        operation: ['checkConnection'],
      },
    },
    routing: {
      request: {
        method: 'POST',
        url: '/linkedin-check-connection-status',
        body: {
          linkedinUrl: '={{$value}}',
        },
        json: true,
      },
    },
  },
];
