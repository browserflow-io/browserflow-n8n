import type {
  INodeProperties,
  IHttpRequestMethods,
  INodePropertyRouting,
} from 'n8n-workflow';
import { withErrorSurfacing } from './shared';

export const getProfileDataFields: INodeProperties[] = [
  {
    displayName: 'LinkedIn URL',
    name: 'linkedinUrl',
    type: 'string',
    default: '',
    required: true,
    description: 'The LinkedIn profile URL to get profile data',
    displayOptions: {
      show: { resource: ['linkedin'], operation: ['getProfileData'] },
    },
    routing: withErrorSurfacing({
      request: {
        method: 'POST' as IHttpRequestMethods,
        url: '/linkedin-profile-data',
        body: { linkedinUrl: '={{$value}}' },
        json: true,
      },
    } as unknown as INodePropertyRouting),
  },
];
