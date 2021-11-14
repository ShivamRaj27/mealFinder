
//https://www.youtube.com/watch?v=LwD4EEFtCFE&t=0s&ab_channel=ITBuddies

const search = document.getElementById('search'),
    submit = document.getElementById('submit'),
    random = document.getElementById('random'),
    mealsEl = document.getElementById('meals'),
    resultHeading = document.getElementById('result-heading'),
    single_mealEl = document.getElementById('single-meal');

function searchMeal(e){
    e.preventDefault();

    single_mealEl.innerHTML = ''; //null value which will be assigned in line no.23

    const term = search.value;
    
    // Check for empty
    if(term.trim()){
        fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`) 
                                    // fetching search images from mealdb
            .then(res => res.json()) //callbacks for promise
            .then(data => {
                resultHeading.innerHTML = `<h2>Searching for  '${term}'</h2>`;
                if(data.meals === null) {
                    resultHeading.innerHTML = `<p>Try again! with appropriate keyword</p>`;
                    mealsEl.innerHTML = '';
                }else{
                    mealsEl.innerHTML = data.meals.map(meal => `
                        <div class="meal">
                            <img src="${meal.strMealThumb}" alt="${meal.strMeal}" /> 
                            <div class="meal-info" data-mealID="${meal.idMeal}">
                                <h3>${meal.strMeal}</h3>
                            </div>
                        </div>
                    `)
                    .join('');
                }
            });
            search.value=''    // Clear search box after every search 
    }else {
        alert('we can search only if u write it !! dumbo')
    }
};   


// Fetching meal by ID

function getMealById(mealID) {
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
        .then(res => res.json())
        .then(data => {
            const meal = data.meals[0];

            addMealToDOM(meal);
        });
};

// Fetch random meal from API
function getRandomMeal() {
    // Clear meals and heading
    mealsEl.innerHTML = '';
    resultHeading.innerHTML = '';

    fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
        .then(res => res.json())
        .then(data => {
            const meal = data.meals[0];
            addMealToDOM(meal);
        });
}

// Add meal to DOM
function addMealToDOM(meal) {
    const ingredients = [];


    for(let i = 1; i <= 20; i++) {
        if(meal[`strIngredient${i}`]) {
            ingredients.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`);
        }else {
            break;
        }
    }
    single_mealEl.innerHTML =`
        <div class="single-meal">
            <h1>${meal.strMeal}</h1>
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
            <div class="single-meal-info">
                ${meal.strCategory ? `<p>${meal.strCategory}</p>` : ''}
                ${meal.strArea ? `<p>${meal.strArea}</p>` : ''}
            </div>
            <div class="main">
                <p>${meal.strInstructions}</p>
                <h2>Ingredients</h2>
                <ul>
                    ${ingredients.map(ing => `<li>${ing}</li>`).join('')}
                <ul>
            </div>
        </div>
    `
};


submit.addEventListener('submit', searchMeal);
random.addEventListener('click', getRandomMeal);//

//for meal information 
mealsEl.addEventListener('click', e => {
    const mealInfo = e.path.find(item => {
        if(item.classList) {
            return item.classList.contains('meal-info');
        }
        else{
            return false;
        }
    });
    if(mealInfo){
        const mealID = mealInfo.getAttribute('data-mealid')
        getMealById(mealID);
    }
});

getRandomMeal()
