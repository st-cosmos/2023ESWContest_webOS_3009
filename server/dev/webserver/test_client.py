import requests

base_url = 'http://10.50.9.106:9999'

url = base_url+'/Page'
res = requests.get(url)
print(res.text)