/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DailyArticle } from './DailyArticle';
import type { OrderItem } from './OrderItem';
export type Page_DailyArticle_ = {
    countId?: string;
    current?: number;
    maxLimit?: number;
    optimizeCountSql?: boolean;
    orders?: Array<OrderItem>;
    pages?: number;
    records?: Array<DailyArticle>;
    searchCount?: boolean;
    size?: number;
    total?: number;
};

