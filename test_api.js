async function test() {
  try {
    const res = await fetch('http://localhost:5003/api/insights', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        featureName: "SIDOKEPUNG",
        contextType: "pekerjaan",
        data: {
          totalPenduduk: 100,
          dominanPekerjaan: "Petani",
          lakiLaki: 50,
          perempuan: 50
        }
      })
    });
    const data = await res.json();
    console.log("Success:", data);
  } catch (err) {
    console.log("Error:", err.message);
  }
}

test();
