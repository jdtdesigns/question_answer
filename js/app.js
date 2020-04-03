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

                el.classList = `question ${question.answered ? 'answered': ''}`;
            })
        
        
    }

    function getQuestions() {
        questionWrap.innerHTML = '';
        db.on('child_added', snap => {
            
            const question = snap.val();
            const emptyEl = document.querySelector('.no-questions');

            if ( emptyEl ) emptyEl.remove();

            questionWrap.insertAdjacentHTML('beforeend', `<li data-key="${snap.key}" class="question ${question.answered ? 'answered' : ''}">${question.body}</li>`);
        });
    }

    function init() {
        getQuestions();
        
        const input = document.querySelector('#input');
        const body = document.querySelector('body');

        input.addEventListener('click', addQuestion);

        body.addEventListener('click', e => {
            // console.log(e.target.dataset);
            if ( e.target.classList.contains('question') ) {
                // console.log('fired');
                updateQuestionStatus(e.target);
            }
        })
    }


    return {init};
})();

app.init();