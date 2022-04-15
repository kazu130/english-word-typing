var hinshi_list = [
  ["ｍ", "meishi"],
  ["ｔ", "tadoushi"],
  ["ｊ", "jidoushi"],
  ["ｋ", "keiyoushi"],
  ["ｚ", "zenchishi"],
  ["ｓ", "setsuzokushi"],
  ["ｆ", "fukushi"],
  ["ｃ", "jukugo"],
  ["ｈ", "settou"],
];

function getRnd(max) {
  return Math.floor(Math.random() * 10000) % max;
}
async function updateProblems() {
  words_num.shift();
  words_ja.shift();
  words_en.shift();
  replaced_words_ja.shift();
  while (1) {
    rnd0 = getRnd(3);
    if (rnd0 == 0) {
      rnd = preferred_words[getRnd(preferred_words.length)];
    } else {
      rnd = getRnd(word_list.length);
    }
    if (rnd != words_num[1]) break;
  }
  words_num.push(rnd);
  //   words_ja.push(word_list[rnd][1].replace(/[ａ-ｚ]/g, ""));
  words_ja.push(word_list[rnd][1]);
  words_en.push(word_list[rnd][0]);
  let replaced = words_ja[2];
  for (let i = 0; i < hinshi_list.length; i++) {
    replaced = replaced.replace(
      hinshi_list[i][0],
      '<br><img src="img/icon_' +
        hinshi_list[i][1] +
        '.png" class="hinshi-icon">'
    );
  }
  replaced = replaced.replace(/(\<br\>\<img[^>]*?\>)\<br\>/, "$1");
  replaced_words_ja.push(replaced.replace(/^\<br\>/, ""));
}
function drawWords() {
  $("#word-container").hide();
  $("#word2").html(replaced_words_ja[2]);
  $("#word1").html(replaced_words_ja[1]);
  $("#word0").html(replaced_words_ja[0]);
  $("#word-container").fadeIn(300);
}
function updateResults() {
  return new Promise((resolve, reject) => {
    try {
      for (let i = 0; i < results.length; i++) {
        if (results[i][0] == words_num[0]) {
          if (!miss_flag) {
            results[i][2][0]++;
          } else {
            results[i][2][1]++;
          }
          let rate;
          if (results[i][2][0] != 0) {
            rate = results[i][2][0] / (results[i][2][0] + results[i][2][1]);
          } else {
            rate = 0;
          }
          results[i][2][2] = rate * 100;
          results.sort(function (a, b) {
            if (a[2][2] < b[2][2]) return -1;
            if (a[2][2] > b[2][2]) return 1;
            if (a[2][1] > b[2][1]) return -1;
            if (a[2][1] < b[2][1]) return 1;
            if (a[2][0] < b[2][0]) return -1;
            if (a[2][0] > b[2][0]) return 1;
          });
          results_i = i;
          break;
        }
      }
      resolve();
    } catch (e) {
      reject();
    }
  });
}
function updatePreResult(num) {
  for (let i = 0; i < results.length; i++) {
    if (results[i][0] == words_num[0]) {
      console.log(results[i]);
      console.log(num, i);
      $("#pre-ja-box").html(replaced_words_ja[0]);
      let span = "</span><span>";
      $("#pre-result-box").html(
        "<span>" +
          (i + 1) +
          span +
          results[i][1][0] +
          span +
          (Math.floor(results[i][2][2]) + "<span class='unit'>%</span>") +
          span +
          results[i][2][0] +
          span +
          results[i][2][1] +
          span +
          (results[i][0] + 1) +
          "</span>"
      );
      break;
    }
  }
}
function drawResults() {
  $("#results-table").html(
    "<tr><th>Rank</th><th>Word</th><th>Rate</th><th>O</th><th>X</th><th>No.</th></tr>"
  );
  preferred_words = [];
  for (let i = 0; i < 50; i++) {
    $("#results-table").append(
      $("<tr>").append(
        $("<td>", {
          class: "result-rank",
          text: i + 1,
        }),
        $("<td>", {
          class: "result-word",
          id: "rw" + i,
          text: results[i][1][0],
        }),
        $("<td>", {
          class: "result-rate",
          html: Math.floor(results[i][2][2]) + '<span class="unit">%</span>',
        }),
        $("<td>", {
          class: "result-correct",
          text: results[i][2][0],
        }),
        $("<td>", {
          class: "result-miss",
          text: results[i][2][1],
        }),
        $("<td>", {
          class: "result-number",
          text: results[i][0] + 1,
        })
      )
    );
    if (results[i][2][0] + results[i][2][1] != 0 && i < 10) {
      preferred_words.push(results[i][0]);
    }
  }
}

function seeMoreResults() {
  $("#see-more-results-button").text("Loading...");
  setTimeout(() => {
    for (let i = 50; i < results.length; i++) {
      results[i][2][2] = results[i][2][2] == "-" ? 0 : results[i][2][2];
      $("#results-table").append(
        $("<tr>").append(
          $("<td>", {
            class: "result-rank",
            text: i + 1,
          }),
          $("<td>", {
            class: "result-word",
            id: "rw" + i,
            text: results[i][1][0],
          }),
          $("<td>", {
            class: "result-rate",
            html: Math.floor(results[i][2][2]) + '<span class="unit">%</span>',
          }),
          $("<td>", {
            class: "result-correct",
            text: results[i][2][0],
          }),
          $("<td>", {
            class: "result-miss",
            text: results[i][2][1],
          }),
          $("<td>", {
            class: "result-number",
            text: results[i][0] + 1,
          })
        )
      );
    }
    $("#see-more-results-button").hide();
    $("#see-more-results-button").text("See all");
  }, 500);
  // setTimeout(() => {
  //   setHoverListener();
  // }, 15000);
}

function speak(text) {
  var speak = new SpeechSynthesisUtterance();
  speak.text = text;
  speak.rate = 1;
  speak.pitch = 1.3;
  speak.lang = "en-US";

  speechSynthesis.speak(speak);
}

function init() {
  if (localStorage.getItem("theme")) {
    if (localStorage.getItem("theme") == "dark") {
      toDarkTheme();
    } else {
      toLightTheme();
    }
  } else {
    toLightTheme();
  }
  if (localStorage.getItem("results_array")) {
    results = JSON.parse(localStorage.getItem("results_array"));
  } else {
    for (let i = 0; i < word_list.length; i++) {
      results.push([i]);
      results[i].push([word_list[i][0], word_list[i][1]]);
      results[i].push([0, 0, 0]);
    }
  }
  for (let i = 0; i < 3; i++) {
    let rnd = getRnd(word_list.length);
    words_num.push(rnd);
    words_en.push(word_list[rnd][0]);
    words_ja.push(word_list[rnd][1]);
  }
  for (let j = 0; j < 3; j++) {
    var replaced = words_ja[j];
    for (let i = 0; i < hinshi_list.length; i++) {
      replaced = replaced.replace(
        hinshi_list[i][0],
        '<br><img src="img/icon_' +
          hinshi_list[i][1] +
          '.png" class="hinshi-icon">'
      );
    }
    replaced = replaced.replace(/(\<br\>\<img[^>]*?\>)\<br\>/, "$1");
    replaced_words_ja.push(replaced.replace(/^\<br\>/, ""));
  }
  setTimeout(() => {
    drawWords();
    drawResults();
    $(".result-word").hover(function (e) {
      showJa(e);
    });
  }, 100);
}

var results_i;
var rnd;
var preferred_words = [];
var results = [];
var words_num = [];
var words_en = [];
var words_ja = [];
var replaced_words_ja = [];
var miss_count = 0;
var miss_flag = false;
init();

$("#input-box").on("input", async function (e) {
  let input_val = $("#input-box").val();
  if (input_val == words_en[0]) {
    if (miss_count == 0) {
      speak(input_val);
    }
    $("#input-box").val("");
    $("#answer").text("");

    updateResults()
      .then(() => {
        updatePreResult(results_i);
      })
      .then(() => {
        drawResults();
      })
      .then(() => {
        localStorage.setItem("results_array", JSON.stringify(results));
        updateProblems();
      })
      .then(() => {
        drawWords();
        $(".result-word").hover(function (e) {
          showJa(e);
        });
      })
      .catch((e) => {
        console.log(e);
      });
    $("#see-more-results-button").show();
    miss_count = 0;
    miss_flag = false;
  } else if (input_val.slice(-1) != words_en[0][input_val.length - 1]) {
    $("#input-box").val("");
    miss_count++;
  }
  if (miss_count >= 1 && !miss_flag) {
    $("#answer").text(words_en[0]);
    $("#input-box").val("");
    miss_flag = true;
    speak(words_en[0]);
  }
});

function toLightTheme() {
  // $("#dark-css").remove();
  // $(".theme-toggle-icon").remove();
  $("head").append(
    $("<link>", {
      rel: "stylesheet",
      href: "css/style_light.css",
      id: "light-css",
    })
  );
  $("#theme-toggle-button").append(
    $("<img>", {
      src: "img/icon/moon.svg",
      class: "theme-toggle-icon",
    })
  );
  localStorage.setItem("theme", "light");
}

function toDarkTheme() {
  $("#light-css").remove();
  $(".theme-toggle-icon").remove();
  $("head").append(
    $("<link>", {
      rel: "stylesheet",
      href: "css/style_dark.css",
      id: "dark-css",
    })
  );
  $("#theme-toggle-button").append(
    $("<img>", {
      src: "img/icon/sun.svg",
      class: "theme-toggle-icon",
    })
  );
  localStorage.setItem("theme", "dark");
}

$("#theme-toggle-button").click(function () {
  $("body").fadeOut(300);
  setTimeout(() => {
    if ($("#dark-css").length) {
      toLightTheme();
    } else {
      toDarkTheme();
    }
  }, 300);
  $("body").fadeIn(300);
});

function setHoverListener() {
  $(".result-word").hover(function (e) {
    showJa(e);
  });
}

function showJa(e) {
  let n = e.target.id.replace(/^(ja-)?rw/, "");
  if (e.target.id.match(/^rw/)) {
    console.log(results[n][1][1]);
    e.target.innerText = results[n][1][1]
      .replace(/[ａ-ｚ]/g, ", ")
      .replace(/^, /, "")
      .replace(/[(（].*?[)）]/g, "");
    e.target.id = "ja-rw" + n;
  } else {
    e.target.innerText = results[n][1][0];
    e.target.id = "rw" + n;
  }
}
