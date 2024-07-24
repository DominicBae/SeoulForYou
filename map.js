// GOOGLE 번역 API

// 한국어, 영어, 일본어 setting
function googleTranslateElementInit() {
	new google.translate.TranslateElement({pageLanguage: 'ko' , includedLanguages : 'ko,en,jp'}, 'google_translate_element');
}


// KAKAO MAP API SETTING

// 마커를 담을 배열
let searchMarkers = [];

let mapContainer = document.getElementById('map'), // 지도를 표시할 div 
    mapOption = {
        center: new kakao.maps.LatLng(37.566826, 126.9786567), // 지도의 중심좌표
        level: 5 // 지도의 확대 레벨
    };  

// 지도를 생성
let map = new kakao.maps.Map(mapContainer, mapOption); 

// 장소 검색 객체
let ps = new kakao.maps.services.Places();  

// 검색 결과 목록이나 마커를 클릭했을 때 장소명을 표출할 인포윈도우를 생성
let infowindow = new kakao.maps.InfoWindow({zIndex:1});

// // 키워드로 장소를 검색
// keywordSearchPlaces();

// 키워드 검색을 요청하는 함수
function keywordSearchPlaces(value, event) {
  event.preventDefault();
  console.log('event', event)

  let keyword = value ? value : document.getElementById('keyword').value;
  console.log('keyword', keyword)
  if (!keyword.replace(/^\s+|\s+$/g, '')) {
    alert('키워드를 입력해주세요!');
    return false;
  }
  // document.getElementsByClassName('result-keyword').innerHTML = keyword;
  // console.log('keyword : ', document.getElementsByClassName('result-keyword').innerHTML)
  
  // onClickCategory('reset')
  
  changeCategoryClass(value)
  // 장소검색 객체를 통해 키워드로 장소검색을 요청
  ps.keywordSearch( keyword, placesKeywordSearchCB); 
}

// 장소검색이 완료됐을 때 호출되는 콜백함수
function placesKeywordSearchCB(data, status, pagination) {
  if (status === kakao.maps.services.Status.OK) {
    searchPlaces();
    // 정상적으로 검색이 완료됐으면
    // 검색 목록과 마커를 표출
    displayKeywordPlaces(data);
    
    // 페이지 번호를 표출
    displayPagination(pagination);

  } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
    alert('검색 결과가 존재하지 않습니다.');
    keyword.value='';
    return;
  } else if (status === kakao.maps.services.Status.ERROR) {
    alert('검색 결과 중 오류가 발생했습니다.');
    keyword.value='';
    return;
  }
}
// 검색 결과 목록 지우는 함수 
function removeSearchList() {
  let listEl = document.getElementById('placesList');
  removeAllChildNods(listEl);
  return listEl
}


// 검색 결과 목록과 마커를 표출하는 함수
function displayKeywordPlaces(places) {
  let listEl = document.getElementById('placesList');

  let menuEl = document.getElementById('scroll-wrapper'),
      fragment = document.createDocumentFragment(), 
      bounds = new kakao.maps.LatLngBounds(), 
      listStr = '';

  // 검색 결과 목록에 추가된 항목들을 제거
  removeAllChildNods(listEl);
  // let listEl = removeSearchList();

  // 지도에 표시되고 있는 마커를 제거
  // removeSearchMarkers();
  // removeMarker();
  
  for ( let i=0; i<places.length; i++ ) {
    // 마커를 생성하고 지도에 표시
    let placePosition = new kakao.maps.LatLng(places[i].y, places[i].x),
        marker1 = addKeywordMarker(placePosition, i), 
        itemEl = getListItem(i, places[i]); // 검색 결과 항목 Element를 생성

    // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
    // LatLngBounds 객체에 좌표를 추가
    bounds.extend(placePosition);


    // 마커와 검색결과 항목을 클릭 했을 때
    // 장소정보를 표출하도록 클릭 이벤트를 등록
    (function(marker1, place) {
      kakao.maps.event.addListener(marker1, 'click', function() {
          displayPlaceInfo(place);
      });
    })
    (marker1, places[i]);

    // 마커와 검색결과 항목에 mouseover 했을때
    // 해당 장소에 인포윈도우에 장소명을 표시
    // mouseout 했을 때는 인포윈도우를 닫습니다
    (function(marker1, title) {
      kakao.maps.event.addListener(marker1, 'mouseover', function() {
        displayInfowindow(marker1, title);
      });

      kakao.maps.event.addListener(marker1, 'mouseout', function() {
        infowindow.close();
      });

      itemEl.onmouseover =  function () {
        displayInfowindow(marker1, title);
      };

      itemEl.onmouseout =  function () {
        infowindow.close();
      };
    })(marker1, places[i].place_name);


    fragment.appendChild(itemEl);
  }

  // 검색결과 항목들을 검색결과 목록 Element에 추가
  listEl.appendChild(fragment);
  menuEl.scrollTop = 0;

  // 검색된 장소 위치를 기준으로 지도 범위를 재설정
  map.setBounds(bounds);
}

// 검색결과 항목을 Element로 반환하는 함수
function getListItem(index, places) {
  let el = document.createElement('li'),
  itemStr = '<span class="markerbg marker_' + (index+1) + '"></span>' +
              '<div class="info">' +
              '   <h5>' + places.place_name + '</h5>';
  if (places.road_address_name) {
      itemStr += '    <span>' + places.road_address_name + '</span>' +
                  '   <span class="jibun gray">' +  places.address_name  + '</span>';
  } else {
      itemStr += '    <span>' +  places.address_name  + '</span>'; 
  }           
  itemStr += '  <span class="tel">' + places.phone  + '</span>' +
            '</div>';           

  el.innerHTML = itemStr;
  el.className = 'item';

  return el;
}

// 마커를 생성하고 지도 위에 마커를 표시하는 함수
function addKeywordMarker(position, idx, title) {
  // console.log('@@ addkeywordmarker function')

  let imageSrc = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_number_blue.png', // 마커 이미지 url, 스프라이트 이미지를 씁니다
      imageSize = new kakao.maps.Size(36, 37),  // 마커 이미지의 크기
      imgOptions =  {
        spriteSize : new kakao.maps.Size(36, 691), // 스프라이트 이미지의 크기
        spriteOrigin : new kakao.maps.Point(0, (idx*46)+10), // 스프라이트 이미지 중 사용할 영역의 좌상단 좌표
        offset: new kakao.maps.Point(13, 37) // 마커 좌표에 일치시킬 이미지 내에서의 좌표
      },
      markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imgOptions),
        marker1 = new kakao.maps.Marker({
        position: position, // 마커의 위치
        image: markerImage 
      });

  marker1.setMap(map); // 지도 위에 마커를 표출
  searchMarkers.push(marker1);  // 배열에 생성된 마커를 추가
  return marker1;
}

// 지도 위에 표시되고 있는 마커를 모두 제거
function removeSearchMarkers() {
  for ( let i = 0; i < searchMarkers.length; i++ ) {
    searchMarkers[i].setMap(null);
  }   
  searchMarkers = [];
}

// 검색결과 목록 하단에 페이지번호를 삭제하는 함수 
function deletePagination() {
  let paginationEl = document.getElementById('pagination');
  while (paginationEl.hasChildNodes()) {
    paginationEl.removeChild(paginationEl.lastChild);
  }
  return paginationEl
}
// 검색결과 목록 하단에 페이지번호를 표시는 함수
function displayPagination(pagination) {
  // let paginationEl = document.getElementById('pagination');
  let fragment = document.createDocumentFragment(); 
  
  
  // 기존에 추가된 페이지번호를 삭제
  // while (paginationEl.hasChildNodes()) {
  //   paginationEl.removeChild(paginationEl.lastChild);
  // }
  paginationEl = deletePagination();

  // 새로운 페이지번호 만들기
  for (let i=1; i<=pagination.last; i++) {
    let el = document.createElement('a');
    el.href = "#";
    el.innerHTML = i;

    if (i===pagination.current) {
        el.className = 'on';
    } else {
        el.onclick = (function(i) {
            return function() {
                pagination.gotoPage(i);
            }
        })(i);
    }

    fragment.appendChild(el);
  }
  paginationEl.appendChild(fragment);
}

// 검색결과 목록 또는 마커를 클릭했을 때 호출되는 함수
// 인포윈도우에 장소명을 표시합니다
function displayInfowindow(marker, title) {
  // let content = '<div style="padding:5px;z-index:1;">' + title + '</div>';
  let content = '<div style="padding:5px;z-index:1;">' + title + '</div>';

  infowindow.setContent(content);
  infowindow.open(map, marker);
}

 // 검색결과 목록의 자식 Element를 제거하는 함수
function removeAllChildNods(el) {   
  while (el.hasChildNodes()) {
      el.removeChild (el.lastChild);
  }
}

/////////////////////////////////CATEGORY MAP FUNCTIONS

// 마커를 클릭했을 때 해당 장소의 상세정보를 보여줄 커스텀오버레이입니다
let placeOverlay = new kakao.maps.CustomOverlay({zIndex:1}), 
    contentNode = document.createElement('div'), // 커스텀 오버레이의 컨텐츠 엘리먼트 입니다 
    categoryMarkers = [], // 마커를 담을 배열입니다
    currCategory = ''; // 현재 선택된 카테고리를 가지고 있을 변수입니다

// 장소 검색 객체를 생성합니다
let categoryPS = new kakao.maps.services.Places(map); 

// 지도에 idle 이벤트를 등록합니다
kakao.maps.event.addListener(map, 'idle', searchPlaces);

// 커스텀 오버레이의 컨텐츠 노드에 css class를 추가합니다 
contentNode.className = 'placeinfo_wrap';

// 커스텀 오버레이의 컨텐츠 노드에 mousedown, touchstart 이벤트가 발생했을때
// 지도 객체에 이벤트가 전달되지 않도록 이벤트 핸들러로 kakao.maps.event.preventMap 메소드를 등록합니다 
addEventHandle(contentNode, 'mousedown', kakao.maps.event.preventMap);
addEventHandle(contentNode, 'touchstart', kakao.maps.event.preventMap);

// 커스텀 오버레이 컨텐츠를 설정합니다
placeOverlay.setContent(contentNode);  

// 각 카테고리에 클릭 이벤트를 등록합니다
// addCategoryClickEvent();

// 엘리먼트에 이벤트 핸들러를 등록하는 함수입니다
function addEventHandle(target, type, callback) {
  if (target.addEventListener) {
      target.addEventListener(type, callback);
  } else {
      target.attachEvent('on' + type, callback);
  }
}

// 카테고리 검색을 요청하는 함수입니다
function searchPlaces() {
  if (!currCategory) {
    return;
  }
  // 커스텀 오버레이를 숨김
  placeOverlay.setMap(null);

  // 지도에 표시되고 있는 마커를 제거
  removeMarker();

  // 검색결과 목록 모두 삭제
  removeSearchList();
  keyword.value='';
  deletePagination();
  

  categoryPS.keywordSearch(currCategory, placesKeywordSearchCB); 

  // categoryPS.categorySearch(currCategory, placesSearchCB, {useMapBounds:true}); 
}

// 장소검색이 완료됐을 때 호출되는 콜백함수
function placesSearchCB(data, status, pagination) {
  console.log('data', data)
  if (status === kakao.maps.services.Status.OK) {
    removeMarker();
    // 정상적으로 검색이 완료됐으면 지도에 마커를 표출
    displayPlaces(data);
  } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
    // 검색결과가 없는경우 해야할 처리
    alert('검색 결과가 존재하지 않습니다.');
    return;
  } else if (status === kakao.maps.services.Status.ERROR) {
    // 에러로 인해 검색결과가 나오지 않은 경우 해야할 처리
    alert('검색 결과 중 오류가 발생했습니다.');
    return;
  }
}

// 지도에 마커를 표출하는 함수
function displayPlaces(places) {
  // 몇번째 카테고리가 선택되어 있는지 얻어옵니다
  // 이 순서는 스프라이트 이미지에서의 위치를 계산하는데 사용됩니다
  let order = document.getElementById(currCategory).getAttribute('data-order');
  let bounds = new kakao.maps.LatLngBounds(); 
  
  // for ( let i=0; i<places.length; i++ ) {
  for ( let i=0; i<6; i++ ) {
    
    // 마커를 생성하고 지도에 표시
    let placePosition = new kakao.maps.LatLng(places[i].y, places[i].x)
    let marker = addMarker(new kakao.maps.LatLng(places[i].y, places[i].x), order);
    
    // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
    // LatLngBounds 객체에 좌표를 추가
    bounds.extend(placePosition);
    // 마커와 검색결과 항목을 클릭 했을 때
    // 장소정보를 표출하도록 클릭 이벤트를 등록
    (function(marker, place) {
      kakao.maps.event.addListener(marker, 'click', function() {
        displayPlaceInfo(place);
      });
    })
    (marker, places[i]);
  }
  // 검색된 장소 위치를 기준으로 지도 범위를 재설정
  map.setBounds(bounds);
}


// 마커를 생성하고 지도 위에 마커를 표시하는 함수
function addMarker(position, order) {
  let imageSrc = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/places_category.png', // 마커 이미지 url, 스프라이트 이미지
      imageSize = new kakao.maps.Size(27, 28),  // 마커 이미지의 크기
      imgOptions =  {
          spriteSize : new kakao.maps.Size(72, 208), // 스프라이트 이미지의 크기
          spriteOrigin : new kakao.maps.Point(46, (order*36)), // 스프라이트 이미지 중 사용할 영역의 좌상단 좌표
          offset: new kakao.maps.Point(11, 28) // 마커 좌표에 일치시킬 이미지 내에서의 좌표
      },
      markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imgOptions),
          marker = new kakao.maps.Marker({
          position: position, // 마커의 위치
          image: markerImage 
      });

  marker.setMap(map); // 지도 위에 마커를 표출
  categoryMarkers.push(marker);  // 배열에 생성된 마커를 추가

  return marker;
}

// 지도 위에 표시되고 있는 마커를 모두 제거
function removeMarker() {
  for ( let i = 0; i < categoryMarkers.length; i++ ) {
    categoryMarkers[i].setMap(null);
  }   
  for ( let i = 0; i < searchMarkers.length; i++ ) {
    searchMarkers[i].setMap(null);
  }  
  categoryMarkers = [];
  searchMarkers
}

// 클릭한 마커에 대한 장소 상세정보를 커스텀 오버레이로 표시하는 함수
function displayPlaceInfo (place) {
  let content = '<div class="placeinfo">' +
                  '   <a class="title" href="' + place.place_url + '" target="_blank" title="' + place.place_name + '">' + place.place_name + '</a>';   

  if (place.road_address_name) {
      content += '    <span title="' + place.road_address_name + '">' + place.road_address_name + '</span>' +
                  '  <span class="jibun" title="' + place.address_name + '">(지번 : ' + place.address_name + ')</span>';
  }  else {
      content += '    <span title="' + place.address_name + '">' + place.address_name + '</span>';
  }                
  
  content += '    <span class="tel">' + place.phone + '</span>' + 
              '</div>' + 
              '<div class="after"></div>';

  contentNode.innerHTML = content;
  placeOverlay.setPosition(new kakao.maps.LatLng(place.y, place.x));
  placeOverlay.setMap(map);  
}

// 각 카테고리에 클릭 이벤트를 등록
function addCategoryClickEvent() {
  let category = document.getElementById('category'),
  children = category.children;
  for (let i=0; i<children.length; i++) {
    if(children[i].onclick) children[i].onclick = onClickCategory;
    // children[i].onclick = onClickCategory;
  }
}

// 카테고리를 클릭했을 때 호출되는 함수
function onClickCategory(val) {
  let id = this.id;
  let className = this.className;
  placeOverlay.setMap(null);


  if (className === 'on' || val ==='reset') {
    currCategory = '';
    changeCategoryClass();
    removeMarker();
  } else {
    currCategory = id;
    changeCategoryClass(this);
    searchPlaces();
  }
}

// 클릭된 카테고리에만 클릭된 스타일을 적용하는 함수
function changeCategoryClass(el) {
  let category = document.getElementById('category'),
      children = category.children,
      i;
  
  // console.log('children', children)
  for ( i=0; i<children.length; i++ ) {
    if(el.includes(children[i].textContent.trim())) {
      children[i].className = 'on';
    }else{
      children[i].className = '';
    }
  }
  // if (el) {
  //   el.className = 'on';
  //   el.category.className = 'on';
  //   console.log('(el)',el.category.className)
  // } 
} 



//////////
const weatherApiKey = '8f96d88863ec693820e54665e9bbc266';
const translateApiKey = 'AIzaSyDKJMc8rwed5Dr6KyFzR2AvOvZpgidnH1c';
const languageMap = {
    'ko': '한국어',
    'en': 'English',
    'ja': '日本語',
    'zh': '中文'
};

let currentLanguage = 'ko'; // 현재 선택된 언어

// 초기 텍스트 저장용 객체
const initialTexts = {};

function initializeWeather(city) {
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${weatherApiKey}&units=metric&lang=kr`;

    function updateWeather() {
        const weatherElement = document.querySelector('.navbar-text');
        weatherElement.innerHTML = '날씨 정보를 불러오는 중...';

        fetch(weatherUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                if (data.cod === 200) {
                    const temperature = data.main.temp.toFixed(1); // 소수점 첫째 자리까지
                    const weatherDescription = data.weather[0].description;
                    const iconCode = data.weather[0].icon;
                    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

                    weatherElement.innerHTML = `
                        <img src="${iconUrl}" alt="${weatherDescription}" style="width: 30px; margin-right: 10px;">
                        <span>${temperature}°C</span>
                    `;

                    // 날씨 정보가 업데이트된 후 번역
                    translateUpdatedContent();
                } else {
                    weatherElement.textContent = '날씨 정보를 불러오는데 실패했습니다.';
                }
            })
            .catch(error => {
                console.error('Error fetching weather data:', error);
                weatherElement.textContent = '날씨 정보를 불러오는데 실패했습니다.';
            });
    }

    updateWeather();
    setInterval(updateWeather, 600000); // 600000ms = 10분
}

function saveInitialTexts() {
    const elements = document.querySelectorAll('.translatable');
    elements.forEach((element, index) => {
        initialTexts[index] = element.textContent.trim();
    });
}

function restoreInitialTexts() {
    const elements = document.querySelectorAll('.translatable');
    elements.forEach((element, index) => {
        element.textContent = initialTexts[index];
    });
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function translatePage(language) {
    currentLanguage = language; // 현재 선택된 언어 업데이트

    // 드롭다운 메뉴의 텍스트 변경
    document.getElementById('languageDropdown').textContent = languageMap[language];

    if (language === 'ko') {
        restoreInitialTexts();
        return; // 한국어일 경우 번역하지 않음
    }

    const elements = document.querySelectorAll('.translatable');
    const texts = Array.from(elements).map(element => element.textContent.trim());
    
    const requestBody = {
        q: texts,
        target: language,
        format: 'text'
    };

    fetch(`https://translation.googleapis.com/language/translate/v2?key=${translateApiKey}`, {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            console.error('Error translating text:', data.error);
            return;
        }
        const translations = data.data.translations;
        elements.forEach((element, index) => {
            element.textContent = capitalizeFirstLetter(translations[index].translatedText);
        });
    })
    .catch(error => {
        console.error('Error translating text:', error);
    });
}

function translateUpdatedContent() {
    if (currentLanguage === 'ko') {
        restoreInitialTexts();
        return; // 한국어일 경우 번역하지 않음
    }

    const elements = document.querySelectorAll('.translatable');
    const texts = Array.from(elements).map(element => element.textContent.trim());
    
    const requestBody = {
        q: texts,
        target: currentLanguage,
        format: 'text'
    };

    fetch(`https://translation.googleapis.com/language/translate/v2?key=${translateApiKey}`, {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            console.error('Error translating text:', data.error);
            return;
        }
        const translations = data.data.translations;
        elements.forEach((element, index) => {
            element.textContent = capitalizeFirstLetter(translations[index].translatedText);
        });
    })
    .catch(error => {
        console.error('Error translating text:', error);
    });
}

// 초기 텍스트 저장
saveInitialTexts();

// 날씨 정보 초기화
initializeWeather('Seoul');