const api = axios.create({
  baseURL: "https://rickandmortyapi.com/api",
});
const endpoint = "/character/";
let currentPage = 1;
const PER_PAGE = 6;

let response;

const container = document.getElementById("container");
const searchBox = document.getElementById("searchBox");
const prevPageButton = document.getElementById("prevPage");
const nextPageButton = document.getElementById("nextPage");
const firstPageButton = document.getElementById("firstPage");
const lastPageButton = document.getElementById("lastPage");

const card = document.createElement("div");
card.className = "card";

let isLoading = false;

async function getInfo() {
  const { data: infoCharacter} = await api.get("/character");
  const { data: infoLocation} = await api.get("/location");
  const { data: infoEpisodes} = await api.get("/episode");

  const infoList = document.getElementById("info-list");
    infoList.innerHTML = /* html */ `
      <li><span class="fw-bold">Characters:</span> ${infoCharacter.info.count}</li>
      <li><span class="fw-bold">Locations:</span> ${infoLocation.info.count}</li>
      <li><span class="fw-bold">Episodes:</span> ${infoEpisodes.info.count}</li>
    `;
}

async function loadEpisodeName(url) {
  const episode = await api.get(url);

  return episode.data.name;
}

async function loadCharacters(page = 1, name = "") {
  try {
    isLoading = true;

    prevPageButton.disabled = true;
    firstPageButton.disabled = true;

    nextPageButton.disabled = true;
    lastPageButton.disabled = true;

    container.innerHTML = "";

    const params = {
      page,
      name,
    };

    response = await api.get(endpoint, { params });
    const results = response.data.results;

    const row = document.createElement("div");
    row.className = "row";

    for (i = 0; i < PER_PAGE; i++) {
      const character = results[i];
      const currentPageEl = document.getElementById("currentPage");
      currentPageEl.innerText = currentPage;

      row.innerHTML += /* html */ `
          <div class="col-md-4 col-12 p-3" style="margin-top: 8px">
            <div class="card bg-dark text-light border-success border-2 mb-1" data-bs-toggle="modal" data-bs-target="#Modal-${i}" style="max-width: 300px; max-height: 35rem; margin: auto">
              <img src="${character.image}" alt="${
        character.name
      }" class="card-img-top">
      <div class="card-body p-4">
        <h5 class="text-center fw-bold">${character.name}</h1>
        <ul class="list-group list-unstyled">
          <li>
            <div id="spanStatus" class="fw-bold">
            <div class='statusColor ${
              character.status == "Dead"
                ? "dead"
                : character.status == "Alive"
                ? "alive"
                : "unknown"
            }'>
            </div>
              ${character.status} - ${character.species}
          </div>
          </li>
          <li>
            <div id='status'>
              <p class="fw-bold">Last Know Location:</p>
              <p>${character.location.name}</p>
              <p class="fw-bold">Last Episode:</p>
              <p>${await loadEpisodeName(
                character.episode[character.episode.length - 1]
              )}</p>
        </div>
          </li>
        </ul>
      </div>
        </div>
        <div class="modal fade" id="Modal-${i}" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div class="modal-dialog">
            <div class="modal-content bg-dark text-light border-success border-2">
              <div class="modal-header border-bottom-0">
                <h1 class="modal-title fs-5 fw-bold text-center" id="exampleModalLabel">${
                  character.name
                }</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body d-flex flex-column">
                <img src="${character.image}" alt="${character.name}">
                  <ul class="list-group list-unstyled mt-4">
                  <li>
                    <div id="spanStatus"><span class="fw-bold">Status:</span>
                    <div class='statusColor ${
                      character.status == "Dead"
                        ? "dead"
                        : character.status == "Alive"
                        ? "alive"
                        : "unknown"
                    }'>
                    </div>
                      ${character.status} - ${character.species}
                  </div>
                  </li>
                  <li>
                    <div id='status'>
                      <p><span class="fw-bold">Last Known Location: </span>${character.location.name}
                      </p>
                      <p><span class="fw-bold">Last Episode:</span> ${await loadEpisodeName(
                        character.episode[character.episode.length - 1]
                      )}</p>
                    </div>
                  </li>
                </ul>
              </div>
              <div class="modal-footer border-top-0">
                <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Close</button>
              </div>
            </div>
          </div>
        </div>
      `;

     container.appendChild(row);

      const info = response.data.info;

      prevPageButton.disabled = info.prev ? false : true;
      firstPageButton.disabled = info.prev ? false : true;

      nextPageButton.disabled = info.next ? false : true;
      lastPageButton.disabled = info.next ? false : true;
    }
  } catch (error) {
    console.log("Error -> ", error);
  } finally {
    isLoading = false;
  }
}

loadCharacters();
getInfo();

searchBox.addEventListener("change", () => {
  currentPage = 1;
  loadCharacters(currentPage, searchBox.value);
});

firstPageButton.addEventListener("click", () => {
  if (currentPage > 1 && !isLoading) {
    currentPage = 1;
    loadCharacters(currentPage, searchBox.value);
  }
});

lastPageButton.addEventListener("click", () => {
  if (currentPage < response.data.info.pages && !isLoading) {
    currentPage = Math.ceil(response.data.info.pages);
    loadCharacters(currentPage, searchBox.value);
  }
});

prevPageButton.addEventListener("click", () => {
  if (currentPage > 1 && !isLoading) {
    currentPage--;
    loadCharacters(currentPage, searchBox.value);
  }
});

nextPageButton.addEventListener("click", () => {
  if (currentPage < response.data.info.pages && !isLoading) {
    currentPage++;
    loadCharacters(currentPage, searchBox.value);
  }
});
