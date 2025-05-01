/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Announcement } from './Announcement';
import type { OrderItem } from './OrderItem';
export type Page_Announcement_ = {
    countId?: string;
    current?: number;
    maxLimit?: number;
    optimizeCountSql?: boolean;
    orders?: Array<OrderItem>;
    pages?: number;
    records?: Array<Announcement>;
    searchCount?: boolean;
    size?: number;
    total?: number;
};

