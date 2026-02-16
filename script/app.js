//  Creating element for showing synyms
const showSynonyms = (arr) => {
  console.log(arr);

  const htmlElements = arr.map((synonym) =>
    synonym.length == 0
      ? "No synonym found"
      : `<button class="text-gray-500 bg-sky-100 text-sm p-2 rounded-md capitalize">
                    ${synonym}</button>`,
  );

  return htmlElements.join(" ");
};

/// For getting lessions and levels

const loadLessions = () => {
  const url = `https://openapi.programming-hero.com/api/levels/all`;
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      displayLessions(data.data);
      //   console.log(data.data);
    });
};

// For selecting active tab
const removeActive = () => {
  const lessionButton = document.querySelectorAll(".lession-btn");
  lessionButton.forEach((btn) => {
    btn.classList.remove("active");
  });
  //   console.log(lessionButton);
};

// For getting words
const loadLevelWord = (id) => {
  managingSpinner(true);
  //   console.log(id);
  const url = `https://openapi.programming-hero.com/api/level/${id}`;
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      //   console.log(data.data);
      removeActive();
      const clickBtn = document.getElementById(`lession-btn-${id}`);
      //   console.log(clickBtn);
      clickBtn.classList.add("active");

      displayLevelWords(data.data);
    });
};

// For Getting word's details
const loadWordDetails = async (id) => {
  console.log(id);
  const url = `https://openapi.programming-hero.com/api/word/${id}`;
  const res = await fetch(url);
  const data = await res.json();
  displayWordDetails(data.data);

  //   console.log(data.data);
};

// Showing spinner

const managingSpinner = (status) => {
  if (status === true) {
    document.getElementById("spinner").classList.remove("hidden");
    document.getElementById("words-container").classList.add("hidden");
  } else {
    document.getElementById("words-container").classList.remove("hidden");
    document.getElementById("spinner").classList.add("hidden");
  }
};

// For displaying word's details through a modal

const displayWordDetails = (wordDetails) => {
  managingSpinner(true);
  console.log(wordDetails);

  const detailsModal = document.getElementById("details-container");
  detailsModal.innerHTML = "";

  document.getElementById("word_modal").showModal();

  const modalDiv = document.createElement("div");

  modalDiv.innerHTML = `
  <div class="my-10 p-3 ">
            <div class="border-2 border-sky-100 rounded-md mb-5 mt-3 p-2">
                <h2 class="text-xl font-bold mb-3 text-black">${wordDetails.word} <span class="font-bangla ">(<i
                            class="fa-etch fa-solid fa-microphone"></i>: ${wordDetails.pronunciation})</span>
                </h2>
                <div class="mb-5">
                    <h4 class="font-semibold text-black">Meaning</h4>
                    <p class="font-bangla text-gray-400 ${wordDetails.meaning ? "text-gray-500" : "text-red-600"}">${wordDetails.meaning ? wordDetails.meaning : "Meaning not found"}</p>
                </div>
                <div class="mb-5">
                    <h3 class="font-semibold text-black">Example</h3>
                    <p class="text-gray-400 text-sm">${wordDetails.sentence}</p>
                </div>
                <h3 class="font-bangla font-semibold text-black">সমার্থক শব্দ গুলো</h3>
                <div class="mb-3">${showSynonyms(wordDetails.synonyms)}</div>
            </div>
            <div class="">
                <button class="  px-6 py-2 text-sm bg-blue-800 rounded-lg text-white">Complete Learning</button>
            </div>
        </div>
    
     
    `;
  detailsModal.append(modalDiv);
};

// showing words
const displayLevelWords = (words) => {
  const WordsContainer = document.getElementById("words-container");
  WordsContainer.innerHTML = "";

  if (words.length == 0) {
    WordsContainer.innerHTML = `
      <div class="text-center col-span-full">
                <div >
                    <img class=" mx-auto" src="./assets/alert-error.png" alt="">
                </div>
                <p class="text-xs text-gray-400 font-bangla my-3">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
                <h2 class="text-2xl my-2 font-semibold font-bangla">নেক্সট Lesson এ যান</h2>
            </div>
      `;
  }

  words.forEach((word) => {
    const wordCard = document.createElement("div");
    wordCard.innerHTML = `
        <div class="text-center bg-white p-8 box-border rounded-md shadow-md ">
                <h2 class="text-2xl font-bold">${word?.word ? word.word : "No word Found"}</h2>
                <p class="my-2">Meaning/Pronunciation</p>
                <h2 class="text-xl font font-medium h-12">${word?.meaning ? word.meaning : "No meaning found"}/ ${word?.pronunciation ? word.pronunciation : "Unknown"} </h2>
                <div class="flex justify-between my-10 items-center">
                    <button onclick="loadWordDetails(${word.id})" class="bg-sky-200 hover:bg-sky-400 cursor-pointer w-8 rounded-md"><i class="fa-solid fa-circle-info"></i></button>

                    <button class="bg-sky-200 hover:bg-sky-400 cursor-pointer w-8 rounded-md"><i class="fa-solid fa-volume-high"></i></button>
                </div>
        `;
    WordsContainer.append(wordCard);
  });

  managingSpinner(false);
};

// showing levels and lessions
const displayLessions = (lessions) => {
  const levelContainer = document.getElementById("level-container");
  levelContainer.innerHTML = "";

  lessions.forEach((lession) => {
    // console.log(lessions);
    const btnDiv = document.createElement("div");
    btnDiv.innerHTML = `
     
                <div>
                    <button onclick="loadLevelWord(${lession.level_no})" id="lession-btn-${lession.level_no}" class="btn btn-outline btn-primary lession-btn" title=${lession.lessonName}}><i class="fa-etch fa-solid fa-book-open"></i> Lession - ${lession.level_no}</button>
                </div>

        `;
    levelContainer.append(btnDiv);
  });
};
loadLessions();

document.getElementById("btn-search").addEventListener("click", async (id) => {
  removeActive();
  const searchInput = document.getElementById("input-search");
  const searchValue = searchInput.value.trim().toLowerCase();
  console.log(searchValue);

  const res = await fetch(`https://openapi.programming-hero.com/api/words/all`);
  const data = await res.json();

  const allWords = data.data;

  //   console.log(allWords);

  const filterWords = allWords.filter((word) => {
    return word.word.toLowerCase().includes(searchValue);
  });
  console.log(filterWords);
  displayLevelWords(filterWords);
});
