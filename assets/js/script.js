document.addEventListener('DOMContentLoaded', function() {

    const API_URL = '/api/notes';

    const totalNotes = document.getElementById('totalNotes');
    const lastUpdated = document.getElementById('lastUpdated');
    const noteTitle = document.getElementById('noteTitle');
    const noteCategory = document.getElementById('noteCategory');
    const noteContent = document.getElementById('noteContent');
    const addNote = document.getElementById('addNote');
    const notesContainer = document.getElementById('notesContainer');
    const deleteAll = document.getElementById('deleteAll');
    
    const editTitle = document.getElementById('editTitle');
    const editCategory = document.getElementById('editCategory');
    const editContent = document.getElementById('editContent');
    const saveEdit = document.getElementById('saveEdit');
    
    const filterAll = document.getElementById('filterAll');
    const filterPersonal = document.getElementById('filterPersonal');
    const filterWork = document.getElementById('filterWork');
    const filterStudy = document.getElementById('filterStudy');
    const filterIdeas = document.getElementById('filterIdeas');
    
    let currentFilter = 'all';
    let currentEditId = null;

    filterAll.addEventListener('click', () => filterNotes('all'));
    filterPersonal.addEventListener('click', () => filterNotes('Personal'));
    filterWork.addEventListener('click', () => filterNotes('Work'));
    filterStudy.addEventListener('click', () => filterNotes('Study'));
    filterIdeas.addEventListener('click', () => filterNotes('Ideas'));

    async function showNotes() {
        const res = await fetch(API_URL);
        let notes = await res.json();

        //filter
        if (currentFilter !== 'all') {
            notes = notes.filter(note => note.category === currentFilter);
        }


        let html = '';
        let lastDate = '';

        notes.forEach(note => {
            html += `
               
                <div class="col-md-6 col-lg-4">
                    <div class="card h-100 border-0">
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-start mb-2">
                                <span class="badge bg-secondary">${note.category}</span>
                                <small class="text-muted">${note.created}</small>
                            </div>
                            <h5 class="card-title">${note.title}</h5>
                            <p class="card-text text-muted small">${note.content}</p>
                            <div class="d-flex justify-content-end gap-2 mt-3">
                                <button class="btn btn-sm btn-outline-secondary" onclick="editNote(${note.id})" data-bs-toggle="modal" data-bs-target="#editModal"><i class="bi bi-pencil"></i></button>
                                <button class="btn btn-sm btn-outline-secondary" onclick="deleteNote(${note.id})" ><i class="bi bi-trash"></i></button>
                            </div>
                            ${note.updated ? `
                            <div class="d-flex gap-2 mt-3">
                                <small class="text-muted">Updated on ${note.updated}. </small>
                            </div>
                            ` : ''}
                        </div>
                    </div>
                </div>         

            `;

        const noteLastDate = note.updated || note.created;
        if (!lastDate || noteLastDate > lastDate) {
            lastDate = noteLastDate;
        }

        });
        notesContainer.innerHTML = html;
        totalNotes.innerText = notes.length;
        lastUpdated.innerText = lastDate;

    }

    window.deleteNote = async function(id) {
        if (!confirm('Delete this note?')) return;
        
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        showNotes(); 
        alert('Note deleted.');
    };

    deleteAll.addEventListener('click', async () => {
        if (!confirm('Delete ALL notes?')) return;
        
        await fetch(API_URL, { 
            method: 'DELETE'
        });
        
        showNotes(); 
        alert('All notes deleted.');
    });


    window.editNote = async function(id) {
        const res = await fetch(`${API_URL}/${id}`);
        const note = await res.json();
        
        currentEditId = id;
        editTitle.value = note.title;
        editCategory.value = note.category;
        editContent.value = note.content;
    };    

    saveEdit.addEventListener('click', async () => {
        if (!currentEditId) return;
        
        await fetch(`${API_URL}/${currentEditId}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                title: editTitle.value,
                category: editCategory.value,
                content: editContent.value
            })
        });
        
        bootstrap.Modal.getInstance(document.getElementById('editModal')).hide();
        showNotes();
        alert('Note updated.');
    });



    addNote.addEventListener('click', async () => {
        const title = noteTitle.value.trim();
        const content = noteContent.value.trim();
        
        if (!title || !content) {
            alert('Title and content required');
            return;
        }
    
    try {    
        await fetch(API_URL, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                title, content, category: noteCategory.value
            })
        });
        
        noteTitle.value = '';
        noteContent.value = '';
        noteCategory.value = 'Personal';


        alert('Note added.');
        showNotes();
    } 
    catch (error) {
        alert('Failed to add note. Please try again.');
        console.error('Error:', error);
    }

    });
    
    function filterNotes(filter) {
        currentFilter = filter;
        
        filterAll.classList.remove('active');
        filterPersonal.classList.remove('active');
        filterWork.classList.remove('active');
        filterStudy.classList.remove('active');
        filterIdeas.classList.remove('active');
        
        if (filter === 'all') filterAll.classList.add('active');
        if (filter === 'Personal') filterPersonal.classList.add('active');
        if (filter === 'Work') filterWork.classList.add('active');
        if (filter === 'Study') filterStudy.classList.add('active');
        if (filter === 'Ideas') filterIdeas.classList.add('active');
        
        showNotes(); 
    }
    
    showNotes();

});
