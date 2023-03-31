"use strict";

/**
 * BASE_URL vale will need changing to point to API
 */
const BASE_URL = 'http://127.0.0.1/API/'

/**
 * Toggle requirement of endDateTime and Outcome based on Completion status
 */
  function setComplete(completeSelect) {
    console.log(completeSelect.value);
    if (completeSelect.value && completeSelect.value == "Yes") {
        //show mandatory fields and mark required
        document.getElementById("endDateTimeContainer").hidden = false;
        document.getElementById("endDateTime").required = true;
        document.getElementById("outcomeContainer").hidden = false;
        document.getElementById("outcome").required = true;
    } else {
        //hide mandatory fields and mark not required
        document.getElementById("endDateTimeContainer").hidden = true;
        document.getElementById("endDateTime").required = false;
        document.getElementById("outcomeContainer").hidden = true;
        document.getElementById("outcome").required = false;
    }
}

function validateForm() {
    /**
     * Get form field values
     */
    let careTitleValue = document.forms["careForm"]["title"].value;
    let patientNameValue = document.forms["careForm"]["patientName"].value;
    let userNameValue = document.forms["careForm"]["userName"].value;
    let actualStartDateTimeValue = document.forms["careForm"]["actualStartDateTime"].value;
    let targetStartDateTimeValue = document.forms["careForm"]["targetStartDateTime"].value;
    let reasonValue = document.forms["careForm"]["reason"].value;
    let actionValue = document.forms["careForm"]["action"].value;
    let completeSelectValue = document.forms["careForm"]["completeSelect"].value;
    let endDateTimeValue = document.forms["careForm"]["endDateTime"].value;
    let outcomeValue = document.forms["careForm"]["outcome"].value;
    /**
     * Declare error message text
     */
    let validityMessage = "";
    /**
     * Check validity of field values.
     * Construct error message text where values are invalid.
     */
    if (careTitleValue == "" || careTitleValue == null) {
        validityMessage = validityMessage + "A title is required for your care record. "
        console.log("Title invalid");
    }
    if (patientNameValue == "" || patientNameValue == null) {
        validityMessage = validityMessage + "A patient name is required. "
        console.log("Patient Name invalid");
    }
    if (userNameValue == "" || userNameValue == null) {
        validityMessage = validityMessage + "A user name is required. "
        console.log("User Name invalid");
    }
    if (actualStartDateTimeValue == "" || actualStartDateTimeValue == null) {
        validityMessage = validityMessage + "An actual start date/time is required. "
        console.log("Actual Start Date/Time invalid");
    }
    if (targetStartDateTimeValue == "" || targetStartDateTimeValue == null) {
        validityMessage = validityMessage + "A target start date/time is required. "
        console.log("Target Start Date/Time invalid");
    }
    if (reasonValue == "" || reasonValue == null) {
        validityMessage = validityMessage + "A reason for the care record is required. "
        console.log("Reason invalid");
    }
    if (actionValue == "" || actionValue == null) {
        validityMessage = validityMessage + "The actions taken must be recorded. "
        console.log("Action invalid");
    }
    if (completeSelectValue == "Yes" && (endDateTimeValue == "" || endDateTimeValue == null)) {
        validityMessage = validityMessage + "An end date/time is required. "
        console.log("End Date/Time invalid");
    }
    if (completeSelectValue == "Yes" && endDateTimeValue != "" && endDateTimeValue != null && endDateTimeValue < actualStartDateTimeValue) {
        validityMessage = validityMessage + "End date/time must be later than actual start date/time. "
        console.log("End Date/Time invalid");
    }
    if (completeSelectValue == "Yes" && (outcomeValue == "" || outcomeValue == null)) {
        validityMessage = validityMessage + "The outcome must be recorded. "
        console.log("Outcome invalid");
    }
    if (validityMessage.length > 0) {
        document.getElementById("formErrorMessage").innerHTML = validityMessage;
        document.getElementById("formValidContainer").hidden = false;
    }
    /**
     * If all fields valid remove error message and submit form.
     */
    else {
        document.getElementById("formErrorMessage").innerHTML = "";
        document.getElementById("formValidContainer").hidden = true;
        submitCareRecord(
            careTitleValue,
            patientNameValue,
            userNameValue,
            actualStartDateTimeValue,
            targetStartDateTimeValue,
            reasonValue,
            actionValue,
            completeSelectValue,
            endDateTimeValue,
            outcomeValue
        );
    }
  }



function submitCareRecord(careTitleValue,
    patientNameValue,
    userNameValue,
    actualStartDateTimeValue,
    targetStartDateTimeValue,
    reasonValue,
    actionValue,
    completeSelectValue,
    endDateTimeValue,
    outcomeValue) {
    console.log('Form valid. Submitting.');

    function onSuccess(obj) {
        console.log("submitForm received response object", obj);
        // Inform the user what response received
        if (obj.status == "success") {
            alert("Care record has been successfully saved.");
        } else if (obj.message) {
            alert(obj.message);
        } else {
            alert("Invalid data submitted");
        }

    }

    let url = BASE_URL + "carerecord";
    console.log("submitForm sending POST to " + url);
    let careRecordData = {
        "Title": careTitleValue,
        "Patient Name": patientNameValue,
        "User Name": userNameValue,
        "Actual Start Date/Time": actualStartDateTimeValue,
        "Target Date/Time": targetStartDateTimeValue,
        "Reason": reasonValue,
        "Action": actionValue,
        "Completed": completeSelectValue,
        "End Date/Time": endDateTimeValue,
        "Outcome": outcomeValue,
    }; 
    console.log(careRecordData);
    $.ajax(url, { type: "Post", data: careRecordData, success: onSuccess });
}

function getCareRecords() {
    /**
     * Get all care records.
     * Likelihood is that this would require a username to get only the current users records.
     */
    var onSuccess = function (obj) {
        console.log("getCareRecords received response object", obj);
        // Inform the user what response received
        if (obj.status == "success") {
            /**
             * Here each returned record could be added to a table of records.
             * console log serves as placeholder code
             */
            $.each(obj.data, function (index, value) {
                console.log(value);
            });
        } else if (obj.message) {
            alert(obj.message);
        } else {
            alert(obj.status + " " + obj.data[0].reason);
        }
    };

    let url = BASE_URL + "carerecord";
    console.log("getCareRecords sending GET to " + url);
    $.ajax(url, { type: "GET", data: {}, success: onSuccess });
}
