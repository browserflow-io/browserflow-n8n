import type { INodeProperties } from 'n8n-workflow';

export const inviteToFollowPage: INodeProperties[] = [
  {
    displayName: 'LinkedIn URL',
    name: 'linkedinUrl',
    type: 'string',
    default: '',
    required: true,
    description:
      'The URL of the company page that you are admin to. This action will invite people to this page.',
    displayOptions: {
      show: { resource: ['linkedin'], operation: ['inviteToFollowPage'] },
    },
  },
  {
    displayName: 'Max Number of Connections to Invite',
    name: 'maxToInvite',
    type: 'number',
    default: 10,
    required: true,
    description:
      'Provide the number of connections you wish to invite (the default is 10)',
    displayOptions: {
      show: { resource: ['linkedin'], operation: ['inviteToFollowPage'] },
    },
  },
  {
    displayName: 'Search Method',
    name: 'searchMethod',
    type: 'options',
    options: [
      { name: 'Use Search Term', value: 'term' },
      { name: 'Use Filters', value: 'filters' },
    ],
    default: 'term',
    description:
      'Choose how to find connections to invite - You can either use a search term or filters. If you use filters, the node will invite your 1st degree connections that match the filters.',
    displayOptions: {
      show: { resource: ['linkedin'], operation: ['inviteToFollowPage'] },
    },
  },
  {
    displayName: 'Search Term',
    name: 'searchTerm',
    type: 'string',
    default: '',
    description: 'Provide the search term, e.g., "Content Marketeer"',
    displayOptions: {
      show: {
        resource: ['linkedin'],
        operation: ['inviteToFollowPage'],
        searchMethod: ['term'], // fixed from 'url' -> 'term'
      },
    },
  },

  // ---- Filters shown when Search Method = "Use Filters"
  {
    displayName: 'Filters',
    name: 'filters',
    type: 'collection',
    placeholder: 'Add filters',
    default: {},
    options: [
      {
        displayName: 'Current Company',
        name: 'currentCompany',
        type: 'string',
        default: [],
        typeOptions: { multipleValues: true },
        description:
          "Filter for connections that work for specific companies (e.g. 'Tesla')",
      },
      {
        displayName: 'Location',
        name: 'locations',
        type: 'string',
        default: [],
        typeOptions: { multipleValues: true },
        description:
          "Specify cities or countries you want to filter on (e.g. 'Amsterdam')",
      },
      {
        displayName: 'Industry',
        name: 'industries',
        type: 'string',
        default: [],
        typeOptions: { multipleValues: true },
        description:
          "Specify industries to filter on (e.g. 'Content Marketing')",
      },
      {
        displayName: 'School',
        name: 'schools',
        type: 'string',
        default: [],
        typeOptions: { multipleValues: true },
        description:
          "Filter for connections that went to specific schools or universities (e.g. 'Harvard University')",
      },
    ],
    displayOptions: {
      show: {
        resource: ['linkedin'],
        operation: ['inviteToFollowPage'],
        searchMethod: ['filters'],
      },
    },
  },
];

