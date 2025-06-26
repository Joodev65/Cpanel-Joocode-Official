// -------------------- Typing Animation --------------------
const texts = ["Auto Panel Creator", "Pterodactyl API", "Joocode Developer", "Server Management"];
let textIndex = 0;
let charIndex = 0;
const typingElement = document.getElementById("typing");

function typeText() {
  if (charIndex < texts[textIndex].length) {
    typingElement.textContent += texts[textIndex].charAt(charIndex);
    charIndex++;
    setTimeout(typeText, 100);
  } else {
    setTimeout(eraseText, 2000);
  }
}

function eraseText() {
  if (charIndex > 0) {
    typingElement.textContent = texts[textIndex].substring(0, charIndex - 1);
    charIndex--;
    setTimeout(eraseText, 50);
  } else {
    textIndex = (textIndex + 1) % texts.length;
    setTimeout(typeText, 500);
  }
}
typeText();

// -------------------- Show Tab Section --------------------
function showSection(id) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  if (id) document.getElementById(id).classList.add('active');
}

// -------------------- Create Panel --------------------
document.getElementById("panelForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = document.getElementById("username").value.toLowerCase();
  const email = document.getElementById("email").value.toLowerCase();
  const size = document.getElementById("size").value;
  const resultBox = document.getElementById("result");

  // Konversi ke MB
  let ram = 1024;
  if (size === "2gb") ram = 2048;
  else if (size === "3gb") ram = 3072;
  else if (size === "4gb") ram = 4096;
  else if (size === "5gb") ram = 5120;
  else if (size === "6gb") ram = 6144;
  else if (size === "7gb") ram = 7168;
  else if (size === "8gb") ram = 8192;
  else if (size === "9gb") ram = 9216;
  else if (size === "10gb") ram = 10240;
  else if (size === "unlimited") ram = 0;

  resultBox.innerHTML = "⏳ Membuat panel...";
  try {
    const res = await fetch("https://solid-hammerhead-petalite.glitch.me/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, ram })
    });

    const data = await res.json();
    if (data.error) return resultBox.innerHTML = "❌ Gagal: " + data.error;

    resultBox.innerHTML = `
      ✅ Panel berhasil dibuat!<br/><br/>
      🌐 Domain: <a href="${data.panel_url}" target="_blank">${data.panel_url}</a><br/>
      👤 Username: <code>${data.username}</code> <button onclick="copyToClipboard('${data.username}')">Salin</button><br/>
      🔐 Password: <code>${data.password}</code> <button onclick="copyToClipboard('${data.password}')">Salin</button><br/>
      📧 Email: ${data.email}<br/>
      🆔 Server ID: ${data.server_id}
    `;
  } catch (err) {
    resultBox.innerHTML = "❌ Error saat request: " + err.message;
  }
});

// -------------------- Create Admin --------------------
document.getElementById("adminForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = document.getElementById("adminUsername").value.toLowerCase();
  const email = document.getElementById("adminEmail").value.toLowerCase();
  const resultBox = document.getElementById("adminResult");

  resultBox.innerHTML = "⏳ Membuat akun admin...";
  try {
    const res = await fetch("https://solid-hammerhead-petalite.glitch.me/create-admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email })
    });

    const data = await res.json();
    if (data.error) return resultBox.innerHTML = "❌ Gagal: " + data.error;

    resultBox.innerHTML = `
      ✅ Admin berhasil dibuat!<br/><br/>
      👤 Username: <code>${data.username}</code><br/>
      🔐 Password: <code>${data.password}</code><br/>
      📧 Email: ${data.email}<br/>
      🆔 User ID: ${data.user_id}
    `;
  } catch (err) {
    resultBox.innerHTML = "❌ Error saat request.";
  }
});

// -------------------- List Server Panel --------------------
async function fetchServers() {
  const container = document.getElementById("serverList");
  container.innerHTML = "⏳ Memuat daftar server...";
  try {
    const res = await fetch("https://solid-hammerhead-petalite.glitch.me/servers");
    const servers = await res.json();
    if (!servers || !Array.isArray(servers)) return container.innerHTML = "❌ Gagal mengambil data.";

    container.innerHTML = servers.map(srv => `
      <div class="server-item">
        <span class="server-name">${srv.attributes.name || 'Tanpa Nama'}</span>
        <button class="delete-btn" onclick="deleteServer('${srv.attributes.id}')">×</button>
      </div>
    `).join('');
  } catch (err) {
    container.innerHTML = "❌ Gagal mengambil data server.";
  }
}

// -------------------- Delete Server Panel --------------------
async function deleteServer(id) {
  if (!confirm("Yakin hapus server ini?")) return;
  try {
    const res = await fetch(`https://solid-hammerhead-petalite.glitch.me/server/${id}`, {
      method: "DELETE"
    });
    const data = await res.json();
    if (data.success) fetchServers();
    else alert("❌ Gagal menghapus server");
  } catch (err) {
    alert("❌ Error saat menghapus server.");
  }
}

// -------------------- List Admin --------------------
async function fetchAdmins() {
  const container = document.getElementById("adminList");
  container.innerHTML = "⏳ Memuat daftar admin...";
  try {
    const res = await fetch("https://solid-hammerhead-petalite.glitch.me/admins");
    const admins = await res.json();
    if (!admins || !Array.isArray(admins)) return container.innerHTML = "❌ Gagal mengambil data.";

    container.innerHTML = admins.map(admin => `
      <div class="server-item">
        <span class="server-name">${admin.username || 'Tanpa Nama'}</span>
        <button class="delete-btn" onclick="deleteAdmin('${admin.id}')">×</button>
      </div>
    `).join('');
  } catch (err) {
    container.innerHTML = "❌ Gagal mengambil data admin.";
  }
}

// -------------------- Delete Admin --------------------
async function deleteAdmin(id) {
  if (!confirm("Yakin hapus admin ini?")) return;
  try {
    const res = await fetch(`https://solid-hammerhead-petalite.glitch.me/admin/${id}`, {
      method: "DELETE"
    });
    const data = await res.json();
    if (data.success) fetchAdmins();
    else alert("❌ Gagal menghapus admin");
  } catch (err) {
    alert("❌ Error saat menghapus admin.");
  }
}

// -------------------- Salin ke Clipboard --------------------
function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    alert("📋 Disalin!");
  });
}

// -------------------- Bind Event Tombol Tab --------------------
document.querySelector(".tab-btn:nth-child(2)").addEventListener("click", fetchServers);  // List Panel
document.querySelector(".tab-btn:nth-child(4)").addEventListener("click", fetchAdmins);   // List Admin

// Kosongkan tampilan awal
showSection('');
