from sqlalchemy import create_engine
import requests
import json 
import time
import os
from datetime import datetime
import csv

NAME="Dublin"
STATIONS="https://api.jcdecaux.com/vls/v1/stations"
JCDECAUX_API_KEY = os.environ['JCDECAUX_API_KEY']
print(JCDECAUX_API_KEY)

def main():

    # Password needs to be inserted
    engine = create_engine("mysql+mysqlconnector://softies:ZazaCoopers1@db-bikes.ck7tnbvjxsza.eu-west-1.rds.amazonaws.com:3306/db-bikes")
    connection = engine.connect()

    while True:
        today = datetime.today()
        current_date = today.strftime("%d/%m/%y")
        current_time = today.strftime("%H:%M:%S")
        data = ['JCDecaux(D)', current_date, current_time]

        # try:
        try:
            # Request data from API
            res = requests.get(STATIONS, params={"contract" : NAME, "apiKey" : JCDECAUX_API_KEY})
            
            # Access most recent JSON response
            parsed = json.loads(res.text)

            # For each station
            for station in parsed:

                # Assign the variables
                address = station["address"]
                available_bike_stands = station["available_bike_stands"]
                available_bikes = station["available_bikes"]
                banking = station["banking"]
                bike_stands = station["bike_stands"]
                bonus = station["bonus"]
                last_update = station["last_update"]
                name = station["name"]
                number = station["number"]
                lat = station["position"]["lat"]
                lng = station["position"]["lng"]
                status = station["status"]
                
                address = address.replace("'", "\\'")
                name = name.replace("'", "\\'")

                # Update last update to ymd format
                last_update = time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(last_update/1000))
                
                # Command statement for dynamic
                command_dynamic = f"INSERT INTO dynamic (address, available_bike_stands, available_bikes, bike_stands, last_update, status) VALUES ('{address}', '{available_bike_stands}', '{available_bikes}', '{bike_stands}', '{last_update}', '{status}')"
                
                # Execute the commands
                connection.execute(command_dynamic)            

            # Insert log into jcd-dynamic/complete.csv
            with open('api/logs/jcd-dynamic/complete.csv', 'a', newline='', encoding='UTF8') as f:
                writer = csv.writer(f)
                writer.writerow(data)
                f.close()

        except:
            print("Error")
            print(current_date)
            print(current_time)

            # Insert log into jcd-dynamic/error.csv
            with open('api/logs/jcd-dynamic/error.csv', 'a', newline='', encoding='UTF8') as f:
                writer = csv.writer(f)
                writer.writerow(data)
                f.close()
        
        # Wait for 5 mins
        time.sleep(5*60)

        # except:
        #     print(traceback.format_exc())
    return

if __name__ == "__main__":
    main()

