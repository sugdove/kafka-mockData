/**
 * Created by suge on 2018/1/25
 */
var FormWizard = function () {


    return {
        //main function to initiate the module
        init: function () {
            if (!jQuery().bootstrapWizard) {
                return;
            }

            function format(state) {
                if (!state.id) return state.text; // optgroup
                return "<img class='flag' src='assets/img/flags/" + state.id.toLowerCase() + ".png'/>&nbsp;&nbsp;" + state.text;
            }

            $("#country_list").select2({
                placeholder: "Select",
                allowClear: true,
                formatResult: format,
                formatSelection: format,
                escapeMarkup: function (m) {
                    return m;
                }
            });

            var form = $('#submit_form');
            var error = $('.alert-error', form);
            var success = $('.alert-success', form);
            form.validate({
                doNotHideMessage: true, //this option enables to show the error/success messages on tab switch.
                errorElement: 'span', //default input error message container
                errorClass: 'validate-inline', // default input error message class
                focusInvalid: false, // do not focus the last invalid input
                rules: {
                    //account  rules: {
                    msg: {
                        required: true
                    },
                    vmidset: {
                        minlength: 1,
                        required: true
                    },
                    vmname: {
                        minlength: 1,
                        required: true
                    },
                    groupname: {
                        required: true
                    },
                    Msname:{
                        required:true
                    }
                    //profile

                },
                messages: {
                    groupname: {
                        required: "请填写topic！"
                    },
                    Msname:{
                        required:"请填写描述！"
                    }
                },
                onfocus: true,
                onkeyup: false,　　　　//这个地方要注意，修改去控制器验证的事件。
                onsubmit: false,

                errorPlacement: function (error, element) { // render error placement for each input type
                    if (element.attr("name") == "gender") { // for uniform radio buttons, insert the after the given container
                        error.addClass("no-left-padding").insertAfter("#form_gender_error");
                    } else if (element.attr("name") == "payment[]") { // for uniform radio buttons, insert the after the given container
                        error.addClass("no-left-padding").insertAfter("#form_payment_error");
                    } else {
                        error.insertAfter(element); // for other inputs, just perform default behavoir
                    }
                },

                invalidHandler: function (event, validator) { //display error alert on form submit
                    success.hide();
                    error.show();
                    App.scrollTo(error, -200);
                },

                highlight: function (element) { // hightlight error inputs
                    $(element)
                        .closest('.help-inline').removeClass('ok'); // display OK icon
                    $(element)
                        .closest('.control-group').removeClass('success').addClass('error'); // set error class to the control group
                },

                unhighlight: function (element) { // revert the change dony by hightlight
                    $(element)
                        .closest('.control-group').removeClass('error'); // set error class to the control group
                },
                success: function (label) {
                    if (label.attr("for") == "gender" || label.attr("for") == "payment[]") { // for checkboxes and radip buttons, no need to show OK icon
                        label
                            .closest('.control-group').removeClass('error').addClass('success');
                        label.remove(); // remove error label here
                    } else { // display success icon for other inputs
                        label
                            .addClass('valid ok') // mark the current input as valid and display OK icon
                            .closest('.control-group').removeClass('error').addClass('success'); // set success class to the control group
                    }
                },

                submitHandler: function (form) {
                    success.show();
                    error.hide();
                    //add here some ajax code to submit your form or just call form.submit() if you want to submit the form without ajax
                }
            });
            var displayConfirm = function() {
                $('.display-value', form).each(function(){
                    var input = $('[name="'+$(this).attr("data-display")+'"]', form);
                    if (input.is(":text") || input.is("textarea")) {
                        $(this).html(input.val());
                    } else if (input.is("select")) {
                        $(this).html(input.find('option:selected').text());
                    } else if (input.is(":radio") && input.is(":checked")) {
                        $(this).html(input.attr("data-title"));
                    } else if ($(this).attr("data-display") == 'card_expiry') {
                        $(this).html($('[name="card_expiry_mm"]', form).val() + '/' + $('[name="card_expiry_yyyy"]', form).val());
                    } else if ($(this).attr("data-display") == 'payment') {
                        var payment = [];
                        $('[name="payment[]"]').each(function(){
                            payment.push($(this).attr('data-title'));
                        });
                        $(this).html(payment.join("<br>"));
                    }
                });
            }

            // default form wizard
            $('#form_wizard_1').bootstrapWizard({

                'nextSelector': '.button-next',
                'previousSelector': '.button-previous',

                onTabClick: function (tab, navigation, index) {
                    return false;
                },
                onNext: function (tab, navigation, index) {
                    success.hide();
                    error.hide();

                    if (form.valid() == false) {
                        return false;
                    }
                    //验证第一界面是否选择了虚拟机
                    if($("#tab1").find($("input[type='radio']:checked")).length==0&&$("#tab1").hasClass("active")){
                        console.log($("#tree_1").find(".eee").children(".id").text());
                        $.confirm({
                            confirmButtonClass: 'btn btn-info',
                            cancelButtonClass: 'btn-danger',
                            confirmButton:'确认',
                            cancelButton:'取消',
                            animation: 'zoom',
                            closeAnimation: 'rotateXR',
                            title: '操作错误！',
                            content: '请选择表！（此确认框会在2秒后消失）',
                            autoClose: '返回|2000',
                            buttons: {
                                返回: function () {

                                },
                            }
                        });
                        return false;
                    }
                    //验证第二界面是否选择了表
                    if($("#tab2").find($("input[type='radio']:checked")).length===0&&$("#tab2").hasClass("active")){
                        console.log($("#tree_2").find(".eee").children(".id").text());
                        $.confirm({
                            confirmButtonClass: 'btn btn-info',
                            cancelButtonClass: 'btn-danger',
                            confirmButton:'确认',
                            cancelButton:'取消',
                            animation: 'zoom',
                            closeAnimation: 'rotateXR',
                            title: '操作错误！',
                            content: '请选择表！（此确认框会在2秒后消失）',
                            autoClose: '返回|2000',
                            buttons: {
                                返回: function () {

                                },
                            }
                        });
                        return false;
                    }
                    //验证第二界面表名和第一界面是否相同
                    if($("#tab2").find($("input[type='radio']:checked")).length===1&&$("#tab2").hasClass("active")&&zookeeper===zookeeper2&&tableName===tableName2){
                        console.log($("#tree_2").find(".eee").children(".id").text());
                        $.confirm({
                            confirmButtonClass: 'btn btn-info',
                            cancelButtonClass: 'btn-danger',
                            confirmButton:'确认',
                            cancelButton:'取消',
                            animation: 'zoom',
                            closeAnimation: 'rotateXR',
                            title: '操作错误！',
                            content: '能选择和目标端不同的表名！（此确认框会在2秒后消失）',
                            autoClose: '返回|2000',
                            buttons: {
                                返回: function () {

                                },
                            }
                        });
                        return false;
                    }
                    //第一界面点击下一步时获取topic
                    else  if($("#tab1").find($("input[type='radio']:checked")).length!=0&&$("#tab1").hasClass("active")){
                    }
                    /*//第二界面拦截
                      if($("#tab2").hasClass("active")&&$("#tree_2").find(".eee").length==0){
                          console.log($("#tree_1").find(".eee").children(".id").text());
                          $.confirm({
                              confirmButtonClass: 'btn btn-info',
                              cancelButtonClass: 'btn-danger',
                              confirmButton:'确认',
                              cancelButton:'取消',
                              animation: 'zoom',
                              closeAnimation: 'rotateXR',
                              title: '操作错误！',
                              content: '请选择宿主机！（此确认框会在2秒后消失）',
                              autoClose: '返回|2000',
                              buttons: {
                                  返回: function () {

                                  },
                              }
                          });
                          return false;

                      }*/
                    var total = navigation.find('li').length;
                    var current = index + 1;
                    // set wizard title
                    $('.step-title', $('#form_wizard_1')).text('Step ' + (index + 1) + ' of ' + total);
                    // set done steps
                    jQuery('li', $('#form_wizard_1')).removeClass("done");
                    var li_list = navigation.find('li');
                    for (var i = 0; i < index; i++) {
                        jQuery(li_list[i]).addClass("done");
                    }

                    if (current == 1) {
                        $('#form_wizard_1').find('.button-previous').hide();
                    } else {
                        $('#form_wizard_1').find('.button-previous').show();
                    }

                    if (current >= total) {
                        $('#form_wizard_1').find('.button-next').hide();
                        $('#form_wizard_1').find('.button-submit').show();
                        displayConfirm();
                    } else {
                        $('#form_wizard_1').find('.button-next').show();
                        $('#form_wizard_1').find('.button-submit').hide();
                    }
                    App.scrollTo($('.page-title'));
                },
                onPrevious: function (tab, navigation, index) {
                    success.hide();
                    error.hide();

                    var total = navigation.find('li').length;
                    var current = index + 1;
                    // set wizard title
                    $('.step-title', $('#form_wizard_1')).text('Step ' + (index + 1) + ' of ' + total);
                    // set done steps
                    jQuery('li', $('#form_wizard_1')).removeClass("done");
                    var li_list = navigation.find('li');
                    for (var i = 0; i < index; i++) {
                        jQuery(li_list[i]).addClass("done");
                    }

                    if (current == 1) {
                        $('#form_wizard_1').find('.button-previous').hide();
                    } else {
                        $('#form_wizard_1').find('.button-previous').show();
                    }

                    if (current >= total) {
                        $('#form_wizard_1').find('.button-next').hide();
                        $('#form_wizard_1').find('.button-submit').show();
                    } else {
                        $('#form_wizard_1').find('.button-next').show();
                        $('#form_wizard_1').find('.button-submit').hide();
                    }

                    App.scrollTo($('.page-title'));
                },
                onTabShow: function (tab, navigation, index) {
                    var total = navigation.find('li').length;
                    var current = index + 1;
                    var $percent = (current / total) * 100;
                    $('#form_wizard_1').find('.bar').css({
                        width: $percent + '%'
                    });
                }
            });
            $('#form_wizard_1').find('.button-previous').hide();
            $('#form_wizard_1 .button-submit').hide();
        }

    };

}();