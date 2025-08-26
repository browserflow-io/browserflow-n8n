// actions/checkConnection.ts
import type {
  INodeProperties,
  IHttpRequestMethods,
  INodePropertyRouting,
} from 'n8n-workflow';
import { withErrorSurfacing } from './shared';

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
    routing: withErrorSurfacing({
      request: {
        method: 'POST' as IHttpRequestMethods,
        url: '/linkedin-check-connection-status',
        body: {
          linkedinUrl: '={{$value}}',
        },
        json: true,
      },
    } as unknown as INodePropertyRouting), // cast to satisfy older typings
  },
];
