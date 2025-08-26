import type {
  INodeProperties,
  IHttpRequestMethods,
  INodePropertyRouting,
} from 'n8n-workflow';
import { withErrorSurfacing } from './shared';

export const sendConnectionInviteFields: INodeProperties[] = [
  {
    displayName: 'LinkedIn URL',
    name: 'linkedinUrl',
    type: 'string',
    default: '',
    required: true,
    description: 'The LinkedIn profile URL to send a connection invite',
    displayOptions: {
      show: { resource: ['linkedin'], operation: ['sendConnectionInvite'] },
    },
    routing: withErrorSurfacing({
      request: {
        method: 'POST' as IHttpRequestMethods,
        url: '/linkedin-connection-invite',
        body: { linkedinUrl: '={{$value}}' },
        json: true,
      },
    } as unknown as INodePropertyRouting),
  },
  {
    displayName: 'Add Message',
    name: 'addMessage',
    type: 'boolean',
    default: false,
    description: 'Whether to include a custom message in the connection invite',
    displayOptions: {
      show: { resource: ['linkedin'], operation: ['sendConnectionInvite'] },
    },
  },
  {
    displayName: 'Message',
    name: 'message',
    type: 'string',
    default: '',
    description:
      "Optional message to include in the connection invite. When left blank, the connection invite is sent without a message, avoiding LinkedIn limits. If you provide a message, ensure it fits within LinkedIn's character and message limits.",
    displayOptions: {
      show: {
        resource: ['linkedin'],
        operation: ['sendConnectionInvite'],
        addMessage: [true],
      },
    },
    routing: withErrorSurfacing({
      request: {
        method: 'POST' as IHttpRequestMethods,
        url: '/linkedin-connection-invite',
        body: {
          linkedinUrl: '={{$parameter["linkedinUrl"]}}',
          message: '={{$value}}',
        },
        json: true,
      },
    } as unknown as INodePropertyRouting),
  },
];
