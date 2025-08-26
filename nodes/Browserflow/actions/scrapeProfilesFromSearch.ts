import type { INodeProperties } from 'n8n-workflow';

export const scrapeProfilesFromSearchFields: INodeProperties[] = [
  {
    displayName: 'Search Method',
    name: 'searchMethod',
    type: 'options',
    options: [
      { name: 'Use Filters', value: 'filters' },
      { name: 'Use Search URL', value: 'url' },
    ],
    default: 'filters',
    description:
      'Choose how to perform the LinkedIn search - You can either use filters or provide a search URL. To find the search URL set the preferred filters in LinkedIn and copy the URL from the address bar.',
    displayOptions: {
      show: { resource: ['linkedin'], operation: ['scrapeProfilesFromSearch'] },
    },
  },
  {
    displayName: 'Category',
    name: 'category',
    type: 'options',
    options: [
      { name: 'Persons', value: 'persons' },
      { name: 'Companies', value: 'companies' },
    ],
    default: 'persons',
    description: 'The category to scrape: persons or companies',
    displayOptions: {
      show: {
        resource: ['linkedin'],
        operation: ['scrapeProfilesFromSearch'],
        searchMethod: ['filters'],
      },
    },
  },
  {
    displayName: 'Search URL',
    name: 'searchUrl',
    type: 'string',
    default: '',
    description: 'The full LinkedIn search URL to scrape from',
    displayOptions: {
      show: {
        resource: ['linkedin'],
        operation: ['scrapeProfilesFromSearch'],
        searchMethod: ['url'],
      },
    },
  },
  {
    displayName: 'Search Term',
    name: 'searchTerm',
    type: 'string',
    default: '',
    required: true,
    description: 'The search term to use for scraping profiles',
    displayOptions: {
      show: {
        resource: ['linkedin'],
        operation: ['scrapeProfilesFromSearch'],
        searchMethod: ['filters'],
      },
    },
  },
  {
    displayName: 'City',
    name: 'city',
    type: 'string',
    default: '',
    description: 'The city to filter the search results by',
    displayOptions: {
      show: {
        resource: ['linkedin'],
        operation: ['scrapeProfilesFromSearch'],
        searchMethod: ['filters'],
      },
    },
  },
  {
    displayName: 'Country',
    name: 'country',
    type: 'string',
    default: '',
    description: 'The country to filter the search results by',
    displayOptions: {
      show: {
        resource: ['linkedin'],
        operation: ['scrapeProfilesFromSearch'],
        searchMethod: ['filters'],
      },
    },
  },
  {
    displayName: 'Start Page',
    name: 'startPage',
    type: 'number',
    default: 1,
    description: 'The starting page to scrape (can be used for pagination)',
    displayOptions: {
      show: { resource: ['linkedin'], operation: ['scrapeProfilesFromSearch'] },
    },
  },
  {
    displayName: 'Number of Pages',
    name: 'nrOfPages',
    type: 'number',
    default: 1,
    description: 'The number of pages to scrape',
    displayOptions: {
      show: { resource: ['linkedin'], operation: ['scrapeProfilesFromSearch'] },
    },
  },
];
