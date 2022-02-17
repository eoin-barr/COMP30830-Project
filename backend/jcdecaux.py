import requests
import json 
import time
import os
from datetime import datetime


NAME="Dublin"
STATIONS="https://api.jcdecaux.com/vls/v1/stations"
JCDECAUX_API_KEY = os.environ['JCDECAUX_API_KEY']
print(JCDECAUX_API_KEY)


def main():

    today = datetime.today()

    while True:
        # try:
        try:
            # Request data from API
            res = requests.get(STATIONS, params={"contract" : NAME, "apiKey" : JCDECAUX_API_KEY})
            
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
        
        # Wait for 5 mins
        time.sleep(5*60)

        # except:
        #     print(traceback.format_exc())
    return

if __name__ == "__main__":
    main()

