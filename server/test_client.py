import requests

base_url = 'http://172.30.1.80:9999'

url = base_url+'/Diary'
body = {
    'text' : "개미는 뚠뚠. 오늘도 뚠뚠. 열심히 일을 하네."
}
res = requests.post(url, json=body)

data = res.json()
print(data['score'])