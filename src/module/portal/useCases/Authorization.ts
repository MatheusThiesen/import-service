import Axios from "axios";

interface IResponseSingIn {
  user: {
    id: number;
    name: string;
    lastname: string;
    email: string;
  };
  token: {
    access_token: string;
    iat: number;
    exp: number;
  };
}

export class AuthorizationRepository {
  private email: string;
  private password: string;
  private baseUrl: string;

  token: string;

  constructor() {
    this.email = process.env.PORTAL_USER;
    this.password = process.env.PORTAL_PASS;
    this.baseUrl = process.env.PORTAL_URL;

    this.singIn();
  }

  async singIn() {
    const response = await Axios.post<IResponseSingIn>(
      `${this.baseUrl}/user/login`,
      {
        email: this.email,
        password: this.password,
      }
    );

    const {
      token: { access_token },
      user,
    } = response.data;

    this.token = access_token;

    return {
      user,
      token: access_token,
    };
  }
}
