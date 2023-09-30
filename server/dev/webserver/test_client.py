import requests
import re

# 서버의 URL과 데이터 설정
server_url = "http://localhost:9999/Diary"  # 서버의 IP 주소와 포트로 변경
data = {
    "text": "개미는 뚠뚠. 오늘도 뚠뚠. 열심히 일을 하네."  # 서버로 전송할 데이터
}

# POST 요청 보내기
response = requests.post(server_url, json=data)
print(response.json())