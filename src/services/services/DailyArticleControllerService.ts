/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseResponse_boolean_ } from '../models/BaseResponse_boolean_';
import type { BaseResponse_DailyArticleVO_ } from '../models/BaseResponse_DailyArticleVO_';
import type { BaseResponse_List_DailyArticleVO_ } from '../models/BaseResponse_List_DailyArticleVO_';
import type { BaseResponse_long_ } from '../models/BaseResponse_long_';
import type { BaseResponse_Page_DailyArticleVO_ } from '../models/BaseResponse_Page_DailyArticleVO_';
import type { DailyArticleAddRequest } from '../models/DailyArticleAddRequest';
import type { DailyArticleQueryRequest } from '../models/DailyArticleQueryRequest';
import type { DailyArticleUpdateRequest } from '../models/DailyArticleUpdateRequest';
import type { DeleteRequest } from '../models/DeleteRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class DailyArticleControllerService {
    /**
     * addDailyArticle
     * @param dailyArticleAddRequest dailyArticleAddRequest
     * @returns BaseResponse_long_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static addDailyArticleUsingPost(
        dailyArticleAddRequest: DailyArticleAddRequest,
    ): CancelablePromise<BaseResponse_long_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/daily/article/add',
            body: dailyArticleAddRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * listDailyArticlesByCategory
     * @param category category
     * @param limit limit
     * @returns BaseResponse_List_DailyArticleVO_ OK
     * @throws ApiError
     */
    public static listDailyArticlesByCategoryUsingGet(
        category: string,
        limit: number = 10,
    ): CancelablePromise<BaseResponse_List_DailyArticleVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/daily/article/category',
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
     * getDailyArticlesByDate
     * @param date date
     * @returns BaseResponse_List_DailyArticleVO_ OK
     * @throws ApiError
     */
    public static getDailyArticlesByDateUsingGet(
        date: string,
    ): CancelablePromise<BaseResponse_List_DailyArticleVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/daily/article/date',
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
     * deleteDailyArticle
     * @param deleteRequest deleteRequest
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static deleteDailyArticleUsingPost(
        deleteRequest: DeleteRequest,
    ): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/daily/article/delete',
            body: deleteRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * listDailyArticlesByDifficulty
     * @param difficulty difficulty
     * @param limit limit
     * @returns BaseResponse_List_DailyArticleVO_ OK
     * @throws ApiError
     */
    public static listDailyArticlesByDifficultyUsingGet(
        difficulty: number,
        limit: number = 10,
    ): CancelablePromise<BaseResponse_List_DailyArticleVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/daily/article/difficulty',
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
     * getDailyArticleById
     * @param id id
     * @returns BaseResponse_DailyArticleVO_ OK
     * @throws ApiError
     */
    public static getDailyArticleByIdUsingGet(
        id?: number,
    ): CancelablePromise<BaseResponse_DailyArticleVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/daily/article/get',
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
     * likeArticle
     * @param id id
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static likeArticleUsingPost(
        id: number,
    ): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/daily/article/like',
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
     * listDailyArticleByPage
     * @param dailyArticleQueryRequest dailyArticleQueryRequest
     * @returns BaseResponse_Page_DailyArticleVO_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static listDailyArticleByPageUsingPost(
        dailyArticleQueryRequest: DailyArticleQueryRequest,
    ): CancelablePromise<BaseResponse_Page_DailyArticleVO_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/daily/article/list/page',
            body: dailyArticleQueryRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * getTodayArticles
     * @returns BaseResponse_List_DailyArticleVO_ OK
     * @throws ApiError
     */
    public static getTodayArticlesUsingGet(): CancelablePromise<BaseResponse_List_DailyArticleVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/daily/article/today',
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * updateDailyArticle
     * @param dailyArticleUpdateRequest dailyArticleUpdateRequest
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static updateDailyArticleUsingPost(
        dailyArticleUpdateRequest: DailyArticleUpdateRequest,
    ): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/daily/article/update',
            body: dailyArticleUpdateRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
}
