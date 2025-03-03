// Hàm tạo navigation bar
function createNavigationBar() {
  // Kiểm tra xem navigation bar đã tồn tại chưa
  if (document.getElementById("chat-navigator")) {
    return;
  }

  // Tạo container cho navigation
  const navContainer = document.createElement("div");
  navContainer.id = "chat-navigator";
  navContainer.innerHTML = `
		<div class="chat-nav-container">
				<button id="prevChatBtn" class="chat-nav-button"><img src="${chrome.runtime.getURL("assets/images/up-arrow.svg")}" width=20 alt="Previous" /></button>
				<span id="chatPosition" class="chat-position">0 / 0</span>
				<button id="nextChatBtn" class="chat-nav-button"><img src="${chrome.runtime.getURL("assets/images/down-arrow.svg")}" width=20 alt="Next" /></button>
		</div>
	`;

  document.body.appendChild(navContainer);

  // Thêm event listeners
  document
    .getElementById("prevChatBtn")
    .addEventListener("click", navigate.bind(null, "prev"));
  document
    .getElementById("nextChatBtn")
    .addEventListener("click", navigate.bind(null, "next"));
}

let currentIndex = -1;
let messages = [];
let lastTimeout = null;

function updateMessages() {
  // Mảng chứa các cách để nhận diện tin nhắn người dùng
  const selectors = [
    // Case 1: (Chat GPT) Tin nhắn với h5.sr-only "You said:"
    {
      find: () =>
        Array.from(document.querySelectorAll("h5.sr-only"))
          .filter((h5) => h5.textContent.trim() === "You said:")
          .map((h5) => h5.parentElement)
    },

    // Case 2: (Google AI Studio) Tin nhắn với class="user-prompt-container" data-turn-role="User"
    {
      find: () =>
        Array.from(
          document.querySelectorAll(
            '.user-prompt-container[data-turn-role="User"]'
          )
        ).map((div) => div.parentElement)
    },

    // Case 3: (Gemini) Tin nhắn với id="user-query-content-0" id="user-query-content-1" ,...
    {
      find: () =>
        Array.from(document.querySelectorAll('[id^="user-query-content-"]'))
    },

    // Case 4: (Grok) Tin nhắn với class="message-row items-end"
    {
      find: () =>
        Array.from(document.querySelectorAll(".message-row.items-end"))
          // first child
          .map((div) => div.firstChild)
    },

    // Case 5: (Claude) Tin nhắn với class="bg-gradient-to-b  from-bg-300  from-50%  to-bg-400"
    {
      find: () =>
        Array.from(
          document.querySelectorAll(".bg-gradient-to-b.from-bg-300.to-bg-400")
        )
    },

    // Case 6: (Julius AI) document.querySelector("#\\33 f7c222e-9ea8-486e-8d8a-c3c4c32f1ce7 > div > div.flex.flex-row > div > span")
    {
      find: () =>
        Array.from(
          document.querySelectorAll("div > div.flex.flex-row > div > span")
        )
          .filter((span) => span.textContent.trim() == "You")
          .map(
            (span) =>
              span.parentElement?.parentElement?.parentElement?.parentElement
          )
    }
  ];

  // Tìm tin nhắn từ tất cả các selectors
  messages = [];
  selectors.forEach((selector) => {
    messages = [...messages, ...selector.find()];
  });

  // Sắp xếp tin nhắn theo thứ tự xuất hiện trong DOM
  messages.sort((a, b) => {
    const position = a.compareDocumentPosition(b);
    return position & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
  });

  updatePositionDisplay(messages);
}

function updatePositionDisplay() {
  // kiểm tra nếu hightlight cũ không còn trong DOM thì reset currentIndex
  if (messages.findIndex((msg) => msg.style.border !== "") === -1) {
    currentIndex = -1;
  }

  const positionElement = document.getElementById("chatPosition");
  if (positionElement && messages.length > 0) {
    positionElement.textContent = `${currentIndex + 1} / ${messages.length}`;
  } else if (positionElement) {
    positionElement.textContent = "0 / 0";
  }

  // check if 0/0 then hide the navigation bar
  if (positionElement && messages.length === 0) {
    document.getElementById("chat-navigator").style.display = "none";
  } else {
    document.getElementById("chat-navigator").style.display = "flex";
  }
}

function scrollToMessage(index) {
  if (messages.length === 0) {
    return;
  }

  // Ensure index is valid with circular navigation
  if (index < 0) {
    index = messages.length - 1; // Wrap to the end
  } else if (index >= messages.length) {
    index = 0; // Wrap to the beginning
  }

  messages[index].scrollIntoView({
    behavior: "smooth",
    block: "center" // nearest or center or end
  });

  clearTimeout(lastTimeout);
  currentIndex = index;

  // Clear previous highlights and add new highlight
  messages.forEach((msg) => (msg.style.border = ""));
  messages[currentIndex].style.transition = "border 0.5s ease-in-out";
  messages[currentIndex].style.border = "3px solid #00ff00";
  lastTimeout = setTimeout(() => {
    messages[currentIndex].style.border = "3px solid transparent";
  }, 1500);

  updatePositionDisplay();
}

function navigate(direction) {
  updateMessages();

  if (messages.length === 0) {
    return;
  }

  if (direction === "prev") {
    // Move to previous message or wrap to the end
    scrollToMessage(currentIndex <= 0 ? messages.length - 1 : currentIndex - 1);
  } else if (direction === "next") {
    if (currentIndex === -1 && messages.length > 0) {
      scrollToMessage(0);
    } else {
      // Move to next message or wrap to the beginning
      scrollToMessage(
        currentIndex >= messages.length - 1 ? 0 : currentIndex + 1
      );
    }
  }
}

// Khởi tạo
function init() {
  createNavigationBar();
  updateMessages();

  // Quan sát thay đổi trong DOM
  const observer = new MutationObserver(() => {
    updateMessages();
  });
  observer.observe(document.body, { childList: true, subtree: true });
}

// Chạy khi trang load
if (document.readyState === "complete") {
  init();
} else {
  window.addEventListener("load", init);
}
