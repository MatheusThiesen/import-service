import { Seller } from "../model/Seller";
import { ISellerRepository } from "./ISellerRepository";

export class SellerService implements ISellerRepository {
  getAll(): Promise<Seller[]> {
    throw new Error("Method not implemented.");
  }
}
