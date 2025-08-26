// actions/shared.ts
import type { INodeProperties, IExecuteFunctions } from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';

export const RESOURCE: INodeProperties = {
  displayName: 'Resource',
  name: 'resource',
  type: 'options',
  noDataExpression: true,
  options: [{ name: '', value: 'linkedin' }],
  default: 'linkedin',
};

export const OPERATION: INodeProperties = {
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  options: [
    { name: 'Check if a Person Is a Connection', value: 'checkConnection', action: 'Check if a person is a connection' },
    { name: 'Export LinkedIn Chat History', value: 'getChatHistory', action: 'Export linked in chat history' },
    { name: 'Get Data From A Linkedin Profile', value: 'getProfileData', action: 'Get data from a linkedin profile' },
    { name: 'List LinkedIn Connections', value: 'listConnections', action: 'List your linkedin connections' },
    { name: 'Scrape LinkedIn Posts', value: 'scrapePosts', action: 'Scrape linkedin posts' },
    { name: 'Scrape Profiles From A LinkedIn Post', value: 'scrapeProfilesFromPostComments', action: 'Scrape profiles from a linkedin post' },
    { name: 'Scrape Profiles From A LinkedIn Search', value: 'scrapeProfilesFromSearch', action: 'Scrape profiles from a linkedin search' },
    { name: 'Send A LinkedIn Connection Invite', value: 'sendConnectionInvite', action: 'Send a linked in connection invite' },
    { name: 'Send A LinkedIn Message', value: 'sendMessage', action: 'Send a linkedin message' },
  ],
  default: 'checkConnection',
  displayOptions: { show: { resource: ['linkedin'] } },
};

/**
 * Shows:
 *  - Banner: "An error occurred with status <status>"
 *  - Gray line: API's message
 *  - Error details: proper HTTP code (not "none") + trimmed body
 */
export async function errorPostReceive(
  this: IExecuteFunctions,
  items: INodeProperties[],
  response: any,
) {
  const status =
    response?.statusCode ??
    response?.status ??
    response?.response?.statusCode;

  const body = response?.body ?? response?.data;

  if (typeof status === 'number' && status >= 400) {
    const apiMsg =
      body?.error ??
      body?.message ??
      body?.detail ??
      body?.error_message ??
      response?.statusMessage ??
      'Unknown error';

    const banner = `An error occurred with status ${status}`;

    // Shape the error object like an HTTP error so n8n can render details
    const apiErrorLike: any = {
      response: {
        statusCode: status,
        body,
        headers: response?.headers,
        request: {
          method: response?.request?.method ?? response?.options?.method,
          url: response?.request?.url ?? response?.options?.url ?? response?.url,
        },
      },
    };

    const err = new NodeApiError(this.getNode(), apiErrorLike, {
      message: banner,
      description: String(apiMsg),
      httpCode: String(status),
    }) as any;

    // Nudge older UIs/typings that look at different fields
    err.httpCode = String(status);
    err.statusCode = status;
    err.response = apiErrorLike.response;      // ensure response.statusCode exists
    err.context = { httpCode: String(status) }; // some UIs read from context

    throw err;
  }

  return items;
}

/**
 * Ensure our hook runs and we see the full HTTP response.
 */
export function withErrorSurfacing<T extends Record<string, any>>(routing: T): T {
  const currentPost = (routing as any)?.output?.postReceive ?? [];
  return {
    ...routing,
    request: {
      ...((routing as any)?.request ?? {}),
      returnFullResponse: true,
      ignoreHttpStatusErrors: true, // let our hook handle non-2xx
    },
    output: {
      ...((routing as any)?.output ?? {}),
      postReceive: [errorPostReceive, ...currentPost],
    },
  } as T;
}
