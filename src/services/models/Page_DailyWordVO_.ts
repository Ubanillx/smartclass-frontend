/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DailyWordVO } from './DailyWordVO.ts';
import type { OrderItem } from './OrderItem.ts';
export type Page_DailyWordVO_ = {
    countId?: string;
    current?: number;
    maxLimit?: number;
    optimizeCountSql?: boolean;
    orders?: Array<OrderItem>;
    pages?: number;
    records?: Array<DailyWordVO>;
    searchCount?: boolean;
    size?: number;
    total?: number;
};

