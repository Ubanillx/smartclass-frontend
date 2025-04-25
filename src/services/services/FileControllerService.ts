/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseResponse_string_ } from '../models/BaseResponse_string_.ts';
import type { CancelablePromise } from '../core/CancelablePromise.ts';
import { OpenAPI } from '../core/OpenAPI.ts';
import { request as __request } from '../core/request.ts';
export class FileControllerService {
  /**
   * uploadFile
   * @param file file
   * @param base64Data
   * @param biz
   * @param description
   * @param filename
   * @returns BaseResponse_string_ OK
   * @returns any Created
   * @throws ApiError
   */
  public static uploadFileUsingPost1(
    file: Blob,
    base64Data?: string,
    biz?: string,
    description?: string,
    filename?: string,
  ): CancelablePromise<BaseResponse_string_ | any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/file/upload',
      query: {
        base64Data: base64Data,
        biz: biz,
        description: description,
        filename: filename,
      },
      formData: {
        file: file,
      },
      errors: {
        401: `Unauthorized`,
        403: `Forbidden`,
        404: `Not Found`,
      },
    });
  }
  /**
   * uploadAvatar
   * @param file file
   * @returns BaseResponse_string_ OK
   * @returns any Created
   * @throws ApiError
   */
  public static uploadAvatarUsingPost(
    file: Blob,
  ): CancelablePromise<BaseResponse_string_ | any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/file/upload/avatar',
      formData: {
        file: file,
      },
      errors: {
        401: `Unauthorized`,
        403: `Forbidden`,
        404: `Not Found`,
      },
    });
  }
  /**
   * uploadDocument
   * @param file file
   * @returns BaseResponse_string_ OK
   * @returns any Created
   * @throws ApiError
   */
  public static uploadDocumentUsingPost(
    file: Blob,
  ): CancelablePromise<BaseResponse_string_ | any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/file/upload/document',
      formData: {
        file: file,
      },
      errors: {
        401: `Unauthorized`,
        403: `Forbidden`,
        404: `Not Found`,
      },
    });
  }
  /**
   * uploadMaterial
   * @param file file
   * @returns BaseResponse_string_ OK
   * @returns any Created
   * @throws ApiError
   */
  public static uploadMaterialUsingPost(
    file: Blob,
  ): CancelablePromise<BaseResponse_string_ | any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/file/upload/material',
      formData: {
        file: file,
      },
      errors: {
        401: `Unauthorized`,
        403: `Forbidden`,
        404: `Not Found`,
      },
    });
  }
  /**
   * uploadVideo
   * @param file file
   * @returns BaseResponse_string_ OK
   * @returns any Created
   * @throws ApiError
   */
  public static uploadVideoUsingPost(
    file: Blob,
  ): CancelablePromise<BaseResponse_string_ | any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/file/upload/video',
      formData: {
        file: file,
      },
      errors: {
        401: `Unauthorized`,
        403: `Forbidden`,
        404: `Not Found`,
      },
    });
  }
}
