export function alertSuccess(message) {
  Swal.fire({
    type: 'success',
    text:  message
  });
}

export function alertWarning(message) {
  Swal.fire({
    type: 'error',
    text: message
  });
}
