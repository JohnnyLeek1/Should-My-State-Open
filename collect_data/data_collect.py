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
    - A positive test counts as an active case
    - Only data from the mainland 48 states, Alaska, Hawaii, and D.C is parsed and
      calculated. Territories are not included in this calculation.
"""

import requests, time, io, pandas, numpy, json, smtplib, ssl, csv, schedule
from datetime import datetime, date, timedelta
from ftplib import FTP

from state_code import state_codes
from hospital_capacity import hospital_capacity

class DataCollect():
    """
    Main data collection class.
    Contains methods used to collect and aggregate data.

    """
    def __init__(self):
        self.data_url = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports_us/{}.csv"
        self.set_data()

        print("Script is now running. Waiting to collect and upload data...")

        schedule.every().day.at("00:01").do(self.set_data)
        schedule.every().day.at("00:02").do(self.upload_data_or_email)
        self.run_automated_tasks()

    def set_data(self):
        """
        Sets variables (to be run every night at midnight)
        """
        self.data = self.get_data()
        self.state_cases = self.get_cases_trend()
        self.state_hospitals = self.get_hospital_capacity()
        self.state_tests = self.get_test_trend()

    def get_data(self):
        """
        Requests data from John Hopkins University database from the most
        recent day it can find, and then also from 14 days prior and every day
        inbetween (in order to calculate general trajectory)
        """
        today_date = date.today()
        data = None
        while True:
            str__today_date = today_date.strftime("%m-%d-%Y")
            print("Attempting to download data from %s..." % str__today_date)
            request = requests.get(self.data_url.format(str__today_date))

            #If we have data for today, use that
            if request != None and request.status_code == 200:
                data = pandas.read_csv(io.StringIO(request.content.decode('utf-8')))
                data['date'] = str__today_date
                self.most_recent_date = str__today_date
                prior_date = today_date - timedelta(days=1)
                #Get data from every day between 14 days ago and today
                while prior_date != today_date - timedelta(days=15):
                    str__prior_date = prior_date.strftime("%m-%d-%Y")
                    prior_request = requests.get(self.data_url.format(str__prior_date))
                    print("Attempting to download data from %s..." % str__prior_date)
                    if prior_request != None and request.status_code == 200:
                        prior_data = pandas.read_csv(io.StringIO(prior_request.content.decode('utf-8')))
                        prior_data['date'] = str__prior_date
                        data = pandas.concat([data, prior_data], ignore_index=True)
                    else:
                        print("Couldn't find data for %s, skipping..." % str__prior_date)
                    prior_date = prior_date - timedelta(days=1)
                break
            else:
                print("Couldn't find data for %s, attempting previous day..." % str__today_date)
                today_date = today_date - timedelta(days=1)

        #Convert all dates to datetime
        data['date'] = pandas.to_datetime(data['date'])

        #Convert dataframe to all lowercase
        data.columns = data.columns.str.lower()
        data = data.applymap(lambda s:s.lower() if type(s) == str else s)

        #Reverse dataframe (so the latest day is at the top)
        data = data.iloc[::-1]

        print("Data retrieved!")

        return data

    def get_cases_trend(self):
        """
        Calculates which states meet the guideline:
        "Downward Trajectory of documented cases within 14 day period"

        Grabs active cases for each state over the 14 day period and calculates
        slope of those points.

        If slope is negative, then it meets guideline.
        If the slope if positive, then it does not meet guideline.
        """
        state_cases = {}
        for state in state_codes.keys():
            state_data = self.data.loc[self.data['province_state'] == state]
            df = pandas.DataFrame(state_data, columns=['active'])
            df = df.reset_index(drop=True)
            state_cases[state] = self.is_downward_trend(df, 'active')
        print("States that meet active case guidelines: \n{}".format(json.dumps(state_cases, indent=2)))
        return state_cases

    def get_hospital_capacity(self):
        """
        Calculates which states meet the guideline:
        "Treat all patients WITHOUT crisis care"

        Grabs the active cases for each state and calculates
        if that number is <= the total hospital capacity of the state.

        If the number is <= the capacity, then it meets the guideline.
        If the number is > the capacity, then it does not meet the guideline.
        """
        state_hospitals = {}
        for state in state_codes.keys():
            state_data = self.data.loc[self.data['province_state'] == state]
            current_active = state_data.iloc[-1]
            state_code = state_codes[state]
            state_hospitals[state] = bool(current_active['active'] <= hospital_capacity[state_code])
        print("States that meet hospital guidelines: \n{}".format(json.dumps(state_hospitals, indent=2)))
        return state_hospitals

    def get_test_trend(self):
        """
        Calculates which states meet the guideline:
        "Downward Trajectory of positive tests within 14 days
            (flat or increasing volume of tests)"

        Grabs the number of people tested and active cases per state and
        calculates the slope of both lines.

        If (active cases <= 0 && tests >= 0), then it meets the guideline.
        If the above expression is not true, then it does not meet the guideline.
        """
        state_tests = {}
        for state in state_codes.keys():
            state_data = self.data.loc[self.data['province_state'] == state]
            df = pandas.DataFrame(state_data, columns=['people_tested', 'active'])
            df = df.reset_index(drop=True)
            state_tests[state] = (self.is_downward_trend(df, 'active') & self.is_upward_trend(df, 'people_tested'))
        return state_tests

    def get_case_info(self, state):
        """
        Returns information about cases over the 14 day period for a given
        state. That info is:
            - Net change in new cases
            - Cases at beginning of 14 days
            - Cases at end of 14 days
            - Number of people tested
        """
        case_info = {}
        state_data = self.data.loc[self.data['province_state'] == state.lower()]
        df = pandas.DataFrame(state_data, columns=['active', 'confirmed', 'people_tested'])
        df = df.reset_index(drop=True)
        case_info["beginning"] = df.iloc[0]['active']
        case_info["end"] = df.iloc[-1]['active']
        case_info["net"] = df.iloc[-1]['active'] - df.iloc[0]['active']
        case_info["total"] = df.iloc[-1]['confirmed']
        case_info["total_tests"] = df.iloc[-1]['people_tested']
        return case_info

    def get_slope(self, data, column):
        """
        Calculates the slope of a graph given a list of data
        """
        slope_data = data.apply(lambda x: numpy.polyfit(data.index, x, 1)[0])
        return slope_data[column]

    def is_downward_trend(self, data, column):
        """
        Determines if the trend is downward (slope is negative)
        """
        slope = self.get_slope(data, column)
        return True if slope <= 0 else False

    def is_upward_trend(self, data, column):
        """
        Determines if the trend is upward (slope is positive)
        """
        slope = self.get_slope(data, column)
        return True if slope >= 0 else False

    def compile_data(self):
        """
        Compiles all data into one coherent json file to be parsed by the
        frontend
        """
        data = {}
        for state in state_codes.keys():
            case_info = self.get_case_info(state)
            data[state] = {}
            data[state]["state_code"] = state_codes[state]
            data[state]["total_hospital_capacity"] = hospital_capacity[state_codes[state]]
            data[state]["downward_cases"] = self.state_cases[state]
            data[state]["enough_hospital_capacity"] = self.state_hospitals[state]
            data[state]["beginning_cases"] = case_info["beginning"]
            data[state]["end_cases"] = case_info["end"]
            data[state]["net_case_change"] = case_info["net"]
            data[state]["total_cases"] = case_info["total"]
            data[state]["enough_tests"] = self.state_tests[state]
            data[state]["total_tests"] = case_info["total_tests"]
            data[state]["should_open"] = (self.state_cases[state] & self.state_hospitals[state] & self.state_tests[state])
            data[state]["most_recent_date"] = self.most_recent_date

        with open('compiled_data-{}.json'.format(date.today().strftime("%m-%d-%Y")), 'w') as outfile:
            json.dump(data, outfile)

        print("Successfully wrote data to json file. Result: {}".format(json.dumps(data, indent=2)))

        #Upload file to FTP server
        try:
            ftp = FTP('ftp.shouldmystateopen.com')
            username = ""
            password = ""
            with open('credentials', 'r') as ftp_credentials:
                csv_reader = csv.reader(ftp_credentials, delimiter=',')
                for row in csv_reader:
                    username = row[0]
                    password = row[1]
            ftp.login(username, password)
            with open('compiled_data-{}.json'.format(date.today().strftime("%m-%d-%Y")), 'rb') as writefile:
                ftp.storbinary('STOR %s' % '/public_html/data/compiled_data.json', writefile)
            ftp.quit()
        except Exception as e:
            print("An Exception Occurred:\n {}".format(e))
            self.exception_message = e
            return False

        self.exception_message = "Test Exception..."
        return True

    def send_error_email(self):
        """
        Sends an error email to johnnyleek2001@gmail.com using provided
        credentials if something goes wrong
        """
        email_user = ""
        email_password = ""
        with open('email_credentials', 'r') as email_credentials:
            csv_reader = csv.reader(email_credentials, delimiter=',')
            for row in csv_reader:
                email_user = row[0]
                email_password = row[1]
        message = """\
        Subject: WEB ERROR shouldmystateopen.com

        WEB ERROR OCCURRED @ https://shouldmystateopen.com (FTP UPLOAD)
        Date: {date} | Time: {time}
        Exception message as follows:
        {error}
        """.format(date=date.today().strftime("%m-%d-%Y"),
                   time=datetime.now().strftime("%H:%M:%S"),
                   error=self.exception_message if self.exception_message else "No message provided."
                  )
        ssl._create_default_https_context = ssl._create_unverified_context
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as email_server:
            try:
                email_server.login(email_user, email_password)
                email_server.sendmail(email_user, "johnnyleek2001@gmail.com", message)
                self.exception_message = None
            except Exception as e:
                print("Couldn't send email...\n{}".format(e))
            finally:
                email_server.quit()

    def upload_data_or_email(self):
        """
        Attempts to upload FTP data, else send email error
        """
        if not self.compile_data():
            self.send_error_email()

    def run_automated_tasks(self):
        """
        Runs scheduled tasks
        """
        while True:
            schedule.run_pending()
            time.sleep(1)

collect = DataCollect()
