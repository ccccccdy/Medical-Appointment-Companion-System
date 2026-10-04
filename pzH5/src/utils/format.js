/**
 * 支付超时时间：目前前后端约定为下单后 2 小时。
 * 若后端改为下发过期时间（expire_at）或剩余秒数，只需改这里。
 */
export const PAYMENT_TIMEOUT_MS = 2 * 60 * 60 * 1000

const pad = (num) => String(num).padStart(2, '0')

/**
 * 时间格式化，兼容三种后端返回值：
 * 1. 毫秒时间戳 1700000000000
 * 2. 秒级时间戳 1700000000
 * 3. 已格式化的字符串 '2025-01-05 09:00'
 * @param {number|string} value 待格式化的时间
 * @param {boolean} withTime 是否输出时分
 */
export const formatTimestamp = (value, withTime = false) => {
  if (value === null || value === undefined || value === '') return ''
  // 已是可读时间字符串，直接展示
  if (typeof value === 'string' && !/^\d+$/.test(value)) return value

  let ts = Number(value)
  if (!Number.isFinite(ts)) return String(value)
  if (ts < 1e12) ts *= 1000 // 秒级时间戳转毫秒

  const date = new Date(ts)
  if (Number.isNaN(date.getTime())) return String(value)

  const dateStr = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
  return withTime ? `${dateStr} ${pad(date.getHours())}:${pad(date.getMinutes())}` : dateStr
}

/**
 * 安全的 JSON 解析：localStorage 里的数据可能缺失或损坏，不能让它把页面搞崩
 */
export const safeParseJSON = (raw, fallback = null) => {
  if (!raw) return fallback
  try {
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

/**
 * 剩余毫秒数 → 倒计时展示文案（hh:mm:ss）
 */
export const formatCountdown = (ms) => {
  const total = Math.max(0, Math.floor(ms / 1000))
  const h = Math.floor(total / 3600)
  const m = Math.floor((total % 3600) / 60)
  const s = total % 60
  return `${pad(h)}:${pad(m)}:${pad(s)}`
}
