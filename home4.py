import requests
import json
import speech_recognition
from googlecontroller import GoogleAssistant
import html_to_json
# Import the libraries
import urllib.request
from html_table_parser.parser import HTMLTableParser
from tabulate import tabulate
# Getting HTML Contents from the webpage
url = "https://cdaw.gsfc.nasa.gov/CME_list/UNIVERSAL/2022_04/univ2022_04.html"
req = urllib.request.Request(url=url)
f = urllib.request.urlopen(req)
xhtml = f.read().decode('utf-8')
#Creating the HTMLTableParser() object
p = HTMLTableParser()
#Feed the HTML Contents to the object
p.feed(xhtml)
#Printing the table.
s = (p.tables[0])
speedlst=[]
for x in (n+1 for n in range(100)):
	lst=s[x]
	speedlst.insert(x-1,lst[4])
print(speedlst)
print(max(speedlst))
maxspeed=max(speedlst)
'''with open(r'/home/urmom/Desktop/nasaproject/output.txt', 'w') as fp:
    for item in p.tables:
        # write each item on a new line
        fp.write("%s\n" % item)
'''

host = "192.168.0.102"
home = GoogleAssistant(host=host)
recogniser = speech_recognition.Recognizer()
with open('api_speed.json') as fp:
    speed = json.load(fp)
with open('api_kp.json') as fp:
    kp = json.load(fp)
speedValue = speed['speed']
kpValue = kp['kp']


while True:
    try:
        with speech_recognition.Microphone() as mic:
            recogniser.adjust_for_ambient_noise(mic, duration=0.2)
            audio = recogniser.listen(mic)
            text = recogniser.recognize_google(audio)
            text = text.lower()
            if "solar" and "today" in text:
                home.say(f"The speed of the solar wind today is {speedValue} kilometers per second and the Kp index is {kpValue}.")
            print(f"{text}")
            if "solar" and "max" in text:
                home.say(f"The speed of the solar wind today is {speedValue} kilometers per second. The highest recorded speed was {maxspeed}")
    except speech_recognition.UnknownValueError():
        recogniser = speech_recognition.Recognizer()
        continue