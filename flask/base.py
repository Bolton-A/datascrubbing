'''
Last updated: 10/29/2022
Description: Code connects to PostgreSQL through psycopg2, uses 'myVar' variable sent by App.js to execute a query to the database.
Once query has been executed, returns the results to 'results.csv' and closes the database.
'''

# Import necessary libraries.
from flask import Flask, jsonify, request, render_template
import psycopg2
import csv

# Creates an instance of the web application under the name 'api'.
api = Flask(__name__)

'''
Section: Query Database
Description: Creates query and sends results to 'results.csv'.
'''
@api.route('/profile', methods=['POST', 'GET'])
def myFunction():

    # Creates a connection to the database, establishes a cursor, takes 'myVar' variable from JavaScript and executes query in PostgreSQL.
    conn = psycopg2.connect(database="postgres", user='postgres', password='postgres', host='localhost', port= '5432')
    conn.autocommit = True
    cursor = conn.cursor()
    query = request.form['myVar']
    cursor.execute(query)
    rows = cursor.fetchall()

    # If query returns anything, create list of result and column_names. Append each to two seperate lists.
    if rows:
        result = list()
        column_names = list()
        for i in cursor.description:
            column_names.append(i[0])
        result.append(column_names)
        for row in rows:
            result.append(row)

    # Ensuring that results.csv is own, write the rows recorded in the lists in the section above.
    with open('results.csv', 'w', encoding='UTF8', newline='') as f:
        writer = csv.writer(f)
        for row in result:
            writer.writerow(row)

    # Commit changes and close database.
    conn.commit()
    conn.close()
    return result

# Ensure that app is running.
if __name__ == '__main__':
    api.run(host="localhost", port=3000, debug=True)
