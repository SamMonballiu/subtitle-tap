//chrome.exe --user-data-dir="C://Chrome dev session" --disable-web-security
//https://stackoverflow.com/questions/3102819/disable-same-origin-policy-in-chrome

let subtitles = [];
let activeTrack = 0;

// show a toggle button as an alternative to tapping the video
const showToggleButton = true;

let toggle;
let audio;
let video;
let sub;

function getSubtitles(trackIndex) {
  const trk = audio.textTracks[trackIndex];
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
  const currentTime = audio.currentTime;
  const relevantSubtitle = subtitles.find(
    (st) => st.start <= currentTime && st.end >= currentTime
  );
  sub.innerText = relevantSubtitle?.text || "";
}

function toggleActiveSubtitle() {
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
  toggle.addEventListener("click", toggleActiveSubtitle);

  if (!showToggleButton) {
    toggle.classList.add("hidden");
  }

  audio.addEventListener("timeupdate", showSubtitle);
  audio.addEventListener("ended", function () {
    audio.currentTime = 0;
  });

  video.addEventListener("touchend", toggleActiveSubtitle);

  document.getElementById("kor").addEventListener("loaded", function () {
    subtitles = getSubtitles(0);
  });

  video.addEventListener("canplay", function () {
    audio.textTracks[0].mode = "hidden";
    audio.textTracks[1].mode = "hidden";
    video.volume = 0;
    video.play();
  });
}

window.addEventListener("DOMContentLoaded", () => {
  toggle = document.getElementById("toggle");
  audio = document.getElementById("audio");
  sub = document.getElementById("sub");
  video = document.getElementById("video");
  setup();
});
