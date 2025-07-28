

export async function getCustomerDevices() {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:9090';
    const res = await fetch(`${baseUrl}/customer/customerDevices`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return res.json();
  }