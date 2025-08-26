// nodes/Browserflow/Browserflow.node.ts
import type {
  INodeType,
  INodeTypeDescription,
  NodeConnectionType,
  IExecuteFunctions,
  IDataObject,
  INodeExecutionData,
  JsonObject,
} from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';

import {
  RESOURCE,
  OPERATION,
  // field groups (NO routing blocks in any action file)
  checkConnectionFields,
  getProfileDataFields,
  getChatHistoryFields,
  sendConnectionInviteFields,
  sendMessageFields,
  listConnectionsFields,
  scrapeProfilesFromSearchFields,
  scrapeProfilesFromPostCommentsFields,
  scrapePostsFields,
} from './actions';

const BASE_URL = 'https://app.browserflow.io/api/';

export class Browserflow implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Browserflow for LinkedIn',
    name: 'browserflow',
    icon: 'file:browserflow.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Automate LinkedIn with Browserflow',
    defaults: { name: 'Browserflow' },

    // 👉 Two outputs: main (Data) + main (Error)
    inputs: ['main'] as NodeConnectionType[],
    outputs: ['main', 'main'] as NodeConnectionType[],
    outputNames: ['Succes', 'Error'],

    credentials: [{ name: 'browserflowApi', required: true }],

    // requestDefaults are ignored by programmatic httpRequest but safe to keep
    requestDefaults: {
      baseURL: BASE_URL,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    },

    properties: [
      RESOURCE,
      OPERATION,
      // ---- Operations field groups ----
      ...checkConnectionFields,
      ...getProfileDataFields,
      ...getChatHistoryFields,
      ...sendConnectionInviteFields,
      ...sendMessageFields,
      ...listConnectionsFields,
      ...scrapeProfilesFromSearchFields,
      ...scrapeProfilesFromPostCommentsFields,
      ...scrapePostsFields,
      // (intentionally no timeout property per user request)
    ],
  };

  async execute(this: IExecuteFunctions) {
    const items = this.getInputData();

    // Output buffers in the same order as description.outputs
    const outMain: INodeExecutionData[] = [];
    const outError: INodeExecutionData[] = [];

    // 🔐 Read API key directly and add Authorization header explicitly
    const creds = (await this.getCredentials('browserflowApi')) as { apiKey: string };
    const authHeaders = { Authorization: `Bearer ${creds.apiKey}` };
    const baseHeaders = { Accept: 'application/json', 'Content-Type': 'application/json' };

    // Normalize any response to an object
    const wrapJson = (res: unknown): IDataObject => {
      if (res && typeof res === 'object' && !Array.isArray(res)) {
        return res as IDataObject;
      }
      return { data: res as any };
    };

    for (let i = 0; i < items.length; i++) {
      const resource = this.getNodeParameter('resource', i) as string;
      const operation = this.getNodeParameter('operation', i) as string;

      // Headers per item
      const commonHeaders = { ...baseHeaders, ...authHeaders };

      try {
        if (resource !== 'linkedin') {
          outMain.push({ json: { success: true } });
          continue;
        }

        switch (operation) {
          case 'checkConnection': {
            const linkedinUrl = this.getNodeParameter('linkedinUrl', i) as string;
            const res = await this.helpers.httpRequest.call(this, {
              method: 'POST',
              url: `${BASE_URL}linkedin-check-connection-status`,
              headers: commonHeaders,
              json: true,
              body: { linkedinUrl },
            });
            outMain.push({ json: wrapJson(res) });
            break;
          }

          case 'getProfileData': {
            const linkedinUrl = this.getNodeParameter('linkedinUrl', i) as string;
            const res = await this.helpers.httpRequest.call(this, {
              method: 'POST',
              url: `${BASE_URL}linkedin-profile-data`,
              headers: commonHeaders,
              json: true,
              body: { linkedinUrl },
            });
            outMain.push({ json: wrapJson(res) });
            break;
          }

          case 'getChatHistory': {
            const linkedinUrl = this.getNodeParameter('linkedinUrl', i) as string;
            const nrOfMessages = this.getNodeParameter('nrOfMessages', i, '') as string | number;
            const body: IDataObject = { linkedinUrl };
            if (nrOfMessages !== '' && nrOfMessages !== undefined && nrOfMessages !== null) {
              body.nrOfMessages = nrOfMessages;
            }
            const res = await this.helpers.httpRequest.call(this, {
              method: 'POST',
              url: `${BASE_URL}linkedin-get-chat-history`,
              headers: commonHeaders,
              json: true,
              body,
            });
            outMain.push({ json: wrapJson(res) });
            break;
          }

          case 'sendConnectionInvite': {
            const linkedinUrl = this.getNodeParameter('linkedinUrl', i) as string;
            const addMessage = this.getNodeParameter('addMessage', i, false) as boolean;
            const body: IDataObject = { linkedinUrl };
            if (addMessage) {
              const message = this.getNodeParameter('message', i, '') as string;
              if (message) body.message = message;
            }
            const res = await this.helpers.httpRequest.call(this, {
              method: 'POST',
              url: `${BASE_URL}linkedin-connection-invite`,
              headers: commonHeaders,
              json: true,
              body,
            });
            outMain.push({ json: wrapJson(res) });
            break;
          }

          case 'sendMessage': {
            const linkedinUrl = this.getNodeParameter('linkedinUrl', i) as string;
            const message = this.getNodeParameter('message', i) as string;
            const res = await this.helpers.httpRequest.call(this, {
              method: 'POST',
              url: `${BASE_URL}linkedin-send-message`,
              headers: commonHeaders,
              json: true,
              body: { linkedinUrl, message },
            });
            outMain.push({ json: wrapJson(res) });
            break;
          }

          case 'listConnections': {
            const limit = this.getNodeParameter('limit', i) as number;
            const offset = this.getNodeParameter('offset', i) as number;
            const filter = this.getNodeParameter('filter', i, '') as string;
            const res = await this.helpers.httpRequest.call(this, {
              method: 'POST',
              url: `${BASE_URL}linkedin-list-connections`,
              headers: commonHeaders,
              json: true,
              body: { limit, offset, filter },
            });
            outMain.push({ json: wrapJson(res) });
            break;
          }

          case 'scrapeProfilesFromSearch': {
            const searchMethod = this.getNodeParameter('searchMethod', i) as string;
            const body: IDataObject = {
              category: this.getNodeParameter('category', i, null) as string | null,
              searchTerm: this.getNodeParameter('searchTerm', i, '') as string,
              searchUrl: this.getNodeParameter('searchUrl', i, '') as string,
              startPage: this.getNodeParameter('startPage', i) as number,
              nrOfPages: this.getNodeParameter('nrOfPages', i) as number,
              city: this.getNodeParameter('city', i, '') as string,
              country: this.getNodeParameter('country', i, '') as string,
            };

            if (searchMethod === 'url') {
              delete body.category;
              delete body.searchTerm;
              delete body.city;
              delete body.country;
            }

            const res = await this.helpers.httpRequest.call(this, {
              method: 'POST',
              url: `${BASE_URL}linkedin-scrape-profiles-from-search`,
              headers: commonHeaders,
              json: true,
              body,
            });
            outMain.push({ json: wrapJson(res) });
            break;
          }

          case 'scrapeProfilesFromPostComments': {
            const postUrl = this.getNodeParameter('postUrl', i) as string;
            const addComments = this.getNodeParameter('addComments', i, false) as boolean;
            const commentsOffset = this.getNodeParameter('commentsOffset', i, 0) as number;
            const commentsLimit = this.getNodeParameter('commentsLimit', i, 10) as number;
            const addReactions = this.getNodeParameter('addReactions', i, false) as boolean;
            const reactionsOffset = this.getNodeParameter('reactionsOffset', i, 0) as number;
            const reactionsLimit = this.getNodeParameter('reactionsLimit', i, 10) as number;

            const res = await this.helpers.httpRequest.call(this, {
              method: 'POST',
              url: `${BASE_URL}linkedin-scrape-profiles-from-post-comments`,
              headers: commonHeaders,
              json: true,
              body: {
                postUrl,
                add_comments: addComments,
                comments_offset: commentsOffset,
                comments_limit: commentsLimit,
                add_reactions: addReactions,
                reactions_offset: reactionsOffset,
                reactions_limit: reactionsLimit,
              },
            });
            outMain.push({ json: wrapJson(res) });
            break;
          }

          case 'scrapePosts': {
            const limit = this.getNodeParameter('limit', i) as number;
            const offset = this.getNodeParameter('offset', i) as number;
            const linkedinUrl = this.getNodeParameter('linkedinUrl', i) as string;

            const res = await this.helpers.httpRequest.call(this, {
              method: 'POST',
              url: `${BASE_URL}linkedin-scrape-posts`,
              headers: commonHeaders,
              json: true,
              body: { limit, offset, linkedinUrl },
            });
            outMain.push({ json: wrapJson(res) });
            break;
          }

          default: {
            outMain.push({ json: {} });
          }
        }
      } catch (err) {
        // -------- Per-item error handling --------
        // Build the same status/apiMsg you used before:
        const statusRaw =
          (err as any)?.response?.statusCode ??
          (err as any)?.response?.status ??
          (err as any)?.httpCode ??
          (err as any)?.statusCode ??
          (err as any)?.status ??
          (err as any)?.cause?.response?.statusCode ??
          (err as any)?.cause?.statusCode;

        const status = typeof statusRaw === 'number' ? statusRaw : Number(statusRaw) || 'unknown';

        const body = (err as any)?.response?.body || (err as any)?.response?.data;
        const apiMsg =
          (body && (body.error || body.exception || body.message || body?.error_message || body?.detail || (err as any).response?.statusMessage)) ||
          (err as any)?.message ||
          'Unknown error';

        if (this.continueOnFail()) {
          // Route error to the 2nd output
          outError.push({
            json: {
              itemIndex: i,
              status,
              message: 'Request failed',
              detail: String(apiMsg),
            },
          });
          continue; // go on to next item
        }

        // Hard fail with your custom banner + gray one-liner
        throw new NodeApiError(this.getNode(), err as JsonObject, {
          message: `An error with status ${status} occured`, // red banner
          description: String(apiMsg),                       // gray one-liner
        });
      }
    }

    // 👉 Return in the same order as outputs are declared
    return [outMain, outError];
  }
}
