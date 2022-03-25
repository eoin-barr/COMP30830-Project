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
        station["title"], station["id"] = station["name"], station["name"]
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
    return render_template('index.html', static_data = stations)

@app.route('/maps')
def maps():
    stations = get_stations()
    return render_template('maps.html', static_data=stations)

@app.route("/occupancy/<station_name>")
def get_occupancy(station_name):
    engine = get_db()
    dfrecentbike = pd.read_sql_query(f"SELECT available_bike_stands, max(last_update) FROM dynamic WHERE address='{station_name}'", engine)

    #dfrecentbike['last_update_date'] = pd.to_datetime(dfrecentbike.last_update, unit='ms')
    dfrecentbike.set_index('max(last_update)', inplace=True)
    res = dfrecentbike['available_bike_stands']
    #res['dt'] = df.index
    print(res)
    print("jsonify", type(jsonify(data=json.dumps(list(zip(map(lambda x: x.isoformat(), res.index), res.values))))))
    dfrecentbike= dfrecentbike.to_json()
    print("bike", type(dfrecentbike))
    return dfrecentbike
    #return jsonify(data=json.dumps(list(zip(map(lambda x: x.isoformat(), res.index), res.values))))


    recent_bike = engine.execute(f"SELECT available_bike_stands, max(last_update) FROM dynamic WHERE address='{station_name}'")
    json_data = {}

    for result in recent_bike:
        json_data['data']= result

    json_data['data'][2] = json_data['data'][1].strftime("%H:%M:%S")
    json_data['data'][1] = json_data['data'][1].strftime("%d/%m/%y")
    print(json_data)
    return json.dumps(json_data)
    # for elem in recent_bike:
    #     print(elem[0])
    #     print(elem[1])
    # return jsonify(data=json.dumps(recent_bike))
    
if __name__ == "__main__":
    app.run(debug=True)
