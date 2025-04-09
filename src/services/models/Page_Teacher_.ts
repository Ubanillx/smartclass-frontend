/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { OrderItem } from './OrderItem.ts';
import type { Teacher } from './Teacher.ts';
export type Page_Teacher_ = {
    countId?: string;
    current?: number;
    maxLimit?: number;
    optimizeCountSql?: boolean;
    orders?: Array<OrderItem>;
    pages?: number;
    records?: Array<Teacher>;
    searchCount?: boolean;
    size?: number;
    total?: number;
};

