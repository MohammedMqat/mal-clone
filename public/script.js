setInterval(() => {
  const dateP = document.getElementById("date");
  dateP.textContent = new Date().toString();
}, 1000);
const submitbt = document.getElementById("submit");
submitbt.addEventListener("click", (event) => {
  event.preventDefault();
  const direction = document.getElementById("select-direction").value;
  fetch(`/trains?direction=${direction}`)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
    });
});
