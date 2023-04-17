const express = require("express")
const { quotes } = require("./data")
const { getRandomElement } = require("./utils")

const app = express()
const PORT = process.env.PORT || 4001

app.use(express.static("public"))

app.get("/api/quotes/random", (req, res, next) => {
	res.status(200).send({ quote: getRandomElement(quotes) })
})

app.get("/api/quotes", (req, res, next) => {
	const person = req.query.person
	const personQuotes = person
		? quotes.filter(quote => quote.person === person)
		: quotes
	res.status(200).send({ quotes: personQuotes })
})

app.post("/api/quotes", (req, res, next) => {
	try {
		const { person, quote } = req.query
		if (!person || !quote) {
			res.status(400).send({ error: "Both 'person' and 'quote' are required." })
			return
		}
		const newQuote = { person, quote }
		quotes.push(newQuote)
		res.status(201).send({ quote: newQuote })
	} catch (error) {
		res
			.status(500)
			.send({ error: "An error occurred while processing your request." })
	}
})

app.use((req, res, next) => {
	res.status(404).send("Page not found")
})

app.use((err, req, res, next) => {
	console.error(err.stack)
	res.status(500).send("Internal server error")
})

app.listen(PORT, () => {
	console.log(`App started at http://localhost:${PORT}`)
})
