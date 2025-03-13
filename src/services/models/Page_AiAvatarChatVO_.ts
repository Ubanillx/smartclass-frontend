/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AiAvatarChatVO } from './AiAvatarChatVO.ts';
import type { OrderItem } from './OrderItem.ts';
export type Page_AiAvatarChatVO_ = {
  countId?: string;
  current?: number;
  maxLimit?: number;
  optimizeCountSql?: boolean;
  orders?: Array<OrderItem>;
  pages?: number;
  records?: Array<AiAvatarChatVO>;
  searchCount?: boolean;
  size?: number;
  total?: number;
};
