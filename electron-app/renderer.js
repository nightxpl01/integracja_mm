const API_URL = 'http://localhost:3000';

async function login() {
  const login = document.getElementById('login').value;
  const password = document.getElementById('password').value;

  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ login, password })
  });

  const data = await res.json();
  if (data.token) {
    localStorage.setItem('jwt', data.token);
    loadMovies();
    document.getElementById('main').style.display = 'block';
  }
}

async function loadMovies() {
  const token = localStorage.getItem('jwt');
  const res = await fetch(`${API_URL}/api/movies`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const movies = await res.json();

  const list = document.getElementById('movies');
  list.innerHTML = '';

  for (const m of movies) {
    const li = document.createElement('li');
    li.textContent = m.title;

    const wikiBtn = document.createElement('button');
    wikiBtn.textContent = 'Opis z Wikipedii';
    wikiBtn.onclick = async () => {
      const wiki = await fetch(`${API_URL}/api/wiki/${encodeURIComponent(m.title)}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const desc = await wiki.json();
      alert(desc.extract);
    };

    li.appendChild(wikiBtn);
    list.appendChild(li);
  }
}
