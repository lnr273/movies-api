const movieInput = document.getElementById("movie-input")
const yearInput = document.getElementById("year-input")
const form = document.getElementById("form")

const getLocalStorage = () => JSON.parse(localStorage.getItem("dbMovies")) || []
const setLocalStorage = (movie) => localStorage.setItem("dbMovies", JSON.stringify(movie))

const saveMovie = (movie) => {
    const dbMovie = getLocalStorage()
    dbMovie.push(movie)
    // sort nao esta funcionando
    dbMovie.sort((a, b) => {
        if (a.name < b.name) return -1
        if (a.name > b.name) return 1
        return 0
    })
    setLocalStorage(dbMovie)
}

const deleteMovie = (id) => {
    const dbMovie = getLocalStorage()
    dbMovie.splice(id, 1)
    setLocalStorage(dbMovie)
}

const displayError = () => {
    if (movieInput.value === "") { 
        alert("Please insert a input.")
    }
    else {
        document.querySelector(".current-movie").innerHTML = `
            The input "${movieInput.value}" is not a valid name. Please try again.
        `
    }
}

const getMovieData = async(title, year) => {
    const myKey = "9ec5cbce"
    const url = `http://www.omdbapi.com/?apikey=${myKey}&t=${title}&y=${year}&plot=full&type=movie`
    
    const response = await fetch(url)
    if (!response.ok) throw new Error ("Could not fetch data")
    return await response.json()
}

form.addEventListener("submit", async(e) => {
    e.preventDefault()

    if(movieInput) {
        try {
            const data = await getMovieData(movieInput.value, yearInput.value)
            if (data.Error) {
                displayError()
                throw new Error ("Could not fetch data")
            }
            displayMovieInfo(data)
        } catch(error) {
            console.error(error)
        }
    }
})

const displayMovieInfo = (data) => {
    const currMovie = document.querySelector(".current-movie")
    currMovie.textContent = ""

    // Creating elements
    const poster = document.createElement("img")
    const divForBtns = document.createElement("div")
    const saveMovieBtn = document.createElement("button")
    const likeBtn = document.createElement("button")
    const divForInfo = document.createElement("div")
    
    // adding atribute to elements
    poster.classList.add("curr-poster")
    divForInfo.classList.add("div-for-info")

    // passing info to elements
    poster.src = data.Poster
    saveMovieBtn.innerHTML = `<i class="fa-regular fa-bookmark fa-xl" style="color: #ffffff;"></i>`
    likeBtn.innerHTML = `<i class="fa-regular fa-heart fa-xl" style="color: #ffffff;"></i>`
    divForInfo.innerHTML = `
        <div class="title-date-director"> 
            <h2 class="title">${data.Title}</h2> <span class="infos"> - ${data.Year} Directed by ${data.Director}</span> <br> 
        </div>
        ${data.Plot}
    `

    // appending
    divForBtns.appendChild(saveMovieBtn)
    divForBtns.appendChild(likeBtn)
    currMovie.appendChild(poster)
    currMovie.appendChild(divForInfo)
    currMovie.appendChild(divForBtns)

    // rever função
    saveMovieBtn.addEventListener("click", () => {
        if (isMovieSaved(data)) {
            alert("You already saved this movie.")
        } else {
            saveMovie(data)
            saveMovieBtn.innerHTML = `<i class="fa-solid fa-bookmark fa-xl" style="color: #f0f0f0;"></i>`
        }
    })
    
    movieInput.value = ""
    yearInput.value = ""
}

const createDiv = ({Title, Poster, imdbID}) => {
    const container = document.getElementById("container")
    const li = document.createElement("li")
    li.classList.add("movie")
    li.id = imdbID
    li.innerHTML += `
        <img class="movie-image" src="${Poster}" alt="Poster of '${Title}'">
        <div id="${Title}" class="movie-info valid-movie">
            ${Title.toUpperCase()}<br>
        </div>
    `
    container.appendChild(li)
}

const clearContainer = () => document.getElementById("container").innerHTML = ""

const updateContainer = () => {
    const dbMovies = getLocalStorage()
    clearContainer()
    dbMovies.forEach(createDiv)
}

updateContainer()

window.addEventListener("click", (e) => {
    if (e.target.classList.contains("valid-movie")) {
        document.getElementById("movie-input").value = e.target.id
        document.querySelector(".search-btn").click()
    }
})

const isMovieSaved = (data) => {
    const dbMovie = getLocalStorage()
    dbMovie.forEach((movie) => {
        if (movie.imdbID === data.imdbID) {
            return true
        } else {
        }
    })
}
