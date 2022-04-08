from sqlalchemy import create_engine
import json 
import os
import pandas as pd
import numpy as np
SQLPW = os.environ['SQLPW']
def main():

    # Password needs to be inserted
    engine = create_engine("mysql+mysqlconnector://softies:" + SQLPW + "@db-bikes.ck7tnbvjxsza.eu-west-1.rds.amazonaws.com:3306/db-bikes")
    connection = engine.connect()

    def get_hourly_average():
        print("running hourly")
        # Get all station numbers into list
        stations = pd.read_sql_query("SELECT static.number from static", engine)
        station_numbers = stations['number'].unique().tolist()

        #print(station_numbers)

        # Empty Obj to be returned
        obj = {}

        # DoW
        days_of_week = ["Monday", "Tuesday","Wednesday", "Thursday", "Friday", "Saturday","Sunday"]

        # Loop through stations
        for station in station_numbers:

            # Get the data for that station
            df_hourly_average = pd.read_sql_query(f"SELECT static.number, dynamic.available_bike_stands, dynamic.available_bikes, dynamic.last_update from `db-bikes`.dynamic JOIN `db-bikes`.static ON static.address=dynamic.address WHERE static.number={station}", engine)
            
            #print(station)

            # Add station number to obj
            obj[str(station)] = {}

            # Convert vals to int
            df_hourly_average['available_bikes'] = df_hourly_average['available_bikes'].astype(int)
            df_hourly_average['available_bike_stands'] = df_hourly_average['available_bike_stands'].astype(int)

            # Get values of day, hour from last update
            df_hourly_average['real_times'] = list(map(lambda x: x.strftime('%H'), list(df_hourly_average['last_update'])))
            df_hourly_average['days'] = list(map(lambda x: x.strftime('%A'), list(df_hourly_average['last_update'])))

            # Loop through each day
            for day in days_of_week:

                # Add day value to obj for each station
                obj[station][day] = []

                # Loop through the hours
                for i in range(6,24):

                    if i < 10:
                        string_counter = "0"
                        string_counter += str(i)
                    else:
                        string_counter = str(i)
                    
                    # Create df to get hourly data for specific day
                    df_day = df_hourly_average.loc[df_hourly_average["days"] == day]
                    df_day_hour = df_day.loc[df_day['real_times'] == string_counter]
                    df_day_hour.reset_index(drop=True)
                    # print(df_day_hour[string_counter])
                    if df_day_hour.empty:
                        obj[station][day].append(0)
                    else:
                        # Append the mean of each hour to obj for each day
                        obj[station][day].append(round(df_day_hour['available_bikes'].mean()))

        data = json.dumps(obj)
        #print(data)
        
        # Using a JSON string
        with open('hour_means_json.json', 'w') as outfile:
            outfile.write(data)

        return

    get_hourly_average()
    print("done hourly")
    #time.sleep(60*60*24*7)

if __name__ == "__main__":
    main()