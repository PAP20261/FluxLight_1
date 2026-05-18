/*
 * ═══════════════════════════════════════════════════════════════
 *  FluxLight — esp32_code.ino
 *  Firmware para ESP32 DevKit V4
 * ═══════════════════════════════════════════════════════════════
 */

#include <WiFi.h>
#include <WebServer.h>
#include <HTTPClient.h>
#include <Adafruit_NeoPixel.h>

// ═══════════════════════════════════════════════════════════════
// WIFI
// ═══════════════════════════════════════════════════════════════

const char* ssid = "NOS_Internet_32C0";
const char* password = "2LL8NJ77E5E";

// ═══════════════════════════════════════════════════════════════
// LEDS
// ═══════════════════════════════════════════════════════════════

#define LED_PIN 13
#define NUM_LEDS 300

// ═══════════════════════════════════════════════════════════════
// SHELLY
// ═══════════════════════════════════════════════════════════════

String shellyIPs[] = {
  "192.168.1.101",
  "192.168.1.102",
};

const int NUM_SHELLY = 2;

// ═══════════════════════════════════════════════════════════════
// OBJETOS
// ═══════════════════════════════════════════════════════════════

WebServer server(80);

Adafruit_NeoPixel strip(NUM_LEDS, LED_PIN, NEO_GRB + NEO_KHZ800);

// ═══════════════════════════════════════════════════════════════
// ESTADO GLOBAL
// ═══════════════════════════════════════════════════════════════

bool ledOn = false;

uint8_t ledR = 255;
uint8_t ledG = 106;
uint8_t ledB = 0;

uint8_t ledBrightness = 200;

String currentEffect = "";

bool effectRunning = false;

uint32_t effectTimer = 0;
uint8_t effectStep = 0;

// ═══════════════════════════════════════════════════════════════
// SETUP
// ═══════════════════════════════════════════════════════════════

void setup() {

  Serial.begin(115200);

  Serial.println("\n[FluxLight] A iniciar...");

  // LEDs
  strip.begin();
  strip.setBrightness(ledBrightness);
  strip.clear();
  strip.show();

  // WIFI
  WiFi.begin(ssid, password);

  Serial.print("[FluxLight] A ligar ao Wi-Fi");

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("[FluxLight] Wi-Fi ligado!");
  Serial.print("[FluxLight] IP do ESP32: ");
  Serial.println(WiFi.localIP());

  // ROUTES
  setupRoutes();

  // SERVER
  server.begin();

  Serial.println("[FluxLight] Servidor iniciado");

  // BOOT
  bootAnimation();
}

// ═══════════════════════════════════════════════════════════════
// LOOP
// ═══════════════════════════════════════════════════════════════

void loop() {

  server.handleClient();

  if (effectRunning) {
    runEffect();
  }

  delay(1);
}

// ═══════════════════════════════════════════════════════════════
// ROUTES
// ═══════════════════════════════════════════════════════════════

void setupRoutes() {

  // ROOT
  server.on("/", HTTP_GET, []() {

    addCORSHeaders();

    server.send(200, "text/plain", "FluxLight API Online");
  });

  // STATUS
  server.on("/status", HTTP_GET, []() {

    addCORSHeaders();

    String json =
      "{\"status\":\"ok\",\"ledOn\":" +
      String(ledOn ? "true" : "false") +
      ",\"effect\":\"" +
      currentEffect +
      "\"}";

    server.send(200, "application/json", json);
  });

  // LED ON
  server.on("/led/on", HTTP_GET, []() {

    addCORSHeaders();

    ledOn = true;

    effectRunning = false;

    currentEffect = "";

    applyLEDColor();

    server.send(200, "application/json", "{\"led\":\"on\"}");
  });

  // LED OFF
  server.on("/led/off", HTTP_GET, []() {

    addCORSHeaders();

    ledOn = false;

    effectRunning = false;

    currentEffect = "";

    strip.clear();
    strip.show();

    server.send(200, "application/json", "{\"led\":\"off\"}");
  });

  // COLOR
  server.on("/led/color", HTTP_GET, []() {

    addCORSHeaders();

    ledR = server.arg("r").toInt();
    ledG = server.arg("g").toInt();
    ledB = server.arg("b").toInt();

    ledOn = true;

    effectRunning = false;

    currentEffect = "";

    applyLEDColor();

    server.send(200, "application/json", "{\"color\":\"ok\"}");
  });

  // BRIGHTNESS
  server.on("/led/brightness", HTTP_GET, []() {

    addCORSHeaders();

    ledBrightness =
      constrain(server.arg("value").toInt(), 0, 255);

    strip.setBrightness(ledBrightness);

    strip.show();

    server.send(200, "application/json", "{\"brightness\":\"ok\"}");
  });

  // EFFECTS
  server.on("/effect/rainbow", HTTP_GET, []() {

    addCORSHeaders();

    startEffect("rainbow");

    server.send(200, "application/json", "{\"effect\":\"rainbow\"}");
  });

  server.on("/effect/disco", HTTP_GET, []() {

    addCORSHeaders();

    startEffect("disco");

    server.send(200, "application/json", "{\"effect\":\"disco\"}");
  });

  server.on("/effect/fire", HTTP_GET, []() {

    addCORSHeaders();

    startEffect("fire");

    server.send(200, "application/json", "{\"effect\":\"fire\"}");
  });

  server.on("/effect/pulse", HTTP_GET, []() {

    addCORSHeaders();

    startEffect("pulse");

    server.send(200, "application/json", "{\"effect\":\"pulse\"}");
  });

  server.on("/effect/wave", HTTP_GET, []() {

    addCORSHeaders();

    startEffect("wave");

    server.send(200, "application/json", "{\"effect\":\"wave\"}");
  });

  server.on("/effect/fade", HTTP_GET, []() {

    addCORSHeaders();

    startEffect("fade");

    server.send(200, "application/json", "{\"effect\":\"fade\"}");
  });

  // STOP EFFECT
  server.on("/effect/stop", HTTP_GET, []() {

    addCORSHeaders();

    effectRunning = false;

    currentEffect = "";

    strip.clear();

    strip.show();

    server.send(200, "application/json", "{\"effect\":\"stopped\"}");
  });

  // 404
  server.onNotFound([]() {

    addCORSHeaders();

    server.send(404, "application/json", "{\"error\":\"Not found\"}");
  });
}

// ═══════════════════════════════════════════════════════════════
// LED CONTROL
// ═══════════════════════════════════════════════════════════════

void applyLEDColor() {

  uint32_t color = strip.Color(ledR, ledG, ledB);

  for (int i = 0; i < NUM_LEDS; i++) {
    strip.setPixelColor(i, color);
  }

  strip.show();
}

// ═══════════════════════════════════════════════════════════════
// EFFECTS
// ═══════════════════════════════════════════════════════════════

void startEffect(const String& name) {

  currentEffect = name;

  effectRunning = true;

  effectStep = 0;

  effectTimer = 0;

  ledOn = true;
}

void runEffect() {

  uint32_t now = millis();

  if (currentEffect == "rainbow") {

    if (now - effectTimer >= 20) {

      effectTimer = now;

      rainbowFrame();

      effectStep++;
    }

  } else if (currentEffect == "disco") {

    if (now - effectTimer >= 80) {

      effectTimer = now;

      discoFrame();
    }

  } else if (currentEffect == "fire") {

    if (now - effectTimer >= 30) {

      effectTimer = now;

      fireFrame();
    }

  } else if (currentEffect == "pulse") {

    if (now - effectTimer >= 15) {

      effectTimer = now;

      pulseFrame();
    }

  } else if (currentEffect == "wave") {

    if (now - effectTimer >= 25) {

      effectTimer = now;

      waveFrame();

      effectStep++;
    }

  } else if (currentEffect == "fade") {

    if (now - effectTimer >= 20) {

      effectTimer = now;

      fadeFrame();

      effectStep++;
    }
  }
}

// RAINBOW
void rainbowFrame() {

  for (int i = 0; i < NUM_LEDS; i++) {

    uint16_t hue =
      (uint32_t)(i * 65536L / NUM_LEDS +
                 (uint32_t)effectStep * 256) &
      0xFFFF;

    strip.setPixelColor(
      i,
      strip.gamma32(strip.ColorHSV(hue)));
  }

  strip.show();
}

// DISCO
void discoFrame() {

  for (int i = 0; i < NUM_LEDS; i++) {

    strip.setPixelColor(
      i,
      strip.Color(
        random(256),
        random(256),
        random(256)));
  }

  strip.show();
}

// FIRE
void fireFrame() {

  // ✅ CORRIGIDO
  static uint8_t heat[NUM_LEDS];

  for (int i = 0; i < NUM_LEDS; i++) {

    if (heat[i] > 0) {

      heat[i] =
        constrain(
          heat[i] - random(2, 6),
          0,
          255);
    }
  }

  for (int i = NUM_LEDS - 1; i > 1; i--) {

    heat[i] =
      (heat[i - 1] +
       heat[i - 2] +
       heat[i - 2]) /
      3;
  }

  if (random(255) < 120) {

    int pos = random(NUM_LEDS / 4);

    heat[pos] =
      constrain(
        heat[pos] + random(160, 255),
        0,
        255);
  }

  for (int i = 0; i < NUM_LEDS; i++) {

    uint8_t h = heat[i];

    uint8_t r, g, b;

    if (h < 85) {

      r = h * 3;
      g = 0;
      b = 0;

    } else if (h < 170) {

      r = 255;
      g = (h - 85) * 3;
      b = 0;

    } else {

      r = 255;
      g = 255;
      b = (h - 170) * 3;
    }

    strip.setPixelColor(
      i,
      strip.Color(r, g, b));
  }

  strip.show();
}

// PULSE
void pulseFrame() {

  static uint8_t pulseVal = 0;

  static bool pulseUp = true;

  if (pulseUp) {

    pulseVal += 3;

    if (pulseVal >= 252) {
      pulseVal = 252;
      pulseUp = false;
    }

  } else {

    pulseVal -= 3;

    if (pulseVal <= 3) {
      pulseVal = 3;
      pulseUp = true;
    }
  }

  uint32_t color =
    strip.Color(
      (uint8_t)(ledR * pulseVal / 255),
      (uint8_t)(ledG * pulseVal / 255),
      (uint8_t)(ledB * pulseVal / 255));

  for (int i = 0; i < NUM_LEDS; i++) {
    strip.setPixelColor(i, color);
  }

  strip.show();
}

// WAVE
void waveFrame() {

  for (int i = 0; i < NUM_LEDS; i++) {

    float angle =
      (i + effectStep) * 0.15f;

    uint8_t brightness =
      (uint8_t)(
        (sin(angle) * 0.5f + 0.5f) *
        255);

    strip.setPixelColor(
      i,
      strip.Color(
        (uint8_t)(ledR * brightness / 255),
        (uint8_t)(ledG * brightness / 255),
        (uint8_t)(ledB * brightness / 255)));
  }

  strip.show();
}

// FADE
void fadeFrame() {

  uint16_t hue =
    (uint32_t)effectStep * 180;

  uint32_t color =
    strip.gamma32(
      strip.ColorHSV(
        hue,
        255,
        ledBrightness));

  for (int i = 0; i < NUM_LEDS; i++) {

    strip.setPixelColor(i, color);
  }

  strip.show();
}

// ═══════════════════════════════════════════════════════════════
// UTILS
// ═══════════════════════════════════════════════════════════════

void addCORSHeaders() {

  server.sendHeader(
    "Access-Control-Allow-Origin",
    "*");

  server.sendHeader(
    "Access-Control-Allow-Methods",
    "GET, OPTIONS");

  server.sendHeader(
    "Access-Control-Allow-Headers",
    "Content-Type");
}

void bootAnimation() {

  for (int i = 0; i < NUM_LEDS; i++) {

    strip.setPixelColor(
      i,
      strip.Color(255, 106, 0));
  }

  strip.show();

  delay(400);

  for (int b = 255; b >= 0; b -= 5) {

    strip.setBrightness(b);

    strip.show();

    delay(5);
  }

  strip.clear();

  strip.show();

  strip.setBrightness(ledBrightness);
}
