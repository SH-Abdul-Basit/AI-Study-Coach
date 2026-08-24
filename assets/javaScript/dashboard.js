const navItems = document.querySelectorAll('.nav-item, a.see-all');
  const views = document.querySelectorAll('.view');
  function showView(name){
    views.forEach(v => v.classList.toggle('view--active', v.id === 'view-' + name));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.toggle('active', n.dataset.view === name));
    window.scrollTo({top:0, behavior:'smooth'});
  }
  navItems.forEach(item => {
    item.addEventListener('click', () => showView(item.dataset.view));
  });

  
  const toast = document.getElementById('toast');
  const toastText = document.getElementById('toastText');
  let toastTimer;
  function showToast(text){
    toastText.textContent = text;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2400);
  }
  document.querySelectorAll('[data-toast]').forEach(btn=>{
    btn.addEventListener('click', ()=> showToast(btn.dataset.toast));
  });
  document.getElementById('saveSettings').addEventListener('click', ()=> showToast('Settings saved'));
  document.querySelectorAll('[data-switch]').forEach(sw=>{
    sw.addEventListener('click', ()=> sw.classList.toggle('on'));
  });

  
  const drawer = document.getElementById('chatDrawer');
  const overlay = document.getElementById('overlay');
  function openChat(){ drawer.classList.add('open'); overlay.classList.add('show'); }
  function closeChatFn(){ drawer.classList.remove('open'); overlay.classList.remove('show'); }
  document.getElementById('openChat').addEventListener('click', openChat);
  document.getElementById('openChatCard').addEventListener('click', openChat);
  document.getElementById('closeChat').addEventListener('click', closeChatFn);
  overlay.addEventListener('click', closeChatFn);

  const chatBody = document.getElementById('chatBody');
  const chatInput = document.getElementById('chatInput');
  const replies = [
    "Good question — let's break it down step by step so it sticks.",
    "Here's a quick way to think about it: connect it to something you already know.",
    "Want me to make a few flashcards for this so you can practice it later?",
    "Nice, you're on a roll today. Want to try a short 5-question quiz on this?"
  ];
  function addMsg(text, who){
    const div = document.createElement('div');
    div.className = 'msg ' + who;
    div.textContent = text;
    chatBody.appendChild(div);
    chatBody.scrollTop = chatBody.scrollHeight;
  }
  function sendMessage(text){
    if(!text.trim()) return;
    addMsg(text, 'user');
    chatInput.value = '';
    setTimeout(()=>{
      addMsg(replies[Math.floor(Math.random()*replies.length)], 'coach');
    }, 550);
  }
  document.getElementById('sendChat').addEventListener('click', ()=> sendMessage(chatInput.value));
  chatInput.addEventListener('keydown', e => { if(e.key === 'Enter') sendMessage(chatInput.value); });
  document.querySelectorAll('.suggestion-chip').forEach(chip=>{
    chip.addEventListener('click', ()=> sendMessage(chip.dataset.q));
  });