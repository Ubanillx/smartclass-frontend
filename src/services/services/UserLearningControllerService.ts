/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseResponse_boolean_ } from '../models/BaseResponse_boolean_';
import type { BaseResponse_int_ } from '../models/BaseResponse_int_';
import type { BaseResponse_IPage_UserLearningRecord_ } from '../models/BaseResponse_IPage_UserLearningRecord_';
import type { BaseResponse_List_UserLearningRecord_ } from '../models/BaseResponse_List_UserLearningRecord_';
import type { BaseResponse_UserDailyGoal_ } from '../models/BaseResponse_UserDailyGoal_';
import type { BaseResponse_UserLearningRecord_ } from '../models/BaseResponse_UserLearningRecord_';
import type { BaseResponse_UserLearningStats_ } from '../models/BaseResponse_UserLearningStats_';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class UserLearningControllerService {
    /**
     * getUserDailyGoal
     * @param userId userId
     * @returns BaseResponse_UserDailyGoal_ OK
     * @throws ApiError
     */
    public static getUserDailyGoalUsingGet(
        userId: number,
    ): CancelablePromise<BaseResponse_UserDailyGoal_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/api/learning/daily-goal',
            query: {
                'userId': userId,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * getConsecutiveCompletedDays
     * @param userId userId
     * @returns BaseResponse_int_ OK
     * @throws ApiError
     */
    public static getConsecutiveCompletedDaysUsingGet(
        userId: number,
    ): CancelablePromise<BaseResponse_int_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/api/learning/daily-goal/consecutive-days',
            query: {
                'userId': userId,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * createUserDailyGoal
     * @param targetMinutes targetMinutes
     * @param userId userId
     * @returns BaseResponse_UserDailyGoal_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static createUserDailyGoalUsingPost(
        targetMinutes: number,
        userId: number,
    ): CancelablePromise<BaseResponse_UserDailyGoal_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/api/learning/daily-goal/create',
            query: {
                'targetMinutes': targetMinutes,
                'userId': userId,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * isDailyGoalCompleted
     * @param userId userId
     * @returns BaseResponse_boolean_ OK
     * @throws ApiError
     */
    public static isDailyGoalCompletedUsingGet(
        userId: number,
    ): CancelablePromise<BaseResponse_boolean_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/api/learning/daily-goal/is-completed',
            query: {
                'userId': userId,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * updateLearningTime
     * @param minutesSpent minutesSpent
     * @param userId userId
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static updateLearningTimeUsingPost(
        minutesSpent: number,
        userId: number,
    ): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/api/learning/daily-goal/update-time',
            query: {
                'minutesSpent': minutesSpent,
                'userId': userId,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * createArticleReadingRecord
     * @param articleId articleId
     * @param duration duration
     * @param userId userId
     * @returns BaseResponse_UserLearningRecord_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static createArticleReadingRecordUsingPost(
        articleId: number,
        duration: number,
        userId: number,
    ): CancelablePromise<BaseResponse_UserLearningRecord_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/api/learning/record/article',
            query: {
                'articleId': articleId,
                'duration': duration,
                'userId': userId,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * createCourseLearningRecord
     * @param courseId courseId
     * @param minutesSpent minutesSpent
     * @param sectionId sectionId
     * @param userId userId
     * @returns BaseResponse_UserLearningRecord_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static createCourseLearningRecordUsingPost(
        courseId: number,
        minutesSpent: number,
        sectionId: number,
        userId: number,
    ): CancelablePromise<BaseResponse_UserLearningRecord_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/api/learning/record/course',
            query: {
                'courseId': courseId,
                'minutesSpent': minutesSpent,
                'sectionId': sectionId,
                'userId': userId,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * getUserLearningRecordsByDate
     * @param date date
     * @param userId userId
     * @returns BaseResponse_List_UserLearningRecord_ OK
     * @throws ApiError
     */
    public static getUserLearningRecordsByDateUsingGet(
        date: string,
        userId: number,
    ): CancelablePromise<BaseResponse_List_UserLearningRecord_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/api/learning/record/date',
            query: {
                'date': date,
                'userId': userId,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * getUserLearningRecords
     * @param userId userId
     * @param current current
     * @param size size
     * @returns BaseResponse_IPage_UserLearningRecord_ OK
     * @throws ApiError
     */
    public static getUserLearningRecordsUsingGet(
        userId: number,
        current: number = 1,
        size: number = 10,
    ): CancelablePromise<BaseResponse_IPage_UserLearningRecord_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/api/learning/record/page',
            query: {
                'current': current,
                'size': size,
                'userId': userId,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * getUserLearningRecordsByRelatedId
     * @param relatedId relatedId
     * @param userId userId
     * @returns BaseResponse_List_UserLearningRecord_ OK
     * @throws ApiError
     */
    public static getUserLearningRecordsByRelatedIdUsingGet(
        relatedId: number,
        userId: number,
    ): CancelablePromise<BaseResponse_List_UserLearningRecord_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/api/learning/record/related',
            query: {
                'relatedId': relatedId,
                'userId': userId,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * getUserLearningRecordsByType
     * @param recordType recordType
     * @param userId userId
     * @param current current
     * @param size size
     * @returns BaseResponse_IPage_UserLearningRecord_ OK
     * @throws ApiError
     */
    public static getUserLearningRecordsByTypeUsingGet(
        recordType: string,
        userId: number,
        current: number = 1,
        size: number = 10,
    ): CancelablePromise<BaseResponse_IPage_UserLearningRecord_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/api/learning/record/type',
            query: {
                'current': current,
                'recordType': recordType,
                'size': size,
                'userId': userId,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * createWordLearningRecord
     * @param count count
     * @param userId userId
     * @param wordId wordId
     * @returns BaseResponse_UserLearningRecord_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static createWordLearningRecordUsingPost(
        count: number,
        userId: number,
        wordId: number,
    ): CancelablePromise<BaseResponse_UserLearningRecord_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/api/learning/record/word',
            query: {
                'count': count,
                'userId': userId,
                'wordId': wordId,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * getUserLearningStats
     * @param userId userId
     * @returns BaseResponse_UserLearningStats_ OK
     * @throws ApiError
     */
    public static getUserLearningStatsUsingGet(
        userId: number,
    ): CancelablePromise<BaseResponse_UserLearningStats_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/api/learning/stats',
            query: {
                'userId': userId,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * addExperience
     * @param experience experience
     * @param userId userId
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static addExperienceUsingPost(
        experience: number,
        userId: number,
    ): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/api/learning/stats/add-experience',
            query: {
                'experience': experience,
                'userId': userId,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * addPoints
     * @param points points
     * @param userId userId
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static addPointsUsingPost(
        points: number,
        userId: number,
    ): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/api/learning/stats/add-points',
            query: {
                'points': points,
                'userId': userId,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * getConsecutiveLearningDays
     * @param userId userId
     * @returns BaseResponse_int_ OK
     * @throws ApiError
     */
    public static getConsecutiveLearningDaysUsingGet(
        userId: number,
    ): CancelablePromise<BaseResponse_int_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/api/learning/stats/consecutive-days',
            query: {
                'userId': userId,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * updateLearningStats
     * @param userId userId
     * @param articlesRead articlesRead
     * @param minutesSpent minutesSpent
     * @param wordsLearned wordsLearned
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static updateLearningStatsUsingPost(
        userId: number,
        articlesRead?: number,
        minutesSpent?: number,
        wordsLearned?: number,
    ): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/api/learning/stats/update',
            query: {
                'articlesRead': articlesRead,
                'minutesSpent': minutesSpent,
                'userId': userId,
                'wordsLearned': wordsLearned,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
}
