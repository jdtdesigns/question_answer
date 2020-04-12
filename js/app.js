const app = (function() {
    const db = firebase.database().ref('/questions');
    const questionWrap = document.querySelector('.questions');

    function addQuestion(e) {
        e.preventDefault();

        
        const input = document.querySelector('#question');
        const question = input.value;
        const key = db.push().key;

        if ( question.length < 3 ) return;

        db.child(key).set({
            body: question,
            answered: 0
        });

        input.value = '';
    }

    function updateQuestionStatus(el) {
        const key = el.dataset.key;

        db.child(key).once('value')
            .then(snap => {
                const question = snap.val();

                question.answered = !question.answered;

                db.child(key).set(question);
            });
    }

    function clearQuestions() {
        const check = confirm('Are you sure you want to delete all questions?');

        if ( check ) {
            db.remove();
        }
    }

    function setupListeners() {
        questionWrap.innerHTML = '';

        db.on('child_added', snap => {
            const question = snap.val();
            const emptyEl = document.querySelector('.no-questions');

            if (question && emptyEl) emptyEl.style.display = 'none';
            
            questionWrap.insertAdjacentHTML('beforeend', `<li data-key="${snap.key}" class="question ${question.answered ? 'answered' : ''}">${question.body}</li>`);
        });

        db.on('child_changed', snap => {
            const question = snap.val();
            const el = document.querySelector(`li[data-key="${snap.key}"]`);

            el.classList = `question ${question.answered ? 'answered': ''}`;
        });

        db.on('child_removed', snap => {
            const emptyEl = document.querySelector('.no-questions');
            
            questionWrap.innerHTML = '';
            emptyEl.style.display = 'initial';
        });

        const clearBtn = document.querySelector('#clear');
        clear.addEventListener('click', clearQuestions);
    }

    function init() {
        const input = document.querySelector('#input');
        const body = document.querySelector('body');

        input.addEventListener('click', addQuestion);

        body.addEventListener('click', e => {
            if ( e.target.classList.contains('question') ) {
                updateQuestionStatus(e.target);
            }
        });

        setupListeners();
    }


    return {init};
})();

app.init();