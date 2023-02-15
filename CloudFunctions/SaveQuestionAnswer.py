# https://towardsdatascience.com/nosql-on-the-cloud-with-python-55a1383752fc
from google.cloud import firestore

def hello_world(request):

    request_json = request.get_json()
    headers = {
        'Access-Control-Allow-Methods': 'POST, GET',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*'
    }

    if (request_json):
        print ("adding to the database")
        
        projectId = "serverless-project-369304"
        googleClient = firestore.Client(projectId)

        if ('userType' in request_json):
            if request_json['userType'].lower() == 'restaurant':
                collectionName = "restaurantQuestions"
            else:
                collectionName = "customerQuestions"
            
            addToDatabase = (
            googleClient.collection(collectionName)
            .document(request_json['email'])
            )

            addToDatabase.set({
            "questionOne": request_json['questionOne'],
            "answerOne": request_json['answerOne'],
            "questionTwo": request_json['questionTwo'],
            "answerTwo": request_json['answerTwo']
            })
    else:
        print ("json was empty or None")


    return ('it ran', 200, headers)