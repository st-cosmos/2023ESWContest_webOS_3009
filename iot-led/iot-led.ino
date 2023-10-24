#include <Arduino.h>
#include <ESP8266WiFi.h>
#include "ArduinoWebsockets.h"
#include "ArduinoJson.h"
#include <Adafruit_NeoPixel.h>

const char* ssid = "Galaxy";
const char* password = "20020829";
const char* serverAddress = "192.168.206.249";
const int serverPort = 3000;
const int ledPin = 5; //led pin
const int NeoPin = 4; //NeoPixel LED pin //D2
const int NUM_LEDS = 1; 


Adafruit_NeoPixel rgbNEO = Adafruit_NeoPixel(NUM_LEDS, NeoPin, NEO_GRB + NEO_KHZ800);

websockets:: WebsocketsClient client;
void onMessage(websockets::WebsocketsMessage message) {
  Serial.println("Received data from server: " + message.data());

  DynamicJsonDocument doc(1024);
  DeserializationError error = deserializeJson(doc, message.data());

  if (error) {
    Serial.println("Error parsing JSON");
    return;
  }

  // JsonObject ledStatus = doc["ledStatus"];
  if (!doc.isNull()) {
    String id = doc["id"];
    int r = doc["r"];
    int g = doc["g"];
    int b = doc["b"];

    // NeoPixel을 설정한 색상으로 켜는 작업
    rgbNEO.fill(rgbNEO.Color(r, g, b));
    rgbNEO.show();
  }
}


void setup() {
  Serial.begin(115200);
  //neopixel
  rgbNEO.begin();
  //rgbNEO.show();
  delay(50);
  Serial.println("NeoPixel start");
  
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.println("Connecting to WiFi…");
    delay(500);
  }
  delay(500);

  Serial.println("Connected to WiFi");
  pinMode(ledPin, OUTPUT);
 

  client.connect(serverAddress, serverPort, "/");
  client.onMessage(onMessage);

  while (!client.available()) {
    delay(1000);
    Serial.println("Connecting to WebSocket server…");
  }
  Serial.println("Connected to WebSocket server");
  
}

void loop() {
  client.poll(); 
  
}
