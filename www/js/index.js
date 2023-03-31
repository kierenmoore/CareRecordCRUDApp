"use strict";

/**
 * BASE_URL vale will need changing to point to API
 */
const BASE_URL = 'http://127.0.0.1/API/'
const careRecordData = [];

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

    /**
     * Above code would interact with API.
     * Mock data is used here
     */
    fetch('./data/data.json')
    .then((response) => response.json())
    .then(data => {
        data.forEach(careRecord => {
            careRecordData.push(data);
            console.log(careRecord);
            addTableRow(careRecord);
        });
    })
    .catch(error => console.error(error));
}

function addTableRow(careRecord) {
    const tableBody = document.querySelector('#careRecordsTable tbody');
    const row = document.createElement('tr');
    row.innerHTML = `
    <td>${careRecord.Title}</td>
    <td>${careRecord.Patient_Name}</td>
    <td>${careRecord.User_Name}</td>
    <td>${careRecord.Actual_Start_DateTime}</td>
    <td>${careRecord.Target_DateTime}</td>
    <td>${careRecord.Reason}</td>
    <td>${careRecord.Action}</td>
    <td>${careRecord.Completed}</td>
    <td>${careRecord.End_DateTime}</td>
    <td>${careRecord.Outcome}</td>
    <td><button id="editRecord" onclick="editRecord(${careRecord.index})">Edit record</td>
    `;
    tableBody.appendChild(row);
}

function editRecord(id) {
    console.log("edit record " + id);
    fetch('./data/data.json')
    .then((response) => response.json())
    .then(data => {
        console.log(data[id].Title)
        document.forms["careForm"]["careRecordIndex"].value = data[id].index;
        document.forms["careForm"]["title"].value = data[id].Title;
        document.forms["careForm"]["patientName"].value = data[id].Patient_Name;
        document.forms["careForm"]["userName"].value = data[id].User_Name;
        document.forms["careForm"]["actualStartDateTime"].value = data[id].Actual_Start_DateTime;
        document.forms["careForm"]["targetStartDateTime"].value = data[id].Target_DateTime;
        document.forms["careForm"]["reason"].value = data[id].Reason;
        document.forms["careForm"]["action"].value = data[id].Action;
        document.forms["careForm"]["completeSelect"].value = data[id].Completed;
        document.forms["careForm"]["endDateTime"].value = data[id].End_DateTime;
        document.forms["careForm"]["outcome"].value = data[id].Outcome;
    });
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
    let careRecord = {
        "index": careRecordData.length + 1,
        "Title": careTitleValue,
        "Patient_Name": patientNameValue,
        "User_Name": userNameValue,
        "Actual_Start_DateTime": actualStartDateTimeValue,
        "Target_DateTime": targetStartDateTimeValue,
        "Reason": reasonValue,
        "Action": actionValue,
        "Completed": completeSelectValue,
        "End_DateTime": endDateTimeValue,
        "Outcome": outcomeValue,
    }; 
    console.log(careRecord);
    $.ajax(url, { type: "Post", data: careRecord, success: onSuccess });

    /**
     * Above code would interact with API.
     * Mock data is used here
     */
    careRecordData.push(careRecord);
    console.log(careRecordData);
    addTableRow(careRecord);
}