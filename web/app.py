from flask import Flask, render_template, g
import os
from sqlalchemy import create_engine
import pandas as pd
import numpy as np
import json
SQLPW = os.environ['SQLPW']

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

def get_hour_means():
    # jsonfile = open('./../web/hour_means_json.json', "r")
    jsonfile = open('web/hour_means_json.json', "r")
    hour_data = json.load(jsonfile)
    res = hour_data
    jsonfile.close()
    return res

def get_day_means():
    # jsonfile = open('./../web/day_means_json.json', "r")
    jsonfile = open('web/day_means_json.json', "r")
    day_data = json.load(jsonfile)
    res = day_data
    jsonfile.close()
    return res

@app.teardown_appcontext                                                                                                                                                                                                                                             
def close_connection(exception):                                                                                                                                                                                                                                     
    db = getattr(g, '_database', None)                                                                                                                                                                                                                               
    if db is not None:                                                                                                                                                                                                                                               
        db.close()

@app.route('/')
def root():
    stations = get_stations()
    hour_means = get_hour_means()
    day_means = get_day_means()
    weather = get_weather()
    return render_template('index.html', static_data=stations, hour_means=hour_means, day_means=day_means, recentWeather = weather)

@app.route("/occupancy/<station_id>")
def get_occupancy(station_id):
    engine = get_db()
    dfrecentbike = pd.read_sql_query(f"SELECT dynamic.available_bike_stands, dynamic.available_bikes, max(dynamic.last_update) as last_update FROM dynamic JOIN static ON static.address=dynamic.address WHERE static.number='{station_id}'", engine)
    dfrecentbike = dfrecentbike.iloc[0].to_json()
    return dfrecentbike

def get_weather():
    engine = get_db()
    dfrecentweather = pd.read_sql_query(f"SELECT weather.temperature, weather.rainfall, weather.pressure, max(weather.date) as date FROM weather", engine)
    dfrecentweather = dfrecentweather.iloc[0].to_json()
    
    return dfrecentweather

if __name__ == "__main__":
    app.run(debug=True)
