import { parseAsInteger, parseAsString } from "nuqs";
import { PAGINATION } from "@/config/constants";

export const workflowsParams = {
    page: parseAsInteger
    .withDefault(PAGINATION.DEFAULT_PAGE),
    pageSize: parseAsInteger
    .withDefault(PAGINATION.DEFAULT_PAGE_SIZE),
    search: parseAsString
    .withDefault(""),
}