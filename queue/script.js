document.getElementById('generateBtn').addEventListener('click', function() {
    const charactersInput = document.getElementById('characters').value;
    const columns = parseInt(document.getElementById('columns').value);
    const average = document.getElementById('average').checked;

    // 获取角色列表并处理
    let characters = charactersInput.split(',').map(char => char.trim()).filter(c => c);

    if (characters.length === 0 || isNaN(columns) || columns < 1) {
        alert("请正确填写角色和队列数");
        return;
    }

    let pages = [];

    // 处理平均分配逻辑
    if (average) {
        characters = shuffleArray(characters);

        // 计算每个队列需要的人数
        const perColumn = Math.ceil(characters.length / columns);
        const totalNeeded = perColumn * columns;

        // 扩展角色数组到需要长度
        let extended = [];
        while (extended.length < totalNeeded) {
            extended = extended.concat(characters);
        } 
        extended = shuffleArray(extended.slice(0, totalNeeded));

        // 分配角色到各列
        for (let i = 0; i < columns; i++) {
            pages.push(extended.slice(i * perColumn, (i + 1) * perColumn));
        }
    } else {
        const numChars = characters.length;

        // 生成每个队列的随机人数（1到角色总数）
        let lengths = Array.from({length: columns}, () => Math.floor(Math.random() * numChars) + 1);

        // 计算需要的总角色数
        let totalNeeded = lengths.reduce((a, b) => a + b, 0);

        // 扩展角色数组到需要长度
        let extended = [];
        while (extended.length < totalNeeded) {
            extended = extended.concat(characters);
        } 

        // 生成新的随机队列长度，避免重复
        let newLengths = [];
        for (let i = 0; i < columns; i++) {
            newLengths.push(Math.floor(Math.random() * numChars) + 1);
        }

        // 分配角色到各列
        let index = 0;
        for (let i = 0; i < columns; i++) {
            pages.push(extended.slice(index, index + newLengths[i]));
            index += newLengths[i];
        }
    }

    // 生成结果表格
    let resultHTML = '<table>';
    pages.forEach((column, idx) => {
        resultHTML += `<tr><td>第 ${idx + 1} 列：</td><td>${column.join(', ')}</td></tr>`;
    });
    resultHTML += '</table>';
    document.getElementById('result').innerHTML = resultHTML;
});

// 随机打乱数组
function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}