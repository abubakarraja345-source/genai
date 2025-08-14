document.getElementById('startChat').addEventListener('click', function() {
      const selected = document.getElementById('personality').value;
      localStorage.setItem('chatPersonality', selected);
      window.location.href = 'chat.html';
    });