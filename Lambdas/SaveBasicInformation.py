import json
import boto3

dynamodbClient = boto3.client('dynamodb')
tableCustomer = "HalifaxFoodie_CustomerDetails"
tableRestaurant = "HalifaxFoodie_RestaurantDetails"

def lambda_handler(event, context):
    print(event)
    
    headers = {
        'Access-Control-Allow-Methods': 'POST, GET',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*'
    }

    if 'body' in event:
        body = event['body']
        print (body)
        body = json.loads(body)
        name = body['name']
        email = body['email']
        userType = body['userType']
        print (name, email, userType)
        
        if (userType.lower() == 'restaurant'):
            dynamodbClient.put_item(
                TableName=tableRestaurant,
                Item={
                    "email":{
                        'S': email
                    },
                    "name":{
                        'S':name
                    }
                }
                )
        else:
            dynamodbClient.put_item(
                TableName=tableCustomer,
                Item={
                    "email":{
                        'S': email
                    },
                    "name":{
                        'S':name
                    }
                }
                )
        

    return {
        'statusCode': 200,
        'body': json.dumps('Information saved successfully!'),
        'headers': headers
    }
