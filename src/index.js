// DOM selector
const form = document.getElementById('form');
const search = document.getElementById('search');
const result = document.getElementById('result');
const more = document.getElementById('more');
 
const apiURL = 'https://api.lyrics.ovh'
 
//search bar
async function searchSongs(term) { //async gets data from apis
    const res = await fetch(`${apiURL}/suggest/${term}`)
    const data = await res.json() //takes response and formats it in json

    showData(data)
}

//get prev and next songs
async function getMoreSongs(url) {
    const res = await fetch(`https://cors-anywhere.herokuapp.com/${url}`)
    const data = await res.json()

    showData(data)
}

//gets lyrics for songs
async function getLyrics(artist, songTitle) {
    const res = await fetch(`${apiURL}/vl/${artist}/${songTitle}`)
    const data = await res.json()

    const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g, '<br')

    result.innerHTML = `<h2><strong>${artist}</strong> - ${songTitle}</h2>
    <span>${lyrics}</span>`

    more.innerHTML = ''
}

function showData(data) {
    result.innerHTML = `
    <ul class="songs">
    ${data.data
    .map( //mapping an array of the data
    song => `<li>
    <span><strong>${song.artist.name}</strong> - ${song.title}</span>
    <button class="btn" data-artist="${song.artist.name}" data-songtitle="${song.title}">Get Lyrics</button>
    </li>`)
    .join('')
    }
    </ul>
    `
    if (data.prev || data.next) {
        more.innerHTML = `
        ${ //? is shorthand for if (variable) is true, so then execute the code after. then : is shorthand for else
            data.prev ? `<button class="btn" onclick="getMoreSongs('${data.prev}')">Prev</button>` : ''
        }
        ${
            data.next ? `<button class="btn" onclick="getMoreSongs('${data.next}')">Next</button>` : ''
         }
        `
    } else { //if there is nothing else beyond prev or next, display blank
        more.innerHTML = ''
    }
}

//event listeners
form.addEventListener('submit', e => {
    e.preventDefault()

    const searchTerm = search.value.trim() //make sure theres no whitespace

    if (!searchTerm) { //if there has been nothing typed then give alert
        alert('Please type in a search term')
    } else { //otherwise search songs for the term
        searchSongs(searchTerm)
    }
})

//lyrics button
result.addEventListener('click', e => {
    const clickEl = e.target

    if (clickEl.tagName === "BUTTON") {
        const artist = clickEl.getAttribute('data-artist')
        const songTitle = clickEl.getAttribute('data-songtitle')

        getLyrics(artist, songTitle)
    }
})