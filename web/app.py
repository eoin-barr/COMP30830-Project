from flask import Flask, render_template, jsonify, g
import os
from sqlalchemy import create_engine
import pandas as pd
import numpy as np
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
    dfrecentbike = dfrecentbike.iloc[0].to_json()
    return dfrecentbike

@app.route("/hourlyaverage/<station_id>")
def get_hourly_average(station_id):
    engine = get_db()
    df_hourly_average = pd.read_sql_query(f"SELECT dynamic.available_bike_stands, dynamic.available_bikes, dynamic.last_update from dynamic JOIN static ON static.address=dynamic.address WHERE static.number='{station_id}'", engine)

    df_hourly_average['real_times'] = list(map(lambda x: x.strftime('%H'), list(df_hourly_average['last_update'])))

    counter = 6
    for i in range(18):
        df_hourly_average[counter] = np.nan

        # Check for single digits
        if counter < 10:
            string_counter = "0"
            string_counter += str(counter)
        else:
            string_counter = str(counter)

        for index, row in df_hourly_average.iterrows():
            if string_counter == str(df_hourly_average['real_times'].iloc[index]):
                df_hourly_average.loc[index,counter] = df_hourly_average['available_bikes'].iloc[index]

        counter += 1


    df_hourly_average = df_hourly_average.to_json()
    print(df_hourly_average)
    return df_hourly_average

if __name__ == "__main__":
    app.run(debug=True)
