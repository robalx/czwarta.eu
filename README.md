# czwarta.eu - monitoring wizyjny (od strony deweloperskiej)

Statyczna witryna wielostronicowa o systemach monitoringu wizyjnego, skierowana do
programistow, integratorow i hobbystow. Czysty HTML/CSS/JS, zero zaleznosci i build-stepu.

## Struktura

```
download/
  index.html         # start, hero, quickstart
  protocols.html     # ONVIF, RTSP/RTP, RTMP/HLS/WebRTC, SIP + rekomendator
  oss.html           # ZoneMinder, Shinobi, Frigate, Motion + porownanie
  architecture.html  # klikalny diagram pipeline'u DIY
  libraries.html     # Python, Node.js, Go, DevOps + builder komendy ffmpeg
  integration.html   # Home Assistant, Node-RED, MQTT, akceleratory AI
  resources.html     # linki + instrukcja deploy
  404.html           # strona bledu
  .nojekyll          # wylacza Jekyll na GitHub Pages (chroni assets/)
  assets/
    style.css        # design-system (light/dark, Inter + JetBrains Mono)
    app.js           # motyw, wyszukiwarka, copy, scrollspy, diagram, builder
```

## Deploy na GitHub Pages

1. Wgraj zawartosc tego folderu do repozytorium (glownie `main`, katalog root lub `/docs`).
2. Repo -> **Settings -> Pages** -> Source: *Deploy from a branch* -> wybierz galaz i katalog.
3. `.nojekyll` jest juz w paczce - katalog `assets/` serwuje sie poprawnie.
4. Custom domain: w polu Custom domain wpisz `czwarta.eu`.
   - Apex: rekordy A na IP GitHub Pages (`185.199.108.153` ... `185.199.111.153`).
   - Subdomena: CNAME na `USER.github.io`.
   - Wlacz "Enforce HTTPS".
5. Po chwili nowa wersja jest na zywos u czwarta.eu.

## Podglad lokalny

```
cd download
python3 -m http.server 8000
# otworz http://localhost:8000
```

## Edycja

- Tresc generuje skrypt `scripts/gen_pages.py` - zmien w nim strone i uruchom ponownie:
  `python3 scripts/gen_pages.py`
- Albo edytuj pliki `.html` bezposrednio.
- Design/interakcje: `assets/style.css` i `assets/app.js`.

## Skroty klawiszowe

- `/` - fokus wyszukiwarki
- `t` - przelaczenie motywu (jasny/ciemny)
- `Esc` - zamknij menu / wyniki wyszukiwania

---

Niekomercyjny projekt edukacyjny. Tresc ma charakter edukacyjny i nie stanowi oferty
w rozumieniu przepisow kodeksu cywilnego.
