const advData = ['adv1.png', 'adv2.png', 'adv3.png'];
const elemContent = document.querySelector('#Content');
let data = [];
let totalLen = 0;
let perPage = 10;
let btnIndex = 0;

async function setInit() {
  await getData();
  document.querySelector('#Loading').classList.add('js-hidden');
  render();
}
// fetch 資料
async function getData() {
  const url = 'https://data.coa.gov.tw/Service/OpenData/ODwsv/ODwsvTravelFood.aspx'
  try {
    const res = await fetch(url);
    const json = await res.json();
    data = await json;
    totalLen = data.length
    data = setData();
  } catch (e) {
    console.log('資料擷取失敗')
  }
}
// 處理資料--分頁資料分段
function setData() {
  let arr = [];
  data.forEach((item, index) => {
    if (index % 10 === 0) {
      arr.push([]);
      _index = Math.floor(index / perPage);
    }
    arr[_index].push(item);
  })
  return arr;
}

function makeBtnStr(str = '') {
  const len = Math.ceil(totalLen / perPage);
  for (let i = 0; i < len; i++) {
    str += `<button type="button" class="page__btn" data-index="${i}">${i + 1}</button>`
  }
  return str;
}
function setEvent() {
  elemPage.addEventListener('click', atClick);
}