import type { IAuthenticateGeneric, ICredentialType, INodeProperties } from 'n8n-workflow';

export class BrowserflowV2Api implements ICredentialType {
  name = 'browserflowV2Api';

  displayName = 'Browserflow V2 API';

  documentationUrl = 'https://docs.browserflow.io/api';

  properties: INodeProperties[] = [
    {
      displayName: 'API Key',
      name: 'apiKey',
      type: 'string',
      typeOptions: {
        password: true,
      },
      default: '',
      required: true,
      description: 'Your Browserflow API key',
    },
  ];

  authenticate: IAuthenticateGeneric = {
    type: 'generic',
    properties: {
      headers: {
        'X-API-Key': '={{$credentials.apiKey}}',
      },
    },
  };
}
