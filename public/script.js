const form = document.getElementById("chat-form");
const input = document.getElementById("message");
const messages = document.getElementById("messages");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const message = input.value.trim();
  if (!message) return;

  const welcome = messages.querySelector(".welcome");
  if (welcome) welcome.remove();

  addMessage("أنت: " + message, "user");
  input.value = "";
  input.disabled = true;

  const button = form.querySelector("button");
  button.disabled = true;

  const loading = addMessage("A7-AI بيفكر...", "ai");

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "حصل خطأ");
    }

    loading.textContent = "A7-AI: " + data.reply;
  } catch (error) {
    loading.textContent = "A7-AI: " + error.message;
  } finally {
    input.disabled = false;
    button.disabled = false;
    input.focus();
  }
});

function addMessage(text, type) {
  const item = document.createElement("div");
  item.className = "message " + type;
  item.textContent = text;
  messages.appendChild(item);
  messages.scrollTop = messages.scrollHeight;
  return item;
}
