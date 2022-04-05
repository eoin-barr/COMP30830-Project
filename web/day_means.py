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

    def get_daily_average():

        # Get all station numbers into list
        stations = pd.read_sql_query("SELECT static.number from static", engine)
        station_numbers = stations['number'].unique().tolist()

        # Empty Obj to be returned
        obj = {}

        # DoW (in same order as JS on index for chartjs)
        days_of_week = ["Sunday","Monday", "Tuesday","Wednesday", "Thursday", "Friday", "Saturday"]

        # Loop through stations
        for station in station_numbers:

            # Get the data for that station
            df_weekly_average = pd.read_sql_query(f"SELECT static.number, dynamic.available_bike_stands, dynamic.available_bikes, dynamic.last_update from `db-bikes`.dynamic JOIN `db-bikes`.static ON static.address=dynamic.address WHERE static.number={station}", engine)
            
            # Add station number to obj
            obj[str(station)] = []

            # Convert vals to int
            df_weekly_average['available_bikes'] = df_weekly_average['available_bikes'].astype(int)
            df_weekly_average['available_bike_stands'] = df_weekly_average['available_bike_stands'].astype(int)

            # Get value of day from last update
            df_weekly_average['days'] = list(map(lambda x: x.strftime('%A'), list(df_weekly_average['last_update'])))

            # Loop through each day
            for day in days_of_week:

                # Create df to get daily data for specific day
                df_day = df_weekly_average.loc[df_weekly_average["days"] == day]                    
                df_day.reset_index(drop=True)

                # Append the mean of each day to obj for that day
                obj[station].append(round(df_day['available_bikes'].mean())) 
            
        data = json.dumps(obj)
        #print(data)
        
        # Using a JSON string
        with open('web/day_means_json.json', 'w') as outfile:
            outfile.write(data)

        return

    get_daily_average()

    #time.sleep(60*60*24*7)

if __name__ == "__main__":
    main()