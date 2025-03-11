/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseResponse_boolean_ } from '../models/BaseResponse_boolean_';
import type { BaseResponse_DailyWordVO_ } from '../models/BaseResponse_DailyWordVO_';
import type { BaseResponse_List_DailyWordVO_ } from '../models/BaseResponse_List_DailyWordVO_';
import type { BaseResponse_long_ } from '../models/BaseResponse_long_';
import type { BaseResponse_Page_DailyWordVO_ } from '../models/BaseResponse_Page_DailyWordVO_';
import type { DailyWordAddRequest } from '../models/DailyWordAddRequest';
import type { DailyWordQueryRequest } from '../models/DailyWordQueryRequest';
import type { DailyWordUpdateRequest } from '../models/DailyWordUpdateRequest';
import type { DeleteRequest } from '../models/DeleteRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
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
            url: '/api/daily/word/add',
            body: dailyWordAddRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * listDailyWordsByCategory
     * @param category category
     * @param limit limit
     * @returns BaseResponse_List_DailyWordVO_ OK
     * @throws ApiError
     */
    public static listDailyWordsByCategoryUsingGet(
        category: string,
        limit: number = 10,
    ): CancelablePromise<BaseResponse_List_DailyWordVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/daily/word/category',
            query: {
                'category': category,
                'limit': limit,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * getDailyWordsByDate
     * @param date date
     * @returns BaseResponse_List_DailyWordVO_ OK
     * @throws ApiError
     */
    public static getDailyWordsByDateUsingGet(
        date: string,
    ): CancelablePromise<BaseResponse_List_DailyWordVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/daily/word/date',
            query: {
                'date': date,
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
        deleteRequest: DeleteRequest,
    ): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/daily/word/delete',
            body: deleteRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * listDailyWordsByDifficulty
     * @param difficulty difficulty
     * @param limit limit
     * @returns BaseResponse_List_DailyWordVO_ OK
     * @throws ApiError
     */
    public static listDailyWordsByDifficultyUsingGet(
        difficulty: number,
        limit: number = 10,
    ): CancelablePromise<BaseResponse_List_DailyWordVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/daily/word/difficulty',
            query: {
                'difficulty': difficulty,
                'limit': limit,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * getDailyWordById
     * @param id id
     * @returns BaseResponse_DailyWordVO_ OK
     * @throws ApiError
     */
    public static getDailyWordByIdUsingGet(
        id?: number,
    ): CancelablePromise<BaseResponse_DailyWordVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/daily/word/get',
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
     * listDailyWordByPage
     * @param dailyWordQueryRequest dailyWordQueryRequest
     * @returns BaseResponse_Page_DailyWordVO_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static listDailyWordByPageUsingPost(
        dailyWordQueryRequest: DailyWordQueryRequest,
    ): CancelablePromise<BaseResponse_Page_DailyWordVO_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/daily/word/list/page',
            body: dailyWordQueryRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * getTodayWords
     * @returns BaseResponse_List_DailyWordVO_ OK
     * @throws ApiError
     */
    public static getTodayWordsUsingGet(): CancelablePromise<BaseResponse_List_DailyWordVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/daily/word/today',
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
            url: '/api/daily/word/update',
            body: dailyWordUpdateRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
}
