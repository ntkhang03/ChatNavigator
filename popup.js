// popup.js
document.addEventListener("DOMContentLoaded", function () {
  const prevButton = document.getElementById("prevButton");
  const nextButton = document.getElementById("nextButton");
  const toggleHighlight = document.getElementById("toggleHighlight");
  const messageCountElement = document.getElementById("messageCount");

  // Lấy thông tin từ content script
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(
      tabs[0].id,
      { action: "getStats" },
      function (response) {
        if (response && response.total) {
          messageCountElement.textContent = `${response.current + 1}/${response.total}`;
        }
      }
    );
  });

  // Điều hướng đến tin nhắn trước
  prevButton.addEventListener("click", function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(
        tabs[0].id,
        { action: "previousMessage" },
        function (response) {
          if (response && response.total) {
            messageCountElement.textContent = `${response.current + 1}/${response.total}`;
          }
        }
      );
    });
  });

  // Điều hướng đến tin nhắn kế tiếp
  nextButton.addEventListener("click", function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(
        tabs[0].id,
        { action: "nextMessage" },
        function (response) {
          if (response && response.total) {
            messageCountElement.textContent = `${response.current + 1}/${response.total}`;
          }
        }
      );
    });
  });

  // Bật/tắt highlight tất cả tin nhắn
  toggleHighlight.addEventListener("click", function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { action: "toggleHighlight" });
    });
  });
});
