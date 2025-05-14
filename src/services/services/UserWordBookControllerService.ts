/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseResponse_Array_int_ } from '../models/BaseResponse_Array_int_';
import type { BaseResponse_boolean_ } from '../models/BaseResponse_boolean_';
import type { BaseResponse_List_UserWordBookVO_ } from '../models/BaseResponse_List_UserWordBookVO_';
import type { BaseResponse_Page_UserWordBookVO_ } from '../models/BaseResponse_Page_UserWordBookVO_';
import type { UserWordBookAddRequest } from '../models/UserWordBookAddRequest';
import type { UserWordBookUpdateDifficultyRequest } from '../models/UserWordBookUpdateDifficultyRequest';
import type { UserWordBookUpdateStatusRequest } from '../models/UserWordBookUpdateStatusRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class UserWordBookControllerService {
    /**
     * getUserWordBookList
     * @param isCollected isCollected
     * @param learningStatus learningStatus
     * @returns BaseResponse_List_UserWordBookVO_ OK
     * @throws ApiError
     */
    public static getUserWordBookListUsingGet(
        isCollected?: number,
        learningStatus?: number,
    ): CancelablePromise<BaseResponse_List_UserWordBookVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/word-books',
            query: {
                'isCollected': isCollected,
                'learningStatus': learningStatus,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * addToWordBook
     * @param addRequest addRequest
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static addToWordBookUsingPost(
        addRequest: UserWordBookAddRequest,
    ): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/word-books',
            body: addRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * listUserWordBookByPage
     * @param createTime
     * @param createTimeEnd
     * @param createTimeStart
     * @param current
     * @param difficulty
     * @param id
     * @param isCollected
     * @param learningStatus
     * @param pageSize
     * @param sortField
     * @param sortOrder
     * @param userId
     * @param word
     * @param wordId
     * @returns BaseResponse_Page_UserWordBookVO_ OK
     * @throws ApiError
     */
    public static listUserWordBookByPageUsingGet(
        createTime?: string,
        createTimeEnd?: string,
        createTimeStart?: string,
        current?: number,
        difficulty?: number,
        id?: number,
        isCollected?: number,
        learningStatus?: number,
        pageSize?: number,
        sortField?: string,
        sortOrder?: string,
        userId?: number,
        word?: string,
        wordId?: number,
    ): CancelablePromise<BaseResponse_Page_UserWordBookVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/word-books/page',
            query: {
                'createTime': createTime,
                'createTimeEnd': createTimeEnd,
                'createTimeStart': createTimeStart,
                'current': current,
                'difficulty': difficulty,
                'id': id,
                'isCollected': isCollected,
                'learningStatus': learningStatus,
                'pageSize': pageSize,
                'sortField': sortField,
                'sortOrder': sortOrder,
                'userId': userId,
                'word': word,
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
     * getUserWordBookStatistics
     * @returns BaseResponse_Array_int_ OK
     * @throws ApiError
     */
    public static getUserWordBookStatisticsUsingGet(): CancelablePromise<BaseResponse_Array_int_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/word-books/statistics',
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * removeFromWordBook
     * @param wordId wordId
     * @returns BaseResponse_boolean_ OK
     * @throws ApiError
     */
    public static removeFromWordBookUsingDelete(
        wordId: number,
    ): CancelablePromise<BaseResponse_boolean_> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/word-books/{wordId}',
            path: {
                'wordId': wordId,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
            },
        });
    }
    /**
     * updateDifficulty
     * @param difficultyRequest difficultyRequest
     * @param wordId wordId
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static updateDifficultyUsingPut(
        difficultyRequest: UserWordBookUpdateDifficultyRequest,
        wordId: number,
    ): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/word-books/{wordId}/difficulty',
            path: {
                'wordId': wordId,
            },
            body: difficultyRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * isWordInUserBook
     * @param wordId wordId
     * @returns BaseResponse_boolean_ OK
     * @throws ApiError
     */
    public static isWordInUserBookUsingGet(
        wordId: number,
    ): CancelablePromise<BaseResponse_boolean_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/word-books/{wordId}/exists',
            path: {
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
     * updateLearningStatus
     * @param updateStatusRequest updateStatusRequest
     * @param wordId wordId
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static updateLearningStatusUsingPut(
        updateStatusRequest: UserWordBookUpdateStatusRequest,
        wordId: number,
    ): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/word-books/{wordId}/status',
            path: {
                'wordId': wordId,
            },
            body: updateStatusRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
}
