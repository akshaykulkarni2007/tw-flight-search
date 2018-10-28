const searchButton = document.getElementsByClassName("search"),
	priceSlider = document.getElementById("price-slider"),
	journeySummary = document.getElementById("journey"),
	scheduleSummary = document.getElementById("schedule")

let filteredData = [],
	template = ``

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
		maxPrice = Math.trunc(priceSlider.noUiSlider.get()[1])

	const flightMeta = [origin, destination, depDate, retDate]
	filteredData = data
		.filter(
			flight =>
				flight.origin.toLowerCase() === origin &&
				flight.destination.toLowerCase() === destination &&
				minPrice <= Number(flight.price) &&
				Number(flight.price) <= maxPrice
		)
		.concat(flightMeta)
	renderResults(filteredData)
}

function renderResults(filteredData) {
	journeySummary.innerHTML = `${filteredData.slice(-4)[0]} > ${
		filteredData.slice(-3)[0]
	} 
  ${filteredData.slice(-1)[0] ? " > " + filteredData.slice(-4)[0] : ""}`
	scheduleSummary.innerHTML = `Depart: ${
		filteredData.slice(-2)[0]
	} <br/> Return: ${
		filteredData.slice(-1)[0] === null ? "-" : filteredData.slice(-1)[0]
	}`
	console.log(filteredData)
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
