/**
 * Question Editor Service
 * Calls the question-editor backend (proxied via /qeditor on dev, or direct URL in prod).
 * Uses plain fetch so it never touches the main API auth interceptors.
 */

import { QE_ENDPOINTS } from './apiEndpoints';

// ─── Types ───────────────────────────────────────────────────────────────────

export type TemplateType = 'project' | 'standalone';
export type PropagationScope = 'templateAndFirst' | 'allInProgress';

export interface TemplateSolution {
  _id: string;
  name: string;
  externalId: string;
  isReusable: boolean;
  referenceFrom?: string;
  templateType: TemplateType;
  entityType?: string;
  programId?: string;
  programName?: string;
  childCount: number;
  createdAt?: string;
}

export interface VisibleIfCondition {
  parentExternalId: string;
  operator: string;
  value: string;
  parentQuestionText: string;
}

export interface QuestionOption {
  label: string;
  value: string | number;
}

export interface EditorQuestion {
  _id: string;
  externalId: string;
  questionText: string;
  questionTextSecondary: string;
  responseType: string;
  displayType?: string | null;
  options: QuestionOption[];
  placeholder?: string | null;
  sectionHeader: string | null;
  sectionDescription: string | null;
  page?: string;
  visibleIf: any;
  visibleIfResolved: VisibleIfCondition[] | null;
  children: string[];
  validation?: any;
  showRemarks?: boolean;
  hint: string | null;
  tip: string | null;
}

/** @deprecated Use EditorSection instead. Kept for any legacy references. */
export interface EditorCriteria {
  _id: string;
  name: string;
  code?: string;
  externalId: string;
  questions: EditorQuestion[];
}

/** A section of questions as seen by the end-user app, driven by questionSequenceByEcm. */
export interface EditorSection {
  /** Evidence method code, e.g. "OB" */
  ecm: string;
  /** Section code, e.g. "S1" */
  code: string;
  /** Human-readable section name from solution.sections, e.g. "Basic Info" */
  name: string;
  /** Questions in sequence order from questionSequenceByEcm */
  questions: EditorQuestion[];
}

export interface TemplateDetail {
  solution: {
    _id: string;
    name: string;
    externalId: string;
    isReusable: boolean;
    referenceFrom?: string;
    templateType: TemplateType;
  };
  sections: EditorSection[];
}

export interface ImpactData {
  childSolutions: number;
  projectLinkedChildren: number;
  standaloneChildren: number;
  observations: number;
  inProgressSubmissions: number;
  completedSubmissions: number;
}

// ─── Base fetch helper ────────────────────────────────────────────────────────

async function qeFetch<T>(
  url: string,
  options?: RequestInit,
): Promise<T> {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  const text = await res.text();
  let json: any;
  try {
    json = JSON.parse(text);
  } catch {
    // Received non-JSON (HTML) — proxy failed or server is down
    if (text.includes('<!DOCTYPE') || text.includes('<html')) {
      throw new Error(
        'Question editor service is unreachable. ' +
        'Make sure the question-editor server is running on port 3456.',
      );
    }
    throw new Error(`Unexpected response from question editor: ${text.slice(0, 120)}`);
  }
  if (!json.success) {
    throw new Error(json.message || 'Question editor API error');
  }
  return json.data as T;
}

// ─── API functions ────────────────────────────────────────────────────────────

/** List all observation templates (no child instances). Optional type filter. */
export async function getSolutions(type?: 'all' | 'project' | 'standalone'): Promise<TemplateSolution[]> {
  const url = type && type !== 'all'
    ? `${QE_ENDPOINTS.SOLUTIONS}?type=${type}`
    : QE_ENDPOINTS.SOLUTIONS;
  return qeFetch<TemplateSolution[]>(url);
}

/** Full detail: criteria, questions (ordered, with sectionHeader grouping). */
export async function getSolutionDetail(id: string): Promise<TemplateDetail> {
  return qeFetch<TemplateDetail>(QE_ENDPOINTS.SOLUTION_DETAIL(id));
}

/** Impact count before saving: child solutions, observations, in-progress submissions. */
export async function getSolutionImpact(id: string): Promise<ImpactData> {
  return qeFetch<ImpactData>(QE_ENDPOINTS.SOLUTION_IMPACT(id));
}

/** Update question text / options / displayType / placeholder / sectionHeader / page / hint / tip / validation. */
export async function updateQuestion(
  questionId: string,
  payload: {
    questionText?: string;
    questionTextSecondary?: string;
    responseType?: string;
    displayType?: string;
    options?: QuestionOption[];
    placeholder?: string;
    sectionHeader?: string;
    sectionDescription?: string;
    page?: string;
    hint?: string;
    tip?: string;
    validation?: any;
    propagation: PropagationScope;
  },
): Promise<{ questionsUpdated: number; criteriaQuestionsUpdated: number }> {
  return qeFetch(QE_ENDPOINTS.UPDATE_QUESTION(questionId), {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

/** Set or remove a visibleIf + children[] dependency atomically. */
export async function updateDependency(
  childQuestionId: string,
  payload: {
    parentExternalId: string;
    operator?: string;
    value?: string;
    remove?: boolean;
    propagation: PropagationScope;
  },
): Promise<void> {
  await qeFetch(QE_ENDPOINTS.UPDATE_DEPENDENCY(childQuestionId), {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

/** Add a new question to a section (identified by solutionId + ECM + section code). */
export async function addQuestion(
  solutionId: string,
  ecm: string,
  sectionCode: string,
  payload: {
    questionText: string;
    questionTextSecondary?: string;
    responseType: string;
    displayType?: string;
    options?: QuestionOption[];
    placeholder?: string;
    sectionHeader?: string;
    sectionDescription?: string;
    page?: string;
    hint?: string;
    tip?: string;
    validation?: any;
    afterQuestionId?: string;
    propagation?: PropagationScope;
  },
): Promise<EditorQuestion> {
  return qeFetch<EditorQuestion>(QE_ENDPOINTS.ADD_QUESTION(solutionId, ecm, sectionCode), {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

/** Delete a question (fails if has dependencies or existing answers). */
export async function deleteQuestion(
  questionId: string,
  force = false,
): Promise<void> {
  await qeFetch(
    `${QE_ENDPOINTS.DELETE_QUESTION(questionId)}${force ? '?force=true' : ''}`,
    { method: 'DELETE' },
  );
}

/** Reorder questions within a section by providing the new externalId sequence. */
export async function reorderQuestions(
  solutionId: string,
  ecm: string,
  sectionCode: string,
  orderedExternalIds: string[],
): Promise<void> {
  await qeFetch(QE_ENDPOINTS.REORDER_QUESTIONS(solutionId, ecm, sectionCode), {
    method: 'PUT',
    body: JSON.stringify({ orderedExternalIds }),
  });
}
