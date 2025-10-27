// nodes/Browserflow/actions/getJobResultFields.ts
import type { INodeProperties } from 'n8n-workflow';

export const getJobResultFields: INodeProperties[] = [
  {
    displayName: 'Job ID',
    name: 'jobId',
    type: 'string',
    default: '',
    required: true,
    description:
      'The job ID returned when you invoked an action with polling enabled. Example: 1201bfb7-1b5f-44fe-93c5-3e26931f451a',
    displayOptions: { show: { resource: ['linkedin'], operation: ['getJobResult'] } },
  },
];
