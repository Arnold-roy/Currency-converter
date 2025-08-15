const BASE_URL =
  "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

for (let select of dropdowns) {
  for (let currCode in countryList) {
    let opt = document.createElement("option");
    opt.value = currCode;
    opt.innerText = currCode;
    if (select.name === "from" && currCode === "USD") opt.selected = true;
    if (select.name === "to" && currCode === "INR") opt.selected = true;
    select.append(opt);
  }
  select.addEventListener("change", (e) => updateFlag(e.target));
}

async function updateExchangeRate() {
  const amountInput = document.querySelector(".amount input");
  let amt = amountInput.value;
  if (!amt || amt < 1) {
    amt = 1;
    amountInput.value = "1";
  }

  const from = fromCurr.value.toLowerCase();
  const to = toCurr.value.toLowerCase();
  const url = `${BASE_URL}/${from}.json`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const data = await res.json();
    const rate = data[from]?.[to];
    if (!rate) throw new Error(`Rate not found for ${from} → ${to}`);
    const final = (amt * rate).toFixed(2);
    msg.innerText = `${amt} ${fromCurr.value} = ${final} ${toCurr.value}`;
  } catch (err) {
    console.error(err);
    msg.innerText = "Error fetching exchange rate";
  }
}

function updateFlag(el) {
  const countryCode = countryList[el.value];
  el.parentElement.querySelector("img").src = `https://flagsapi.com/${countryCode}/flat/64.png`;
}

btn.addEventListener("click", (e) => {
  e.preventDefault();
  updateExchangeRate();
});
document.querySelector(".amount input").addEventListener("input", updateExchangeRate);
fromCurr.addEventListener("change", updateExchangeRate);
toCurr.addEventListener("change", updateExchangeRate);
window.addEventListener("load", updateExchangeRate);
