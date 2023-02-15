import { CognitoUserPool } from "amazon-cognito-identity-js";

const poolData = {
  UserPoolId: "us-east-1_Qls2wZKs6",
  ClientId: "piof7gomhfvlb2cvplt7jjk6",
};

export default new CognitoUserPool(poolData);
