"""
Title: Fetching data from dynamodb 
Author: Shravya Reddy Gennepally
Date: 2022/11/06
Availability: https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/dynamodb.html

"""
 
import json
import boto3
import botocore.vendored.requests as requests
import urllib3

http = urllib3.PoolManager()

client = boto3.client("dynamodb")
result = {}
intent = ""

restaurantName = ""
userEmail = ""
orderid = ""


def lambda_handler(event, context):
    
    intent = event["sessionState"]["intent"]["name"]
    
    print(intent)
    if(intent == "Validation"):
        Mail = event["sessionState"]["intent"]["slots"]["email"]["value"]["originalValue"]
        Password = event["sessionState"]["intent"]["slots"]["password"]["value"]["originalValue"]
        print(Mail)
        print(Password)
        final = validateUser(Mail, Password)
        print(final)
        return final
    elif (intent == "Rating"):
        Feedback = event["sessionState"]["intent"]["slots"]["feedback"]["value"]["originalValue"]
        Order = event["sessionState"]["intent"]["slots"]["order"]["value"]["originalValue"]
        Rate = event["sessionState"]["intent"]["slots"]["rate"]["value"]["originalValue"]
        print(Order)
        print(Rate)
        finalRating = takeRating(Order, Rate, Feedback)
        print(finalRating)
        return finalRating
    elif (intent == "Tracking"):
        OrderNumber = event["sessionState"]["intent"]["slots"]["order"]["value"]["originalValue"]
        print(OrderNumber)
        tracking = trackOrder(OrderNumber)
        print(tracking)
        return tracking
    elif (intent == "Recipe"):
        RestaurantName = event["sessionState"]["intent"]["slots"]["restaurantName"]["value"]["originalValue"]
        RecipeName = event["sessionState"]["intent"]["slots"]["recipename"]["value"]["originalValue"]
        Price = event["sessionState"]["intent"]["slots"]["price"]["value"]["originalValue"]
        recipe = uploadRecipe(RestaurantName, RecipeName, Price)
        return recipe
    elif (intent == "Complaints"):
        sendBy = event["sessionState"]["intent"]["slots"]["restaurantName"]["value"]["originalValue"]
        sentTo = event["sessionState"]["intent"]["slots"]["userEmail"]["value"]["originalValue"]
        orderID = event["sessionState"]["intent"]["slots"]["orderid"]["value"]["originalValue"]
        chatRoomID = context.aws_request_id

        print(context.aws_request_id)
        # response = requests.post('https://us-central1-tough-hull-366114.cloudfunctions.net/function-1')
        response = http.request('POST',
                        'https://us-central1-tough-hull-366114.cloudfunctions.net/function-1',
                        body = json.dumps({"sendBy": sendBy, "sentTo" : sentTo, "orderID": orderID, "chatRoomID": chatRoomID }),
                        headers = {'Content-Type': 'application/json'},
                        retries = False)
        
        message = "Now you can move to chatroom "+chatRoomID
        result = { "sessionState" : {
                "dialogAction": {
                    "type": "Close"
                },
                "intent" : {
                    "name" : "Complaints",
                    "state" : "Fulfilled"
                }
                },
                "messages": [{
                    "contentType": "PlainText",
                    "content": message 
                    
                }]
                
            }  
        return result

        
def uploadRecipe(RestaurantName, RecipeName, Price):
    recipeResponse = client.put_item(TableName = 'Recipe',
    Item = { 'nameOfTheRecipe':{'S': RecipeName},
        'price' : {'N':Price},
        'restaurant' : {'S': RestaurantName}}
        )
    message = "Your recipe has been uploaded successfully"
    result = { "sessionState" : {
                "dialogAction": {
                    "type": "Close"
                },
                "intent" : {
                    "name" : "Recipe",
                    "state" : "Fulfilled"
                }
                },
                "messages": [{
                    "contentType": "PlainText",
                    "content": message 
                    
                }]
                
            }       
    return result
        
def trackOrder(OrderNumber):
    trackResponse = client.get_item(TableName='Rating',
    Key = { 'orderno':{
        'N' : OrderNumber,}
        }
        )
    key='Item'
    value = key in trackResponse.keys()
    if value:
        trackingStatus = trackResponse['Item']['status']['S']
        message = "The status of your order is "+trackingStatus+". Type"+'"'+ "tracking" +'"'+" if you want track another order of yours" 
        result = { "sessionState" : {
                "dialogAction": {
                    "type": "Close"
                },
                "intent" : {
                    "name" : "Tracking",
                    "state" : "Fulfilled"
                }
                },
                "messages": [{
                    "contentType": "PlainText",
                    "content": message 
                    
                }]
                
            }       
        return result
    else:
        message = "The order number you entered is incorrect, please recheck and enter again. Type "+'"'+ "try" +'"'+ " to re-enter the tracking details again"
        result = { "sessionState" : {
                "dialogAction": {
                    "type": "Close"
                },
                "intent" : {
                    "name" : "Tracking",
                    "state" : "Fulfilled"
                }
                },
                "messages": [{
                    "contentType": "PlainText",
                    "content": message 
                    
                }]
                
            }       
        return result
        
def takeRating(Order, Rate, Feedback):
    orderInTheTable = client.get_item(TableName='Rating',
    Key = { 'orderno':{
        'N' : Order,}
        }
        )
    key='Item'
    value = key in orderInTheTable.keys()
    if value:
        updation = client.update_item(TableName='Rating', 
            Key={'orderno': {'N': Order,}
            },
                        UpdateExpression="SET rating = :newRating, feedback = :newFeedback",
                        ExpressionAttributeValues={
                        ':newRating': {'N':Rate}, ':newFeedback': {'S':Feedback}
    }, 
    
    ReturnValues="UPDATED_NEW"

                )
        message = "Your rating has been successfully taken, type "+'"'+ "rating" +'"'+ " if you want to rate another order of yours"
        
        result = { "sessionState" : {
                "dialogAction": {
                    "type": "Close"
                },
                "intent" : {
                    "name" : "Rating",
                    "state" : "Fulfilled"
                }
                },
                "messages": [{
                    "contentType": "PlainText",
                    "content": message 
                    
                }]
                
            }       
        return result
    else:
        message = "The entered order number is not present, Please recheck and enter again. To try again press 1 and 0 to quit the conversation"
        result = { "sessionState" : {
                "dialogAction": {
                    "type": "Close"
                },
                "intent" : {
                    "name" : "Rating",
                    "state" : "Fulfilled"
                }
                },
                "messages": [{
                    "contentType": "PlainText",
                    "content": message 
                    
                }]
                
            }       
        return result
    
def validateUser(Mail, Password):
    response = client.get_item(TableName='HalifaxFoodie_CustomerDetails', 
        Key={'email':{
            'S' : Mail,
                }
            }
            )
    key='Item'
    value = key in response.keys()
    if value:
        #name=response['Item']['name']['S']
        email=response['Item']['email']['S']
        password = response['Item']['name']['S']
        #user = response['Item']['type']['S']
        if(email == Mail and password == Password):
            message = "Hello You have been verified and type "+'"'+ "rating" +'"'+ " if you want to rate any of your orders and type "+'"'+ "tracking" +'"'+ " if you want to track your order....If you want to register any "+'"'+ "complaints" +'"'+ " type complaints"

        else:
            message = "hello recheck your details, type "+'"'+ "check" +'"'+ " for entering your details again"
        result = { "sessionState" : {
            "dialogAction": {
                "type": "Close"
            },
            "intent" : {
                "name" : "Validation",
                "state" : "Fulfilled"
            }
            },
            "messages": [{
                "contentType": "PlainText",
                "content": message 
                
            }]
            
        }       
        return result 
    response = client.get_item(TableName='HalifaxFoodie_RestaurantDetails', 
        Key={'email':{
            'S' : Mail,
                }
            }
            )
    key='Item'
    value1 = key in response.keys()
    if value1:
        #name=response['Item']['name']['S']
        email=response['Item']['email']['S']
        password = response['Item']['name']['S']
        #user = response['Item']['type']['S']
        if(email == Mail and password == Password):
            message = "Hello you have been verified and type "+'"'+ "recipe" +'"'+ " if you want to add any recipe to your list"
        else:
            message = "hello recheck your details, type "+'"'+ "check" +'"'+ " for entering your details again"
        result = { "sessionState" : {
            "dialogAction": {
                "type": "Close"
            },
            "intent" : {
                "name" : "Validation",
                "state" : "Fulfilled"
            }
            },
            "messages": [{
                "contentType": "PlainText",
                "content": message 
                
            }]
            
        }       
        return result
    else:
        message="Sorry I can't find your details in our records, please enter "+'"'+ "navigate" +'"'+ " to know about the website. Thank you Have a nice day"
        result = { "sessionState" : {
            "dialogAction": {
                "type": "Close"
            },
            "intent" : {
                "name" : "Validation",
                "state" : "Fulfilled"
            }
            },
            "messages": [{
                "contentType": "PlainText",
                "content": message 
                
            }]
            
        }     
        return result
