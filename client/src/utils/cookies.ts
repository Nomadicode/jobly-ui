export function setCookie(name: string, value: string, expiration: number) {
    const d = new Date()
    d.setTime(d.getTime() + expiration * 24 * 60 * 60 * 1000)
    const expires = 'expires=' + d.toUTCString()
    document.cookie = name + '=' + value + ';' + expires + ';path=/'
}

export function getCookie(cookieName: string) {
    const name = cookieName + '='
    const ca = document.cookie.split(';')
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i]
        while (c.charAt(0) == ' ') {
            c = c.substring(1)
        }
        if (c.indexOf(name) == 0) {
            return decodeURIComponent(c.substring(name.length, c.length))
        }
    }
    return ''
}

export function removeCookie(cookieName: string) {
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    setCookie(cookieName, '', yesterday.getTime())
}
