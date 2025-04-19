# Smart Notes Chrome Extension

A powerful Chrome extension for taking, managing, and sharing notes directly from your browser.

## Features

- Create and edit notes with titles and content
- Save notes automatically to Chrome storage
- Share notes by copying to clipboard
- Download notes as text files
- Delete unwanted notes
- Modern and clean user interface

## Installation

1. Clone or download this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right corner
4. Click "Load unpacked" and select the directory containing the extension files

## Usage

1. Click the extension icon in your Chrome toolbar to open the notes interface
2. Click "New Note" to create a new note
3. Enter a title and content for your note
4. Use the buttons to:
   - Save: Store your note
   - Share: Copy note to clipboard
   - Download: Save note as a text file
   - Delete: Remove the note

## Storage

Notes are stored in Chrome's sync storage, which means they will be available across all your Chrome instances where you're signed in with the same account.

## Development

The extension is built using:
- HTML5
- CSS3
- JavaScript
- Chrome Extension APIs

## File Structure

```
├── manifest.json
├── popup.html
├── popup.js
├── styles.css
├── icons/
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── README.md
``` 