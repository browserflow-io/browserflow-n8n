import type { INodeProperties } from 'n8n-workflow';

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
  },
];
