const searchButton = document.getElementsByClassName("search"),
	priceSlider = document.getElementById("price-slider"),
	journeySummary = document.getElementById("journey"),
	scheduleSummary = document.getElementById("schedule"),
	results = document.getElementById("results")

let depFlightData = [],
	retFlightData = [],
	resultsTemplate = ``,
	origin,
	destination,
	depDate,
	retDate,
	passangers

const fetchFlightData = e => {
	if (e.target && e.target.classList.contains("one-search")) {
		origin = getInput("one-", "origin").value.toLowerCase()
		destination = getInput("one-", "destination").value.toLowerCase()
		depDate = getInput("one-", "dep-date").value
		passangers = getInput("one-", "passangers").value || 1
	} else if (e.target && e.target.classList.contains("two-search")) {
		origin = getInput("two-", "origin").value.toLowerCase()
		destination = getInput("two-", "destination").value.toLowerCase()
		depDate = getInput("two-", "dep-date").value
		retDate = getInput("two-", "ret-date").value
		passangers = getInput("two-", "passangers").value || 1
	}

	if (origin !== "" && destination !== "" && depDate !== "") {
		fetch("../flight_data.json")
			.then(res => res.json())
			.then(data => filterResults(data))
			.catch(
				err => (results.innerHTML = `Couldn't fetch flights. Please try again.`)
			)
	} else {
		results.innerHTML = `Origin, Destination and Departure Date are mandatory.`
	}
}

const filterResults = data => {
	const minPrice = Math.trunc(priceSlider.noUiSlider.get()[0]),
		maxPrice = Math.trunc(priceSlider.noUiSlider.get()[1]),
		metaData = [origin, destination, depDate, retDate, passangers]

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

const renderResults = (depFlightData, retFlightData, metaData) => {
	if (depFlightData.length !== 0 || retFlightData.length !== 0) {
		journeySummary.innerHTML = `${metaData[0]} > ${metaData[1]} 
      ${metaData[3] ? " > " + metaData[0] : ""}`

		scheduleSummary.innerHTML = `Depart: ${metaData[2]} <br/> Return: ${
			metaData[3] === null ? "-" : metaData[3]
		}`

		const largerArray =
			depFlightData.length >= retFlightData.length
				? depFlightData.length
				: retFlightData.length

		for (let index = 0; index < largerArray; index++) {
			resultsTemplate += `
				<div class="row result my-2">
					<div class="col-md-9">
						<div class="row">
							${
								depFlightData[index]
									? `<div class="col-md-6"><strong>Rs. ${Math.round(
											depFlightData[index].price
									  )}</strong></div>`
									: ""
							}
							${
								retFlightData[index]
									? `<div class="col-md-6"><strong>Rs. ${Math.round(
											retFlightData[index].price
									  )}</strong></div>`
									: ""
							}
						</div>
						<div class="row">
							${getFlightTemplate(depFlightData[index]) +
								getFlightTemplate(retFlightData[index])}
						</div>
					</div>
					<div class="col-md-3 text-right">
						<p><strong>Total: Rs. ${Math.round(
							((depFlightData[index] ? Number(depFlightData[index].price) : 0) +
								(retFlightData[index]
									? Number(retFlightData[index].price)
									: 0)) *
								metaData[4]
						)}</strong></p>
						<button class="btn btn-primary">Book This Flight</button>
					</div>
				</div>
			`
		}
	} else {
		resultsTemplate = `No results found.`
	}

	results.innerHTML = resultsTemplate
}

function getFlightTemplate(flightData) {
	return flightData
		? `<div class="col-md-6">
				<p><em>${flightData.id}</em></p>
				<p>${flightData.origin} > ${flightData.destination}</p>
				<p>Depart: ${flightData.dep_time}</p>
				<p>Arrive: ${flightData.arr_time}</p>
				</div>`
		: ""
}

const getInput = (prefix, id) => {
	return document.querySelector(`#${prefix}${id}`)
}

Array.from(searchButton).forEach(button =>
	button.addEventListener("click", fetchFlightData)
)

const initSlider = () => {
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

initSlider()
