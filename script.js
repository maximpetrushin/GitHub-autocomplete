const searchInput = document.querySelector("#search");
const autocompleteList = document.querySelector("#autocomplete");
const repoList = document.querySelector("#repoList");


function debounce(fn, delay) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => fn.apply(this, args), delay);
    };
}


async function fetchRepos(query) {
    if (!query) {
        autocompleteList.style.display = "none";
        return;
    }

    try {
        const response = await fetch(
            `https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&per_page=5`
        );
        const data = await response.json();
        renderAutocomplete(data.items || []);
    } catch (error) {
        console.error("Ошибка запроса  к GitHub:", error);
        autocompleteList.style.display = "none";
    }
}


function renderAutocomplete(repos) {
    autocompleteList.innerHTML = "";

    if (!repos.length) {
        autocompleteList.style.display = "none";
        return;
    }

    repos.forEach(repo => {
        const li = document.createElement("li");
        li.textContent = repo.full_name;

        li.addEventListener("click", () => {
            addRepoToList(repo);
            searchInput.value = "";
            autocompleteList.style.display = "none";
        });

        autocompleteList.appendChild(li);
    });

    autocompleteList.style.display = "block";
}


function addRepoToList(repo) {
    const li = document.createElement("li");
    li.className = "repo-item";

    li.innerHTML = `
    <div>
      <b>Name: ${repo.name}</b><br>
      Owner: ${repo.owner.login}<br>
      Stars: ${repo.stargazers_count}
    </div>
    <a href="#" class="del_btn">X</a>
  `;

    li.querySelector(".del_btn").addEventListener("click", () => li.remove());

    repoList.appendChild(li);
}


const debouncedFetch = debounce(() => {
    fetchRepos(searchInput.value.trim());
}, 400);

searchInput.addEventListener("input", debouncedFetch);
