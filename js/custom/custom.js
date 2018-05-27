
$(function () {
    
    var checkValidate;
    var check;
    var genericCloseBtnHtml = '<button onclick="$(this).closest(\'div.popover\').popover(\'hide\');" type="button" class="close color" aria-hidden="true" style="color:#ffffff">&times;</button>';
    $('#about-info').popover({
        title: "รายละเอียกแอตทริบิวต์"+genericCloseBtnHtml,
        html: true,
        toggle: "popover",
        placement: "bottom",
        content: function(){
            var html = ""
            for (var i = 0; i < descriptions.length; i++) {
                html += '<p>'+descriptions[i]+'</p>';
            }
            // html = '<ui>' + html + '</ui>'
            return html;
        }
    });
    $(".tab-wizard").steps({
        headerTag: "h5",
        bodyTag: "section",
        transitionEffect: "fade",
        titleTemplate: '<span class="step">#index#</span> #title#',
        labels: {
            finish: "Prediction"
        },
        onFinished: function (event, currentIndex) {
            check = false;
            checkValidate = [];
            checkFormValidation(checkValidate, currentIndex)
            check = checkLength(checkValidate);
            if(check){
                let result = Prediction();                
                if (result === "LIVE") {
                    alertLive();
                } else if (result === "DIE") {
                    alertDie();
                } 
            }       
        },
        onStepChanging: function (event, currentIndex, newIndex) {
            check = false;
            checkValidate = []
            if (currentIndex < newIndex) {
                checkFormValidation(checkValidate, currentIndex)
            }
            check = checkLength(checkValidate);
            return check;
        }
    });
    function Prediction() {
        var result = "";
        let age = $("#Age").val();
        let sex = $("input[name='Sex']:checked").val();
        let steroid = $("input[name='Steroid']:checked").val();
        let antivirals = $("input[name='Antivirals']:checked").val();
        let fatigue = $("input[name='Fatigue']:checked").val();
        let malaise = $("input[name='Malaise']:checked").val();
        let anorexia = $("input[name='Anorexia']:checked").val();
        let liver_big = $("input[name='LiverBig']:checked").val();
        let liver_firm = $("input[name='LiverFirm']:checked").val();
        let spleen_palpable = $("input[name='SpleenPalpable']:checked").val();
        let spiders = $("input[name='Spiders']:checked").val();
        let ascites = $("input[name='Ascites']:checked").val();
        let varices = $("input[name='Varices']:checked").val();
        let bilirubin = $("#Bilirubin").val();
        let alk_phosphate = $("#ALKPhosphate").val();
        let SGOT = $("#SGOT").val();
        let albumin = $("#Albumin").val();
        let protime = $("#Protime").val();
        let histology = $("input[name='Histology']:checked").val();

        if (ascites === "0" && spiders === "0" && protime <= 43 && fatigue === "0") {
            result = "LIVE";
        } else if (ascites === "0" && spiders === "0" && protime <= 43 && fatigue === "1") {
            result = "DIE";
        } else if (ascites === "0" && spiders === "0" && protime > 43) {
            result = "LIVE";
        } else if (ascites === "0" && spiders === "1" && sex === "male") {
            result = "LIVE";
        } else if (ascites === "0" && spiders === "1" && sex === "female" && liver_firm === "0" && age <= 40) {
            result = "LIVE";
        } else if (ascites === "0" && spiders === "1" && sex === "female" && liver_firm === "0" && age > 40) {
            result = "DIE";
        } else if (ascites === "0" && spiders === "1" && sex === "female" && liver_firm === "1" && bilirubin <= 1.427517) {
            result = "LIVE";
        } else if (ascites === "0" && spiders === "1" && sex === "female" && liver_firm === "1" && bilirubin > 1.427517 && age <= 53 && alk_phosphate <= 127) {
            result = "DIE";
        } else if (ascites === "0" && spiders === "1" && sex === "female" && liver_firm === "1" && bilirubin > 1.427517 && age <= 53 && alk_phosphate > 127) {
            result = "LIVE";
        } else if (ascites === "0" && spiders === "1" && sex === "female" && liver_firm === "1" && bilirubin > 1.427517 && age > 53) {
            result = "DIE";
        } else if (ascites === "1" && age <= 28) {
            result = "LIVE";
        } else if (ascites === "1" && age > 28) {
            result = "DIE";
        }

        return result;
    }
    $(":input").bind("keyup change", function (e) {
        let type = $(this).attr("type")
        if (type === "number") {
            let value = $(this).val()
            if(value){
                $(this).removeClass("form-control-danger");
                $(this).prev().css({ 'color': "black" });
            }
        } else if (type === "radio") {
            $(this).parent().parent().find("label").css({ 'color': "black" });
        }
    });
    function checkFormValidation(checkValidate, currentIndex) {
        let num = currentIndex + 1
        let element = '.section-' + num + ''
        $(element).find('input').each(function () {
            let type = $(this).attr("type");
            if (type === "number") {
                let value = $(this).val()
                if (!value) {
                    let inputId = $(this).attr("id")
                    checkArrays(checkValidate, inputId)
                    $(this).addClass("form-control-danger");
                    $(this).prev().css({ 'color': "#f62d51" });
                }
            } else if (type === "radio") {
                let name = $(this).attr("name");
                let selectedValue = $("input[name=" + name + "]:checked").val()
                if (selectedValue === undefined) {
                    checkArrays(checkValidate, name)
                    $(this).parent().parent().find("label").css({ 'color': "#f62d51" });
                }
            }
        });
    }
    function checkArrays(checkValidate, value) {
        let test = checkValidate.find(x => x === value)
        if (test === undefined) {
            checkValidate.push(value)
            // console.log(checkValidate)            
        }
    }
    function checkLength(checkValidate) {
        let check = false;
        if (checkValidate.length > 0) {
            check = false;
        } else {
            check = true;
        }
        return check;
    }
    function alertLive() {
        swal("Live", "กดปุ่ม OK เพื่อปิด", "success");
    }
    function alertDie() {
        swal("Die", "กดปุ่ม OK เพื่อปิด", "error");
    }
});