/**
 * Created by Alex on 11/4/15.
 */
(function () {
    var allQuestions, numQuestion = 0,
        dang = "alert alert-danger",
        success = "alert alert-success",
        start = $('start'),
        try_again = $('try_again'),
        next = $('next'), back = $('back'),
        err = $('err'),
        quest = $('question'),
        head = $('head'),
        form = $('form'),
        cont = $('cont'),
        numCorrect = 0;
    reqwest('questions.json', function (resp) {
        allQuestions = resp;
        allQuestions.forEach(function (indx) { //create a new property to store users' answer
            indx.usersAnswer = null;
        });
        start.onclick = displayQuestion;
        next.onclick = handleNext;
        back.onclick = handleBack;

    });

    function setContent(ids, text) {
        if (ids.length > 1 && Array.isArray(ids)) {
            ids.map(function (el, i) {
                el.innerHTML = text[i];
            });
        } else {
            ids.innerHTML = text;
        }
    }

    function setClass(ids, name) {
        if (ids.length > 1 && Array.isArray(ids)) {
            ids.map(function (el, i) {
                el.className = name[i];
            });
        } else {
            ids.className = name;
        }
    }

    function setDisplay(ids, css) {
        if (ids.length > 1 && Array.isArray(ids)) {
            ids.map(function (el, i) {
                el.style.display = css[i];
            });
        } else {
            ids.style.display = css;
        }
    }

    function isChecked() {
        var chx = document.getElementsByTagName('input');
        for (var i = 0; i < chx.length; i++) {
            if (chx[i].type == 'radio' && chx[i].checked) {
                return true;
            }
        }
        return false
    }

    function $(id) {
        return document.getElementById(id);
    }

    function showScore() {
        var finish = 'You have completed the quiz. Correct answers: ',
            percent = parseFloat(numCorrect * 100 / allQuestions.length).toFixed(2) + '%',
            percentText = ', which is ' + percent;
        setContent([quest, head, form], [finish + numCorrect + percentText, '', '']);
        setClass(quest, success);
        setDisplay([next, back, try_again], ['none', 'none', 'inline']);
        try_again.onclick = function () {
            numQuestion = 0;
            numCorrect = 0;
            return displayQuestion();
        }
    }

    function displayQuestion() {

        var headline = 'Choose one of the following answers to the question:';
        next.value = "Next";
        setDisplay([start, next, $('title'), try_again, cont], ['none', 'inline', 'none', 'none', 'block']);

        TweenLite.from(form, 1, {autoAlpha: 0});
        TweenLite.from(quest, 1, {autoAlpha: 0});
        TweenLite.from(head, 5, {y: 0});
        setClass(quest, '');
        if (numQuestion > 0) {
            setDisplay(back, 'inline');
        }
        if (numQuestion === allQuestions.length) {
            showScore();
        } else {
            setContent([head, quest, form], [headline, allQuestions[numQuestion].question, '']);
            allQuestions[numQuestion].choices.map(function (el, i) {
                form.innerHTML += '<label class="btn btn-primary"><input type="radio" name="choice" id ="' + i + '" value="' + i + '">' + el + '</label><br>';
                return form;
            });
        }
    }

    function handleNext() {
        var correctChoice = allQuestions[numQuestion].corAnswer, answer;
        if (!isChecked()) {
            err.innerHTML = 'No choice has been made!';
            setClass(err, dang);
            return;
        } else {
            answer = document.querySelector('input[name="choice"]:checked').value;
            allQuestions[numQuestion].usersAnswer = answer;
        }
        if (correctChoice == answer) {
            numCorrect++;

        }

        numQuestion++;
        setContent(err, '');
        setClass(err, '');
        displayQuestion();

    }

    function handleBack() {
        numQuestion--;
        numCorrect--;
        setClass(err, '');
        setContent(err, '');
        if (numQuestion < 0) {
            numQuestion = 0;
        }
        if (numQuestion === 0) {
            setDisplay(back, 'none');
        }
        displayQuestion();
        var j = allQuestions[numQuestion].usersAnswer,
            n = document.getElementById(j);
        n.checked = true;
    }

    TweenMax.from('.site-wrapper', 2, {autoAlpha: 0});

})();
