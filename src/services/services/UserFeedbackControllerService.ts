/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseResponse_boolean_ } from '../models/BaseResponse_boolean_';
import type { BaseResponse_long_ } from '../models/BaseResponse_long_';
import type { BaseResponse_Page_UserFeedback_ } from '../models/BaseResponse_Page_UserFeedback_';
import type { BaseResponse_UserFeedback_ } from '../models/BaseResponse_UserFeedback_';
import type { DeleteRequest_1 } from '../models/DeleteRequest_1';
import type { UserFeedbackAddRequest } from '../models/UserFeedbackAddRequest';
import type { UserFeedbackProcessRequest } from '../models/UserFeedbackProcessRequest';
import type { UserFeedbackQueryRequest } from '../models/UserFeedbackQueryRequest';
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
            url: '/api/user/feedback/add',
            body: userFeedbackAddRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * deleteUserFeedback
     * @param deleteRequest deleteRequest
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static deleteUserFeedbackUsingPost(
        deleteRequest: DeleteRequest_1,
    ): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/user/feedback/delete',
            body: deleteRequest,
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
        id?: number,
    ): CancelablePromise<BaseResponse_UserFeedback_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/user/feedback/get',
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
     * listUserFeedbackByPage
     * @param userFeedbackQueryRequest userFeedbackQueryRequest
     * @returns BaseResponse_Page_UserFeedback_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static listUserFeedbackByPageUsingPost(
        userFeedbackQueryRequest: UserFeedbackQueryRequest,
    ): CancelablePromise<BaseResponse_Page_UserFeedback_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/user/feedback/list/page',
            body: userFeedbackQueryRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * processUserFeedback
     * @param userFeedbackProcessRequest userFeedbackProcessRequest
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static processUserFeedbackUsingPost(
        userFeedbackProcessRequest: UserFeedbackProcessRequest,
    ): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/user/feedback/process',
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
     * @param userFeedbackReplyAddRequest userFeedbackReplyAddRequest
     * @returns BaseResponse_long_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static processAndReplyUsingPost(
        userFeedbackReplyAddRequest: UserFeedbackReplyAddRequest,
    ): CancelablePromise<BaseResponse_long_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/user/feedback/process/reply',
            body: userFeedbackReplyAddRequest,
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
            url: '/api/user/feedback/unread/count',
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * updateUserFeedback
     * @param userFeedbackUpdateRequest userFeedbackUpdateRequest
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static updateUserFeedbackUsingPost(
        userFeedbackUpdateRequest: UserFeedbackUpdateRequest,
    ): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/user/feedback/update',
            body: userFeedbackUpdateRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
}
