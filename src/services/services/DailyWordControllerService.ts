/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseResponse_boolean_ } from '../models/BaseResponse_boolean_.ts';
import type { BaseResponse_DailyWordVO_ } from '../models/BaseResponse_DailyWordVO_.ts';
import type { BaseResponse_List_DailyWordVO_ } from '../models/BaseResponse_List_DailyWordVO_.ts';
import type { BaseResponse_long_ } from '../models/BaseResponse_long_.ts';
import type { BaseResponse_Page_DailyWord_ } from '../models/BaseResponse_Page_DailyWord_.ts';
import type { BaseResponse_Page_DailyWordVO_ } from '../models/BaseResponse_Page_DailyWordVO_.ts';
import type { DailyWordAddRequest } from '../models/DailyWordAddRequest.ts';
import type { DailyWordQueryRequest } from '../models/DailyWordQueryRequest.ts';
import type { DailyWordUpdateRequest } from '../models/DailyWordUpdateRequest.ts';
import type { DeleteRequest_1 } from '../models/DeleteRequest_1.ts';
import type { CancelablePromise } from '../core/CancelablePromise.ts';
import { OpenAPI } from '../core/OpenAPI.ts';
import { request as __request } from '../core/request.ts';
export class DailyWordControllerService {
  /**
   * addDailyWord
   * @param dailyWordAddRequest dailyWordAddRequest
   * @returns BaseResponse_long_ OK
   * @returns any Created
   * @throws ApiError
   */
  public static addDailyWordUsingPost(
    dailyWordAddRequest: DailyWordAddRequest,
  ): CancelablePromise<BaseResponse_long_ | any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/dailyWord/add',
      body: dailyWordAddRequest,
      errors: {
        401: `Unauthorized`,
        403: `Forbidden`,
        404: `Not Found`,
      },
    });
  }
  /**
   * getDailyWordByDate
   * @param date date
   * @returns BaseResponse_List_DailyWordVO_ OK
   * @throws ApiError
   */
  public static getDailyWordByDateUsingGet(
    date: string,
  ): CancelablePromise<BaseResponse_List_DailyWordVO_> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/dailyWord/date',
      query: {
        date: date,
      },
      errors: {
        401: `Unauthorized`,
        403: `Forbidden`,
        404: `Not Found`,
      },
    });
  }
  /**
   * deleteDailyWord
   * @param deleteRequest deleteRequest
   * @returns BaseResponse_boolean_ OK
   * @returns any Created
   * @throws ApiError
   */
  public static deleteDailyWordUsingPost(
    deleteRequest: DeleteRequest_1,
  ): CancelablePromise<BaseResponse_boolean_ | any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/dailyWord/delete',
      body: deleteRequest,
      errors: {
        401: `Unauthorized`,
        403: `Forbidden`,
        404: `Not Found`,
      },
    });
  }
  /**
   * getDailyWordVOById
   * @param id id
   * @returns BaseResponse_DailyWordVO_ OK
   * @throws ApiError
   */
  public static getDailyWordVoByIdUsingGet(
    id?: number,
  ): CancelablePromise<BaseResponse_DailyWordVO_> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/dailyWord/get/vo',
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
   * listDailyWordByPage
   * @param dailyWordQueryRequest dailyWordQueryRequest
   * @returns BaseResponse_Page_DailyWord_ OK
   * @returns any Created
   * @throws ApiError
   */
  public static listDailyWordByPageUsingPost(
    dailyWordQueryRequest: DailyWordQueryRequest,
  ): CancelablePromise<BaseResponse_Page_DailyWord_ | any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/dailyWord/list/page',
      body: dailyWordQueryRequest,
      errors: {
        401: `Unauthorized`,
        403: `Forbidden`,
        404: `Not Found`,
      },
    });
  }
  /**
   * listDailyWordVOByPage
   * @param dailyWordQueryRequest dailyWordQueryRequest
   * @returns BaseResponse_Page_DailyWordVO_ OK
   * @returns any Created
   * @throws ApiError
   */
  public static listDailyWordVoByPageUsingPost(
    dailyWordQueryRequest: DailyWordQueryRequest,
  ): CancelablePromise<BaseResponse_Page_DailyWordVO_ | any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/dailyWord/list/page/vo',
      body: dailyWordQueryRequest,
      errors: {
        401: `Unauthorized`,
        403: `Forbidden`,
        404: `Not Found`,
      },
    });
  }
  /**
   * getRandomWord
   * @param difficulty difficulty
   * @returns BaseResponse_DailyWordVO_ OK
   * @throws ApiError
   */
  public static getRandomWordUsingGet(
    difficulty?: number,
  ): CancelablePromise<BaseResponse_DailyWordVO_> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/dailyWord/random',
      query: {
        difficulty: difficulty,
      },
      errors: {
        401: `Unauthorized`,
        403: `Forbidden`,
        404: `Not Found`,
      },
    });
  }
  /**
   * getTodayWord
   * @returns BaseResponse_List_DailyWordVO_ OK
   * @throws ApiError
   */
  public static getTodayWordUsingGet(): CancelablePromise<BaseResponse_List_DailyWordVO_> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/dailyWord/today',
      errors: {
        401: `Unauthorized`,
        403: `Forbidden`,
        404: `Not Found`,
      },
    });
  }
  /**
   * updateDailyWord
   * @param dailyWordUpdateRequest dailyWordUpdateRequest
   * @returns BaseResponse_boolean_ OK
   * @returns any Created
   * @throws ApiError
   */
  public static updateDailyWordUsingPost(
    dailyWordUpdateRequest: DailyWordUpdateRequest,
  ): CancelablePromise<BaseResponse_boolean_ | any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/dailyWord/update',
      body: dailyWordUpdateRequest,
      errors: {
        401: `Unauthorized`,
        403: `Forbidden`,
        404: `Not Found`,
      },
    });
  }
}
