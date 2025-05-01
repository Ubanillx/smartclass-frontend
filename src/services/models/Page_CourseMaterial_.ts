/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CourseMaterial } from './CourseMaterial';
import type { OrderItem } from './OrderItem';
export type Page_CourseMaterial_ = {
    countId?: string;
    current?: number;
    maxLimit?: number;
    optimizeCountSql?: boolean;
    orders?: Array<OrderItem>;
    pages?: number;
    records?: Array<CourseMaterial>;
    searchCount?: boolean;
    size?: number;
    total?: number;
};

