// multi-speaker-card 2025_0517_2321_22 Homepc11qkr 에서 제작
//https://github.com/Homepc11qkr/multi-speaker-card/edit/main/README.md

class MultiSpeakerCard extends HTMLElement {  
  constructor() {
    super();
    this._hassObservers = [];
    this.content = null;
    this._selectedSpeaker = null;
    this._stationButtons = [];
    this._tabs = null;
    this._muteButton = null;
    this._muteIcon = null;
    this._slider = null;
    this._stopButton = null;
    this._stopIcon = null;
    this.config = {};
  }

  set hass(hass) {
    if (!this.content) {
      this.appendChild(this.getStyle());
      const card = document.createElement('ha-card');
      this.content = document.createElement('div');
      this.content.className = 'content';
      card.appendChild(this.content);
      this.appendChild(card);

      this.content.appendChild(this.buildSpeakerSwitches(hass));
      this.content.appendChild(this.buildVolumeSlider());
      this.content.appendChild(this.buildStationList());

      // 2025_0518_1124_45
      const footer = document.createElement('div');
      footer.style = 'text-align: center; font-size: 12px; color: gray; margin-top: 1em;';
      footer.innerHTML = `<a href="https://github.com/Homepc11qkr/multi-speaker-card" target="_blank" style="color: gray; text-decoration: none;">multi-speaker-card by Homepc11qkr</a>`;
      this.content.appendChild(footer);

    }

    this._hass = hass;
    this._hassObservers.forEach(listener => listener(hass));
  }

  get hass() {
    return this._hass;
  }

  buildSpeakerSwitches(hass) {
    this._tabs = document.createElement('div');
    this._tabs.classList.add('tabs-container');
    
    this.config.entities.forEach(entityId => {
      if (!hass.states[entityId]) {
        console.log('MultiSpeakerCard: No State for entity', entityId);
        return;
      }
      this._tabs.appendChild(this.buildSpeakerSwitch(entityId, hass));
    });

    const firstPlayingSpeakerIndex = this.findFirstPlayingIndex(hass);
    this._selectedSpeaker = this.config.entities[firstPlayingSpeakerIndex];
    if (this._tabs.children[firstPlayingSpeakerIndex]) {
      this._tabs.children[firstPlayingSpeakerIndex].classList.add('active');
    }

    return this._tabs;
  }

  buildStationList() {
    this._stationButtons = [];
    const stationList = document.createElement('div');
    stationList.classList.add('station-list');

    const gridContainer = document.createElement('div');
    gridContainer.className = 'stations-grid';
    stationList.appendChild(gridContainer);

    this.config.links.forEach(linkCfg => {
      const stationButton = this.buildStationSwitch(linkCfg.name, linkCfg.url);
      this._stationButtons.push(stationButton);
      gridContainer.appendChild(stationButton);
    });

    this._hassObservers.push(this.updateStationSwitchStates.bind(this));
    return stationList;
  }

  buildVolumeSlider() {
    const volumeContainer = document.createElement('div');
    volumeContainer.className = 'volume-container';

    const muteButton = document.createElement('ha-icon-button');
    const muteIcon = document.createElement('ha-icon');
    muteIcon.icon = 'mdi:volume-high';
    muteButton.appendChild(muteIcon);
    muteButton.isMute = false;
    muteButton.addEventListener('click', this.onMuteUnmute.bind(this));

    const slider = document.createElement('ha-slider');
    slider.min = 0;
    slider.max = 100;
    slider.addEventListener('change', this.onChangeVolumeSlider.bind(this));
    slider.className = 'volume-slider';

    const stopButton = document.createElement('ha-icon-button');
    const stopIcon = document.createElement('ha-icon');
    stopIcon.icon = 'mdi:stop';
    stopButton.appendChild(stopIcon);
    stopButton.setAttribute('disabled', true);
    stopButton.addEventListener('click', this.onStop.bind(this));

    this._muteButton = muteButton;
    this._muteIcon = muteIcon;
    this._slider = slider;
    this._stopButton = stopButton;
    this._stopIcon = stopIcon;

    this._hassObservers.push(hass => {
      if (!this._selectedSpeaker || !hass.states[this._selectedSpeaker]) {
        return;
      }
      const speakerState = hass.states[this._selectedSpeaker].attributes;

      const hasVolume = speakerState.hasOwnProperty('volume_level');
      slider.toggleAttribute('hidden', !hasVolume);
      stopButton.toggleAttribute('hidden', !hasVolume);
      muteButton.toggleAttribute('hidden', !speakerState.hasOwnProperty('is_volume_muted'));

      stopButton.toggleAttribute('disabled', hass.states[this._selectedSpeaker].state !== 'playing');

      slider.value = hasVolume ? speakerState.volume_level * 100 : 0;

      const isMuted = speakerState.is_volume_muted;
      muteIcon.icon = isMuted ? 'mdi:volume-off' : 'mdi:volume-high';
      muteButton.isMute = isMuted;
      slider.disabled = isMuted;
    });

    volumeContainer.appendChild(muteButton);
    volumeContainer.appendChild(slider);
    volumeContainer.appendChild(stopButton);
    return volumeContainer;
  }

  onSpeakerSelect(e) {
    Array.from(this._tabs.children).forEach(tab => tab.classList.remove('active'));
    e.currentTarget.classList.add('active');
    this._selectedSpeaker = e.currentTarget.entityId;
    this._hassObservers.forEach(listener => listener(this.hass));
  }

  onChangeVolumeSlider(e) {
    const volPercentage = parseFloat(e.currentTarget.value);
    const vol = (volPercentage > 0 ? volPercentage / 100 : 0);
    this.setVolume(vol);
  }

  onMuteUnmute(e) {
    this.hass.callService('media_player', 'volume_mute', {
      entity_id: this._selectedSpeaker,
      is_volume_muted: !e.currentTarget.isMute
    });
  }

  onStop(e) {
    this.hass.callService('media_player', 'media_stop', {
      entity_id: this._selectedSpeaker
    });
  }

  updateStationSwitchStates(hass) {
    let playingUrl = null;
    const selectedSpeaker = this._selectedSpeaker;

    if (hass.states[selectedSpeaker] && hass.states[selectedSpeaker].state === 'playing') {
      playingUrl = hass.states[selectedSpeaker].attributes.media_content_id;
    }

    this._stationButtons.forEach(stationSwitch => {
      stationSwitch.toggleAttribute('active', stationSwitch.stationUrl === playingUrl);
    });
  }

  buildStationSwitch(name, url) {
    const btn = document.createElement('mwc-button');
    btn.stationUrl = url;
    btn.className = 'juke-toggle';
    btn.innerText = name.toUpperCase();
    btn.addEventListener('click', this.onStationSelect.bind(this));
    return btn;
  }

  onStationSelect(e) {
    this.hass.callService('media_player', 'play_media', {
      entity_id: this._selectedSpeaker,
      media_content_id: e.currentTarget.stationUrl,
      media_content_type: 'audio/mp4'
    });
  }

  setVolume(value) {
    this.hass.callService('media_player', 'volume_set', {
      entity_id: this._selectedSpeaker,
      volume_level: value
    });
  }

  findFirstPlayingIndex(hass) {
    return Math.max(0, this.config.entities.findIndex(entityId => {
      return hass.states[entityId] && hass.states[entityId].state === 'playing';
    }));
  }

  buildSpeakerSwitch(entityId, hass) {
    const btn = document.createElement('button');
    btn.entityId = entityId;
    btn.classList.add('speaker-tab');
    btn.innerText = hass.states[entityId].attributes.friendly_name;
    btn.addEventListener('click', this.onSpeakerSelect.bind(this));
    return btn;
  }

  setConfig(config) {
    if (!config.entities) {
      throw new Error('You need to define your media player entities');
    }
    if (!config.links) {
      throw new Error('You need to define your radio station links');
    }
    this.config = config;
  }

  getCardSize() {
    return 3;
  }

  getStyle() {
    const style = document.createElement('style');
    style.textContent = `
      .station-list {
        padding: 5px;
      }

      .stations-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(110px, 1fr));
        gap: 5px;
      }
      .juke-toggle {
        background-color: rgba(255, 255, 255, 0.05); /* 기본 상태 배경 투명 */
        border: 2px solid transparent;
        color: var(--primary-text-color); /* 기본 글자색 */
        font-weight: bold;
        border-radius: 8px;
      }

      .juke-toggle[active] {
        background-color: transparent;      /* 선택 상태 배경 투명 */
        border: 2px solid var(--primary-color); /* 선택 상태 테두리 강조 */
        color: yellow;                      /* 선택 상태 글자색 노랑 */
      }

      mwc-button.juke-toggle {
        width: 100%;
        padding: 1px 1px;
        font-weight: bold;
        background-color: transparent;
        color: #000000;
        border: 2px solid #ccc;
        border-radius: 6px;
        transition: all 0.3s ease;
        text-align: center;
        justify-content: center;
      }

      mwc-button.juke-toggle[active] {
        background-color: transparent;
        border-color: #2196f3;
        color: #ffeb3b !important; /* 노랑색 글자 */
      }


      ha-card {
        display: flex;
        flex-direction: column;
        height: 100%;
        overflow: hidden;
        padding: 4px;
      }

      .content {
        display: flex;
        flex-direction: column;
        height: 100%;
        overflow: hidden;
        gap: 4px;               
      }

      .tabs-container {
        display: flex;
        background-color: rgba(128, 128, 128, 0.1);
        color: var(--text-primary-color);
        overflow-x: auto;
        flex-shrink: 0;
        border-radius: 4px;
      }
     
      .speaker-tab {            
        padding: 8px 12px;
        border: none;
        background: none;
        color: inherit;
        font: inherit;
        cursor: pointer;
        white-space: nowrap;
        position: relative;
        font-size: 0.9rem;
      }
      
      .speaker-tab.active {
        background-color: rgba(128, 128, 128, 0.4); 
      }
      
      .speaker-tab.active::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 2px;
        background-color: var(--text-primary-color);
      }

      .volume-container {
        display: flex;
        align-items: center;
        padding: 8px 12px;
        gap: 4px;
        flex-shrink: 0;
      }

      .volume-slider {
        flex-grow: 1;
      }

      .station-list {
        flex-grow: 0;
        overflow-y: auto;
        width: 100%;
        margin: 0;
      }

      .stations-grid {
        display: inline-block;
        grid-template-columns: repeat( auto-fill, minmax(250px, 1fr) );
        gap: 8px;
        padding: 4px;
      }

      mwc-button.juke-toggle {
      --mdc-theme-primary: var(--primary-text-color);
      --mdc-typography-button-font-size: 0.8rem;
      --mdc-button-horizontal-padding: 2px;
      --mdc-button-height: 20px;
      --mdc-button-outline-width: 1px;
      margin: 1px;
      text-transform: uppercase;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      min-width: 60px; /* ✅ 최소 너비 고정 */
      max-width: 60px; /* ✅ 최대 너비도 고정 */
      height: 30px;     /* ✅ 버튼 높이 고정 36*/
      display: inline-block;
      text-align: center;
      }

      
      mwc-button.juke-toggle[active] {
        --mdc-theme-primary: var(--primary-color);
        background-color: var(--primary-color);
        color: yellow; /* ✅ 글자색 명확하게 지정 */
        font-weight: bold;
        border-radius: 8px;
      }

      ha-icon-button {
        --mdc-icon-button-size: 26px;
        --mdc-icon-size: 26px;
        color: var(--secondary-text-color);
      }

      [hidden] {
        display: none !important;
      }

      /* 재생 중인 버튼에만 스타일 적용 */
      mwc-button[active] {
        background-color:rgb(2, 36, 18) !important; /* 파란색 */
        color: yellow !important;             /* 글자 노란색 */
        border: 1px solidrgb(241, 18, 2);    /* border: 1px solid #2196f3;  */
        font-weight: bold;
        border-radius: 14px;
      }

    `;
    return style;
  }
}


if (!customElements.get('multi-speaker-card')) {  
  customElements.define('multi-speaker-card', MultiSpeakerCard);
}
