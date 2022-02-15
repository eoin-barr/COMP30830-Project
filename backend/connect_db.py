from sqlalchemy import create_engine

engine = create_engine("mysql+mysqlconnector://softies:Zaza1234@db-bikes.ck7tnbvjxsza.eu-west-1.rds.amazonaws.com:3306/db-bikes")

connection = engine.connect()

result = connection.execute("select idstatic from static")

for row in result:
    print("Id:", row['idstatic'])

connection.close()
