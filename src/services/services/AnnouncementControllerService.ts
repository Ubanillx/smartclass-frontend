/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AnnouncementAddRequest } from '../models/AnnouncementAddRequest';
import type { AnnouncementUpdateRequest } from '../models/AnnouncementUpdateRequest';
import type { BaseResponse_AnnouncementVO_ } from '../models/BaseResponse_AnnouncementVO_';
import type { BaseResponse_boolean_ } from '../models/BaseResponse_boolean_';
import type { BaseResponse_long_ } from '../models/BaseResponse_long_';
import type { BaseResponse_Page_Announcement_ } from '../models/BaseResponse_Page_Announcement_';
import type { BaseResponse_Page_AnnouncementVO_ } from '../models/BaseResponse_Page_AnnouncementVO_';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AnnouncementControllerService {
    /**
     * addAnnouncement
     * @param announcementAddRequest announcementAddRequest
     * @returns BaseResponse_long_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static addAnnouncementUsingPost(
        announcementAddRequest: AnnouncementAddRequest,
    ): CancelablePromise<BaseResponse_long_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/announcements',
            body: announcementAddRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * listAnnouncementByPage
     * @param adminId
     * @param content
     * @param coverImage
     * @param createTime
     * @param current
     * @param endTime
     * @param id
     * @param isValid
     * @param pageSize
     * @param priority
     * @param sortField
     * @param sortOrder
     * @param startTime
     * @param status
     * @param title
     * @returns BaseResponse_Page_Announcement_ OK
     * @throws ApiError
     */
    public static listAnnouncementByPageUsingGet(
        adminId?: number,
        content?: string,
        coverImage?: string,
        createTime?: string,
        current?: number,
        endTime?: string,
        id?: number,
        isValid?: boolean,
        pageSize?: number,
        priority?: number,
        sortField?: string,
        sortOrder?: string,
        startTime?: string,
        status?: number,
        title?: string,
    ): CancelablePromise<BaseResponse_Page_Announcement_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/announcements/admin/page',
            query: {
                'adminId': adminId,
                'content': content,
                'coverImage': coverImage,
                'createTime': createTime,
                'current': current,
                'endTime': endTime,
                'id': id,
                'isValid': isValid,
                'pageSize': pageSize,
                'priority': priority,
                'sortField': sortField,
                'sortOrder': sortOrder,
                'startTime': startTime,
                'status': status,
                'title': title,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * listAnnouncementVOByPage
     * @param adminId
     * @param content
     * @param coverImage
     * @param createTime
     * @param current
     * @param endTime
     * @param id
     * @param isValid
     * @param pageSize
     * @param priority
     * @param sortField
     * @param sortOrder
     * @param startTime
     * @param status
     * @param title
     * @returns BaseResponse_Page_AnnouncementVO_ OK
     * @throws ApiError
     */
    public static listAnnouncementVoByPageUsingGet(
        adminId?: number,
        content?: string,
        coverImage?: string,
        createTime?: string,
        current?: number,
        endTime?: string,
        id?: number,
        isValid?: boolean,
        pageSize?: number,
        priority?: number,
        sortField?: string,
        sortOrder?: string,
        startTime?: string,
        status?: number,
        title?: string,
    ): CancelablePromise<BaseResponse_Page_AnnouncementVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/announcements/page',
            query: {
                'adminId': adminId,
                'content': content,
                'coverImage': coverImage,
                'createTime': createTime,
                'current': current,
                'endTime': endTime,
                'id': id,
                'isValid': isValid,
                'pageSize': pageSize,
                'priority': priority,
                'sortField': sortField,
                'sortOrder': sortOrder,
                'startTime': startTime,
                'status': status,
                'title': title,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * getAnnouncementVOById
     * @param id id
     * @returns BaseResponse_AnnouncementVO_ OK
     * @throws ApiError
     */
    public static getAnnouncementVoByIdUsingGet(
        id: number,
    ): CancelablePromise<BaseResponse_AnnouncementVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/announcements/{id}',
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
     * deleteAnnouncement
     * @param id id
     * @returns BaseResponse_boolean_ OK
     * @throws ApiError
     */
    public static deleteAnnouncementUsingDelete(
        id: number,
    ): CancelablePromise<BaseResponse_boolean_> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/announcements/{id}',
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
     * updateAnnouncement
     * @param announcementUpdateRequest announcementUpdateRequest
     * @param id id
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static updateAnnouncementUsingPut(
        announcementUpdateRequest: AnnouncementUpdateRequest,
        id: number,
    ): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/announcements/{id}/admin',
            path: {
                'id': id,
            },
            body: announcementUpdateRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * hasReadAnnouncement
     * @param id id
     * @returns BaseResponse_boolean_ OK
     * @throws ApiError
     */
    public static hasReadAnnouncementUsingGet(
        id: number,
    ): CancelablePromise<BaseResponse_boolean_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/announcements/{id}/has-read',
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
     * readAnnouncement
     * @param id id
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static readAnnouncementUsingPost(
        id: number,
    ): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/announcements/{id}/read',
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
}
