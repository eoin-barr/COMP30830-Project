from calendar import day_abbr
from sqlalchemy import create_engine
import requests
import json 
import time
import os
import csv
from datetime import datetime
# https://data.gov.ie/dataset/todays-weather-phoenix-park/resource/e9899d48-39ba-4227-b4e0-c0d01777dbe0
SQLPW = os.environ['SQLPW']

NAME="Phoenix"
URL="https://prodapi.metweb.ie/observations/phoenix-park/today"

def main():
    
    # Password needs to be inserted
    engine = create_engine("mysql+mysqlconnector://softies:" + SQLPW + "@db-bikes.ck7tnbvjxsza.eu-west-1.rds.amazonaws.com:3306/db-bikes")
    connection = engine.connect()
    
    while True:
        today = datetime.today()
        current_date = today.strftime("%d/%m/%y")
        current_time = today.strftime("%H:%M:%S")
        data = ['MetEireann', current_date, current_time]

        # try:
        try:
            # Request data from API
            res = requests.get(URL)

            # Access most recent JSON response
            parsed = json.loads(res.text)
            target = parsed[-1]

            # Assign variables from request
            name = target["name"]
            temperature = target["temperature"]

            # Convert date and time to datetime
            date = target["date"]
            ymd = datetime.strptime(date, "%d-%m-%Y").strftime("%Y-%m-%d")
            reportTime = target["reportTime"]
            reportTime += ":00"
            date = ymd + " " + reportTime

            symbol = target["symbol"]
            weatherDescription = target["weatherDescription"]
            text = target["text"]
            windSpeed = target["windSpeed"]
            windGust = target["windGust"]
            cardinalWindDirection = target["cardinalWindDirection"]
            windDirection = target["windDirection"]
            humidity = target["humidity"]
            rainfall = target["rainfall"]
            pressure = target["pressure"]
            dayName = target["dayName"]
            
            # Command statement
            command = f"INSERT IGNORE INTO weather (date, name, temperature, symbol, weatherDescription, text, windSpeed, windGust, cardinalWindDirection, windDirection, humidity, rainfall, pressure, dayName) VALUES ('{date}', '{name}', '{temperature}', '{symbol}', '{weatherDescription}', '{text}', '{windSpeed}', '{windGust}', '{cardinalWindDirection}', '{windDirection}', '{humidity}', '{rainfall}', '{pressure}', '{dayName}')"
            
            # Execute command
            connection.execute(command)

            # Insert log into meteireann/complete.csv
            with open('api/logs/meteireann/complete.csv', 'a', newline='', encoding='UTF8') as f:
                writer = csv.writer(f)
                writer.writerow(data)
                f.close()
                print("Success")
        except:
            print("Error")

            # Insert log into meteireann/complete.csv
            with open('api/logs/meteireann/error.csv', 'a', newline='', encoding='UTF8') as f:
                writer = csv.writer(f)
                writer.writerow(data)
                f.close()       

        # Wait for 55 mins
        time.sleep(60*55)

        # except:
        #     print(traceback.format_exc())
    return

if __name__ == "__main__":
    main()