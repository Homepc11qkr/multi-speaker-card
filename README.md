https://github.com/Homepc11qkr/multi-speaker-card/blob/main/README.md

✅ README.md (영문 설명 포함)
markdown
복사편집
# Multi Speaker Card 🎶

A custom Lovelace card for Home Assistant that provides a convenient interface to control multiple items such as speaker selection, volume control, mute/unmute, stop, and custom radio station buttons for `media_player`.

> 🛠️ Forked and customized from the original `jukebox-card` by **Homepc11qkr**.

---

## 📦 Installation

### Manual Installation

1. Download the file `multi-speaker-card.js`.
2. Place it in your Home Assistant `www/community/multi-speaker-card/` folder.

   - If the folder doesn't exist, create it:  
     `/config/www/community/multi-speaker-card/`

3. Add the following to your `configuration.yaml` (or via *Settings > Dashboards > Resources* in the UI):

```yaml
resources:
  - url: /local/community/multi-speaker-card/multi-speaker-card.js
    type: module
Restart Home Assistant or refresh your browser cache.

🧩 Lovelace Card Configuration
Add the card to your dashboard in YAML mode:

yaml
복사편집
type: custom:multi-speaker-card
entities:
  - media_player.living_room_speaker
  - media_player.bedroom_speaker
  - media_player.kitchen_speaker
links:
  - name: jazz
    url: http://example.com/jazz-stream
  - name: news
    url: http://example.com/news-stream
  - name: pop
    url: http://example.com/pop-stream
🔑 Parameters
Key	Type	Required	Description
entities	list	✅	A list of media_player entity IDs to control
links	list	✅	A list of station buttons (name + stream URL)

🖼️ Features
Speaker switch tabs

Volume control slider

Mute/unmute button

Stop button

Station play buttons

📸 Screenshot


📄 License
MIT License

🙋‍♂️ Credits
Original: jukebox-card

Customized by: Homepc11qkr

Tested and modified for compatibility with Home Assistant OS 2025.5.0.
⚠️ Note: The original jukebox-card does not function in HAOS 2025.5.0 due to version issues.
✅ This version has been fixed to work properly with HAOS 2025.5.0.


✅ README.md (한글 설명)
markdown
복사
편집
# 멀티 스피커 카드 🎶

Home Assistant용 맞춤형 Lovelace 카드로, 여러 `media_player` 엔티티에 대해 스피커 선택, 볼륨 조절, 음소거/해제, 정지, 사용자 정의 라디오 방송국 버튼 등을 제어할 수 있는 편리한 인터페이스를 제공합니다.

> 🛠️ 원본 `jukebox-card`에서 포크되어 **Homepc11qkr** 님이 커스터마이징했습니다.

---

## 📦 설치

### 수동 설치

1. `multi-speaker-card.js` 파일을 다운로드합니다.  
2. Home Assistant의 `www/community/multi-speaker-card/` 폴더에 파일을 넣습니다.

   - 폴더가 없다면 새로 만듭니다:  
     `/config/www/community/multi-speaker-card/`

3. 다음을 `configuration.yaml`에 추가하거나  
   *설정 > 대시보드 > 리소스* UI를 통해 리소스를 추가합니다:

```yaml
resources:
  - url: /local/community/multi-speaker-card/multi-speaker-card.js
    type: module
Home Assistant를 재시작하거나 브라우저 캐시를 새로고침합니다.

🧩 Lovelace 카드 설정
YAML 모드에서 카드 구성을 추가하세요:

yaml
복사편집
type: custom:multi-speaker-card
entities:
  - media_player.living_room_speaker
  - media_player.bedroom_speaker
  - media_player.kitchen_speaker
links:
  - name: jazz
    url: http://example.com/jazz-stream
  - name: news
    url: http://example.com/news-stream
  - name: pop
    url: http://example.com/pop-stream
🔑 설정 키 설명
키	타입	필수	설명
entities	list	✅	제어할 media_player 엔티티 ID 목록
links	list	✅	이름과 스트림 URL을 포함한 방송국 버튼 목록

🖼️ 주요 기능
스피커 전환 탭

볼륨 조절 슬라이더

음소거/음소거 해제 버튼

정지 버튼

방송국 재생 버튼

📸 스크린샷


📄 라이선스
MIT 라이선스

🙋‍♂️ 크레딧
원본: jukebox-card

커스터마이징: Homepc11qkr

Home Assistant OS 2025.5.0에서 테스트 및 수정되었습니다.
⚠️ 참고: 원본 jukebox-card는 HAOS 2025.5.0에서 방송이 동작하지 않습니다.
✅ 이 버전은 HAOS 2025.5.0과 호환되도록 수정되었습니다.

 수정정보 공유 > 2025_0519_1236_48
https://cafe.naver.com/homestation/333
