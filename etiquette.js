const question = document.getElementById("select_btn");
const chatContent = document.getElementById("chat_content");
let selectInput = document.getElementById("select_input");

// 잘문종료 후 리셋을 위한 새로고침
function reloadStart(){
    setTimeout(() => {window.location.reload();
    }, 500); 
}

// 질문클릭
question.addEventListener("click", () => {
    let chatList = document.querySelector(".chat_content");
    let selectValue = selectInput.value;
    let resultHtml = [];
    function addQuestionPrompt() {
        resultHtml.push(`<li class="bot_left">무엇이 궁금하신가요?</li>`);
      }

// 선택된 옵션 가져오기
let selectedOption = selectInput.options[selectInput.selectedIndex];

// 선택된 옵션이 이미 disabled 상태라면 제거하지 않고 건너뛰기
if (!selectedOption.disabled) {
  // 선택된 옵션을 disabled, hidden 처리
  selectedOption.disabled = true;
  selectedOption.hidden = true;

  // 선택된 옵션을 제거하기
  selectInput.remove(selectInput.selectedIndex);
} 
// 첫 번째 옵션 선택하기
selectInput.selectedIndex = 0;


    // 버튼 ID에 따라 텍스트 변경
    switch (selectValue) {
        case "que1":
            resultHtml.push(`<li class="bot_right">한국에서는 대중교통에서 음식물을 먹어도 되나요?</li>`);
            resultHtml.push(`<li class="bot_left">한국에서 대중교통에서 음식물을 먹는 것은 허용되지 않습니다. 대부분의 지하철과 버스에서는 음식물 반입과 섭취가 금지되어 있습니다. 단, 물이나 주스 같은 음료는 마실 수 있습니다.
이는 다른 승객들의 불편을 최소화하고 깨끗한 대중교통 환경을 유지하기 위한 규칙입니다. 대중교통 내에서는 음식물 섭취를 자제하시는 것이 좋습니다. 만약 배고프시다면 역이나 정류장에서 먹는 것이 좋습니다. 이 규칙을 지켜주셔서 감사합니다.</li>`);  
if (selectInput.length > 1) {resultHtml.push(`<li class="bot_left">궁금한 점이 더 있으시면 말씀해 주세요.</li>`);}  
break;

        case "que2":
            resultHtml.push(`<li class="bot_right">한국에서 식사할 때 지켜야 할 예절은 무엇인가요?</li>`);
            resultHtml.push(`<li class="bot_left">네, 한국에서 식사할 때 지켜야 할 예절이 몇 가지 있습니다:
<br>1. 숟가락과 젓가락으로 식사하는 것이 일반적입니다. 젓가락을 사용할 때는 끝을 상대방을 향하지 않도록 주의해야 합니다.
<br>2. 상대방의 음식을 건드리거나 건드리려 하지 않습니다. 자신의 음식만 먹습니다.
<br>3. 음식을 입에 넣을 때는 크게 소리나지 않도록 조심해야 합니다.
<br>4. 음식을 먹으면서 크게 말하거나 웃지 않습니다. 조용히 먹는 것이 예의입니다.
<br>5. 식사 중에 스마트폰 사용은 자제하는 것이 좋습니다.
<br>6. 식사가 끝나면 감사 인사를 하는 것이 일반적입니다.
<br> 이러한 예절을 지켜 주시면 한국 문화에 대한 이해도가 높아질 것입니다. </li>`);
if (selectInput.length > 1) {resultHtml.push(`<li class="bot_left">궁금한 점이 더 있으시면 말씀해 주세요.</li>`);}  
            break;

        case "que3":
            resultHtml.push(`<li class="bot_right">한국에서 존댓말을 언제 사용해야 하나요?</li> `);
            resultHtml.push(`<li class="bot_left">네, 한국에서는 상대방의 나이, 지위, 관계에 따라 존댓말을 사용해야 합니다.
<br> 
일반적으로 다음과 같은 경우에 존댓말을 사용하는 것이 좋습니다:
<br>1. 나이가 많은 사람에게
<br>2. 직급이나 직위가 높은 사람에게
<br>3. 처음 만나는 사람에게
<br>4. 공식적인 자리에서
<br>5. 상대방을 공손하게 대우하고 싶을 때
<br>6. 예를 들어 선배나 교수님, 상사 등에게는 존댓말을 사용하고, 또래나 친구, 가족에게는 반말을 사용하는 것이 일반적입니다.
<br> 
존댓말을 사용하지 않으면 무례하게 보일 수 있으므로, 상황에 맞는 적절한 존댓말 사용이 중요합니다. </li> `);
if (selectInput.length > 1) {resultHtml.push(`<li class="bot_left">궁금한 점이 더 있으시면 말씀해 주세요.</li>`);}  
            break;

        case "que4":
            resultHtml.push(`<li class="bot_right">한국에서는 어떤 행동이 무례하다고 여겨지나요?</li> `);
            resultHtml.push(`<li class="bot_left">한국에서 다음과 같은 행동들은 무례한 것으로 여겨집니다:
<br>1. 음식을 먹으면서 크게 말하거나 소리 내는 것
<br>2. 식사 중에 스마트폰을 사용하는 것
<br>3. 상대방의 개인 공간을 침범하는 것
<br>4. 상대방을 향해 손가락으로 가리키는 것
<br>5. 상대방의 눈을 똑바로 쳐다보지 않는 것
<br>6. 엘리베이터에서 먼저 타려고 밀치는 것
<br>7. 공공장소에서 큰 소리로 통화하는 것
<br>8. 흡연 구역 이외의 장소에서 흡연하는 것
<br>이러한 행동들은 한국 문화에서 예의바르지 않은 것으로 여겨집니다. 상대방을 존중하고 배려하는 태도가 중요합니다. </li>`);
if (selectInput.length > 1) {resultHtml.push(`<li class="bot_left">궁금한 점이 더 있으시면 말씀해 주세요.</li>`);}  
            break;

        case "que5":
            resultHtml.push(`<li class="bot_right">식당에서 팁을 줘야 하나요?</li> `);
            resultHtml.push(`<li class="bot_left">한국에서는 식당에서 팁을 주는 것이 일반적이지 않습니다.
한국 문화에서는 서비스 요금이 이미 음식 가격에 포함되어 있기 때문에 별도의 팁을 주지 않는 것이 관행입니다.
다만 고급 레스토랑이나 특별한 서비스를 받은 경우에는 팁을 주는 것이 좋습니다. 팁은 총 계산액의 5-10% 정도가 적당합니다.
하지만 팁을 주는지 여부는 개인의 선택이며, 팁을 주지 않아도 문제가 되지 않습니다. 한국 문화에서는 팁을 강요하지 않습니다.
다만 해외에서 자주 가던 식당에서는 팁 문화가 자리 잡혀 있을 수 있으니 그런 경우에는 팁을 주는 것이 좋습니다. </li>`);
if (selectInput.length > 1) {resultHtml.push(`<li class="bot_left">궁금한 점이 더 있으시면 말씀해 주세요.</li>`);}  
            break;

        default:
            break;
    }

    //모든 질문이 끝난 후 마지막
    if (selectInput.length == 1) {
        resultHtml.push(`<li class="bot_left">축하합니다! 필요한 에티켓을 전부 배우셨어요!</li><li class="bot_left">
            <button class="reset_btn" onclick="reloadStart()">채팅 다시 시작하기</button>   </li>`);
            question.disabled = true;
        }  
 
    resultHtml.forEach((html, index) => {
        setTimeout(() => {
            document.getElementById("chat_content").innerHTML += html;
            chatList.scrollTop = chatList.scrollHeight;
        }, index * 1000); // 각 li 요소에 1초씩 지연 시간 적용
    });
 
});