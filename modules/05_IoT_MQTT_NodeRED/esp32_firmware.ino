/*
  ==============================================================================
  ESP32 ARDUINO FIRMWARE: IOT HARDWARE INTEGRATION
  เกณฑ์ข้อ 3.3:
  - Hardware Pub ค่า payload (JSON) ไปยัง Topic ที่กำหนด
  - Hardware Sub ค่าเพื่อตอบสนองคำสั่งเปิด/ปิดจาก Server (เช่น สั่ง Relay/LED)
  ==============================================================================
*/

#include <WiFi.h>
#include <PubSubClient.h>
#include <Wire.h>
#include <Adafruit_Sensor.h>
#include <Adafruit_BME280.h> // หรือ Adafruit_BMP280

// 1. WiFi Credentials
const char* ssid = "DevOps_Competition_WiFi";
const char* password = "Password123!";

// 2. MQTT Broker Settings
const char* mqtt_server = "192.168.10.10";
const int mqtt_port = 1883;
const char* mqtt_user = "esp32_device";
const char* mqtt_pass = "IoTSecret123!";

// Topics
const char* topic_publish = "sensors/competition/bme280";
const char* topic_subscribe = "actuators/competition/relay";

WiFiClient espClient;
PubSubClient client(espClient);
Adafruit_BME280 bme; // I2C (SDA=21, SCL=22)

#define LED_PIN 2 // Built-in LED / Relay Pin

// Callback เมื่อได้รับคำสั่ง Subscribe จาก Server
void callback(char* topic, byte* message, unsigned int length) {
  String messageTemp;
  for (int i = 0; i < length; i++) {
    messageTemp += (char)message[i];
  }
  Serial.print("📥 [MQTT IN] Message arrived on topic: ");
  Serial.print(topic);
  Serial.print(". Message: ");
  Serial.println(messageTemp);

  // ควบคุม Relay / LED ตามคำสั่ง
  if (String(topic) == topic_subscribe) {
    if (messageTemp == "ON" || messageTemp == "1") {
      digitalWrite(LED_PIN, HIGH);
      Serial.println("💡 Relay / LED state: ON");
      // ตอบกลับสถานะยืนยันกลับไปยัง Server
      client.publish("actuators/competition/status", "{\"relay\": \"ON\"}");
    } else if (messageTemp == "OFF" || messageTemp == "0") {
      digitalWrite(LED_PIN, LOW);
      Serial.println("💡 Relay / LED state: OFF");
      client.publish("actuators/competition/status", "{\"relay\": \"OFF\"}");
    }
  }
}

void reconnect() {
  while (!client.connected()) {
    Serial.print("⏳ Attempting MQTT connection...");
    String clientId = "ESP32Client-" + String(random(0xffff), HEX);
    if (client.connect(clientId.c_str(), mqtt_user, mqtt_pass)) {
      Serial.println(" Connected to MQTT Broker!");
      // Subscribe รับคำสั่งจาก Server
      client.subscribe(topic_subscribe);
    } else {
      Serial.print(" Failed, rc=");
      Serial.print(client.state());
      Serial.println(" Retrying in 3 seconds...");
      delay(3000);
    }
  }
}

void setup() {
  Serial.begin(115200);
  pinMode(LED_PIN, OUTPUT);
  digitalWrite(LED_PIN, LOW);

  // เชื่อมต่อ WiFi
  Serial.print("Connecting to WiFi: ");
  Serial.println(ssid);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi connected! IP address: ");
  Serial.println(WiFi.localIP());

  // เริ่มต้นเซนเซอร์ BME280
  if (!bme.begin(0x76)) {
    Serial.println("⚠️ Could not find BME280 sensor, check wiring! (Simulation values will be used)");
  }

  // ตั้งค่า MQTT
  client.setServer(mqtt_server, mqtt_port);
  client.setCallback(callback);
}

unsigned long lastMsg = 0;

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();

  unsigned long now = millis();
  // ส่งข้อมูลเซนเซอร์ทุกๆ 5 วินาที
  if (now - lastMsg > 5000) {
    lastMsg = now;

    float temp = bme.readTemperature();
    float hum = bme.readHumidity();
    float pres = bme.readPressure() / 100.0F;

    // ถ้าเซนเซอร์ไม่ต่อ ให้ใช้ค่าจำลองเพื่อไม่ให้ระบบสะดุด
    if (isnan(temp)) temp = 28.5 + (random(-10, 10) / 10.0);
    if (isnan(hum)) hum = 65.0 + (random(-20, 20) / 10.0);
    if (isnan(pres)) pres = 1013.25;

    // เตรียม JSON Payload
    char payload[150];
    snprintf(payload, sizeof(payload), 
      "{\"device_id\":\"ESP32_01\",\"temperature\":%.2f,\"humidity\":%.2f,\"pressure\":%.2f,\"timestamp\":%lu}",
      temp, hum, pres, now);

    Serial.print("📤 [MQTT OUT] Publishing payload: ");
    Serial.println(payload);
    client.publish(topic_publish, payload);
  }
}
