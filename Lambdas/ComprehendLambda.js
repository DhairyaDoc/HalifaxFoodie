/**
 * Title: Extracting metadata from the uploaded recipes using AWS Comprehend
 * Author: Dhairya Doctor
 * Date: 2022/11/20
 * Availability: https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Comprehend.html
 */
const AWS = require("aws-sdk");

const comprehendTesting = new AWS.Comprehend({ apiVersion: "2017-11-27" });
const s3 = new AWS.S3({ apiVersion: "2006-03-01" });
const dynamodbClient = new AWS.DynamoDB.DocumentClient();

const recipeTableName = "Recipe";

exports.handler = (event) => {
  /** Name of the bucket */
  const bucketName = event.Records[0].s3.bucket.name;

  /** Name of the file uploaded along with extension */
  const bucketKey = event.Records[0].s3.object.key;

  /** Getting the name of the recipe from the file name */
  const recipeName = bucketKey.split(".")[0];

  const params = {
    Bucket: bucketName,
    Key: bucketKey,
  };

  /** Reading the content of the file */
  s3.getObject(params, (err, data) => {
    if (err) {
      console.log("Error in getting data from S3: ", err);
    } else {
      let recipeDetails = data.Body.toString("ascii");

      /* Detecting Entities */
      var entityParams = {
        Text: recipeDetails,
        LanguageCode: "en",
      };

      comprehendTesting.detectEntities(entityParams, (err, data) => {
        if (err) {
          console.error("Error occurred while finding entities: ", err);
        } else {
          updateTableValue(recipeName, "Entities", data.Entities);
        }
      });

      /* Detecting Key Phrases */
      var keyPhrasesParams = {
        Text: recipeDetails,
        LanguageCode: "en",
      };

      comprehendTesting.detectKeyPhrases(keyPhrasesParams, (err, data) => {
        if (err) {
          console.error("Error occurred while finding key phrases: ", err);
        } else {
          updateTableValue(recipeName, "KeyPhrases", data.KeyPhrases);
        }
      });

      /* Detecting PII(Personal Identifiable Information) */
      var PIIParams = {
        Text: recipeDetails,
        LanguageCode: "en",
      };

      comprehendTesting.detectPiiEntities(PIIParams, (err, data) => {
        if (err) {
          console.error("Error occurred while identifying PII: ", err);
        } else {
          updateTableValue(recipeName, "PII", data.Entities);
        }
      });

      /* Detecting Sentiments */
      var sentimentParams = {
        Text: recipeDetails,
        LanguageCode: "en",
      };

      comprehendTesting.detectSentiment(sentimentParams, (err, data) => {
        if (err) {
          console.error("Error occurred while finding sentiments: ", data);
        } else {
          updateTableValue(recipeName, "Sentiment", data.Sentiment);
          updateTableValue(recipeName, "SentimentScore", data.SentimentScore);
        }
      });
    }
  });

  return "";
};

/** Function for adding the metadata generated using AWS Comprehend in DynamoDB */
const updateTableValue = (partitionValue, updateKey, updateValue) => {
  const params = {
    TableName: recipeTableName,
    Key: {
      nameOfTheRecipe: partitionValue,
    },
    UpdateExpression: `set ${updateKey} = :value`,
    ExpressionAttributeValues: {
      ":value": updateValue,
    },
    ReturnValues: "UPDATED_NEW",
  };

  dynamodbClient
    .update(params)
    .promise()
    .then(
      (response) => {
        console.log(
          updateKey + " stored with value " + response + " successfully"
        );
      },
      (error) => {
        console.log(
          "Error while updating Dynamo DB column " +
            updateKey +
            " with error " +
            error
        );
      }
    );
};
