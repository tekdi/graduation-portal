const prefix = '/api';
export const API_ENDPOINTS = {
    LOGIN: `${prefix}/user/v1/account/login`,
    ADMIN_LOGIN: `${prefix}/user/v1/admin/login`,
    USER_PROFILE: `${prefix}/user/v1/user/read`,
    PARTICIPANTS_LIST: `${prefix}/user/v1/account/search`,  // Used for both participants and users (differentiated by type parameter)
    USER_ROLES_LIST: `${prefix}/user/v1/user-role/list`,  // Fetch available user roles for filters
    ENTITY_TYPES_LIST: `${prefix}/entity-management/v1/entityTypes/list`,  // Fetch entity types (province, district, etc.)
    ENTITIES_BY_TYPE: `${prefix}/entity-management/v1/entities/listByEntityType`,  // Fetch entities by type (e.g., provinces)
    SUB_ENTITIES_BY_PARENT: `${prefix}/entity-management/v1/entities/subEntityList`,  // Fetch sub-entities by parent entity ID (e.g., districts by province)
}