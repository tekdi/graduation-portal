import { TemplateData } from '@app-types/screens';
import api from './api';
import { API_ENDPOINTS } from './apiEndpoints';

export const getProjectCategoryList = async (): Promise<any> => {
  try {
    const response = await api.get(API_ENDPOINTS.PROJECT_CATEGORIES_LIST);
    // const res = pathwaysData;
    return response.data.result || [];
    // return res?.result || [];
  } catch (error: any) {
    // Error is already handled by axios interceptor
    throw error;
  }
};

export const getCategoriesByParentId = async (parentId: string): Promise<any[]> => {
  try {
    const response = await api.get(API_ENDPOINTS.GET_CATEGORIES_BY_PARENT(parentId));
    return response.data.result || [];
  } catch (error: any) {
    throw error;
  }
};

export const getProjectTemplatesList = async (): Promise<any> => {
  try {
    const response = await api.get(API_ENDPOINTS.PROJECT_TEMPLATES_LIST);
    return response?.data?.result || [];
  } catch (error: any) {
    // Error is already handled by axios interceptor
    throw error;
  }
};

export const getProjectTemplateDetails = async (id: string): Promise<any> => {
  try {
    const response = await api.get(API_ENDPOINTS.GET_PROJECT_TEMPLATE_DETAILS(id));
    return response?.data?.result || null;
  } catch (error: any) {
    throw error;
  }
};

export const updateProjectTemplate = async (id: string, data: any): Promise<any> => {
  try {
    const response = await api.post(API_ENDPOINTS.UPDATE_PROJECT_TEMPLATE(id), data);
    return response?.data?.result || null;
  } catch (error: any) {
    throw error;
  }
};

export const updateProjectTemplateTask = async (id: string, data: any): Promise<any> => {
  try {
    const response = await api.post(API_ENDPOINTS.UPDATE_PROJECT_TEMPLATE_TASK(id), data);
    return response?.data?.result || null;
  } catch (error: any) {
    throw error;
  }
};
