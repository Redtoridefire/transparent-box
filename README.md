# Transparent Box

This lightweight demo provides a draggable, translucent prompt window that can float over
video or camera feeds in a browser. Use the sliders to adjust opacity and size, then drag
the prompt overlay wherever you need it.

## Quick start (browser demo)

```bash
python -m http.server 4173
```

Open `http://localhost:4173/index.html` in your browser.

## Quick start (macOS app)

```bash
npm install
npm run start
```

This launches a transparent, always-on-top window. Use the **Frameless Window** toggle to
switch the native title bar on or off.

In the macOS app, the overlay starts in a minimal floating mode (just the prompt box). Click
**Settings** in the footer to reveal the full controls when you need them.

### Build a DMG

```bash
npm run dist
```

The DMG will be created in the `dist/` folder.

## ChatGPT API hookup

1. Add your OpenAI API key in the “OpenAI API Key” field.
2. Type a prompt in the floating box and click **Send to ChatGPT**.

This demo calls the OpenAI API directly from the browser or Electron window, which is convenient for local
testing but not recommended for production. For a real deployment, proxy the request
through your own server to keep API keys private.
