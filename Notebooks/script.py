# https://github.com/alexnguyen9/recipe-matcher
import pandas as pd
import pickle
import numpy as np
from scipy.spatial.distance import cdist
# sklearn = 1.0.1
import sklearn
import boto3
import json

food_matrix = pickle.load(open('pkl/food_matrix.pkl','rb'))
transformer = pickle.load(open('pkl/transformer.pkl','rb'))
food_data = pickle.load(open('pkl/main_data.pkl','rb'))




def lambda_handler(event, context):
    print ("event ", event)
    headers = {
        'Access-Control-Allow-Methods': 'POST, GET',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*'
    }

    if 'body' in event:
        body = event['body']
        if 'ingredients' in body:
            ingredients = body['ingredients']
            titles = predict(ingredients)
            titles = str(titles)
            print ("titles ",titles)

    return {
        'statusCode': 200,
        'body': json.dumps(titles),
        'headers': headers
    }



def predict(ingredients):

    
    
    output = str(ingredients)
    
    y = transformer.transform([output])

    m = cdist(y.toarray()[0].reshape(1,-1), food_matrix, metric='cosine')
    global index 
    index = np.argsort(m[0]).tolist()
    counter = 0
    
    topNReciepes = 3
    for i in range(3):
        instructions = food_data.instructions[index[i]]
        title = food_data.title[index[i]]
        ingredients = food_data.ingredients[index[i]]
        source = food_data.url[index[i]]
    
        print ("title: ", title)
        print ("ingredients: ", ingredients)
        print ("--------------------")
