###
#데이터 불러오기
import pandas as pd

df = pd.read_csv('.\server\dev\machine_learning\sentiment_tweets3.csv')
df = df.drop(10313)
df.rename(columns={'message to examine': 'text', 'label (depression result)': 'label'}, inplace=True)

###
#텍스트 전처리
import re #정규 표현식을 사용해 텍스트 패턴을 처리
import nltk #자연어 처리를 위한 도구 모음
from nltk.corpus import stopwords #불용어 제거
from nltk.stem import PorterStemmer #어간추출 도구

stemmer=PorterStemmer()
nltk.download('stopwords')

text = [] #토큰화된 메시지를 담을 리스트 만듦.

for message in df["text"]:

    message=re.sub("[^a-zA-Z]"," ",message)
    #특수 문자, 숫자 등을 공백으로 대체
    #알파벳 문자만 남기고 나머지는 제거

    message=message.lower() #모든 문자를 소문자로 변환

    message=message.split() #공백을 기준으로 분할하여 개별 단어로 분리

    message=[stemmer.stem(words)
            for words in message
             if words not in set(stopwords.words("english"))] #영어 불용어(stop words)의 집합(set)
    #불용어를 제외한 모든 단어들의 어간(stem)을 추출

    message=" ".join(message) #토큰화된 단어들을 다시 공백을 기준으로 하나의 문자열로 연결

    text.append(message) #전처리된 message를 corpus리스트에 추가

from tensorflow.keras.preprocessing.text import Tokenizer

tokenizer = Tokenizer()
tokenizer.fit_on_texts(text)
text_encoded = tokenizer.texts_to_sequences(text)

word_to_index = tokenizer.word_index

import pickle

with open('tokenizer.pickle', 'wb') as handle:
    pickle.dump(tokenizer, handle, protocol=pickle.HIGHEST_PROTOCOL)

threshold = 2
total_cnt = len(word_to_index) # 단어의 수
rare_cnt = 0 # 등장 빈도수가 threshold보다 작은 단어의 개수를 카운트
total_freq = 0 # 훈련 데이터의 전체 단어 빈도수 총 합
rare_freq = 0 # 등장 빈도수가 threshold보다 작은 단어의 등장 빈도수의 총 합

# 단어와 빈도수의 쌍(pair)을 key와 value로 받는다.
for key, value in tokenizer.word_counts.items():
    total_freq = total_freq + value

    # 단어의 등장 빈도수가 threshold보다 작으면
    if(value < threshold):
        rare_cnt = rare_cnt + 1
        rare_freq = rare_freq + value

vocab_size = len(word_to_index) + 1

from tensorflow.keras.preprocessing.sequence import pad_sequences

max_len = 500
text_padded = pad_sequences(text_encoded, maxlen = max_len)
target = df["label"]

###
#데이터 불균형 해소
from imblearn.over_sampling import RandomOverSampler
from collections import Counter

oversample = RandomOverSampler(sampling_strategy='minority')
X_over, y_over = oversample.fit_resample(text_padded, target)

###
#훈련, 테스트 데이터 분류
from sklearn.model_selection import train_test_split

X_train, X_test, y_train, y_test = train_test_split(X_over, y_over, test_size = 0.25, random_state = 42)

###
#rnn 모델
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Embedding
from tensorflow.keras.layers import LSTM
from tensorflow.keras.layers import Dense
from tensorflow.keras.optimizers import Adam

model = Sequential()
feature_num=100
model.add(Embedding(input_dim = vocab_size, output_dim = feature_num, input_length = max_len ))
model.add(LSTM(units=128))
model.add(Dense(units=1,activation="sigmoid"))
model.compile(
    optimizer=Adam(learning_rate=0.001),
    loss="binary_crossentropy",
    metrics=["accuracy"]
)

model.fit(X_train, y_train, epochs=5, batch_size=64, validation_split=0.2)

y_pred=model.predict(X_test)
y_pred=(y_pred>0.5)

from sklearn.metrics import accuracy_score,confusion_matrix

score=accuracy_score(y_test,y_pred)
print("Test Score:{:.2f}%".format(score*100))

model.save('rnn_model.h5')


