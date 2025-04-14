
const form = document.getElementById("inputForm");
const canvas = document.getElementById("outputCanvas");
const ctx = canvas.getContext("2d");

const defaultBg = "https://cdn.jsdelivr.net/gh/chatgpt-art/gmgn-style/bg.jpg";
const gmgnLogo = "https://cdn.jsdelivr.net/gh/chatgpt-art/gmgn-style/gmgn-logo.png";
const moonLogo = "https://cdn.jsdelivr.net/gh/chatgpt-art/gmgn-style/moon.png";
const frogIcon = "https://cdn.jsdelivr.net/gh/chatgpt-art/gmgn-style/frog.png";
const defaultTokenLogo = "https://cdn.jsdelivr.net/gh/chatgpt-art/gmgn-style/token-default.png";

const loadImage = (src) =>
  new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.src = src;
  });

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const gain = parseFloat(document.getElementById("gain").value).toFixed(2);
  const wallet = document.getElementById("walletAddress").value || "9fZpJ...m4P";
  const tokenAddress = document.getElementById("tokenAddress").value.trim();
  const avatarFile = document.getElementById("avatarUpload").files[0];

  let tokenName = "Unknown";
  let tokenLogo = defaultTokenLogo;
  try {
    const res = await fetch("https://cache.jup.ag/tokens");
    const data = await res.json();
    const token = data.find((t) => t.address === tokenAddress);
    if (token) {
      tokenName = token.name;
      tokenLogo = token.logoURI || defaultTokenLogo;
    }
  } catch (err) {}

  const bg = await loadImage(defaultBg);
  ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

  const gmgn = await loadImage(gmgnLogo);
  ctx.drawImage(gmgn, 30, 20, 100, 40);
  ctx.font = "bold 28px Arial";
  ctx.fillStyle = "#fff";
  ctx.fillText("GMGN", 140, 50);

  const moon = await loadImage(moonLogo);
  ctx.drawImage(moon, 1000, 10, 180, 50);
  ctx.font = "bold 24px Arial";
  ctx.fillStyle = "#ccc";
  ctx.fillText("gmgn.ai", 1070, 70);

  const logoImg = await loadImage(tokenLogo);
  ctx.beginPath();
  ctx.arc(120, 110, 40, 0, 2 * Math.PI);
  ctx.closePath();
  ctx.save();
  ctx.clip();
  ctx.drawImage(logoImg, 80, 70, 80, 80);
  ctx.restore();
  ctx.font = "bold 30px Arial";
  ctx.fillStyle = "#fff";
  ctx.fillText(`${tokenName} PNL`, 180, 120);

  ctx.fillStyle = "#7CFFA3";
  ctx.font = "bold 100px Arial";
  ctx.fillText(`+${gain}%`, 60, 240);
  ctx.font = "bold 40px Arial";
  ctx.fillText(`75.8 SOL ($11K)`, 60, 300);

  ctx.font = "24px Arial";
  ctx.fillStyle = "#ccc";
  ctx.fillText("Hold: $9698.93", 60, 360);
  ctx.fillText("Sold: $5735.90", 60, 400);
  ctx.fillText("Bought: $4427.02", 60, 440);

  // 折线图
  ctx.beginPath();
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 4;
  const baseX = 380, baseY = 500;
  ctx.moveTo(baseX, baseY);
  for (let i = 1; i <= 10; i++) {
    const dx = baseX + i * 60;
    const dy = baseY - Math.sin(i / 1.5) * 50 - i * 10;
    ctx.lineTo(dx, dy);
  }
  ctx.stroke();

  ctx.fillStyle = "#4CAF50";
  ctx.font = "bold 18px Arial";
  ctx.fillText("B", 460, 470);
  ctx.fillText("B", 720, 380);
  ctx.fillStyle = "#F44336";
  ctx.fillText("S", 560, 430);

  // 钱包地址和头像
  let avatarSrc = frogIcon;
  if (avatarFile) {
    avatarSrc = URL.createObjectURL(avatarFile);
  }
  const avatar = await loadImage(avatarSrc);
  ctx.beginPath();
  ctx.arc(1000, 600, 25, 0, 2 * Math.PI);
  ctx.closePath();
  ctx.save();
  ctx.clip();
  ctx.drawImage(avatar, 975, 575, 50, 50);
  ctx.restore();
  ctx.fillStyle = "#fff";
  ctx.font = "20px Arial";
  ctx.fillText(wallet, 1040, 610);
});

function downloadImage() {
  const link = document.createElement("a");
  link.download = "gmgn_pnl.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
}
