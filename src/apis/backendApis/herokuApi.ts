const TEMPERATURES_API_URL = process.env.REACT_APP_TEMPERATURES_API_URL || '';

export async function get(): Promise<unknown> {
  console.log('REACT_APP_TEMPERATURES_API_URL', TEMPERATURES_API_URL);
  try {
    const response = await fetch(TEMPERATURES_API_URL);
    const json = await response.json();

    return json.values;
  } catch (err) {
    return [];
  }
}
