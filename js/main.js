const advData = ['adv1.png', 'adv2.png', 'adv3.png'];
const elemContent = document.querySelector('#Content');
const elemTown = document.querySelector('#Town');
const elemCity = document.querySelector('#City');
const elemPageBar = document.querySelector('#PageBar');
const elemDisMode = document.querySelector('#DisMode');
const elemModeBtn = elemDisMode.querySelectorAll('.disMode__opt');
const elemPageBtn = elemPageBar.children;
const elemPageInfo = document.querySelector('#PageInfo');
const modeArr = ['mode-list', 'mode-tbl', 'mode-card'];
let data = [];
let processedData = [];
let perPage = 10;
let btnIndex = 0;
let modeIndex = 0;
let isPc = visualViewport.width > 414;
setInit();
async function setInit() {
  await getData();
  processedData = setData(data);
  document.querySelector('#Loading').classList.add('js-loader');
  render();
  setEvent();
}
// fetch 資料
async function getData() {
  const url = 'https://data.coa.gov.tw/Service/OpenData/ODwsv/ODwsvTravelFood.aspx'
  try {
    const res = await fetch(url);
    const json = await res.json();
    data = await json;
  } catch (e) {
    console.log('資料擷取失敗')
  }
}

function render() {
  elemContent.innerHTML = makeContentStr(processedData, 0);
  elemPageBar.innerHTML = makeBtnStr(data.length);
  elemPageInfo.innerHTML = makePageInfo(btnIndex);
  elemPageBtn[btnIndex].classList.add('js-pageBtn');
  elemModeBtn[modeIndex].classList.add('js-btn');
  document.querySelector('#Adv').innerHTML = makeAdvStr()
  elemCity.innerHTML = '<option class="form__option" value="" selected disabled>請選擇行政區域...</option>' + setOption(0);
}
function makeContentStr(arr, i, str = '') {
  arr[i].forEach((item, index) => {
    const desc = item.HostWords;
    str += `
      <li class="restraunt table-tr ${index % 2 !== 0 ? 'js-bg__grey' : 'js-bg__white'}">
        <div class="restraunt__wrap d-flex">
          <figure class="restraunt__imgWrap">
            <img src=${item.PicURL} alt=${item.Name} class="restraunt__img" loading="lazy">
          </figure>
          <div class="restraunt__content">
            <h2 class="restraunt__name table-td">
              ${item.Url === '' ? '' : `<a href=${item.Url} class="restraunt__link" target="_blank">`}
                ${item.Name}
              ${item.Url === '' ? '' : '</a>'}
            </h2>
            <div class="restraunt__dist">
              <p class="restraunt__index table-td">${perPage * btnIndex + index + 1}</p>
              <p class="restraunt__city table-td">${item.City}</p>
              <em class="restraunt__town table-td">${item.Town}</em>
            </div>
            <p class="restraunt__desc">
              ${isPc ? sliceStr(desc, 100) : slice(desc, 40)}
            </p>
            <p class="restraunt__address table-td text-ellipsis">${item.Address}</p>
          </div>
        </div>
      </li>`
  })
  return str;
}
// 處理資料--分頁資料分段
function setData(target) {
  let arr = [];
  target.forEach((item, index) => {
    if (index % 10 === 0) {
      arr.push([]);
      _index = Math.floor(index / perPage);
    }
    arr[_index].push(item);
  })
  return arr;
}
function sliceStr(str, len) {
  return str.length > len ? str.substring(0, len) + '...' : str
}
function makeBtnStr(l, str = '') {
  const len = Math.ceil(l / perPage);
  for (let i = 0; i < len; i++) {
    str += `<button type="button" class="pageBar__btn btn btn-light btn-sm" data-index="${i}">${i + 1}</button>`
  }
  return str;
}

function makeAdvStr(str = '') {
  const len = advData.length;
  advData.forEach((item, index) => {
    str += `
      <figure class="adv__imgContainer ${index === len - 1 ? 'sticky-top' : ''}">
        <a href="javascript:;" class="adv__link">
          <img src="./images/${item}" alt="" class="adv__img">
        </a>
      </figure>`
  })
  return str;
}
function makePageInfo(i, str = '') {
  const len = elemPageBtn.length;
  str = `<span class="pageInfo__text">美食頁次  ${i + 1}/${len}</span>`;
  return str;
}
function setEvent() {
  elemTown.addEventListener('change', filter);
  elemCity.addEventListener('change', filter);
  elemPageBar.addEventListener('click', clickBtn);
  elemDisMode.addEventListener('click', clickBtn);
}
// 新增選單選項
function setOption(type, city, allArr = [], str = '') {
  if (type === 0) {
    allArr = data.map((item) => item.City)
  } else {
    data.forEach((item) => {
      if (item.City === city) {
        allArr.push(item.Town);
      }
    })
  }
  let optArr = allArr.filter((item, index, self) => self.indexOf(item) === index);
  optArr.forEach((item) => {
    str += `<option value=${item} class="form__option">${item}</option>`;
  })
  return str;
}
// 城鎮縣市選單過濾
function filter(e, arr = []) {
  const self = e.target;
  const val = self.value;
  if (self.id === 'City') {
    elemTown.innerHTML = '<option class="form__option" value="" selected disabled>請選擇鄉鎮區...</option>' + setOption(1, val);
    arr = data.filter((item) => item.City === val);
  }
  else { arr = data.filter((item) => item.Town === val); }
  processedData = setData(arr);
  console.log(processedData);
  elemPageBtn[btnIndex].classList.remove('js-pageBtn');
  btnIndex = 0;
  elemPageBar.innerHTML = makeBtnStr(processedData.length * perPage);
  elemPageInfo.innerHTML = makePageInfo(btnIndex);
  elemPageBtn[btnIndex].classList.add('js-pageBtn');
  elemContent.innerHTML = makeContentStr(processedData, btnIndex);
}

function clickBtn(e) {
  const self = e.target;
  const currentIndex = parseInt(self.dataset.index, 10);
  switch (self.nodeName) {
    case 'I':
      elemModeBtn[modeIndex].classList.remove('js-btn');
      elemModeBtn[currentIndex].classList.add('js-btn');
      elemContent.classList.remove(modeArr[modeIndex]);
      elemContent.classList.add(modeArr[currentIndex]);
      modeIndex = currentIndex;
      return;
    case 'BUTTON':
      elemPageBtn[btnIndex].classList.remove('js-pageBtn');
      self.classList.add('js-pageBtn');
      btnIndex = currentIndex;
      elemPageInfo.innerHTML = makePageInfo(btnIndex)
      elemContent.innerHTML = makeContentStr(processedData, btnIndex);
      return;
    default:
      return;
  }

}