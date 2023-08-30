import requests
import re

# 서버의 URL과 데이터 설정
server_url = "http://172.30.1.81:9999/Diary"  # 서버의 IP 주소와 포트로 변경
data = {
    "text": "개미는 뚠뚠. 오늘도 뚠뚠. 열심히 일을 하네."  # 서버로 전송할 데이터
}

# POST 요청 보내기
response = requests.post(server_url, json=data)

# 응답 처리
if response.status_code == 200:
    result = response.json()
    stdout = result.get("stdout", "")
    
    # 정규식을 사용하여 숫자 형식 찾기
    extracted_values = re.findall(r'\b\d+\.\d+\b', stdout)
    
    if extracted_values:
        extracted_value = extracted_values[0]
        print(f"Extracted Value: {extracted_value}")
    else:
        print("No extracted value found.")
else:
    print(f"Error: {response.status_code}")
