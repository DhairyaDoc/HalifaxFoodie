import pandas as pd
from google.cloud import storage
from google.cloud import firestore


# https://stackoverflow.com/questions/68854387/cloud-function-sending-csv-to-cloud-storage
def hello_world(request):
    request_json = request.get_json()
    print (request_json)
    if (request_json):
        print ("request_json",request_json)
        feedbackList = request_json

        bucketName = 'halifaxfoodie-feedback-bucket'
        bucketExport = storage.Client().get_bucket(bucketName)

        csvName = 'feedbackpolarity.csv'
        bucketExport.blob(csvName).upload_from_string(pd.DataFrame(feedbackList).to_csv(), "text/csv")
    
    if request.args and 'message' in request.args:
        return request.args.get('message')
    elif request_json and 'message' in request_json:
        return request_json['message']
    else:
        return f'Hello World!'




