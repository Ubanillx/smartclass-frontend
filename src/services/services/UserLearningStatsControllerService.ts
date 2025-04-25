/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseResponse_boolean_ } from '../models/BaseResponse_boolean_.ts';
import type { BaseResponse_long_ } from '../models/BaseResponse_long_.ts';
import type { BaseResponse_Map_string_object_ } from '../models/BaseResponse_Map_string_object_.ts';
import type { BaseResponse_UserLearningStats_ } from '../models/BaseResponse_UserLearningStats_.ts';
import type { CancelablePromise } from '../core/CancelablePromise.ts';
import { OpenAPI } from '../core/OpenAPI.ts';
import { request as __request } from '../core/request.ts';
export class UserLearningStatsControllerService {
  /**
   * addUserBadgeByAdmin
   * @param userId userId
   * @param count count
   * @returns BaseResponse_boolean_ OK
   * @returns any Created
   * @throws ApiError
   */
  public static addUserBadgeByAdminUsingPost(
    userId: number,
    count?: number,
  ): CancelablePromise<BaseResponse_boolean_ | any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/user/stats/admin/add/badge',
      query: {
        count: count,
        userId: userId,
      },
      errors: {
        401: `Unauthorized`,
        403: `Forbidden`,
        404: `Not Found`,
      },
    });
  }
  /**
   * addUserExperienceByAdmin
   * @param experience experience
   * @param userId userId
   * @returns BaseResponse_boolean_ OK
   * @returns any Created
   * @throws ApiError
   */
  public static addUserExperienceByAdminUsingPost(
    experience: number,
    userId: number,
  ): CancelablePromise<BaseResponse_boolean_ | any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/user/stats/admin/add/experience',
      query: {
        experience: experience,
        userId: userId,
      },
      errors: {
        401: `Unauthorized`,
        403: `Forbidden`,
        404: `Not Found`,
      },
    });
  }
  /**
   * addUserPointsByAdmin
   * @param points points
   * @param userId userId
   * @returns BaseResponse_boolean_ OK
   * @returns any Created
   * @throws ApiError
   */
  public static addUserPointsByAdminUsingPost(
    points: number,
    userId: number,
  ): CancelablePromise<BaseResponse_boolean_ | any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/user/stats/admin/add/points',
      query: {
        points: points,
        userId: userId,
      },
      errors: {
        401: `Unauthorized`,
        403: `Forbidden`,
        404: `Not Found`,
      },
    });
  }
  /**
   * initUserLearningStatsByAdmin
   * @param userId userId
   * @returns BaseResponse_long_ OK
   * @returns any Created
   * @throws ApiError
   */
  public static initUserLearningStatsByAdminUsingPost(
    userId: number,
  ): CancelablePromise<BaseResponse_long_ | any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/user/stats/admin/init',
      query: {
        userId: userId,
      },
      errors: {
        401: `Unauthorized`,
        403: `Forbidden`,
        404: `Not Found`,
      },
    });
  }
  /**
   * updateUserLevelByAdmin
   * @param newLevel newLevel
   * @param userId userId
   * @param nextLevelExp nextLevelExp
   * @returns BaseResponse_boolean_ OK
   * @returns any Created
   * @throws ApiError
   */
  public static updateUserLevelByAdminUsingPost(
    newLevel: number,
    userId: number,
    nextLevelExp?: number,
  ): CancelablePromise<BaseResponse_boolean_ | any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/user/stats/admin/update/level',
      query: {
        newLevel: newLevel,
        nextLevelExp: nextLevelExp,
        userId: userId,
      },
      errors: {
        401: `Unauthorized`,
        403: `Forbidden`,
        404: `Not Found`,
      },
    });
  }
  /**
   * getUserLearningStatsByAdmin
   * @param userId userId
   * @returns BaseResponse_UserLearningStats_ OK
   * @throws ApiError
   */
  public static getUserLearningStatsByAdminUsingGet(
    userId: number,
  ): CancelablePromise<BaseResponse_UserLearningStats_> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/user/stats/admin/user',
      query: {
        userId: userId,
      },
      errors: {
        401: `Unauthorized`,
        403: `Forbidden`,
        404: `Not Found`,
      },
    });
  }
  /**
   * userCheckIn
   * @returns BaseResponse_Map_string_object_ OK
   * @returns any Created
   * @throws ApiError
   */
  public static userCheckInUsingPost(): CancelablePromise<
    BaseResponse_Map_string_object_ | any
  > {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/user/stats/check-in',
      errors: {
        401: `Unauthorized`,
        403: `Forbidden`,
        404: `Not Found`,
      },
    });
  }
  /**
   * getMyLearningStats
   * @returns BaseResponse_UserLearningStats_ OK
   * @throws ApiError
   */
  public static getMyLearningStatsUsingGet(): CancelablePromise<BaseResponse_UserLearningStats_> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/user/stats/my',
      errors: {
        401: `Unauthorized`,
        403: `Forbidden`,
        404: `Not Found`,
      },
    });
  }
  /**
   * updateLearningDay
   * @returns BaseResponse_boolean_ OK
   * @returns any Created
   * @throws ApiError
   */
  public static updateLearningDayUsingPost(): CancelablePromise<
    BaseResponse_boolean_ | any
  > {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/user/stats/update/learning-day',
      errors: {
        401: `Unauthorized`,
        403: `Forbidden`,
        404: `Not Found`,
      },
    });
  }
}
