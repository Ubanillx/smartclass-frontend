/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseResponse_boolean_ } from '../models/BaseResponse_boolean_';
import type { BaseResponse_long_ } from '../models/BaseResponse_long_';
import type { BaseResponse_Page_UserFeedback_ } from '../models/BaseResponse_Page_UserFeedback_';
import type { BaseResponse_UserFeedback_ } from '../models/BaseResponse_UserFeedback_';
import type { UserFeedbackAddRequest } from '../models/UserFeedbackAddRequest';
import type { UserFeedbackProcessRequest } from '../models/UserFeedbackProcessRequest';
import type { UserFeedbackReplyAddRequest } from '../models/UserFeedbackReplyAddRequest';
import type { UserFeedbackUpdateRequest } from '../models/UserFeedbackUpdateRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class UserFeedbackControllerService {
    /**
     * addUserFeedback
     * @param userFeedbackAddRequest userFeedbackAddRequest
     * @returns BaseResponse_long_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static addUserFeedbackUsingPost(
        userFeedbackAddRequest: UserFeedbackAddRequest,
    ): CancelablePromise<BaseResponse_long_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/user-feedbacks',
            body: userFeedbackAddRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * listUserFeedbackByPage
     * @param current
     * @param feedbackType
     * @param pageSize
     * @param sortField
     * @param sortOrder
     * @param status
     * @param title
     * @param userId
     * @returns BaseResponse_Page_UserFeedback_ OK
     * @throws ApiError
     */
    public static listUserFeedbackByPageUsingGet(
        current?: number,
        feedbackType?: string,
        pageSize?: number,
        sortField?: string,
        sortOrder?: string,
        status?: number,
        title?: string,
        userId?: number,
    ): CancelablePromise<BaseResponse_Page_UserFeedback_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/user-feedbacks/page',
            query: {
                'current': current,
                'feedbackType': feedbackType,
                'pageSize': pageSize,
                'sortField': sortField,
                'sortOrder': sortOrder,
                'status': status,
                'title': title,
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
     * getUnreadCount
     * @returns BaseResponse_long_ OK
     * @throws ApiError
     */
    public static getUnreadCountUsingGet(): CancelablePromise<BaseResponse_long_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/user-feedbacks/unread-count',
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * getUserFeedbackById
     * @param id id
     * @returns BaseResponse_UserFeedback_ OK
     * @throws ApiError
     */
    public static getUserFeedbackByIdUsingGet(
        id: number,
    ): CancelablePromise<BaseResponse_UserFeedback_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/user-feedbacks/{id}',
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
     * updateUserFeedback
     * @param id id
     * @param userFeedbackUpdateRequest userFeedbackUpdateRequest
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static updateUserFeedbackUsingPut(
        id: number,
        userFeedbackUpdateRequest: UserFeedbackUpdateRequest,
    ): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/user-feedbacks/{id}',
            path: {
                'id': id,
            },
            body: userFeedbackUpdateRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * deleteUserFeedback
     * @param id id
     * @returns BaseResponse_boolean_ OK
     * @throws ApiError
     */
    public static deleteUserFeedbackUsingDelete(
        id: number,
    ): CancelablePromise<BaseResponse_boolean_> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/user-feedbacks/{id}',
            path: {
                'id': id,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
            },
        });
    }
    /**
     * processUserFeedback
     * @param id id
     * @param userFeedbackProcessRequest userFeedbackProcessRequest
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static processUserFeedbackUsingPut(
        id: number,
        userFeedbackProcessRequest: UserFeedbackProcessRequest,
    ): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/user-feedbacks/{id}/process',
            path: {
                'id': id,
            },
            body: userFeedbackProcessRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * processAndReply
     * @param id id
     * @param userFeedbackReplyAddRequest userFeedbackReplyAddRequest
     * @returns BaseResponse_long_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static processAndReplyUsingPost(
        id: number,
        userFeedbackReplyAddRequest: UserFeedbackReplyAddRequest,
    ): CancelablePromise<BaseResponse_long_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/user-feedbacks/{id}/reply',
            path: {
                'id': id,
            },
            body: userFeedbackReplyAddRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
}
