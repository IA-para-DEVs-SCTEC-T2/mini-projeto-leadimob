function has_Duplicate(nums) {
  const vistos = new Set();

  for (const n of nums) {
    if (vistos.has(n)) {
      return true;
    }
    vistos.add(n);
  }

  return false;
}

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
// Verifica se existe algum número duplicado no array — O(n²)
function has_duplicate(nums) {

  // Para cada número, compara com todos os outros
  for (let i = 0; i < nums.length; i++) {

    for (let j = i + 1; j < nums.length; j++) {

      let numeroAtual    = nums[i];
      let numeroSeguinte = nums[j];

      // Se encontrar dois iguais, já retorna verdadeiro
      if (numeroAtual === numeroSeguinte) {
        return true;
      }

    }
  }

  // Nenhum duplicado encontrado
  return false;
}

// Testes
console.log(has_duplicate([1, 2, 3, 4]));    // false
console.log(has_duplicate([1, 2, 3, 1]));    // true
console.log(has_duplicate([5, 6, 7, 6, 8])); // true