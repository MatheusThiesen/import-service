import { dbSiger } from "../../../service/dbSiger";
import { SendDataRepository } from "../repositories/SendDataRepository";
import { ExecuteServiceProps } from "../types/ExecuteService";

interface ProductRecibe {
  codigo: number;
  situacao: number;
  linhaProducao: number;
  bloqVenda: number;
  codAlternativo: string;
  referencia: string;
  descricao: string;
  descricaoComplementar: string;
  descricaoLonga: string;
  precoPromo: number;
  unidadeEstoque: string;
  marcaCod: number;
  corUmCod: number;
  corDoisCod: number;
  colecaoCod: number;
  linhaCod: number;
  grupoCod: number;
  subGrupoCod: number;
  genero: number;
  precoVenda: number;
}

export interface ProductNormalized {
  cod: number;
  status: number;
  alternativeCode: string;
  reference: string;
  description: string;
  completeDescription: string;
  additionalDescription: string;
  salePrice: number;
  unitMeasure: string;
  marcaCodigo: number;
  corPrimariaCodigo: number;
  corSecundariaCodigo: number;
  colecaoCodigo: number;
  linhaCodigo: number;
  grupoCodigo: number;
  subgrupoCodigo: number;
  generoCodigo: number;
  precoVendaEmpresa: number;
}

export class ProductImportCommerce {
  readonly size = 5000;

  constructor(private sendData: SendDataRepository) {}

  normalizedProduct(products: ProductRecibe[]): ProductNormalized[] {
    return products.map((product) => ({
      cod: product.codigo,
      status:
        product.linhaProducao === 0 && product.bloqVenda === 2
          ? product.situacao
          : 0,
      alternativeCode: product.codAlternativo,
      reference: product.referencia,
      description: product.descricao,
      completeDescription: product.descricaoLonga,
      additionalDescription: product.descricaoComplementar,
      salePrice: product.precoPromo,
      unitMeasure: product.unidadeEstoque,
      marcaCodigo: product.marcaCod,
      corPrimariaCodigo: product.corUmCod,
      corSecundariaCodigo: product.corDoisCod,
      colecaoCodigo: product.colecaoCod,
      linhaCodigo: product.linhaCod,
      grupoCodigo: product.grupoCod,
      subgrupoCodigo: product.subGrupoCod,
      generoCodigo: product.genero,
      precoVendaEmpresa: product.precoVenda,
    }));
  }

  async getProducts({
    search,
    page,
    pagesize,
  }: {
    search: string;
    page: number;
    pagesize: number;
  }) {
    const whereNormalized = search ? `where ${search}` : ``;
    const limit = pagesize;
    const offset = pagesize * page;

    const productsResponse = await dbSiger.$ExecuteQuery<ProductRecibe>(`
      select  p.codigo,
        p.situacao,
        p.linhaProducao,
        p.bloqVenda,
        p.codAlternativo,
        p.referencia,
        p.descricao,
        p.descricaoComplementar,
        p.descricaoLonga,
        p.precoPromo,
        p.unidadeEstoque,
        p.marcaCod,
        p.corUmCod,
        p.corDoisCod,
        p.colecaoCod,
        p.linhaCod,		
        p.grupoCod,
        p.subGrupoCod,
        p.genero,
        p.precoVenda
      from 01010s005.dev_produto p 
      ${whereNormalized}
      limit ${limit}
      offset ${offset}
      ;
    `);

    return this.normalizedProduct(productsResponse);
  }

  async getProductsTotal({ search }: { search: string }) {
    const whereNormalized = search ? `where ${search}` : ``;

    const productsTotal = Number(
      (
        await dbSiger.$ExecuteQuery<{ total: string }>(
          `
          select  p.codigo,
          count(*) as total
        from 01010s005.dev_produto p 
        ${whereNormalized}
        
          ;
      `
        )
      )[0].total
    );

    return productsTotal;
  }

  async execute({ search }: ExecuteServiceProps) {
    const query = `marcaCod IN (10,20,1,24,23,2,26,400) ${
      search ? `AND ${search}` : ""
    }`;

    const totalPages = await this.getProductsTotal({ search: query });

    for (let index = 0; index < totalPages; index++) {
      const page = index;

      const products = await this.getProducts({
        search: query,
        page: page,
        pagesize: this.size,
      });

      await this.sendData.post("/products/import", products);
    }
  }
}
