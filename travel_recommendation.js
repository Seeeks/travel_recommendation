const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBut");
const clearSearchBtn = document.getElementById("clearSearch");
const resultDiv = document.getElementById("searchResults");

function searchRecommendations(event) {
    event.preventDefault();
    console.log("Searching...");
    let searchPhrase = searchInput.value.toLowerCase();
    if (searchPhrase === "") return;

    if (searchPhrase === "country") searchPhrase = "countries";//rewriting the search word to plural so that I don't have to deal with -y not matching -ies

    fetch("travel_recommendation_api.json")
    .then(response => response.json())
    .then(data => {
        resultDiv.innerHTML = "";
        const categories = Object.keys(data);
        const matchedKey = categories.find(key => key.toLowerCase().includes(searchPhrase) );
        
        const matchedResults = [];

        Object.entries(data).forEach(([key, items]) => {
            items.forEach(item => {
                if ((item.name && item.name.toLowerCase().includes(searchPhrase))
                ||(item.description && item.description.toLowerCase().includes(searchPhrase))) {
                    matchedResults.push({
                      name: item.name,
                      imageUrl: item.imageUrl,
                      description: item.description
                    });
                  }

                  if (key === "countries" && item.cities) {
                    item.cities.forEach(city => {
                        if ((city.name && city.name.toLowerCase().includes(searchPhrase))
                    ||(city.description && city.description.toLowerCase().includes(searchPhrase))) {
                            matchedResults.push({
                            name: city.name,
                            imageUrl: city.imageUrl,
                            description: city.description
                            });
                        }
                    });
                }
            });

            
        });

        if (matchedKey) {
            
            const results = data[matchedKey];
            
            results.forEach( (result) => {
                const holder = document.createElement("div");

                if (matchedKey === "countries" && result.cities) {
                    holder.innerHTML += `<h2>${result.name}</h2>`; // Country name
              
                    result.cities.forEach(city => {
                        const holder2 = document.createElement("div");
                        holder2.innerHTML += `<h3>${city.name}</h3>`;
                        holder2.innerHTML += `<img src="./images/${city.imageUrl}" alt="illustration">`;
                        holder2.innerHTML += `<p>${city.description}</p>`;

                        holder2.classList.add("recommendation");
                        holder.appendChild(holder2);
                        const visitBtn = document.createElement("button");
                        visitBtn.innerHTML = "Visit";
                        holder2.appendChild(visitBtn);
                    });

                    holder.classList.add("country-recommendation");
                    resultDiv.appendChild(holder);

                } else {
                    holder.innerHTML += `<h2>${result.name}</h2>`;

                    if (result.imageUrl && result.description) {
                        holder.innerHTML += `<img src="./images/${result.imageUrl}" alt="illustration">`;
                        holder.innerHTML += `<p>${result.description}</p>`;
                        holder.classList.add("recommendation");
                        resultDiv.appendChild(holder);
                        const visitBtn = document.createElement("button");
                        visitBtn.innerHTML = "Visit";
                        holder.appendChild(visitBtn);
                    }
                }
                
                
            });

        } else if (matchedResults.length > 0) {
            matchedResults.forEach(result => {
                const holder = document.createElement("div");
                holder.innerHTML += `<h2>${result.name}</h2>`;
                if (result.imageUrl && result.description) {
                    holder.innerHTML += `<img src="./images/${result.imageUrl}" alt="illustration">`;
                    holder.innerHTML += `<p>${result.description}</p>`;
                    holder.classList.add("recommendation");
                    resultDiv.appendChild(holder);
                    const visitBtn = document.createElement("button");
                    visitBtn.innerHTML = "Visit";
                    holder.appendChild(visitBtn);
                }
            });
        } else {
            resultDiv.innerHTML = 'No locations matched your search.';
        }
    })
    .catch(error => {
        console.error('Error', error);
        resultDiv.innerHTML = 'An error occurred while fetching data.';
    });
}

function clearSearch(event) {
    event.preventDefault();
    searchInput.value = "";
    resultDiv.innerHTML = "";
}

searchForm.addEventListener("submit", function(event) {
    event.preventDefault();
    console.log("Search form submitted.")
})
clearSearchBtn.addEventListener("click", clearSearch);
searchBtn.addEventListener("click", searchRecommendations);

document.addEventListener("DOMContentLoaded", () => {
    console.log("Page finished loading");
});