export const getHeaders = () => {
  const token = localStorage.getItem('token') || '';
  return {
    headers:{
      'x-token': token,
      'ngrok-skip-browser-warning': 'true',
    }
  }
}
