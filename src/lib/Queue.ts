import * as Queue from "bull";
import { redisConfig } from "../config/redis";
import * as jobs from "../jobs";

interface JobDTO {
  bull: Queue.Queue<any>;
  name: string;
  handle: () => void;
}

const queues = Object.values(jobs)
  .filter((job) => job.key)
  .map((job) => ({
    bull: new Queue(job.key, { redis: redisConfig }),
    name: job.key,
    handle: job.handle,
  }));

export default {
  queues,
  add(name: "test", data?: object, opts?: Queue.JobOptions) {
    const queue: JobDTO = this.queues.find(
      (queue: JobDTO) => queue.name === name
    );

    return queue?.bull.add(data, opts);
  },
  process() {
    return this.queues.forEach((queue: JobDTO) => {
      queue.bull.process(queue.handle);

      queue.bull.on("active", (job, err) => {
        console.log("INICIO", job.queue.name);
      });
      queue.bull.on("completed", (job, err) => {
        console.log("FIM", job.queue.name);
      });

      queue.bull.on("failed", (job, err) => {
        console.log(job);
        console.log(err);
      });
    });
  },
};
