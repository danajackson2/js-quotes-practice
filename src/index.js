function getQuotes(){
    fetch('http://localhost:3000/quotes?_embed=likes')
    .then(res => res.json())
    .then(quotes => renderQuotes(quotes))
}

function submitQuote(e){
    e.preventDefault()
    fetch('http://localhost:3000/quotes?_embed=likes', {
        method: 'POST',
        headers: {'content-type':'application/json'},
        body: JSON.stringify({
            quote: e.target.querySelector('#new-quote').value,
            author: e.target.querySelector('#author').value,
            likes: [],
        })
    })
    .then(res => res.json())
    .then(quote => {
        buildQuoteCard(quote)
        e.target.querySelector('#new-quote').value = ""
        e.target.querySelector('#author').value = ""
    })
}

function editQuote(e){
    e.preventDefault()
    quoteId = e.target.id.split('-')[2]
    fetch(`http://localhost:3000/quotes/${quoteId}`, {
        method: 'PATCH',
        headers: {'content-type':'application/json'},
        body: JSON.stringify({
            quote: e.target.querySelector('#edit-quote').value,
            author: e.target.querySelector('#edit-author').value
            })
    })
    .then(() => getQuotes())
}

function likeQuote(item){
    fetch(`http://localhost:3000/quotes/${item.id}?_embed=likes`, {
        method: 'PATCH',
        headers: {'content-type':'application/json'},
        body: JSON.stringify({
            quote: item.quote,
            author: item.author,
            likes: item.likes.concat({
                "quoteId": item.id,
                "createdAt": Date.now()
            }),
        })
    })
    .then(res => res.json())
    .then(quote => updateLikes(quote))
}

function deleteQuote(id){
    fetch(`http://localhost:3000/quotes/${id}`, {
        method: 'DELETE',
        headers: {'content-type':'application/json'}
    })
    .then(() => document.getElementById(`quote-${id}`).remove())
}

function renderQuotes(quotes){
    document.getElementById('quote-list').innerHTML = ""
    quotes.forEach(item => buildQuoteCard(item))
}

function buildQuoteCard(item){
    let li = document.createElement('li')
    li.className = 'quote-card'
    li.id = `quote-${item.id}`
    let bq = document.createElement('blockquote')
    bq.className = 'blockquote'
    let p = document.createElement('p')
    p.className = 'mb-0'
    p.textContent = item.quote
    let footer = document.createElement('footer')
    footer.className = 'blockquote-footer'
    footer.textContent = item.author
    let br = document.createElement('br')
    let btnSuccess = document.createElement('button')
    btnSuccess.className = 'btn-success'
    btnSuccess.textContent = 'Likes:'
    let span = document.createElement('span')
    span.textContent = '0'
    btnSuccess.appendChild(span)
    btnSuccess.addEventListener('click', () => likeQuote(item))
    let btnDanger = document.createElement('button')
    btnDanger.className = 'btn-danger'
    btnDanger.textContent = 'Delete'
    btnDanger.addEventListener('click', () => deleteQuote(item.id))
    let btnEdit = document.createElement('button')
    btnEdit.textContent = "Edit"
    btnEdit.addEventListener('click', () => editHandle(item))
    bq.append(p, footer, br, btnSuccess, btnDanger, btnEdit)
    li.appendChild(bq)
    document.getElementById('quote-list').appendChild(li)
}

function updateLikes(quote){
    let likesSpan = document.querySelector(`#quote-${quote.id} blockquote button.btn-success span`)
    let newLikes = `${parseInt(likesSpan.textContent) + 1}`
    likesSpan.textContent = newLikes
}

function editHandle(item){
    let li = document.querySelector(`#quote-${item.id}`)
    li.querySelector(`#editDiv-${item.id}`) ? hideEdit(item) : showEdit(item)
}

function hideEdit(item){
    let li = document.querySelector(`#quote-${item.id}`)
    li.querySelector(`#editDiv-${item.id}`).remove()
}

function showEdit(item){
    let li = document.querySelector(`#quote-${item.id}`)
    let editDiv = document.createElement('div')
    editDiv.id = `editDiv-${item.id}`
    editDiv.innerHTML = document.getElementById('edit-form').innerHTML
    editDiv.style.display = ""
    editDiv.querySelector('form').id = `edit-form-${item.id}`
    editDiv.querySelector('#edit-quote').value = item.quote
    editDiv.querySelector('#edit-author').value = item.author
    editDiv.querySelector('form').addEventListener('submit', editQuote)
    li.appendChild(editDiv)

}

// function editQuoteCard(quoteArg){
//     hideEdit(quoteArg)
//     let quoteCard = document.getElementById(`quote-${quoteArg.id}`)
//     quoteCard.querySelector('p').textContent = quoteArg.quote
//     quoteCard.querySelector('footer').textContent = quoteArg.author
// }

document.getElementById('new-quote-form').addEventListener('submit', submitQuote)

getQuotes()