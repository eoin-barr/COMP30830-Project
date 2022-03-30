from sqlalchemy import create_engine
import requests
import json 
import time
import os
from datetime import datetime
import csv
import pandas as pd
import numpy as np
SQLPW = os.environ['SQLPW']
def main():
    pd.options.mode.chained_assignment = None
    # Password needs to be inserted
    engine = create_engine("mysql+mysqlconnector://softies:" + SQLPW + "@db-bikes.ck7tnbvjxsza.eu-west-1.rds.amazonaws.com:3306/db-bikes")
    connection = engine.connect()

    def get_hourly_average():
        stations = pd.read_sql_query("SELECT static.number from static", engine)
        station_numbers = stations['number'].unique().tolist()
        print(station_numbers)
        obj = {}
        days_of_week = ["Monday", "Tuesday","Wednesday", "Thursday", "Friday", "Saturday","Sunday"]
        for station in station_numbers:
            df_hourly_average = pd.read_sql_query(f"SELECT static.number, dynamic.available_bike_stands, dynamic.available_bikes, dynamic.last_update from `db-bikes`.dynamic JOIN `db-bikes`.static ON static.address=dynamic.address WHERE static.number={station}", engine)
            
            print(station)
            obj[str(station)] = {}
            df_hourly_average['available_bikes'] = df_hourly_average['available_bikes'].astype(int)
            df_hourly_average['real_times'] = list(map(lambda x: x.strftime('%H'), list(df_hourly_average['last_update'])))
            df_hourly_average['days'] = list(map(lambda x: x.strftime('%A'), list(df_hourly_average['last_update'])))
            
            for i in range(6, 24):
                # Check for single digits
                if i < 10:
                    string_counter = "0"
                    string_counter += str(i)
                else:
                    string_counter = str(i)
                
                df_hourly_average[string_counter] = np.nan

                for index, row in df_hourly_average.iterrows():
                
                    if string_counter == str(df_hourly_average['real_times'].iloc[index]):
                  
                        df_hourly_average.loc[index,string_counter] = df_hourly_average['available_bikes'].iloc[index]
        
            for day in days_of_week:
                obj[station][day] = []
                for i in range(6,24):

                    if i < 10:
                        string_counter = "0"
                        string_counter += str(i)
                    else:
                        string_counter = str(i)
                    
                    df_day = df_hourly_average.loc[df_hourly_average["days"] == day]
                    df_day_hour = df_day.loc[df_day['real_times'] == string_counter]
                    
                    df_day_hour.reset_index(drop=True)
                    print(df_day_hour[string_counter])
                    obj[station][day].append(round(df_day_hour[string_counter].mean())) 
            
            print(station)

      

        data = json.dumps(obj)
        print(data)
        
        # Using a JSON string
        with open('web/means_json.json', 'w') as outfile:
            outfile.write(data)

        # with open('logs/jcd_dynamic/complete.csv', 'a', newline='', encoding='UTF8') as f:
        #     writer = json.writer(f)
        #     writer.writerow(data)
        #     f.close()
        #     print("Success")
        return

    get_hourly_average()




    #time.sleep(60*60*24*7)

if __name__ == "__main__":
    main()