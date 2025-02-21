document.getElementById('generateBtn').addEventListener('click', function() {
    const charactersInput = document.getElementById('characters').value;
    const columns = parseInt(document.getElementById('columns').value);
    const average = document.getElementById('average').checked;

    // 处理输入验证
    let characters = charactersInput.split(',').map(char => char.trim()).filter(c => c);
    if (characters.length === 0 || isNaN(columns) || columns < 1) {
        alert("请正确填写角色和队列数");
        return;
    }

    // 创建结果容器
    let pages = [];
    const uniqueChars = [...new Set(characters)]; // 去重处理
    const totalUnique = uniqueChars.length;

    if (average) {
        /* 平均分配模式 - 优先保证列数 */
        const allCharacters = shuffleArray([...uniqueChars]);
        let charPool = [...allCharacters];
        
        for (let i = 0; i < columns; i++) {
            // 计算当前列可分配的最大人数
            const maxPerCol = Math.ceil((columns - i) / totalUnique);
            const targetSize = Math.min(
                Math.ceil(totalUnique / columns) * (i < totalUnique % columns ? 2 : 1),
                charPool.length
            );
            
            // 获取当前列角色
            const columnChars = charPool.splice(0, targetSize);
            
            // 补充角色池
            if (charPool.length === 0) {
                charPool = shuffleArray([...allCharacters]);
            }
            
            pages.push(columnChars);
        }
    } else {
        /* 不平均分配模式 */
        const allCharacters = shuffleArray([...uniqueChars]);
        let charPool = [...allCharacters];
        
        for (let i = 0; i < columns; i++) {
            // 随机生成当前列人数（至少1人）
            const maxSize = Math.min(charPool.length, totalUnique);
            const targetSize = Math.floor(Math.random() * maxSize) + 1;
            
            // 获取当前列角色
            const columnChars = charPool.splice(0, targetSize);
            
            // 补充角色池
            if (charPool.length === 0) {
                charPool = shuffleArray([...allCharacters.filter(c => !columnChars.includes(c))]);
                if (charPool.length === 0) charPool = shuffleArray([...allCharacters]);
            }
            
            pages.push(columnChars);
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

// Fisher-Yates洗牌算法
function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}
