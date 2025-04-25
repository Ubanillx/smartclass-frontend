/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AnnouncementVO } from './AnnouncementVO.ts';
import type { OrderItem } from './OrderItem.ts';
export type Page_AnnouncementVO_ = {
  countId?: string;
  current?: number;
  maxLimit?: number;
  optimizeCountSql?: boolean;
  orders?: Array<OrderItem>;
  pages?: number;
  records?: Array<AnnouncementVO>;
  searchCount?: boolean;
  size?: number;
  total?: number;
};
