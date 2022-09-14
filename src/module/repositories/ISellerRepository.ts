import { Seller } from "../model/Seller";

export interface ISellerRepository {
  getAll(): Promise<Seller[]>;
}
