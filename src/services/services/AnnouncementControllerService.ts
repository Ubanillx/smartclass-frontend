/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AnnouncementAddRequest } from '../models/AnnouncementAddRequest';
import type { AnnouncementQueryRequest } from '../models/AnnouncementQueryRequest';
import type { AnnouncementUpdateRequest } from '../models/AnnouncementUpdateRequest';
import type { BaseResponse_Announcement_ } from '../models/BaseResponse_Announcement_';
import type { BaseResponse_boolean_ } from '../models/BaseResponse_boolean_';
import type { BaseResponse_List_Announcement_ } from '../models/BaseResponse_List_Announcement_';
import type { BaseResponse_long_ } from '../models/BaseResponse_long_';
import type { BaseResponse_Page_Announcement_ } from '../models/BaseResponse_Page_Announcement_';
import type { DeleteRequest } from '../models/DeleteRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AnnouncementControllerService {
    /**
     * getActiveAnnouncements
     * @returns BaseResponse_List_Announcement_ OK
     * @throws ApiError
     */
    public static getActiveAnnouncementsUsingGet(): CancelablePromise<BaseResponse_List_Announcement_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/announcement/active',
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
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
            url: '/api/announcement/add',
            body: announcementAddRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * deleteAnnouncement
     * @param deleteRequest deleteRequest
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static deleteAnnouncementUsingPost(
        deleteRequest: DeleteRequest,
    ): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/announcement/delete',
            body: deleteRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * getAnnouncementById
     * @param id id
     * @returns BaseResponse_Announcement_ OK
     * @throws ApiError
     */
    public static getAnnouncementByIdUsingGet(
        id?: number,
    ): CancelablePromise<BaseResponse_Announcement_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/announcement/get',
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
     * getLatestAnnouncements
     * @returns BaseResponse_List_Announcement_ OK
     * @throws ApiError
     */
    public static getLatestAnnouncementsUsingGet(): CancelablePromise<BaseResponse_List_Announcement_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/announcement/latest',
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * listAnnouncementByPage
     * @param announcementQueryRequest announcementQueryRequest
     * @returns BaseResponse_Page_Announcement_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static listAnnouncementByPageUsingPost(
        announcementQueryRequest: AnnouncementQueryRequest,
    ): CancelablePromise<BaseResponse_Page_Announcement_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/announcement/list/page',
            body: announcementQueryRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * updateAnnouncement
     * @param announcementUpdateRequest announcementUpdateRequest
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static updateAnnouncementUsingPost(
        announcementUpdateRequest: AnnouncementUpdateRequest,
    ): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/announcement/update',
            body: announcementUpdateRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
}
