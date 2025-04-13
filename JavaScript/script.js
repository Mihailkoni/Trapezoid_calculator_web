// При загрузке страницы скрываем элементы
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('inputFields').classList.add('hidden');
    document.getElementById('calculateOptions').classList.add('hidden');
    document.getElementById('calculateButton').classList.add('hidden');
    document.getElementById('clearButton').classList.add('hidden');
    document.getElementById('results').classList.add('hidden');
});

document.getElementById('showButton').addEventListener('click', updateInputFields);
document.getElementById('calculateButton').addEventListener('click', calculate);
document.getElementById('clearButton').addEventListener('click', clearFields);

document.getElementById('base1').addEventListener('input', removeError);
document.getElementById('base2').addEventListener('input', removeError);
document.getElementById('sideOrHeight').addEventListener('input', removeError);
document.getElementById('calculateOptions').addEventListener('change', removeSelectError);

function updateInputFields() {
    const inputType = document.getElementById('inputType').value;
    const image = document.getElementById('trapezoidImage');
    const sideOrHeightLabel = document.querySelector('label[for="sideOrHeight"]');
    
    // Показываем скрытые элементы
    document.getElementById('inputFields').classList.remove('hidden');
    document.getElementById('calculateOptions').classList.remove('hidden');
    document.getElementById('calculateButton').classList.remove('hidden');
    document.getElementById('clearButton').classList.remove('hidden');
    document.getElementById('results').classList.remove('hidden');
    document.getElementById('calculateLabel').classList.remove('hidden');

    if (inputType === 'baseAndSide') {
        image.src = 'src/images/image_c.svg';
        sideOrHeightLabel.textContent = 'Боковая сторона (c):';
    } else {
        image.src = 'src/images/image_h.svg';
        sideOrHeightLabel.textContent = 'Высота (h):';
    }
}

function calculate() {
    const base1 = parseFloat(document.getElementById('base1').value);
    const base2 = parseFloat(document.getElementById('base2').value);
    const sideOrHeight = parseFloat(document.getElementById('sideOrHeight').value);
    const calculateOptions = Array.from(document.querySelectorAll('#calculateOptions input[name="calculation"]:checked')).map(checkbox => checkbox.value);
    const resultsDiv = document.getElementById('results');

    resultsDiv.innerHTML = '';
    removeErrors(); 

    let hasError = false;

    if (isNaN(base1) || base1 <= 0) {
        showInputError('base1');
        hasError = true;
    }
    if (isNaN(base2) || base2 <= 0) {
        showInputError('base2');
        hasError = true;
    }
    if (isNaN(sideOrHeight) || sideOrHeight <= 0) {
        showInputError('sideOrHeight');
        hasError = true;
    }

    if (hasError) {
        showError('Все значения должны быть корректными положительными числами.');
        return;
    }

    if (calculateOptions.length === 0) {
        showError('Пожалуйста, выберите хотя бы одну характеристику для вычисления.');
        showSelectError();
        return;
    }

    const inputType = document.getElementById('inputType').value;
    let area, perimeter, angles;

    if (inputType === 'baseAndSide') {
        const halfDiff = (base1 - base2) / 2;
        if (sideOrHeight < Math.abs(halfDiff)) {
            showError('Ошибка: боковая сторона слишком короткая.');
            showInputError('sideOrHeight');
            return;
        }
        const height = Math.sqrt(sideOrHeight ** 2 - halfDiff ** 2);
        area = ((base1 + base2) / 2) * height;
        perimeter = base1 + base2 + sideOrHeight + height;
        angles = calculateAngles(base1, base2, height);
    } else {
        const halfDiff = Math.abs(base1 - base2) / 2;
        if (sideOrHeight < halfDiff) {
            showError('Ошибка: высота слишком мала, трапеция невозможна.');
            showInputError('sideOrHeight');
            return;
        }
        const side = Math.sqrt(halfDiff ** 2 + sideOrHeight ** 2);
        perimeter = base1 + base2 + 2 * side;
        area = ((base1 + base2) / 2) * sideOrHeight;
        angles = calculateAngles(base1, base2, sideOrHeight);
    }

    if (calculateOptions.includes('area')) {
        resultsDiv.innerHTML += `<p>Площадь: ${area.toFixed(2)}</p>`;
    }
    if (calculateOptions.includes('perimeter')) {
        resultsDiv.innerHTML += `<p>Периметр: ${perimeter.toFixed(2)}</p>`;
    }
    if (calculateOptions.includes('angles')) {
        resultsDiv.innerHTML += `<p>Углы:</p>
        <ul>
            <li>Угол 1: ${angles[0]}°</li>
            <li>Угол 2: ${angles[1]}°</li>
            <li>Угол 4: ${angles[2]}°</li>
            <li>Угол 3: ${angles[3]}°</li>
        </ul>`;
    }
}

function calculateAngles(base1, base2, height) {
    if (base1 === base2) {
        return [90, 90, 90, 90];
    }

    const delta = Math.abs(base1 - base2) / 2;
    if (delta === 0) {
        return [90, 90, 90, 90];
    }

    const angle1 = Math.atan(height / delta) * (180 / Math.PI);
    return [angle1.toFixed(2), 90, (90 - angle1).toFixed(2), 90];
}

function clearFields() {
    document.getElementById('base1').value = '';
    document.getElementById('base2').value = '';
    document.getElementById('sideOrHeight').value = '';
    document.getElementById('results').innerHTML = '';
    removeErrors();
}

function showError(message) {
    document.getElementById('results').innerHTML = `<p class="error-text">${message}</p>`;
}

function showInputError(inputId) {
    document.getElementById(inputId).classList.add('error');
}

function removeError(event) {
    event.target.classList.remove('error');
}

function removeSelectError() {
    document.getElementById('calculateOptions').classList.remove('error');
}

function showSelectError() {
    document.getElementById('calculateOptions').classList.add('error');
}

function removeErrors() {
    document.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
    document.querySelectorAll('.error-text').forEach(el => el.remove());
}