function dateAndTimeToString(date) {
    return `${dateToString(date)}, ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
}

function dateToString(date) {
    const dateChange = new Date(date)
    var day = dateChange.getDate();
    var month = dateChange.getMonth() + 1; // Months are zero-based, so we add 1
    var year = dateChange.getFullYear();

    // Add leading zeros if necessary
    if (day < 10) {
        day = '0' + day;
    }

    if (month < 10) {
        month = '0' + month;
    }
    return `${day}.${month}.${year}`;
}
module.exports =
{
    dateAndTimeToString,
    dateToString
};

function dateToDashString(date) {
    const dateChange = new Date(date)
    var day = dateChange.getDate();
    var month = dateChange.getMonth() + 1;
    var year = dateChange.getFullYear();

    if (day < 10) {
        day = '0' + day;
    }

    if (month < 10) {
        month = '0' + month;
    }
    return `${year}-${month}-${day}`;
}

function convertDateTime(datetimeStr) {
    // Convert string to Date object
    var datetimeObj = new Date(datetimeStr);

    // Extract the desired components
    var year = datetimeObj.getFullYear();
    var month = ("0" + (datetimeObj.getMonth() + 1)).slice(-2);
    var day = ("0" + datetimeObj.getDate()).slice(-2);
    var hours = ("0" + datetimeObj.getHours()).slice(-2);
    var minutes = ("0" + datetimeObj.getMinutes()).slice(-2);

    // Create the converted datetime string
    var convertedStr = year + "-" + month + "-" + day + "T" + hours + ":" + minutes;

    return convertedStr;
}

module.exports =
{
    dateAndTimeToString,
    dateToString,
    dateToDashString,
    convertDateTime
};
