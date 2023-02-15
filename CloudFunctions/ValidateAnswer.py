from google.cloud import firestore

def hello_world(request):
    request_json = request.get_json()
    headers = {
        'Access-Control-Allow-Methods': 'POST, GET',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*'
    }
    answersMatch = 'False'

    if (request_json):
      projectId = "serverless-project-369304"
      googleClient = firestore.Client(projectId)
      if (request_json['userType'].lower() == 'restaurant'):
        collectionName = "restaurantQuestions"
      else:
        collectionName = "customerQuestions"
      
      docRef = googleClient.collection(collectionName).document(request_json['email'])
      documentFromFirestore = docRef.get()
      print (documentFromFirestore)
      answerOneUser = request_json['answerOne']
      answerTwoUser = request_json['answerTwo']
      if (documentFromFirestore.exists):
        originalAnswers = documentFromFirestore.to_dict()
        if (answerOneUser.lower() == originalAnswers['answerOne'].lower()):
          if (answerTwoUser.lower() == originalAnswers['answerTwo'].lower()):
            answersMatch = 'True'

      else:
        print ("No such document")




    return (answersMatch, 200, headers)
