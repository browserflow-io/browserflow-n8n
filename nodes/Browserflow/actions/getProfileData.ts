import type { INodeProperties } from 'n8n-workflow';

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
  },
];
