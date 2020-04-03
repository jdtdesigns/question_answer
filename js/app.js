const app = (function() {
    const db = firebase.database().ref('/questions');
    const questionWrap = document.querySelector('.questions');

    function addQuestion(e) {
        e.preventDefault();

        const question = document.querySelector('#question').value;
        const key = db.push().key;


        db.push({
            body: question,
            answered: 0
        });

        questionWrap.insertAdjacentHTML('beforeend', `<li data-key="${key}" class="question">${question}</li>`);
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
        db.once('value')
            .then(questions => {
                // console.log(Object.keys(questions.val()).length);
                if ( !questions.val()) {
                    questionWrap.innerHTML = '<h4>No questions have been asked.</h4>';
                }

                questions.forEach(snap => {
                    const question = snap.val();
                    console.log(question);
                    questionWrap.insertAdjacentHTML('beforeend', `<li data-key="${snap.key}" class="question ${question.answered ? 'answered' : ''}">${question.body}</li>`);
                })
            });
    }

    function init() {
        getQuestions();
        
        const input = document.querySelector('#input');
        const body = document.querySelector('body');

        input.addEventListener('click', addQuestion);

        body.addEventListener('click', e => {
            if ( e.target.classList.contains('question') ) {
                updateQuestionStatus(e.target);
            }
        })
    }


    return {init};
})();

app.init();