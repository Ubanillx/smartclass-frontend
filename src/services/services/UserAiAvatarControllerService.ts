/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseResponse_boolean_ } from '../models/BaseResponse_boolean_';
import type { BaseResponse_List_UserAiAvatarVO_ } from '../models/BaseResponse_List_UserAiAvatarVO_';
import type { BaseResponse_long_ } from '../models/BaseResponse_long_';
import type { BaseResponse_Page_UserAiAvatarVO_ } from '../models/BaseResponse_Page_UserAiAvatarVO_';
import type { BaseResponse_UserAiAvatarVO_ } from '../models/BaseResponse_UserAiAvatarVO_';
import type { DeleteRequest } from '../models/DeleteRequest';
import type { UserAiAvatarAddRequest } from '../models/UserAiAvatarAddRequest';
import type { UserAiAvatarUpdateRequest } from '../models/UserAiAvatarUpdateRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class UserAiAvatarControllerService {
    /**
     * addUserAiAvatar
     * @param userAiAvatarAddRequest userAiAvatarAddRequest
     * @returns BaseResponse_long_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static addUserAiAvatarUsingPost(
        userAiAvatarAddRequest: UserAiAvatarAddRequest,
    ): CancelablePromise<BaseResponse_long_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/user_ai_avatar/add',
            body: userAiAvatarAddRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * deleteUserAiAvatar
     * @param deleteRequest deleteRequest
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static deleteUserAiAvatarUsingPost(
        deleteRequest: DeleteRequest,
    ): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/user_ai_avatar/delete',
            body: deleteRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * favoriteAiAvatar
     * @param aiAvatarId aiAvatarId
     * @param isFavorite isFavorite
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static favoriteAiAvatarUsingPost(
        aiAvatarId: number,
        isFavorite: number,
    ): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/user_ai_avatar/favorite',
            query: {
                'aiAvatarId': aiAvatarId,
                'isFavorite': isFavorite,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * listFavoriteAiAvatars
     * @returns BaseResponse_List_UserAiAvatarVO_ OK
     * @throws ApiError
     */
    public static listFavoriteAiAvatarsUsingGet(): CancelablePromise<BaseResponse_List_UserAiAvatarVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/user_ai_avatar/favorite/list',
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * getUserAiAvatarById
     * @param id id
     * @returns BaseResponse_UserAiAvatarVO_ OK
     * @throws ApiError
     */
    public static getUserAiAvatarByIdUsingGet(
        id?: number,
    ): CancelablePromise<BaseResponse_UserAiAvatarVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/user_ai_avatar/get',
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
     * listMyUserAiAvatars
     * @returns BaseResponse_List_UserAiAvatarVO_ OK
     * @throws ApiError
     */
    public static listMyUserAiAvatarsUsingGet(): CancelablePromise<BaseResponse_List_UserAiAvatarVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/user_ai_avatar/my/list',
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * listMyUserAiAvatarsByPage
     * @param aiAvatarId
     * @param createTime
     * @param current
     * @param id
     * @param isFavorite
     * @param pageSize
     * @param sortField
     * @param sortOrder
     * @param userId
     * @param userRating
     * @returns BaseResponse_Page_UserAiAvatarVO_ OK
     * @throws ApiError
     */
    public static listMyUserAiAvatarsByPageUsingGet(
        aiAvatarId?: number,
        createTime?: string,
        current?: number,
        id?: number,
        isFavorite?: number,
        pageSize?: number,
        sortField?: string,
        sortOrder?: string,
        userId?: number,
        userRating?: number,
    ): CancelablePromise<BaseResponse_Page_UserAiAvatarVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/user_ai_avatar/my/list/page',
            query: {
                'aiAvatarId': aiAvatarId,
                'createTime': createTime,
                'current': current,
                'id': id,
                'isFavorite': isFavorite,
                'pageSize': pageSize,
                'sortField': sortField,
                'sortOrder': sortOrder,
                'userId': userId,
                'userRating': userRating,
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
     * @param aiAvatarId aiAvatarId
     * @param rating rating
     * @param feedback feedback
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static rateAiAvatarUsingPost(
        aiAvatarId: number,
        rating: number,
        feedback?: string,
    ): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/user_ai_avatar/rate',
            query: {
                'aiAvatarId': aiAvatarId,
                'feedback': feedback,
                'rating': rating,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * updateUserAiAvatar
     * @param userAiAvatarUpdateRequest userAiAvatarUpdateRequest
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static updateUserAiAvatarUsingPost(
        userAiAvatarUpdateRequest: UserAiAvatarUpdateRequest,
    ): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/user_ai_avatar/update',
            body: userAiAvatarUpdateRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * useAiAvatar
     * @param aiAvatarId aiAvatarId
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static useAiAvatarUsingPost(
        aiAvatarId: number,
    ): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/user_ai_avatar/use',
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
