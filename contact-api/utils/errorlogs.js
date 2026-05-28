const fs = require('fs');
const path = require('path');

// Log the errors to a CSV file
const logErrors = (duplicateEmails, invalidRows) => {
    const errorReportPath = 'upload_error_report.csv'; 
    const logDirPath = path.join(__dirname, '../error_logs'); 
    const logFilePath = path.join(logDirPath, errorReportPath);
    if (!fs.existsSync( logDirPath)) {
        fs.mkdirSync(logDirPath, { recursive: true }); 
    }

    let logData = '';
    if (!fs.existsSync(logFilePath)) {
        logData += 'Row,Error Type,Details\n';
    }
  
    duplicateEmails.forEach((item) => {
        logData += `${item.row},Duplicate Email,${item.email}\n`;
    });


    invalidRows.forEach((item) => {
        logData += `${item.row},Invalid Data,Name: ${item.contact.name}, Email: ${item.contact.email}\n`;
    });

    
    fs.appendFileSync(logFilePath, logData);
    return errorReportPath;
};

module.exports = {
    logErrors
};
