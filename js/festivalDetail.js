const currentId = new URL(location.href).searchParams.get('id');
const FESTIVAL_API_KEY =
  '4Jj5rc%2BmE6PU5FPhSUrBLlZ%2F7YU9rhZSd7xA4SnN17zDZGzvJs5bJhMuZKGgwOyDZIDXqzRjWAMakxfgk3jjQQ%3D%3D';
let detailInfo = {};

getDetail();

async function getDetail() {
  const url = new URL(
    `http://apis.data.go.kr/B551011/KorService1/detailCommon1?serviceKey=${FESTIVAL_API_KEY}&contentId=${currentId}&MobileOS=ETC&MobileApp=APPTest&_type=Json&defaultYN=Y&overviewYN=Y&firstImageYN=Y`
  );
  try {
    const res = await fetch(url);
    const data = await res.json();
    console.log(data.response.body.items.item[0]);
    detailInfo = data.response.body.items.item[0];
    render();
  } catch (error) {
    console.log(error);
  }
}

function render() {
  const result = `<img src='${detailInfo.firstimage}'/><br/>${
    detailInfo.overview
  }<br/>${detailInfo.homepage || 'no hompage'}`;
  document.querySelector('.container').innerHTML = result;
}
