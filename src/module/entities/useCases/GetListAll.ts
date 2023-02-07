import { apiSiger } from "../../../service/apiSiger";
import { SigerDTO } from "../../../service/siger";

interface QueryEntitySigerProps {
  entity: string;
  search: string;
  fields: string;
  extraFields?: string;

  organization?: string;
  limit?: number;

  page?: number;
  size?: number;
  isPagination?: boolean;
}

export interface GetListAllResponse<T> {
  content: T[];

  status?: {
    message: string;
    code: number;
  };

  pageable?: {
    page: number;
    size: number;
    pageSize: number;
    pageNumber: number;
    offset: number;
    unpaged: boolean;
    paged: boolean;
  };
  totalElements?: number;
  numberOfElements?: number;
  totalPages?: number;
}

export class GetListAll {
  async execute<T>({
    search,
    fields,
    extraFields,
    entity,
    limit = 200,
    page,
    size,
    isPagination = false,
    organization = "018",
  }: QueryEntitySigerProps): Promise<GetListAllResponse<T>> {
    let query: any = {
      entity: entity,
      search: search,
      fields: fields,
      organization: organization,
    };

    if (extraFields) {
      query = { ...query, extraFields: extraFields };
    }

    if (isPagination) {
      query = { ...query, page, size };
    } else {
      query = { ...query, size: limit, page: 0 };
    }

    let data: T[] = [];

    const response = await apiSiger.get<SigerDTO<T>>("/api/v1/get-list", {
      params: { ...query },
    });

    if (isPagination) {
      return response.data;
    }

    data = response.data.content;

    const totalPages = Number(response.data.totalPages);

    // if (data.length > 0) {
    //   console.log(query);
    // }

    for (let index = 0; index < totalPages; index++) {
      const page = index + 1;

      // console.log(`${query?.entity}  ${page} de ${totalPages}`);

      const response = await apiSiger.get<SigerDTO<T>>("/api/v1/get-list", {
        params: { ...query, size: limit, page },
      });
      data = [...data, ...response.data.content];
    }

    return {
      content: data,
    };
  }
}
