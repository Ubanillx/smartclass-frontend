/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseResponse_boolean_ } from '../models/BaseResponse_boolean_';
import type { BaseResponse_FriendRequestVO_ } from '../models/BaseResponse_FriendRequestVO_';
import type { BaseResponse_List_FriendRequestVO_ } from '../models/BaseResponse_List_FriendRequestVO_';
import type { BaseResponse_long_ } from '../models/BaseResponse_long_';
import type { BaseResponse_Page_FriendRequest_ } from '../models/BaseResponse_Page_FriendRequest_';
import type { BaseResponse_Page_FriendRequestVO_ } from '../models/BaseResponse_Page_FriendRequestVO_';
import type { DeleteRequest_1 } from '../models/DeleteRequest_1';
import type { FriendRequestAddRequest } from '../models/FriendRequestAddRequest';
import type { FriendRequestQueryRequest } from '../models/FriendRequestQueryRequest';
import type { FriendRequestUpdateRequest } from '../models/FriendRequestUpdateRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class FriendRequestControllerService {
    /**
     * acceptFriendRequest
     * @param id id
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static acceptFriendRequestUsingPost(
        id: number,
    ): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/friend/request/accept',
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
     * addFriendRequest
     * @param friendRequestAddRequest friendRequestAddRequest
     * @returns BaseResponse_long_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static addFriendRequestUsingPost(
        friendRequestAddRequest: FriendRequestAddRequest,
    ): CancelablePromise<BaseResponse_long_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/friend/request/add',
            body: friendRequestAddRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * getPendingRequestCount
     * @returns BaseResponse_long_ OK
     * @throws ApiError
     */
    public static getPendingRequestCountUsingGet(): CancelablePromise<BaseResponse_long_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/friend/request/count/pending',
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * deleteFriendRequest
     * @param deleteRequest deleteRequest
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static deleteFriendRequestUsingPost(
        deleteRequest: DeleteRequest_1,
    ): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/friend/request/delete',
            body: deleteRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * getFriendRequestById
     * @param id id
     * @returns BaseResponse_FriendRequestVO_ OK
     * @throws ApiError
     */
    public static getFriendRequestByIdUsingGet(
        id?: number,
    ): CancelablePromise<BaseResponse_FriendRequestVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/friend/request/get',
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
     * listFriendRequestByPage
     * @param friendRequestQueryRequest friendRequestQueryRequest
     * @returns BaseResponse_Page_FriendRequest_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static listFriendRequestByPageUsingPost(
        friendRequestQueryRequest: FriendRequestQueryRequest,
    ): CancelablePromise<BaseResponse_Page_FriendRequest_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/friend/request/list/page',
            body: friendRequestQueryRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * listFriendRequestVOByPage
     * @param friendRequestQueryRequest friendRequestQueryRequest
     * @returns BaseResponse_Page_FriendRequestVO_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static listFriendRequestVoByPageUsingPost(
        friendRequestQueryRequest: FriendRequestQueryRequest,
    ): CancelablePromise<BaseResponse_Page_FriendRequestVO_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/friend/request/list/page/vo',
            body: friendRequestQueryRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * getReceivedFriendRequests
     * @param status status
     * @returns BaseResponse_List_FriendRequestVO_ OK
     * @throws ApiError
     */
    public static getReceivedFriendRequestsUsingGet(
        status?: string,
    ): CancelablePromise<BaseResponse_List_FriendRequestVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/friend/request/received',
            query: {
                'status': status,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * rejectFriendRequest
     * @param id id
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static rejectFriendRequestUsingPost(
        id: number,
    ): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/friend/request/reject',
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
     * getSentFriendRequests
     * @param status status
     * @returns BaseResponse_List_FriendRequestVO_ OK
     * @throws ApiError
     */
    public static getSentFriendRequestsUsingGet(
        status?: string,
    ): CancelablePromise<BaseResponse_List_FriendRequestVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/friend/request/sent',
            query: {
                'status': status,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * updateFriendRequest
     * @param friendRequestUpdateRequest friendRequestUpdateRequest
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static updateFriendRequestUsingPost(
        friendRequestUpdateRequest: FriendRequestUpdateRequest,
    ): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/friend/request/update',
            body: friendRequestUpdateRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
}
