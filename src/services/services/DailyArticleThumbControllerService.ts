/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseResponse_boolean_ } from '../models/BaseResponse_boolean_.ts';
import type { BaseResponse_int_ } from '../models/BaseResponse_int_.ts';
import type { CancelablePromise } from '../core/CancelablePromise.ts';
import { OpenAPI } from '../core/OpenAPI.ts';
import { request as __request } from '../core/request.ts';
export class DailyArticleThumbControllerService {
  /**
   * isThumbArticle
   * @param articleId articleId
   * @returns BaseResponse_boolean_ OK
   * @throws ApiError
   */
  public static isThumbArticleUsingGet(
    articleId: number,
  ): CancelablePromise<BaseResponse_boolean_> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/daily/article/thumb/is-thumb/{articleId}',
      path: {
        articleId: articleId,
      },
      errors: {
        401: `Unauthorized`,
        403: `Forbidden`,
        404: `Not Found`,
      },
    });
  }
  /**
   * doArticleThumb
   * @param articleId articleId
   * @returns BaseResponse_int_ OK
   * @returns any Created
   * @throws ApiError
   */
  public static doArticleThumbUsingPost(
    articleId: number,
  ): CancelablePromise<BaseResponse_int_ | any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/daily/article/thumb/{articleId}',
      path: {
        articleId: articleId,
      },
      errors: {
        401: `Unauthorized`,
        403: `Forbidden`,
        404: `Not Found`,
      },
    });
  }
}
