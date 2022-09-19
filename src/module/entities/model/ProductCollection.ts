export class ProductCollection {
  collectionCode: number;
  collectionDescription: string;
  abbreviation: string;
  situation: number;
  inativationDateOfProdColection: string;
  lastChangeDate: string;
  lastChangeTime: number;
}

export class ProductCollectionExtraFields {}

export class ProductCollectionFields {
  collectionCode?: boolean;
  collectionDescription?: boolean;
  abbreviation?: boolean;
  situation?: boolean;
  inativationDateOfProdColection?: boolean;
  lastChangeDate?: boolean;
  lastChangeTime?: boolean;
}
