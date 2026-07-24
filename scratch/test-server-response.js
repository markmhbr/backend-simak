async function main() {
  try {
    const res = await fetch('http://localhost:3000/api/auth/public-profile/fd24f754-530c-11e5-a256-f3dca9837003');
    console.log('Server response status:', res.status);
    const data = await res.json();
    console.log('Server response data:', data);
  } catch (err) {
    console.error('Error connecting to server:', err.message);
  }
}
main();
