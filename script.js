const host = 'https://notatkibackend.herokuapp.com/'

window.onload = () => {
    NoteApp.init();
}

const NoteApp = {
    addBtn: null,
    deleteAllBtn: null,
    saveNoteBtn: null,
    cancelBtn: null,
    addNotePanel: null,
    cathegorySelect: null,
    newNoteTextArea: null,
    noteArea: null,
    error: null,
    deleteBtn: null,

    init: function() {
        this.addBtn = document.querySelector('.addBtn');
        this.catBtn = document.querySelector('.catBtn');
        this.deleteAllBtn = document.querySelector('.deleteAllBtn');
        this.addNotePanel = document.querySelector('.addNote');
        this.catModal = document.querySelector('.catModal');
        this.saveNoteBtn = document.querySelector('.save')
        this.cancelBtn = document.querySelector('.cancel')
        this.cathegorySelect = document.querySelector('#cathegory')
        this.newNoteTextArea = document.querySelector('#newNoteArea')
        this.noteArea = document.querySelector('.noteArea')
        this.error = document.querySelector('.errorNote')
        this.cathegoryList = document.querySelector('#cathegoryList')
        this.addCatBtn = document.querySelector('.addCatBtn')
        this.addCatModal = document.querySelector('.addCatModal')
        this.cancelAddCatBtn = document.querySelector('.cancelAddCatBtn')
        this.nameCatInput = document.querySelector('#nameCatInput')
        this.colorCatInput = document.querySelector('#colorCatInput')
        this.saveCatBtn = document.querySelector('.saveCatBtn')
        this.closeCatModal = document.querySelector('.closeCatModal')
        this.editCatBtn = document.querySelector('.editCatBtn')
        this.editCatModal = document.querySelector('.editCatModal')
        this.cancelEditCatBtn = document.querySelector('.cancelEditCatBtn')
        this.cathegoryList = document.querySelector('#cathegoryList')
        this.editNameCatInput = document.querySelector('#editNameCatInput')
        this.editColorCatInput = document.querySelector('#editColorCatInput')
        this.saveEditCatBtn = document.querySelector('.saveEditCatBtn')
        this.errorCat = document.querySelector('.errorCat')
        this.deleteCat = document.querySelector('.deleteCat')
        this.showNotes();
        this.listener();
    },

    showNotes: async () => {
        NoteApp.noteArea.innerHTML = ""
        await fetch(host, {
            method: 'get'
        })
        .then((res) => res.json())
        .then((notes) => {
            notes.forEach(note => {
                NoteApp.noteArea.innerHTML += `
                    <div class="note" style='--noteColor: ${note.color};' data-id=${note._id}>
                        <div class="backgr"></div>
                        <div class="header">
                            <p>${note.cathegory}</p><button class="delete"><i class="fa-solid fa-xmark"></i></button>
                        </div>
                        <div class="content">${note.content}</div>
                    </div>
                    `
            })
        }).then(() => {
            NoteApp.deleteNote()
        })
    },
    
    deleteNote: () => {
        let battons = document.querySelectorAll('.delete')
        NoteApp.deleteBtn = Array.from(battons)
        NoteApp.deleteBtn.forEach(el => {
            el.addEventListener('click', () => {
                let note = el.parentNode.parentNode
                let _id = note.dataset.id
                fetch(host + 'delete-note', {
                    method: 'DELETE',
                    body: JSON.stringify({_id: _id}),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(()=> {
                    NoteApp.showNotes()
                })
            })
        })
        
    },


    listener: function() {
        this.addBtn.addEventListener('click', () => {
            NoteApp.cathegorySelect.innerHTML = `<option value="0" disabled hidden selected>Wybierz kategorię</option>`
            fetch(host + 'show-cathegory')
            .then(res => res.json())
            .then(cathegories => {
                cathegories.forEach(cat => {
                    NoteApp.cathegorySelect.innerHTML += `<option value="${cat.name}">${cat.name}</option>`
                })
            })
            this.addNotePanel.style.setProperty('display', 'flex');
        })
        this.cancelBtn.addEventListener('click', () => {
            this.addNotePanel.style.setProperty('display', 'none');
            this.newNoteTextArea.value = "";
            this.cathegorySelect.value = 0;
            this.error.style.setProperty('visibility', 'hidden')
        })
        this.saveNoteBtn.addEventListener('click', () => this.addNote())
        this.deleteAllBtn.addEventListener('click', () => {
            fetch(host + 'delete-all', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(() => {
                    this.showNotes()
                })
        })
        this.catBtn.addEventListener('click', () => {
            this.getCathegory()
            this.catModal.style.setProperty('display', 'flex')
        })
        this.addCatBtn.addEventListener('click', () => {
            this.addCatModal.style.setProperty('display', 'flex');
        })
        this.cancelAddCatBtn.addEventListener('click', ()=> {
            this.nameCatInput.value = ""
            this.addCatModal.style.setProperty('display', 'none');
        })
        this.saveCatBtn.addEventListener('click', ()=> {
            let cathegory = {
                name: this.nameCatInput.value,
                color: this.colorCatInput.value
            }
            this.saveCathegory(cathegory);
            this.nameCatInput.value = ""
            this.addCatModal.style.setProperty('display', 'none');
        })
        this.closeCatModal.addEventListener('click', ()=>{
            this.catModal.style.setProperty('display', 'none')
        })
        this.editCatBtn.addEventListener('click', ()=> {
            if(!this.cathegoryList.value) {
                
            } else {
                fetch(host + 'show-one-cathegory', {
                    method: 'POST',
                    body: JSON.stringify({name: this.cathegoryList.value}),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                .then(res => res.json())
                .then(cathegory => {
                    NoteApp.editNameCatInput.value = cathegory.name
                    NoteApp.editColorCatInput.value = cathegory.color
                })
                this.editCatModal.style.setProperty('display', 'flex')
            }
        })
        this.cancelEditCatBtn.addEventListener('click', () => {
            this.editCatModal.style.setProperty('display', 'none')
        })
        this.saveEditCatBtn.addEventListener('click', () => {
            fetch(host + 'edit-cathegory', {
                method: 'PUT',
                body: JSON.stringify({
                    name: this.cathegoryList.value,
                    newName: this.editNameCatInput.value,
                    newColor: this.editColorCatInput.value
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(()=>{
                this.getCathegory()
                this.showNotes()
            })
            this.editCatModal.style.setProperty('display', 'none')
        })
        this.deleteCat.addEventListener('click', () => {
            if(!this.cathegoryList.value) {
                
            } else {
                fetch(host + 'delete-cathegory', {
                    method: 'DELETE',
                    body: JSON.stringify({name: this.cathegoryList.value}),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(() => {
                    this.getCathegory()
                })

            }
        })


    },

    addNote: function() {
        if (this.cathegorySelect.value !== "0" && this.newNoteTextArea.value !== "") {
            this.addNotePanel.style.setProperty('display', 'none');

            let noteToSave = {cathegory: NoteApp.cathegorySelect.value, content: NoteApp.newNoteTextArea.value}
            
            fetch(host + 'add-note', {
                method: 'POST',
                body: JSON.stringify(noteToSave),
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(()=>{ NoteApp.showNotes() })


            this.newNoteTextArea.value = "";
            this.cathegorySelect.value = 0;

        } else {
            this.error.style.setProperty('visibility', 'visible')
        }
    },

    getCathegory: function(){
        fetch(host + 'show-cathegory')
        .then(res => res.json())
        .then(cathegories => {
            NoteApp.cathegoryList.innerHTML = ''
            cathegories.forEach(cat => {
                NoteApp.cathegoryList.innerHTML += `<option style="background-color: ${cat.color};">${cat.name}</option>`
            })
        })
    },

    saveCathegory: function(cathegory) {
        fetch(host + 'add-cathegory', {
            method: 'POST',
            body: JSON.stringify(cathegory),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(() => this.getCathegory())
    }

}