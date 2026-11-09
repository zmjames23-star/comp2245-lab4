const form = document.querySelector('form');
const subjectList = document.querySelector('#subject');
const availableCheckbox = document.querySelector('input[name="available"]');
const resultsBody = document.querySelector('#results tbody');
const statusMessage = document.querySelector('#status');
const searchButton = form.querySelector('button[type="submit"]');

async function loadSubjects() {
    try {
        const response = await fetch('subjects.php');

        if (!response.ok) {
            throw new Error('Could not load subjects.');
        }

        const subjects = await response.json();

        subjects.forEach(subject => {
            const option = document.createElement('option');
            option.value = subject.id;
            option.textContent = subject.name;
            subjectList.appendChild(option);
        });
    } catch (error) {
        console.error(error);
    }
}

async function loadBooks() {
    searchButton.disabled = true;
    statusMessage.textContent = 'Searching…';

    try {
        const params = new URLSearchParams(new FormData(form));
        const response = await fetch(`books.php?${params}`);

        if (!response.ok) {
            throw new Error('Could not load books.');
        }

        const books = await response.json();

        resultsBody.replaceChildren();

        books.forEach(book => {
            const row = document.createElement('tr');

            const titleCell = document.createElement('td');
            titleCell.textContent = book.title;

            const authorCell = document.createElement('td');
            authorCell.textContent = book.author;

            const yearCell = document.createElement('td');
            yearCell.textContent = book.year;

            const subjectCell = document.createElement('td');
            subjectCell.textContent = book.subject;

            const copiesCell = document.createElement('td');
            copiesCell.textContent = `${book.available} of ${book.copies}`;

            if (book.available === 0) {
                copiesCell.classList.add('out');
            }

            row.append(
                titleCell,
                authorCell,
                yearCell,
                subjectCell,
                copiesCell
            );

            resultsBody.appendChild(row);
        });

        if (books.length === 0) {
            statusMessage.textContent = 'No books match your search.';
        } else if (books.length === 1) {
            statusMessage.textContent = '1 book found.';
        } else {
            statusMessage.textContent = `${books.length} books found.`;
        }
    } catch (error) {
        console.error(error);
        resultsBody.replaceChildren();
        statusMessage.textContent = "Couldn't load the books. Please try again.";
    } finally {
        searchButton.disabled = false;
    }
}

form.addEventListener('submit', event => {
    event.preventDefault();
    loadBooks();
});

subjectList.addEventListener('change', loadBooks);
availableCheckbox.addEventListener('change', loadBooks);

loadSubjects();
loadBooks();