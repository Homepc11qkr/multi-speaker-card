
✅ README.md
markdown
복사
편집
# Multi Speaker Card 🎶

A custom Lovelace card for Home Assistant that provides a convenient interface to control multiple `media_player` entities, including speaker selection, volume control, mute/unmute, stop, and custom radio station buttons.

> 🛠️ Forked and modified from the original `jukebox-card`. Customized by **Homepc11qkr**.

---

## 📦 Installation

### Manual Installation

1. Download the file `multi-speaker-card.js`.
2. Place it in your Home Assistant `www/community/multi-speaker-card/` folder.
   - If the folder doesn't exist, create it:  
     `/config/www/community/multi-speaker-card/`

3. Add the following to your `configuration.yaml` (or through the UI in *Settings > Dashboards > Resources*):

```yaml
resources:
  - url: /local/community/multi-speaker-card/multi-speaker-card.js
    type: module
Restart Home Assistant or refresh your browser cache.

🧩 Lovelace Card Configuration
Add the card to your dashboard in YAML mode:

yaml
복사
편집
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
https://github.com/Homepc11qkr/multi-speaker-card/blob/main/Multi%20Speaker%20Card%20view.png
📄 License
MIT License

🙋‍♂️ Credits
Original: jukebox-card

Customized by: Homepc11qkr
