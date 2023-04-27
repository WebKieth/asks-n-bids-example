export const useKeygen = () => {
  const generateKey = (pre) => {
    return `${ pre }_${ new Date().getTime() }`;
  }
  return generateKey
}