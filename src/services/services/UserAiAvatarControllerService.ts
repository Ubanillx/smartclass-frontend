/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseResponse_boolean_ } from '../models/BaseResponse_boolean_';
import type { BaseResponse_List_AiAvatarVO_ } from '../models/BaseResponse_List_AiAvatarVO_';
import type { BaseResponse_Page_AiAvatarVO_ } from '../models/BaseResponse_Page_AiAvatarVO_';
import type { UserAiAvatarRequest } from '../models/UserAiAvatarRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class UserAiAvatarControllerService {
    /**
     * favoriteAiAvatar
     * @param aiAvatarId aiAvatarId
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static favoriteAiAvatarUsingPost(
        aiAvatarId: number,
    ): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/user/ai/avatar/favorite',
            query: {
                'aiAvatarId': aiAvatarId,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * listUserFavoriteAiAvatars
     * @param current current
     * @param size size
     * @returns BaseResponse_Page_AiAvatarVO_ OK
     * @throws ApiError
     */
    public static listUserFavoriteAiAvatarsUsingGet(
        current: number = 1,
        size: number = 10,
    ): CancelablePromise<BaseResponse_Page_AiAvatarVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/user/ai/avatar/favorite/list',
            query: {
                'current': current,
                'size': size,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * rateAiAvatar
     * @param userAiAvatarRequest userAiAvatarRequest
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static rateAiAvatarUsingPost(
        userAiAvatarRequest: UserAiAvatarRequest,
    ): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/user/ai/avatar/rate',
            body: userAiAvatarRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * listUserRecentAiAvatars
     * @param limit limit
     * @returns BaseResponse_List_AiAvatarVO_ OK
     * @throws ApiError
     */
    public static listUserRecentAiAvatarsUsingGet(
        limit: number = 10,
    ): CancelablePromise<BaseResponse_List_AiAvatarVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/user/ai/avatar/recent',
            query: {
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
     * updateCustomSettings
     * @param userAiAvatarRequest userAiAvatarRequest
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static updateCustomSettingsUsingPost(
        userAiAvatarRequest: UserAiAvatarRequest,
    ): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/user/ai/avatar/settings',
            body: userAiAvatarRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * unfavoriteAiAvatar
     * @param aiAvatarId aiAvatarId
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static unfavoriteAiAvatarUsingPost(
        aiAvatarId: number,
    ): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/user/ai/avatar/unfavorite',
            query: {
                'aiAvatarId': aiAvatarId,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
}
