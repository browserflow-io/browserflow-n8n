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
  inviteToFollowPage
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
    inputs: ['main'] as NodeConnectionType[],
    outputs: ['main'] as NodeConnectionType[],
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
      ...checkConnectionFields,
      ...getProfileDataFields,
      ...getChatHistoryFields,
      ...sendConnectionInviteFields,
      ...sendMessageFields,
      ...listConnectionsFields,
      ...scrapeProfilesFromSearchFields,
      ...scrapeProfilesFromPostCommentsFields,
      ...scrapePostsFields,
      ...inviteToFollowPage
    ],
  };

  async execute(this: IExecuteFunctions) {
    const items = this.getInputData();
    const out: IDataObject[] = [];

    // 🔐 Read API key directly and add Authorization header explicitly
    const creds = (await this.getCredentials('browserflowApi')) as { apiKey: string };
    const authHeaders = { Authorization: `Bearer ${creds.apiKey}` };
    const commonHeaders = { Accept: 'application/json', 'Content-Type': 'application/json', ...authHeaders };

    for (let i = 0; i < items.length; i++) {
      const resource = this.getNodeParameter('resource', i) as string;
      const operation = this.getNodeParameter('operation', i) as string;

      try {
        if (resource !== 'linkedin') {
          out.push({ success: true });
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
            out.push(res as IDataObject);
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
            out.push(res as IDataObject);
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
            out.push(res as IDataObject);
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
            out.push(res as IDataObject);
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
            out.push(res as IDataObject);
            break;
          }

          case 'listConnections': {
            const limit = this.getNodeParameter('limit', i) as number;
            const offset = this.getNodeParameter('offset', i) as number;
            const filter = this.getNodeParameter('filter', i) as string;
            const res = await this.helpers.httpRequest.call(this, {
              method: 'POST',
              url: `${BASE_URL}linkedin-list-connections`,
              headers: commonHeaders,
              json: true,
              body: { limit, offset, filter },
            });
            out.push(res as IDataObject);
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
            out.push(res as IDataObject);
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
            out.push(res as IDataObject);
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
            out.push(res as IDataObject);
            break;
          }
          case 'inviteToFollowPage': {
            const linkedinUrl = this.getNodeParameter('linkedinUrl', i) as string;
            const maxToInvite = this.getNodeParameter('maxToInvite', i, 10) as number;
            const searchMethod = this.getNodeParameter('searchMethod', i) as 'term' | 'filters';

            // Helper: accept string | string[] | undefined -> string[]
            const toArray = (v: unknown): string[] => {
              if (v == null) return [];
              if (Array.isArray(v)) return v.filter(Boolean) as string[];
              if (typeof v === 'string') return v.trim() ? [v.trim()] : [];
              return [];
            };

            // searchTerm only when using 'term'
            const searchTerm =
              searchMethod === 'term'
                ? (this.getNodeParameter('searchTerm', i, '') as string)
                : '';

            // Grab nested fields from the collection using dot notation
            const locations       = toArray(this.getNodeParameter('filters.locations', i, []));
            const schools         = toArray(this.getNodeParameter('filters.schools', i, []));
            const currentCompany  = toArray(this.getNodeParameter('filters.currentCompany', i, []));
            const industries      = toArray(this.getNodeParameter('filters.industries', i, []));

            const res = await this.helpers.httpRequest.call(this, {
              method: 'POST',
              url: `${BASE_URL}linkedin-invite-to-follow-page`,
              headers: commonHeaders,
              json: true,
              body: {
                linkedinUrl,
                maxToInvite,
                searchTerm,
                // always arrays from here on out
                locations,
                schools,
                currentCompany,
                industries,
              },
            });

            out.push(res as IDataObject);
            break;
          }
          default:
            out.push({});
        }
      } catch (err) {
        // -------- Custom banner + gray message, preserve full details --------
        const statusRaw =
          (err as any)?.response?.statusCode ??
          (err as any)?.response?.status ??
          (err as any)?.httpCode ??
          (err as any)?.statusCode ??
          (err as any)?.status ??
          (err as any)?.cause?.response?.statusCode ??
          (err as any)?.cause?.statusCode;

        const statusNum = typeof statusRaw === 'number' ? statusRaw : Number(statusRaw);
        const status = typeof statusRaw === 'number'
          ? statusRaw
          : Number(statusRaw) || 'unknown';

        const body = (err as any)?.response?.body || (err as any)?.response?.data;
        const apiMsg =
          (body && (body.error || body.exception || body.message || body?.error_message || body?.detail || (err as any).response?.statusMessage)) ||
          (err as any)?.message ||
          'Unknown error';

         if (this.continueOnFail()) {
          const original = (items[i]?.json ?? {}) as IDataObject;
          out.push({
            ...original,
            error: {
              message: `An error with status ${status} occured`,
              description: String(apiMsg),
              httpCode: Number.isFinite(statusNum) ? String(statusNum) : null,
              body: body ?? null,
            },
          });
          continue;
        }  

        throw new NodeApiError(this.getNode(), err as JsonObject, {
          message: `An error with status ${status} occured`, // red banner
          description: String(apiMsg),                       // gray one-liner
        });
      }
    }

    const outItems = this.helpers.returnJsonArray(out) as INodeExecutionData[];
    return [outItems];
  }
}
