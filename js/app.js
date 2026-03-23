/**
 * Main Application Logic
 * Handles UI interactions and binds forms to the API service.
 */

document.addEventListener("DOMContentLoaded", () => {
    
    // --- Mobile Nav Logic ---
    const mobileMenuBtn = document.getElementById("mobileMenuBtn");
    const mobileMenuDropdown = document.getElementById("mobileMenuDropdown");
    
    if (mobileMenuBtn && mobileMenuDropdown) {
        mobileMenuBtn.addEventListener("click", () => {
            mobileMenuDropdown.classList.toggle("show");
        });

        // Close when clicking outside
        document.addEventListener("click", (e) => {
            if (!mobileMenuBtn.contains(e.target) && !mobileMenuDropdown.contains(e.target)) {
                mobileMenuDropdown.classList.remove("show");
            }
        });
    }

    // --- Auth Forms ---
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const btn = loginForm.querySelector("button[type='submit']");
            btn.textContent = "LOGGING IN...";
            btn.disabled = true;

            // const formData = new FormData(loginForm);
            try {
                // Mock API call
                // await window.API.login(formData.get("username"), formData.get("password"));
                // Redirect on success
                window.location.href = loginForm.action;
            } catch (error) {
                console.error("Login failed", error);
                btn.textContent = "LOGIN";
                btn.disabled = false;
            }
        });
    }

    const togglePasswordBtn = document.getElementById("togglePassword");
    const passwordInput = document.getElementById("passwordInput");
    if (togglePasswordBtn && passwordInput) {
        togglePasswordBtn.addEventListener("click", () => {
            if (passwordInput.type === "password") {
                passwordInput.type = "text";
                togglePasswordBtn.textContent = "HIDE";
            } else {
                passwordInput.type = "password";
                togglePasswordBtn.textContent = "SHOW";
            }
        });
    }

    const registerForm = document.getElementById("registerForm");
    if (registerForm) {
        registerForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const btn = registerForm.querySelector("button[type='submit']");
            btn.textContent = "REGISTERING...";
            btn.disabled = true;

            const formData = new FormData(registerForm);
            const data = Object.fromEntries(formData.entries());
            
            try {
                await window.API.register(data);
                window.location.href = registerForm.action; // Redirect to login
            } catch (error) {
                btn.textContent = "SIGN UP NOW";
                btn.disabled = false;
            }
        });
    }

    // --- Dashboard Interactions ---
    const uploadZone = document.getElementById("uploadZone");
    const fileInput = document.getElementById("fileInput");
    if (uploadZone && fileInput) {
        uploadZone.addEventListener("click", () => {
            fileInput.click();
        });

        fileInput.addEventListener("change", async (e) => {
            const file = e.target.files[0];
            if (file) {
                const icon = uploadZone.querySelector('.upload-icon');
                const text = uploadZone.querySelector('p');
                icon.className = "fa-solid fa-spinner fa-spin upload-icon";
                text.textContent = "Uploading...";

                // Mock upload
                await window.API.uploadFile(file);
                
                // Reset UI to indicate success
                icon.className = "fa-solid fa-check text-success upload-icon";
                text.textContent = file.name;
            }
        });
        
        // Drag and drop handlers
        uploadZone.addEventListener("dragover", (e) => {
            e.preventDefault();
            uploadZone.style.borderColor = "var(--primary-color)";
            uploadZone.style.backgroundColor = "var(--primary-light)";
        });
        
        uploadZone.addEventListener("dragleave", (e) => {
            e.preventDefault();
            uploadZone.style.borderColor = "var(--border-color)";
            uploadZone.style.backgroundColor = "var(--bg-color)";
        });

        uploadZone.addEventListener("drop", (e) => {
            e.preventDefault();
            uploadZone.style.borderColor = "var(--border-color)";
            uploadZone.style.backgroundColor = "var(--bg-color)";
            if (e.dataTransfer.files.length) {
                fileInput.files = e.dataTransfer.files;
                fileInput.dispatchEvent(new Event("change"));
            }
        });
    }

    // Print Submit binding
    const dashboardBtn = document.querySelector(".btn-primary");
    if (dashboardBtn && window.location.pathname.includes("dashboard")) {
        // Change default link behavior to API call
        const originalOnclick = dashboardBtn.onclick;
        dashboardBtn.onclick = async (e) => {
            e.preventDefault();
            dashboardBtn.textContent = "กำลังส่ง...";
            dashboardBtn.disabled = true;

            const form = document.getElementById("printDetailsForm");
            const formData = form ? Object.fromEntries(new FormData(form).entries()) : {};
            
            // Add date and time from the right column
            const pickupDate = document.getElementById("pickupDateInput");
            const pickupTime = document.getElementById("timeDropdown");
            if (pickupDate) formData.pickup_date = pickupDate.value;
            if (pickupTime) formData.pickup_time = pickupTime.value;
            
            await window.API.submitPrintJob(formData);
            
            // Execute original redirect
            originalOnclick();
        };
    }

    // --- Calendar Logic ---
    const monthYearDisplay = document.getElementById("monthYearDisplay");
    const calendarDays = document.getElementById("calendarDays");
    const prevMonthBtn = document.getElementById("prevMonth");
    const nextMonthBtn = document.getElementById("nextMonth");
    const pickupDateInput = document.getElementById("pickupDateInput");
    
    if (monthYearDisplay && calendarDays) {
        let currentDate = new Date();
        let selectedDate = new Date(); // default to today
        pickupDateInput.value = selectedDate.toISOString().split('T')[0];

        const renderCalendar = () => {
            calendarDays.innerHTML = "";
            const year = currentDate.getFullYear();
            const month = currentDate.getMonth();
            
            const thaiMonths = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];
            monthYearDisplay.textContent = `${thaiMonths[month]} ${year + 543}`;
            
            const firstDayIndex = new Date(year, month, 1).getDay();
            const lastDay = new Date(year, month + 1, 0).getDate();
            const today = new Date();
            
            for (let i = 0; i < firstDayIndex; i++) {
                const emptyDiv = document.createElement("div");
                emptyDiv.classList.add("empty");
                calendarDays.appendChild(emptyDiv);
            }
            
            for (let i = 1; i <= lastDay; i++) {
                const dayDiv = document.createElement("div");
                dayDiv.classList.add("calendar-day");
                dayDiv.textContent = i;
                
                const dayOfWeek = new Date(year, month, i).getDay();
                if (dayOfWeek === 0) dayDiv.classList.add("holiday"); // Sunday
                
                // Disable past days
                if (year < today.getFullYear() || 
                    (year === today.getFullYear() && month < today.getMonth()) ||
                    (year === today.getFullYear() && month === today.getMonth() && i < today.getDate())) {
                    dayDiv.classList.add("disabled");
                }
                
                if (selectedDate && selectedDate.getDate() === i && selectedDate.getMonth() === month && selectedDate.getFullYear() === year) {
                    dayDiv.classList.add("selected");
                }

                dayDiv.addEventListener("click", () => {
                    if (dayDiv.classList.contains("disabled")) return;
                    selectedDate = new Date(year, month, i);
                    pickupDateInput.value = new Date(selectedDate.getTime() - (selectedDate.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
                    renderCalendar();
                });
                
                calendarDays.appendChild(dayDiv);
            }
        };

        prevMonthBtn.addEventListener("click", () => {
            currentDate.setMonth(currentDate.getMonth() - 1);
            renderCalendar();
        });

        nextMonthBtn.addEventListener("click", () => {
            currentDate.setMonth(currentDate.getMonth() + 1);
            renderCalendar();
        });

        renderCalendar();
    }

    // --- Queue Interactions ---
    const cancelBtns = document.querySelectorAll(".btn-cancel:not([disabled])");
    cancelBtns.forEach(btn => {
        btn.addEventListener("click", async (e) => {
            const card = e.target.closest(".queue-card");
            if (card) {
                const confirmCancel = confirm("คุณต้องการยกเลิกคิวนี้ใช่หรือไม่? (Mock)");
                if (confirmCancel) {
                    e.target.textContent = "กำลังยกเลิก...";
                    e.target.disabled = true;
                    // Mock id extraction
                    await window.API.cancelJob(71);
                    card.style.opacity = "0.5";
                    e.target.textContent = "ยกเลิกแล้ว";
                }
            }
        });
    });

});
