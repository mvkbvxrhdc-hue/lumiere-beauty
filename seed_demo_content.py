import json
import urllib.request


BACKEND_URL = "http://127.0.0.1:8000"


def main() -> None:
    request = urllib.request.Request(
        f"{BACKEND_URL}/api/v1/seed-demo-content",
        data=b"{}",
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    with urllib.request.urlopen(request, timeout=15) as response:
        payload = json.loads(response.read().decode("utf-8"))
    print(json.dumps(payload, indent=2))


if __name__ == "__main__":
    main()
