export function submitCheckoutForm(checkoutUrl, params) {
  const form = document.createElement('form')
  form.method = 'GET'
  form.action = checkoutUrl
  form.style.display = 'none'

  Object.entries(params || {}).forEach(([name, value]) => {
    const input = document.createElement('input')
    input.type = 'hidden'
    input.name = name
    input.value = value
    form.appendChild(input)
  })

  document.body.appendChild(form)
  form.submit()
}
