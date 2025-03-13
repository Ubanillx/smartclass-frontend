/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AiAvatarAddRequest } from '../models/AiAvatarAddRequest.ts';
import type { AiAvatarQueryRequest } from '../models/AiAvatarQueryRequest.ts';
import type { AiAvatarUpdateRequest } from '../models/AiAvatarUpdateRequest.ts';
import type { BaseResponse_AiAvatarVO_ } from '../models/BaseResponse_AiAvatarVO_.ts';
import type { BaseResponse_boolean_ } from '../models/BaseResponse_boolean_.ts';
import type { BaseResponse_List_AiAvatarVO_ } from '../models/BaseResponse_List_AiAvatarVO_.ts';
import type { BaseResponse_long_ } from '../models/BaseResponse_long_.ts';
import type { BaseResponse_Page_AiAvatarVO_ } from '../models/BaseResponse_Page_AiAvatarVO_.ts';
import type { DeleteRequest } from '../models/DeleteRequest.ts';
import type { CancelablePromise } from '../core/CancelablePromise.ts';
import { OpenAPI } from '../core/OpenAPI.ts';
import { request as __request } from '../core/request.ts';
export class AiAvatarControllerService {
  /**
   * addAiAvatar
   * @param aiAvatarAddRequest aiAvatarAddRequest
   * @returns BaseResponse_long_ OK
   * @returns any Created
   * @throws ApiError
   */
  public static addAiAvatarUsingPost(
    aiAvatarAddRequest: AiAvatarAddRequest,
  ): CancelablePromise<BaseResponse_long_ | any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/ai/avatar/add',
      body: aiAvatarAddRequest,
      errors: {
        401: `Unauthorized`,
        403: `Forbidden`,
        404: `Not Found`,
      },
    });
  }
  /**
   * listAiAvatarsByCategory
   * @param category category
   * @param limit limit
   * @returns BaseResponse_List_AiAvatarVO_ OK
   * @throws ApiError
   */
  public static listAiAvatarsByCategoryUsingGet(
    category: string,
    limit: number = 10,
  ): CancelablePromise<BaseResponse_List_AiAvatarVO_> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/ai/avatar/category',
      query: {
        category: category,
        limit: limit,
      },
      errors: {
        401: `Unauthorized`,
        403: `Forbidden`,
        404: `Not Found`,
      },
    });
  }
  /**
   * deleteAiAvatar
   * @param deleteRequest deleteRequest
   * @returns BaseResponse_boolean_ OK
   * @returns any Created
   * @throws ApiError
   */
  public static deleteAiAvatarUsingPost(
    deleteRequest: DeleteRequest,
  ): CancelablePromise<BaseResponse_boolean_ | any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/ai/avatar/delete',
      body: deleteRequest,
      errors: {
        401: `Unauthorized`,
        403: `Forbidden`,
        404: `Not Found`,
      },
    });
  }
  /**
   * getAiAvatarById
   * @param id id
   * @returns BaseResponse_AiAvatarVO_ OK
   * @throws ApiError
   */
  public static getAiAvatarByIdUsingGet(
    id?: number,
  ): CancelablePromise<BaseResponse_AiAvatarVO_> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/ai/avatar/get',
      query: {
        id: id,
      },
      errors: {
        401: `Unauthorized`,
        403: `Forbidden`,
        404: `Not Found`,
      },
    });
  }
  /**
   * listAiAvatarByPage
   * @param aiAvatarQueryRequest aiAvatarQueryRequest
   * @returns BaseResponse_Page_AiAvatarVO_ OK
   * @returns any Created
   * @throws ApiError
   */
  public static listAiAvatarByPageUsingPost(
    aiAvatarQueryRequest: AiAvatarQueryRequest,
  ): CancelablePromise<BaseResponse_Page_AiAvatarVO_ | any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/ai/avatar/list/page',
      body: aiAvatarQueryRequest,
      errors: {
        401: `Unauthorized`,
        403: `Forbidden`,
        404: `Not Found`,
      },
    });
  }
  /**
   * listPopularAiAvatars
   * @param limit limit
   * @returns BaseResponse_List_AiAvatarVO_ OK
   * @throws ApiError
   */
  public static listPopularAiAvatarsUsingGet(
    limit: number = 10,
  ): CancelablePromise<BaseResponse_List_AiAvatarVO_> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/ai/avatar/popular',
      query: {
        limit: limit,
      },
      errors: {
        401: `Unauthorized`,
        403: `Forbidden`,
        404: `Not Found`,
      },
    });
  }
  /**
   * updateAiAvatar
   * @param aiAvatarUpdateRequest aiAvatarUpdateRequest
   * @returns BaseResponse_boolean_ OK
   * @returns any Created
   * @throws ApiError
   */
  public static updateAiAvatarUsingPost(
    aiAvatarUpdateRequest: AiAvatarUpdateRequest,
  ): CancelablePromise<BaseResponse_boolean_ | any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/ai/avatar/update',
      body: aiAvatarUpdateRequest,
      errors: {
        401: `Unauthorized`,
        403: `Forbidden`,
        404: `Not Found`,
      },
    });
  }
}
