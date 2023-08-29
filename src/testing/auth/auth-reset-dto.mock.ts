import { AuthResetDto } from "../../auth/dto/auth-reset.dto";
import { accessToken } from "../jwt/access-token.mock";


export const fakeAuthResetDto: AuthResetDto = {
  password: "123456",
  token: accessToken
}
  