/**
 * クッキーの値を取得
 * @param {String} surchKey 検索するキー
 * @return {String} キーに対応する値
 */
export function getCookieValue(searchKey){
  if(typeof searchKey === 'undifined'){
    return ''
  }
  let val = ''
  document.cookie.split(';').forEach(cookie=>{
    const [key, value] = cookie.split('=')
    if(key === searchKey){
      return val = value
    }
  })
  return val
}
