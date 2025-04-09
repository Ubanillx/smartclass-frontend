/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseResponse_boolean_ } from '../models/BaseResponse_boolean_.ts';
import type { BaseResponse_CourseChapter_ } from '../models/BaseResponse_CourseChapter_.ts';
import type { BaseResponse_List_CourseChapter_ } from '../models/BaseResponse_List_CourseChapter_.ts';
import type { BaseResponse_long_ } from '../models/BaseResponse_long_.ts';
import type { BaseResponse_Page_CourseChapter_ } from '../models/BaseResponse_Page_CourseChapter_.ts';
import type { CourseChapter } from '../models/CourseChapter.ts';
import type { CancelablePromise } from '../core/CancelablePromise.ts';
import { OpenAPI } from '../core/OpenAPI.ts';
import { request as __request } from '../core/request.ts';
export class CourseChapterControllerService {
    /**
     * addChapter
     * @param courseChapter courseChapter
     * @returns BaseResponse_long_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static addChapterUsingPost(
        courseChapter: CourseChapter,
    ): CancelablePromise<BaseResponse_long_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/course/chapter/add',
            body: courseChapter,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * deleteChapter
     * @param id id
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static deleteChapterUsingPost(
        id: number,
    ): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/course/chapter/delete',
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
     * getChapterById
     * @param id id
     * @returns BaseResponse_CourseChapter_ OK
     * @throws ApiError
     */
    public static getChapterByIdUsingGet(
        id: number,
    ): CancelablePromise<BaseResponse_CourseChapter_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/course/chapter/get',
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
     * listChapters
     * @param courseId courseId
     * @returns BaseResponse_List_CourseChapter_ OK
     * @throws ApiError
     */
    public static listChaptersUsingGet(
        courseId: number,
    ): CancelablePromise<BaseResponse_List_CourseChapter_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/course/chapter/list',
            query: {
                'courseId': courseId,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * listChaptersByPage
     * @param courseId courseId
     * @param current current
     * @param pageSize pageSize
     * @returns BaseResponse_Page_CourseChapter_ OK
     * @throws ApiError
     */
    public static listChaptersByPageUsingGet(
        courseId: number,
        current: number = 1,
        pageSize: number = 10,
    ): CancelablePromise<BaseResponse_Page_CourseChapter_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/course/chapter/list/page',
            query: {
                'courseId': courseId,
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
    /**
     * updateChapter
     * @param courseChapter courseChapter
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static updateChapterUsingPost(
        courseChapter: CourseChapter,
    ): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/course/chapter/update',
            body: courseChapter,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
}
