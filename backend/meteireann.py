from bs4 import BeautifulSoup
import requests
import html5lib

url = "https://www.met.ie/latest-reports/observations"
live_obs = requests.get(url)

#print(live_obs.content)

soup = BeautifulSoup(live_obs.content, 'html5lib')
#print(soup.prettify())
phoenixWeather = []

# get table data
tables = soup.findChildren('table')
# get first/only table
liveTable = tables[0]
rows = liveTable.findChildren(['th', 'tr'])
for row in rows:
    location = {}
    print(row)
    print('Ending')
    #location['StationName'] = row.th.text
    #location['WindDir'] = row.td.text
    phoenixWeather.append(location)

print(phoenixWeather)