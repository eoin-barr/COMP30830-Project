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

    while True:
        today = datetime.today()
        current_date = today.strftime("%d/%m/%y")
        current_time = today.strftime("%H:%M:%S")
        data = ['JCDecaux', current_date, current_time]

        # try:
        try:
            # Request data from API
            res = requests.get(STATIONS, params={"contract" : NAME, "apiKey" : JCDECAUX_API_KEY})
            
            # Print formatted json data response
            parsed = json.loads(res.text)
            print(json.dumps(parsed, indent=4, sort_keys=True))

            # Insert log into jcdecaux/complete.csv
            with open('backend/logs/jcdecaux/complete.csv', 'a', newline='', encoding='UTF8') as f:
                writer = csv.writer(f)
                writer.writerow(data)
                f.close()

        except:
            print("Error")
            print(current_date)
            print(current_time)

            # Insert log into jcdecaux/error.csv
            with open('backend/logs/jcdecaux/error.csv', 'a', newline='', encoding='UTF8') as f:
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

