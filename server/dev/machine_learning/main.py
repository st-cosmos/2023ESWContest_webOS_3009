import re #정규 표현식을 사용해 텍스트 패턴을 처리
import nltk #자연어 처리를 위한 도구 모음
from nltk.corpus import stopwords #불용어 제거
from nltk.stem import PorterStemmer #어간추출 도구
from tensorflow.keras.preprocessing.text import Tokenizer

stemmer=PorterStemmer()
nltk.download('stopwords')

from tensorflow.keras.preprocessing.sequence import pad_sequences

###
#cnn 모델
from tensorflow.keras.models import load_model

loaded_model = load_model('server/ml_files/rnn_model.h5')

#Tokenizer Object 파일로드
import pickle

with open('server/ml_files/rnn_tokenizer.pickle', 'rb') as handle:
    loaded_tokenizer = pickle.load(handle)

###
#입력 데이터 수치값 도출
import googletrans

translator = googletrans.Translator()

def sentiment_predict(new_sentence):
  text = []

  sentence = translator.translate(new_sentence, dest='en').text

  message = re.sub("[^a-zA-Z]"," ", sentence)
  message = message.lower()
  message = message.split()

  message = [stemmer.stem(words)
           for words in message
            if words not in set(stopwords.words("english"))]

  message = " ".join(message)

  text.append(message)

  max_len = 500
  encoded = loaded_tokenizer.texts_to_sequences(text) # 정수 인코딩
  pad_new = pad_sequences(encoded, maxlen = max_len) # 패딩
  score = float(loaded_model.predict(pad_new)) # 예측
  value = round(score * 100, 2)

  return value

#input 값 읽기
text = open('server/ml_files/input.txt', 'r', encoding="utf8").read()
value = sentiment_predict(text)
print(value)

#output 값 쓰기
with open('.\server\ml_files\output.txt', 'w') as f:
    f.write(str(value))