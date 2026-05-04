import network
import time

try:
    import urequests as requests
except ImportError:
    import requests


SSID = "YOUR_HOTSPOT_NAME"
PASSWORD = "YOUR_HOTSPOT_PASSWORD"
API_URL = "http://192.168.150.182:8000/api/v1/devices/m5stack/temperature"
DEVICE_ID = "m5-temperature-001"


def connect_wifi() -> network.WLAN:
    wlan = network.WLAN(network.STA_IF)
    wlan.active(True)

    if not wlan.isconnected():
        print("Connecting to Wi-Fi...")
        wlan.connect(SSID, PASSWORD)
        for _ in range(20):
            if wlan.isconnected():
                break
            time.sleep(1)

    print("Wi-Fi connected:", wlan.isconnected())
    if wlan.isconnected():
        print("IP info:", wlan.ifconfig())
    return wlan


def read_temperature() -> float:
    # Replace this with your real sensor reading logic in UIFlow2.
    return 36.2


def send_temperature(wlan: network.WLAN) -> None:
    payload = {
        "device_id": DEVICE_ID,
        "temperature_c": read_temperature(),
        "humidity_percent": None,
        "firmware_version": "1.0.0",
        "wifi_rssi": wlan.status("rssi") if wlan.isconnected() else None,
        "sensor_type": "temperature",
        "source": "uiflow2",
    }

    headers = {
        "Content-Type": "application/json",
    }

    try:
        response = requests.post(API_URL, json=payload, headers=headers)
        print("HTTP status:", response.status_code)
        print("Response:", response.text)
        response.close()
    except Exception as exc:
        print("Send failed:", exc)


def main() -> None:
    wlan = connect_wifi()
    while True:
        send_temperature(wlan)
        time.sleep(10)


main()
