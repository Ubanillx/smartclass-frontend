/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseResponse_boolean_ } from '../models/BaseResponse_boolean_.ts';
import type { BaseResponse_ChatMessageVO_ } from '../models/BaseResponse_ChatMessageVO_.ts';
import type { BaseResponse_List_ChatMessageVO_ } from '../models/BaseResponse_List_ChatMessageVO_.ts';
import type { BaseResponse_List_ChatSessionVO_ } from '../models/BaseResponse_List_ChatSessionVO_.ts';
import type { BaseResponse_Page_ChatMessageVO_ } from '../models/BaseResponse_Page_ChatMessageVO_.ts';
import type { BaseResponse_string_ } from '../models/BaseResponse_string_.ts';
import type { BaseResponse_UploadFileResponse_ } from '../models/BaseResponse_UploadFileResponse_.ts';
import type { ChatMessageAddRequest } from '../models/ChatMessageAddRequest.ts';
import type { ChatSessionUpdateRequest } from '../models/ChatSessionUpdateRequest.ts';
import type { SseEmitter } from '../models/SseEmitter.ts';
import type { StopStreamingRequest } from '../models/StopStreamingRequest.ts';
import type { TextToAudioRequest } from '../models/TextToAudioRequest.ts';
import type { CancelablePromise } from '../core/CancelablePromise.ts';
import { OpenAPI } from '../core/OpenAPI.ts';
import { request as __request } from '../core/request.ts';
export class AiAvatarChatControllerService {
    /**
     * uploadFile
     * @param aiAvatarId
     * @param file
     * @returns BaseResponse_UploadFileResponse_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static uploadFileUsingPost(
        aiAvatarId?: number,
        file?: Blob,
    ): CancelablePromise<BaseResponse_UploadFileResponse_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/file/upload',
            query: {
                'aiAvatarId': aiAvatarId,
                'file': file,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
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
     * getHistoryDialogsList
     * @param limit limit
     * @param offset offset
     * @returns BaseResponse_List_ChatSessionVO_ OK
     * @throws ApiError
     */
    public static getHistoryDialogsListUsingGet(
        limit: number = 20,
        offset?: number,
    ): CancelablePromise<BaseResponse_List_ChatSessionVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/chat/history/dialogs',
            query: {
                'limit': limit,
                'offset': offset,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * getChatHistoryByPage
     * @param aiAvatarId
     * @param content
     * @param current
     * @param messageType
     * @param pageSize
     * @param sessionId
     * @param sortField
     * @param sortOrder
     * @returns BaseResponse_Page_ChatMessageVO_ OK
     * @throws ApiError
     */
    public static getChatHistoryByPageUsingGet(
        aiAvatarId?: number,
        content?: string,
        current?: number,
        messageType?: string,
        pageSize?: number,
        sessionId?: string,
        sortField?: string,
        sortOrder?: string,
    ): CancelablePromise<BaseResponse_Page_ChatMessageVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/chat/history/page',
            query: {
                'aiAvatarId': aiAvatarId,
                'content': content,
                'current': current,
                'messageType': messageType,
                'pageSize': pageSize,
                'sessionId': sessionId,
                'sortField': sortField,
                'sortOrder': sortOrder,
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
     * sendMessageWithFiles
     * @param chatMessageAddRequest chatMessageAddRequest
     * @returns BaseResponse_ChatMessageVO_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static sendMessageWithFilesUsingPost(
        chatMessageAddRequest: ChatMessageAddRequest,
    ): CancelablePromise<BaseResponse_ChatMessageVO_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/message/sendWithFiles',
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
     * sendMessageStreamWithFiles
     * @param chatMessageAddRequest chatMessageAddRequest
     * @returns SseEmitter OK
     * @returns any Created
     * @throws ApiError
     */
    public static sendMessageStreamWithFilesUsingPost(
        chatMessageAddRequest: ChatMessageAddRequest,
    ): CancelablePromise<SseEmitter | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/message/streamWithFiles',
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
     * deleteSessionCompletely
     * @param sessionId sessionId
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static deleteSessionCompletelyUsingPost(
        sessionId: string,
    ): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/session/delete/completely',
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
     * toggleStreamingLog
     * @param enable enable
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static toggleStreamingLogUsingPost(
        enable: boolean = false,
    ): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/stream/log',
            query: {
                'enable': enable,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * textToAudio
     * @param textToAudioRequest textToAudioRequest
     * @returns any OK
     * @throws ApiError
     */
    public static textToAudioUsingPost(
        textToAudioRequest: TextToAudioRequest,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/text-to-audio',
            body: textToAudioRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * getUserHistoryPage
     * @param aiAvatarId aiAvatarId
     * @param current current
     * @param pageSize pageSize
     * @returns BaseResponse_Page_ChatMessageVO_ OK
     * @throws ApiError
     */
    public static getUserHistoryPageUsingGet(
        aiAvatarId?: number,
        current: number = 1,
        pageSize: number = 100,
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
