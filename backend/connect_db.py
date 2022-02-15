from sqlalchemy import create_engine

# Password needs to be inserted
engine = create_engine("mysql+mysqlconnector://softies:PASSWORD@db-bikes.ck7tnbvjxsza.eu-west-1.rds.amazonaws.com:3306/db-bikes")

connection = engine.connect()

result = connection.execute("select idstatic from static")

for row in result:
    print("Id:", row['idstatic'])

connection.close()
