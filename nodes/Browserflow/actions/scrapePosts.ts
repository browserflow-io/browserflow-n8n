import type {
  INodeProperties,
  IHttpRequestMethods,
  INodePropertyRouting,
} from 'n8n-workflow';
import { withErrorSurfacing } from './shared';

export const scrapePostsFields: INodeProperties[] = [
  {
    displayName: 'Limit',
    name: 'limit',
    type: 'number',
    default: 50,
    typeOptions: { minValue: 1 },
    description: 'Max number of results to return',
    displayOptions: {
      show: { resource: ['linkedin'], operation: ['scrapePosts'] },
    },
  },
  {
    displayName: 'Offset',
    name: 'offset',
    type: 'number',
    default: 0,
    description: 'The number of connections to skip before starting to scrape',
    displayOptions: {
      show: { resource: ['linkedin'], operation: ['scrapePosts'] },
    },
  },
  {
    displayName: 'LinkedIn URL',
    name: 'linkedinUrl',
    type: 'string',
    default: '',
    required: true,
    description:
      'The LinkedIn profile URL to scrape posts from, works for both person and company profiles',
    displayOptions: {
      show: { resource: ['linkedin'], operation: ['scrapePosts'] },
    },
    routing: withErrorSurfacing({
      request: {
        method: 'POST' as IHttpRequestMethods,
        url: '/linkedin-scrape-posts',
        body: {
          limit: '={{$parameter["limit"]}}',
          offset: '={{$parameter["offset"]}}',
          linkedinUrl: '={{$value}}',
        },
        json: true,
      },
    } as unknown as INodePropertyRouting),
  },
];
