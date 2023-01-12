import { apiSiger } from "../../../service/apiSiger";
import { SigerDTO } from "../../../service/siger";

interface QueryEntitySigerProps {
  entity: string;
  search: string;
  fields: string;
  extraFields?: string;

  limit?: number;
}

export class GetListAll {
  async execute<T>({
    search,
    fields,
    extraFields,
    entity,
    limit = 200,
  }: QueryEntitySigerProps) {
    let query: any = {
      entity: entity,
      search: search,
      fields: fields,
    };

    if (extraFields) {
      query = { ...query, extraFields: extraFields };
    }

    let data: T[] = [];

    const response = await apiSiger.get<SigerDTO<T>>("/api/v1/get-list", {
      params: { ...query, size: limit, page: 0 },
    });

    data = response.data.content;

    const totalPages = Number(response.data.totalPages);

    if (data.length > 0) {
      console.log(query);
    }

    for (let index = 0; index < totalPages; index++) {
      const page = index + 1;

      console.log(`${query?.entity}  ${page} de ${totalPages}`);

      const response = await apiSiger.get<SigerDTO<T>>("/api/v1/get-list", {
        params: { ...query, organization: "018", size: limit, page },
      });
      data = [...data, ...response.data.content];
    }

    return data;
  }
}
