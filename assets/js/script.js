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
    
    let notes = [];
    let currentFilter = 'all';
    let currentEditId = null;





    addNote.addEventListener('click', async () => {
        const title = noteTitle.value.trim();
        const content = noteContent.value.trim();
        
        if (!title || !content) {
            alert('Title and content required');
            return;
        }
        
        const res = await fetch(API_URL, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                title, content, category: noteCategory.value
            })
        });
        
        const newNote = await res.json();
        notes.push(newNote);
        
        noteTitle.value = '';
        noteContent.value = '';
    });
    
    

});
