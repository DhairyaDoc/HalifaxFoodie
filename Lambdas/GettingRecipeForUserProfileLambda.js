const AWS = require("aws-sdk");

AWS.config.update({
  region: "us-east-1",
});

const dynamodbClient = new AWS.DynamoDB.DocumentClient();

const recipeTableName = "Recipe";
const healthPath = "/health";
const getRecipePath = "/getrecipe";

exports.handler = async (event) => {
  let response;

  switch (true) {
    case event.httpMethod === "GET" && event.path === healthPath:
      response = buildResponse(200, "Application is healthy!");
      break;

    case event.httpMethod === "GET" && event.path === getRecipePath:
      let restaurantName = event.queryStringParameters.restaurantName;
      response = await getRestaurantRecipes(restaurantName);
      break;

    default:
      response = buildResponse(404, "404 not found!");
  }

  return response;
};

const getRestaurantRecipes = async (restaurantName) => {
  const params = {
    TableName: recipeTableName,
  };

  const allRecipes = await dynamodbClient.scan(params).promise();
  console.log(allRecipes);
  const filteredRecipes = allRecipes.Items.filter((recipe) => {
    return recipe && recipe["restaurant"] === restaurantName;
  });

  const body = {
    allRecipes: filteredRecipes,
  };

  return buildResponse(200, body);
};

const buildResponse = (statusCode, body) => {
  return {
    statusCode: statusCode,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  };
};
