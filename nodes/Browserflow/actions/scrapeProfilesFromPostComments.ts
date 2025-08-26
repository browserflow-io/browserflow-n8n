import type {
  INodeProperties,
  IHttpRequestMethods,
  INodePropertyRouting,
} from 'n8n-workflow';
import { withErrorSurfacing } from './shared';

export const scrapeProfilesFromPostCommentsFields: INodeProperties[] = [
  {
    displayName: 'Post URL',
    name: 'postUrl',
    type: 'string',
    default: '',
    required: true,
    description: 'The URL of the LinkedIn post to scrape profiles from',
    displayOptions: {
      show: { resource: ['linkedin'], operation: ['scrapeProfilesFromPostComments'] },
    },
  },
  {
    displayName: 'Add Comments',
    name: 'addComments',
    type: 'boolean',
    default: false,
    description: 'Whether to include comments in the scrape results',
    displayOptions: {
      show: { resource: ['linkedin'], operation: ['scrapeProfilesFromPostComments'] },
    },
  },
  {
    displayName: 'Comments Offset',
    name: 'commentsOffset',
    type: 'number',
    default: 0,
    description: 'The number of comments to skip before starting to scrape',
    displayOptions: {
      show: {
        resource: ['linkedin'],
        operation: ['scrapeProfilesFromPostComments'],
        addComments: [true],
      },
    },
  },
  {
    displayName: 'Comments Limit',
    name: 'commentsLimit',
    type: 'number',
    default: 10,
    description: 'The maximum number of comments to scrape',
    displayOptions: {
      show: {
        resource: ['linkedin'],
        operation: ['scrapeProfilesFromPostComments'],
        addComments: [true],
      },
    },
  },
  {
    displayName: 'Add Reactions',
    name: 'addReactions',
    type: 'boolean',
    default: false,
    description: 'Whether to include reactions in the scrape results',
    displayOptions: {
      show: { resource: ['linkedin'], operation: ['scrapeProfilesFromPostComments'] },
    },
  },
  {
    displayName: 'Reactions Offset',
    name: 'reactionsOffset',
    type: 'number',
    default: 0,
    description: 'The number of reactions to skip before starting to scrape',
    displayOptions: {
      show: {
        resource: ['linkedin'],
        operation: ['scrapeProfilesFromPostComments'],
        addReactions: [true],
      },
    },
  },
  {
    displayName: 'Reactions Limit',
    name: 'reactionsLimit',
    type: 'number',
    default: 10,
    description: 'The maximum number of reactions to scrape',
    displayOptions: {
      show: {
        resource: ['linkedin'],
        operation: ['scrapeProfilesFromPostComments'],
        addReactions: [true],
      },
    },
  },
  // Hidden request carrier
  {
    displayName: 'Scrape Profiles From Post Comments',
    name: 'scrapeProfilesFromPostComments',
    type: 'hidden',
    default: {},
    displayOptions: {
      show: { resource: ['linkedin'], operation: ['scrapeProfilesFromPostComments'] },
    },
    routing: withErrorSurfacing({
      request: {
        method: 'POST' as IHttpRequestMethods,
        url: '/linkedin-scrape-profiles-from-post-comments',
        body: {
          postUrl: '={{$parameter["postUrl"]}}',
          add_comments: '={{$parameter["addComments"]}}',
          comments_offset: '={{$parameter["commentsOffset"]}}',
          comments_limit: '={{$parameter["commentsLimit"]}}',
          add_reactions: '={{$parameter["addReactions"]}}',
          reactions_offset: '={{$parameter["reactionsOffset"]}}',
          reactions_limit: '={{$parameter["reactionsLimit"]}}',
        },
        json: true,
      },
    } as unknown as INodePropertyRouting),
  },
];
