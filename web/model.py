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

    features = ['time', 'day']
    days_of_week = ["Sunday","Monday", "Tuesday","Wednesday", "Thursday", "Friday", "Saturday"]

    for station in numbers:
        stations = pd.read_sql_query(f"SELECT dynamic.available_bikes, dynamic.last_update from dynamic JOIN static ON static.address=dynamic.address WHERE static.number={station}", engine)
        # weather = pd.read_sql_query("SELECT weather.date, weather.temperature, weather.rainfall from weather LIMIT 25", engine)

        # rename so both dfs have same name on time column
        # weather.rename(columns={'date':'last_update'},inplace=True)

        # merge both dfs on closest times
        # stations = pd.merge_asof(stations, weather, on="last_update", direction='nearest')

        
        # Split last update to day and time
        stations['day'] = list(map(lambda x: x.strftime('%A'), list(stations['last_update'])))
        stations['time'] = list(map(lambda x: x.strftime('%H'), list(stations['last_update'])))

        # Another sexual lambda function to convert day of week to number
        # stations['day'] = list(map(lambda x: days_of_week.index(x), list(stations['day'])))

        # X and Y data
        X = stations[features]
        Y = stations['available_bikes']
        # print(X.dtypes)

        # Convert categorical variables into dummy variables
        X = pd.get_dummies(data=X, drop_first=True)
        
        # Create training and testing dataframes
        # X_train, X_test, Y_train, Y_test = train_test_split(X, Y)

        # Create model
        model = LinearRegression()
        #model = LogisticRegression()

        # Fit the model with all data, training was checked in the models folder
        predictor = model.fit(X, Y) 

        # Make file for each model
        # with open(f'models/model_{station_number}.pkl', 'rb') as handle:
        with open(f'web/models/model_{station}.pkl', 'wb') as handle:
            pickle.dump(predictor, handle, pickle.HIGHEST_PROTOCOL)
        
        # print("model done")
        
if __name__ == "__main__":
    main()