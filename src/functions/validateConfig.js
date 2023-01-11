async function validateConfig(config) {
    let resultString = "";
    try {
        config.token ? "" : resultString += "❌ Token is missing from config.\n";
        config.applyMessage ? "" : resultString += "❌ Apply message is missing from config.yml\n";
        config.acceptedColor ? "" : resultString += "❌ Accepted color is missing from config.yml\n";
        config.pendingColor ? "" : resultString += "❌ Pending color is missing from config.yml\n";
        config.deniedColor ? "" : resultString += "❌ Denied color is missing from config.yml\n";
        config.Applications ? (
            Object.entries(config.Applications).forEach(([name, application]) => {
                if(application != null) {
                    application.Questions ? (
                        Object.entries(application.Questions).forEach(([question, questionOptions]) => {
                            questionOptions.minLength != undefined ? "" : resultString += `❌ Min length is missing from ${question} in ${name} in config.yml\n`;
                            questionOptions.maxLength != undefined ? "" : resultString += `❌ Max length is missing from ${question} in ${name} in config.yml\n`;
                            questionOptions.type != undefined ? "" : resultString += `❌ Type is missing from ${question} in ${name} in config.yml\n`;
                            questionOptions.required != undefined ? "" : resultString += `❌ Required is missing from ${question} in ${name} in config.yml\n`;
                        })
                    ) : resultString += `❌ Questions are missing from ${name} in config.yml\n`;
                    application.Channel ? "" : resultString += `❌ Channel is missing from ${name} in config.yml\n`;
                    application.acceptedRoles ? "" : resultString += `❌ Accepted roles are missing from ${name} in config.yml\n`;
                    application.mentionRoles ? "" : resultString += `❌ Mention roles are missing from ${name} in config.yml\n`;
                    application.requiredRoles ? "" : resultString += `❌ Required roles are missing from ${name} in config.yml\n`;
                    application.restrictedRoles ? "" : resultString += `❌ Restricted roles are missing from ${name} in config.yml\n`;
                    application.deniedRoles ? "" : resultString += `❌ Denied roles are missing from ${name} in config.yml\n`;
                    application.description ? "" : resultString += `❌ Description is missing from ${name} in config.yml\n`;
                } else {
                    resultString += `❌ Application ${name} is missing data in config.yml\n`;
                }
            })
        ) : resultString += "❌ Applications are missing from config.yml\n";

        if (resultString.length < 1) resultString = "✅ Config validation passed!";
        return resultString;

    } catch (err) {
        console.log(err);
        return "❌ Config validation failed!";
    }

}


module.exports = {validateConfig};