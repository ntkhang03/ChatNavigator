# 🚀 Chat Navigator

Chat Navigator is a browser extension that allows you to easily navigate between chat messages across multiple platforms. It provides a simple navigation bar to quickly move to your previous or next message without having to scroll through the entire conversation.

## ✨ Features

- Navigate between chat messages using a navigation bar
- Supports multiple chat platforms
- Highlights the current message

## 🛠️ Installation

1. Clone the repository or download the ZIP file.
2. Open your browser and go to the extensions page.
3. Enable "Developer mode".
4. Click on "Load unpacked" and select the extension folder.

## 📸 Screenshots

![Screenshot 1](/Screenshots/Screenshot1.jpeg)

## 📚 Usage

1. Open a chat platform supported by the extension.
2. Use the navigation bar to move between messages.

## 🔧 Adding Selectors

To add support for a new chat platform, you need to add the appropriate selectors in the `content.js` file. Follow these steps:

1. Open the `content.js` file.
2. Locate the section where selectors are defined.
3. Add a new entry for the chat platform with the correct selectors for messages and navigation.

Example:

```javascript
const selectors = [
  // ... existing selectors
  {
    find: () =>
      Array.from(document.querySelectorAll("h5.sr-only"))
        .filter((h5) => h5.textContent.trim() === "You said:")
        .map((h5) => h5.parentElement)
  }
];
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Grok](https://grok.com/) for the inspiration and initial code.
- [ChatGPT](https://chat.openai.com/) for the assistance in development.
- [Github Copilot](https://github.com/features/copilot) for the code suggestions.
