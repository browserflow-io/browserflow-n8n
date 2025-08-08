import { INodeType, INodeTypeDescription, NodeConnectionType } from 'n8n-workflow';

export class Browserflow implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'Browserflow for LinkedIn',
        name: 'browserflow',
        icon: 'file:browserflow.svg',
        group: ['transform'],
        version: 1,
        subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
        description: 'Automate LinkedIn with Browserflow',
        defaults: {
            name: 'Browserflow',
        },
        inputs: ['main'] as NodeConnectionType[], // Type assertion to satisfy the linter
        outputs: ['main'] as NodeConnectionType[], // Type assertion to satisfy the linter
        credentials: [
            {
                name: 'browserflowApi',
                required: true,
            },
        ],
        requestDefaults: {
            baseURL: 'https://app.browserflow.io/api/',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        },
        properties: [
            {
                displayName: 'Resource',
                name: 'resource',
                type: 'options',
                noDataExpression: true,
                options: [
                    {
                        name: '',
                        value: 'linkedin',
                    },
                ],
                default: 'linkedin',
            },
            {
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
                noDataExpression: true,
                options: [
                    {
                        name: 'Check if a Person Is a Connection',
                        value: 'checkConnection',
                        action: 'Check if a person is a connection',
                    },
                    {
                        name: 'Export LinkedIn Chat History',
                        value: 'getChatHistory',
                        action: 'Export linked in chat history',
                    },
                    {
                        name: 'Get Data From A Linkedin Profile',
                        value: 'getProfileData',
                        action: 'Get data from a linkedin profile',
                    },
                    {
                        name: 'List LinkedIn Connections',
                        value: 'listConnections',
                        action: 'List your linkedin connections',
                    },
                     {
                        name: 'Scrape LinkedIn Posts',
                        value: 'scrapePosts',
                        action: 'Scrape linkedin posts',
                    },
                    {
                        name: 'Scrape Profiles From A LinkedIn Post',
                        value: 'scrapeProfilesFromPostComments',
                        action: 'Scrape profiles from a linkedin post',
                    },
                    {
                        name: 'Scrape Profiles From A LinkedIn Search',
                        value: 'scrapeProfilesFromSearch',
                        action: 'Scrape profiles from a linkedin search',
                    },
                    {
                        name: 'Send A LinkedIn Connection Invite',
                        value: 'sendConnectionInvite',
                        action: 'Send a linked in connection invite',
                    },
                    {
                        name: 'Send A LinkedIn Message',
                        value: 'sendMessage',
                        action: 'Send a linkedin message',
                    },
                ],
                default: 'checkConnection',
                displayOptions: {
                    show: {
                        resource: [
                            'linkedin',
                        ],
                    },
                },
            },
            {
                displayName: 'LinkedIn URL',
                name: 'linkedinUrl',
                type: 'string',
                default: '',
                required: true,
                description: 'The LinkedIn profile URL to check connection status',
                displayOptions: {
                    show: {
                        resource: [
                            'linkedin',
                        ],
                        operation: [
                            'checkConnection',
                        ],
                    },
                },
                routing: {
                    request: {
                        method: 'POST',
                        url: '/linkedin-check-connection-status',
                        body: {
                            linkedinUrl: '={{$value}}',
                        },
                        json: true,
                    },
                },
            },
            {
                displayName: 'LinkedIn URL',
                name: 'linkedinUrl',
                type: 'string',
                default: '',
                required: true,
                description: 'The LinkedIn profile URL to get profile data',
                displayOptions: {
                    show: {
                        resource: [
                            'linkedin',
                        ],
                        operation: [
                            'getProfileData',
                        ],
                    },
                },
                routing: {
                    request: {
                        method: 'POST',
                        url: '/linkedin-profile-data',
                        body: {
                            linkedinUrl: '={{$value}}',
                        },
                        json: true,
                    },
					
                },
            },
            {
                displayName: 'LinkedIn URL',
                name: 'linkedinUrl',
                type: 'string',
                default: '',
                required: true,
                description: 'The LinkedIn profile URL to send a connection invite',
                displayOptions: {
                    show: {
                        resource: [
                            'linkedin',
                        ],
                        operation: [
                            'sendConnectionInvite',
                        ],
                    },
                },
                routing: {
                    request: {
                        method: 'POST',
                        url: '/linkedin-connection-invite',
                        body: {
                            linkedinUrl: '={{$value}}',
                        },
                        json: true,
                    },
                },
            },
            {
                displayName: 'Add Message',
                name: 'addMessage',
                type: 'boolean',
                default: false,
                description: 'Whether to include a custom message in the connection invite',
                displayOptions: {
                    show: {
                        resource: [
                            'linkedin',
                        ],
                        operation: [
                            'sendConnectionInvite',
                        ],
                    },
                },
            },
            {
                displayName: 'Message',
                name: 'message',
                type: 'string',
                default: '',
                description: 'Optional message to include in the connection invite. When left blank, the connection invite is sent without a message, avoiding LinkedIn limits. If you provide a message, ensure it fits within LinkedIn\'s character and message limits.',
                displayOptions: {
                    show: {
                        resource: [
                            'linkedin',
                        ],
                        operation: [
                            'sendConnectionInvite',
                        ],
                        addMessage: [
                            true,
                        ],
                    },
                },
                routing: {
                    request: {
                        method: 'POST',
                        url: '/linkedin-connection-invite',
                        body: {
                            linkedinUrl: '={{$parameter["linkedinUrl"]}}',
                            message: '={{$value}}',
                        },
                        json: true,
                    },
                },
            },
            {
                displayName: 'LinkedIn URL',
                name: 'linkedinUrl',
                type: 'string',
                default: '',
                required: true,
                description: 'The LinkedIn profile URL to get chat history',
                displayOptions: {
                    show: {
                        resource: [
                            'linkedin',
                        ],
                        operation: [
                            'getChatHistory',
                        ],
                    },
                },
                
                routing: {
                    request: {
                        method: 'POST',
                        url: '/linkedin-get-chat-history',
                        body: {
                            linkedinUrl: '={{$value}}',
                        },
                        json: true,
                    },
                },
            },
            {
                displayName: 'Number of Messages',
                name: 'nrOfMessages',
                type: 'number',
                default: '', 
                description: 'Specify the number of messages to retrieve from the chat history. If left blank, all messages will be retrieved.',
                displayOptions: {
                    show: {
                        resource: [
                            'linkedin',
                        ],
                        operation: [
                            'getChatHistory',
                        ],
                    },
                },
                routing: {
                    request: {
                        method: 'POST',
                        url: '/linkedin-get-chat-history',
                        body: {
                            linkedinUrl: '={{$parameter["linkedinUrl"]}}',
                            nrOfMessages: '={{$parameter["nrOfMessages"]}}',
                        },
                        json: true,
                    },
                },
            },
            {
                displayName: 'Search Method',
                name: 'searchMethod',
                type: 'options',
                options: [
                    {
                        name: 'Use Filters',
                        value: 'filters',
                    },
                    {
                        name: 'Use Search URL',
                        value: 'url',
                    },
                ],
                default: 'filters',
                description: 'Choose how to perform the LinkedIn search - You can either use filters or provide a search URL. To find the search URL set the preferred filters in LinkedIn and copy the URL from the address bar. The URL will look like this: https://www.linkedin.com/search/results/people/?keywords=your%20search%20term&origin=GLOBAL_SEARCH_HEADER&sid=yourSid',
                displayOptions: {
                    show: {
                        resource: [
                            'linkedin',
                        ],
                        operation: [
                            'scrapeProfilesFromSearch',
                        ],
                    },
                },
            },  
            {
                displayName: 'Category',
                name: 'category',
                type: 'options',
                options: [
                    {
                        name: 'Persons',
                        value: 'persons',
                    },
                    {
                        name: 'Companies',
                        value: 'companies',
                    },
                ],
                default: 'persons',
                description: 'The category to scrape: persons or companies',
                displayOptions: {
                    show: {
                        resource: [
                            'linkedin',
                        ],
                        operation: [
                            'scrapeProfilesFromSearch',
                        ],
                        searchMethod: ["filters"],

                    },
                },
            },
            {
                displayName: 'Search URL',
                name: 'searchUrl',
                type: 'string',
                default: "",
                description: 'The full LinkedIn search URL to scrape from',
                displayOptions: {
                    show: {
                        resource: ["linkedin"],
                        operation: ["scrapeProfilesFromSearch"],
                        searchMethod: ["url"]
                    }
                }
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
                        resource: [
                            'linkedin',
                        ],
                        operation: [
                            'scrapeProfilesFromSearch',
                        ],
                        searchMethod: ["filters"],
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
                        resource: [
                            'linkedin',
                        ],
                        operation: [
                            'scrapeProfilesFromSearch',
                        ],
                        searchMethod: ["filters"],
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
                        resource: [
                            'linkedin',
                        ],
                        operation: [
                            'scrapeProfilesFromSearch',
                        ],
                        searchMethod: ["filters"],
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
                    show: {
                        resource: [
                            'linkedin',
                        ],
                        operation: [
                            'scrapeProfilesFromSearch',
                        ],
                    },
                },
            },
            {
                displayName: 'Number of Pages',
                name: 'nrOfPages',
                type: 'number',
                default: 1,
                description: 'The number of pages to scrape',
                displayOptions: {
                    show: {
                        resource: [
                            'linkedin',
                        ],
                        operation: [
                            'scrapeProfilesFromSearch',
                        ],
                    },
                },
            },
            {
                displayName: 'Scrape Profiles From Search',
                name: 'scrapeProfilesFromSearch',
                type: 'hidden',
                default: {},
                displayOptions: {
                    show: {
                        resource: [
                            'linkedin',
                        ],
                        operation: [
                            'scrapeProfilesFromSearch',
                        ],
                    },
                },
                routing: {
                    request: {
                        method: 'POST',
                        url: '/linkedin-scrape-profiles-from-search',
                        body: {
                            category: '={{$parameter["category"]}}',
                            searchTerm: '={{$parameter["searchTerm"]}}',
                            searchUrl: '={{$parameter["searchUrl"]}}',
                            startPage: '={{$parameter["startPage"]}}',
                            nrOfPages: '={{$parameter["nrOfPages"]}}',
                            city: '={{$parameter["city"]}}',
                            country: '={{$parameter["country"]}}',
                        },
                        json: true,
                    },
                },
            },
            {
                displayName: 'Post URL',
                name: 'postUrl',
                type: 'string',
                default: '',
                required: true,
                description: 'The URL of the LinkedIn post to scrape profiles from',
                displayOptions: {
                    show: {
                        resource: [
                            'linkedin',
                        ],
                        operation: [
                            'scrapeProfilesFromPostComments',
                        ],
                    },
                },
            },
            {
                displayName: 'Add Comments',
                name: 'addComments',
                type: 'boolean',
                default: false,
                description: 'Whether to include comments in the scrape results',
                displayOptions: {
                    show: {
                        resource: [
                            'linkedin',
                        ],
                        operation: [
                            'scrapeProfilesFromPostComments',
                        ],
                    },
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
                        resource: [
                            'linkedin',
                        ],
                        operation: [
                            'scrapeProfilesFromPostComments',
                        ],
                        addComments: [
                            true,
                        ],
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
                        resource: [
                            'linkedin',
                        ],
                        operation: [
                            'scrapeProfilesFromPostComments',
                        ],
                        addComments: [
                            true,
                        ],
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
                    show: {
                        resource: [
                            'linkedin',
                        ],
                        operation: [
                            'scrapeProfilesFromPostComments',
                        ],
                    },
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
                        resource: [
                            'linkedin',
                        ],
                        operation: [
                            'scrapeProfilesFromPostComments',
                        ],
                        addReactions: [
                            true,
                        ],
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
                        resource: [
                            'linkedin',
                        ],
                        operation: [
                            'scrapeProfilesFromPostComments',
                        ],
                        addReactions: [
                            true,
                        ],
                    },
                },
            },
            {
                displayName: 'Scrape Profiles From Post Comments',
                name: 'scrapeProfilesFromPostComments',
                type: 'hidden',
                default: {},
                displayOptions: {
                    show: {
                        resource: [
                            'linkedin',
                        ],
                        operation: [
                            'scrapeProfilesFromPostComments',
                        ],
                    },
                },
                routing: {
                    request: {
                        method: 'POST',
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
                },
            },
            {
                displayName: 'Limit',
                name: 'limit',
                type: 'number',
                default: 50,
                typeOptions: {
                    minValue: 1,
                },
                description: 'Max number of results to return',
                displayOptions: {
                    show: {
                        resource: [
                            'linkedin',
                        ],
                        operation: [
                            'listConnections',
                        ],
                    },
                },
            },
            {
                displayName: 'Offset',
                name: 'offset',
                type: 'number',
                default: 0,
                description: 'The number of connections to skip before starting to scrape',
                displayOptions: {
                    show: {
                        resource: [
                            'linkedin',
                        ],
                        operation: [
                            'listConnections',
                        ],
                    },
                },
            },
            {
                displayName: 'Filter',
                name: 'filter',
                type: 'options',
                options: [
                    {
                        name: 'Recently Added',
                        value: 'recently added',
                    },
                    {
                        name: 'First Name',
                        value: 'first name',
                    },
                    {
                        name: 'Last Name',
                        value: 'last name',
                    },

                ],
                default: 'recently added',
                description: 'The sort filter to apply to the connections list',
                displayOptions: {
                    show: {
                        resource: [
                            'linkedin',
                        ],
                        operation: [
                            'listConnections',
                        ],
                    },
                },
            },  

            {
                displayName: 'List LinkedIn Connections',
                name: 'listConnections',
                type: 'hidden',
                default: {},
                displayOptions: {
                    show: {
                        resource: [
                            'linkedin',
                        ],
                        operation: [
                            'listConnections',
                        ],
                    },
                },
                routing: {
                    request: {
                        method: 'POST',
                        url: '/linkedin-list-connections',
                        body: {
                            limit: '={{$parameter["limit"]}}',
                            offset: '={{$parameter["offset"]}}',
                            filter: '={{$parameter["filter"]}}',
                        },
                        json: true,
                    },
                },
            },
              {
                displayName: 'Limit',
                name: 'limit',
                type: 'number',
                default: 50,
                typeOptions: {
                    minValue: 1,
                },
                description: 'Max number of results to return',
                displayOptions: {
                    show: {
                        resource: [
                            'linkedin',
                        ],
                        operation: [
                            'scrapePosts',
                        ],
                    },
                },
            },
            {
                displayName: 'Offset',
                name: 'offset',
                type: 'number',
                default: 0,
                description: 'The number of connections to skip before starting to scrape',
                displayOptions: {
                    show: {
                        resource: [
                            'linkedin',
                        ],
                        operation: [
                            'scrapePosts',
                        ],
                    },
                },
            },
           

            {
                 displayName: 'LinkedIn URL',
                name: 'linkedinUrl',
                type: 'string',
                default: '',
                required: true,
                description: 'The LinkedIn profile URL to scrape posts from, works for both person and company profiles',
                displayOptions: {
                    show: {
                        resource: [
                            'linkedin',
                        ],
                        operation: [
                            'scrapePosts',
                        ],
                    },
                },
                routing: {
                    request: {
                        method: 'POST',
                        url: '/linkedin-scrape-posts',
                        body: {
                            limit: '={{$parameter["limit"]}}',
                            offset: '={{$parameter["offset"]}}',
                            linkedinUrl: '={{$value}}',
                        },
                        json: true,
                    },
                },
            },
            {
                displayName: 'LinkedIn URL',
                name: 'linkedinUrl',
                type: 'string',
                default: '',
                required: true,
                description: 'The LinkedIn profile URL to send a message',
                displayOptions: {
                    show: {
                        resource: [
                            'linkedin',
                        ],
                        operation: [
                            'sendMessage',
                        ],
                    },
                },
                routing: {
                    request: {
                        method: 'POST',
                        url: '/linkedin-send-message',
                        body: {
                            linkedinUrl: '={{$value}}',
                        },
                        json: true,
                    },
                },
            },
            {
                displayName: 'Message',
                name: 'message',
                type: 'string',
                default: '',
                required: true,
                description: 'The message to send. Ensure it fits within LinkedIn\'s character and message limits.',
                displayOptions: {
                    show: {
                        resource: [
                            'linkedin',
                        ],
                        operation: [
                            'sendMessage',
                        ],
                    },
                },
                routing: {
                    request: {
                        method: 'POST',
                        url: '/linkedin-send-message',
                        body: {
                            linkedinUrl: '={{$parameter["linkedinUrl"]}}',
                            message: '={{$value}}',
                        },
                        json: true,
                    },
                },
            },
        ],
    };
}