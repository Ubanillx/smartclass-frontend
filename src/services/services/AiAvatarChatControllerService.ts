/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseResponse_boolean_ } from '../models/BaseResponse_boolean_';
import type { BaseResponse_ChatMessageVO_ } from '../models/BaseResponse_ChatMessageVO_';
import type { BaseResponse_List_ChatMessageVO_ } from '../models/BaseResponse_List_ChatMessageVO_';
import type { BaseResponse_List_ChatSessionVO_ } from '../models/BaseResponse_List_ChatSessionVO_';
import type { BaseResponse_Page_ChatMessageVO_ } from '../models/BaseResponse_Page_ChatMessageVO_';
import type { BaseResponse_string_ } from '../models/BaseResponse_string_';
import type { ChatMessageAddRequest } from '../models/ChatMessageAddRequest';
import type { ChatSessionUpdateRequest } from '../models/ChatSessionUpdateRequest';
import type { SseEmitter } from '../models/SseEmitter';
import type { StopStreamingRequest } from '../models/StopStreamingRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AiAvatarChatControllerService {
    /**
     * getChatHistory
     * @param sessionId sessionId
     * @returns BaseResponse_List_ChatMessageVO_ OK
     * @throws ApiError
     */
    public static getChatHistoryUsingGet(
        sessionId: string,
    ): CancelablePromise<BaseResponse_List_ChatMessageVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/chat/history',
            query: {
                'sessionId': sessionId,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * sendMessage
     * @param chatMessageAddRequest chatMessageAddRequest
     * @returns BaseResponse_ChatMessageVO_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static sendMessageUsingPost(
        chatMessageAddRequest: ChatMessageAddRequest,
    ): CancelablePromise<BaseResponse_ChatMessageVO_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/message/send',
            body: chatMessageAddRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * stopStreamingResponse
     * @param stopStreamingRequest stopStreamingRequest
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static stopStreamingResponseUsingPost(
        stopStreamingRequest: StopStreamingRequest,
    ): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/message/stop',
            body: stopStreamingRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * sendMessageStream
     * @param chatMessageAddRequest chatMessageAddRequest
     * @returns SseEmitter OK
     * @returns any Created
     * @throws ApiError
     */
    public static sendMessageStreamUsingPost(
        chatMessageAddRequest: ChatMessageAddRequest,
    ): CancelablePromise<SseEmitter | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/message/stream',
            body: chatMessageAddRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * getUserChatMessages
     * @param aiAvatarId aiAvatarId
     * @returns BaseResponse_List_ChatMessageVO_ OK
     * @throws ApiError
     */
    public static getUserChatMessagesUsingGet(
        aiAvatarId?: number,
    ): CancelablePromise<BaseResponse_List_ChatMessageVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/chat/messages/list',
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
     * createSession
     * @param aiAvatarId aiAvatarId
     * @returns BaseResponse_string_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static createSessionUsingPost(
        aiAvatarId: number,
    ): CancelablePromise<BaseResponse_string_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/session/create',
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
     * deleteSession
     * @param sessionId sessionId
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static deleteSessionUsingPost(
        sessionId: string,
    ): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/session/delete',
            query: {
                'sessionId': sessionId,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * updateSessionName
     * @param chatSessionUpdateRequest chatSessionUpdateRequest
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static updateSessionNameUsingPost(
        chatSessionUpdateRequest: ChatSessionUpdateRequest,
    ): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/session/update',
            body: chatSessionUpdateRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * getUserSessions
     * @param aiAvatarId aiAvatarId
     * @returns BaseResponse_List_ChatSessionVO_ OK
     * @throws ApiError
     */
    public static getUserSessionsUsingGet(
        aiAvatarId?: number,
    ): CancelablePromise<BaseResponse_List_ChatSessionVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/chat/sessions',
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
     * getRecentSessions
     * @param limit limit
     * @returns BaseResponse_List_ChatSessionVO_ OK
     * @throws ApiError
     */
    public static getRecentSessionsUsingGet(
        limit: number = 10,
    ): CancelablePromise<BaseResponse_List_ChatSessionVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/chat/sessions/recent',
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
     * getUserHistoryPage
     * @param current current
     * @param pageSize pageSize
     * @returns BaseResponse_Page_ChatMessageVO_ OK
     * @throws ApiError
     */
    public static getUserHistoryPageUsingGet(
        aiAvatarId?: number,
        current: number = 1,
        pageSize: number = 10,
    ): CancelablePromise<BaseResponse_Page_ChatMessageVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/chat/user/history',
            query: {
                'aiAvatarId': aiAvatarId,
                'current': current,
                'pageSize': pageSize,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
}
