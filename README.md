# Smart Notes Chrome Extension

A powerful Chrome extension for taking, managing, and sharing notes directly in your browser. Create rich-text notes with formatting, save them automatically, and export them as Markdown files.

## Features

- 📝 **Rich Text Editor**
  - Format text (bold, italic, underline)
  - Create headers and lists
  - Add code blocks and quotes
  - Support for multiple text styles

- 💾 **Automatic Saving**
  - Notes are saved automatically to Chrome storage
  - Persistent across browser sessions
  - No account required

- 📤 **Export Options**
  - Download notes as Markdown (.md) files
  - Share notes via clipboard
  - Preserve formatting in exports

- 📱 **Modern UI/UX**
  - Clean and intuitive interface
  - Responsive design
  - Dark/light theme support
  - Sidebar for quick note navigation

- 🔄 **Note Management**
  - Create unlimited notes
  - Edit existing notes
  - Delete unwanted notes
  - Sort by last modified

## Installation

### From Source
1. Clone this repository:
   ```bash
   git clone https://github.com/thisisassad/SmartNote.git
   ```

2. Open Chrome and navigate to `chrome://extensions/`

3. Enable "Developer mode" in the top right corner

4. Click "Load unpacked" and select the directory containing the extension files

### Dependencies
- The extension uses [Quill.js](https://quilljs.com/) for rich text editing
- No external dependencies required for installation

## Usage

1. Click the extension icon in your Chrome toolbar
2. Click "New Note" to create a note
3. Use the rich text editor to write and format your content
4. Notes are saved automatically
5. Use the toolbar buttons to:
   - Save: Manually save changes
   - Share: Copy note to clipboard
   - Download: Export as Markdown file
   - Delete: Remove the note

## Technical Details

### Storage
- Uses Chrome's `storage.local` API
- Notes are stored as JSON objects
- Automatic syncing between browser windows

### File Structure
```
├── manifest.json        # Extension configuration
├── popup.html          # Main UI
├── popup.js            # UI logic
├── background.js       # Background processes
├── styles.css          # Styling
├── lib/                # Libraries
│   ├── quill.min.js
│   └── quill.snow.css
└── icons/              # Extension icons
```

### Permissions
- `storage`: For saving notes
- `downloads`: For exporting notes

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Quill.js](https://quilljs.com/) for the rich text editor
- Chrome Extension APIs documentation
- All contributors and users of this extension 