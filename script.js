document.getElementById('contact-form').addEventListener('submit', function(e) {
  e.preventDefault(); // Отключаем стандартное поведение формы

  // Собираем данные формы
  let formData = new FormData(this);
  let data = {};
  formData.forEach((value, key) => {
    data[key] = value;
  });

  // Обработка данных
  const keys = {
    'Человек-природа': ['1a', '3b', '6a', '10a', '11a', '13b', '16a', '20a'],
    'Человек-техника': ['1b', '4a', '7b', '9a', '11b', '14a', '17b', '19a'],
    'Человек-человек': ['2a', '4b', '6b', '8a', '12a', '14b', '16b', '18a'],
    'Человек-знаковая система': ['2b', '5a', '9b', '10b', '12b', '15a', '19b', '20b'],
    'Человек-художественный образ': ['3a', '5b', '7a', '8b', '13a', '15b', '17a', '18b'],
  };

  const scores = {
    'Человек-природа': 0,
    'Человек-техника': 0,
    'Человек-человек': 0,
    'Человек-знаковая система': 0,
    'Человек-художественный образ': 0,
  };

  Object.entries(data).forEach(([question, answer]) => {
    Object.entries(keys).forEach(([type, answers]) => {
      if (answers.includes(answer)) {
        scores[type]++;
      }
    });
  });

  const maxType = Object.keys(scores).reduce((a, b) => (scores[a] > scores[b] ? a : b));
  const interpretation = {
    'Человек-природа': 'все профессии, связанные с растениеводством, животноводством и лесным хозяйством;',
    'Человек-техника': 'все технические профессии',
    'Человек-человек': 'все профессии, связанные с обслуживанием людей, с общением',
    'Человек-знаковая система': 'все профессии, связанные с обсчетами, цифровыми и буквенными знаками, в том числе и музыкальные специальности',
    'Человек-художественный образ': 'все творческие специальности',
  };

  const resultMessage = `
    ФИО ребенка: ${data.name}
    ФИО родителя: ${data.parentName}
    Возраст и класс: ${data.age}
    Телефон: ${data.phone}
    Город: ${data.city}
    Выбранные ответы: ${JSON.stringify(data)}
    Рекомендуемый тип профессии: ${maxType}
    ${interpretation[maxType]}
  `;

  console.log('Результат:', resultMessage);

  // Отправка данных на Google Apps Script
const url = 'https://script.google.com/macros/s/AKfycbzcaok8sZovW-7lxMkfHes0PIecfioCU-psAX5fCEvYp4dWImZ-wlXSIJL8YdLymwWVZw/exec';
  
fetch(url, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  body: new URLSearchParams(formData) // предполагается, что formData — это объект с данными формы
})
.then(response => response.json())
.then(data => console.log('Success:', data))
.catch((error) => console.error('Error:', error));
});

// const URL_APP =     "https://script.google.com/macros/s/AKfycbzcaok8sZovW-7lxMkfHes0PIecfioCU-psAX5fCEvYp4dWImZ-wlXSIJL8YdLymwWVZw/exec";

// // находим форму в документе
// const form = document.querySelector("#mainForm");

// // указываем адрес отправки формы (нужно только в начале примера)
// form.action = URL_APP;

// // вспомогательная функция проверки заполненности формы
// function isFilled(details) {
// 	const { name, email, phone, rule } = details;
// 	if (!name) return false;
// 	if (!email) return false;
// 	if (!phone) return false;
// 	if (!rule) return false;
// 	return true;
// }

// // навешиваем обработчик на отправку формы
// document.getElementById("mainForm").addEventListener("submit", async (ev) => {
// 	ev.preventDefault();

// 	const formData = new FormData(ev.target);
// 	// получаем ссылки на элементы формы

// 	const name = document.querySelector("[name=name]");
// 	const email = document.querySelector("[name=email]");
// 	const phone = document.querySelector("[name=phone]");
// 	const message = document.querySelector("[name=message]");

// 	const rule = document.querySelector("[name=rule]");

// let totalScore = 0;
// formData.forEach((value, key) => {
// 	if (key.startsWith("q") && !isNaN(value) && value !== "") {
// 			totalScore += parseInt(value, 10);
// 	}
// });

// // Добавляем результат в поле message
// message.value = `Количество баллов: ${totalScore}`;

// let messageResult;
// if (totalScore >= 0 && totalScore <= 3) {
// messageResult = `Ваши результаты - ${totalScore}: от 0-3, вы можете смело лететь в космос, поскольку вы не склонны к психосоматическим заболеваниям 😉здорово, что вы следите за своим психоэмоциональным состоянием, честны с самим с собой, эффективно проживаете эмоции, чувствуете сигналы своего тела и умело распределяете внутренние ресурсы.Но иногда симптомы могут возникать неожиданно и если вам понадобиться помощь психосоматолога - я к вашим услугам. Сохраните мой контакт на всякий случай, если понадобится помощь психосоматолога`;
// } else if (totalScore >= 4 && totalScore <= 29) {
// messageResult = `Ваши результаты - ${totalScore}: от 4-29, у вас есть психосоматическая составляющая в состоянии здоровья. Возможно, вам это не доставляет дискомфорта и не ограничивает повседневную жизнь, но желательно бы разобраться какие задачи решает ваше тело за психику, какие нерешенные психологические вопросы привели к телесному ответу. И решение этих психологическим проблем поможет вашему телу быстрее справиться с симптомами.`;
// } else if (totalScore >= 30 && totalScore <= 59) {
// messageResult = `Ваши результаты - ${totalScore}: от 30-59, у вас много проблем с самочувствием из-за нерешенных психологических причин, поэтому вы склонны к психосоматическим заболеваниям и тело сигнализирует вам, что пора устранить психологическую причину заболевания, дабы они не перешли в хроническую форму.`;
// } else if (totalScore >= 60) {
// messageResult = `Ваши результаты - ${totalScore}: от 60, кажется, ваша психика и тело измотаны и не способны эффективно справляться с задачами, которые стоят перед вами, что приводит к обширной симптоматике. Чтобы разобраться с психосоматическими причинами вашего состояния советую обратиться к специалисту по психосоматике. Это поможет привести тело и психику в согласие друг с другом.`;
// } else {
// messageResult = `Ваши результаты - ${totalScore}: баллы выходят за пределы шкалы`;
// }

// document.getElementById("result").textContent = messageResult;

// 	// собираем данные из элементов формы
// 	let details = {
// 		name: name.value.trim(),
// 		email: email.value.trim(),
// 		phone: phone.value.trim(),
// 		message: message.value.trim(),
// 		rule: rule.checked,
// 	};

// 	// если поля не заполнены - прекращаем обработку
// 	if (!isFilled(details)) return;

// 	// подготавливаем данные для отправки
// 	let formBody = [];
// 	for (let property in details) {
// 		// кодируем названия и значения параметров
// 		let encodedKey = encodeURIComponent(property);
// 		let encodedValue = encodeURIComponent(details[property]);
// 		formBody.push(encodedKey + "=" + encodedValue);
// 	}
// 	// склеиваем параметры в одну строку
// 	formBody = formBody.join("&");

// 	// выполняем отправку данных в Google Apps
// 	const result = await fetch(URL_APP, {
// 		method: "POST",
// 		headers: {
// 			"Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
// 		},
// 		//cors: "no-cors", <- это неправильно
// 		mode: "cors", //<- оставим по умолчанию
// 		body: formBody,
// 	})
// 		.then((res) => res.json())
// 		.catch((err) => alert("Ошибка!"))
// 		// .then((res) => console.log(res));
		
// 	 if( result.type === 'success' ) {
// 			name.value = '';
// 			email.value = '';
// 			phone.value = '';
// 			message.value = '';
// 		//  alert('Ваши данные успешно отправлены!')
// 		console.log('Ваши данные успешно отправлены!')
// 	 }
// 	 if( result.type === 'error' ) {            
// 		 alert(`Ошибка( ${result.errors}`)
// 	 }
// });
