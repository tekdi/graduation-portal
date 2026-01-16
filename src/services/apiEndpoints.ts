const prefix = '/api';
export const API_ENDPOINTS = {
    LOGIN: `${prefix}/user/v1/account/login`,
    ADMIN_LOGIN: `${prefix}/user/v1/admin/login`,
    USER_PROFILE: `${prefix}/user/v1/user/read`,
    PARTICIPANTS_LIST: `${prefix}/user/v1/account/search`,
    PARTICIPANTS_SUB_ENTITY_LIST: `${prefix}/entity-management/v1/entities/subEntityList`,
    ENTITY_DETAILS: `${prefix}/entity-management/v1/entities/details`,
    GET_SIGNED_URL: `${prefix}/user/v1/cloud-services/file/getSignedUrl`,
    BULK_USER_CREATE: `${prefix}/user/v1/tenant/bulkUserCreate`,
}