/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseResponse_boolean_ } from '../models/BaseResponse_boolean_';
import type { BaseResponse_DailyArticleVO_ } from '../models/BaseResponse_DailyArticleVO_';
import type { BaseResponse_long_ } from '../models/BaseResponse_long_';
import type { BaseResponse_Page_DailyArticle_ } from '../models/BaseResponse_Page_DailyArticle_';
import type { BaseResponse_Page_DailyArticleVO_ } from '../models/BaseResponse_Page_DailyArticleVO_';
import type { DailyArticleAddRequest } from '../models/DailyArticleAddRequest';
import type { DailyArticleQueryRequest } from '../models/DailyArticleQueryRequest';
import type { DailyArticleUpdateRequest } from '../models/DailyArticleUpdateRequest';
import type { DeleteRequest_1 } from '../models/DeleteRequest_1';
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
            url: '/api/dailyArticle/add',
            body: dailyArticleAddRequest,
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
        deleteRequest: DeleteRequest_1,
    ): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/dailyArticle/delete',
            body: deleteRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * testEsIndex
     * @returns BaseResponse_boolean_ OK
     * @throws ApiError
     */
    public static testEsIndexUsingGet(): CancelablePromise<BaseResponse_boolean_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/dailyArticle/es/test',
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * getDailyArticleVOById
     * @param id id
     * @returns BaseResponse_DailyArticleVO_ OK
     * @throws ApiError
     */
    public static getDailyArticleVoByIdUsingGet(
        id?: number,
    ): CancelablePromise<BaseResponse_DailyArticleVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/dailyArticle/get/vo',
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
     * @returns BaseResponse_Page_DailyArticle_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static listDailyArticleByPageUsingPost(
        dailyArticleQueryRequest: DailyArticleQueryRequest,
    ): CancelablePromise<BaseResponse_Page_DailyArticle_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/dailyArticle/list/page',
            body: dailyArticleQueryRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * listDailyArticleVOByPage
     * @param dailyArticleQueryRequest dailyArticleQueryRequest
     * @returns BaseResponse_Page_DailyArticleVO_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static listDailyArticleVoByPageUsingPost(
        dailyArticleQueryRequest: DailyArticleQueryRequest,
    ): CancelablePromise<BaseResponse_Page_DailyArticleVO_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/dailyArticle/list/page/vo',
            body: dailyArticleQueryRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * searchDailyArticle
     * @param dailyArticleQueryRequest dailyArticleQueryRequest
     * @returns BaseResponse_Page_DailyArticleVO_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static searchDailyArticleUsingPost(
        dailyArticleQueryRequest: DailyArticleQueryRequest,
    ): CancelablePromise<BaseResponse_Page_DailyArticleVO_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/dailyArticle/search/es',
            body: dailyArticleQueryRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * getTodayArticle
     * @returns BaseResponse_DailyArticleVO_ OK
     * @throws ApiError
     */
    public static getTodayArticleUsingGet(): CancelablePromise<BaseResponse_DailyArticleVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/dailyArticle/today',
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
            url: '/api/dailyArticle/update',
            body: dailyArticleUpdateRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
}
