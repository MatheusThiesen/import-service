import { objectToForEach } from "./objectToForEach";

export function filterFieldsNormalized(obj: Object, initial?: string): string {
  if (obj) {
    let data: string[] = [];
    objectToForEach(obj, (key, value) => {
      if (typeof value === "object") {
        data.push(
          filterFieldsNormalized(value, initial)
            .split(",")
            .map((item) => `${key}.${item}`)
            .join()
        );
      } else {
        if (value) {
          data.push(initial ? `${initial}.${key}` : key);
        }
      }
    });

    return data.join();
  }

  return undefined;
}
