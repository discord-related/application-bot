async function validateConfig(config) {
    let resultString = "";
    try {
        const { Applications, acceptedColor, applyMessage, deniedColor, pendingColor, token } = config;

        token ? "" : resultString += "❌ Token is missing from config.\n";
        applyMessage ? "" : resultString += "❌ Apply message is missing from config.yml\n";
        acceptedColor ? "" : resultString += "❌ Accepted color is missing from config.yml\n";
        pendingColor ? "" : resultString += "❌ Pending color is missing from config.yml\n";
        deniedColor ? "" : resultString += "❌ Denied color is missing from config.yml\n";
        Applications ? (
            Object.entries(Applications).forEach(([name, application]) => {
                const { acceptedRoles, Channel, deniedRoles, description, mentionRoles, Questions, requiredRoles, restrictedRoles } = application;

                if (application != null) {
                    Questions ? (
                        Object.entries(Questions).forEach(([question, questionOptions]) => {
                            const { maxLength, minLength, required, type } = questionOptions;

                            minLength != undefined ? "" : resultString += `❌ Min length is missing from ${question} in ${name} in config.yml\n`;
                            maxLength != undefined ? "" : resultString += `❌ Max length is missing from ${question} in ${name} in config.yml\n`;
                            type != undefined ? "" : resultString += `❌ Type is missing from ${question} in ${name} in config.yml\n`;
                            required != undefined ? "" : resultString += `❌ Required is missing from ${question} in ${name} in config.yml\n`;
                        })
                    ) : resultString += `❌ Questions are missing from ${name} in config.yml\n`;
                    Channel ? "" : resultString += `❌ Channel is missing from ${name} in config.yml\n`;
                    acceptedRoles ? "" : resultString += `❌ Accepted roles are missing from ${name} in config.yml\n`;
                    mentionRoles ? "" : resultString += `❌ Mention roles are missing from ${name} in config.yml\n`;
                    requiredRoles ? "" : resultString += `❌ Required roles are missing from ${name} in config.yml\n`;
                    restrictedRoles ? "" : resultString += `❌ Restricted roles are missing from ${name} in config.yml\n`;
                    deniedRoles ? "" : resultString += `❌ Denied roles are missing from ${name} in config.yml\n`;
                    description ? "" : resultString += `❌ Description is missing from ${name} in config.yml\n`;
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

module.exports = { validateConfig };