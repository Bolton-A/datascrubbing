'''
Last updated: 10/10/2022
Description: Allows Python calculations to be performed and made available to website.
TODO:
'''

# Import necessary libraries.
from flask import Flask
import psycopg2

# Creates an instance of the web application under the name 'api'.
api = Flask(__name__)

#establishing the connection
conn = psycopg2.connect(
   database="postgres", user='postgres', password='postgrespw', host='host.docker.internal', port= '49153'
)
#Setting auto commit false
conn.autocommit = True

#Creating a cursor object using the cursor() method
cursor = conn.cursor()

sql = '''SELECT concat(FirstName, ' ', LastName) FROM Logins WHERE UserID = 'ls123';'''

#Retrieving data
cursor.execute(sql)

#Fetching all from the table
name = cursor.fetchall();

# Sets a dictionary of items that will appear within the /profile link. Returns dictionary to site.
##### To add more items, add below and modify ./App.js to include items.
@api.route('/profile')
def my_profile():
    response_body = {
        "name" : name,
        "about" : "Hello! This is sample text!"
    }

    return response_body

#Commit your changes in the database
conn.commit()

#Closing the connection
conn.close()

'''
# Import necessary libraries.
from flask import Flask
import psycopg2

# Creates an instance of the web application under the name 'api'.
api = Flask(__name__)

#establishing the connection
conn = psycopg2.connect(
   database="postgres", user='postgres', password='postgrespw', host='host.docker.internal', port= '49153'
)
#Setting auto commit false
conn.autocommit = True

#Creating a cursor object using the cursor() method
cursor = conn.cursor()

#Retrieving data
cursor.execute(''SELECT * FROM Logins'') # Add '  ' around SELECT * FROM Logins

#Fetching all from the table
result = cursor.fetchall();

# Sets a dictionary of items that will appear within the /profile link. Returns dictionary to site.
##### To add more items, add below and modify ./App.js to include items.
@api.route('/profile')
def my_profile():
    response_body = {
        "name" : "Laura Smith",
        "about" : "Hello! This is sample text!",
        "login" : result
    }

    return response_body

#Commit your changes in the database
conn.commit()

#Closing the connection
conn.close()
'''