const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const mailjet = require('node-mailjet');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5001;

const mailjetClient = mailjet.connect(process.env.MJ_APIKEY_PUBLIC, process.env.MJ_APIKEY_PRIVATE);

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

    Object.entries(formData).forEach(([question, answer]) => {
        Object.entries(keys).forEach(([type, answers]) => {
            if (answers.includes(answer)) {
                scores[type]++;
            }
        });
    });

    const maxType = Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b);

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

        Рекомендуемый тип профессии: ${maxType}
        ${interpretation[maxType]}
    `;

    const request = mailjetClient.post('send', { version: 'v3.1' }).request({
        Messages: [
            {
                From: {
                    Email: 'your-email@example.com',
                    Name: 'Test Results'
                },
                To: [
                    {
                        Email: process.env.MAILJET_RECIPIENT,
                        Name: 'Recipient'
                    }
                ],
                Subject: 'Новые результаты теста профессии',
                TextPart: resultMessage
            }
        ]
    });

    request.then((result) => {
        console.log(result.body);
        res.status(200).json({ status: 'success' });
    }).catch((err) => {
        console.error(err.statusCode);
        res.status(500).json({ status: 'error', message: err.message });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
