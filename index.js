document.getElementById("registrationForm").addEventListener("submit", async (event) => {
    event.preventDefault();

    const userData = {
        name: document.getElementById("name").value.trim(),
        phone: document.getElementById("phone").value.trim(),
        email: document.getElementById("email").value.trim(),
        college: document.getElementById("college").value.trim(),
        role: document.getElementById("role").value.trim(),
        date: new Date().toISOString().slice(0, 10)
    };

    try {
        const response = await fetch("http://localhost:3000/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData)
        });

        const result = await response.json();
        alert(result.message);

        if (response.ok) {
            const qrUrl = generateQRCode(userData);
            setTimeout(() => sendEmail(userData, qrUrl), 1000);
        }
    } catch (error) {
        console.error("Ошибка:", error);
        alert("Ошибка сервера, попробуйте позже.");
    }
});

function generateQRCode(userData) {
    const qrContainer = document.getElementById("qr-container");
    qrContainer.innerHTML = "";

    // Генерируем URL с данными пользователя
    const baseUrl = "https://pashka385.github.io/User"; // Замени на реальный URL
    const queryParams = new URLSearchParams(userData).toString();
    const qrData = `${baseUrl}?${queryParams}`;

    // Создаем QR-код
    new QRCode(qrContainer, { text: qrData, width: 256, height: 256, correctLevel: QRCode.CorrectLevel.H });

    return qrData; // Возвращаем URL QR-кода
}

function sendEmail(userData, qrUrl) {
    emailjs.init("RvcineNLKDdb_oXyF");

    const qrImage = document.querySelector("#qr-container img");
    if (qrImage) {
        const qrDataUrl = qrImage.src; // Изображение QR-кода
        const templateParams = {
            to_email: userData.email,
            user_name: userData.name,
            message: `Перейдите по ссылке для регистрации: ${qrUrl}`,
            qr_code: qrDataUrl
        };

        emailjs.send("service_cakzk6k", "template_jfl8mqx", templateParams)
            .then(response => console.log("Email отправлен:", response))
            .catch(error => console.error("Ошибка при отправке email:", error));
    } else {
        console.error("Ошибка: QR-код не найден.");
    }
}
