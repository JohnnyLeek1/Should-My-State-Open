"""
Guidelines from whitehouse.gov/openingamerica/


SYMPTOMS:
    - Downward Trajectory of Flu-like illnesses
    AND
    - Downward Trajectory of Covid symptoms 14 day period

CASES:
    - Downward Trajectory of documented cases within 14 day period
    OR
    - Downward Trajectory of positive tests within 14 days
      (flat or increasing volume of tests)

HOSPITALS:
    - Treat all patients WITHOUT crisis care
    - Robust testing program in place including antibody testing

Data is collected daily at 9PM from John Hopkins University
    - https://github.com/CSSEGISandData/COVID-19
    - Data is assumed to be accurate. Confirmed cases include presumptive
      positive cases

"""

import requests, time, io, pandas
from datetime import date, timedelta

class DataCollect():
    """
    Main data collection class.
    Contains methods used to collect and aggregate data.

    """
    def __init__(self):
        self.data_url = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/{}.csv"
        self.data = []
        self.get_data()

    def get_data(self):
        """
        Requests data from John Hopkins University database from the most
        recent day it can find, and then also from 14 days prior and every day
        inbetween (in order to calculate general trajectory)
        """
        today_date = date.today()
        while True:
            str__today_date = today_date.strftime("%m-%d-%Y")
            print("Attempting to download data from %s..." % str__today_date)
            request = requests.get(self.data_url.format(str__today_date))

            #If we have data for today, use that
            if request != None and request.status_code == 200:
                self.data.append(pandas.read_csv(io.StringIO(request.content.decode('utf-8'))))
                prior_date = today_date - timedelta(days=1)
                #Get data from every day between 14 days ago and today
                while prior_date != today_date - timedelta(days=14):
                    str__prior_date = prior_date.strftime("%m-%d-%Y")
                    prior_request = requests.get(self.data_url.format(str__prior_date))
                    print("Attempting to download data from %s..." % str__prior_date)
                    if prior_request != None and request.status_code == 200:
                        self.data.append(pandas.read_csv(io.StringIO(request.content.decode('utf-8'))))
                    else:
                        print("Couldn't find data for %s, skipping..." % str__prior_date)
                    prior_date = prior_date - timedelta(days=1)
                break
            else:
                print("Couldn't find data for %s, attempting previous day..." % str__today_date)
                today_date = today_date - timedelta(days=1)


collect = DataCollect()
