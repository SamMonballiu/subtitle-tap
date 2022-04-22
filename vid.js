//chrome.exe --user-data-dir="C://Chrome dev session" --disable-web-security
//https://stackoverflow.com/questions/3102819/disable-same-origin-policy-in-chrome

let subtitles = [];
let activeTrack = 0;

// show a toggle button as an alternative to tapping the video
var showToggleButton = true;

let toggle;
let audio;
let video;
let sub;

function getSubtitles(trackIndex) {
  console.log("getSubtitles");
  var trk = audio.textTracks[trackIndex];
  if (!trk) {
    console.log("no track");
    return [];
  }

  if (!trk.cues) {
    console.log("no cues");
    return [];
  }

  return Array.from(trk.cues).map((cue) => ({
    start: cue.startTime,
    end: cue.endTime,
    text: cue.text,
  }));
}

function showSubtitle() {
  var currentTime = audio.currentTime;
  var relevantSubtitle = subtitles.find(
    (st) => st.start <= currentTime && st.end >= currentTime
  );
  sub.innerText = relevantSubtitle?.text || "";
}

function toggleActiveSubtitle() {
  console.log("toggleActiveSubtitle");
  if (audio.currentTime === 0) {
    if (subtitles.length === 0) {
      subtitles = getSubtitles(0);
    }
    audio.play();
    toggle.innerText = `Toggle active track (current: ${activeTrack})`;
    return;
  }

  if (activeTrack === 0) {
    activeTrack = 1;
    subtitles = getSubtitles(1);
  } else {
    activeTrack = 0;
    subtitles = getSubtitles(0);
  }

  toggle.innerText = `Toggle active track (current: ${activeTrack})`;
}

function setup() {
  var toggle = document.getElementById("toggle");
  var audio = document.getElementById("audio");
  var sub = document.getElementById("sub");
  var video = document.getElementById("video");

  console.log("running setup.");
  console.log("toggle: ",  toggle);
  console.log("video: ", video);

  toggle.addEventListener("click", toggleActiveSubtitle);

  if (!showToggleButton) {
    toggle.classList.add("hidden");
  }

  audio.addEventListener("timeupdate", showSubtitle);
  audio.addEventListener("ended", function () {
    audio.currentTime = 0;
  });

  video.addEventListener("touchend", function () {
    console.log("video touch");
    toggleActiveSubtitle();
  });

  document.getElementById("kor").addEventListener("loaded", function () {
    subtitles = getSubtitles(0);
  });

  video.addEventListener("canplay", function () {
    audio.textTracks[0].mode = "hidden";
    audio.textTracks[1].mode = "hidden";
    video.volume = 0;
    video.play();

    setTimeout(() => {
      audio.textTracks[0].addCue(new VTTCue(0, 12, "[Test Eng]"));
      audio.textTracks[1].addCue(new VTTCue(0, 12, "[Test Kor]"));
    }, 2000);
  });
}

window.addEventListener("DOMContentLoaded", () => {
  toggle = document.getElementById("toggle");
  audio = document.getElementById("audio");
  sub = document.getElementById("sub");
  video = document.getElementById("video");
  console.log("hello from javascript!");
  setup();
});
