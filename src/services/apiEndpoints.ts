const prefix = '/api';
export const API_ENDPOINTS = {
    LOGIN: `${prefix}/user/v1/account/login`,
    ADMIN_LOGIN: `${prefix}/user/v1/admin/login`,
    USER_PROFILE: `${prefix}/user/v1/user/read`,
    TARGETED_SOLUTIONS: `${prefix}/survey/v1/solutions/targetedSolutions`,
    OBSERVATION_ENTITIES: `${prefix}/survey/v1/observations/entities`,
    UPDATE_OBSERVATION_ENTITIES: `${prefix}/survey/v1/observations/updateEntities`,
    SEARCH_OBSERVATION_ENTITIES: `${prefix}/survey/v1/observations/searchEntities`,
}