import { CognitoUserPool } from "amazon-cognito-identity-js";

const poolData = {
  UserPoolId: "us-east-1_GodbRaxKD",
  ClientId: "5mrbfvrluqq988n8u719omm4hr",
};

export default new CognitoUserPool(poolData);
