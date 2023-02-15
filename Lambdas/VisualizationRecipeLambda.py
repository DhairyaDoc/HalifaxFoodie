import json
import boto3
import urllib3

http = urllib3.PoolManager()

client = boto3.resource("dynamodb")

tableName = client.Table("Recipe")
RequiredList = []
FinalDict = {}


def lambda_handler(event, context):
    json_body = json.loads(event['body'])
    restaurant_name = json_body['restaurantName']    
    
   
    for item in tableName.scan()['Items']:
        recipeDict ={}
        recipeDict['name'] = item['nameOfTheRecipe']
        recipeDict['price'] = str(item['price'])
        recipeDict['restaurant'] = item['restaurant']
        if(recipeDict['restaurant'] == restaurant_name):
            RequiredList.append(recipeDict)
    response = http.request('POST',
                        'https://us-central1-serverless2-365815.cloudfunctions.net/data_transfer',
                        body = json.dumps(RequiredList),
                        headers = {'Content-Type': 'application/json'},
                        retries = False)
    print(RequiredList)
        
    return {
        'statusCode': 200,
        'body': json.dumps(RequiredList)
    }
