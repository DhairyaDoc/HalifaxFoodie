import json
import boto3
import urllib3

http = urllib3.PoolManager()

client = boto3.resource("dynamodb")

tableName = client.Table("HalifaxFoodie_CustomerDetails")
RequiredList = []
FinalDict = {}

def lambda_handler(event, context):
   
    for item in tableName.scan()['Items']:
        userDict ={}
        userDict['name'] = item['name']
        userDict['email'] = item['email']
        RequiredList.append(userDict)
    response = http.request('POST',
                        'https://us-central1-serverless2-365815.cloudfunctions.net/user_data_transfer',
                        body = json.dumps(RequiredList),
                        headers = {'Content-Type': 'application/json'},
                        retries = False)
    print(RequiredList)
        
    return {
        'statusCode': RequiredList,
        'body': json.dumps(RequiredList)
    }
