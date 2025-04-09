/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DailyArticleVO } from './DailyArticleVO.ts';
import type { OrderItem } from './OrderItem.ts';
export type Page_DailyArticleVO_ = {
    countId?: string;
    current?: number;
    maxLimit?: number;
    optimizeCountSql?: boolean;
    orders?: Array<OrderItem>;
    pages?: number;
    records?: Array<DailyArticleVO>;
    searchCount?: boolean;
    size?: number;
    total?: number;
};

