from flask import Flask, render_template, jsonify, g
import os
from sqlalchemy import create_engine
SQLPW = os.environ['SQLPW']
#GMAPSKEY = os.environ['GMAPSKEY']

app = Flask(__name__, static_url_path='')

def connect_to_database():
    engine=create_engine("mysql+mysqlconnector://softies:" + SQLPW + "@db-bikes.ck7tnbvjxsza.eu-west-1.rds.amazonaws.com:3306/db-bikes")
    return engine.connect()

def get_db():
    db = getattr(g, '_database', None)                                                                                                                                                                                                                               
    if db is None:                                                                                                                                                                                                                                                   
        db = g._database = connect_to_database()                                                                                                                                                                                                                     
    return db

@app.teardown_appcontext                                                                                                                                                                                                                                             
def close_connection(exception):                                                                                                                                                                                                                                     
    db = getattr(g, '_database', None)                                                                                                                                                                                                                               
    if db is not None:                                                                                                                                                                                                                                               
        db.close()

@app.route('/')
def root():
    return render_template('index.html')

# @app.route("/") 
# def get_stations(): 
#     stations = [] 
#     rows = engine.execute("SELECT * from stations;") 
#     for row in rows: 
#         stations.append(dict(row)) 
     
#     return jsonify(stations=stations)

if __name__ == "__main__":
    app.run(debug=True)
