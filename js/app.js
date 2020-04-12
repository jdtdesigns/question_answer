const app = (function() {
    const db = firebase.database().ref('/questions');
    const passwordRef = firebase.database().ref('/password');
    const questionWrap = document.querySelector('.questions');

    function addQuestion(e) {
        e.preventDefault();
        
        const input = document.querySelector('#question');
        const question = input.value;

        if ( question.length < 3 ) return;

        db.push({
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
        const input = prompt('Please enter the password.');

        passwordRef.once('value')
            .then(snap => {
                const password = snap.val();

                if ( input === password ) {
                    db.remove();
                    passwordRef.remove();
                    
                    window.location.reload();
                }
            });
    }

    function setupFBListeners() {
        questionWrap.innerHTML = '';

        passwordRef.once('value')
            .then(snap => {
                const password = snap.val();

                if (!password) {
                    const getInput = () => {
                        const input = prompt('Please enter a new password.');

                        if ( input ) 
                            passwordRef.set(input);
                        else getInput();                            
                    }

                    getInput();
                }
            });

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
    }

    function init() {
        const input = document.querySelector('#input');
        const body = document.querySelector('body');
        const clearBtn = document.querySelector('#clear');

        input.addEventListener('click', addQuestion);
        clearBtn.addEventListener('click', clearQuestions);
        body.addEventListener('click', e => {
            if ( e.target.classList.contains('question') ) {
                updateQuestionStatus(e.target);
            }
        });

        setupFBListeners();
    }


    return {init};
})();

app.init();