/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseResponse_boolean_ } from '../models/BaseResponse_boolean_.ts';
import type { BaseResponse_CourseReviewVO_ } from '../models/BaseResponse_CourseReviewVO_.ts';
import type { BaseResponse_long_ } from '../models/BaseResponse_long_.ts';
import type { BaseResponse_Map_string_object_ } from '../models/BaseResponse_Map_string_object_.ts';
import type { BaseResponse_Page_CourseReviewVO_ } from '../models/BaseResponse_Page_CourseReviewVO_.ts';
import type { CourseReview } from '../models/CourseReview.ts';
import type { CancelablePromise } from '../core/CancelablePromise.ts';
import { OpenAPI } from '../core/OpenAPI.ts';
import { request as __request } from '../core/request.ts';
export class CourseReviewControllerService {
    /**
     * addReview
     * @param courseReview courseReview
     * @returns BaseResponse_long_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static addReviewUsingPost(
        courseReview: CourseReview,
    ): CancelablePromise<BaseResponse_long_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/course/review/add',
            body: courseReview,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * replyReview
     * @param replyContent replyContent
     * @param reviewId reviewId
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static replyReviewUsingPost(
        replyContent: string,
        reviewId: number,
    ): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/course/review/admin/reply',
            query: {
                'replyContent': replyContent,
                'reviewId': reviewId,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * updateReviewStatus
     * @param reviewId reviewId
     * @param status status
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static updateReviewStatusUsingPost(
        reviewId: number,
        status: number,
    ): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/course/review/admin/status',
            query: {
                'reviewId': reviewId,
                'status': status,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * deleteReview
     * @param id id
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static deleteReviewUsingPost(
        id: number,
    ): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/course/review/delete',
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
     * getReviewById
     * @param id id
     * @returns BaseResponse_CourseReviewVO_ OK
     * @throws ApiError
     */
    public static getReviewByIdUsingGet(
        id: number,
    ): CancelablePromise<BaseResponse_CourseReviewVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/course/review/get',
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
     * likeReview
     * @param reviewId reviewId
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static likeReviewUsingPost(
        reviewId: number,
    ): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/course/review/like',
            query: {
                'reviewId': reviewId,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * listReviewsByPage
     * @param courseId courseId
     * @param current current
     * @param pageSize pageSize
     * @returns BaseResponse_Page_CourseReviewVO_ OK
     * @throws ApiError
     */
    public static listReviewsByPageUsingGet(
        courseId: number,
        current: number = 1,
        pageSize: number = 10,
    ): CancelablePromise<BaseResponse_Page_CourseReviewVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/course/review/list/page',
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
     * getRatingStats
     * @param courseId courseId
     * @returns BaseResponse_Map_string_object_ OK
     * @throws ApiError
     */
    public static getRatingStatsUsingGet(
        courseId: number,
    ): CancelablePromise<BaseResponse_Map_string_object_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/course/review/stats',
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
}
