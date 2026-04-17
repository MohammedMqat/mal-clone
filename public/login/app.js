const form = document.getElementById("login-form");
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  })
    .then((response) => {
      return response.json().then((data) => ({ ok: response.ok, data }));
    })
    .then(({ ok, data }) => {
      if (ok) {
        window.location.href = "/";
      } else {
        document.getElementById("error-msg").textContent = data.message;
      }
    })
    .catch((err) => {
      console.error(err);
    });
});
