import jsCookie from 'js-cookie'

const { get, remove, set } = jsCookie

export const setCookie = (key: string, value: any) => {
  set(key, JSON.stringify(value))
}

export const getCookie = (key: string, fallback?: any) => {
  try {
    const value = get(key)

    if (!value) return fallback

    return JSON.parse(value)
  } catch {
    return fallback
  }
}

export const removeCookie = (key: string) => remove(key)
