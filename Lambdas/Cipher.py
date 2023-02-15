import json
import math
import boto3

# https://www.geeksforgeeks.org/columnar-transposition-cipher/

dynamodbClient = boto3.client('dynamodb')
tableCustomer = "HalifaxFoodie_CustomerCipher"
tableRestaurant = "HalifaxFoodie_RestaurantCipher"

def lambda_handler(event, context):
    
    messageToReturn = 'False'
    
    headers = {
        'Access-Control-Allow-Methods': 'POST, GET',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*'
    }
    
    print ("below is the message")
    print (event)
    
    if ('body' in event):
        body = event['body']
        print (body)
        body = json.loads(body)
        if body['encryption'] == 'encryption':
            message = body['message']
            key = body['key']
            email = body['email']
            print ("Encryption for ", message + " " + key)
            encodedMessage = encryptMessage(message, key)
            messageToReturn = encodedMessage
            if body['userType'].lower() == 'restaurant':
                print ("for restaurant encryption")
                tableName = tableRestaurant
            else:
                print ("for customer encryption ", encodedMessage)
                tableName = tableCustomer
                
            dynamodbClient.put_item(
                TableName=tableName,
                Item={
                    "email":{
                        'S': email
                    },
                    "plainText":{
                        'S':message
                    },
                    "userKey":{
                        'S':key
                    }
                }
            )
            
        else:
            encodedMessage = body['encodedMessage']
            email = body['email']
            userType = body['userType']
            
            print ("Inside decryption ", encodedMessage, email, userType)
            messageToReturn = encodedMessage + " " + email + " " + userType
            
            if userType == 'restaurant':
                print ("decryptMessage for restaurant")
                tableName = tableRestaurant
                
            else:
                tableName = tableCustomer
                
                
            tableKey = {
            'email':{
                'S': email
            }
            }
            itemsReceived =  dynamodbClient.get_item(
            TableName = tableName,
            Key = tableKey
            )
            
            plainText = itemsReceived["Item"]["plainText"]["S"]
            userKey = itemsReceived["Item"]["userKey"]["S"]
            originalEncodedMessage = encryptMessage(plainText, userKey)
            
            print (plainText, userKey)
            if (encodedMessage == originalEncodedMessage):
                messageToReturn = 'True'


    
    
    return {
        'statusCode': 200,
        'body': json.dumps(messageToReturn),
        'headers': headers
    }
    
    



# Encryption
def encryptMessage(msg, key):
    cipher = ""

    # track key indices
    k_indx = 0

    msg_len = float(len(msg))
    msg_lst = list(msg)
    key_lst = sorted(list(key))

    # calculate column of the matrix
    col = len(key)

    # calculate maximum row of the matrix
    row = int(math.ceil(msg_len / col))

    # add the padding character '_' in empty
    # the empty cell of the matix
    fill_null = int((row * col) - msg_len)
    msg_lst.extend('_' * fill_null)

    # create Matrix and insert message and
    # padding characters row-wise
    matrix = [msg_lst[i: i + col]
              for i in range(0, len(msg_lst), col)]

    # read matrix column-wise using key
    for _ in range(col):
        curr_idx = key.index(key_lst[k_indx])
        cipher += ''.join([row[curr_idx]
                           for row in matrix])
        k_indx += 1

    return cipher

