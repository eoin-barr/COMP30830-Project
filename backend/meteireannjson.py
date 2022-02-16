import requests
import json 
import time
import os
# https://data.gov.ie/dataset/todays-weather-phoenix-park/resource/e9899d48-39ba-4227-b4e0-c0d01777dbe0

NAME="Phoenix"
URL="https://prodapi.metweb.ie/observations/phoenix-park/today"

def main():

    while True:
        # try:
        # Request data from API
        r = requests.get(URL)
        
        # Store the data
        print((r.text))

        # Wait for 5 mins
        time.sleep(5*60)

        # except:
        #     print(traceback.format_exc())
    return

if __name__ == "__main__":
    main()