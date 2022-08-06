var hinshi_list = [
  ["ｍ", "meishi", "名"],
  ["ｔ", "tadoushi", "他"],
  ["ｊ", "jidoushi", "自"],
  ["ｋ", "keiyoushi", "形"],
  ["ｚ", "zenchishi", "前"],
  ["ｓ", "setsuzokushi", "接"],
  ["ｆ", "fukushi", "副"],
  ["ｃ", "jukugo", "句"],
  ["ｈ", "settou", "接頭"],
];

const hinshiDict = {
  ｍ: {
    kanji: "名詞",
    romaji: "meishi",
    icon: "名",
  },
  ｔ: {
    kanji: "他動詞",
    romaji: "tadoushi",
    icon: "他",
  },
  ｊ: {
    kanji: "自動詞",
    romaji: "jidoushi",
    icon: "自",
  },
  ｋ: {
    kanji: "形容詞",
    romaji: "keiyoushi",
    icon: "形",
  },
  ｚ: {
    kanji: "前置詞",
    romaji: "zenchishi",
    icon: "前",
  },
  ｓ: {
    kanji: "接続",
    romaji: "setsuzokushi",
    icon: "接",
  },
  ｆ: {
    kanji: "副詞",
    romaji: "fukushi",
    icon: "副",
  },
  ｃ: {
    kanji: "句",
    romaji: "jukugo",
    icon: "句",
  },
  ｈ: {
    kanji: "接頭",
    romaji: "settou",
    icon: "接頭",
  },
};

function getRnd(max) {
  return Math.floor(Math.random() * 10000) % max;
}

var previous_ja = "";
async function updateProblems() {
  previous_ja = replaced_words_ja[0];
  words_num.shift();
  words_ja.shift();
  words_en.shift();
  replaced_words_ja.shift();
  while (1) {
    rnd0 = getRnd(3);
    if (rnd0 === 0) {
      rnd = preferred_words[getRnd(preferred_words.length)];
    } else {
      rnd = getRnd(word_list.length);
    }
    if (rnd !== words_num[1]) {
      break;
    }
  }
  words_num.push(rnd);
  words_ja.push(word_list[rnd][1]);
  words_en.push(word_list[rnd][0]);
  replaceHinshiIcon(2);
}
function drawWords() {
  $("#word-box-1").html(replaced_words_ja[1]);
  $("#word-box-0").html(replaced_words_ja[0]);
  $("#problem-number").html(words_num[0] + 1);
}
function updateResults() {
  return new Promise((resolve, reject) => {
    try {
      for (let i = 0; i < results.length; i++) {
        if (results[i][0] === words_num[0]) {
          if (miss_flag === false) {
            results[i][2][0]++;
          } else {
            results[i][2][1]++;
          }
          let rate;
          if (results[i][2][0] !== 0) {
            rate = results[i][2][0] / (results[i][2][0] + results[i][2][1]);
          } else {
            rate = 0;
          }
          results[i][2][2] = rate * 100;
          results.sort(function (a, b) {
            if (a[2][2] < b[2][2]) {
              return -1;
            }
            if (a[2][2] > b[2][2]) {
              return 1;
            }
            if (a[2][1] > b[2][1]) {
              return -1;
            }
            if (a[2][1] < b[2][1]) {
              return 1;
            }
            if (a[2][0] < b[2][0]) {
              return -1;
            }
            if (a[2][0] > b[2][0]) {
              return 1;
            }
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
    if (results[i][0] === words_num[0]) {
      let pre_result = results[i];
      $("#pre-result-en").html(pre_result[1][0]);
      $("#pre-result-ja").html(replaced_words_ja[0]);

      $("#pre-result-rank").html(i + 1);
      $("#pre-result-rate").html(Math.floor(pre_result[2][2]));
      $("#pre-result-correct").html(pre_result[2][0]);
      $("#pre-result-miss").html(pre_result[2][1]);
      $("#pre-result-number").html(pre_result[0]);
      break;
    }
  }
}
function drawResults() {
  $("#results-table").html(
    `<tr class="table-header">
      <th>Rank</th>
      <th>Word</th>
      <th>Rate</th>
      <th>O</th>
      <th>X</th>
      <th>No.</th>
    </tr>`
  );
  preferred_words = [];
  for (let i = 0; i < 50; i++) {
    drawResultRow(i);
    if (results[i][2][0] + results[i][2][1] !== 0 && i < 10) {
      preferred_words.push(results[i][0]);
    }
  }
}

function seeMoreResults() {
  return new Promise((resolve, reject) => {
    $("#see-more-results-button").text("Loading...");
    setTimeout(() => {
      resolve();
    }, 200);
  })
    .then(() => {
      for (let i = 50; i < results.length; i++) {
        results[i][2][2] = results[i][2][2] === "-" ? 0 : results[i][2][2];
        drawResultRow(i);
      }
    })
    .then(() => {
      $("#see-more-results-button").hide();
      $("#see-more-results-button").text("See all");
    })
    .catch((e) => {
      console.log(e);
    });
}

var speakInstance;
function speak(text) {
  speakInstance = new SpeechSynthesisUtterance();
  speakInstance.text = text;
  speakInstance.rate = 1;
  speakInstance.pitch = 1.3;
  speakInstance.lang = "en-US";

  speechSynthesis.speak(speakInstance);
}

async function getResultsArray() {
  results = await JSON.parse(localStorage.getItem("results_array"));
  if (results.length < word_list.length) {
    let len_diff = word_list.length - results.length;
    for (let i = 0; i < len_diff; i++) {
      let n = results.length + i;
      results.push([n]);
      results[n].push([word_list[n][0], word_list[n][1]]);
      results[n].push([0, 0, 0]);
    }
  }
}

var is_dark_theme = false;
function init() {
  if (localStorage.getItem("theme")) {
    if (localStorage.getItem("theme") === "dark") {
      $("html").attr("color-scheme", "dark");
      is_dark_theme = true;
    } else {
      $("html").attr("color-scheme", "light");
    }
  } else {
    $("html").attr("color-scheme", "light");
  }
  if (localStorage.getItem("results_array")) {
    getResultsArray();
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
    replaceHinshiIcon(j);
  }
  setTimeout(() => {
    drawWords();
    drawResults();
  }, 100);
}

function replaceHinshiIcon(n) {
  let rows = [];
  let replaced = words_ja[n];
  let hinshi_keys = Object.keys(hinshiDict).join("");
  let re = new RegExp(`([${hinshi_keys}])(.*?)(?=$|[${hinshi_keys}])`, "g");
  let match = replaced.match(re);
  console.log(match);
  for (let i = 0; i < match.length; i++) {
    let hinshi_key = match[i][0];
    let word_japanese = match[i].slice(1);
    rows.push(
      `
      <div class="word-row">
        <div class="hinshi-icon-${hinshiDict[hinshi_key].romaji}">
          <div class="icon-inner">${hinshiDict[hinshi_key].icon}</div>
        </div>
        <div class="word">${word_japanese}</div>
      </div>
      `
    );
  }
  replaced_words_ja.push(rows.join(""));
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
  if (input_val === words_en[0]) {
    if (miss_count === 0) {
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
      })
      .catch((e) => {
        console.log(e);
      });
    $("#see-more-results-button").show();
    miss_count = 0;
    miss_flag = false;
  } else if (input_val.slice(-1) !== words_en[0][input_val.length - 1]) {
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

$("#theme-toggle-button").on("click", function () {
  $("body").fadeOut(300);
  setTimeout(() => {
    is_dark_theme = !is_dark_theme;
    localStorage.setItem("theme", is_dark_theme ? "dark" : "light");
    $("html").attr("color-scheme", is_dark_theme ? "dark" : "light");
  }, 300);
  $("body").fadeIn(300);
});

$(document).on("mouseover", ".result-word", function (e) {
  targetEn = e.currentTarget.innerText;
});
$(document).on("click", ".result-word", function (e) {
  speechSynthesis.cancel();
  speak(targetEn);
});

var targetEn;

function drawResultRow(i) {
  $("#results-table").append(
    `
    <tr>
      <td class="result-rank">${i + 1}</td>
      <td class="result-word" id="rw${i}">
        <span class="result-word-en">${results[i][1][0]}</span>
        <span class="result-word-ja">
          ${results[i][1][1].replace(/[ａ-ｚ]|\(.*?\)|（.*?）/g, "")}
        </span>
      </td>
      <td class="result-rate">
        ${Math.floor(results[i][2][2])}
        <span class="unit">%</span>
      </td>
      <td class="result-correct">${results[i][2][0]}</td>
      <td class="result-miss">${results[i][2][1]}</td>
      <td class="result-number">${results[i][0]}</td>
    </tr>
    `
  );
}
