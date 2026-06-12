const CLOUDINARY_UPLOAD_MARKER = '/image/upload/'

export function optimizeImage(url, options = {}) {
  if (!url || typeof url !== 'string' || !url.includes(CLOUDINARY_UPLOAD_MARKER)) {
    return url
  }

  const width = Number(options.width)
  const parts = ['f_auto', 'q_auto', 'dpr_auto']

  if (Number.isFinite(width) && width > 0) {
    parts.push('c_limit', `w_${Math.round(width)}`)
  }

  const transformation = parts.join(',')
  const [base, rest] = url.split(CLOUDINARY_UPLOAD_MARKER)

  if (!base || !rest || rest.startsWith(`${transformation}/`)) {
    return url
  }

  return `${base}${CLOUDINARY_UPLOAD_MARKER}${transformation}/${rest}`
}
