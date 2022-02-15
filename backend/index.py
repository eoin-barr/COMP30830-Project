import requests
import json 
import time
import os


NAME="Dublin"
STATIONS="https://api.jcdecaux.com/vls/v1/stations"
JCDECAUX_API_KEY = os.environ['JCDECAUX_API_KEY']
print(JCDECAUX_API_KEY)


def main():

    while True:
        # try:
        # Request data from API
        r = requests.get(STATIONS, params={"contract" : NAME, "apiKey" : JCDECAUX_API_KEY})
        
        # Store the data
        print((r.text))

        # Wait for 5 mins
        time.sleep(5*60)

        # except:
        #     print(traceback.format_exc())
    return

if __name__ == "__main__":
    main()

