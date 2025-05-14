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
import type { DailyArticleUpdateRequest } from '../models/DailyArticleUpdateRequest';
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
            url: '/api/daily-articles',
            body: dailyArticleAddRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * listDailyArticleByPage
     * @param adminId
     * @param author
     * @param category
     * @param content
     * @param createTime
     * @param current
     * @param difficulty
     * @param id
     * @param maxReadTime
     * @param minReadTime
     * @param minViewCount
     * @param pageSize
     * @param publishDateEnd
     * @param publishDateStart
     * @param sortField
     * @param sortOrder
     * @param source
     * @param summary
     * @param tags
     * @param title
     * @returns BaseResponse_Page_DailyArticle_ OK
     * @throws ApiError
     */
    public static listDailyArticleByPageUsingGet(
        adminId?: number,
        author?: string,
        category?: string,
        content?: string,
        createTime?: string,
        current?: number,
        difficulty?: number,
        id?: number,
        maxReadTime?: number,
        minReadTime?: number,
        minViewCount?: number,
        pageSize?: number,
        publishDateEnd?: string,
        publishDateStart?: string,
        sortField?: string,
        sortOrder?: string,
        source?: string,
        summary?: string,
        tags?: string,
        title?: string,
    ): CancelablePromise<BaseResponse_Page_DailyArticle_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/daily-articles/admin/page',
            query: {
                'adminId': adminId,
                'author': author,
                'category': category,
                'content': content,
                'createTime': createTime,
                'current': current,
                'difficulty': difficulty,
                'id': id,
                'maxReadTime': maxReadTime,
                'minReadTime': minReadTime,
                'minViewCount': minViewCount,
                'pageSize': pageSize,
                'publishDateEnd': publishDateEnd,
                'publishDateStart': publishDateStart,
                'sortField': sortField,
                'sortOrder': sortOrder,
                'source': source,
                'summary': summary,
                'tags': tags,
                'title': title,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * listDailyArticleVOByPage
     * @param adminId
     * @param author
     * @param category
     * @param content
     * @param createTime
     * @param current
     * @param difficulty
     * @param id
     * @param maxReadTime
     * @param minReadTime
     * @param minViewCount
     * @param pageSize
     * @param publishDateEnd
     * @param publishDateStart
     * @param sortField
     * @param sortOrder
     * @param source
     * @param summary
     * @param tags
     * @param title
     * @returns BaseResponse_Page_DailyArticleVO_ OK
     * @throws ApiError
     */
    public static listDailyArticleVoByPageUsingGet(
        adminId?: number,
        author?: string,
        category?: string,
        content?: string,
        createTime?: string,
        current?: number,
        difficulty?: number,
        id?: number,
        maxReadTime?: number,
        minReadTime?: number,
        minViewCount?: number,
        pageSize?: number,
        publishDateEnd?: string,
        publishDateStart?: string,
        sortField?: string,
        sortOrder?: string,
        source?: string,
        summary?: string,
        tags?: string,
        title?: string,
    ): CancelablePromise<BaseResponse_Page_DailyArticleVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/daily-articles/page',
            query: {
                'adminId': adminId,
                'author': author,
                'category': category,
                'content': content,
                'createTime': createTime,
                'current': current,
                'difficulty': difficulty,
                'id': id,
                'maxReadTime': maxReadTime,
                'minReadTime': minReadTime,
                'minViewCount': minViewCount,
                'pageSize': pageSize,
                'publishDateEnd': publishDateEnd,
                'publishDateStart': publishDateStart,
                'sortField': sortField,
                'sortOrder': sortOrder,
                'source': source,
                'summary': summary,
                'tags': tags,
                'title': title,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * searchDailyArticle
     * @param searchText searchText
     * @returns BaseResponse_Page_DailyArticleVO_ OK
     * @throws ApiError
     */
    public static searchDailyArticleUsingGet(
        searchText: string,
    ): CancelablePromise<BaseResponse_Page_DailyArticleVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/daily-articles/search',
            query: {
                'searchText': searchText,
            },
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
            url: '/api/daily-articles/today',
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
        id: number,
    ): CancelablePromise<BaseResponse_DailyArticleVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/daily-articles/{id}',
            path: {
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
     * updateDailyArticle
     * @param dailyArticleUpdateRequest dailyArticleUpdateRequest
     * @param id id
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static updateDailyArticleUsingPut(
        dailyArticleUpdateRequest: DailyArticleUpdateRequest,
        id: number,
    ): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/daily-articles/{id}',
            path: {
                'id': id,
            },
            body: dailyArticleUpdateRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * deleteDailyArticle
     * @param id id
     * @returns BaseResponse_boolean_ OK
     * @throws ApiError
     */
    public static deleteDailyArticleUsingDelete(
        id: number,
    ): CancelablePromise<BaseResponse_boolean_> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/daily-articles/{id}',
            path: {
                'id': id,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
            },
        });
    }
}
