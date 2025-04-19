// DOM Elements
const noteEditor = document.getElementById('noteEditor');
const noteTitleInput = document.getElementById('noteTitle');
const newNoteBtn = document.getElementById('newNote');
const saveNoteBtn = document.getElementById('saveNote');
const shareNoteBtn = document.getElementById('shareNote');
const downloadNoteBtn = document.getElementById('downloadNote');
const deleteNoteBtn = document.getElementById('deleteNote');
const toggleSidebarBtn = document.getElementById('toggleSidebar');
const sidebar = document.getElementById('sidebar');
const notesList = document.getElementById('notesList');
const noteCount = document.getElementById('noteCount');

// Initialize Quill
const quill = new Quill('#noteContent', {
    theme: 'snow',
    placeholder: 'Write your note here...',
    modules: {
        toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block'],
            [{ 'header': [1, 2, false] }],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            [{ 'script': 'sub'}, { 'script': 'super' }],
            [{ 'indent': '-1'}, { 'indent': '+1' }],
            ['clean']
        ]
    }
});

let currentNoteId = null;
let notes = [];
let isSidebarVisible = false;

// Toggle sidebar
toggleSidebarBtn.addEventListener('click', () => {
    isSidebarVisible = !isSidebarVisible;
    sidebar.classList.toggle('show');
    noteEditor.classList.toggle('with-sidebar');
});

// Load notes when popup opens
document.addEventListener('DOMContentLoaded', () => {
    loadNotes();
});

// Load notes from file
function loadNotes() {
    chrome.runtime.sendMessage({ action: 'loadNotes' }, (response) => {
        if (response.success) {
            notes = response.notes;
        } else {
            notes = [];
            console.error('Error loading notes:', response.error);
        }
        updateNoteCount();
        renderNotesList();
        if (notes.length > 0) {
            openNote(notes[notes.length - 1].id);
        }
    });
}

// Save notes to file
function saveNotesToFile(callback) {
    if (!Array.isArray(notes)) {
        console.error('Invalid notes array:', notes);
        alert('Error: Invalid notes format');
        return;
    }

    chrome.runtime.sendMessage({ action: 'saveNotes', notes }, (response) => {
        if (response && response.success) {
            console.log('Notes saved successfully');
            if (callback) callback();
        } else {
            console.error('Error saving notes:', response?.error || 'Unknown error');
            alert('Error saving notes. Please try again.');
        }
    });
}

// Update note count
function updateNoteCount() {
    noteCount.textContent = `${notes.length} note${notes.length !== 1 ? 's' : ''}`;
}

// Render notes list
function renderNotesList() {
    notesList.innerHTML = '';
    notes.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)).forEach(note => {
        const noteElement = document.createElement('div');
        noteElement.className = `note-item${note.id === currentNoteId ? ' active' : ''}`;
        const date = new Date(note.updatedAt);
        const formattedDate = date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
        });
        
        noteElement.innerHTML = `
            <strong>${note.title}</strong>
            <p>${stripHtml(note.content).substring(0, 100)}</p>
            <div class="note-date">Last edited ${formattedDate}</div>
        `;
        noteElement.addEventListener('click', () => openNote(note.id));
        notesList.appendChild(noteElement);
    });
}

// Strip HTML tags for preview
function stripHtml(html) {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
}

// Create new note
newNoteBtn.addEventListener('click', () => {
    currentNoteId = null;
    noteTitleInput.value = '';
    quill.setContents([]);
    noteTitleInput.focus();
    updateActiveNoteInList();
});

// Save note
saveNoteBtn.addEventListener('click', () => {
    const title = noteTitleInput.value.trim();
    const content = quill.root.innerHTML;

    if (!title || quill.getText().trim().length === 0) {
        alert('Please fill in both title and content!');
        return;
    }

    try {
        if (currentNoteId) {
            // Update existing note
            const noteIndex = notes.findIndex(note => note.id === currentNoteId);
            if (noteIndex !== -1) {
                notes[noteIndex] = {
                    ...notes[noteIndex],
                    title,
                    content,
                    updatedAt: new Date().toISOString()
                };
            }
        } else {
            // Create new note
            const newNote = {
                id: Date.now().toString(),
                title,
                content,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            notes.push(newNote);
            currentNoteId = newNote.id;
        }

        // Save to storage
        saveNotesToFile(() => {
            updateNoteCount();
            renderNotesList();
            alert('Note saved successfully!');
        });
    } catch (error) {
        console.error('Error saving note:', error);
        alert('An error occurred while saving the note. Please try again.');
    }
});

// Open note for editing
function openNote(noteId) {
    const note = notes.find(note => note.id === noteId);
    if (note) {
        currentNoteId = noteId;
        noteTitleInput.value = note.title;
        quill.root.innerHTML = note.content;
        updateActiveNoteInList();
    }
}

// Update active note in list
function updateActiveNoteInList() {
    const activeNotes = notesList.getElementsByClassName('active');
    Array.from(activeNotes).forEach(note => note.classList.remove('active'));
    
    if (currentNoteId) {
        const currentNote = notesList.querySelector(`[data-id="${currentNoteId}"]`);
        if (currentNote) {
            currentNote.classList.add('active');
        }
    }
}

// Share note
shareNoteBtn.addEventListener('click', async () => {
    const title = noteTitleInput.value.trim();
    const content = quill.getText().trim();

    if (!title || !content) {
        alert('Please fill in both title and content before sharing!');
        return;
    }

    try {
        await navigator.clipboard.writeText(`${title}\n\n${content}`);
        alert('Note copied to clipboard!');
    } catch (err) {
        alert('Failed to copy note to clipboard');
    }
});

// Download note
downloadNoteBtn.addEventListener('click', () => {
    const title = noteTitleInput.value.trim();
    const content = quill.root.innerHTML;

    if (!title || quill.getText().trim().length === 0) {
        alert('Please fill in both title and content before downloading!');
        return;
    }

    // Convert HTML to Markdown
    function htmlToMarkdown(html) {
        // Basic HTML to Markdown conversion
        let text = html
            // Replace <br> and </p> with newlines
            .replace(/<br\s*\/?>/gi, '\n')
            .replace(/<\/p>/gi, '\n\n')
            // Handle headers
            .replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n')
            .replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n')
            .replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n')
            // Handle lists
            .replace(/<ul[^>]*>(.*?)<\/ul>/gi, '$1\n')
            .replace(/<ol[^>]*>(.*?)<\/ol>/gi, '$1\n')
            .replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1\n')
            // Handle basic formatting
            .replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**')
            .replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**')
            .replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*')
            .replace(/<i[^>]*>(.*?)<\/i>/gi, '*$1*')
            .replace(/<code[^>]*>(.*?)<\/code>/gi, '`$1`')
            .replace(/<blockquote[^>]*>(.*?)<\/blockquote>/gi, '> $1\n')
            // Remove remaining HTML tags
            .replace(/<[^>]+>/g, '')
            // Fix spacing
            .replace(/\n\s*\n/g, '\n\n')
            .trim();
        
        return text;
    }

    const markdownContent = `# ${title}\n\n${htmlToMarkdown(content)}`;
    const blob = new Blob([markdownContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const filename = `${title.toLowerCase().replace(/\s+/g, '-')}.md`;

    try {
        chrome.runtime.sendMessage({
            action: 'downloadNote',
            url: url,
            filename: filename
        });
        
        // Don't wait for response, just start cleanup after a delay
        setTimeout(() => {
            URL.revokeObjectURL(url);
        }, 1000);
    } catch (error) {
        console.error('Download error:', error);
        URL.revokeObjectURL(url);
        alert(`Failed to download note: ${error.message}`);
    }
});

// Delete note
deleteNoteBtn.addEventListener('click', () => {
    if (!currentNoteId) {
        alert('Please select a note to delete!');
        return;
    }

    if (confirm('Are you sure you want to delete this note?')) {
        notes = notes.filter(note => note.id !== currentNoteId);
        saveNotesToFile(() => {
            currentNoteId = null;
            noteTitleInput.value = '';
            quill.setContents([]);
            updateNoteCount();
            renderNotesList();
            alert('Note deleted successfully!');
            
            // Open the most recent note if available
            if (notes.length > 0) {
                openNote(notes[notes.length - 1].id);
            }
        });
    }
}); 