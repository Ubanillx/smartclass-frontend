/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseResponse_boolean_ } from '../models/BaseResponse_boolean_';
import type { BaseResponse_List_FriendRelationshipVO_ } from '../models/BaseResponse_List_FriendRelationshipVO_';
import type { BaseResponse_long_ } from '../models/BaseResponse_long_';
import type { BaseResponse_object_ } from '../models/BaseResponse_object_';
import type { BaseResponse_Page_FriendRelationship_ } from '../models/BaseResponse_Page_FriendRelationship_';
import type { BaseResponse_Page_FriendRelationshipVO_ } from '../models/BaseResponse_Page_FriendRelationshipVO_';
import type { FriendRelationshipAddRequest } from '../models/FriendRelationshipAddRequest';
import type { FriendRelationshipUpdateRequest } from '../models/FriendRelationshipUpdateRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class FriendRelationshipControllerService {
    /**
     * listUserFriends
     * @returns BaseResponse_List_FriendRelationshipVO_ OK
     * @throws ApiError
     */
    public static listUserFriendsUsingGet(): CancelablePromise<BaseResponse_List_FriendRelationshipVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/friends',
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * addFriendRelationship
     * @param friendRelationshipAddRequest friendRelationshipAddRequest
     * @returns BaseResponse_long_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static addFriendRelationshipUsingPost(
        friendRelationshipAddRequest: FriendRelationshipAddRequest,
    ): CancelablePromise<BaseResponse_long_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/friends',
            body: friendRelationshipAddRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * updateFriendRelationship
     * @param friendRelationshipUpdateRequest friendRelationshipUpdateRequest
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static updateFriendRelationshipUsingPut(
        friendRelationshipUpdateRequest: FriendRelationshipUpdateRequest,
    ): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/friends',
            body: friendRelationshipUpdateRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * listFriendRelationshipByPage
     * @param current
     * @param pageSize
     * @param sortField
     * @param sortOrder
     * @param status
     * @param userId
     * @param userId1
     * @param userId2
     * @returns BaseResponse_Page_FriendRelationship_ OK
     * @throws ApiError
     */
    public static listFriendRelationshipByPageUsingGet(
        current?: number,
        pageSize?: number,
        sortField?: string,
        sortOrder?: string,
        status?: string,
        userId?: number,
        userId1?: number,
        userId2?: number,
    ): CancelablePromise<BaseResponse_Page_FriendRelationship_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/friends/admin/page',
            query: {
                'current': current,
                'pageSize': pageSize,
                'sortField': sortField,
                'sortOrder': sortOrder,
                'status': status,
                'userId': userId,
                'userId1': userId1,
                'userId2': userId2,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * listFriendRelationshipVOByPage
     * @param current
     * @param pageSize
     * @param sortField
     * @param sortOrder
     * @param status
     * @param userId
     * @param userId1
     * @param userId2
     * @returns BaseResponse_Page_FriendRelationshipVO_ OK
     * @throws ApiError
     */
    public static listFriendRelationshipVoByPageUsingGet(
        current?: number,
        pageSize?: number,
        sortField?: string,
        sortOrder?: string,
        status?: string,
        userId?: number,
        userId1?: number,
        userId2?: number,
    ): CancelablePromise<BaseResponse_Page_FriendRelationshipVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/friends/page',
            query: {
                'current': current,
                'pageSize': pageSize,
                'sortField': sortField,
                'sortOrder': sortOrder,
                'status': status,
                'userId': userId,
                'userId1': userId1,
                'userId2': userId2,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * getFriendRelationship
     * @param id id
     * @param userId userId
     * @returns BaseResponse_object_ OK
     * @throws ApiError
     */
    public static getFriendRelationshipUsingGet(
        id?: number,
        userId?: number,
    ): CancelablePromise<BaseResponse_object_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/friends/relation',
            query: {
                'id': id,
                'userId': userId,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * deleteFriendByUserId
     * @param userId userId
     * @returns BaseResponse_boolean_ OK
     * @throws ApiError
     */
    public static deleteFriendByUserIdUsingDelete(
        userId: number,
    ): CancelablePromise<BaseResponse_boolean_> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/friends/user/{userId}',
            path: {
                'userId': userId,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
            },
        });
    }
    /**
     * deleteFriendRelationship
     * @param id id
     * @returns BaseResponse_boolean_ OK
     * @throws ApiError
     */
    public static deleteFriendRelationshipUsingDelete(
        id: number,
    ): CancelablePromise<BaseResponse_boolean_> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/friends/{id}',
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
