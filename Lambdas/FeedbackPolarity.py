import json
import boto3
import urllib.request

# https://stackoverflow.com/questions/25491541/python3-json-post-request-without-requests-library
def lambda_handler(event, context):
    
    headers = {
        'Access-Control-Allow-Methods': 'POST, GET',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*'
    }
    
    if ('body' in event):
        body = event['body']
        body = json.loads(body)
        if 'email' in body:
            email = body['email']
        
    feedbacks = fetchFromDyanomo(email)
    polarity = detectSentiment(feedbacks)
    print (polarity)
    
    conditionsSetURL = 'https://us-central1-serverless-project-369304.cloudfunctions.net/FalifaxFoodie-loadToBucket'
    jsonObject = json.dumps(polarity).encode('utf8')
    
    req = urllib.request.Request(conditionsSetURL, data=jsonObject, headers={'content-type': 'application/json'})
    response = urllib.request.urlopen(req)
    print(response.read().decode('utf8'))
    

    return {
        'statusCode': 200,
        'body': json.dumps("it ran"),
        'headers': headers
    }
    
def fetchFromDyanomo(email):

    dynamodbClient = boto3.resource('dynamodb', region_name = 'us-east-1')
    table = dynamodbClient.Table('Rating')
    tableResponse = table.scan()
    itemsReceived = tableResponse['Items']
    feedbackList = []
    for row in itemsReceived:
        if row['email'] == email:
            feedbackList.append(row['feedback'])


    return feedbackList

# https://boto3.amazonaws.com/v1/documentation/api/1.9.42/reference/services/comprehend.html
def detectSentiment(feedbacks):
    polarity = []
    comprehend_client =boto3.client("comprehend", region_name="us-east-1")
    for text in feedbacks:
        if (len(text) > 0):
            try:
                polarity.append(comprehend_client.detect_sentiment(
                    Text=text, LanguageCode='en')['Sentiment'])
            except ClientError:
                print("Couldn't detect sentiment.")
    return polarity