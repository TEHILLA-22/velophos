import httpx
import sys

url = "https://www.googleapis.com/oauth2/v1/certs"

print(f"Testing connectivity to {url} using httpx...")
print(f"Python version: {sys.version}")

try:
    with httpx.Client() as client:
        response = client.get(url)
        print(f"Status Code: {response.status_code}")
        print("Success! Connectivity is working with httpx.")
except Exception as e:
    print(f"Failed with httpx: {e}")

print("\nTesting with requests...")
import requests
try:
    response = requests.get(url)
    print(f"Status Code: {response.status_code}")
    print("Success! Connectivity is working with requests.")
except Exception as e:
    print(f"Failed with requests: {e}")
