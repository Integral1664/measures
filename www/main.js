const API_URL = 'http://localhost:3000/measures';

async function fetchSecondStage(){
    let fetching = await fetch('http://localhost:3000/measures/tax_incentives');
    if (!fetching.ok) throw new Error('Failed to fetch measures taxes');
    const fetchingResponse = await fetching.json();
    const content = document.querySelector('.measures');
    content.innerHTML = '';
    const taxDescriptions = [
        "Налог на прибыль — это обязательный платеж с прибыли компании. Ставка составляет 20%, из которых часть идет в федеральный и региональный бюджеты.",
        "НДС — косвенный налог на добавленную стоимость. Стандартная ставка 20%, но для некоторых товаров и услуг — 10% или 0%.",
        "Страховые взносы — обязательные платежи в пенсионный фонд и другие соцстраховые органы, обеспечивающие пенсионные и другие выплаты гражданам.",
        "УСН — система налогообложения для малого бизнеса. Ставка 6% с доходов или 15% с разницы между доходами и расходами.",
        "Налог на имущество взимается с владельцев недвижимости. Арендные ставки зависят от региона и типа объекта.",
        "Земельный налог взимается с владельцев земельных участков, ставка зависит от категории земли и кадастровой стоимости.",
        "Малому бизнесу предоставляются налоговые льготы, включая освобождение от налога на имущество или снижение ставки налога на прибыль.",
        "Разработчики ПО получают льготы, включая освобождение от НДС и сниженные ставки налога на прибыль, чтобы стимулировать инновации.",
        "Дизайн-центры могут претендовать на налоговые льготы, включая скидки на имущество и гранты для разработки новых технологий."
      ];
    fetchingResponse.rows.forEach((fetchItem,i) => {
        const element = document.createElement('div');
        element.classList.add('measure__item');
        element.innerHTML = `<a href="tomeasure.html">${fetchItem.title}</a><p>${taxDescriptions[i]}</p>`;
        content.appendChild(element);
    });
}
// Fetch and display all users
async function fetchMeasures() {
    try {
        const response = await fetch(API_URL);
        // if (!response.ok) throw new Error('Failed to fetch users');
        const measures = await response.json();
        const measureList = document.querySelector('.sidebar ul');
        measureList.innerHTML = '';
        measures.rows.forEach((measure,i) => {
            const li = document.createElement('li');
            li.textContent = `${measure.name}`;
            li.addEventListener('click', () => {
                measureList.querySelectorAll('li').forEach((e) => {e.classList.remove('active')})
                li.classList.add('active');
                fetchSecondStage() })
            if(i==0){
                li.classList.add('active');
                li.click();
            }
            measureList.appendChild(li);
        });
    } catch (err) {
        console.log(err);
    }
}
fetchMeasures();