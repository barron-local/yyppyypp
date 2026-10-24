// ==============================================================================
// ARDUINO C/C++ (ESP32): iot/esp32_mqtt.ino
// เกณฑ์ข้อ 3.2.6 & 3.4.1.4: "เขียนโปรแกรม Arduino ส่งค่าเซนเซอร์ไปยัง MQTT Broker"
// ==============================================================================

#include <WiFi.h>
#include <PubSubClient.h>

// 1. ตั้งค่าเครือข่าย WiFi
const char* ssid = "Competition_IoT_WiFi";
const char* password = "Password123!";

// 2. ตั้งค่า MQTT Broker (Docker mosquitto / emqx บน 192.168.10.10:1883)
const char* mqtt_server = "192.168.10.10";
const int mqtt_port = 1883;
const char* mqtt_client_id = "ESP32_Sensor_Node_01";
const char* mqtt_topic = "competition/telemetry";

WiFiClient espClient;
PubSubClient client(espClient);

unsigned long lastMsg = 0;

void setup_wifi() {
  delay(10);
  Serial.print("Connecting to WiFi: ");
  Serial.println(ssid);
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi connected! IP Address: ");
  Serial.println(WiFi.localIP());
}

void reconnect() {
  while (!client.connected()) {
    Serial.print("Connecting to MQTT Broker...");
    if (client.connect(mqtt_client_id)) {
      Serial.println(" connected successfully!");
    } else {
      Serial.print(" failed, rc=");
      Serial.print(client.state());
      Serial.println(" retrying in 5 seconds...");
      delay(5000);
    }
  }
}

void setup() {
  Serial.begin(115200);
  setup_wifi();
  client.setServer(mqtt_server, mqtt_port);
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();

  // ส่งค่าเซนเซอร์ทุก 5 วินาที
  unsigned long now = millis();
  if (now - lastMsg > 5000) {
    lastMsg = now;

    // จำลองอ่านค่า Sensor BME280 / BMP280 ตามเกณฑ์ข้อ 3.4.1.4
    float temperature = 28.5 + (random(-10, 10) / 10.0);
    float humidity = 65.0 + (random(-20, 20) / 10.0);
    float pressure = 1013.25 + (random(-15, 15) / 10.0);

    // ประกอบ JSON Payload ตามมาตรฐาน
    char payload[256];
    snprintf(payload, sizeof(payload),
      "{\"device_id\":\"ESP32_01\",\"temperature\":%.2f,\"humidity\":%.2f,\"pressure\":%.2f,\"status\":\"OK\"}",
      temperature, humidity, pressure
    );

    Serial.print("Publishing to MQTT [");
    Serial.print(mqtt_topic);
    Serial.print("]: ");
    Serial.println(payload);

    client.publish(mqtt_topic, payload);
  }
}