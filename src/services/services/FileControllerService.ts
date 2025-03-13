/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseResponse_string_ } from '../models/BaseResponse_string_.ts';
import type { UploadFileRequest } from '../models/UploadFileRequest.ts';
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
  public static uploadFileUsingPost(
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
   * uploadBase64Image
   * @param uploadFileRequest uploadFileRequest
   * @returns BaseResponse_string_ OK
   * @returns any Created
   * @throws ApiError
   */
  public static uploadBase64ImageUsingPost(
    uploadFileRequest: UploadFileRequest,
  ): CancelablePromise<BaseResponse_string_ | any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/file/uploadBase64Image',
      body: uploadFileRequest,
      errors: {
        401: `Unauthorized`,
        403: `Forbidden`,
        404: `Not Found`,
      },
    });
  }
  /**
   * uploadBinaryImage
   * @param imageBytes imageBytes
   * @returns BaseResponse_string_ OK
   * @returns any Created
   * @throws ApiError
   */
  public static uploadBinaryImageUsingPost(
    imageBytes: string,
  ): CancelablePromise<BaseResponse_string_ | any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/file/uploadBinaryImage',
      body: imageBytes,
      errors: {
        401: `Unauthorized`,
        403: `Forbidden`,
        404: `Not Found`,
      },
    });
  }
  /**
   * uploadImage
   * @param file file
   * @returns BaseResponse_string_ OK
   * @returns any Created
   * @throws ApiError
   */
  public static uploadImageUsingPost(
    file: Blob,
  ): CancelablePromise<BaseResponse_string_ | any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/file/uploadImage',
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
