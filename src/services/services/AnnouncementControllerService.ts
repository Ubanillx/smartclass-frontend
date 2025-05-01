/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AnnouncementAddRequest } from '../models/AnnouncementAddRequest';
import type { AnnouncementQueryRequest } from '../models/AnnouncementQueryRequest';
import type { AnnouncementUpdateRequest } from '../models/AnnouncementUpdateRequest';
import type { BaseResponse_AnnouncementVO_ } from '../models/BaseResponse_AnnouncementVO_';
import type { BaseResponse_boolean_ } from '../models/BaseResponse_boolean_';
import type { BaseResponse_long_ } from '../models/BaseResponse_long_';
import type { BaseResponse_Page_Announcement_ } from '../models/BaseResponse_Page_Announcement_';
import type { BaseResponse_Page_AnnouncementVO_ } from '../models/BaseResponse_Page_AnnouncementVO_';
import type { DeleteRequest_1 } from '../models/DeleteRequest_1';
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
        deleteRequest: DeleteRequest_1,
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
     * getAnnouncementVOById
     * @param id id
     * @returns BaseResponse_AnnouncementVO_ OK
     * @throws ApiError
     */
    public static getAnnouncementVoByIdUsingGet(
        id?: number,
    ): CancelablePromise<BaseResponse_AnnouncementVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/announcement/get/vo',
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
            url: '/api/announcement/has-read/{id}',
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
     * listAnnouncementVOByPage
     * @param announcementQueryRequest announcementQueryRequest
     * @returns BaseResponse_Page_AnnouncementVO_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static listAnnouncementVoByPageUsingPost(
        announcementQueryRequest: AnnouncementQueryRequest,
    ): CancelablePromise<BaseResponse_Page_AnnouncementVO_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/announcement/list/page/vo',
            body: announcementQueryRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * listValidAnnouncements
     * @param current current
     * @param size size
     * @returns BaseResponse_Page_AnnouncementVO_ OK
     * @throws ApiError
     */
    public static listValidAnnouncementsUsingGet(
        current: number = 1,
        size: number = 10,
    ): CancelablePromise<BaseResponse_Page_AnnouncementVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/announcement/list/valid',
            query: {
                'current': current,
                'size': size,
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
            url: '/api/announcement/read/{id}',
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
