// assets/js/comments.js

import { LOCATION_KEY } from './map/config.js';

// Récupère et affiche la liste des commentaires
async function loadComments() {
  const res = await fetch('comments.php?action=list');
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const comments = await res.json();
  const ul = document.getElementById('comments-list');
  if (!ul) return;
  ul.innerHTML = '';

  comments.forEach((c, idx) => {
    const li = document.createElement('li');
    li.dataset.id = idx;

    // En-tête
    const header = document.createElement('div');
    header.className = 'cm-header';
    header.innerHTML = `
      <span class="cm-author">${c.visitor}</span>
      <time class="cm-date">${c.date}</time>
    `;

    // Corps du commentaire
    const body = document.createElement('p');
    body.textContent = c.comment;

    // Réactions existantes + boutons de réaction
    const reactBar = document.createElement('div');
    reactBar.className = 'cm-reactions';
    for (const [emo, cnt] of Object.entries(c.reactions || {})) {
      const btn = document.createElement('button');
      btn.className = 'react-btn';
      btn.dataset.emoji = emo;
      btn.innerHTML = `${emo} <span class="count">${cnt}</span>`;
      reactBar.appendChild(btn);
    }
    ['👍','❤️','😂'].forEach(emo => {
      if (!(c.reactions || {})[emo]) {
        const btn = document.createElement('button');
        btn.className = 'react-btn';
        btn.dataset.emoji = emo;
        btn.innerHTML = `${emo} <span class="count">0</span>`;
        reactBar.appendChild(btn);
      }
    });

    // Réponses (replies)
    const replUL = document.createElement('ul');
    replUL.className = 'cm-replies';
    (c.replies || []).forEach(r => {
      const rli = document.createElement('li');
      rli.innerHTML = `
        <strong>${'Micus'}</strong>
        <em>${r.date}</em>
        <p>${r.comment}</p>
      `;
      replUL.appendChild(rli);
    });

    // Bouton "Répondre" uniquement si clé valide
    if (LOCATION_KEY === 'mic') {
      const replyBtn = document.createElement('button');
      replyBtn.textContent = 'Répondre';
      replyBtn.onclick = () => toggleReplyForm(li, idx);
      li.append(replyBtn);
    }

    li.append(header, body, reactBar, replUL);
    ul.appendChild(li);
  });

  // Active les handlers de réaction
  initReactions();
}

// Affiche ou enlève le formulaire de réponse sous un commentaire
function toggleReplyForm(containerLi, commentId) {
  let form = containerLi.querySelector('.reply-form');
  if (form) {
    form.remove();
    return;
  }
  form = document.createElement('form');
  form.className = 'reply-form';
  form.innerHTML = `
    <textarea name="reply" rows="2" placeholder="Ta réponse…" required></textarea>
    <button type="submit">Envoyer</button>
  `;
  form.onsubmit = async e => {
    e.preventDefault();
    const text = form.reply.value.trim();
    if (!text) return;
    try {
      const res = await fetch('comments.php?action=reply', {
        method: 'POST',
        body: new URLSearchParams({ id: commentId, reply: text })
      });
      if (!res.ok) throw new Error();
      await loadComments();
    } catch {
      alert('❌ Erreur lors de l’envoi de la réponse');
    }
  };
  containerLi.appendChild(form);
}

// Initialise les boutons de réaction (👍 ❤️ 😂)
function initReactions() {
  document.querySelectorAll('.react-btn').forEach(btn => {
    const li    = btn.closest('li');
    const id    = li.dataset.id;
    const emoji = btn.dataset.emoji;
    const key   = `reacted_${id}_${emoji}`;

    // Désactiver si déjà réagi
    if (localStorage.getItem(key)) {
      btn.disabled = true;
      btn.classList.add('done');
    }

    btn.onclick = async () => {
      if (localStorage.getItem(key)) return;
      try {
        const res = await fetch('comments.php?action=react', {
          method: 'POST',
          body: new URLSearchParams({ id, emoji })
        });
        if (!res.ok) throw new Error();
        // Incrémente l’affichage
        const cnt = btn.querySelector('.count');
        cnt.textContent = parseInt(cnt.textContent, 10) + 1;
        localStorage.setItem(key, '1');
        btn.disabled = true;
        btn.classList.add('done');
      } catch {
        alert('❌ Impossible de prendre en compte la réaction');
      }
    };
  });
}

// Point d’entrée à appeler depuis main.js
export function initComments() {
  // Charge et affiche les commentaires immédiatement
  loadComments().catch(err => {
    console.error('Impossible de charger les commentaires :', err);
  });

  // Attache le handler du formulaire
  const form = document.getElementById('comments-form');
  if (!form) return;
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const fm = new FormData(form);
    try {
      const res = await fetch('comments.php?action=add', {
        method: 'POST',
        body: fm
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      form.reset();
      await loadComments();
      alert('✅ Merci pour votre commentaire !');
    } catch (err) {
      console.error('Erreur publication commentaire :', err);
      alert('❌ Échec de la publication.');
    }
  });
}