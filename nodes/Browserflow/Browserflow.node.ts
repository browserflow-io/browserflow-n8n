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
  EXECUTION_OPTIONS,
  checkConnectionFields,
  getProfileDataFields,
  getChatHistoryFields,
  sendConnectionInviteFields,
  sendMessageFields,
  listConnectionsFields,
  scrapeProfilesFromSearchFields,
  scrapeProfilesFromPostCommentsFields,
  scrapePostsFields,
  inviteToFollowPageFields,
  getJobResultFields,
} from './actions';

const BASE_URL = 'https://app.browserflow.io/api/';

/** ---------- tiny helpers (free functions) ---------- */
function buildBody(exec: IExecuteFunctions, i: number, base: IDataObject): IDataObject {
  const usePolling = exec.getNodeParameter('execution.use_polling', i, false) as boolean;
  const callbackUrl = exec.getNodeParameter('execution.callback_url', i, '') as string;

  const body: IDataObject = { ...base };
  if (usePolling) body.use_polling = true;
  if (callbackUrl) body.callback_url = callbackUrl;
  return body;
}

async function apiPost(
  exec: IExecuteFunctions,
  i: number,
  path: string,
  authHeaders: Record<string, string>,
  baseBody: IDataObject,
) {
  const body = buildBody(exec, i, baseBody);
  return exec.helpers.httpRequest.call(exec, {
    method: 'POST',
    url: `${BASE_URL}${path}`,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...authHeaders,
    },
    json: true,
    body,
  });
}

// 👇 NEW: simple GET helper (no polling params merged)
async function apiGet(
  exec: IExecuteFunctions,
  path: string,
  authHeaders: Record<string, string>,
) {
  return exec.helpers.httpRequest.call(exec, {
    method: 'GET',
    url: `${BASE_URL}${path}`,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...authHeaders,
    },
    json: true,
  });
}
/** --------------------------------------------------- */

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
      EXECUTION_OPTIONS,
      ...checkConnectionFields,
      ...getProfileDataFields,
      ...getChatHistoryFields,
      ...sendConnectionInviteFields,
      ...sendMessageFields,
      ...listConnectionsFields,
      ...scrapeProfilesFromSearchFields,
      ...scrapeProfilesFromPostCommentsFields,
      ...scrapePostsFields,
      ...inviteToFollowPageFields,
      ...getJobResultFields,
    ],
  };

  async execute(this: IExecuteFunctions) {
    const items = this.getInputData();
    const out: IDataObject[] = [];

    const creds = (await this.getCredentials('browserflowApi')) as { apiKey: string };
    const authHeaders = { Authorization: `Bearer ${creds.apiKey}` };
    const commonHeaders = { Accept: 'application/json', 'Content-Type': 'application/json', ...authHeaders };

    const toArray = (v: unknown): string[] => {
      if (v == null) return [];
      if (Array.isArray(v)) return v.filter(Boolean) as string[];
      if (typeof v === 'string') return v.trim() ? [v.trim()] : [];
      return [];
    };

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
            const res = await apiPost(this, i, 'linkedin-check-connection-status', commonHeaders, { linkedinUrl });
            out.push(res as IDataObject);
            break;
          }

          case 'getProfileData': {
            const linkedinUrl = this.getNodeParameter('linkedinUrl', i) as string;
            const res = await apiPost(this, i, 'linkedin-profile-data', commonHeaders, { linkedinUrl });
            out.push(res as IDataObject);
            break;
          }

          case 'getChatHistory': {
            const linkedinUrl = this.getNodeParameter('linkedinUrl', i) as string;
            const nrOfMessages = this.getNodeParameter('nrOfMessages', i, '') as string | number;
            const base: IDataObject = { linkedinUrl };
            if (nrOfMessages !== '' && nrOfMessages !== undefined && nrOfMessages !== null) {
              base.nrOfMessages = nrOfMessages;
            }
            const res = await apiPost(this, i, 'linkedin-get-chat-history', commonHeaders, base);
            out.push(res as IDataObject);
            break;
          }

          case 'sendConnectionInvite': {
            const linkedinUrl = this.getNodeParameter('linkedinUrl', i) as string;
            const addMessage = this.getNodeParameter('addMessage', i, false) as boolean;
            const base: IDataObject = { linkedinUrl };
            if (addMessage) {
              const message = this.getNodeParameter('message', i, '') as string;
              if (message) base.message = message;
            }
            const res = await apiPost(this, i, 'linkedin-connection-invite', commonHeaders, base);
            out.push(res as IDataObject);
            break;
          }

          case 'sendMessage': {
            const linkedinUrl = this.getNodeParameter('linkedinUrl', i) as string;
            const message = this.getNodeParameter('message', i) as string;
            const res = await apiPost(this, i, 'linkedin-send-message', commonHeaders, { linkedinUrl, message });
            out.push(res as IDataObject);
            break;
          }

          case 'listConnections': {
            const limit = this.getNodeParameter('limit', i) as number;
            const offset = this.getNodeParameter('offset', i) as number;
            const filter = this.getNodeParameter('filter', i) as string;
            const res = await apiPost(this, i, 'linkedin-list-connections', commonHeaders, { limit, offset, filter });
            out.push(res as IDataObject);
            break;
          }

          case 'scrapeProfilesFromSearch': {
            const searchMethod = this.getNodeParameter('searchMethod', i) as string;

            const base: IDataObject = {
              category: this.getNodeParameter('category', i, null) as string | null,
              searchTerm: this.getNodeParameter('searchTerm', i, '') as string,
              searchUrl: this.getNodeParameter('searchUrl', i, '') as string,
              startPage: this.getNodeParameter('startPage', i) as number,
              nrOfPages: this.getNodeParameter('nrOfPages', i) as number,
              city: this.getNodeParameter('city', i, '') as string,
              country: this.getNodeParameter('country', i, '') as string,
            };

            if (searchMethod === 'url') {
              delete base.category;
              delete base.searchTerm;
              delete base.city;
              delete base.country;
            }

            const res = await apiPost(this, i, 'linkedin-scrape-profiles-from-search', commonHeaders, base);
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

            const res = await apiPost(this, i, 'linkedin-scrape-profiles-from-post-comments', commonHeaders, {
              postUrl,
              add_comments: addComments,
              comments_offset: commentsOffset,
              comments_limit: commentsLimit,
              add_reactions: addReactions,
              reactions_offset: reactionsOffset,
              reactions_limit: reactionsLimit,
            });
            out.push(res as IDataObject);
            break;
          }

          case 'scrapePosts': {
            const limit = this.getNodeParameter('limit', i) as number;
            const offset = this.getNodeParameter('offset', i) as number;
            const linkedinUrl = this.getNodeParameter('linkedinUrl', i) as string;

            const res = await apiPost(this, i, 'linkedin-scrape-posts', commonHeaders, { limit, offset, linkedinUrl });
            out.push(res as IDataObject);
            break;
          }

          case 'inviteToFollowPage': {
            const linkedinUrl = this.getNodeParameter('linkedinUrl', i) as string;
            const maxToInvite = this.getNodeParameter('maxToInvite', i, 10) as number;
            const searchMethod = this.getNodeParameter('searchMethod', i) as 'term' | 'filters';

            const searchTerm =
              searchMethod === 'term'
                ? (this.getNodeParameter('searchTerm', i, '') as string)
                : '';

            const locations = toArray(this.getNodeParameter('filters.locations', i, []));
            const schools = toArray(this.getNodeParameter('filters.schools', i, []));
            const currentCompany = toArray(this.getNodeParameter('filters.currentCompany', i, []));
            const industries = toArray(this.getNodeParameter('filters.industries', i, []));

            const res = await apiPost(this, i, 'linkedin-invite-to-follow-page', commonHeaders, {
              linkedinUrl,
              maxToInvite,
              searchTerm,
              locations,
              schools,
              currentCompany,
              industries,
            });

            out.push(res as IDataObject);
            break;
          }

          // 👇 NEW: fetch a job result by id
          case 'getJobResult': {
            const jobId = this.getNodeParameter('jobId', i) as string;
            const res = await apiGet(this, `bot-jobs/${jobId}`, commonHeaders);
            out.push(res as IDataObject);
            break;
          }

          default:
            out.push({});
        }
      } catch (err) {
        const statusRaw =
          (err as any)?.response?.statusCode ??
          (err as any)?.response?.status ??
          (err as any)?.httpCode ??
          (err as any)?.statusCode ??
          (err as any)?.status ??
          (err as any)?.cause?.response?.statusCode ??
          (err as any)?.cause?.statusCode;

        const statusNum = typeof statusRaw === 'number' ? statusRaw : Number(statusRaw);
        const status = typeof statusRaw === 'number' ? statusRaw : Number(statusRaw) || 'unknown';

        const body = (err as any)?.response?.body || (err as any)?.response?.data;
        const apiMsg =
          (body && (body.error || body.exception || body.message || body?.error_message || body?.detail || (err as any).response?.statusMessage)) ||
          (err as any)?.message ||
          'Unknown error';

        if (this.continueOnFail()) {
          out.push({
            json: {
              message: `An error with status ${status} occured`,
              description: String(apiMsg),
              success: false,
              httpCode: Number.isFinite(statusNum) ? String(statusNum) : null,
            },
            error: err as JsonObject,
            pairedItem: { item: i },
          });
          continue;
        }

        throw new NodeApiError(this.getNode(), err as JsonObject, {
          message: `An error with status ${status} occured`,
          description: String(apiMsg),
        });
      }
    }

    const outItems = this.helpers.returnJsonArray(out) as INodeExecutionData[];
    return [outItems];
  }
}
