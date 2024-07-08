const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const formData = require('form-data');
const Mailgun = require('mailgun.js');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5001;

const mailgun = new Mailgun(formData);
const mg = mailgun.client({ username: 'api', key: process.env.MAILGUN_API_KEY });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/form.html');
});

app.post('/send-email', (req, res) => {
    const formData = req.body;

    const keys = {
        'Человек-природа': ['1a', '3b', '6a', '10a', '11a', '13b', '16a', '20a'],
        'Человек-техника': ['1b', '4a', '7b', '9a', '11b', '14a', '17b', '19a'],
        'Человек-человек': ['2a', '4b', '6b', '8a', '12a', '14b', '16b', '18a'],
        'Человек-знаковая система': ['2b', '5a', '9b', '10b', '12b', '15a', '19b', '20b'],
        'Человек-художественный образ': ['3a', '5b', '7a', '8b', '13a', '15b', '17a', '18b']
    };

    const scores = {
        'Человек-природа': 0,
        'Человек-техника': 0,
        'Человек-человек': 0,
        'Человек-знаковая система': 0,
        'Человек-художественный образ': 0
    };

    console.log('Выбранные ответы:', formData);

    Object.entries(formData).forEach(([question, answer]) => {
        Object.entries(keys).forEach(([type, answers]) => {
            if (answers.includes(answer)) {
                scores[type]++;
            }
        });
    });

    console.log('Подсчет баллов:', scores);

    const maxType = Object.keys(scores).reduce((a, b) => (scores[a] > scores[b] ? a : b));

    const interpretation = {
        'Человек-природа': 'все профессии, связанные с растениеводством, животноводством и лесным хозяйством;',
        'Человек-техника': 'все технические профессии',
        'Человек-человек': 'все профессии, связанные с обслуживанием людей, с общением',
        'Человек-знаковая система': 'все профессии, связанные с обсчетами, цифровыми и буквенными знаками, в том числе и музыкальные специальности',
        'Человек-художественный образ': 'все творческие специальности'
    };

    const resultMessage = `
        ФИО ребенка: ${formData.name}
        ФИО родителя: ${formData.parentName}
        Возраст и класс: ${formData.age}
        Телефон: ${formData.phone}
        Город: ${formData.city}

        Выбранные ответы: ${JSON.stringify(formData)}
        Подсчет баллов: ${JSON.stringify(scores)}

        Рекомендуемый тип профессии: ${maxType}
        ${interpretation[maxType]}
    `;

    const data = {
        from: `Test Results <mailgun@${process.env.MAILGUN_DOMAIN}>`,
        to: process.env.MAILGUN_RECIPIENT,
        subject: 'Новые результаты теста профессии',
        text: resultMessage
    };

    mg.messages.create(process.env.MAILGUN_DOMAIN, data)
        .then(msg => {
            console.log('Email sent successfully:', msg);
            res.status(200).json({ status: 'success' });
        })
        .catch(err => {
            console.error('Error sending email:', err);
            res.status(500).json({ status: 'error', message: err.message });
        });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
