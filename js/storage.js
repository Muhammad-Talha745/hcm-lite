/**
 * HCM Lite - Core Data & LocalStorage Helper
 */
const STORAGE_KEYS = {
    COMPANY: "hcm_company",
    USERS: "hcm_users",
    ATTENDANCE: "hcm_attendance",
    LEAVES: "hcm_leaves",
    SESSION: "hcm_session",
    ANNOUNCEMENTS: "hcm_announcements"
};

const Storage = {
    get(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.error("Error reading localStorage key: " + key, e);
            return null;
        }
    },

    set(key, val) {
        try {
            localStorage.setItem(key, JSON.stringify(val));
        } catch (e) {
            console.error("Error writing localStorage key: " + key, e);
        }
    },

    // Helpers
    getCompany() {
        return this.get(STORAGE_KEYS.COMPANY);
    },
    getUsers() {
        return this.get(STORAGE_KEYS.USERS) || [];
    },
    getAttendance() {
        return this.get(STORAGE_KEYS.ATTENDANCE) || [];
    },
    getLeaves() {
        return this.get(STORAGE_KEYS.LEAVES) || [];
    },
    getSession() {
        return this.get(STORAGE_KEYS.SESSION);
    },
    getAnnouncements() {
        return this.get(STORAGE_KEYS.ANNOUNCEMENTS) || [];
    },

    // Business Utilities
    getTodayDateString() {
        const today = new Date();
        return today.toISOString().split("T")[0];
    },

    isWeekend(dateStr) {
        const d = new Date(dateStr + "T00:00:00");
        const day = d.getDay();
        return day === 0 || day === 6; // Sunday or Saturday
    },

    countWorkingDays(fromStr, toStr) {
        let count = 0;
        const cur = new Date(fromStr + "T00:00:00");
        const end = new Date(toStr + "T00:00:00");
        while (cur <= end) {
            const day = cur.getDay();
            if (day !== 0 && day !== 6) {
                count++;
            }
            cur.setDate(cur.getDate() + 1);
        }
        return count;
    },

    getDaysInMonth(year, monthIndex) {
        return new Date(year, monthIndex + 1, 0).getDate();
    },

    getWorkingDaysInMonth(year, monthIndex) {
        const days = this.getDaysInMonth(year, monthIndex);
        let working = 0;
        for (let day = 1; day <= days; day++) {
            const d = new Date(year, monthIndex, day);
            if (d.getDay() !== 0 && d.getDay() !== 6) {
                working++;
            }
        }
        return working;
    }
};