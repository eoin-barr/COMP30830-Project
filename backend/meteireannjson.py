import requests
import json 
import time
import os
import csv
from datetime import datetime
# https://data.gov.ie/dataset/todays-weather-phoenix-park/resource/e9899d48-39ba-4227-b4e0-c0d01777dbe0

NAME="Phoenix"
URL="https://prodapi.metweb.ie/observations/phoenix-park/today"

def main():

    while True:
        today = datetime.today()
        current_date = today.strftime("%d/%m/%y")
        current_time = today.strftime("%H:%M:%S")
        data = ['MetEireann', current_date, current_time]

        # try:
        try:
            # Request data from API
            res = requests.get(URL)

            # Print formatted json data response
            parsed = json.loads(res.text)
            print(json.dumps(parsed, indent=4, sort_keys=True))

            # Insert log into meteireann/complete.csv
            with open('backend/logs/meteireann/complete.csv', 'a', newline='', encoding='UTF8') as f:
                writer = csv.writer(f)
                writer.writerow(data)
                f.close()
        except:
            print("Error")

            # Insert log into meteireann/complete.csv
            with open('backend/logs/meteireann/error.csv', 'a', newline='', encoding='UTF8') as f:
                writer = csv.writer(f)
                writer.writerow(data)
                f.close()       

        # Wait for 1 hour
        time.sleep(60*60)

        # except:
        #     print(traceback.format_exc())
    return

if __name__ == "__main__":
    main()