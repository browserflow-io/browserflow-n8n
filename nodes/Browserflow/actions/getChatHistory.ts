import type {
  INodeProperties,
  IHttpRequestMethods,
  INodePropertyRouting,
} from 'n8n-workflow';
import { withErrorSurfacing } from './shared';

export const getChatHistoryFields: INodeProperties[] = [
  {
    displayName: 'LinkedIn URL',
    name: 'linkedinUrl',
    type: 'string',
    default: '',
    required: true,
    description: 'The LinkedIn profile URL to get chat history',
    displayOptions: {
      show: { resource: ['linkedin'], operation: ['getChatHistory'] },
    },
    routing: withErrorSurfacing({
      request: {
        method: 'POST' as IHttpRequestMethods,
        url: '/linkedin-get-chat-history',
        body: { linkedinUrl: '={{$value}}' },
        json: true,
      },
    } as unknown as INodePropertyRouting),
  },
  {
    displayName: 'Number of Messages',
    name: 'nrOfMessages',
    type: 'number',
    default: '',
    description:
      'Specify the number of messages to retrieve from the chat history. If left blank, all messages will be retrieved.',
    displayOptions: {
      show: { resource: ['linkedin'], operation: ['getChatHistory'] },
    },
    routing: withErrorSurfacing({
      request: {
        method: 'POST' as IHttpRequestMethods,
        url: '/linkedin-get-chat-history',
        body: {
          linkedinUrl: '={{$parameter["linkedinUrl"]}}',
          nrOfMessages: '={{$parameter["nrOfMessages"]}}',
        },
        json: true,
      },
    } as unknown as INodePropertyRouting),
  },
];
