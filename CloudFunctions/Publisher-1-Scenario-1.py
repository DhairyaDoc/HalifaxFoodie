'''
    Title: Publishing message to Pub/Sub through Cloud Function
    Author: Dhairya Doctor
    Date: 2022/11/25
    Availability: https://cloud.google.com/pubsub/docs/publisher#python
'''

import base64
import json
import os
from google.cloud import pubsub_v1

publisher = pubsub_v1.PublisherClient()

def hello_world(request):
    request_json = request.get_json()

    if request_json is None:
        return 'EMPTY REQUEST FOUND'

    topic_path = 'projects/tough-hull-366114/topics/customer_complaints'

    json_message = json.dumps(request_json)
    bytes_message = json_message.encode('utf-8')

    try:
        publish_message = publisher.publish(topic_path, data=bytes_message)
        publish_message.result()                                        
    except Exception as exception:
        return exception

    return 'Message is published to PubSub 1'
