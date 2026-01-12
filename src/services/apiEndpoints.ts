const prefix = '/api';
export const API_ENDPOINTS = {
  LOGIN: `${prefix}/user/v1/account/login`,
  ADMIN_LOGIN: `${prefix}/user/v1/admin/login`,
  USER_PROFILE: `${prefix}/user/v1/user/read`,
  PROJECT_CATEGORIES_LIST: `project/v1/library/categories/list?parentId=null&keywords=idp&getChildren=true`,
  GET_CHILD_CATEGORIES: `project/v1/library/categories/list?parentId=null&keywords=idp&getChildren=true`,
  GET_ENTITY_DETAILS: (id: string) =>
    `${prefix}/entity-management/v1/entities/details/${id}`,
  UPDATE_ENTITY_DETAILS: (id: string) =>
    `${prefix}/entity-management/v1/entities/update/${id}`,
};
