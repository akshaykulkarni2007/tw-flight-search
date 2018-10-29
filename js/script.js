const searchButton = document.getElementsByClassName("search"),
	priceSlider = document.getElementById("price-slider"),
	journeySummary = document.getElementById("journey"),
	scheduleSummary = document.getElementById("schedule")

let depFlightData = [],
	retFlightData = [],
	resultsTemplate = ``

Array.from(searchButton).forEach(button =>
	button.addEventListener("click", fetchFlightData)
)

function fetchFlightData() {
	fetch("../flight_data.json")
		.then(res => res.json())
		.then(data => filterResults(data))
}

function filterResults(data) {
	const origin = document
			.querySelector(".tab-pane.active #origin")
			.value.toLowerCase(),
		destination = document
			.querySelector(".tab-pane.active #destination")
			.value.toLowerCase(),
		depDate = document.querySelector(".tab-pane.active #dep-date").value,
		retDate =
			document.querySelector(".tab-pane.active #ret-date") &&
			document.querySelector(".tab-pane.active #ret-date").value,
		passangers = document.querySelector(".tab-pane.active #passangers").value,
		minPrice = Math.trunc(priceSlider.noUiSlider.get()[0]),
		maxPrice = Math.trunc(priceSlider.noUiSlider.get()[1]),
		metaData = [origin, destination, depDate, retDate]

	resultsTemplate = ``

	depFlightData = data.filter(
		flight =>
			flight.origin.toLowerCase() === origin &&
			flight.destination.toLowerCase() === destination &&
			minPrice <= flight.price &&
			flight.price <= maxPrice &&
			flight.date === depDate
	)

	if (retDate) {
		retFlightData = data.filter(
			flight =>
				flight.origin.toLowerCase() === destination &&
				flight.destination.toLowerCase() === origin &&
				minPrice <= flight.price &&
				flight.price <= maxPrice &&
				flight.date === depDate &&
				flight.date === retDate
		)
	}

	renderResults(depFlightData, retFlightData, metaData)
}

function renderResults(depFlightData, retFlightData, metaData) {
	journeySummary.innerHTML = `${metaData[0]} > ${metaData[1]} 
  ${metaData[3] ? " > " + metaData[0] : ""}`

	scheduleSummary.innerHTML = `Depart: ${metaData[2]} <br/> Return: ${
		metaData[3] === null ? "-" : metaData[3]
	}`

	depFlightData.forEach((flight, index) => {
		resultsTemplate += `
      <div class="col-md-9">
      <h3>Rs. ${Math.ceil(depFlightData[index].price)}</h3>
        <div class="row">
          <div class="col-md-6">
            <p>${depFlightData[index].id}</p>
            <p>${depFlightData[index].origin} > ${
			depFlightData[index].destination
		}</p>
            <p>Depart: ${depFlightData[index].dep_time}</p>
            <p>Arrive: ${depFlightData[index].arr_time}</p>
          </div>
          <div class="col-md-6">
          <p>${depFlightData[index].id}</p>
          <p>${retFlightData[index].origin} > ${
			retFlightData[index].destination
		} 
  </p>
          <p>Depart: ${retFlightData[index].dep_time}</p>
          <p>Arrive: ${retFlightData[index].arr_time}</p>
          </div>
        </div>
      </div>
      <div class="col-md-3"><button class="btn btn-primary">Book This Flight</button></div>
    `
	})
	document.getElementById("results").innerHTML = resultsTemplate
	console.log(arguments)
}

function initSlider() {
	noUiSlider.create(priceSlider, {
		start: [4000, 8000],
		step: 1000,
		range: {
			min: [1000],
			max: [10000]
		},
		pips: {
			mode: "steps",
			density: 2
		}
	})
	priceSlider.noUiSlider.on("change", fetchFlightData)
}

// decide about passangers

initSlider()
