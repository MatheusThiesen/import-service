import { Job } from "bull";
import {} from "../module/portal/useCases";

export interface ExecuteFunctionProps {
  service: "ProductImportPortal" | "OrderImportPortal" | "GridImportPortal";
}

export default {
  key: "executeService",
  async handle({ data: { service } }: Job<ExecuteFunctionProps>) {
    try {
      switch (service) {
        case "ProductImportPortal":
          // productImportPortal.execute();
          break;

        case "OrderImportPortal":
          // orderImportPortal.execute();
          break;

        case "GridImportPortal":
          // gridImportPortal.execute();
          break;

        default:
          break;
      }

      console.log(
        `Run Service ${service} - ${new Date().toLocaleDateString("pt-br", {
          day: "2-digit",
          month: "2-digit",
          year: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })}`
      );
    } catch (error) {}
  },
};
