const main = document.querySelector(".main");
const countryDetails = document.createElement("div");
countryDetails.classList.add("countrydetails");
const countryname = new URLSearchParams(location.search).get("name");

fetch(`https://restcountries.com/v3.1/name/${countryname}?fullText=true`)
  .then((res) => res.json())
  .then((data) => {
    const country = data[0];
    console.log(country);

    // To Handle native name information
    let nativeName = country.name.nativeName
      ? Object.values(country.name.nativeName)
          .map((native) => native.common)
          .join(", ")
      : "No native name available";

    // To Handle capital information
    let capitalInfo = country.capital
      ? country.capital[0]
      : "Capital information not available";

    // To Handle language information
    let languageInfo = country.languages
      ? Object.values(country.languages).join(", ")
      : "Language information not available";

    // To Handle currency information
    let currencyName = "";
    let currencySymbol = "";
    if (country.currencies) {
      const currency = Object.values(country.currencies)[0];
      if (currency) {
        currencyName = currency.name;
        currencySymbol = currency.symbol;
      }
    }

    // To Handle border countries
    let borderCountriesLinks = "";
    if (country.borders && country.borders.length > 0) {
      Promise.all(
        country.borders.map((border) =>
          fetch(`https://restcountries.com/v3.1/alpha/${border}`)
            .then((res) => res.json())
            .then(
              (bordercountries) =>
                `<a href="country.html?name=${bordercountries[0].name.common}" class="border-countries">${bordercountries[0].name.common}</a>`
            )
        )
      ).then((links) => {
        borderCountriesLinks = links.join("  ");
        renderCountryDetails();
      });
    } else {
      borderCountriesLinks = "No border countries";
      renderCountryDetails();
    }

    function renderCountryDetails() {
      //To Handle Sub region
      let subRegionINfo = country.subregion
        ? country.subregion
        : "No sub-region";

      countryDetails.innerHTML = `
                <div class="countrydetails">
                    <img src="${country.flags.svg}" alt="${
        country.flags.alt
      }" class="flag">
                    <div class="details">
                        <h2 class="countryname">${country.name.common}</h2>
                        <div class="info">
                            <div class="info-left">
                                <p class="Native-name"><b>Native Name: </b>${nativeName}</p>
                                <p class="population"><b>Population: </b>${country.population.toLocaleString(
                                  "en-IN"
                                )}</p>
                                <p class="Region"><b>Region: </b>${
                                  country.region
                                }</p>
                                <p class="Sub-Region"><b>Sub Region: </b>${subRegionINfo}</p>
                                <p class="capital"><b>Capital: </b>${capitalInfo}</p>
                            </div>
                            <div class="info-right">
                                <p class="tld"><b>Top Level Domain: </b>${
                                  country.tld
                                }</p>
                                <p class="cur"><b>Currency: </b>${
                                  currencyName
                                    ? `${currencyName} (${currencySymbol})`
                                    : "Not available"
                                }</p>
                                <p class="lang"><b>Languages: </b>${languageInfo}</p>
                            </div>              
                        </div>
                        <p class="bc"><b>Border Countries: </b><span class= border-container>${borderCountriesLinks}</span></p>
                    </div>
                </div>`;
      main.append(countryDetails);
    }
  });
