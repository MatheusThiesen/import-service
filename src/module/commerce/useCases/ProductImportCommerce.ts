import { dbSiger } from "../../../service/dbSiger";
import { SendDataRepository } from "../repositories/SendDataRepository";
import { ExecuteServiceProps } from "../types/ExecuteService";

interface ProductRecibe {
  codigo: number;
  situacao: number;
  linhaProducao: number;
  bloqVenda: number;
  bloqProducao: number;
  codAlternativo: string;
  referencia: string;
  descricao: string;
  descricaoComplementar: string;
  descricaoLonga: string;
  precoPromo: number;
  marcaCod: number;
  corUmCod: number;
  corDoisCod: number;
  colecaoCod: number;
  linhaCod: number;
  grupoCod: number;
  subGrupoCod: number;
  genero: number;
  precoVenda: number;
  qtdEmbalagem: number;
  obs: string;
  ncm: string;
  unidadeMedida: string;
  unidadeMedidaDesc: string;
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
  marcaCodigo: number;
  corPrimariaCodigo: number;
  corSecundariaCodigo: number;
  colecaoCodigo: number;
  linhaCodigo: number;
  grupoCodigo: number;
  subgrupoCodigo: number;
  generoCodigo: number;
  precoVendaEmpresa: number;
  qtdEmbalagem: number;
  obs: string;
  ncm: string;
  unitMeasure: string;
  unitMeasureDesc: string;
  imagemPreview?: string;
}

export class ProductImportCommerce {
  readonly pagesize = 5000;

  constructor(private sendData: SendDataRepository) {}

  async normalizedProduct(
    products: ProductRecibe[]
  ): Promise<ProductNormalized[]> {
    let normalizedProducts: ProductNormalized[] = [];
    for (const product of products) {
      const getImagemPreview = await dbSiger.$ExecuteQuery<{
        imagemNome: string;
      }>(`
      select i.imagemNome from 01010s005.DEV_PRODUTO_IMAGEM i
      where i.produtoCod in (${product.codigo}) 
      order by i.sequencia
      limit 1
    `);

      const imagemPreview =
        getImagemPreview &&
        getImagemPreview[0] &&
        getImagemPreview[0].imagemNome
          ? this.removeExtension(getImagemPreview[0].imagemNome)
          : undefined;

      normalizedProducts.push({
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
        marcaCodigo: product.marcaCod,
        corPrimariaCodigo: product.corUmCod,
        corSecundariaCodigo: product.corDoisCod,
        colecaoCodigo: product.colecaoCod,
        linhaCodigo: product.linhaCod,
        grupoCodigo: product.grupoCod,
        subgrupoCodigo: product.subGrupoCod,
        generoCodigo: product.genero,
        precoVendaEmpresa: product.precoVenda,
        qtdEmbalagem: product?.qtdEmbalagem ? Number(product.qtdEmbalagem) : 0,
        obs: product.obs,
        ncm: product.ncm,
        unitMeasure: product.unidadeMedida,
        unitMeasureDesc: product.unidadeMedidaDesc,
        imagemPreview,
      });
    }

    return normalizedProducts;
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
        p.bloqProducao,
        p.codAlternativo,
        p.referencia,
        p.descricao,
        p.descricaoComplementar,
        p.descricaoLonga,
        p.precoPromo,
        p.marcaCod,
        p.corUmCod,
        p.corDoisCod,
        p.colecaoCod,
        p.linhaCod,		
        p.grupoCod,
        p.subGrupoCod,
        p.genero,
        p.precoVenda,
        p.qtdEmbalagem,
        p.obs,
        p.ncm,
        p.unidadeMedida,
        p.unidadeMedidaDesc
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

  removeExtension(filename: string) {
    const splitName = filename.split(".");
    return splitName.filter((_, i) => i !== splitName.length - 1).join(".");
  }

  async execute({ search }: ExecuteServiceProps) {
    try {
      const query = `marcaCod IN (10,20,1,24,23,2,26,400, 27 ) ${
        search ? `AND ${search}` : ""
      }`;

      const totalItems = await this.getProductsTotal({ search: query });
      const totalPages = Math.ceil(totalItems / this.pagesize);

      for (let index = 0; index < totalPages; index++) {
        const page = index;

        const products = await this.getProducts({
          search: query,
          page: page,
          pagesize: this.pagesize,
        });

        await this.sendData.post("/products/import", products);
      }
    } catch (error) {
      console.log("[PRODUCTS][ERRO]");
    }
  }
}
