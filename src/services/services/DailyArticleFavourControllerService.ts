/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseResponse_boolean_ } from '../models/BaseResponse_boolean_';
import type { BaseResponse_int_ } from '../models/BaseResponse_int_';
import type { BaseResponse_Page_DailyArticleVO_ } from '../models/BaseResponse_Page_DailyArticleVO_';
import type { DailyArticleQueryRequest } from '../models/DailyArticleQueryRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class DailyArticleFavourControllerService {
    /**
     * isFavourArticle
     * @param articleId articleId
     * @returns BaseResponse_boolean_ OK
     * @throws ApiError
     */
    public static isFavourArticleUsingGet(
        articleId: number,
    ): CancelablePromise<BaseResponse_boolean_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/dailyArticle/favour/check/{articleId}',
            path: {
                'articleId': articleId,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * listMyFavourArticleByPage
     * @param dailyArticleQueryRequest dailyArticleQueryRequest
     * @returns BaseResponse_Page_DailyArticleVO_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static listMyFavourArticleByPageUsingPost(
        dailyArticleQueryRequest: DailyArticleQueryRequest,
    ): CancelablePromise<BaseResponse_Page_DailyArticleVO_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/dailyArticle/favour/list/page/my',
            body: dailyArticleQueryRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * doArticleFavour
     * @param articleId articleId
     * @returns BaseResponse_int_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static doArticleFavourUsingPost(
        articleId: number,
    ): CancelablePromise<BaseResponse_int_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/dailyArticle/favour/{articleId}',
            path: {
                'articleId': articleId,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
}
