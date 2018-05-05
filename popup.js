function sendMessageToActiveTab(message, callback) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    tab = tabs[0];
    chrome.tabs.sendMessage(tab.id, message, callback);
  });
};


function init() {
  var transpose = false;

  var enabled = document.getElementById('enabled');

  var pitch = document.getElementById('pitch');
  var pitchValue = document.getElementById('pitch-value');
  var pitchShiftTypeSelect = document.getElementById('pitch-shift-type');
  var pitchReset = document.getElementById('pitch-reset');

  var playbackRate = document.getElementById('playback-rate');
  var playbackRateValue = document.getElementById('playback-rate-value');
  var playbackRateReset = document.getElementById('playback-rate-reset');
  
  var a4Slider = document.getElementById('A4-Frequency-slider');
  var a4Value = document.getElementById('A4-Frequency-value');
  var a4Reset = document.getElementById('A4-Frequency-reset');

  function seta4Value(_a4Value) {
    a4Slider.value = _a4Value;
    a4Value.textContent = _a4Value;
  }


  function setPitchValue(_pitchValue) {
    pitch.value = _pitchValue;
    pitchValue.textContent = _pitchValue;
  }

  function setPlaybackRate(_playbackRate) {
    playbackRate.value = _playbackRate;
    playbackRateValue.textContent = _playbackRate;
  }

  function setPitchShiftTypeSmooth() {
    pitch.max = 1;
    pitch.min = -1;
    pitch.step = 0.01;
    pitchShiftTypeSelect.selectedIndex = 0;
    transpose = false;
  }

  function setPitchShiftTypeSemiTone() {
    pitch.max = 24;
    pitch.min = -24;
    pitch.step = 1;
    pitchShiftTypeSelect.selectedIndex = 1;
    transpose = true;
  }

  sendMessageToActiveTab({type: 'get'}, function (values) {
    if (values.transpose !== undefined && values.transpose !== null) {
      if (values.transpose) {
        setPitchShiftTypeSemiTone();
      } else {
        setPitchShiftTypeSmooth();
      }
    }
    if (values.pitch !== undefined && values.pitch !== null) {
      setPitchValue(values.pitch);
    }
    if (values.a4Value !== undefined && values.a4Value !== null) {
      seta4Value(values.a4Value);
    }
    if (values.playbackRate !== undefined && values.playbackRate !== null) {
      setPlaybackRate(values.playbackRate);
    }
    if (values.enabled !== undefined && values.enabled !== null) {
      enabled.checked = values.enabled;
    }

  });

  enabled.addEventListener('change', function(event) {
    sendMessageToActiveTab({enabled: enabled.checked});
  }, false);

  pitch.addEventListener('input', function(event) {
    sendMessageToActiveTab({pitch: pitch.value});
    setPitchValue(pitch.value);
  }, false);

  a4Slider.addEventListener('input', function(event) {
    sendMessageToActiveTab({a4Value: a4Slider.value});
    seta4Value(a4Slider.value);
  }, false);

  a4Reset.addEventListener('click', function(event) {
    sendMessageToActiveTab({a4Value: 440});
    seta4Value(440);
  }, false);


  pitchShiftTypeSelect.addEventListener('change', function(event) {
    var opt = pitchShiftTypeSelect.options[pitchShiftTypeSelect.selectedIndex]
    if (opt.value == 'smooth') {
      setPitchShiftTypeSmooth();
      setPitchValue(0);
    } else if (opt.value == 'semi-tone') {
      setPitchShiftTypeSemiTone();
      setPitchValue(0);
    }
    sendMessageToActiveTab({transpose: transpose, pitch: pitch.value});
  }, false);

  pitchReset.addEventListener('click', function(event) {
    sendMessageToActiveTab({pitch: 0});
    setPitchValue(0);
  }, false);

  playbackRate.addEventListener('input', function(event) {
    sendMessageToActiveTab({playbackRate: playbackRate.value});
    setPlaybackRate(playbackRate.value);
  }, false);

  playbackRateReset.addEventListener('click', function(event) {
    sendMessageToActiveTab({playbackRate: 1});
    setPlaybackRate(1);
  }, false);
}

var readyStateCheckInterval = setInterval(function() {
    if (document.readyState === "complete") {
        clearInterval(readyStateCheckInterval);
        init();
    }
}, 10);


//links at the bottom
document.addEventListener('DOMContentLoaded', function () {
  document.querySelector('#about').addEventListener('click', function() {
      window.open("https://sites.google.com/view/videotuner/home");
  });

  document.querySelector('#feedback').addEventListener('click', function() {
      window.open("https://sites.google.com/view/videotuner/feedback");
  });
});


