// <---------------------------------------------------------------여기 부터 소식 하단 파트 --------------------------------------------------------->//
const festivalApiKey = `59746b4962686f7436334e564e6778`;
let underFestivalUrl = new URL(
  `http://openapi.seoul.go.kr:8088/${festivalApiKey}/json/culturalEventInfo/1/50///2024-07-21`
); // API 키
const typeButtons = document.querySelectorAll(
  '.typeButton button, .typeButton button font'
);
typeButtons.forEach((menu) =>
  menu.addEventListener('click', (event) => getCardsByCategory(event))
); // 메뉴 버튼과 클릭시 이벤트 발생
const $topBtn = document.querySelector('.moveTopBtn'); // 스크롤 업 버튼
let underFestivalList = []; // API 정보 받을 배열

function googleTranslateElementInit() {
  new google.translate.TranslateElement(
    { pageLanguage: 'ko', includedLanguages: 'ko,en,jp' },
    'google_translate_element'
  );
}

const festivalView = async () => {
  // API 값을 불러오는 기능

  const response = await fetch(underFestivalUrl);
  const data = await response.json();
  underFestivalList = data.culturalEventInfo.row;
  console.log(data);
  console.log(underFestivalList);

  cardRender();
};

const getCardsByCategory = async (event) => {
  // 버튼을 누르면 해당 카테고리의 행사를 찾아주는 기능
  let category = event.currentTarget.getAttribute('data-categoryBtn');
  console.log(category);
  if (category === '전체') {
    underFestivalUrl = new URL(
      `http://openapi.seoul.go.kr:8088/${festivalApiKey}/json/culturalEventInfo/1/50///2024-07-21`
    );
    await festivalView();
  } else {
    let Url = new URL(
      `http://openapi.seoul.go.kr:8088/${festivalApiKey}/json/culturalEventInfo/1/50/${category}///2024-07-21`
    );
    underFestivalUrl = decodeURIComponent(Url);

    await festivalView();
  }
};

const cardRender = () => {
  // 카드 안에 API 데이터를 넣어서 불러오는 기능

  const cardsHTML = underFestivalList
    .map(
      (festival) =>
        `   <a href="${festival.ORG_LINK}" class="card-text-area">
                <div class="position">
                    <div class="card">
                        <img src="${
                          festival.MAIN_IMG
                        }" class="card-img-top" alt="NO-Image">   
                        
                        <div class="card-body">
                            <h5 class="card-title">${
                              festival.TITLE.length > 16
                                ? festival.TITLE.substring(0, 16) + '...'
                                : festival.TITLE
                            }</h5>
                            <p class="card-text">${festival.DATE}</p>
                        </div>        
                    </div>
                </div>
            </a>
            `
    )
    .join('');

  document.getElementById('festival-card-section').innerHTML = cardsHTML;
};

$topBtn.onclick = () => {
  // 버튼 클릭 시 맨 위로 이동
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

festivalView();

//<------------------------------------------------------------------여기 까지 소식 하단 파트--------------------------------------------------------------------------------->//
const weatherApiKey = '8f96d88863ec693820e54665e9bbc266';

function initializeWeather(city) {
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${weatherApiKey}&units=metric&lang=kr`;

    async function updateWeather() {
        const weatherElements = document.querySelectorAll('.navbar-text');
        weatherElements.forEach(element => {
            element.innerHTML = '날씨 정보를 불러오는 중...';
        });

        try {
            const response = await fetch(weatherUrl);
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            const data = await response.json();
            if (data.cod === 200) {
                const temperature = data.main.temp.toFixed(1); // 소수점 첫째 자리까지
                const weatherDescription = data.weather[0].description;
                const iconCode = data.weather[0].icon;
                const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

                weatherElements.forEach(element => {
                    element.innerHTML = `
                        <img src="${iconUrl}" alt="${weatherDescription}" style="width: 30px; margin-right: 10px;">
                        <span>${temperature}°C</span>
                    `;
                });
            } else {
                weatherElements.forEach(element => {
                    element.textContent = '날씨 정보를 불러오는데 실패했습니다.';
                });
            }
        } catch (error) {
            console.error('Error fetching weather data:', error);
            weatherElements.forEach(element => {
                element.textContent = '날씨 정보를 불러오는데 실패했습니다.';
            });
        }
    }

    updateWeather();
    setInterval(updateWeather, 600000); // 600000ms = 10분
}

// 날씨 정보 초기화
initializeWeather('Seoul');

/*///////////////////////////////////////////////////////////info 상단/////////////////////////////////////////////////////////////////////*/

import Swiper from 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.mjs';

const swiperArea = document.getElementById('festival-swiper');
const moreButtonArea = document.querySelector('.festival-more-btn');
const FESTIVAL_API_KEY =
  '4Jj5rc%2BmE6PU5FPhSUrBLlZ%2F7YU9rhZSd7xA4SnN17zDZGzvJs5bJhMuZKGgwOyDZIDXqzRjWAMakxfgk3jjQQ%3D%3D';
const FESTIVAL_PAGE_SIZE = 10;
const DEFAULT_URL = 'http://apis.data.go.kr/B551011/KorService1';
const today = new Date();
const todayYear = today.getFullYear().toString();
const todayMonth = (today.getMonth() + 1).toString().padStart(2, '0');
const todayDate = today.getDate().toString().padStart(2, '0');
const startDate = `${todayYear}${todayMonth}${todayDate}`;
const festivalUrl = new URL(
  `${DEFAULT_URL}/searchFestival1?serviceKey=${FESTIVAL_API_KEY}&numOfRows=${FESTIVAL_PAGE_SIZE}&MobileOS=ETC&MobileApp=APPTest&_type=Json&areaCode=1&eventStartDate=${startDate}`
);

let festivalList = [];
let totalPage = undefined;
let currentPage = 1;

getDefaultInfo();

//기본 축제정보&캐러샐 불러오기
async function getDefaultInfo() {
  await fetchFestivalInfo();
  renderCarousel();
  initSwiper();
}

// 추가 축제정보 불러오기
async function getMoreInfo() {
  currentPage++;
  await fetchFestivalInfo();
  renderMoreList();
  if (currentPage === totalPage) {
    moreButtonArea.innerHTML = '';
  }
}

async function fetchFestivalInfo() {
  festivalUrl.searchParams.set('pageNo', currentPage);
  try {
    const res = await fetch(festivalUrl);
    const data = await res.json();
    if (res.status === 200) {
      if (data.resultCode) throw new Error(data.resultMsg);
      if (!data.response.body.totalCount)
        throw new Error('일치하는 데이터가 없습니다');
      totalPage = Math.ceil(data.response.body.totalCount / FESTIVAL_PAGE_SIZE);
      festivalList = data.response.body.items.item;
    } else {
      throw new Error('데이터를 불러오는데 실패했습니다');
    }
  } catch (error) {
    console.log('error', error.message);
  }
}

function renderCarousel() {
  let swiperHtml = '<div class="swiper-wrapper">';
  festivalList.forEach((item) => {
    swiperHtml += `<div class="swiper-slide ${
      !item.firstimage ? 'no-img' : ''
    }" style="background-image:url(${
      item.firstimage || 'image/noImage.png'
    })"><a href="festivalDetail.html?id=${
      item.contentid
    }"><span class="swiper-status translatable ${
      startDate > item.eventstartdate ? 'ing' : 'wil'
    }">${
      startDate > item.eventstartdate ? '진행중' : '오픈예정'
    }</span><div class="swiper-desc"><p class="swiper-title translatable">${
      item.title
    }</p><p class="swiper-date">${changeFormat(
      item.eventstartdate
    )} - ${changeFormat(item.eventenddate)}</p></div></a></div>`;
  });
  swiperHtml += `</div>`;
  swiperArea.innerHTML = swiperHtml;
  document.querySelector('.swiper-wrap').insertAdjacentHTML(
    'beforeend',
    `   <div class="swiper-btn-prev">
          <i class="fa-solid fa-chevron-left"></i>
        </div>
        <div class="swiper-btn-next">
          <i class="fa-solid fa-chevron-right"></i>
        </div>
        <div class="swipe-pagination"></div>
        `
  );
  if (totalPage > 1) {
    moreButtonArea.innerHTML = `<button class="item-more-btn"><i class="fa-solid fa-chevron-down"></i> 더보기</button>`;
  }
  document
    .querySelector('.item-more-btn')
    .addEventListener('click', getMoreInfo);
}

async function renderMoreList() {
  let newHtml = '';

  festivalList.forEach((item) => {
    newHtml += `<li class="card more-item" style="background-image: url(
                  ${item.firstimage || 'image/footer.jpg'}
                )">
              <a href="#" data-contentid="${item.contentid}">
              <div class="card-body">
                <h5 class="card-title more-item-title">${item.title}</h5>
                <p class="more-item-date">${changeFormat(
                  item.eventstartdate
                )} - ${changeFormat(item.eventenddate)}</p>
                <span class="more-item-location">${
                  item.addr1
                    ? item.addr1.split(' ')[0] + ' ' + item.addr1.split(' ')[1]
                    : '서울특별시'
                }</span>
              </div>
            </a>
          </li>`;
  });

  document
    .querySelector('.festival-more-list')
    .insertAdjacentHTML('beforeend', `${newHtml}`);

  document.querySelectorAll('.more-item > a').forEach((item) => {
    item.addEventListener('click', moveToHomepage);
  });
}

//행사별 홈페이지로 이동
async function moveToHomepage(e) {
  e.preventDefault();
  const id = e.currentTarget.dataset.contentid;
  const url = `${DEFAULT_URL}/detailCommon1?serviceKey=${FESTIVAL_API_KEY}&contentId=${id}&MobileOS=ETC&MobileApp=APPTest&_type=Json&defaultYN=Y`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    if (!res.ok) throw new Error('주소를 불러오는데 실패했습니다');
    if (data.resultCode) throw new Error(data.resultMsg);
    const homepageUrl = data.response.body.items.item[0].homepage.split('"')[1];
    if (!homepageUrl) throw new Error('홈페이지를 준비중입니다');
    location.href = homepageUrl;
  } catch (error) {
    if (error.message === '홈페이지를 준비중입니다') {
      alert(error.message);
      return;
    }
    alert('주소를 불러오는데 실패했습니다');
  }
}

//캐러샐 초기화
function initSwiper() {
  const swiper = new Swiper(swiperArea, {
    slidesPerView: 1,
    spaceBetween: 15,
    pagination: {
      el: '.swipe-pagination',
      clickable: true,
    },
    navigation: {
      nextEl: '.swiper-btn-next',
      prevEl: '.swiper-btn-prev',
    },
    breakpoints: {
      480: {
        slidesPerView: 2,
      },
      992: {
        slidesPerView: 3,
      },
      1200: {
        slidesPerView: 4,
      },
      1400: {
        slidesPerView: 5,
      },
    },
    autoplay: {
      delay: 3500,
      disableOnInteraction: false,
    },
  });
}

//날짜 형식 변환
function changeFormat(date) {
  const newFormat =
    date.slice(0, 4) + '.' + date.slice(4, 6) + '.' + date.slice(6);
  return newFormat;
}
