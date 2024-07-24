const weatherApiKey = '8f96d88863ec693820e54665e9bbc266';
const translateApiKey = 'AIzaSyDKJMc8rwed5Dr6KyFzR2AvOvZpgidnH1c';
const languageMap = {
  ko: '한국어',
  en: 'English',
  ja: '日本語',
  zh: '中文',
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
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
      })
      .then((data) => {
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
      .catch((error) => {
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
  document.getElementById('languageDropdown').textContent =
    languageMap[language];

  if (language === 'ko') {
    restoreInitialTexts();
    return; // 한국어일 경우 번역하지 않음
  }

  const elements = document.querySelectorAll('.translatable');
  const texts = Array.from(elements).map((element) =>
    element.textContent.trim()
  );

  const requestBody = {
    q: texts,
    target: language,
    format: 'text',
  };

  fetch(
    `https://translation.googleapis.com/language/translate/v2?key=${translateApiKey}`,
    {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )
    .then((response) => response.json())
    .then((data) => {
      if (data.error) {
        console.error('Error translating text:', data.error);
        return;
      }
      const translations = data.data.translations;
      elements.forEach((element, index) => {
        element.textContent = capitalizeFirstLetter(
          translations[index].translatedText
        );
      });
    })
    .catch((error) => {
      console.error('Error translating text:', error);
    });
}

function translateUpdatedContent() {
  if (currentLanguage === 'ko') {
    restoreInitialTexts();
    return; // 한국어일 경우 번역하지 않음
  }

  const elements = document.querySelectorAll('.translatable');
  const texts = Array.from(elements).map((element) =>
    element.textContent.trim()
  );

  const requestBody = {
    q: texts,
    target: currentLanguage,
    format: 'text',
  };

  fetch(
    `https://translation.googleapis.com/language/translate/v2?key=${translateApiKey}`,
    {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )
    .then((response) => response.json())
    .then((data) => {
      if (data.error) {
        console.error('Error translating text:', data.error);
        return;
      }
      const translations = data.data.translations;
      elements.forEach((element, index) => {
        element.textContent = capitalizeFirstLetter(
          translations[index].translatedText
        );
      });
    })
    .catch((error) => {
      console.error('Error translating text:', error);
    });
}

// 초기 텍스트 저장
saveInitialTexts();

// 날씨 정보 초기화
initializeWeather('Seoul');
