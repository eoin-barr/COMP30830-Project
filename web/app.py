from flask import Flask, render_template, jsonify, g
import os
from sqlalchemy import create_engine
import pandas as pd
import json
import datetime
SQLPW = os.environ['SQLPW']
#GMAPSKEY = os.environ['GMAPSKEY']

app = Flask(__name__, static_url_path='')

def connect_to_database():
    engine=create_engine("mysql+mysqlconnector://softies:" + SQLPW + "@db-bikes.ck7tnbvjxsza.eu-west-1.rds.amazonaws.com:3306/db-bikes")
    return engine.connect()

def get_stations():
    engine = get_db()
    stations = []
    rows = engine.execute("SELECT * from static")

    for row in rows:
        stations.append(dict(row))

    for station in stations:
        station["title"], station["id"] = station["address"], station["address"]
        station['coords'] =  {'lat': station['lat'], 'lng': station['lng']}
        
    return stations

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
    stations = get_stations()
    return render_template('index.html', static_data=stations)


# @app.route('/maps')
# def maps():
#     stations = get_stations()
#     return render_template('maps.html', static_data=stations)

@app.route("/occupancy/<station_id>")
def get_occupancy(station_id):
    engine = get_db()
    dfrecentbike = pd.read_sql_query(f"SELECT dynamic.available_bike_stands, max(dynamic.last_update) as last_update FROM dynamic JOIN static ON static.address=dynamic.address WHERE static.number='{station_id}'", engine)
    # dfrecentbike = pd.read_sql_query(f"SELECT available_bike_stands, max(last_update) as last_update FROM dynamic WHERE address='{station_name}'", engine)
    dfrecentbike = dfrecentbike.iloc[0].to_json()
    return dfrecentbike

if __name__ == "__main__":
    app.run(debug=True)
