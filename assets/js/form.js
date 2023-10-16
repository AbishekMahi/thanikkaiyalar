(function () {
    function validEmail(email) {
        var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
        return re.test(email);
    }

    function validateHuman(honeypot) {
        if (honeypot) {
            console.log("Robot Detected!");
            return true;
        } else {
            console.log("Welcome Human!");
        }
    }

    function getFormData(form) {
        var elements = form.elements;

        var fields = Object.keys(elements).filter(function (k) {
            return (elements[k].name !== "honeypot");
        }).map(function (k) {
            if (elements[k].name !== undefined) {
                return elements[k].name;
            } else if (elements[k].length > 0) {
                return elements[k].item(0).name;
            }
        }).filter(function (item, pos, self) {
            return self.indexOf(item) == pos && item;
        });

        var formData = {};
        fields.forEach(function (name) {
            var element = elements[name];
            formData[name] = element.value;
            if (element.length) {
                var data = [];
                for (var i = 0; i < element.length; i++) {
                    var item = element.item(i);
                    if (item.checked || item.selected) {
                        data.push(item.value);
                    }
                }
                formData[name] = data.join(', ');
            }
        });

        // add form-specific values into the data
        formData.formDataNameOrder = JSON.stringify(fields);
        formData.formGoogleSheetName = form.dataset.sheet || "Sheet1"; // default sheet name
        formData.formGoogleSendEmail = form.dataset.email || ""; // no email by default

        console.log(formData);
        return formData;
    }

    function handleFormSubmit(event) {
        event.preventDefault();
        var form = event.target;
        var button = form.querySelector("#button");
        button.disabled = true;
        button.textContent = "Sending...";

        var data = getFormData(form);
        if (data.email && !validEmail(data.email)) {
            var invalidEmail = form.querySelector(".email-invalid");
            if (invalidEmail) {
                invalidEmail.style.display = "block";
                button.disabled = false;
                button.textContent = "Send Message";
                return false;
            }
        } else {
            disableAllButtons(form);
            var url = form.action;
            var xhr = new XMLHttpRequest();
            xhr.open('POST', url);
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhr.onreadystatechange = function () {
                console.log(xhr.status, xhr.statusText);
                console.log(xhr.responseText);
                var formElements = form.querySelector(".form-elements");
                if (formElements) {
                    formElements.style.display = "none"; // hide form
                }
                var thankYouMessage = form.querySelector(".thankyou_message");
                if (thankYouMessage) {
                    thankYouMessage.style.display = "block";
                }
                return;
            };
            var encoded = Object.keys(data).map(function (k) {
                return encodeURIComponent(k) + "=" + encodeURIComponent(data[k]);
            }).join('&');
            xhr.send(encoded);
        }
    }

    function loaded() {
        console.log("Contact form submission handler loaded successfully.");
        var forms = document.querySelectorAll("form.gform");
        for (var i = 0; i < forms.length; i++) {
            forms[i].addEventListener("submit", handleFormSubmit, false);
        }
    };
    document.addEventListener("DOMContentLoaded", loaded, false);

    function disableAllButtons(form) {
        var buttons = form.querySelectorAll("#button");
        for (var i = 0; i < buttons.length; i++) {
            buttons[i].disabled = true;
        }
    }
})();

  // browser details, deviceType and url details

  document.addEventListener("DOMContentLoaded", function () {
    var urlInput = document.getElementById("geturl");
    urlInput.value = window.location.href;
});

// Detect the user's browser and get the browser name
var browserName = detectBrowser();

// Set the value of the input field with the browser name
document.getElementById("browserName").value = browserName;

function detectBrowser() {
    var userAgent = navigator.userAgent;
    var browserName = "Unknown";

    if (userAgent.indexOf("Chrome") != -1) {
        browserName = "Google Chrome";
    } else if (userAgent.indexOf("Firefox") != -1) {
        browserName = "Mozilla Firefox";
    } else if (userAgent.indexOf("Safari") != -1) {
        browserName = "Apple Safari";
    } else if (userAgent.indexOf("MSIE") != -1 || userAgent.indexOf("Trident") != -1) {
        browserName = "Internet Explorer";
    } else if (userAgent.indexOf("Edge") != -1) {
        browserName = "Microsoft Edge";
    } else if (userAgent.indexOf("Opera") != -1 || userAgent.indexOf("OPR") != -1) {
        browserName = "Opera";
    }
    return browserName;
}

// Detect the user's device type and get the device type
var deviceType = detectDeviceType();

// Set the value of the input field with the device type
document.getElementById("deviceType").value = deviceType;

function detectDeviceType() {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        return "Mobile Device";
    } else {
        return "Desktop Device";
    }
} 