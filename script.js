const numberInput = document.getElementById('numberInput');
const startButton = document.getElementById('startButton');
const visualizationContainer = document.getElementById('visualization-container');
const resultContainer = document.getElementById('result-container');

const depthColors = [
    { border: 'border-purple-500', text: 'text-purple-800', bg: 'bg-purple-50' },
    { border: 'border-pink-500', text: 'text-pink-800', bg: 'bg-pink-50' },
    { border: 'border-sky-500', text: 'text-sky-800', bg: 'bg-sky-50' },
    { border: 'border-teal-500', text: 'text-teal-800', bg: 'bg-teal-50' },
    { border: 'border-orange-500', text: 'text-orange-800', bg: 'bg-orange-50' }
];

const delay = ms => new Promise(res => setTimeout(res, ms));

startButton.addEventListener('click', () => {
    const number = parseInt(numberInput.value);
    if (isNaN(number) || number < 0) {
        resultContainer.textContent = 'אנא הזן מספר שלם וחיובי.';
        return;
    }
     if (number === 0) {
         resultContainer.textContent = 'מספר הספרות ב-0 הוא 1.';
         visualizationContainer.innerHTML = '';
         const box = createCallBox(0, 0);
         box.innerHTML = `
            <div class="font-bold text-lg">countDigits(0)</div>
            <div>מקרה קצה מיוחד: 0 נחשב כבעל ספרה אחת.</div>
            <div class="mt-2 text-xl font-bold text-green-700">מחזיר 1</div>
         `;
         visualizationContainer.appendChild(box);
         setTimeout(() => box.classList.add('visible', 'highlight-base'), 10);
         return;
    }
    visualizeRecursion(number);
});

function createCallBox(n, depth) {
    const box = document.createElement('div');
    const color = depthColors[depth % depthColors.length];
    box.className = `call-box ${color.bg} border-2 ${color.border} rounded-lg p-4 shadow-sm`;
    box.style.marginRight = `${depth * 20}px`;
    return box;
}

async function visualizeRecursion(initialNumber) {
    visualizationContainer.innerHTML = '';
    resultContainer.innerHTML = '';
    startButton.disabled = true;

    try {
        const finalResult = await recursiveStep(initialNumber, 0);
        resultContainer.innerHTML = `
            <span class="text-gray-700">התוצאה הסופית עבור ${initialNumber} היא:</span>
            <span class="text-blue-600">${finalResult}</span>
        `;
    } catch (e) {
        console.error("Error during visualization:", e);
        resultContainer.textContent = "אירעה שגיאה במהלך ההדמיה.";
    } finally {
        startButton.disabled = false;
    }
}

async function recursiveStep(n, depth) {
    const box = createCallBox(n, depth);
    visualizationContainer.appendChild(box);
    
    const color = depthColors[depth % depthColors.length];
    const titleDiv = document.createElement('div');
    titleDiv.className = `font-bold text-lg ${color.text}`;
    titleDiv.textContent = `countDigits(${n})`;
    box.appendChild(titleDiv);
    
    await delay(100);
    box.classList.add('visible');
    await delay(800);

    if (n < 10) {
        box.classList.add('highlight-base');
        const baseCaseText = document.createElement('div');
        baseCaseText.innerHTML = `
            <p class="text-green-700">תנאי העצירה התקיים (${n} < 10).</p>
            <p class="mt-2 text-xl font-bold">מחזיר 1</p>
        `;
        box.appendChild(baseCaseText);
        await delay(1000);
        return 1;
    } else {
        const recursiveText = document.createElement('div');
        recursiveText.innerHTML = `
            <p>${n} אינו קטן מ-10. מבצעים קריאה רקורסיבית.</p>
            <p class="font-mono mt-1 text-gray-600">return 1 + countDigits(${Math.floor(n / 10)})</p>
        `;
        box.appendChild(recursiveText);
        await delay(1500);

        const resultFromBelow = await recursiveStep(Math.floor(n / 10), depth + 1);
        
        box.classList.add('highlight-unwind');
        const unwindText = document.createElement('div');
        unwindText.className = 'mt-2 pt-2 border-t-2 border-dashed';
        const finalValue = 1 + resultFromBelow;
        unwindText.innerHTML = `
            <p>הקריאה הפנימית חזרה עם הערך <span class="font-bold">${resultFromBelow}</span>.</p>
            <p class="font-mono text-xl font-bold">1 + ${resultFromBelow} = ${finalValue}</p>
            <p class="font-bold">מחזיר ${finalValue}</p>
        `;
        box.appendChild(unwindText);
        await delay(1500);
        
        return finalValue;
    }
}

