import requests
import json
import speech_recognition
from googlecontroller import GoogleAssistant

host = "192.168.0.102"
home = GoogleAssistant(host=host)
recogniser = speech_recognition.Recognizer()
with open('api_speed.json') as fp:
    speed = json.load(fp)
with open('api_kp.json') as fp:
    kp = json.load(fp)
speedValue = speed['speed']
kpValue = kp['kp']
print(speedValue)
print(kpValue)
while True:
    try:
        with speech_recognition.Microphone() as mic:
            recogniser.adjust_for_ambient_noise(mic, duration=0.2)
            audio = recogniser.listen(mic)
            text = recogniser.recognize_google(audio)
            text = text.lower()
            if "solar" and "today" in text:
                home.say(f"The speed of the solar wind today is {speedValue} kilometers per second and the Kp index is {kpValue}")
            print(f"{text}")
    except speech_recognition.UnknownValueError():
        recogniser = speech_recognition.Recognizer()
        continue



