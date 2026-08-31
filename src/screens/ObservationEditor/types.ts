export type { TemplateSolution, TemplateDetail, EditorSection, EditorCriteria, EditorQuestion, ImpactData, PropagationScope, QuestionOption, VisibleIfCondition, TemplateType } from '../../services/questionEditorService';

export const RESPONSE_TYPES = [
  { label: 'Radio (Single choice)', value: 'radio' },
  { label: 'Multi-select (Multiple choice)', value: 'multiselect' },
  { label: 'Dropdown', value: 'dropdown' },
  { label: 'Text (Short answer)', value: 'text' },
  { label: 'Long text', value: 'textarea' },
  { label: 'Number', value: 'number' },
  { label: 'Date', value: 'date' },
  { label: 'Slider', value: 'slider' },
  { label: 'Matrix', value: 'matrix' },
  { label: 'File upload', value: 'file' },
];

export const OPERATOR_OPTIONS = [
  { label: 'equals (===)', value: '===' },
  { label: 'includes', value: 'includes' },
  { label: 'not equals (!==)', value: '!==' },
];

/** Response types that have options (label/value pairs) */
export const OPTION_BASED_TYPES = ['radio', 'multiselect', 'dropdown', 'checkbox'];
