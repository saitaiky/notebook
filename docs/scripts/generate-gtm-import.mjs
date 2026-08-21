import {readFile, writeFile} from 'node:fs/promises';

const [sourcePath, outputPath] = process.argv.slice(2);

if (!sourcePath || !outputPath) {
  throw new Error('Usage: node scripts/generate-gtm-import.mjs <workspace-export.json> <output.json>');
}

const exportDocument = JSON.parse(await readFile(sourcePath, 'utf8'));
const containerVersion = exportDocument.containerVersion;

if (containerVersion?.container?.publicId !== 'GTM-57D8HMJV') {
  throw new Error('The source export is not for GTM-57D8HMJV.');
}

const accountId = containerVersion.accountId;
const containerId = containerVersion.containerId;
const existingIds = [
  ...(containerVersion.tag || []).map(item => Number(item.tagId)),
  ...(containerVersion.trigger || []).map(item => Number(item.triggerId)),
  ...(containerVersion.variable || []).map(item => Number(item.variableId)),
].filter(Number.isFinite);
let nextId = Math.max(...existingIds) + 1;

const commonParameters = ['page_path', 'page_title', 'content_group', 'content_language', 'page_type'];
const optionalParameters = [
  'code_language',
  'feedback_helpful',
  'feedback_rating',
  'graph_section',
  'graph_subsection',
  'item_id',
  'minimum_active_seconds',
  'minimum_scroll_percent',
  'missing_path',
  'result_state',
  'search_term',
  'search_term_redacted',
  'source_component',
  'target_section',
];

const existingVariableNames = new Set((containerVersion.variable || []).map(variable => variable.name));

for (const parameter of optionalParameters) {
  const variableName = `DLV - ${parameter}`;
  if (existingVariableNames.has(variableName)) continue;

  containerVersion.variable ||= [];
  containerVersion.variable.push({
    accountId,
    containerId,
    variableId: String(nextId++),
    name: variableName,
    type: 'v',
    parameter: [
      {type: 'INTEGER', key: 'dataLayerVersion', value: '2'},
      {type: 'BOOLEAN', key: 'setDefaultValue', value: 'false'},
      {type: 'TEMPLATE', key: 'name', value: parameter},
    ],
    formatValue: {},
  });
}

const eventParameter = parameter => ({
  type: 'MAP',
  map: [
    {type: 'TEMPLATE', key: 'parameter', value: parameter},
    {type: 'TEMPLATE', key: 'parameterValue', value: `{{DLV - ${parameter}}}`},
  ],
});

if (!(containerVersion.tag || []).some(tag => tag.name === 'GA4 - behavioural events')) {
  containerVersion.tag ||= [];
  containerVersion.tag.push({
    accountId,
    containerId,
    tagId: String(nextId++),
    name: 'GA4 - behavioural events',
    type: 'gaawe',
    parameter: [
      {type: 'BOOLEAN', key: 'sendEcommerceData', value: 'false'},
      {
        type: 'LIST',
        key: 'eventSettingsTable',
        list: [...commonParameters, ...optionalParameters].map(eventParameter),
      },
      {type: 'TEMPLATE', key: 'eventName', value: '{{Event}}'},
      {type: 'TEMPLATE', key: 'measurementIdOverride', value: 'G-B35TPRVQ3Q'},
    ],
    firingTriggerId: ['11'],
    tagFiringOption: 'ONCE_PER_EVENT',
    monitoringMetadata: {type: 'MAP'},
    consentSettings: {consentStatus: 'NOT_SET'},
  });
}

exportDocument.exportTime = new Date().toISOString().replace('T', ' ').replace(/\.\d{3}Z$/, '');
await writeFile(outputPath, `${JSON.stringify(exportDocument, null, 2)}\n`);
