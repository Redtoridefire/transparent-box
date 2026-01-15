# Transparent Box

This lightweight demo provides a draggable, translucent prompt window that can float over
video or camera feeds in a browser. Use the sliders to adjust opacity and size, then drag
the prompt overlay wherever you need it.

## Quick start

```bash
python -m http.server 4173
```

Open `http://localhost:4173/index.html` in your browser.

## ChatGPT API hookup

1. Add your OpenAI API key in the “OpenAI API Key” field.
2. Type a prompt in the floating box and click **Send to ChatGPT**.

This demo calls the OpenAI API directly from the browser, which is convenient for local
testing but not recommended for production. For a real deployment, proxy the request
through your own server to keep API keys private.
