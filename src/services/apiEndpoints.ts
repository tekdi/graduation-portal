const prefix = '';
export const API_ENDPOINTS = {
  LOGIN: `${prefix}/user/v1/account/login`,
  ADMIN_LOGIN: `${prefix}/user/v1/admin/login`,
  GENERATE_RESET_OTP: `${prefix}/user/v1/account/generateOtp`,
  RESET_PASSWORD: `${prefix}/user/v1/account/resetPassword`,
  REFRESH_TOKEN: `${prefix}/user/v1/account/refresh`,
  USER_PROFILE: `${prefix}/user/v1/user/read`,
  TARGETED_SOLUTIONS: `${prefix}/survey/v1/solutions/targetedSolutions`,
  OBSERVATION_ENTITIES: `${prefix}/survey/v1/observations/entities`,
  UPDATE_OBSERVATION_ENTITIES: `${prefix}/survey/v1/observations/updateEntities`,
  SEARCH_OBSERVATION_ENTITIES: `${prefix}/survey/v1/observations/searchEntities`,
  OBSERVATION_SOLUTION: `${prefix}/survey/v1/observations/assessment`,
  OBSERVATION_SUBMISSIONS: `${prefix}/survey/v1/observationSubmissions/list`,
  CREATE_OBSERVATION_SUBMISSION: `${prefix}/survey/v1/observationSubmissions/create`,
  PARTICIPANTS_LIST: `${prefix}/project/v1/programUsers/entities`,
  PARTICIPANTS_SUB_ENTITY_LIST: `${prefix}/entity-management/v1/entities/subEntityList`,
  ENTITY_DETAILS: `${prefix}/entity-management/v1/entities/details`,
  PROJECT_CATEGORIES_LIST: `/project/v1/library/categories/list?parentId=null&keywords=idp&getChildren=true`,
  GET_ENTITY_DETAILS: (id: string) =>
    `${prefix}/entity-management/v1/entities/details/${id}`,
  UPDATE_ENTITY_DETAILS: `${prefix}/project/v1/programUsers/createOrUpdate`,
  USER_ROLES_LIST: `${prefix}/user/v1/user-role/list`,  // Fetch available user roles for dynamic filter
  ENTITY_TYPES_LIST: `${prefix}/entity-management/v1/entityTypes/list`,  // Fetch entity types (province, district, etc.)
  ENTITIES_BY_TYPE: `${prefix}/entity-management/v1/entities/listByEntityType`,  // Fetch entities by type (e.g., provinces)
  USERS_LIST: `${prefix}/user/v1/account/search`,  // Search users for user management
  DEACTIVATE_USER: `user/v1/admin/deactivateUser`,
  ORG_ADMIN_UPDATE_USER: `${prefix}/user/v1/org-admin/updateUser`,
  GET_SIGNED_URL: `${prefix}/user/v1/cloud-services/file/getSignedUrl`,
  BULK_USER_CREATE: `${prefix}/user/v1/tenant/bulkUserCreate`,
  PROGRAM_USERS_SEARCH: `${prefix}/project/v1/programUsers/search`, // Search program users (LCs, participants, etc.),
  UPDATE_ENTITY:`${prefix}/project/v1/programUsers/updateEntityProfile`,
  GENERATE_CERTIFICATE: (projectId: string) => `${prefix}/project/v1/userProjects/update/${projectId}`,
};

// ─── Question Editor endpoints (proxied via /qeditor → question-editor server) ──
export const QE_ENDPOINTS = {
  SOLUTIONS:                 '/qeditor/api/solutions',
  SOLUTION_DETAIL:           (id: string) => `/qeditor/api/solutions/${id}`,
  SOLUTION_IMPACT:           (id: string) => `/qeditor/api/solutions/${id}/impact`,
  UPDATE_QUESTION:           (id: string) => `/qeditor/api/questions/${id}`,
  UPDATE_DEPENDENCY:         (id: string) => `/qeditor/api/questions/${id}/dependency`,
  DELETE_QUESTION:           (id: string) => `/qeditor/api/questions/${id}`,
  // Section-based add/reorder (replaces criteria-based endpoints)
  ADD_QUESTION:              (solutionId: string, ecm: string, code: string) =>
                               `/qeditor/api/solutions/${solutionId}/sections/${ecm}/${code}/questions`,
  REORDER_QUESTIONS:         (solutionId: string, ecm: string, code: string) =>
                               `/qeditor/api/solutions/${solutionId}/sections/${ecm}/${code}/reorder`,
};

// ─── Snapshot-service endpoints (port 3001) ───────────────────────────────────
// These are relative paths appended to SNAPSHOT_SERVICE_URL by snapshotApi.ts
export const SNAPSHOT_ENDPOINTS = {
  PARTICIPANT_ENROLLMENT: '/api/v1/dashboard/output/participant-enrollment',
  DROP_OUTS:              '/api/v1/dashboard/output/drop-outs',
  OUTPUT_PILLAR_CARD:     (pillarId: string) => `/api/v1/dashboard/output/pillar/${pillarId}`,
  OUTCOME_CARD:           (cardId: string) => `/api/v1/dashboard/outcome/${cardId}`,
  OUTCOME_SUMMARY:        '/api/v1/dashboard/outcome',
};
