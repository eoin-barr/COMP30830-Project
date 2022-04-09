# from turtle import ycor
import pandas as pd
import numpy as np
from sqlalchemy import create_engine
from sklearn.linear_model import LinearRegression, LogisticRegression
import pickle
from sklearn.model_selection import train_test_split
import os

SQLPW = os.environ['SQLPW']

def main():
    # Connect and query
    engine = create_engine("mysql+mysqlconnector://softies:" + SQLPW + "@db-bikes.ck7tnbvjxsza.eu-west-1.rds.amazonaws.com:3306/db-bikes")
    station_numbers = pd.read_sql_query("SELECT static.number from static", engine)
    numbers = station_numbers['number'].tolist()

    features = ['time', 'day', 'number']
    days_of_week = ["Sunday","Monday", "Tuesday","Wednesday", "Thursday", "Friday", "Saturday"]

    for station in numbers:
        stations = pd.read_sql_query(f"SELECT dynamic.available_bikes, dynamic.last_update, static.number from dynamic JOIN static ON static.address=dynamic.address WHERE static.number={station}", engine)
    # weather = pd.read_sql_query("SELECT weather.date, weather.temperature, weather.rainfall from weather LIMIT 25", engine)

    # # rename so both dfs have same name on time column
    # # weather.rename(columns={'date':'last_update'},inplace=True)

    # # merge both dfs on closest times
    # # stations = pd.merge_asof(stations, weather, on="last_update", direction='nearest')

        
    # # Split last update to day and time
        stations['day'] = list(map(lambda x: x.strftime('%A'), list(stations['last_update'])))
        stations['time'] = list(map(lambda x: x.strftime('%H'), list(stations['last_update'])))

        # Another sexual lambda function to convert day of week to number
        stations['day'] = list(map(lambda x: days_of_week.index(x), list(stations['day'])))

        df_x=pd.DataFrame(stations[features])
        df_y=pd.DataFrame(stations.available_bikes)

        # Create training and testing dataframes
        x_train, x_test, y_train, y_test = train_test_split(df_x, df_y)

        # Could also try use logistic regression
        model = LinearRegression()
        #model = LogisticRegression()

        # Fit the model with training data
        predictor = model.fit(x_train, y_train) 

    # # We need to make a pickle file for the model
    # # Or else use joblibs dump and load which is apparently better for big arrays
    # # One of the below
    
    # # from joblib import dump, load
    # #     dump(clf, 'filename.joblib')

        with open(f'web/models/model_{station}.pkl', 'wb') as handle:
            pickle.dump(predictor, handle, pickle.HIGHEST_PROTOCOL)
        
        print("model done")
        
if __name__ == "__main__":
    main()