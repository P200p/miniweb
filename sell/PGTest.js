javascript:(function(){
  const validLinks = [
    'm.pgf-thek63.com',
    'pgsgame.online',
    'verify.pgsoft.com',
    'verify.pgsoftxaskmebet.com',
    'pgf-asqb7a.com'
  ];
  const input = prompt("กรุณาใส่ลิงก์ที่ต้องการตรวจสอบ:");
  if (!input) return;

  try {
    const url = new URL(input.trim());
    const hostname = url.hostname.toLowerCase();
    const isValid = validLinks.includes(hostname);
    alert(isValid ? "✅ ลิ้งค์นี้ใช้ API pg soft แท้" : "❌ กรุณาตรวจสอบลิ้งค์อีกครั้ง");
  } catch (e) {
    alert("❌ ลิงก์ไม่ถูกต้อง กรุณาใส่ลิงก์แบบเต็ม เช่น https://example.com");
  }
})();
