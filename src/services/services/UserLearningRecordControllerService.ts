/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseResponse_boolean_ } from '../models/BaseResponse_boolean_';
import type { BaseResponse_List_Map_string_object_ } from '../models/BaseResponse_List_Map_string_object_';
import type { BaseResponse_long_ } from '../models/BaseResponse_long_';
import type { BaseResponse_Map_string_object_ } from '../models/BaseResponse_Map_string_object_';
import type { BaseResponse_Page_UserLearningRecordVO_ } from '../models/BaseResponse_Page_UserLearningRecordVO_';
import type { BaseResponse_UserLearningRecordVO_ } from '../models/BaseResponse_UserLearningRecordVO_';
import type { DeleteRequest } from '../models/DeleteRequest';
import type { UserLearningRecordAddRequest } from '../models/UserLearningRecordAddRequest';
import type { UserLearningRecordQueryRequest } from '../models/UserLearningRecordQueryRequest';
import type { UserLearningRecordUpdateRequest } from '../models/UserLearningRecordUpdateRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class UserLearningRecordControllerService {
    /**
     * addUserLearningRecord
     * @param userLearningRecordAddRequest userLearningRecordAddRequest
     * @returns BaseResponse_long_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static addUserLearningRecordUsingPost(
        userLearningRecordAddRequest: UserLearningRecordAddRequest,
    ): CancelablePromise<BaseResponse_long_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/user/learning/record/add',
            body: userLearningRecordAddRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * deleteUserLearningRecord
     * @param deleteRequest deleteRequest
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static deleteUserLearningRecordUsingPost(
        deleteRequest: DeleteRequest,
    ): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/user/learning/record/delete',
            body: deleteRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * getUserLearningRecordById
     * @param id id
     * @returns BaseResponse_UserLearningRecordVO_ OK
     * @throws ApiError
     */
    public static getUserLearningRecordByIdUsingGet(
        id?: number,
    ): CancelablePromise<BaseResponse_UserLearningRecordVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/user/learning/record/get',
            query: {
                'id': id,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * listUserLearningRecordByPage
     * @param userLearningRecordQueryRequest userLearningRecordQueryRequest
     * @returns BaseResponse_Page_UserLearningRecordVO_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static listUserLearningRecordByPageUsingPost(
        userLearningRecordQueryRequest: UserLearningRecordQueryRequest,
    ): CancelablePromise<BaseResponse_Page_UserLearningRecordVO_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/user/learning/record/list/page',
            body: userLearningRecordQueryRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * listMyUserLearningRecordByPage
     * @param userLearningRecordQueryRequest userLearningRecordQueryRequest
     * @returns BaseResponse_Page_UserLearningRecordVO_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static listMyUserLearningRecordByPageUsingPost(
        userLearningRecordQueryRequest: UserLearningRecordQueryRequest,
    ): CancelablePromise<BaseResponse_Page_UserLearningRecordVO_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/user/learning/record/my/list/page',
            body: userLearningRecordQueryRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * getMyLearningCountStats
     * @param endDate endDate
     * @param startDate startDate
     * @returns BaseResponse_List_Map_string_object_ OK
     * @throws ApiError
     */
    public static getMyLearningCountStatsUsingGet(
        endDate?: string,
        startDate?: string,
    ): CancelablePromise<BaseResponse_List_Map_string_object_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/user/learning/record/my/stats/count',
            query: {
                'endDate': endDate,
                'startDate': startDate,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * getMyDailyLearningStats
     * @param endDate endDate
     * @param startDate startDate
     * @returns BaseResponse_List_Map_string_object_ OK
     * @throws ApiError
     */
    public static getMyDailyLearningStatsUsingGet(
        endDate?: string,
        startDate?: string,
    ): CancelablePromise<BaseResponse_List_Map_string_object_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/user/learning/record/my/stats/daily',
            query: {
                'endDate': endDate,
                'startDate': startDate,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * getMyLearningDurationStats
     * @param endDate endDate
     * @param startDate startDate
     * @returns BaseResponse_List_Map_string_object_ OK
     * @throws ApiError
     */
    public static getMyLearningDurationStatsUsingGet(
        endDate?: string,
        startDate?: string,
    ): CancelablePromise<BaseResponse_List_Map_string_object_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/user/learning/record/my/stats/duration',
            query: {
                'endDate': endDate,
                'startDate': startDate,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * getMyPointsAndExperienceStats
     * @param endDate endDate
     * @param startDate startDate
     * @returns BaseResponse_Map_string_object_ OK
     * @throws ApiError
     */
    public static getMyPointsAndExperienceStatsUsingGet(
        endDate?: string,
        startDate?: string,
    ): CancelablePromise<BaseResponse_Map_string_object_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/user/learning/record/my/stats/points',
            query: {
                'endDate': endDate,
                'startDate': startDate,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * recordCourseStudy
     * @param courseId courseId
     * @param duration duration
     * @param progress progress
     * @param sectionId sectionId
     * @returns BaseResponse_long_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static recordCourseStudyUsingPost(
        courseId: number,
        duration: number,
        progress?: number,
        sectionId?: number,
    ): CancelablePromise<BaseResponse_long_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/user/learning/record/record/course',
            query: {
                'courseId': courseId,
                'duration': duration,
                'progress': progress,
                'sectionId': sectionId,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * recordListeningPractice
     * @param duration duration
     * @param listeningId listeningId
     * @param accuracy accuracy
     * @returns BaseResponse_long_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static recordListeningPracticeUsingPost(
        duration: number,
        listeningId: number,
        accuracy?: number,
    ): CancelablePromise<BaseResponse_long_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/user/learning/record/record/listening',
            query: {
                'accuracy': accuracy,
                'duration': duration,
                'listeningId': listeningId,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * recordReadingPractice
     * @param articleId articleId
     * @param duration duration
     * @param accuracy accuracy
     * @returns BaseResponse_long_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static recordReadingPracticeUsingPost(
        articleId: number,
        duration: number,
        accuracy?: number,
    ): CancelablePromise<BaseResponse_long_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/user/learning/record/record/reading',
            query: {
                'accuracy': accuracy,
                'articleId': articleId,
                'duration': duration,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * recordWordStudy
     * @param wordId wordId
     * @param accuracy accuracy
     * @param count count
     * @returns BaseResponse_long_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static recordWordStudyUsingPost(
        wordId: number,
        accuracy?: number,
        count?: number,
    ): CancelablePromise<BaseResponse_long_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/user/learning/record/record/word',
            query: {
                'accuracy': accuracy,
                'count': count,
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
     * updateUserLearningRecord
     * @param userLearningRecordUpdateRequest userLearningRecordUpdateRequest
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static updateUserLearningRecordUsingPost(
        userLearningRecordUpdateRequest: UserLearningRecordUpdateRequest,
    ): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/user/learning/record/update',
            body: userLearningRecordUpdateRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
}
