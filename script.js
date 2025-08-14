const API_URL = 'http://127.0.0.1:5000/chat';

function displayPersonality() {
  const personality = localStorage.getItem('chatPersonality') || "Friendly";
  let emoji = "";

  switch (personality.toLowerCase()) {
    case "friendly":
      emoji = "😊";
      break;
    case "formal":
      emoji = "🤵";
      break;
    case "funny":
      emoji = "😂";
      break;
    case "humorous":
      emoji = "🧠";
      break;
    default:
      emoji = "🤖";
  }

  document.getElementById("personalityDisplay").textContent = `${personality} ${emoji}`;
}

function addBubble(sender, text) {
  const chat = document.getElementById('chatWindow');
  const div = document.createElement('div');
  div.className = `bubble ${sender === 'me' ? 'me' : 'ai'} p-2 mb-2 rounded w-75 ${sender === 'me' ? 'bg-primary text-white ms-auto' : 'bg-light text-dark'}`;
  div.textContent = text;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

async function sendMessage() {
  const input = document.getElementById('message');
  const text = input.value.trim();
  if (!text) return;

  const personality = localStorage.getItem('chatPersonality') || 'friendly';

  addBubble('me', text);
  input.value = '';

  try {
   const res = await fetch(API_URL, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ message: text, personality })
});

    if (!res.ok) {
      addBubble('ai', `Server Error: ${res.status}`);
      return;
    }

    const data = await res.json();
    addBubble('ai', data.reply || '(No response)');
  } catch (err) {
    addBubble('ai', 'Network Error: ' + err.message);
  }
}

document.getElementById('sendBtn').addEventListener('click', sendMessage);
document.getElementById('message').addEventListener('keydown', e => {
  if (e.key === 'Enter') sendMessage();
});

displayPersonality();