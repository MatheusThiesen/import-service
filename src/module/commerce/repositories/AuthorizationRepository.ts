import { apiCommerce } from "../../../service/apiCommerce";

interface IResponseSingIn {
  access_token: string;
  refresh_token: string;
}

export class AuthorizationRepository {
  private email: string;
  private password: string;

  token: string;

  constructor() {
    this.email = process.env.COMMERCE_USER;
    this.password = process.env.COMMERCE_PASS;

    this.singIn();
  }

  async singIn() {
    try {
      const response = await apiCommerce.post<IResponseSingIn>(`/auth/signin`, {
        email: this.email,
        senha: this.password,
      });

      const { access_token } = response.data;

      this.token = access_token;

      return {
        token: access_token,
      };
    } catch (error) {
      return {
        token: null,
      };
    }
  }
}
