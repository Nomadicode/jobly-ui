export const FileTypeMap = {
	"image/gif": "gif",
	"image/jpeg": "jpg",
	"image/jpg": "jpg",
	"image/png": "png"
}

export function getMimeType(file, fallback = null) {
	const byteArray = (new Uint8Array(file)).subarray(0, 4)
	let header = ""
	for (let i = 0; i < byteArray.length; i++) {
		header += byteArray[i].toString(16)
	}
	switch (header) {
	case "89504e47":
		return "image/png"
	case "47494638":
		return "image/gif"
	case "ffd8ffe0":
	case "ffd8ffe1":
	case "ffd8ffe2":
	case "ffd8ffe3":
	case "ffd8ffe8":
		return "image/jpeg"
	default:
		return fallback
	}
}

export function debounce (func, timeout=1000) {
	let timer
	return (...args) => {
		if (timer) {
			clearTimeout(timer)
		}

		timer = window.setTimeout(() => { 
			func.apply(this, args)
		}, timeout)
	}
}
