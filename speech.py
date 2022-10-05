import speech_recognition
import pyaudio
from googlecontroller import GoogleAssistant

host = "192.168.0.102"
home = GoogleAssistant(host=host)

recogniser = speech_recognition.Recognizer()

while True:
    try:
        with speech_recognition.Microphone() as mic:
            recogniser.adjust_for_ambient_noise(mic, duration=0.2)
            audio = recogniser.listen(mic)

            text = recogniser.recognize_google(audio)
            text = text.lower()
            if "solar" in text:
                speed = 300
                kp = 2
                home.say(f"The speed of the solar wind is {speed} kilometers per second and the Kp index is {kp}")
            print(f"{text}")
    except speech_recognition.UnknownValueError():
        recogniser = speech_recognition.Recognizer()
        continue


