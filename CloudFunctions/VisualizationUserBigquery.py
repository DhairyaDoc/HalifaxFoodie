"""
        Title: Working with bigquery 
        Author: Shravya Reddy Gennepally
        Date: 2022/11/06
        Availability: https://cloud.google.com/bigquery/docs/
    """
from google.cloud import bigquery
def hello_world(request):
    
    request_json = request.get_json()
    client = bigquery.Client()
    
    table = 'serverless2-365815.visualization.user';
    queryStatement = ("Delete from "+table+ " where 1=1");
    
    execution = client.query(queryStatement);
    print(execution)
    
    insertion = client.insert_rows_json(table, request_json);
    print(insertion)
    return("DATA TRANSFERRED")
