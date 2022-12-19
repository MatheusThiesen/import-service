// import "dotenv/config";
// import Queue from "./lib/Queue";
// // import cluster from "cluster";
// // import os from "os";
// // const numCPUs = os.cpus().length;

// try {
//   Queue.process();

//   // if (cluster?.isMaster) {
//   //   console.log(`[QUEUE] Master ${process.pid} is running`);
//   //   for (let i = 0; i < 3; i++) cluster.fork();

//   //   cluster.on("exit", (worker, _code, _signal) => {
//   //     console.log(`[QUEUE] worker ${worker.process.pid} died`);
//   //   });
//   // } else {
//   //   console.log(`[QUEUE] Worker ${process.pid} started`);
//   // }
// } catch (error) {
//   console.log(error);
// }
