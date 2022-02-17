import requests
import json 
import time
import os
from datetime import datetime
# https://data.gov.ie/dataset/todays-weather-phoenix-park/resource/e9899d48-39ba-4227-b4e0-c0d01777dbe0

NAME="Phoenix"
URL="https://prodapi.metweb.ie/observations/phoenix-park/today"

def main():

    while True:
        today = datetime.today()

        # try:
        try:
            # Request data from API
            res = requests.get(URL)

            # Print formatted json data response
            parsed = json.loads(res.text)
            print(json.dumps(parsed, indent=4, sort_keys=True))

            # Print current date and time
            print(today.strftime("%d/%m/%y"))
            print(today.strftime("%H:%M:%S"))
        except:
            print("Error")
            print(today.strftime("%d/%m/%y"))
            print(today.strftime("%H:%M:%S"))        

        # Wait for 1 hour mins
        time.sleep(60*60)

        # except:
        #     print(traceback.format_exc())
    return

if __name__ == "__main__":
    main()