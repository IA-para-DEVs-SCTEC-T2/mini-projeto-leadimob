function hasDuplicate(nums) {
  const vistos = new Set();

  for (const n of nums) {
    if (vistos.has(n)) {
      return true;
    }
    vistos.add(n);
  }

  return false;
}