from influxdb_client import InfluxDBClient, Point
from influxdb_client.client.write_api import SYNCHRONOUS
import time
import random

# Replace with your InfluxDB details
token = "my-secret-token"
# p7pwIER4kNzrh-cBuwcsnMHibj40gJF_j5yInZlhPQnXoqD4I6PVD2Z8Rzx3Nt1V2jPZ9M6VHjFG5_QGtvkzxA==
org = "OpenTier"
bucket = "telemetry"
url = "http://localhost:8086"

# Configurations
#   1. vehicle IDs
#   #1 is a real vehicle, #6 is inactive, #2-5 and #7-10 are dummy vehicles
vehicles = ["2", "3", "4", "5", "7", "8", "9", "10"]
map_vehicles = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]
#   2. Delay between samples in s
delay = 2.5  #
#   3. City => Riyadh or Bonn or None
city = "Riyadh"

# Routes
routes = [
    [
        {"latitude": 24.81198, "longitude": 46.62549},
        {"latitude": 24.81353, "longitude": 46.62477},
        {"latitude": 24.81401, "longitude": 46.62455},
        {"latitude": 24.81612, "longitude": 46.62348},
        {"latitude": 24.81707, "longitude": 46.62297},
        {"latitude": 24.81826, "longitude": 46.62235},
        {"latitude": 24.81894, "longitude": 46.62205},
        {"latitude": 24.81976, "longitude": 46.62163},
        {"latitude": 24.82058, "longitude": 46.6212},
        {"latitude": 24.82186, "longitude": 46.62055},
        {"latitude": 24.82413, "longitude": 46.61942},
        {"latitude": 24.8247, "longitude": 46.61914},
        {"latitude": 24.82567, "longitude": 46.61862},
        {"latitude": 24.82667, "longitude": 46.6181},
        {"latitude": 24.82703, "longitude": 46.61796},
        {"latitude": 24.82728, "longitude": 46.61783},
        {"latitude": 24.82744, "longitude": 46.61775},
        {"latitude": 24.82763, "longitude": 46.61775},
        {"latitude": 24.82774, "longitude": 46.61776},
        {"latitude": 24.82783, "longitude": 46.61789},
        {"latitude": 24.82801, "longitude": 46.61827},
        {"latitude": 24.82847, "longitude": 46.61944},
        {"latitude": 24.82942, "longitude": 46.62163},
        {"latitude": 24.82985, "longitude": 46.62261},
        {"latitude": 24.83016, "longitude": 46.62338},
        {"latitude": 24.83094, "longitude": 46.62521},
        {"latitude": 24.83183, "longitude": 46.62737},
        {"latitude": 24.83221, "longitude": 46.62825},
        {"latitude": 24.83315, "longitude": 46.63047},
        {"latitude": 24.83315, "longitude": 46.63056},
        {"latitude": 24.83318, "longitude": 46.63073},
        {"latitude": 24.83332, "longitude": 46.63107},
        {"latitude": 24.83387, "longitude": 46.63252},
        {"latitude": 24.83481, "longitude": 46.635},
        {"latitude": 24.83482, "longitude": 46.6351},
        {"latitude": 24.83482, "longitude": 46.6351},
        {"latitude": 24.8348, "longitude": 46.63517},
        {"latitude": 24.83467, "longitude": 46.63528},
        {"latitude": 24.83275, "longitude": 46.63635},
        {"latitude": 24.83204, "longitude": 46.63677},
        {"latitude": 24.83143, "longitude": 46.63711},
        {"latitude": 24.83095, "longitude": 46.63597},
        {"latitude": 24.8302, "longitude": 46.63428},
        {"latitude": 24.82933, "longitude": 46.63226},
        {"latitude": 24.82901, "longitude": 46.63143},
        {"latitude": 24.82853, "longitude": 46.63031},
        {"latitude": 24.82833, "longitude": 46.62983},
        {"latitude": 24.82818, "longitude": 46.62947},
        {"latitude": 24.82832, "longitude": 46.6294},
        {"latitude": 24.82835, "longitude": 46.62938},
        {"latitude": 24.82826, "longitude": 46.62922},
        {"latitude": 24.82811, "longitude": 46.6293},
        {"latitude": 24.82639, "longitude": 46.63017},
        {"latitude": 24.8248, "longitude": 46.63098},
        {"latitude": 24.8248, "longitude": 46.63098},
        {"latitude": 24.82319, "longitude": 46.63179},
        {"latitude": 24.82233, "longitude": 46.6298},
        {"latitude": 24.82228, "longitude": 46.62968},
        {"latitude": 24.82216, "longitude": 46.62974},
        {"latitude": 24.82102, "longitude": 46.63031},
        {"latitude": 24.82071, "longitude": 46.63047},
        {"latitude": 24.81936, "longitude": 46.63115},
        {"latitude": 24.81851, "longitude": 46.63157},
        {"latitude": 24.81514, "longitude": 46.63328},
        {"latitude": 24.81509, "longitude": 46.63336},
        {"latitude": 24.81508, "longitude": 46.63342},
        {"latitude": 24.81493, "longitude": 46.6335},
        {"latitude": 24.81491, "longitude": 46.63344},
        {"latitude": 24.81459, "longitude": 46.63268},
        {"latitude": 24.81397, "longitude": 46.63099},
        {"latitude": 24.81385, "longitude": 46.63065},
        {"latitude": 24.81351, "longitude": 46.62992},
        {"latitude": 24.81333, "longitude": 46.62952},
        {"latitude": 24.813, "longitude": 46.62866},
        {"latitude": 24.81274, "longitude": 46.62807},
        {"latitude": 24.81265, "longitude": 46.62781},
        {"latitude": 24.81231, "longitude": 46.62712},
        {"latitude": 24.81196, "longitude": 46.62635},
        {"latitude": 24.81182, "longitude": 46.62609},
        {"latitude": 24.81181, "longitude": 46.62589},
        {"latitude": 24.8118, "longitude": 46.62578},
        {"latitude": 24.81186, "longitude": 46.62564},
        {"latitude": 24.81198, "longitude": 46.62549},
    ],
    [
        {"latitude": 24.80384, "longitude": 46.60702},
        {"latitude": 24.80324, "longitude": 46.60559},
        {"latitude": 24.80298, "longitude": 46.60496},
        {"latitude": 24.80276, "longitude": 46.60446},
        {"latitude": 24.80293, "longitude": 46.60437},
        {"latitude": 24.80343, "longitude": 46.60411},
        {"latitude": 24.80418, "longitude": 46.60375},
        {"latitude": 24.80582, "longitude": 46.60291},
        {"latitude": 24.80622, "longitude": 46.60272},
        {"latitude": 24.80668, "longitude": 46.60249},
        {"latitude": 24.80731, "longitude": 46.60216},
        {"latitude": 24.80851, "longitude": 46.60154},
        {"latitude": 24.80915, "longitude": 46.60127},
        {"latitude": 24.80939, "longitude": 46.60113},
        {"latitude": 24.8101, "longitude": 46.60077},
        {"latitude": 24.81151, "longitude": 46.60002},
        {"latitude": 24.81168, "longitude": 46.59995},
        {"latitude": 24.81228, "longitude": 46.59965},
        {"latitude": 24.8136, "longitude": 46.59899},
        {"latitude": 24.81572, "longitude": 46.59792},
        {"latitude": 24.81607, "longitude": 46.59775},
        {"latitude": 24.81638, "longitude": 46.59759},
        {"latitude": 24.81702, "longitude": 46.59725},
        {"latitude": 24.81763, "longitude": 46.59695},
        {"latitude": 24.81858, "longitude": 46.59646},
        {"latitude": 24.81863, "longitude": 46.59645},
        {"latitude": 24.81886, "longitude": 46.59648},
        {"latitude": 24.81891, "longitude": 46.5965},
        {"latitude": 24.81916, "longitude": 46.59714},
        {"latitude": 24.82013, "longitude": 46.59943},
        {"latitude": 24.82076, "longitude": 46.60093},
        {"latitude": 24.82123, "longitude": 46.60202},
        {"latitude": 24.8219, "longitude": 46.60365},
        {"latitude": 24.82293, "longitude": 46.60605},
        {"latitude": 24.82289, "longitude": 46.60618},
        {"latitude": 24.82282, "longitude": 46.60626},
        {"latitude": 24.82235, "longitude": 46.60651},
        {"latitude": 24.81994, "longitude": 46.60774},
        {"latitude": 24.81988, "longitude": 46.60776},
        {"latitude": 24.81988, "longitude": 46.60776},
        {"latitude": 24.81967, "longitude": 46.60784},
        {"latitude": 24.81896, "longitude": 46.60819},
        {"latitude": 24.81839, "longitude": 46.60848},
        {"latitude": 24.8167, "longitude": 46.60935},
        {"latitude": 24.81564, "longitude": 46.60986},
        {"latitude": 24.81534, "longitude": 46.61006},
        {"latitude": 24.81452, "longitude": 46.61047},
        {"latitude": 24.81427, "longitude": 46.6106},
        {"latitude": 24.81401, "longitude": 46.60995},
        {"latitude": 24.81381, "longitude": 46.60949},
        {"latitude": 24.8137, "longitude": 46.60955},
        {"latitude": 24.81389, "longitude": 46.61},
        {"latitude": 24.81421, "longitude": 46.61077},
        {"latitude": 24.81472, "longitude": 46.61203},
        {"latitude": 24.81472, "longitude": 46.61203},
        {"latitude": 24.81508, "longitude": 46.6129},
        {"latitude": 24.8145, "longitude": 46.61317},
        {"latitude": 24.8144, "longitude": 46.6132},
        {"latitude": 24.81434, "longitude": 46.61323},
        {"latitude": 24.81441, "longitude": 46.61341},
        {"latitude": 24.8149, "longitude": 46.61456},
        {"latitude": 24.81492, "longitude": 46.61469},
        {"latitude": 24.81487, "longitude": 46.61473},
        {"latitude": 24.81385, "longitude": 46.61526},
        {"latitude": 24.8131, "longitude": 46.61564},
        {"latitude": 24.81277, "longitude": 46.6158},
        {"latitude": 24.81266, "longitude": 46.61552},
        {"latitude": 24.81158, "longitude": 46.61606},
        {"latitude": 24.81075, "longitude": 46.61649},
        {"latitude": 24.8086, "longitude": 46.61756},
        {"latitude": 24.80835, "longitude": 46.61768},
        {"latitude": 24.80819, "longitude": 46.61727},
        {"latitude": 24.80802, "longitude": 46.61685},
        {"latitude": 24.8074, "longitude": 46.61542},
        {"latitude": 24.80718, "longitude": 46.61492},
        {"latitude": 24.80709, "longitude": 46.61482},
        {"latitude": 24.80687, "longitude": 46.61437},
        {"latitude": 24.80676, "longitude": 46.61411},
        {"latitude": 24.80671, "longitude": 46.61391},
        {"latitude": 24.80645, "longitude": 46.61318},
        {"latitude": 24.80587, "longitude": 46.61182},
        {"latitude": 24.80507, "longitude": 46.60994},
        {"latitude": 24.80384, "longitude": 46.60702},
    ],
    [
        {"latitude": 24.80384, "longitude": 46.60702},
        {"latitude": 24.80507, "longitude": 46.60994},
        {"latitude": 24.80587, "longitude": 46.61182},
        {"latitude": 24.80645, "longitude": 46.61318},
        {"latitude": 24.80671, "longitude": 46.61391},
        {"latitude": 24.80676, "longitude": 46.61411},
        {"latitude": 24.80687, "longitude": 46.61437},
        {"latitude": 24.80709, "longitude": 46.61482},
        {"latitude": 24.80718, "longitude": 46.61492},
        {"latitude": 24.8074, "longitude": 46.61542},
        {"latitude": 24.80802, "longitude": 46.61685},
        {"latitude": 24.80819, "longitude": 46.61727},
        {"latitude": 24.80835, "longitude": 46.61768},
        {"latitude": 24.8086, "longitude": 46.61756},
        {"latitude": 24.81075, "longitude": 46.61649},
        {"latitude": 24.81158, "longitude": 46.61606},
        {"latitude": 24.81266, "longitude": 46.61552},
        {"latitude": 24.81277, "longitude": 46.6158},
        {"latitude": 24.8131, "longitude": 46.61564},
        {"latitude": 24.81385, "longitude": 46.61526},
        {"latitude": 24.81487, "longitude": 46.61473},
        {"latitude": 24.81492, "longitude": 46.61469},
        {"latitude": 24.8149, "longitude": 46.61456},
        {"latitude": 24.81441, "longitude": 46.61341},
        {"latitude": 24.81434, "longitude": 46.61323},
        {"latitude": 24.8144, "longitude": 46.6132},
        {"latitude": 24.8145, "longitude": 46.61317},
        {"latitude": 24.81508, "longitude": 46.6129},
        {"latitude": 24.81472, "longitude": 46.61203},
        {"latitude": 24.81472, "longitude": 46.61203},
        {"latitude": 24.81421, "longitude": 46.61077},
        {"latitude": 24.81389, "longitude": 46.61},
        {"latitude": 24.8137, "longitude": 46.60955},
        {"latitude": 24.81381, "longitude": 46.60949},
        {"latitude": 24.81401, "longitude": 46.60995},
        {"latitude": 24.81427, "longitude": 46.6106},
        {"latitude": 24.81452, "longitude": 46.61047},
        {"latitude": 24.81534, "longitude": 46.61006},
        {"latitude": 24.81564, "longitude": 46.60986},
        {"latitude": 24.8167, "longitude": 46.60935},
        {"latitude": 24.81839, "longitude": 46.60848},
        {"latitude": 24.81896, "longitude": 46.60819},
        {"latitude": 24.81967, "longitude": 46.60784},
        {"latitude": 24.81988, "longitude": 46.60776},
        {"latitude": 24.81988, "longitude": 46.60776},
        {"latitude": 24.81994, "longitude": 46.60774},
        {"latitude": 24.82235, "longitude": 46.60651},
        {"latitude": 24.82282, "longitude": 46.60626},
        {"latitude": 24.82289, "longitude": 46.60618},
        {"latitude": 24.82293, "longitude": 46.60605},
        {"latitude": 24.8219, "longitude": 46.60365},
        {"latitude": 24.82123, "longitude": 46.60202},
        {"latitude": 24.82076, "longitude": 46.60093},
        {"latitude": 24.82013, "longitude": 46.59943},
        {"latitude": 24.81916, "longitude": 46.59714},
        {"latitude": 24.81891, "longitude": 46.5965},
        {"latitude": 24.81886, "longitude": 46.59648},
        {"latitude": 24.81858, "longitude": 46.59646},
        {"latitude": 24.81858, "longitude": 46.59646},
        {"latitude": 24.81702, "longitude": 46.59725},
        {"latitude": 24.81702, "longitude": 46.59725},
        {"latitude": 24.81638, "longitude": 46.59759},
        {"latitude": 24.81607, "longitude": 46.59775},
        {"latitude": 24.81572, "longitude": 46.59792},
        {"latitude": 24.8136, "longitude": 46.59899},
        {"latitude": 24.81228, "longitude": 46.59965},
        {"latitude": 24.81168, "longitude": 46.59995},
        {"latitude": 24.81151, "longitude": 46.60002},
        {"latitude": 24.8101, "longitude": 46.60077},
        {"latitude": 24.80939, "longitude": 46.60113},
        {"latitude": 24.80915, "longitude": 46.60127},
        {"latitude": 24.80851, "longitude": 46.60154},
        {"latitude": 24.80731, "longitude": 46.60216},
        {"latitude": 24.80668, "longitude": 46.60249},
        {"latitude": 24.80622, "longitude": 46.60272},
        {"latitude": 24.80582, "longitude": 46.60291},
        {"latitude": 24.80418, "longitude": 46.60375},
        {"latitude": 24.80343, "longitude": 46.60411},
        {"latitude": 24.80293, "longitude": 46.60437},
        {"latitude": 24.80276, "longitude": 46.60446},
        {"latitude": 24.80298, "longitude": 46.60496},
        {"latitude": 24.80324, "longitude": 46.60559},
        {"latitude": 24.80384, "longitude": 46.60702},
    ],
    [
        {"latitude": 24.81198, "longitude": 46.62549},
        {"latitude": 24.81186, "longitude": 46.62564},
        {"latitude": 24.8118, "longitude": 46.62578},
        {"latitude": 24.81181, "longitude": 46.62589},
        {"latitude": 24.81182, "longitude": 46.62609},
        {"latitude": 24.81196, "longitude": 46.62635},
        {"latitude": 24.81231, "longitude": 46.62712},
        {"latitude": 24.81265, "longitude": 46.62781},
        {"latitude": 24.81274, "longitude": 46.62807},
        {"latitude": 24.813, "longitude": 46.62866},
        {"latitude": 24.81333, "longitude": 46.62952},
        {"latitude": 24.81351, "longitude": 46.62992},
        {"latitude": 24.81385, "longitude": 46.63065},
        {"latitude": 24.81397, "longitude": 46.63099},
        {"latitude": 24.81459, "longitude": 46.63268},
        {"latitude": 24.81491, "longitude": 46.63344},
        {"latitude": 24.81493, "longitude": 46.6335},
        {"latitude": 24.81508, "longitude": 46.63342},
        {"latitude": 24.81509, "longitude": 46.63336},
        {"latitude": 24.81514, "longitude": 46.63328},
        {"latitude": 24.81851, "longitude": 46.63157},
        {"latitude": 24.81936, "longitude": 46.63115},
        {"latitude": 24.82071, "longitude": 46.63047},
        {"latitude": 24.82102, "longitude": 46.63031},
        {"latitude": 24.82216, "longitude": 46.62974},
        {"latitude": 24.82228, "longitude": 46.62968},
        {"latitude": 24.82233, "longitude": 46.6298},
        {"latitude": 24.82319, "longitude": 46.63179},
        {"latitude": 24.8248, "longitude": 46.63098},
        {"latitude": 24.8248, "longitude": 46.63098},
        {"latitude": 24.82639, "longitude": 46.63017},
        {"latitude": 24.82811, "longitude": 46.6293},
        {"latitude": 24.82826, "longitude": 46.62922},
        {"latitude": 24.82835, "longitude": 46.62938},
        {"latitude": 24.82832, "longitude": 46.6294},
        {"latitude": 24.82818, "longitude": 46.62947},
        {"latitude": 24.82833, "longitude": 46.62983},
        {"latitude": 24.82853, "longitude": 46.63031},
        {"latitude": 24.82901, "longitude": 46.63143},
        {"latitude": 24.82933, "longitude": 46.63226},
        {"latitude": 24.8302, "longitude": 46.63428},
        {"latitude": 24.83095, "longitude": 46.63597},
        {"latitude": 24.83143, "longitude": 46.63711},
        {"latitude": 24.83204, "longitude": 46.63677},
        {"latitude": 24.83275, "longitude": 46.63635},
        {"latitude": 24.83467, "longitude": 46.63528},
        {"latitude": 24.8348, "longitude": 46.63517},
        {"latitude": 24.83482, "longitude": 46.6351},
        {"latitude": 24.83482, "longitude": 46.6351},
        {"latitude": 24.83481, "longitude": 46.635},
        {"latitude": 24.83387, "longitude": 46.63252},
        {"latitude": 24.83332, "longitude": 46.63107},
        {"latitude": 24.83318, "longitude": 46.63073},
        {"latitude": 24.83315, "longitude": 46.63056},
        {"latitude": 24.83315, "longitude": 46.63047},
        {"latitude": 24.83221, "longitude": 46.62825},
        {"latitude": 24.83183, "longitude": 46.62737},
        {"latitude": 24.83094, "longitude": 46.62521},
        {"latitude": 24.83016, "longitude": 46.62338},
        {"latitude": 24.82985, "longitude": 46.62261},
        {"latitude": 24.82942, "longitude": 46.62163},
        {"latitude": 24.82847, "longitude": 46.61944},
        {"latitude": 24.82801, "longitude": 46.61827},
        {"latitude": 24.82783, "longitude": 46.61789},
        {"latitude": 24.82774, "longitude": 46.61776},
        {"latitude": 24.82763, "longitude": 46.61775},
        {"latitude": 24.82744, "longitude": 46.61775},
        {"latitude": 24.82728, "longitude": 46.61783},
        {"latitude": 24.82703, "longitude": 46.61796},
        {"latitude": 24.82667, "longitude": 46.6181},
        {"latitude": 24.82567, "longitude": 46.61862},
        {"latitude": 24.8247, "longitude": 46.61914},
        {"latitude": 24.82413, "longitude": 46.61942},
        {"latitude": 24.82186, "longitude": 46.62055},
        {"latitude": 24.82058, "longitude": 46.6212},
        {"latitude": 24.81976, "longitude": 46.62163},
        {"latitude": 24.81894, "longitude": 46.62205},
        {"latitude": 24.81826, "longitude": 46.62235},
        {"latitude": 24.81707, "longitude": 46.62297},
        {"latitude": 24.81612, "longitude": 46.62348},
        {"latitude": 24.81401, "longitude": 46.62455},
        {"latitude": 24.81353, "longitude": 46.62477},
        {"latitude": 24.81198, "longitude": 46.62549},
    ],
    [
        {"latitude": 24.824984, "longitude": 46.636444},
        {"latitude": 24.824984, "longitude": 46.636444},
        {"latitude": 24.824984, "longitude": 46.636444},
        {"latitude": 24.824984, "longitude": 46.636444},
        {"latitude": 24.824984, "longitude": 46.636444},
        {"latitude": 24.824984, "longitude": 46.636444},
        {"latitude": 24.824984, "longitude": 46.636444},
        {"latitude": 24.824984, "longitude": 46.636444},
        {"latitude": 24.824984, "longitude": 46.636444},
        {"latitude": 24.824984, "longitude": 46.636444},
        {"latitude": 24.824984, "longitude": 46.636444},
        {"latitude": 24.824984, "longitude": 46.636444},
        {"latitude": 24.824984, "longitude": 46.636444},
        {"latitude": 24.824984, "longitude": 46.636444},
        {"latitude": 24.824984, "longitude": 46.636444},
        {"latitude": 24.824984, "longitude": 46.636444},
        {"latitude": 24.824984, "longitude": 46.636444},
        {"latitude": 24.824984, "longitude": 46.636444},
        {"latitude": 24.824984, "longitude": 46.636444},
        {"latitude": 24.824984, "longitude": 46.636444},
        {"latitude": 24.824984, "longitude": 46.636444},
        {"latitude": 24.824984, "longitude": 46.636444},
        {"latitude": 24.824984, "longitude": 46.636444},
        {"latitude": 24.824984, "longitude": 46.636444},
        {"latitude": 24.824984, "longitude": 46.636444},
        {"latitude": 24.824984, "longitude": 46.636444},
        {"latitude": 24.824984, "longitude": 46.636444},
        {"latitude": 24.824984, "longitude": 46.636444},
        {"latitude": 24.824984, "longitude": 46.636444},
        {"latitude": 24.824984, "longitude": 46.636444},
        {"latitude": 24.824984, "longitude": 46.636444},
        {"latitude": 24.824984, "longitude": 46.636444},
        {"latitude": 24.824984, "longitude": 46.636444},
        {"latitude": 24.824984, "longitude": 46.636444},
        {"latitude": 24.824984, "longitude": 46.636444},
        {"latitude": 24.824984, "longitude": 46.636444},
        {"latitude": 24.824984, "longitude": 46.636444},
        {"latitude": 24.824984, "longitude": 46.636444},
        {"latitude": 24.824984, "longitude": 46.636444},
        {"latitude": 24.824984, "longitude": 46.636444},
        {"latitude": 24.824984, "longitude": 46.636444},
        {"latitude": 24.824984, "longitude": 46.636444},
        {"latitude": 24.824984, "longitude": 46.636444},
        {"latitude": 24.824984, "longitude": 46.636444},
        {"latitude": 24.824984, "longitude": 46.636444},
        {"latitude": 24.824984, "longitude": 46.636444},
        {"latitude": 24.824984, "longitude": 46.636444},
        {"latitude": 24.824984, "longitude": 46.636444},
        {"latitude": 24.824984, "longitude": 46.636444},
        {"latitude": 24.824984, "longitude": 46.636444},
        {"latitude": 24.824984, "longitude": 46.636444},
        {"latitude": 24.824984, "longitude": 46.636444},
        {"latitude": 24.824984, "longitude": 46.636444},
        {"latitude": 24.824984, "longitude": 46.636444},
        {"latitude": 24.824984, "longitude": 46.636444},
        {"latitude": 24.824984, "longitude": 46.636444},
        {"latitude": 24.824984, "longitude": 46.636444},
        {"latitude": 24.824984, "longitude": 46.636444},
        {"latitude": 24.824984, "longitude": 46.636444},
        {"latitude": 24.824984, "longitude": 46.636444},
        {"latitude": 24.824984, "longitude": 46.636444},
        {"latitude": 24.824984, "longitude": 46.636444},
        {"latitude": 24.824984, "longitude": 46.636444},
        {"latitude": 24.824984, "longitude": 46.636444},
        {"latitude": 24.824984, "longitude": 46.636444},
        {"latitude": 24.824984, "longitude": 46.636444},
        {"latitude": 24.824984, "longitude": 46.636444},
        {"latitude": 24.824984, "longitude": 46.636444},
        {"latitude": 24.824984, "longitude": 46.636444},
        {"latitude": 24.824984, "longitude": 46.636444},
        {"latitude": 24.824984, "longitude": 46.636444},
        {"latitude": 24.824984, "longitude": 46.636444},
        {"latitude": 24.824984, "longitude": 46.636444},
        {"latitude": 24.824984, "longitude": 46.636444},
        {"latitude": 24.824984, "longitude": 46.636444},
        {"latitude": 24.824984, "longitude": 46.636444},
        {"latitude": 24.824984, "longitude": 46.636444},
        {"latitude": 24.824984, "longitude": 46.636444},
        {"latitude": 24.824984, "longitude": 46.636444},
        {"latitude": 24.824984, "longitude": 46.636444},
        {"latitude": 24.824984, "longitude": 46.636444},
        {"latitude": 24.824984, "longitude": 46.636444},
        {"latitude": 24.824984, "longitude": 46.636444},
    ],
    [
        {"latitude": 24.7743, "longitude": 46.7386},
        {"latitude": 24.7743, "longitude": 46.7386},
        {"latitude": 24.7743, "longitude": 46.7386},
        {"latitude": 24.7743, "longitude": 46.7386},
        {"latitude": 24.7743, "longitude": 46.7386},
        {"latitude": 24.7743, "longitude": 46.7386},
        {"latitude": 24.7743, "longitude": 46.7386},
        {"latitude": 24.7743, "longitude": 46.7386},
        {"latitude": 24.7743, "longitude": 46.7386},
        {"latitude": 24.7743, "longitude": 46.7386},
        {"latitude": 24.7743, "longitude": 46.7386},
        {"latitude": 24.7743, "longitude": 46.7386},
        {"latitude": 24.7743, "longitude": 46.7386},
        {"latitude": 24.7743, "longitude": 46.7386},
        {"latitude": 24.7743, "longitude": 46.7386},
        {"latitude": 24.7743, "longitude": 46.7386},
        {"latitude": 24.7743, "longitude": 46.7386},
        {"latitude": 24.7743, "longitude": 46.7386},
        {"latitude": 24.7743, "longitude": 46.7386},
        {"latitude": 24.7743, "longitude": 46.7386},
        {"latitude": 24.7743, "longitude": 46.7386},
        {"latitude": 24.7743, "longitude": 46.7386},
        {"latitude": 24.7743, "longitude": 46.7386},
        {"latitude": 24.7743, "longitude": 46.7386},
        {"latitude": 24.7743, "longitude": 46.7386},
        {"latitude": 24.7743, "longitude": 46.7386},
        {"latitude": 24.7743, "longitude": 46.7386},
        {"latitude": 24.7743, "longitude": 46.7386},
        {"latitude": 24.7743, "longitude": 46.7386},
        {"latitude": 24.7743, "longitude": 46.7386},
        {"latitude": 24.7743, "longitude": 46.7386},
        {"latitude": 24.7743, "longitude": 46.7386},
        {"latitude": 24.7743, "longitude": 46.7386},
        {"latitude": 24.7743, "longitude": 46.7386},
        {"latitude": 24.7743, "longitude": 46.7386},
        {"latitude": 24.7743, "longitude": 46.7386},
        {"latitude": 24.7743, "longitude": 46.7386},
        {"latitude": 24.7743, "longitude": 46.7386},
        {"latitude": 24.7743, "longitude": 46.7386},
        {"latitude": 24.7743, "longitude": 46.7386},
        {"latitude": 24.7743, "longitude": 46.7386},
        {"latitude": 24.7743, "longitude": 46.7386},
        {"latitude": 24.7743, "longitude": 46.7386},
        {"latitude": 24.7743, "longitude": 46.7386},
        {"latitude": 24.7743, "longitude": 46.7386},
        {"latitude": 24.7743, "longitude": 46.7386},
        {"latitude": 24.7743, "longitude": 46.7386},
        {"latitude": 24.7743, "longitude": 46.7386},
        {"latitude": 24.7743, "longitude": 46.7386},
        {"latitude": 24.7743, "longitude": 46.7386},
        {"latitude": 24.7743, "longitude": 46.7386},
        {"latitude": 24.7743, "longitude": 46.7386},
        {"latitude": 24.7743, "longitude": 46.7386},
        {"latitude": 24.7743, "longitude": 46.7386},
        {"latitude": 24.7743, "longitude": 46.7386},
        {"latitude": 24.7743, "longitude": 46.7386},
        {"latitude": 24.7743, "longitude": 46.7386},
        {"latitude": 24.7743, "longitude": 46.7386},
        {"latitude": 24.7743, "longitude": 46.7386},
        {"latitude": 24.7743, "longitude": 46.7386},
        {"latitude": 24.7743, "longitude": 46.7386},
        {"latitude": 24.7743, "longitude": 46.7386},
        {"latitude": 24.7743, "longitude": 46.7386},
        {"latitude": 24.7743, "longitude": 46.7386},
        {"latitude": 24.7743, "longitude": 46.7386},
        {"latitude": 24.7743, "longitude": 46.7386},
        {"latitude": 24.7743, "longitude": 46.7386},
        {"latitude": 24.7743, "longitude": 46.7386},
        {"latitude": 24.7743, "longitude": 46.7386},
        {"latitude": 24.7743, "longitude": 46.7386},
        {"latitude": 24.7743, "longitude": 46.7386},
        {"latitude": 24.7743, "longitude": 46.7386},
        {"latitude": 24.7743, "longitude": 46.7386},
        {"latitude": 24.7743, "longitude": 46.7386},
        {"latitude": 24.7743, "longitude": 46.7386},
        {"latitude": 24.7743, "longitude": 46.7386},
        {"latitude": 24.7743, "longitude": 46.7386},
        {"latitude": 24.7743, "longitude": 46.7386},
        {"latitude": 24.7743, "longitude": 46.7386},
        {"latitude": 24.7743, "longitude": 46.7386},
        {"latitude": 24.7743, "longitude": 46.7386},
        {"latitude": 24.7743, "longitude": 46.7386},
        {"latitude": 24.7743, "longitude": 46.7386},
    ],
]
route_index = 0

# Initialize the client
client = InfluxDBClient(url=url, token=token, org=org)

# Initialize the write API
write_api = client.write_api(write_options=SYNCHRONOUS)

# Create a point to write
"""
point = (
    Point("measurement_name")
    .tag("location", "office")
    .field("temperature", 23.5)
    .field("humidity", 60)
)
"""


def write_vehicle_data(vehicleId):
    # engine: for now remove to be consistnet with vehicle
    # engine = Point("engine").tag("vehicle_id", vehicleId)
    # engine.field("temperature", random.uniform(100.00, 150.00))

    # battery
    battery = Point("battery").tag("vehicle_id", vehicleId)
    battery.field("battery_level", random.uniform(0.00, 100.00))
    battery.field("temperature", random.uniform(100.00, 150.00))

    # speed
    speed = Point("speed").tag("vehicle_id", vehicleId)
    speed.field("speed", random.uniform(60.00, 100.00))

    # tires
    tires = Point("tires").tag("vehicle_id", vehicleId)
    tires.field("front_tire_pressure", int(random.uniform(10, 40)))

    # lock_state
    lock_state = Point("lock_state").tag("vehicle_id", vehicleId)
    lock_state.field("system_state", "LOCK")  # "LOCK" or "ON"

    # Write data to InfluxDB
    # write_api.write(bucket=bucket, org=org, record=engine)
    write_api.write(bucket=bucket, org=org, record=battery)
    write_api.write(bucket=bucket, org=org, record=speed)
    write_api.write(bucket=bucket, org=org, record=tires)
    write_api.write(bucket=bucket, org=org, record=lock_state)

    # print("Data written to InfluxDB successfully!")


def write_map_data(vehicleId):
    # location
    if city == "Riyadh":
        vehicle_index = (int(vehicleId) - 1) % len(routes)

        longitude = routes[vehicle_index][route_index]["longitude"]
        latitude = routes[vehicle_index][route_index]["latitude"]

        # print(f"Vehicle {vehicleId} at route index {route_index} with
        # coordinates: ({latitude}, {longitude})")

        location = Point("location").tag("vehicle_id", vehicleId)
        location.field("latitude", latitude)
        location.field("longitude", longitude)
    else:
        if city == "Bonn":
            location = Point("location").tag("vehicle_id", vehicleId)
            location.field("latitude", random.uniform(50.733, 50.734))
            location.field("longitude", random.uniform(7.101, 7.102))
        else:  # None
            pass
    write_api.write(bucket=bucket, org=org, record=location)


try:
    while True:
        for vehicle in vehicles:
            write_vehicle_data(vehicle)

        for vehicle in map_vehicles:
            write_map_data(vehicle)
        route_index += 1
        if route_index >= len(routes[0]):
            route_index = 0

        time.sleep(delay)

except KeyboardInterrupt:
    print("Stopped by user")

finally:
    # Close the client
    client.close()
