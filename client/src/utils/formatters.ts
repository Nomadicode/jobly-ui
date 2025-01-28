export const snakeCaseKeys = (object: any) => {
    if (!object) return null

    const objectType = Array.isArray(object) ? [] : {}

    return Object.entries(object).reduce((prevValue: any, [key, value]) => {
        const newKey = key.replace(/[A-Z]/g, (m) => '_' + m.toLowerCase())
        prevValue[newKey] = value
        return prevValue
    }, objectType)
}

export const camelCaseKeys = (object: any) => {
    if (!object) return null

    const objectType = Array.isArray(object) ? [] : {}

    return Object.entries(object).reduce((prevValue: any, [key, value]) => {
        const newKey = key.replace(/_([a-z0-9])/g, (m, p1) => p1.toUpperCase())
        prevValue[newKey] = typeof value === 'object' ? camelCaseKeys(value) : value
        return prevValue
    }, objectType)
}

export const isError = (object: any) => {
    if (!object) return false

    if (object.status < 200 || object.status > 299) {
        return true
    }
    return false
}
