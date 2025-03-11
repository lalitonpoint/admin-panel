import requests
from datetime import datetime

# GitLab settings
GITLAB_API_URL = "http://gitlab.elluminatiinc.net"
PROJECT_ID = "39"  # Replace with your project ID
PRIVATE_TOKEN = "glpat-Yk9H6C87RwGSjSkPsDQW"  # Replace with your GitLab token
# EXPECTED_TEAM_MEMBERS = ["Ami Kalola", "Darshan Kangad"]  # Replace with actual GitLab usernames
WEBHOOK_OF_TEAMS = "https://appemporio.webhook.office.com/webhookb2/e65c016b-e6a0-403e-ae53-8026b14ce34c@aba4ea0f-3269-4af2-9cad-fbc1bfb6c923/IncomingWebhook/ff8b72cdafdb4abfb76c2365ef5e7afa/426feff3-5361-4721-af0a-fb9d1df30ebc/V26zi2enBqe0S7JOGwMKMzaZ_tmPb8xkkY1zhIHBL8jZk1"

def get_all_users():
    url = f"{GITLAB_API_URL}/projects/{PROJECT_ID}/users"
    headers = {"PRIVATE-TOKEN": PRIVATE_TOKEN}
    
    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()
    except requests.exceptions.RequestException as e:
        print(f"Error fetching users: {e}")
        return set()  # Return an empty set on error

    response_json = response.json()
    expected_team_members = {user['name'] for user in response_json}
    return expected_team_members

def get_today_committers():
    today = datetime.now().date()
    url = f"{GITLAB_API_URL}/projects/{PROJECT_ID}/repository/commits"
    headers = {"PRIVATE-TOKEN": PRIVATE_TOKEN}
    params = {"since": f"{today}T00:00:00Z", "until": f"{today}T23:59:59Z"}

    try:
        response = requests.get(url, headers=headers, params=params)
        response.raise_for_status()
    except requests.exceptions.RequestException as e:
        print(f"Error fetching commits: {e}")
        return set()  # Return an empty set on error

    # Check if the response has content
    if response.content:
        # Attempt to decode the JSON response
        try:
            commits = response.json()
        except ValueError as e:
            print(f"Failed to parse JSON response: {e}")
            print("Response text:", response.content.decode('utf-8', errors='replace'))  # Log the raw response text for debugging
            return set()  # Return an empty set to prevent further errors
    else:
        print("Received an empty response from the API.")
        return set()  # Return an empty set for no content

    # Collect committers' names for today
    print("Commits received:", commits)  # Log the commits for debugging
    committers = {commit['author_name'] for commit in commits}
    return committers

def find_missing_committers():
    committers_today = get_today_committers()
    expected_team_members = get_all_users()
    missing_committers = set(expected_team_members) - committers_today
    return missing_committers

if __name__ == "__main__":
    missing_committers = find_missing_committers()
    if missing_committers:
        text = "The following users did not commit today: " + str(missing_committers) + " - "
        print(text)

        json_data = {
            'text': text,
        }

        try:
            response_ = requests.post(WEBHOOK_OF_TEAMS, json=json_data)
            response_.raise_for_status()  # Check for errors in webhook response
        except requests.exceptions.RequestException as e:
            print(f"Error sending message to Teams: {e}")
    else:
        print("All team members have committed today.")
