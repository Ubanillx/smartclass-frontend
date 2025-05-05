/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseResponse_boolean_ } from '../models/BaseResponse_boolean_';
import type { BaseResponse_FriendRelationship_ } from '../models/BaseResponse_FriendRelationship_';
import type { BaseResponse_List_FriendRelationshipVO_ } from '../models/BaseResponse_List_FriendRelationshipVO_';
import type { BaseResponse_long_ } from '../models/BaseResponse_long_';
import type { BaseResponse_Page_FriendRelationship_ } from '../models/BaseResponse_Page_FriendRelationship_';
import type { BaseResponse_Page_FriendRelationshipVO_ } from '../models/BaseResponse_Page_FriendRelationshipVO_';
import type { DeleteRequest_1 } from '../models/DeleteRequest_1';
import type { FriendRelationshipAddRequest } from '../models/FriendRelationshipAddRequest';
import type { FriendRelationshipQueryRequest } from '../models/FriendRelationshipQueryRequest';
import type { FriendRelationshipUpdateRequest } from '../models/FriendRelationshipUpdateRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class FriendRelationshipControllerService {
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
            url: '/api/friend/relationship/add',
            body: friendRelationshipAddRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * blockFriend
     * @param userId userId
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static blockFriendUsingPost(
        userId: number,
    ): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/friend/relationship/block',
            query: {
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
     * deleteFriendRelationship
     * @param deleteRequest deleteRequest
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static deleteFriendRelationshipUsingPost(
        deleteRequest: DeleteRequest_1,
    ): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/friend/relationship/delete',
            body: deleteRequest,
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
     * @returns any Created
     * @throws ApiError
     */
    public static deleteFriendByUserIdUsingPost(
        userId: number,
    ): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/friend/relationship/delete/friend',
            query: {
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
     * getFriendRelationshipById
     * @param id id
     * @returns BaseResponse_FriendRelationship_ OK
     * @throws ApiError
     */
    public static getFriendRelationshipByIdUsingGet(
        id?: number,
    ): CancelablePromise<BaseResponse_FriendRelationship_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/friend/relationship/get',
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
     * getFriendRelationshipByUsers
     * @param userId1 userId1
     * @param userId2 userId2
     * @returns BaseResponse_FriendRelationship_ OK
     * @throws ApiError
     */
    public static getFriendRelationshipByUsersUsingGet(
        userId1: number,
        userId2: number,
    ): CancelablePromise<BaseResponse_FriendRelationship_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/friend/relationship/getByUsers',
            query: {
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
     * isFriend
     * @param userId1 userId1
     * @param userId2 userId2
     * @returns BaseResponse_boolean_ OK
     * @throws ApiError
     */
    public static isFriendUsingGet(
        userId1: number,
        userId2: number,
    ): CancelablePromise<BaseResponse_boolean_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/friend/relationship/isFriend',
            query: {
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
     * listFriendRelationshipByPage
     * @param friendRelationshipQueryRequest friendRelationshipQueryRequest
     * @returns BaseResponse_Page_FriendRelationship_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static listFriendRelationshipByPageUsingPost(
        friendRelationshipQueryRequest: FriendRelationshipQueryRequest,
    ): CancelablePromise<BaseResponse_Page_FriendRelationship_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/friend/relationship/list/page',
            body: friendRelationshipQueryRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * listFriendRelationshipVOByPage
     * @param friendRelationshipQueryRequest friendRelationshipQueryRequest
     * @returns BaseResponse_Page_FriendRelationshipVO_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static listFriendRelationshipVoByPageUsingPost(
        friendRelationshipQueryRequest: FriendRelationshipQueryRequest,
    ): CancelablePromise<BaseResponse_Page_FriendRelationshipVO_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/friend/relationship/list/page/vo',
            body: friendRelationshipQueryRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * listUserFriends
     * @param userId userId
     * @returns BaseResponse_List_FriendRelationshipVO_ OK
     * @throws ApiError
     */
    public static listUserFriendsUsingGet(
        userId?: number,
    ): CancelablePromise<BaseResponse_List_FriendRelationshipVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/friend/relationship/listFriends',
            query: {
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
     * listMyFriends
     * @returns BaseResponse_List_FriendRelationshipVO_ OK
     * @throws ApiError
     */
    public static listMyFriendsUsingGet(): CancelablePromise<BaseResponse_List_FriendRelationshipVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/friend/relationship/my/list',
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
    public static updateFriendRelationshipUsingPost(
        friendRelationshipUpdateRequest: FriendRelationshipUpdateRequest,
    ): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/friend/relationship/update',
            body: friendRelationshipUpdateRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
}
