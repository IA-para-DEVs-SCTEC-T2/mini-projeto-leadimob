function hasDuplicate(nums) {
    for (let i = 0; i < nums.length; i++) {
        for (let j = i + 1; j < nums.length; j++) {
            if (nums[i] === nums[j]) {
                return true;
            }
        }
    }
    return false;
}

console.log(hasDuplicate([1,2,3,4]));
console.log(hasDuplicate([1,2,3,2]));

// =========================
// 2. Versão com IA (O(n))
// =========================
function hasDuplicateAI(nums) {
    return new Set(nums).size !== nums.length;
}

console.log("IA:");
console.log(hasDuplicateAI([1,2,3,4])); // false
console.log(hasDuplicateAI([1,2,3,2])); // true