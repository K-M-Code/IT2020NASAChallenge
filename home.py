import requests
import json
from googlecontroller import GoogleAssistant


# aurorasAPISpeed = requests.get('https://api.auroras.live/v1/?type=ace&data=speed')
# aurorasAPIkp = requests.get('https://api.auroras.live/v1/?type=ace&data=kp')

# speedData = aurorasAPISpeed.text
# kpData = aurorasAPIkp.text

# speedParse = json.loads(speedData)
# kpParse = json.loads(kpData)

# speedValue = speedParse['speed']
# kpValue = kpParse['kp']

speedValue = 490
kpValue = 6

print(speedValue)
print(kpValue)


host = "192.168.0.102"
home = GoogleAssistant(host=host)

speech = "The current speed of the solar wind is " + str(speedValue) + " kilometers per second and the Kp index is " + str(kpValue) + "   you better take some precautions."
# speech = "FUCK YOU FUCK YOU FUCK YOU FUCK YOU FUCK YOU FUCK YOU FUCK YOU FUCK YOU"



home.say(speech)
# home.text(speech)