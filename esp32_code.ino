/*
 * FluxLight v2.0 FINAL — esp32_code.ino
 * ESP32 DevKit V4 · WS2812B 300 LEDs · 5x Shelly RGBW
 */

#include <WiFi.h>
#include <WebServer.h>
#include <HTTPClient.h>
#include <Adafruit_NeoPixel.h>

// ═══ CONFIGURAÇÃO — ALTERAR AQUI ═══════════════════════════════

const char* ssid     = "NOS_Internet_32C0";       // ← Wi-Fi SSID
const char* password = "2LL8NJ77E5E";   // ← Wi-Fi Password

#define LED_PIN   13    // ← GPIO do DATA da fita
#define NUM_LEDS  300   // ← Número de LEDs

String shellyIPs[] = {
  "192.168.1.101",   // ← Lâmpada 1
  "192.168.1.102",   // ← Lâmpada 2
  "192.168.1.103",   // ← Lâmpada 3
  "192.168.1.104",   // ← Lâmpada 4
  "192.168.1.105",   // ← Lâmpada 5
};
const int NUM_SHELLY = 5;

// IP Fixo (descomentar para usar)
// IPAddress local_IP(192, 168, 1, 115);
// IPAddress gateway(192, 168, 1, 1);
// IPAddress subnet(255, 255, 255, 0);
// IPAddress dns(8, 8, 8, 8);

// ═══════════════════════════════════════════════════════════════

WebServer server(80);
Adafruit_NeoPixel strip(NUM_LEDS, LED_PIN, NEO_GRB + NEO_KHZ800);

bool     ledOn         = false;
uint8_t  ledR=255, ledG=106, ledB=0;
uint8_t  ledBrightness = 200;
String   currentEffect = "";
bool     effectRunning = false;
uint32_t effectTimer   = 0;
uint16_t effectStep    = 0;

uint8_t  heat[300]; // fire heat array (tamanho maximo)
uint32_t flagColor1=0, flagColor2=0, flagColor3=0;

// ── SETUP ──────────────────────────────────────────────────────
void setup() {
  Serial.begin(115200);
  Serial.println("\n[FluxLight] v2.0 a iniciar...");

  strip.begin();
  strip.setBrightness(ledBrightness);
  strip.clear(); strip.show();
  memset(heat, 0, sizeof(heat));

  // WiFi.config(local_IP, gateway, subnet, dns); // descomenta para IP fixo
  WiFi.begin(ssid, password);
  Serial.print("[WiFi] A ligar");
  int att=0;
  while(WiFi.status()!=WL_CONNECTED && att<40){ delay(500); Serial.print("."); att++; }

  if(WiFi.status()==WL_CONNECTED){
    Serial.println("\n[WiFi] Ligado! IP: " + WiFi.localIP().toString());
    Serial.println("  >> Copiar IP para script.js: ESP32_IP");
  } else {
    Serial.println("\n[WiFi] FALHA! Verificar SSID/password.");
  }

  setupRoutes();
  server.begin();
  Serial.println("[HTTP] Servidor na porta 80. Pronto!");
  bootAnimation();
}

// ── LOOP ───────────────────────────────────────────────────────
void loop() {
  server.handleClient();
  if(effectRunning) runEffect();
}

// ── CORS ───────────────────────────────────────────────────────
void addCORS() {
  server.sendHeader("Access-Control-Allow-Origin","*");
  server.sendHeader("Access-Control-Allow-Methods","GET,OPTIONS");
  server.sendHeader("Access-Control-Allow-Headers","Content-Type");
}

// ── COR SÓLIDA ─────────────────────────────────────────────────
void applyLEDColor() {
  uint32_t c = strip.Color(ledR,ledG,ledB);
  for(int i=0;i<NUM_LEDS;i++) strip.setPixelColor(i,c);
  strip.show();
}

// ── EFEITO START/STOP ──────────────────────────────────────────
void startEffect(const String& name) {
  currentEffect=name; effectRunning=true;
  effectStep=0; effectTimer=0; ledOn=true;
  if(name=="fire") memset(heat,0,NUM_LEDS);
  Serial.println("[Efeito] " + name);
}

void stopEffectNow() {
  effectRunning=false; currentEffect=""; effectStep=0;
}

// ── RUN EFFECT ─────────────────────────────────────────────────
void runEffect() {
  uint32_t now=millis();
  if      (currentEffect=="rainbow"){ if(now-effectTimer>=18){effectTimer=now;rainbowFrame();effectStep++;}}
  else if (currentEffect=="disco")  { if(now-effectTimer>=70){effectTimer=now;discoFrame();}}
  else if (currentEffect=="fire")   { if(now-effectTimer>=25){effectTimer=now;fireFrame();}}
  else if (currentEffect=="pulse")  { if(now-effectTimer>=12){effectTimer=now;pulseFrame();}}
  else if (currentEffect=="wave")   { if(now-effectTimer>=20){effectTimer=now;waveFrame();effectStep++;}}
  else if (currentEffect=="fade")   { if(now-effectTimer>=18){effectTimer=now;fadeFrame();effectStep++;}}
  else if (currentEffect=="sparkle"){ if(now-effectTimer>=40){effectTimer=now;sparkleFrame();}}
  else if (currentEffect=="meteor") { if(now-effectTimer>=22){effectTimer=now;meteorFrame();effectStep++;}}
  else if (currentEffect=="flag")   { if(now-effectTimer>=20){effectTimer=now;flagFrame();effectStep++;}}
}

// ── RAINBOW ────────────────────────────────────────────────────
void rainbowFrame() {
  for(int i=0;i<NUM_LEDS;i++){
    uint16_t hue=((uint32_t)i*65536L/NUM_LEDS+(uint32_t)effectStep*256)&0xFFFF;
    strip.setPixelColor(i,strip.gamma32(strip.ColorHSV(hue)));
  }
  strip.show();
}

// ── DISCO ──────────────────────────────────────────────────────
void discoFrame() {
  for(int i=0;i<NUM_LEDS;i++) strip.setPixelColor(i,strip.Color(random(256),random(256),random(256)));
  strip.show();
}

// ── FIRE v2 — completamente refeito ───────────────────────────
void fireFrame() {
  // 1. Arrefecer
  for(int i=0;i<NUM_LEDS;i++){
    int cooling=random(2,8);
    heat[i]=(heat[i]>cooling)?(heat[i]-cooling):0;
  }
  // 2. Propagar calor
  for(int i=NUM_LEDS-1;i>=2;i--){
    heat[i]=((uint16_t)heat[i-1]+heat[i-2]+heat[i-2])/3;
  }
  // 3. Ignições múltiplas
  if(random(255)<200){ int p=random(NUM_LEDS/5);  heat[p]=(uint8_t)min(255,(int)heat[p]+random(160,255)); }
  if(random(255)<60) { int p=random(NUM_LEDS/4);  heat[p]=(uint8_t)min(255,(int)heat[p]+random(80,160)); }
  if(random(255)<15) { int p=random(NUM_LEDS/4,NUM_LEDS/2); heat[p]=(uint8_t)min(255,(int)heat[p]+random(40,100)); }

  // 4. Mapear calor → cor (5 etapas)
  for(int i=0;i<NUM_LEDS;i++){
    uint8_t h=heat[i],r,g,b;
    if(h==0)       { r=0;   g=0;   b=0; }
    else if(h<51)  { r=map(h,0,50,10,140); g=0;  b=0; }
    else if(h<101) { r=map(h,51,100,140,255);  g=map(h,51,100,0,20);   b=0; }
    else if(h<151) { r=255; g=map(h,101,150,20,130);  b=0; }
    else if(h<201) { r=255; g=map(h,151,200,130,220); b=map(h,151,200,0,20); }
    else           { r=255; g=map(h,201,255,220,255); b=map(h,201,255,20,80); }
    // Flickering subtil
    if(random(100)<8){ r=(uint8_t)(r*0.7); g=(uint8_t)(g*0.7); }
    strip.setPixelColor(i,strip.Color(r,g,b));
  }
  strip.show();
}

// ── PULSE ──────────────────────────────────────────────────────
void pulseFrame() {
  static uint8_t pv=0; static bool pu=true;
  if(pu){pv+=4;if(pv>=252){pv=252;pu=false;}}
  else  {pv-=4;if(pv<=3)  {pv=3;  pu=true; }}
  uint32_t c=strip.Color(ledR*pv/255,ledG*pv/255,ledB*pv/255);
  for(int i=0;i<NUM_LEDS;i++) strip.setPixelColor(i,c);
  strip.show();
}

// ── WAVE ───────────────────────────────────────────────────────
void waveFrame() {
  for(int i=0;i<NUM_LEDS;i++){
    float a=(i+effectStep)*0.14f;
    uint8_t bri=(uint8_t)((sinf(a)*0.5f+0.5f)*255);
    strip.setPixelColor(i,strip.Color(ledR*bri/255,ledG*bri/255,ledB*bri/255));
  }
  strip.show();
}

// ── FADE ───────────────────────────────────────────────────────
void fadeFrame() {
  uint16_t hue=(uint32_t)effectStep*160;
  uint32_t c=strip.gamma32(strip.ColorHSV(hue,255,ledBrightness));
  for(int i=0;i<NUM_LEDS;i++) strip.setPixelColor(i,c);
  strip.show();
}

// ── SPARKLE (NOVO) ─────────────────────────────────────────────
void sparkleFrame() {
  // Escurecer gradualmente
  for(int i=0;i<NUM_LEDS;i++){
    uint32_t c=strip.getPixelColor(i);
    uint8_t r=(c>>16)&0xFF, g=(c>>8)&0xFF, b=c&0xFF;
    r=r>30?r-30:0; g=g>30?g-30:0; b=b>20?b-20:0;
    strip.setPixelColor(i,strip.Color(r,g,b));
  }
  // Novas faíscas
  for(int s=0;s<random(3,10);s++){
    int p=random(NUM_LEDS);
    uint8_t t=random(3);
    if(t==0)      strip.setPixelColor(p,strip.Color(255,255,255));
    else if(t==1) strip.setPixelColor(p,strip.Color(255,220,50));
    else          strip.setPixelColor(p,strip.Color(255,100,0));
  }
  strip.show();
}

// ── METEOR (NOVO) ──────────────────────────────────────────────
void meteorFrame() {
  const int MS=12, TL=40, DC=60;
  // Escurecer rastro
  for(int i=0;i<NUM_LEDS;i++){
    uint32_t c=strip.getPixelColor(i);
    uint8_t r=(c>>16)&0xFF,g=(c>>8)&0xFF,b=c&0xFF;
    r=r>DC?r-DC:0; g=g>DC?g-DC:0; b=b>DC?b-DC:0;
    strip.setPixelColor(i,strip.Color(r,g,b));
  }
  // Posição (vai e volta)
  int total=NUM_LEDS+TL;
  int pos=effectStep%(total*2);
  if(pos>=total) pos=total*2-pos;
  // Desenhar meteoro
  for(int j=0;j<MS;j++){
    int idx=pos-j;
    if(idx>=0&&idx<NUM_LEDS){
      float intensity=(float)(MS-j)/MS;
      strip.setPixelColor(idx,strip.Color((uint8_t)(255*intensity),(uint8_t)(200*intensity),(uint8_t)(80*intensity)));
    }
  }
  if(pos>=0&&pos<NUM_LEDS) strip.setPixelColor(pos,strip.Color(255,255,220));
  strip.show();
}

// ── FLAG WAVE ──────────────────────────────────────────────────
void flagFrame() {
  uint8_t r1=(flagColor1>>16)&0xFF,g1=(flagColor1>>8)&0xFF,b1=flagColor1&0xFF;
  uint8_t r2=(flagColor2>>16)&0xFF,g2=(flagColor2>>8)&0xFF,b2=flagColor2&0xFF;
  uint8_t r3=(flagColor3>>16)&0xFF,g3=(flagColor3>>8)&0xFF,b3=flagColor3&0xFF;
  int seg=NUM_LEDS/3;
  for(int i=0;i<NUM_LEDS;i++){
    float wave=sinf((float)(i+effectStep)*0.12f)*0.5f+0.5f;
    uint8_t r,g,b;
    int sec=i/seg;
    if(sec==0){
      r=(uint8_t)(r1+(r2-r1)*wave*0.3f);
      g=(uint8_t)(g1+(g2-g1)*wave*0.3f);
      b=(uint8_t)(b1+(b2-b1)*wave*0.3f);
    } else if(sec==1){
      r=(uint8_t)(r2*(0.7f+wave*0.3f));
      g=(uint8_t)(g2*(0.7f+wave*0.3f));
      b=(uint8_t)(b2*(0.7f+wave*0.3f));
    } else {
      r=(uint8_t)(r3+(r2-r3)*wave*0.3f);
      g=(uint8_t)(g3+(g2-g3)*wave*0.3f);
      b=(uint8_t)(b3+(b2-b3)*wave*0.3f);
    }
    strip.setPixelColor(i,strip.Color(r,g,b));
  }
  strip.show();
}

// ── SHELLY ─────────────────────────────────────────────────────
void shellyRequest(int idx,const String& action){
  if(idx>=NUM_SHELLY) return;
  HTTPClient h; h.begin("http://"+shellyIPs[idx]+"/light/0?turn="+action); h.setTimeout(2500);
  Serial.printf("[Shelly%d] %s → %d\n",idx+1,action.c_str(),h.GET()); h.end();
}

void shellySetColor(int idx,int r,int g,int b){
  if(idx>=NUM_SHELLY) return;
  HTTPClient h;
  h.begin("http://"+shellyIPs[idx]+"/light/0?red="+r+"&green="+g+"&blue="+b+"&white=0&gain=100&turn=on");
  h.setTimeout(2500); h.GET(); h.end();
}

void shellySetBrightness(int idx,int bri){
  if(idx>=NUM_SHELLY) return;
  HTTPClient h;
  h.begin("http://"+shellyIPs[idx]+"/light/0?gain="+constrain(bri,0,100));
  h.setTimeout(2500); h.GET(); h.end();
}

// ── BOOT ANIMATION ─────────────────────────────────────────────
void bootAnimation(){
  for(int i=0;i<NUM_LEDS;i++){
    strip.setPixelColor(i,strip.Color(255,106,0));
    if(i>0) strip.setPixelColor(i-1,strip.Color(180,60,0));
    if(i>1) strip.setPixelColor(i-2,strip.Color(80,20,0));
    strip.show(); delay(3);
  }
  for(int i=0;i<NUM_LEDS;i++) strip.setPixelColor(i,strip.Color(255,200,50));
  strip.show(); delay(200);
  for(int b=255;b>=0;b-=8){ strip.setBrightness(b); strip.show(); delay(6); }
  strip.clear(); strip.show(); strip.setBrightness(ledBrightness);
  Serial.println("[Boot] Completo!");
}

// ── ROUTES ─────────────────────────────────────────────────────
void setupRoutes(){
  server.on("/status",HTTP_GET,[](){
    addCORS();
    server.send(200,"application/json","{\"status\":\"ok\",\"ledOn\":"+String(ledOn?"true":"false")+",\"effect\":\""+currentEffect+"\"}");
  });
  server.on("/led/on",HTTP_GET,[](){addCORS();ledOn=true;stopEffectNow();applyLEDColor();server.send(200,"application/json","{\"led\":\"on\"}");});
  server.on("/led/off",HTTP_GET,[](){addCORS();ledOn=false;stopEffectNow();strip.clear();strip.show();server.send(200,"application/json","{\"led\":\"off\"}");});
  server.on("/led/color",HTTP_GET,[](){
    addCORS();
    ledR=(uint8_t)constrain(server.arg("r").toInt(),0,255);
    ledG=(uint8_t)constrain(server.arg("g").toInt(),0,255);
    ledB=(uint8_t)constrain(server.arg("b").toInt(),0,255);
    ledOn=true;stopEffectNow();applyLEDColor();server.send(200,"application/json","{\"color\":\"set\"}");
  });
  server.on("/led/brightness",HTTP_GET,[](){
    addCORS();
    ledBrightness=(uint8_t)constrain(server.arg("value").toInt(),0,255);
    strip.setBrightness(ledBrightness);
    if(ledOn&&!effectRunning) applyLEDColor(); else if(effectRunning) strip.show();
    server.send(200,"application/json","{\"brightness\":"+String(ledBrightness)+"}");
  });
  server.on("/effect/rainbow",HTTP_GET,[](){addCORS();startEffect("rainbow");server.send(200,"application/json","{\"effect\":\"rainbow\"}");});
  server.on("/effect/disco",  HTTP_GET,[](){addCORS();startEffect("disco");  server.send(200,"application/json","{\"effect\":\"disco\"}");});
  server.on("/effect/fire",   HTTP_GET,[](){addCORS();startEffect("fire");   server.send(200,"application/json","{\"effect\":\"fire\"}");});
  server.on("/effect/pulse",  HTTP_GET,[](){addCORS();startEffect("pulse");  server.send(200,"application/json","{\"effect\":\"pulse\"}");});
  server.on("/effect/wave",   HTTP_GET,[](){addCORS();startEffect("wave");   server.send(200,"application/json","{\"effect\":\"wave\"}");});
  server.on("/effect/fade",   HTTP_GET,[](){addCORS();startEffect("fade");   server.send(200,"application/json","{\"effect\":\"fade\"}");});
  server.on("/effect/sparkle",HTTP_GET,[](){addCORS();startEffect("sparkle");server.send(200,"application/json","{\"effect\":\"sparkle\"}");});
  server.on("/effect/meteor", HTTP_GET,[](){addCORS();startEffect("meteor"); server.send(200,"application/json","{\"effect\":\"meteor\"}");});
  server.on("/effect/stop",HTTP_GET,[](){
    addCORS();stopEffectNow();
    if(ledOn)applyLEDColor();else{strip.clear();strip.show();}
    server.send(200,"application/json","{\"effect\":\"stopped\"}");
  });
  // Bandeiras
  server.on("/flag/pt",HTTP_GET,[](){addCORS();flagColor1=0x006600;flagColor2=0xFFCC00;flagColor3=0xCC0000;startEffect("flag");server.send(200,"application/json","{\"flag\":\"pt\"}");});
  server.on("/flag/br",HTTP_GET,[](){addCORS();flagColor1=0x009C3B;flagColor2=0xFFDF00;flagColor3=0x002776;startEffect("flag");server.send(200,"application/json","{\"flag\":\"br\"}");});
  server.on("/flag/es",HTTP_GET,[](){addCORS();flagColor1=0xC60B1E;flagColor2=0xFFC400;flagColor3=0xC60B1E;startEffect("flag");server.send(200,"application/json","{\"flag\":\"es\"}");});
  server.on("/flag/fr",HTTP_GET,[](){addCORS();flagColor1=0x002395;flagColor2=0xFFFFFF;flagColor3=0xED2939;startEffect("flag");server.send(200,"application/json","{\"flag\":\"fr\"}");});
  server.on("/flag/de",HTTP_GET,[](){addCORS();flagColor1=0x000000;flagColor2=0xDD0000;flagColor3=0xFFCE00;startEffect("flag");server.send(200,"application/json","{\"flag\":\"de\"}");});
  server.on("/flag/it",HTTP_GET,[](){addCORS();flagColor1=0x009246;flagColor2=0xFFFFFF;flagColor3=0xCE2B37;startEffect("flag");server.send(200,"application/json","{\"flag\":\"it\"}");});
  server.on("/flag/gb",HTTP_GET,[](){addCORS();flagColor1=0x012169;flagColor2=0xFFFFFF;flagColor3=0xC8102E;startEffect("flag");server.send(200,"application/json","{\"flag\":\"gb\"}");});
  server.on("/flag/us",HTTP_GET,[](){addCORS();flagColor1=0xB22234;flagColor2=0xFFFFFF;flagColor3=0x3C3B6E;startEffect("flag");server.send(200,"application/json","{\"flag\":\"us\"}");});
  server.on("/flag/jp",HTTP_GET,[](){addCORS();flagColor1=0xFFFFFF;flagColor2=0xBC002D;flagColor3=0xFFFFFF;startEffect("flag");server.send(200,"application/json","{\"flag\":\"jp\"}");});
  server.on("/flag/stop",HTTP_GET,[](){
    addCORS();stopEffectNow();
    if(ledOn)applyLEDColor();else{strip.clear();strip.show();}
    server.send(200,"application/json","{\"flag\":\"stopped\"}");
  });
  // Shelly global
  server.on("/shelly/on", HTTP_GET,[](){addCORS();for(int i=0;i<NUM_SHELLY;i++)shellyRequest(i,"on"); server.send(200,"application/json","{\"shelly\":\"all_on\"}");});
  server.on("/shelly/off",HTTP_GET,[](){addCORS();for(int i=0;i<NUM_SHELLY;i++)shellyRequest(i,"off");server.send(200,"application/json","{\"shelly\":\"all_off\"}");});
  // Shelly individual
  for(int i=0;i<NUM_SHELLY;i++){
    int idx=i;
    server.on(("/shelly/"+String(idx)+"/on").c_str(), HTTP_GET,[idx](){addCORS();shellyRequest(idx,"on"); server.send(200,"application/json","{}");});
    server.on(("/shelly/"+String(idx)+"/off").c_str(),HTTP_GET,[idx](){addCORS();shellyRequest(idx,"off");server.send(200,"application/json","{}");});
    server.on(("/shelly/"+String(idx)+"/color").c_str(),HTTP_GET,[idx](){
      addCORS();
      shellySetColor(idx,constrain(server.arg("r").toInt(),0,255),constrain(server.arg("g").toInt(),0,255),constrain(server.arg("b").toInt(),0,255));
      server.send(200,"application/json","{}");
    });
    server.on(("/shelly/"+String(idx)+"/brightness").c_str(),HTTP_GET,[idx](){
      addCORS();shellySetBrightness(idx,server.arg("value").toInt());server.send(200,"application/json","{}");
    });
  }
  server.onNotFound([](){addCORS();server.send(404,"application/json","{\"error\":\"Not found\"}");});
}
