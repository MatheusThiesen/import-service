import { objectToForEach } from "./objectToForEach";

export function filterFieldsNormalized(obj: Object): string {
  if (obj) {
    let data: string[] = [];
    objectToForEach(obj, (key, value) => {
      if (typeof value === "object") {
        data.push(
          filterFieldsNormalized(value)
            .split(",")
            .map((item) => `${key}.${item}`)
            .join()
        );
      } else {
        if (value) {
          data.push(key);
        }
      }
    });

    return data.join();
  }

  return undefined;
}
