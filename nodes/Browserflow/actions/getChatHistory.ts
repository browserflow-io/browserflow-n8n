import type { INodeProperties } from 'n8n-workflow';

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
  },
];
