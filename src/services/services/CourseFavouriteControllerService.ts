/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseResponse_boolean_ } from '../models/BaseResponse_boolean_.ts';
import type { BaseResponse_List_long_ } from '../models/BaseResponse_List_long_.ts';
import type { BaseResponse_long_ } from '../models/BaseResponse_long_.ts';
import type { CourseFavourAddRequest } from '../models/CourseFavourAddRequest.ts';
import type { CancelablePromise } from '../core/CancelablePromise.ts';
import { OpenAPI } from '../core/OpenAPI.ts';
import { request as __request } from '../core/request.ts';
export class CourseFavouriteControllerService {
  /**
   * favourCourse
   * @param favourAddRequest favourAddRequest
   * @returns BaseResponse_long_ OK
   * @returns any Created
   * @throws ApiError
   */
  public static favourCourseUsingPost(
    favourAddRequest: CourseFavourAddRequest,
  ): CancelablePromise<BaseResponse_long_ | any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/course/favourite/add',
      body: favourAddRequest,
      errors: {
        401: `Unauthorized`,
        403: `Forbidden`,
        404: `Not Found`,
      },
    });
  }
  /**
   * unfavourCourse
   * @param courseId courseId
   * @returns BaseResponse_boolean_ OK
   * @returns any Created
   * @throws ApiError
   */
  public static unfavourCourseUsingPost(
    courseId: number,
  ): CancelablePromise<BaseResponse_boolean_ | any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/course/favourite/cancel',
      query: {
        courseId: courseId,
      },
      errors: {
        401: `Unauthorized`,
        403: `Forbidden`,
        404: `Not Found`,
      },
    });
  }
  /**
   * checkFavoured
   * @param courseId courseId
   * @returns BaseResponse_boolean_ OK
   * @throws ApiError
   */
  public static checkFavouredUsingGet(
    courseId: number,
  ): CancelablePromise<BaseResponse_boolean_> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/course/favourite/check',
      query: {
        courseId: courseId,
      },
      errors: {
        401: `Unauthorized`,
        403: `Forbidden`,
        404: `Not Found`,
      },
    });
  }
  /**
   * getMyFavourCount
   * @returns BaseResponse_long_ OK
   * @throws ApiError
   */
  public static getMyFavourCountUsingGet(): CancelablePromise<BaseResponse_long_> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/course/favourite/my/count',
      errors: {
        401: `Unauthorized`,
        403: `Forbidden`,
        404: `Not Found`,
      },
    });
  }
  /**
   * getMyFavourList
   * @returns BaseResponse_List_long_ OK
   * @throws ApiError
   */
  public static getMyFavourListUsingGet(): CancelablePromise<BaseResponse_List_long_> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/course/favourite/my/list',
      errors: {
        401: `Unauthorized`,
        403: `Forbidden`,
        404: `Not Found`,
      },
    });
  }
}
