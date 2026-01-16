import api from './api';
import { API_ENDPOINTS } from './apiEndpoints';
import logger from '@utils/logger';

/**
 * Interface for signed URL response
 */
export interface SignedUrlResponse {
  success: boolean;
  message: string;
  result: {
    signedUrl: string;
    filePath: string;
    destFilePath: string;
  };
}

/**
 * Interface for bulk user create response
 */
export interface BulkUserCreateResponse {
  success: boolean;
  message: string;
  result: {
    id: number;
    name: string;
    input_path: string;
    type: string;
    organization_id: number;
    created_by: number;
    tenant_code: string;
    uploadType: string;
    status: string;
    created_at: string;
    updated_at: string;
  };
}

/**
 * Step 1: Get signed URL for file upload
 * @param fileName - Name of the CSV file
 * @returns Promise with signed URL response
 */
export const getSignedUrl = async (fileName: string): Promise<SignedUrlResponse> => {
  try {
    console.log('Step 1 - Requesting signed URL:', { fileName });
    
    const response = await api.get<SignedUrlResponse>(API_ENDPOINTS.GET_SIGNED_URL, {
      params: { fileName },
    });
    
    console.log('Step 1 - Signed URL Response:', response.data);
    
    return response.data;
  } catch (error: any) {
    console.error('Step 1 - Error:', error);
    console.error('Step 1 - Error Details:', {
      message: error.message,
      response: error.response?.data,
    });
    logger.error('Error getting signed URL:', error);
    throw error;
  }
};

/**
 * Step 2: Upload file to signed URL
 * @param signedUrl - The signed URL from Step 1
 * @param file - The CSV file to upload
 * @returns Promise that resolves when upload is complete
 */
export const uploadFileToSignedUrl = async (
  signedUrl: string,
  file: File
): Promise<void> => {
  try {
    console.log('Step 2 - Uploading file:', {
      fileName: file.name,
      fileSize: file.size,
      signedUrl,
    });
    
    const uploadResponse = await fetch(signedUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': 'text/csv',
      },
    });
    
    console.log('Step 2 - File Upload Response:', {
      status: uploadResponse.status,
      statusText: uploadResponse.statusText,
      ok: uploadResponse.ok,
    });
    
    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      throw new Error(`File upload failed: ${uploadResponse.status} ${uploadResponse.statusText} - ${errorText}`);
    }
  } catch (error: any) {
    console.error('Step 2 - Error:', error);
    console.error('Step 2 - Error Details:', {
      message: error.message,
    });
    logger.error('Error uploading file to signed URL:', error);
    throw error;
  }
};

/**
 * Step 3: Trigger bulk user creation
 * @param filePath - The file path from Step 1 response
 * @param editableFields - Fields that can be edited (default: ["name", "email"])
 * @param uploadType - Type of upload: "CREATE", "UPLOAD", or "INVITE"
 * @returns Promise with bulk user create response
 */
export const bulkUserCreate = async (
  filePath: string,
  editableFields: string[] = ['name', 'email'],
  uploadType: 'CREATE' | 'UPLOAD' | 'INVITE' = 'UPLOAD'
): Promise<BulkUserCreateResponse> => {
  try {
    console.log('Step 3 - Triggering bulk user create:', {
      filePath,
      editableFields,
      uploadType,
    });
    
    const response = await api.post<BulkUserCreateResponse>(
      API_ENDPOINTS.BULK_USER_CREATE,
      {
        file_path: filePath,
        editable_fields: editableFields,
        upload_type: uploadType,
      }
    );
    
    console.log('Step 3 - Bulk User Create Response:', response.data);
    
    return response.data;
  } catch (error: any) {
    console.error('Step 3 - Error:', error);
    console.error('Step 3 - Error Details:', {
      message: error.message,
      response: error.response?.data,
    });
    logger.error('Error triggering bulk user create:', error);
    throw error;
  }
};
