import { IBrandRepository } from "../repositories/types/IBrandRepository";

export class Entities {
  constructor(private brandRepository: IBrandRepository) {}

  execute() {
    return {
      brand: this.brandRepository,
    };
  }
}
