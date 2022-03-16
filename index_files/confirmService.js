function confirmService() {
    let idCheckInterval;
    let currentStep;
    let otpError = false;

    this.init = function(phone, token){
        this.clearCheck();

        //console.log('confirm init');
        return new Promise(function(resolve, sucks) {
            console.log('promise');
            console.log(typeof phone);

            $.post('/confirm', {
                    'action': 'init',
                    phone: phone,
                    csrf_token: token
                },
                function (resp) {
                    console.log('Init response');
                    console.log(resp);
                    console.log(typeof resp);

                    if (  typeof resp.status !='undefined' && resp.status =='success'
                        && typeof resp.data != 'undefined' && typeof resp.data.confirmRef != 'undefined'
                        && typeof resp.data.state !='undefined' && resp.data.state == 'ok') {
                        resolve(resp.data);
                    } else {
                        sucks();
                    }

                }
            ).fail(function() {
                sucks();
            });
        });

    };

    this.check = function () {
        return new Promise(function(success, sucks) {
            idCheckInterval = setInterval(function () {

                new Promise(function (resolve, fail) {
                    $.get('/confirm/check', function (resp) {
                        resolve(resp);
                    }).fail(function () {
                        fail(resp);
                    })
                }).then((res) => {

                    //console.log(res);

                    if (typeof res != 'undefined' && res != null && res != '') {

                        if (typeof res.data == 'undefined' || res.data == null || res.data == '') {

                            var temp = jQuery.parseJSON(res);

                            if (typeof temp.data != 'undefined' && temp.data != null && temp.data != '') {
                                res = temp;
                                temp = '';
                            }
                        }

                        if (typeof res.data != 'undefined' && res.data != null && res.data != '' &&
                            typeof res.data.bp_confirm_result != 'undefined' && res.data.bp_confirm_result != null && res.data.bp_confirm_result != '') {

                            //console.log(res.data.bp_confirm_result);

                            switch (res.data.bp_confirm_result) {

                                case 'processing': {
/*
                                    $('#qr').empty();

                                    if (res.data.bp_confirm_errorCode == 'qr_timeout') {
                                        $('#qr').empty();
                                    }
*/
                                    let object = res.data.bp_confirm_dialogs;

                                    $.each(object, function (key, value) {

                                        //console.log(key);

                                        switch (key) {
                                            case 'sms': {
                                                if( currentStep != 'sms' ) {
                                                    currentStep = 'sms';
                                                    //console.log(value);

                                                    $('.confirm-block').hide();
                                                    $('.request-otp').inputmask('mask', {mask: '9'});

                                                    $('.request-otp').on('keyup', function (e) {

                                                        if (e.keyCode == 8)
                                                            $(e.target).prev('.request-otp').focus();

                                                        if (e.target.value.match(/[0-9]/))
                                                            $(e.target).next('.request-otp').focus();
                                                    });

                                                    //preloader.hide();
                                                    $('.r-otp-block').show();
                                                }

                                                if ( typeof value.error_code != 'undefined' && value.error_code == 'wrong_sms_password' )
                                                {
                                                    if(!otpError) {
                                                        //preloader.hide();
                                                        $('.request-otp')
                                                            .addClass('error')
                                                            .val('');
                                                        $('.otp-error')
                                                            .text('Введіть коректний пароль')
                                                            .show();
                                                        otpError = true;
                                                    }
                                                }

                                                break;
                                            }

                                            case 'areyouhere': {
                                                $('.step-confirm .state').text('areyouhere');

                                                break;
                                            }

                                            case 'qr': {

                                                $('.confirm-block .state').text('qr');
                                                break;
                                            }
                                            case 'channels': {
                                                $('.confirm-block .state').text('Підтвердіть авторизацію в додатку Приват24');
                                                break;
                                            }

                                            default: {
                                                $('.confirm-block .state').text('no one');
                                                break;
                                            }
                                        }
                                    });

                                    break;
                                }

                                case 'checking': {
                                    $('.step-confirm .state').text('Status: checking');

                                    break;
                                }

                                case 'error' : {
                                    if (typeof idCheckInterval != 'undefined' && idCheckInterval != null && idCheckInterval != '') {
                                        clearInterval(idCheckInterval);
                                    }

                                    let errortext = '';

                                    switch (res.data.bp_confirm_message) {
                                        case 'timeout':
                                        case 'sms_timeout':
                                            errortext = 'Перевищено час очікування';
                                            break;
                                        case 'expire_sms':
                                            errortext = 'Перевищено кількість спроб введення одноразового пароля';
                                            break;
                                        default:
                                            errortext = 'Виникла помилка: ' + '"' + res.data.bp_confirm_message + '"';
                                    }

                                    if(!errortext)
                                        errortext = 'Сталася помилка!';

                                    $('.confirm-block').hide();
                                    $('.r-otp-block').hide();
                                    $('.confirm-error').text(errortext).show();

                                    sucks();
                                    //$('.step-confirm .state').text(text+' '+errortext);

                                    //$('#qr').empty();

                                    break;
                                }

                                case 'decline': {
                                    if (typeof idCheckInterval != 'undefined' && idCheckInterval != null && idCheckInterval != '') {
                                        clearInterval(idCheckInterval);
                                    }

                                    $('.step-confirm .state').text('Ви скасували підтвердження реєстрації');
                                    //$('#qr').empty();

                                    setTimeout(function () {
                                        $('.confirm-block').hide();
                                        $('.confirm-error').show();
                                        sucks();
                                    }, 2000);

                                    break;
                                }

                                case 'accept': {
                                    if (typeof idCheckInterval != 'undefined' && idCheckInterval != null && idCheckInterval != '') {
                                        clearInterval(idCheckInterval);
                                        idCheckInterval = false;
                                    }

                                    //$('#qr').empty();

                                    success({'state':'accept'});

                                    break;
                                }

                                default: {
                                    $('.step-confirm .state').text('bp_confirm_result default');
                                }
                            }
                        }
                    }
                });
//
            }, 4000);
        });
    };

    this.submit = function( formData ) {
        //console.log('confirm submit');

        otpError = false;
        return new Promise(function(resolve, fail) {

            $.post('/confirm', {
                    'action': 'submit',
                    value: formData.otp,
                    _csrf: formData.csrf,
                    confirmRef: formData.confirmRef
                },
                function (resp) {
                    if (resp && typeof resp.status != 'undefined' && typeof resp.data != 'undefined' && resp.status == 'success'
                    && resp.data.state == 'ok') {
                        resolve(resp.data);
                    } else {
                        fail(resp);
                    }
                }
            ).fail(function(data) {
                fail(data);
            });
        });
    };

    this.clearCheck = function () {
        if ( idCheckInterval ) {
            clearInterval(idCheckInterval);
            idCheckInterval = false;
            $.get('/confirm/cancel');
        }
    };
}