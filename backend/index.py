import requests
import json 
import time

NAME="Dublin"
STATIONS="https://api.jcdecaux.com/vls/v1/stations"
KEY=""

def main():

    while True:
        try:
            # Request data from API
            r = requests.get(STATIONS, params={"contract" : NAME, "apiKey" : KEY})
            
            # Store the data
            store(json.loads(r.text))

            # Wait for 5 mins
            time.sleep(5*60)

        except:
            print(traceback.format_exc())
    return

if __name__ == "__main__":
    main()

