/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AiAvatarAddRequest } from '../models/AiAvatarAddRequest.ts';
import type { AiAvatarUpdateRequest } from '../models/AiAvatarUpdateRequest.ts';
import type { BaseResponse_AiAvatarVO_ } from '../models/BaseResponse_AiAvatarVO_.ts';
import type { BaseResponse_boolean_ } from '../models/BaseResponse_boolean_.ts';
import type { BaseResponse_List_AiAvatarBriefVO_ } from '../models/BaseResponse_List_AiAvatarBriefVO_.ts';
import type { BaseResponse_List_AiAvatarVO_ } from '../models/BaseResponse_List_AiAvatarVO_.ts';
import type { BaseResponse_long_ } from '../models/BaseResponse_long_.ts';
import type { BaseResponse_Page_AiAvatarVO_ } from '../models/BaseResponse_Page_AiAvatarVO_.ts';
import type { DeleteRequest } from '../models/DeleteRequest.ts';
import type { CancelablePromise } from '../core/CancelablePromise.ts';
import { OpenAPI } from '../core/OpenAPI.ts';
import { request as __request } from '../core/request.ts';
export class AiAvatarControllerService {
    /**
     * addAiAvatar
     * @param aiAvatarAddRequest aiAvatarAddRequest
     * @returns BaseResponse_long_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static addAiAvatarUsingPost(
        aiAvatarAddRequest: AiAvatarAddRequest,
    ): CancelablePromise<BaseResponse_long_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/ai_avatar/add',
            body: aiAvatarAddRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * deleteAiAvatar
     * @param deleteRequest deleteRequest
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static deleteAiAvatarUsingPost(
        deleteRequest: DeleteRequest,
    ): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/ai_avatar/delete',
            body: deleteRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * getAiAvatarById
     * @param id id
     * @returns BaseResponse_AiAvatarVO_ OK
     * @throws ApiError
     */
    public static getAiAvatarByIdUsingGet(
        id?: number,
    ): CancelablePromise<BaseResponse_AiAvatarVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/ai_avatar/get',
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
     * listAiAvatar
     * @param abilities
     * @param adminId
     * @param avatarUrl
     * @param category
     * @param createTime
     * @param creatorId
     * @param current
     * @param description
     * @param id
     * @param isPublic
     * @param modelType
     * @param name
     * @param pageSize
     * @param personality
     * @param rating
     * @param sortField
     * @param sortOrder
     * @param status
     * @param tags
     * @param usageCount
     * @returns BaseResponse_List_AiAvatarVO_ OK
     * @throws ApiError
     */
    public static listAiAvatarUsingGet(
        abilities?: string,
        adminId?: number,
        avatarUrl?: string,
        category?: string,
        createTime?: string,
        creatorId?: number,
        current?: number,
        description?: string,
        id?: number,
        isPublic?: number,
        modelType?: string,
        name?: string,
        pageSize?: number,
        personality?: string,
        rating?: number,
        sortField?: string,
        sortOrder?: string,
        status?: number,
        tags?: string,
        usageCount?: number,
    ): CancelablePromise<BaseResponse_List_AiAvatarVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/ai_avatar/list',
            query: {
                'abilities': abilities,
                'adminId': adminId,
                'avatarUrl': avatarUrl,
                'category': category,
                'createTime': createTime,
                'creatorId': creatorId,
                'current': current,
                'description': description,
                'id': id,
                'isPublic': isPublic,
                'modelType': modelType,
                'name': name,
                'pageSize': pageSize,
                'personality': personality,
                'rating': rating,
                'sortField': sortField,
                'sortOrder': sortOrder,
                'status': status,
                'tags': tags,
                'usageCount': usageCount,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * listAllAiAvatar
     * @returns BaseResponse_List_AiAvatarBriefVO_ OK
     * @throws ApiError
     */
    public static listAllAiAvatarUsingGet(): CancelablePromise<BaseResponse_List_AiAvatarBriefVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/ai_avatar/list/all',
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * listAiAvatarByPage
     * @param abilities
     * @param adminId
     * @param avatarUrl
     * @param category
     * @param createTime
     * @param creatorId
     * @param current
     * @param description
     * @param id
     * @param isPublic
     * @param modelType
     * @param name
     * @param pageSize
     * @param personality
     * @param rating
     * @param sortField
     * @param sortOrder
     * @param status
     * @param tags
     * @param usageCount
     * @returns BaseResponse_Page_AiAvatarVO_ OK
     * @throws ApiError
     */
    public static listAiAvatarByPageUsingGet(
        abilities?: string,
        adminId?: number,
        avatarUrl?: string,
        category?: string,
        createTime?: string,
        creatorId?: number,
        current?: number,
        description?: string,
        id?: number,
        isPublic?: number,
        modelType?: string,
        name?: string,
        pageSize?: number,
        personality?: string,
        rating?: number,
        sortField?: string,
        sortOrder?: string,
        status?: number,
        tags?: string,
        usageCount?: number,
    ): CancelablePromise<BaseResponse_Page_AiAvatarVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/ai_avatar/list/page',
            query: {
                'abilities': abilities,
                'adminId': adminId,
                'avatarUrl': avatarUrl,
                'category': category,
                'createTime': createTime,
                'creatorId': creatorId,
                'current': current,
                'description': description,
                'id': id,
                'isPublic': isPublic,
                'modelType': modelType,
                'name': name,
                'pageSize': pageSize,
                'personality': personality,
                'rating': rating,
                'sortField': sortField,
                'sortOrder': sortOrder,
                'status': status,
                'tags': tags,
                'usageCount': usageCount,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * updateAiAvatar
     * @param aiAvatarUpdateRequest aiAvatarUpdateRequest
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static updateAiAvatarUsingPost(
        aiAvatarUpdateRequest: AiAvatarUpdateRequest,
    ): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/ai_avatar/update',
            body: aiAvatarUpdateRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
}
