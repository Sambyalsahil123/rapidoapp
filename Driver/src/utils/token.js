import uuidv4 from 'uuidv4'

export const createToken = () => {
  const token = uuidv4()

  return `${token}`
}
