// GOOGLE 번역 API
function googleTranslateElementInit() {
  new google.translate.TranslateElement({
    pageLanguage: 'ko',
    includedLanguages: 'ko,en,ja'
  }, 'google_translate_element');
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

// 키워드로 장소를 검색
function keywordSearchPlaces(value, event) {
  event.preventDefault();

  let keyword = value ? value : document.getElementById('keyword').value;
  if (!keyword.replace(/^\s+|\s+$/g, '')) {
    alert('키워드를 입력해주세요!');
    return false;
  }
  
  changeCategoryClass(value);
  ps.keywordSearch(keyword, placesKeywordSearchCB); 
}

// 장소검색이 완료됐을 때 호출되는 콜백함수
function placesKeywordSearchCB(data, status, pagination) {
  if (status === kakao.maps.services.Status.OK) {
    displayKeywordPlaces(data);
    displayPagination(pagination);
  } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
    alert('검색 결과가 존재하지 않습니다.');
    return;
  } else if (status === kakao.maps.services.Status.ERROR) {
    alert('검색 결과 중 오류가 발생했습니다.');
    return;
  }
}

// 검색 결과 목록과 마커를 표출하는 함수
function displayKeywordPlaces(places) {
  let listEl = document.getElementById('placesList');
  let menuEl = document.getElementById('scroll-wrapper'),
      fragment = document.createDocumentFragment(), 
      bounds = new kakao.maps.LatLngBounds();

  removeAllChildNods(listEl);
  removeSearchMarkers();

  for (let i = 0; i < places.length; i++) {
    let placePosition = new kakao.maps.LatLng(places[i].y, places[i].x),
        marker = addKeywordMarker(placePosition, i),
        itemEl = getListItem(i, places[i]);

    bounds.extend(placePosition);

    (function(marker, place) {
      kakao.maps.event.addListener(marker, 'click', function() {
        window.open(`https://place.map.kakao.com/${place.id}`, '_blank');
      });

      kakao.maps.event.addListener(marker, 'mouseover', function() {
        displayInfowindow(marker, place);
      });

      kakao.maps.event.addListener(marker, 'mouseout', function() {
        infowindow.close();
      });

      itemEl.onmouseover = function() {
        displayInfowindow(marker, place);
      };

      itemEl.onmouseout = function() {
        infowindow.close();
      };

      itemEl.onclick = function() {
        window.open(`https://place.map.kakao.com/${place.id}`, '_blank');
      };
    })(marker, places[i]);

    fragment.appendChild(itemEl);
  }

  listEl.appendChild(fragment);
  menuEl.scrollTop = 0;

  map.setBounds(bounds);
}

// 검색결과 항목을 Element로 반환하는 함수
function getListItem(index, places) {
  let el = document.createElement('li'),
      itemStr = '<span class="markerbg marker_' + (index + 1) + '"></span>' +
                '<div class="info">' +
                '   <h5>' + places.place_name + '</h5>';
  if (places.road_address_name) {
    itemStr += '    <span>' + places.road_address_name + '</span>' +
               '   <span class="jibun gray">' + places.address_name + '</span>';
  } else {
    itemStr += '    <span>' + places.address_name + '</span>';
  }
  itemStr += '  <span class="tel">' + places.phone + '</span>' +
             '</div>';

  el.innerHTML = itemStr;
  el.className = 'item';

  return el;
}

// 마커를 생성하고 지도 위에 마커를 표시하는 함수
function addKeywordMarker(position, idx, title) {
  let imageSrc = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_number_blue.png',
      imageSize = new kakao.maps.Size(36, 37),
      imgOptions = {
        spriteSize: new kakao.maps.Size(36, 691),
        spriteOrigin: new kakao.maps.Point(0, (idx * 46) + 10),
        offset: new kakao.maps.Point(13, 37)
      },
      markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imgOptions),
      marker = new kakao.maps.Marker({
        position: position,
        image: markerImage
      });

  marker.setMap(map);
  searchMarkers.push(marker);
  return marker;
}

// 지도 위에 표시되고 있는 마커를 모두 제거
function removeSearchMarkers() {
  for (let i = 0; i < searchMarkers.length; i++) {
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
  return paginationEl;
}

// 검색결과 목록 하단에 페이지번호를 표시는 함수
function displayPagination(pagination) {
  let fragment = document.createDocumentFragment();
  let paginationEl = deletePagination();

  for (let i = 1; i <= pagination.last; i++) {
    let el = document.createElement('a');
    el.href = "#";
    el.innerHTML = i;

    if (i === pagination.current) {
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
function displayInfowindow(marker, place) {
  let content = `<div class="custom-infowindow">
                   <h5>${place.place_name}</h5>
                   <p>${place.road_address_name || place.address_name}</p>
                   <p>${place.phone}</p>
                 </div>`;
  infowindow.setContent(content);
  infowindow.open(map, marker);
}

// 검색결과 목록의 자식 Element를 제거하는 함수
function removeAllChildNods(el) {
  while (el.hasChildNodes()) {
    el.removeChild(el.lastChild);
  }
}

// 카테고리 변경 시 선택된 카테고리 강조
function changeCategoryClass(value) {
  let categoryItems = document.querySelectorAll('#category li');
  categoryItems.forEach(item => {
    if (item.textContent.trim() === value) {
      item.classList.add('on');
    } else {
      item.classList.remove('on');
    }
  });
}