/**
 * Mock API Service Layer
 * Replace these functions with actual fetch() calls to your real backend in the future.
 */

const API = {
    // --- Auth Endpoints ---
    login: async (username, password) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log(`[API] Login attempt: ${username}`);
                resolve({ success: true, token: "mock_jwt_token", user: { username } });
            }, 800);
        });
    },

    register: async (userData) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log(`[API] Registration for: ${userData.username}`);
                resolve({ success: true, message: "Account created successfully" });
            }, 800);
        });
    },

    // --- File & Print Endpoints ---
    uploadFile: async (file) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log(`[API] Uploading file: ${file.name}`);
                resolve({ success: true, fileId: "file_12345", fileName: file.name });
            }, 1000);
        });
    },

    submitPrintJob: async (jobData) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log(`[API] Submitting print job:`, jobData);
                resolve({ success: true, jobId: "job_98765" });
            }, 800);
        });
    },

    // --- Queue Endpoints ---
    getQueue: async () => {
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log(`[API] Fetching queue...`);
                resolve({
                    success: true,
                    queue: [
                        { id: 69, name: "Jeerapat", status: "success", copies: 2, color: "color", size: "A4", date: "09032026", note: "ปริ้นกระดาษแข็งครึ่งหน้าเป็นแบบหน้าหลัง" },
                        { id: 71, name: "Natchanan", status: "waiting", copies: 1, color: "bw", size: "A4", date: "11032026", note: "ขาวดำชัดที่สุด" }
                    ]
                });
            }, 500);
        });
    },

    cancelJob: async (jobId) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log(`[API] Canceling job: ${jobId}`);
                resolve({ success: true, message: "Job cancelled" });
            }, 500);
        });
    }
};

// Export for module use if needed, globally available otherwise
window.API = API;
