import type {
  INodeProperties,
  IHttpRequestMethods,
  INodePropertyRouting,
} from 'n8n-workflow';
import { withErrorSurfacing } from './shared';

export const sendMessageFields: INodeProperties[] = [
  {
    displayName: 'LinkedIn URL',
    name: 'linkedinUrl',
    type: 'string',
    default: '',
    required: true,
    description: 'The LinkedIn profile URL to send a message',
    displayOptions: {
      show: { resource: ['linkedin'], operation: ['sendMessage'] },
    },
    routing: withErrorSurfacing({
      request: {
        method: 'POST' as IHttpRequestMethods,
        url: '/linkedin-send-message',
        body: { linkedinUrl: '={{$value}}' },
        json: true,
      },
    } as unknown as INodePropertyRouting),
  },
  {
    displayName: 'Message',
    name: 'message',
    type: 'string',
    default: '',
    required: true,
    description:
      "The message to send. Ensure it fits within LinkedIn's character and message limits.",
    displayOptions: {
      show: { resource: ['linkedin'], operation: ['sendMessage'] },
    },
    routing: withErrorSurfacing({
      request: {
        method: 'POST' as IHttpRequestMethods,
        url: '/linkedin-send-message',
        body: {
          linkedinUrl: '={{$parameter["linkedinUrl"]}}',
          message: '={{$value}}',
        },
        json: true,
      },
    } as unknown as INodePropertyRouting),
  },
];
