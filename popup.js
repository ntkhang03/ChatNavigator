document.addEventListener("DOMContentLoaded", () => {
  // popup.js
  const toggleExtension = document.getElementById("toggleExtension");
  const toggleExtensionContent = document.getElementById(
    "toggleExtensionContent"
  );

  // style click cho toggleExtensionContent
  toggleExtensionContent.addEventListener("click", function () {
    toggleExtension.click();
  });

  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const currentDomain = tabs[0].url;
    const url = new URL(currentDomain);
    const domain = url.hostname;

    chrome.storage.local.get([domain], function (result) {
      try {
        toggleExtension.checked = result[domain] === false ? false : true;
      } catch {}
    });
  });

  // Lắng nghe sự kiện click vào checkbox
  toggleExtension.addEventListener("click", function () {
    const isChecked = toggleExtension.checked;
    chrome.tabs.query(
      { active: true, currentWindow: true },
      async function (tabs) {
        const currentDomain = tabs[0].url;
        const url = new URL(currentDomain);
        try {
          chrome.storage.local.set({
            [url.hostname]: isChecked === true
          });

          // send message to content script
          await chrome.tabs.sendMessage(tabs[0].id, {
            action: "toggleChatNavigator",
            enabled: isChecked
          });
        } catch {}
      }
    );
  });
});
