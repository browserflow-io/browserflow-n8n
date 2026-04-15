import type {
  IDataObject,
  IExecuteFunctions,
  ILoadOptionsFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeConnectionType,
  JsonObject,
  ResourceMapperField,
  ResourceMapperFields,
} from 'n8n-workflow';
import { NodeApiError, NodeOperationError } from 'n8n-workflow';

type BrowserflowMetadata = {
  n8n?: {
    resource_mapper_fields?: Array<{
      id?: string;
      displayName?: string;
      required?: boolean;
      defaultMatch?: boolean;
      type?: string;
      description?: string;
    }>;
    output_json_schema?: IDataObject;
  };
  input_parameters?: Array<{
    name?: string;
    display_name?: string;
    type?: string;
    required?: boolean;
    description?: string;
  }>;
  input_values_json_schema?: {
    type?: string;
    properties?: Record<string, IDataObject>;
    required?: string[];
  };
  output?: {
    json_schema?: IDataObject;
  };
};

function toMetadataUrl(endpointUrl: string): string {
  return `${endpointUrl.replace(/\/+$/, '')}/metadata`;
}

function normalizeType(type?: string): ResourceMapperField['type'] {
  if (!type) return 'string';

  switch (type) {
    case 'integer':
    case 'number':
      return 'number';
    case 'boolean':
      return 'boolean';
    case 'array':
      return 'array';
    case 'object':
      return 'object';
    case 'string':
    default:
      return 'string';
  }
}

function extractRequiredFromSchema(metadata: BrowserflowMetadata): Set<string> {
  const required = metadata.input_values_json_schema?.required;
  return new Set(Array.isArray(required) ? required : []);
}

function toFieldsFromN8nMetadata(metadata: BrowserflowMetadata): ResourceMapperField[] {
  const fields = metadata.n8n?.resource_mapper_fields;
  if (!Array.isArray(fields) || fields.length === 0) return [];

  return fields
    .filter((field) => !!field.id)
    .map((field) => ({
      id: field.id as string,
      displayName: field.displayName || field.id || 'Field',
      required: !!field.required,
      defaultMatch: field.defaultMatch ?? true,
      display: true,
      type: normalizeType(field.type),
    }));
}

function toFieldsFromInputParameters(metadata: BrowserflowMetadata): ResourceMapperField[] {
  const params = metadata.input_parameters;
  if (!Array.isArray(params) || params.length === 0) return [];

  return params
    .filter((param) => !!param.name)
    .map((param) => ({
      id: param.name as string,
      displayName: param.display_name || param.name || 'Field',
      required: !!param.required,
      defaultMatch: true,
      display: true,
      type: normalizeType(param.type),
    }));
}

function toFieldsFromJsonSchema(metadata: BrowserflowMetadata): ResourceMapperField[] {
  const schema = metadata.input_values_json_schema;
  const properties = schema?.properties;
  if (!properties || typeof properties !== 'object') return [];

  const required = extractRequiredFromSchema(metadata);

  return Object.entries(properties).map(([key, propertyDef]) => {
    const prop = propertyDef as IDataObject;
    const title = typeof prop.title === 'string' ? prop.title : undefined;
    const type = typeof prop.type === 'string' ? prop.type : undefined;

    return {
      id: key,
      displayName: title || key,
      required: required.has(key),
      defaultMatch: true,
      display: true,
      type: normalizeType(type),
    };
  });
}

async function fetchMetadata(
  ctx: IExecuteFunctions | ILoadOptionsFunctions,
  endpointUrl: string,
): Promise<BrowserflowMetadata> {
  const metadataUrl = toMetadataUrl(endpointUrl);

  try {
    const response = await ctx.helpers.httpRequestWithAuthentication.call(ctx, 'browserflowV2Api', {
      method: 'GET',
      url: metadataUrl,
      json: true,
      headers: {
        Accept: 'application/json',
      },
    });

    return (response || {}) as BrowserflowMetadata;
  } catch (error) {
    throw new NodeOperationError(ctx.getNode(), `Could not fetch flow metadata from ${metadataUrl}`, {
      description: (error as Error).message,
    });
  }
}

async function getInputFields(this: ILoadOptionsFunctions): Promise<ResourceMapperFields> {
  const endpointUrl = this.getNodeParameter('endpointUrl', '') as string;

  if (!endpointUrl) {
    return { fields: [] };
  }

  const metadata = await fetchMetadata(this, endpointUrl);

  const fields =
    toFieldsFromN8nMetadata(metadata).length > 0
      ? toFieldsFromN8nMetadata(metadata)
      : toFieldsFromInputParameters(metadata).length > 0
      ? toFieldsFromInputParameters(metadata)
      : toFieldsFromJsonSchema(metadata);

  return { fields };
}

function getMappedInputValues(
  exec: IExecuteFunctions,
  itemIndex: number,
): IDataObject {
  return (exec.getNodeParameter('inputValues.value', itemIndex, {}) as IDataObject) || {};
}

function validateRequiredInput(
  exec: IExecuteFunctions,
  itemIndex: number,
  metadata: BrowserflowMetadata,
  inputValues: IDataObject,
): void {
  const required = extractRequiredFromSchema(metadata);
  if (required.size === 0) return;

  const missing = [...required].filter((key) => !Object.prototype.hasOwnProperty.call(inputValues, key));
  if (missing.length === 0) return;

  throw new NodeOperationError(exec.getNode(), `Missing required input field(s): ${missing.join(', ')}`, {
    itemIndex,
  });
}

export class BrowserflowV2 implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Browserflow',
    name: 'browserflowV2',
    icon: 'file:browserflow.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"]}}',
    description: 'Run configurable Browserflow endpoints using metadata-driven input fields.',
    defaults: {
      name: 'Browserflow',
    },
    inputs: ['main'] as NodeConnectionType[],
    outputs: ['main'] as NodeConnectionType[],
    credentials: [
      {
        name: 'browserflowV2Api',
        required: true,
      },
    ],
    properties: [
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'Run Browser Flow',
            value: 'runBrowserFlow',
            action: 'Run browser flow',
          },
        ],
        default: 'runBrowserFlow',
      },
      {
        displayName: 'Endpoint URL',
        name: 'endpointUrl',
        type: 'string',
        default: '',
        required: true,
        placeholder: 'https://v2.browserflow.io/saved-flows/1/amazon-search',
        description:
          'Paste your Browserflow endpoint URL. Format: https://v2.browserflow.io/saved-flows/[user-id]/[endpoint-name]. You can copy this from your Browserflow account. The node loads input fields from this endpoint metadata automatically.',
      },
      {
        displayName: 'Input Values',
        name: 'inputValues',
        type: 'resourceMapper',
        noDataExpression: true,
        default: {
          mappingMode: 'defineBelow',
          value: null,
        },
        required: true,
        typeOptions: {
          loadOptionsDependsOn: ['endpointUrl'],
          resourceMapper: {
            resourceMapperMethod: 'getInputFields',
            mode: 'add',
            valuesLabel: 'Input Values',
            supportAutoMap: false,
            fieldWords: {
              singular: 'field',
              plural: 'fields',
            },
            addAllFields: true,
          },
        },
      },
    ],
  };

  methods = {
    resourceMapping: {
      getInputFields,
    },
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: IDataObject[] = [];

    for (let i = 0; i < items.length; i++) {
      try {
        const endpointUrl = this.getNodeParameter('endpointUrl', i) as string;
        const metadata = await fetchMetadata(this, endpointUrl);
        const inputValues = getMappedInputValues(this, i);
        validateRequiredInput(this, i, metadata, inputValues);

        const body: IDataObject = {
          input_values: inputValues,
        };

        const response = (await this.helpers.httpRequestWithAuthentication.call(
          this,
          'browserflowV2Api',
          {
            method: 'POST',
            url: endpointUrl,
            json: true,
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body,
          },
        )) as IDataObject;

        returnData.push(response);
      } catch (error) {
        if (this.continueOnFail()) {
          returnData.push({
            success: false,
            error: (error as Error).message,
          });
          continue;
        }

        throw new NodeApiError(this.getNode(), error as JsonObject, { itemIndex: i });
      }
    }

    return [this.helpers.returnJsonArray(returnData)];
  }
}
