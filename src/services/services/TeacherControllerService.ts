/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseResponse_boolean_ } from '../models/BaseResponse_boolean_.ts';
import type { BaseResponse_List_CourseVO_ } from '../models/BaseResponse_List_CourseVO_.ts';
import type { BaseResponse_List_TeacherVO_ } from '../models/BaseResponse_List_TeacherVO_.ts';
import type { BaseResponse_long_ } from '../models/BaseResponse_long_.ts';
import type { BaseResponse_Page_Teacher_ } from '../models/BaseResponse_Page_Teacher_.ts';
import type { BaseResponse_Page_TeacherVO_ } from '../models/BaseResponse_Page_TeacherVO_.ts';
import type { BaseResponse_Teacher_ } from '../models/BaseResponse_Teacher_.ts';
import type { BaseResponse_TeacherVO_ } from '../models/BaseResponse_TeacherVO_.ts';
import type { DeleteRequest_1 } from '../models/DeleteRequest_1.ts';
import type { TeacherAddRequest } from '../models/TeacherAddRequest.ts';
import type { TeacherQueryRequest } from '../models/TeacherQueryRequest.ts';
import type { TeacherUpdateRequest } from '../models/TeacherUpdateRequest.ts';
import type { CancelablePromise } from '../core/CancelablePromise.ts';
import { OpenAPI } from '../core/OpenAPI.ts';
import { request as __request } from '../core/request.ts';
export class TeacherControllerService {
    /**
     * addTeacher
     * @param teacherAddRequest teacherAddRequest
     * @returns BaseResponse_long_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static addTeacherUsingPost(
        teacherAddRequest: TeacherAddRequest,
    ): CancelablePromise<BaseResponse_long_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/teacher/add',
            body: teacherAddRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * getTeacherCourses
     * @param teacherId teacherId
     * @returns BaseResponse_List_CourseVO_ OK
     * @throws ApiError
     */
    public static getTeacherCoursesUsingGet(
        teacherId: number,
    ): CancelablePromise<BaseResponse_List_CourseVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/teacher/courses/{teacherId}',
            path: {
                'teacherId': teacherId,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * deleteTeacher
     * @param deleteRequest deleteRequest
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static deleteTeacherUsingPost(
        deleteRequest: DeleteRequest_1,
    ): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/teacher/delete',
            body: deleteRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * getTeacherById
     * @param id id
     * @returns BaseResponse_Teacher_ OK
     * @throws ApiError
     */
    public static getTeacherByIdUsingGet(
        id?: number,
    ): CancelablePromise<BaseResponse_Teacher_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/teacher/get',
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
     * getTeacherVOById
     * @param id id
     * @returns BaseResponse_TeacherVO_ OK
     * @throws ApiError
     */
    public static getTeacherVoByIdUsingGet(
        id?: number,
    ): CancelablePromise<BaseResponse_TeacherVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/teacher/get/vo',
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
     * listTeacherByPage
     * @param teacherQueryRequest teacherQueryRequest
     * @returns BaseResponse_Page_Teacher_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static listTeacherByPageUsingPost(
        teacherQueryRequest: TeacherQueryRequest,
    ): CancelablePromise<BaseResponse_Page_Teacher_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/teacher/list/page',
            body: teacherQueryRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * listTeacherVOByPage
     * @param teacherQueryRequest teacherQueryRequest
     * @returns BaseResponse_Page_TeacherVO_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static listTeacherVoByPageUsingPost(
        teacherQueryRequest: TeacherQueryRequest,
    ): CancelablePromise<BaseResponse_Page_TeacherVO_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/teacher/list/page/vo',
            body: teacherQueryRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * getRecommendTeachers
     * @param expertise expertise
     * @returns BaseResponse_List_TeacherVO_ OK
     * @throws ApiError
     */
    public static getRecommendTeachersUsingGet(
        expertise?: string,
    ): CancelablePromise<BaseResponse_List_TeacherVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/teacher/recommend',
            query: {
                'expertise': expertise,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * updateTeacher
     * @param teacherUpdateRequest teacherUpdateRequest
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static updateTeacherUsingPost(
        teacherUpdateRequest: TeacherUpdateRequest,
    ): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/teacher/update',
            body: teacherUpdateRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
}
