/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseResponse_boolean_ } from '../models/BaseResponse_boolean_';
import type { BaseResponse_CourseSection_ } from '../models/BaseResponse_CourseSection_';
import type { BaseResponse_int_ } from '../models/BaseResponse_int_';
import type { BaseResponse_List_CourseSection_ } from '../models/BaseResponse_List_CourseSection_';
import type { BaseResponse_long_ } from '../models/BaseResponse_long_';
import type { BaseResponse_Page_CourseSection_ } from '../models/BaseResponse_Page_CourseSection_';
import type { CourseSection } from '../models/CourseSection';
import type { DeleteRequest } from '../models/DeleteRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class CourseSectionControllerService {
    /**
     * addSection
     * @param courseSection courseSection
     * @returns BaseResponse_long_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static addSectionUsingPost(
        courseSection: CourseSection,
    ): CancelablePromise<BaseResponse_long_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/course/section/add',
            body: courseSection,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * getSectionCount
     * @param courseId courseId
     * @returns BaseResponse_int_ OK
     * @throws ApiError
     */
    public static getSectionCountUsingGet(
        courseId: number,
    ): CancelablePromise<BaseResponse_int_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/course/section/count',
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
     * deleteSection
     * @param deleteRequest deleteRequest
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static deleteSectionUsingPost(
        deleteRequest: DeleteRequest,
    ): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/course/section/delete',
            body: deleteRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * getTotalDuration
     * @param courseId courseId
     * @returns BaseResponse_int_ OK
     * @throws ApiError
     */
    public static getTotalDurationUsingGet(
        courseId: number,
    ): CancelablePromise<BaseResponse_int_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/course/section/duration',
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
     * getSectionById
     * @param id id
     * @returns BaseResponse_CourseSection_ OK
     * @throws ApiError
     */
    public static getSectionByIdUsingGet(
        id: number,
    ): CancelablePromise<BaseResponse_CourseSection_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/course/section/get',
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
     * listSectionsByChapterId
     * @param chapterId chapterId
     * @returns BaseResponse_List_CourseSection_ OK
     * @throws ApiError
     */
    public static listSectionsByChapterIdUsingGet(
        chapterId: number,
    ): CancelablePromise<BaseResponse_List_CourseSection_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/course/section/list/chapter',
            query: {
                'chapterId': chapterId,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * listSectionsByCourseId
     * @param courseId courseId
     * @returns BaseResponse_List_CourseSection_ OK
     * @throws ApiError
     */
    public static listSectionsByCourseIdUsingGet(
        courseId: number,
    ): CancelablePromise<BaseResponse_List_CourseSection_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/course/section/list/course',
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
     * listSectionsByPage
     * @param chapterId chapterId
     * @param courseId courseId
     * @param current current
     * @param pageSize pageSize
     * @returns BaseResponse_Page_CourseSection_ OK
     * @throws ApiError
     */
    public static listSectionsByPageUsingGet(
        chapterId?: number,
        courseId?: number,
        current: number = 1,
        pageSize: number = 10,
    ): CancelablePromise<BaseResponse_Page_CourseSection_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/course/section/list/page',
            query: {
                'chapterId': chapterId,
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
     * updateSection
     * @param courseSection courseSection
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static updateSectionUsingPost(
        courseSection: CourseSection,
    ): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/course/section/update',
            body: courseSection,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * updateSectionVideo
     * @param file file
     * @param sectionId sectionId
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static updateSectionVideoUsingPost(
        file: Blob,
        sectionId: number,
    ): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/course/section/update/video',
            query: {
                'sectionId': sectionId,
            },
            formData: {
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
     * uploadVideoAndAddSection
     * @param file file
     * @param chapterId
     * @param courseId
     * @param description
     * @param sectionId
     * @param sort
     * @param title
     * @returns BaseResponse_long_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static uploadVideoAndAddSectionUsingPost(
        file: Blob,
        chapterId?: number,
        courseId?: number,
        description?: string,
        sectionId?: number,
        sort?: number,
        title?: string,
    ): CancelablePromise<BaseResponse_long_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/course/section/upload',
            query: {
                'chapterId': chapterId,
                'courseId': courseId,
                'description': description,
                'sectionId': sectionId,
                'sort': sort,
                'title': title,
            },
            formData: {
                'file': file,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
}
