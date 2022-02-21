from sqlalchemy import create_engine

# Password needs to be inserted
engine = create_engine("mysql+mysqlconnector://softies:PASSWORD@db-bikes.ck7tnbvjxsza.eu-west-1.rds.amazonaws.com:3306/db-bikes")

connection = engine.connect()

result = connection.execute("INSERT INTO weather (date, name, temperature, symbol, weatherDescription, text, windSpeed, windGust, cardinalWindDirection, windDirection, humidity, rainfall, pressure, dayName) VALUES ('2020-01-01 17:00:00', 'Phoenix Park', 7, 'test', 'NA', 'test', 'NA', '-', -99, 0, 79, 0.0, 999, 'Thursday')")

# for row in result:
#     print("Id:", row['idstatic'])

connection.close()
