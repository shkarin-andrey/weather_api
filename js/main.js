document.addEventListener('DOMContentLoaded', () => {
    // API данные
    const API_KEY = '94d5166542119669e244ca320fde243f';
    const URL = 'http://api.openweathermap.org/data/2.5/forecast'

    // Получаем элементы со старницы
    const input = document.querySelector('input'); 
    const form = document.querySelector('form'); 
    const info = document.querySelector('.info .container .row');
    const filter = document.querySelector('.filter');
    const btn = document.querySelectorAll('.btn_filter');
    const blockInfo = document.querySelector('.info');
    const graphics = document.querySelector('.graphics');

    let sity = '';  // в эту переменную будем записывать город с инпута
    let arrTemperature = [];
    let arrDate = [];

    // функция для очистки всех массивов и поля с карточками
    function refresh() {
        arrTemperature = [];
        arrDate = [];
        info.innerHTML = ''
    }

    // Функция удаления всех классов у кнопок фильтра
    function refreshBtnClass() {
        btn.forEach(el => {
            el.classList.remove('active')
        })   
    }

    // Функция проверки на наличие класса у кнопок фильтра для вывода карточек или графика
    function filterActive() {
        if (btn[0].classList.contains('active')) {
            graphics.classList.add('hidden')
            blockInfo.classList.remove('hidden')
        }

        if (btn[1].classList.contains('active')) {
            blockInfo.classList.add('hidden')
            graphics.classList.remove('hidden')
        }
    }

    // Функция отслеживания события клика на кнопки фильтра
    function eventBtn(element) {
        element.addEventListener('click', (e) => {
            refreshBtnClass() // вызов функции удаления всех классов у кнопок фильтра

            // проверка на соответствие кнопок фильтра и их классов
            if (e.target.textContent === 'Карточки' && !element.classList.contains('active')) {
                element.classList.add('active')
            }
            if (e.target.textContent === 'График' && !element.classList.contains('active')) {
                element.classList.add('active')
            }
            filterActive() // вызов функции проверки на наличие класса у кнопок фильтра
        })
    }

    // перебор массива кнопок фильтра (2 шт) и вызов функции eventBtn
    btn.forEach(element => eventBtn(element))

    // событие отслеживающее ввод в строке инпута 
    input.addEventListener('input', (e) => sity = e.target.value);

    // событие на отправку данных в форме
    form.addEventListener('submit', (e) => {
        e.preventDefault(); // отключает перезагрузку страницы

        refresh(); // вызываем функцию для очистки всех полей с карточками и массивов

        // отправляем GET запрос на получение прогноза   
        fetch(`${URL}?q=${sity}&lang=ru&appid=${API_KEY}`)
            .then(res => res.json())
            .then(data => {
                // перебераем полученный массив данных 
                data.list.map((elem) => {
                    const div = document.createElement('div');  // создаем элемент
                    const arr = elem.dt_txt.split(' ');  // разделяем полученную дату и время
                    const time = arr[1].split(':')  // разделяем время чтобы убрать секунды

                    filter.classList.remove('hidden') // Уддаление скрывающего класса у блока фильтра

                    arrTemperature.push(Math.floor(elem.main.temp - 272.15)) // добавляем в массив всю температуру и переводим в цельсию
                    arrDate.push(arr[0])

                    div.classList.add('col-3') // добавляем класс к новому созданному блоку
                    info.append(div)  // добавляем блок на страницу

                    // записываем в блок html элементы с пришедшими данными с API
                    div.innerHTML = `
                        <div class="card mt-4">
                            <div class="time">${arr[0]}</div>
                            <div class="time">${time[0]}:${time[1]}</div>
                            <div class="temp">${Math.floor(elem.main.temp - 272.15)}°C</div>
                            <div class="desc">${elem.weather[0].description}</div>
                        </div>
                    `;
                })
                getGraphic()
            })
            .catch(e => console.log(e))  // если будет ошибка, выведет ее в консоль
    });

    function getGraphic() {
        // grapics
        console.log(arrDate)
        let ctx = document.getElementById('myChart').getContext('2d');
        let chart = new Chart(ctx, {
        // Тип графика
        type: 'line',
        
        // Создание графиков
        data: {
            // Точки графиков
            labels: arrDate,
            // График
            datasets: [{
                label: 'Температура в °C ', // Название
                backgroundColor: 'rgb(255, 99, 132)', // Цвет закраски
                borderColor: 'rgb(255, 99, 132)', // Цвет линии
                data: arrTemperature // Данные каждой точки графика
            }]
        }
        });
    }
});