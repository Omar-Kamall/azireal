window.addEventListener("scroll", function () {
    const navbar = document.querySelector(".navbar");
    if (window.scrollY > 50) {
        navbar.classList.add("scrolled");
    } else {
        navbar.classList.remove("scrolled");
    }
});

document.addEventListener("DOMContentLoaded", function () {
    const fadeElements = document.querySelectorAll(".fade-in");

    const fadeInOnScroll = function () {
        fadeElements.forEach((element) => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;

            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add("visible");
            }
        });
    };

    fadeInOnScroll();
    window.addEventListener("scroll", fadeInOnScroll);

    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", function (e) {
            e.preventDefault();

            const targetId = this.getAttribute("href");
            if (targetId === "#") return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: "smooth",
                });
            }
        });
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const productSelect = document.getElementById("productSelect");
    const quantitySelect = document.getElementById("quantitySelect");
    const totalPriceElement = document.getElementById("totalPrice");
    const form = document.getElementById("orderForm");
    const alertBox = document.getElementById("formAlert");

    const fullName = document.querySelector('input[name="fullname"]');
    const phoneInput = document.querySelector('input[name="phone"]');
    const address = document.querySelector('input[name="address"]');

    function showAlert(type, msg) {
        alertBox.innerHTML = `<div class="alert alert-${type} alert-dismissible fade show" role="alert">
      ${msg}<button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    </div>`;
    }

    function validateMoroccanPhone(phone) {
        return /^(06|07)\d{8}$/.test(phone.replace(/\s/g, ""));
    }

    function updateTotalPrice() {
        const selected = productSelect.options[productSelect.selectedIndex];
        const price =
            selected && selected.dataset.price
                ? parseInt(selected.dataset.price, 10)
                : 0;
        const qty = parseInt(quantitySelect.value, 10) || 1;

        const total = isNaN(price) ? 0 : price * qty;
        totalPriceElement.textContent = total + " درهم";
    }

    function validateForm() {
        let ok = true;
        const fields = [
            { el: fullName, valid: fullName.value.trim() !== "" },
            { el: phoneInput, valid: validateMoroccanPhone(phoneInput.value) },
            { el: address, valid: address.value.trim() !== "" },
            { el: productSelect, valid: productSelect.value !== "" },
        ];
        fields.forEach((f) => {
            f.el.classList.toggle("is-valid", f.valid);
            f.el.classList.toggle("is-invalid", !f.valid);
            if (!f.valid) ok = false;
        });
        return ok;
    }

    productSelect.addEventListener("change", updateTotalPrice);
    quantitySelect.addEventListener("change", updateTotalPrice);

    updateTotalPrice();

    const urlParams = new URLSearchParams(location.search);
    const productType = urlParams.get("product");
    if (productType) {
        productSelect.value =
            productType === "single"
                ? "كريم AHA للتفتيح وتوحيد اللون - 249 درهم"
                : "باقة العناية الكاملة (عبوتان) - 400 درهم";
        updateTotalPrice();
    }

    form.addEventListener("submit", function (e) {
        e.preventDefault();
        alertBox.innerHTML = "";

        if (!validateForm()) {
            showAlert("danger", "يرجى ملء جميع الحقول بشكل صحيح.");
            return;
        }

        const fd = new FormData(this);
        const orderData = {
            fullname: fd.get("fullname"),
            phone: fd.get("phone"),
            address: fd.get("address"),
            product: fd.get("product"),
            quantity: fd.get("quantity"),
            total_price: totalPriceElement.textContent,
            message: fd.get("message"),
            time: new Date().toLocaleString("ar-MA"),
        };

        const btn = this.querySelector('button[type="submit"]');
        const orig = btn.textContent;
        btn.textContent = "جاري الإرسال...";
        btn.disabled = true;

        // https://azrieal-server.vercel.app/api/submit/    /api/sendOrder/
        fetch("https://script.google.com/macros/s/AKfycbxN77-hJCEVaPz5yvmAfWmBrKBMKBEqf1d11SZArH6t0Fo8g5mCwj1jhIx1vaS4BdGs/exec", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(orderData),
        })
            .then(async (r) => {
                console.log(r.status, r.statusText);
                const text = await r.text();
                if (!r.ok) throw new Error("HTTP error " + r.status);
                try {
                    return JSON.parse(text);
                } catch {
                    console.warn("Response is not valid JSON:", text);
                    return {};
                }
            })
            .then(() => {
                showAlert("success", "تم استلام طلبك! سنتصل بك قريباً");
                form.reset();
                totalPriceElement.textContent = "0 درهم";
                new bootstrap.Modal(
                    document.getElementById("successModal")
                ).show();
            })
            .catch((err) => {
                console.error(err);
                showAlert("danger", "فشل الإرسال، حاول لاحقاً");
            })
            .finally(() => {
                btn.textContent = orig;
                btn.disabled = false;
            });
    });
});




