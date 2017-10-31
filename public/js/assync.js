/**
 * Atualiza os dados do tratamento da análise.
 * 
 * @param {object} info Dados retornados da leitura do campo de analise.
 */
function updateTreatment(info) {
    $('.in-treatment').html("");

    for (var i = 0; i < info.read.length; i++) {
        $('.in-treatment').append(
                $('<span>').html(info.read[i].word)
                .addClass(info.read[i].valid));
    }

    if (info.read[info.read.length - 1].valid === 'valid') {
        $('[name=in]').parent()
                .addClass('has-success')
                .removeClass('has-error')
                .find('.form-control-feedback')
                .addClass('glyphicon-ok')
                .removeClass('glyphicon-remove');
    } else {
        $('[name=in]').parent()
                .addClass('has-error')
                .removeClass('has-success')
                .find('.form-control-feedback')
                .removeClass('glyphicon-ok')
                .addClass('glyphicon-remove');
    }

    if (info.read[info.read.length - 1].valid === 'invalid' && info.read[info.read.length - 1].isComplete) {

        $('#information').html(
                '<p class="text-danger">' +
                'A sentença \'' +
                info.read[info.read.length - 1].word +
                '\' não foi encontrada.</p>');

        $('#add-word-btn').attr("disabled", false);
    } else if (info.read[info.read.length - 1].valid === 'valid' && info.read[info.read.length - 1].isComplete) {

        $('#information').html(
                '<p class="text-success">' +
                'A sentença \'' +
                info.read[info.read.length - 1].word +
                '\' foi encontrada.</p>');

        $('#add-word-btn').attr("disabled", true);
    }
}

function resetAnalyzer() {
    $.ajax({
        url: '/reset',
        type: 'DELETE',
        success: function () {
            $('input[name=in]').val('').focus()
                    .parent()
                    .removeClass('has-success has-error')
                    .find('.form-control-feedback').removeClass('glyphicon-ok glyphicon-remove');
            $('#information').html('');
            $('.in-treatment').html('<span>...</span>');
            $('#add-word-btn').attr("disabled", true);

            actualState();
            getDictionary();
        }
    });
}

function read(input) {
    $.ajax({
        url: '/read',
        type: 'PUT',
        data: {in: input},
        dataType: 'json',
        success: function (info) {

            updateTreatment(info);

            actualState();
        }
    });
}

function actualState() {
    $.get({
        url: '/actual-state',
        success: function (data) {
            $('.automaton').html(data);
        }
    });
}

function getDictionary() {
    $.get({
        url: '/dictionary',
        success: function (dictionary) {
            $('.dictionary').html(dictionary);
        }
    });
}

function addWordToDictionary(input) {
    $.ajax({
        url: '/dictionary/add',
        type: 'PATCH',
        dataType: 'json',
        data: {in: input},
        success: function (info) {

            updateTreatment(info);

            actualState();

            getDictionary();
        }
    });
}

function deleteWordFromDictionary(word, input) {
    $.ajax({
        url: '/dictionary/remove',
        type: 'DELETE',
        dataType: 'json',
        data: {word: word, in: input},
        success: function (info) {

            updateTreatment(info);

            actualState();

            getDictionary();
        }
    });
}