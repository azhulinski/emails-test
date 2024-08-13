const fs = require('fs');

let recognized = [];
let usersData
let sampleData;

try {
    usersData = fs.readFileSync('users.json', 'utf8');
} catch (err) {
    console.log(err);
}

try {
    sampleData = fs.readFileSync('sample_data.json', 'utf8');
} catch (err) {
    console.log(err);
}

const userObject = JSON.parse(usersData)
    .filter((value, index, self) =>
        index === self.findIndex((t) =>
            t.name === value.name && t.email === value.email));

let sampleObject = JSON.parse(sampleData)
let notRecognized = JSON.parse(JSON.stringify(sampleObject)).map(entry => {
    return entry.email || entry.account_email;
});

userObject.map(userEntry => {

    const [firstName, lastName] = userEntry.name.split(" ");
    const userEmail = userEntry.email;
    let found = []

    sampleObject.map(sampleEntry => {
        const sampleEmail = sampleEntry.email || sampleEntry.account_email;
        if (sampleEmail.includes(firstName.toLowerCase()) || sampleEmail.includes(lastName.toLowerCase())) {
            found.push(sampleEmail);
        }
    })
    notRecognized = notRecognized.filter(sampleEntry =>
        !found.some(foundMail =>
            sampleEntry === foundMail))
    recognized.push({"user_email": userEmail, "related_emails": found});
})

try {
    fs.writeFileSync('output.json', JSON.stringify({"recognized": recognized, "not_recognized": notRecognized}));
} catch (err) {
    console.error(err);
}
