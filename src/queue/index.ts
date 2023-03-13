import type { queue as queueFastq } from "fastq";
import * as fastq from "fastq";
import { worker } from "./worker";

const CONCURRENCY = 4;

export type Task = {
  search?: string;
  entity:
    | "billetViewImportPortal"
    | "brandViewImportPortal"
    | "clientViewImportPortal"
    | "orderViewImportPortal"
    | "sellerViewImportPortal";
};

export const queue: queueFastq<Task> = fastq(worker, CONCURRENCY);
