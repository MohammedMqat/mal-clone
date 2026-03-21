const container = document.getElementById("container");
fetch(`https://api.jikan.moe/v4/top/anime?limit=10`)
  .then((response) => response.json())
  .then((data) => {
    data.data;
    console.log(data.data);
  });
// setInterval(() => {
//   const dateP = document.getElementById("date");
//   dateP.textContent = new Date().toString();
// }, 1000);
// const submitbt = document.getElementById("submit");
// submitbt.addEventListener("click", (event) => {
//   event.preventDefault();
//   const direction = document.getElementById("select-direction").value;
//   fetch(`/trains?direction=${direction}`)
//     .then((response) => response.json())
//     .then((data) => {
//       console.log(data);
//     });
// });
