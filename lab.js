function hashDuplicate(nums) {
    const seen = new Set()

    for (const num of nums) {
        if (seen.has(num)) {
            return num
        }
        seen.add(num)
    }

    return -1
}

/**
 *  Persona:
    Atue como um desenvolvedor Senior de Javascript

    Objetivo:
    Peço para você alterar a função hashDuplicate 
    lab.js
    para que ela retorne todos os números duplicados ao invés de retornar apenas o primeiro.

    Informações:
    - Não altere o nome da função
    - Mantenha a assinatura da função
    - Caso a função já esteja comentada, mantenha os comentários
 */

/**
 * Verifica quais números estão duplicados em uma lista de inteiros.
 * Esta implementação utiliza um Set para garantir performance O(n).
 * 
 * @param {number[]} numeros - Lista de números inteiros para verificação.
 * @returns {number[]} - Uma lista contendo apenas os números que possuem duplicatas.
 */
function verificarDuplicados(numeros) {
    const vistos = new Set();
    const duplicados = new Set();

    for (const num of numeros) {
        if (vistos.has(num)) {
            // Se o número já foi visto, ele é uma duplicata
            duplicados.add(num);
        } else {
            // Caso contrário, adicionamos ao conjunto de vistos
            vistos.add(num);
        }
    }

    // Retornamos os valores únicos que foram encontrados como duplicados
    return Array.from(duplicados);
}