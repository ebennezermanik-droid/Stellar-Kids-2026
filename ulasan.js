const reviewForm = document.getElementById("review-form");

if (reviewForm) {
  reviewForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const reviewText = document.getElementById("review-text").value.trim();

    if (!reviewText) {
      alert("Silakan tulis ulasan terlebih dahulu.");
      return;
    }

    const emailTujuan = "ebennezermanik@gmail.com";

    const subject = encodeURIComponent("Ulasan Website Stellar Kids");

    const body = encodeURIComponent(
      "Halo,\n\n" +
      "Saya ingin memberikan ulasan mengenai website Stellar Kids:\n\n" +
      reviewText +
      "\n\nTerima kasih."
    );

    const gmailURL =
      "https://mail.google.com/mail/?view=cm&fs=1" +
      "&to=" + emailTujuan +
      "&su=" + subject +
      "&body=" + body;

    // Langsung arahkan halaman ke Gmail
    window.location.href = gmailURL;
  });
}