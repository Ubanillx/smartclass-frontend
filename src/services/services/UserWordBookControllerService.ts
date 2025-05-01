/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseResponse_Array_int_ } from '../models/BaseResponse_Array_int_';
import type { BaseResponse_boolean_ } from '../models/BaseResponse_boolean_';
import type { BaseResponse_List_UserWordBookVO_ } from '../models/BaseResponse_List_UserWordBookVO_';
import type { BaseResponse_Page_UserWordBookVO_ } from '../models/BaseResponse_Page_UserWordBookVO_';
import type { UserWordBookAddRequest } from '../models/UserWordBookAddRequest';
import type { UserWordBookCollectionRequest } from '../models/UserWordBookCollectionRequest';
import type { UserWordBookQueryRequest } from '../models/UserWordBookQueryRequest';
import type { UserWordBookUpdateDifficultyRequest } from '../models/UserWordBookUpdateDifficultyRequest';
import type { UserWordBookUpdateStatusRequest } from '../models/UserWordBookUpdateStatusRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class UserWordBookControllerService {
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
            url: '/api/wordBook/add',
            body: addRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * updateCollectionStatus
     * @param collectionRequest collectionRequest
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static updateCollectionStatusUsingPost(
        collectionRequest: UserWordBookCollectionRequest,
    ): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/wordBook/collect',
            body: collectionRequest,
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
            url: '/api/wordBook/isInBook',
            query: {
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
            url: '/api/wordBook/list',
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
     * listUserWordBookByPage
     * @param userWordBookQueryRequest userWordBookQueryRequest
     * @returns BaseResponse_Page_UserWordBookVO_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static listUserWordBookByPageUsingPost(
        userWordBookQueryRequest: UserWordBookQueryRequest,
    ): CancelablePromise<BaseResponse_Page_UserWordBookVO_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/wordBook/list/page',
            body: userWordBookQueryRequest,
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
     * @returns any Created
     * @throws ApiError
     */
    public static removeFromWordBookUsingPost(
        wordId: number,
    ): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/wordBook/remove',
            query: {
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
            url: '/api/wordBook/statistics',
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * updateDifficulty
     * @param difficultyRequest difficultyRequest
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static updateDifficultyUsingPost(
        difficultyRequest: UserWordBookUpdateDifficultyRequest,
    ): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/wordBook/updateDifficulty',
            body: difficultyRequest,
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
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static updateLearningStatusUsingPost(
        updateStatusRequest: UserWordBookUpdateStatusRequest,
    ): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/wordBook/updateStatus',
            body: updateStatusRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
}
