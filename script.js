const API_URL = 'https://api.freeapi.app/api/v1/public/books';
let currentPage = 1;
let books = [];

// DOM Elements
const booksContainer = document.getElementById('booksContainer');
const searchInput = document.getElementById('searchInput');
const sortSelect = document.getElementById('sortSelect');
const gridViewBtn = document.getElementById('gridView');
const listViewBtn = document.getElementById('listView');
const loadingElement = document.getElementById('loading');
const errorElement = document.getElementById('error');

// Fetch books from API
async function fetchBooks(page = 1) {
    try {
        loadingElement.style.display = 'block';
        errorElement.style.display = 'none';
        
        const response = await fetch(`${API_URL}?page=${page}`);
        const data = await response.json();
        
        if (data.success && data.data && data.data.data) {
            books = [...books, ...data.data.data];
            displayBooks(books);
        }
        
        loadingElement.style.display = 'none';
    } catch (error) {
        loadingElement.style.display = 'none';
        errorElement.style.display = 'block';
        errorElement.textContent = 'Error loading books. Please try again later.';
    }
}

// Display books
function displayBooks(booksToDisplay) {
    booksContainer.innerHTML = '';
    
    booksToDisplay.forEach(book => {
        const bookCard = document.createElement('div');
        bookCard.className = 'book-card';
        
        bookCard.innerHTML = `
            <img src="${book.volumeInfo.imageLinks?.thumbnail || 'placeholder-image.jpg'}" alt="${book.volumeInfo.title}">
            <div class="book-info">
                <h3 class="book-title">${book.volumeInfo.title}</h3>
                <p class="book-author">Author: ${book.volumeInfo.authors?.join(', ') || 'Unknown'}</p>
                <p class="book-publisher">Publisher: ${book.volumeInfo.publisher || 'Unknown'}</p>
                <p class="book-date">Published: ${new Date(book.volumeInfo.publishedDate).getFullYear() || 'Unknown'}</p>
            </div>
        `;
        
        bookCard.addEventListener('click', () => {
            if (book.volumeInfo.infoLink) {
                window.open(book.volumeInfo.infoLink, '_blank');
            }
        });
        
        booksContainer.appendChild(bookCard);
    });
}

// Search functionality
searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredBooks = books.filter(book => 
        book.volumeInfo.title.toLowerCase().includes(searchTerm) ||
        book.volumeInfo.authors?.join(' ').toLowerCase().includes(searchTerm)
    );
    displayBooks(filteredBooks);
});

// Sort functionality
sortSelect.addEventListener('change', (e) => {
    const sortedBooks = [...books].sort((a, b) => {
        if (e.target.value === 'title') {
            return a.volumeInfo.title.localeCompare(b.volumeInfo.title);
        } else {
            return new Date(b.volumeInfo.publishedDate) - new Date(a.volumeInfo.publishedDate);
        }
    });
    displayBooks(sortedBooks);
});

// View toggle functionality
gridViewBtn.addEventListener('click', () => {
    booksContainer.className = 'books-container grid';
    gridViewBtn.classList.add('active');
    listViewBtn.classList.remove('active');
});

listViewBtn.addEventListener('click', () => {
    booksContainer.className = 'books-container list';
    listViewBtn.classList.add('active');
    gridViewBtn.classList.remove('active');
});

// Infinite scroll
window.addEventListener('scroll', () => {
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100) {
        currentPage++;
        fetchBooks(currentPage);
    }
});

// Initial load
fetchBooks();