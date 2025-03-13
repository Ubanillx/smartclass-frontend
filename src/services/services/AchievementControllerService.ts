/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Achievement } from '../models/Achievement.ts';
import type { AchievementDisplay } from '../models/AchievementDisplay.ts';
import type { BaseResponse_Achievement_ } from '../models/BaseResponse_Achievement_.ts';
import type { BaseResponse_AchievementDisplay_ } from '../models/BaseResponse_AchievementDisplay_.ts';
import type { BaseResponse_boolean_ } from '../models/BaseResponse_boolean_.ts';
import type { BaseResponse_IPage_Achievement_ } from '../models/BaseResponse_IPage_Achievement_.ts';
import type { BaseResponse_List_Achievement_ } from '../models/BaseResponse_List_Achievement_.ts';
import type { BaseResponse_List_AchievementDisplay_ } from '../models/BaseResponse_List_AchievementDisplay_.ts';
import type { BaseResponse_List_UserAchievement_ } from '../models/BaseResponse_List_UserAchievement_.ts';
import type { BaseResponse_long_ } from '../models/BaseResponse_long_.ts';
import type { BaseResponse_UserAchievement_ } from '../models/BaseResponse_UserAchievement_.ts';
import type { CancelablePromise } from '../core/CancelablePromise.ts';
import { OpenAPI } from '../core/OpenAPI.ts';
import { request as __request } from '../core/request.ts';
export class AchievementControllerService {
  /**
   * getAchievementsByCategory
   * @param category category
   * @returns BaseResponse_List_Achievement_ OK
   * @throws ApiError
   */
  public static getAchievementsByCategoryUsingGet(
    category: string,
  ): CancelablePromise<BaseResponse_List_Achievement_> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/api/achievement/category',
      query: {
        category: category,
      },
      errors: {
        401: `Unauthorized`,
        403: `Forbidden`,
        404: `Not Found`,
      },
    });
  }
  /**
   * createAchievement
   * @param achievement achievement
   * @returns BaseResponse_long_ OK
   * @returns any Created
   * @throws ApiError
   */
  public static createAchievementUsingPost(
    achievement: Achievement,
  ): CancelablePromise<BaseResponse_long_ | any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/api/achievement/create',
      body: achievement,
      errors: {
        401: `Unauthorized`,
        403: `Forbidden`,
        404: `Not Found`,
      },
    });
  }
  /**
   * deleteAchievement
   * @param achievementId achievementId
   * @returns BaseResponse_boolean_ OK
   * @returns any Created
   * @throws ApiError
   */
  public static deleteAchievementUsingPost(
    achievementId: number,
  ): CancelablePromise<BaseResponse_boolean_ | any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/api/achievement/delete',
      query: {
        achievementId: achievementId,
      },
      errors: {
        401: `Unauthorized`,
        403: `Forbidden`,
        404: `Not Found`,
      },
    });
  }
  /**
   * createAchievementDisplay
   * @param display display
   * @returns BaseResponse_long_ OK
   * @returns any Created
   * @throws ApiError
   */
  public static createAchievementDisplayUsingPost(
    display: AchievementDisplay,
  ): CancelablePromise<BaseResponse_long_ | any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/api/achievement/display/create',
      body: display,
      errors: {
        401: `Unauthorized`,
        403: `Forbidden`,
        404: `Not Found`,
      },
    });
  }
  /**
   * deleteAchievementDisplay
   * @param displayId displayId
   * @returns BaseResponse_boolean_ OK
   * @returns any Created
   * @throws ApiError
   */
  public static deleteAchievementDisplayUsingPost(
    displayId: number,
  ): CancelablePromise<BaseResponse_boolean_ | any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/api/achievement/display/delete',
      query: {
        displayId: displayId,
      },
      errors: {
        401: `Unauthorized`,
        403: `Forbidden`,
        404: `Not Found`,
      },
    });
  }
  /**
   * getAchievementDisplays
   * @param achievementId achievementId
   * @returns BaseResponse_List_AchievementDisplay_ OK
   * @throws ApiError
   */
  public static getAchievementDisplaysUsingGet(
    achievementId: number,
  ): CancelablePromise<BaseResponse_List_AchievementDisplay_> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/api/achievement/display/list',
      query: {
        achievementId: achievementId,
      },
      errors: {
        401: `Unauthorized`,
        403: `Forbidden`,
        404: `Not Found`,
      },
    });
  }
  /**
   * getAchievementDisplayByType
   * @param achievementId achievementId
   * @param displayType displayType
   * @returns BaseResponse_AchievementDisplay_ OK
   * @throws ApiError
   */
  public static getAchievementDisplayByTypeUsingGet(
    achievementId: number,
    displayType: string,
  ): CancelablePromise<BaseResponse_AchievementDisplay_> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/api/achievement/display/type',
      query: {
        achievementId: achievementId,
        displayType: displayType,
      },
      errors: {
        401: `Unauthorized`,
        403: `Forbidden`,
        404: `Not Found`,
      },
    });
  }
  /**
   * updateAchievementDisplay
   * @param display display
   * @returns BaseResponse_boolean_ OK
   * @returns any Created
   * @throws ApiError
   */
  public static updateAchievementDisplayUsingPost(
    display: AchievementDisplay,
  ): CancelablePromise<BaseResponse_boolean_ | any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/api/achievement/display/update',
      body: display,
      errors: {
        401: `Unauthorized`,
        403: `Forbidden`,
        404: `Not Found`,
      },
    });
  }
  /**
   * getAchievementById
   * @param id id
   * @returns BaseResponse_Achievement_ OK
   * @throws ApiError
   */
  public static getAchievementByIdUsingGet(
    id: number,
  ): CancelablePromise<BaseResponse_Achievement_> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/api/achievement/get',
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
   * getAchievementsByLevel
   * @param level level
   * @returns BaseResponse_List_Achievement_ OK
   * @throws ApiError
   */
  public static getAchievementsByLevelUsingGet(
    level: number,
  ): CancelablePromise<BaseResponse_List_Achievement_> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/api/achievement/level',
      query: {
        level: level,
      },
      errors: {
        401: `Unauthorized`,
        403: `Forbidden`,
        404: `Not Found`,
      },
    });
  }
  /**
   * pageAchievements
   * @param achievementCondition
   * @param adminId
   * @param badgeUrl
   * @param bannerUrl
   * @param category
   * @param conditionType
   * @param conditionValue
   * @param createTime
   * @param description
   * @param iconUrl
   * @param id
   * @param isDelete
   * @param isHidden
   * @param isSecret
   * @param level
   * @param name
   * @param points
   * @param rewardType
   * @param rewardValue
   * @param sort
   * @param updateTime
   * @param current current
   * @param size size
   * @returns BaseResponse_IPage_Achievement_ OK
   * @throws ApiError
   */
  public static pageAchievementsUsingGet(
    achievementCondition?: string,
    adminId?: number,
    badgeUrl?: string,
    bannerUrl?: string,
    category?: string,
    conditionType?: string,
    conditionValue?: number,
    createTime?: string,
    description?: string,
    iconUrl?: string,
    id?: number,
    isDelete?: number,
    isHidden?: number,
    isSecret?: number,
    level?: number,
    name?: string,
    points?: number,
    rewardType?: string,
    rewardValue?: string,
    sort?: number,
    updateTime?: string,
    current: number = 1,
    size: number = 10,
  ): CancelablePromise<BaseResponse_IPage_Achievement_> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/api/achievement/page',
      query: {
        achievementCondition: achievementCondition,
        adminId: adminId,
        badgeUrl: badgeUrl,
        bannerUrl: bannerUrl,
        category: category,
        conditionType: conditionType,
        conditionValue: conditionValue,
        createTime: createTime,
        description: description,
        iconUrl: iconUrl,
        id: id,
        isDelete: isDelete,
        isHidden: isHidden,
        isSecret: isSecret,
        level: level,
        name: name,
        points: points,
        rewardType: rewardType,
        rewardValue: rewardValue,
        sort: sort,
        updateTime: updateTime,
        current: current,
        size: size,
      },
      errors: {
        401: `Unauthorized`,
        403: `Forbidden`,
        404: `Not Found`,
      },
    });
  }
  /**
   * updateAchievement
   * @param achievement achievement
   * @returns BaseResponse_boolean_ OK
   * @returns any Created
   * @throws ApiError
   */
  public static updateAchievementUsingPost(
    achievement: Achievement,
  ): CancelablePromise<BaseResponse_boolean_ | any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/api/achievement/update',
      body: achievement,
      errors: {
        401: `Unauthorized`,
        403: `Forbidden`,
        404: `Not Found`,
      },
    });
  }
  /**
   * getUserCompletedAchievements
   * @param userId userId
   * @returns BaseResponse_List_UserAchievement_ OK
   * @throws ApiError
   */
  public static getUserCompletedAchievementsUsingGet(
    userId: number,
  ): CancelablePromise<BaseResponse_List_UserAchievement_> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/api/achievement/user/completed',
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
   * createUserAchievement
   * @param achievementId achievementId
   * @param userId userId
   * @returns BaseResponse_UserAchievement_ OK
   * @returns any Created
   * @throws ApiError
   */
  public static createUserAchievementUsingPost(
    achievementId: number,
    userId: number,
  ): CancelablePromise<BaseResponse_UserAchievement_ | any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/api/achievement/user/create',
      query: {
        achievementId: achievementId,
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
   * grantAchievementReward
   * @param achievementId achievementId
   * @param userId userId
   * @returns BaseResponse_boolean_ OK
   * @returns any Created
   * @throws ApiError
   */
  public static grantAchievementRewardUsingPost(
    achievementId: number,
    userId: number,
  ): CancelablePromise<BaseResponse_boolean_ | any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/api/achievement/user/grant-reward',
      query: {
        achievementId: achievementId,
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
   * getUserAchievements
   * @param userId userId
   * @returns BaseResponse_List_UserAchievement_ OK
   * @throws ApiError
   */
  public static getUserAchievementsUsingGet(
    userId: number,
  ): CancelablePromise<BaseResponse_List_UserAchievement_> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/api/achievement/user/list',
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
   * getUserUncompletedAchievements
   * @param userId userId
   * @returns BaseResponse_List_UserAchievement_ OK
   * @throws ApiError
   */
  public static getUserUncompletedAchievementsUsingGet(
    userId: number,
  ): CancelablePromise<BaseResponse_List_UserAchievement_> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/api/achievement/user/uncompleted',
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
   * updateUserAchievementProgress
   * @param achievementId achievementId
   * @param progressIncrement progressIncrement
   * @param userId userId
   * @returns BaseResponse_boolean_ OK
   * @returns any Created
   * @throws ApiError
   */
  public static updateUserAchievementProgressUsingPost(
    achievementId: number,
    progressIncrement: number,
    userId: number,
  ): CancelablePromise<BaseResponse_boolean_ | any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/api/achievement/user/update-progress',
      query: {
        achievementId: achievementId,
        progressIncrement: progressIncrement,
        userId: userId,
      },
      errors: {
        401: `Unauthorized`,
        403: `Forbidden`,
        404: `Not Found`,
      },
    });
  }
}
