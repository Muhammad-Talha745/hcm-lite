/**
 * HCM Lite - Authentication and Session Guards
 */
const Auth = {
    checkAccess(allowedRoles = ["admin", "employee"]) {
        const session = Storage.getSession();
        const company = Storage.getCompany();

        // If company not configured, redirect to setup on index
        if (!company && !window.location.pathname.endsWith("index.html")) {
            window.location.href = "index.html";
            return null;
        }

        if (!session) {
            if (!window.location.pathname.endsWith("index.html")) {
                window.location.href = "index.html";
            }
            return null;
        }

        if (!allowedRoles.includes(session.role)) {
            if (session.role === "admin") {
                window.location.href = "admin.html";
            } else {
                window.location.href = "employee.html";
            }
            return null;
        }

        return session;
    },

    login(email, password) {
        const users = Storage.getUsers();
        const cleanEmail = email.trim().toLowerCase();
        const user = users.find(u => u.email.toLowerCase() === cleanEmail && u.password === password);
        if (!user) {
            return { success: false, message: "Invalid email or password." };
        }
        Storage.set(STORAGE_KEYS.SESSION, {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            department: user.department || "General",
            salary: user.salary || 0
        });
        return { success: true, role: user.role };
    },

    logout() {
        localStorage.removeItem(STORAGE_KEYS.SESSION);
        window.location.href = "index.html";
    },

    renderNavbar(activePage) {
        const session = Storage.getSession();
        const nav = document.getElementById("main-nav");
        if (!nav || !session) return;

        let links = "";
        if (session.role === "admin") {
            links = `
        <a href="admin.html" class="nav-link ${activePage === 'admin' ? 'active' : ''}">Dashboard</a>
        <a href="employees.html" class="nav-link ${activePage === 'employees' ? 'active' : ''}">Employees</a>
        <a href="leaves.html" class="nav-link ${activePage === 'leaves' ? 'active' : ''}">Leaves</a>
        <a href="payslip.html" class="nav-link ${activePage === 'payslip' ? 'active' : ''}">Payslips</a>
        <a href="settings.html" class="nav-link ${activePage === 'settings' ? 'active' : ''}">Settings</a>
      `;
        } else {
            links = `
        <a href="employee.html" class="nav-link ${activePage === 'employee' ? 'active' : ''}">Dashboard</a>
        <a href="payslip.html" class="nav-link ${activePage === 'payslip' ? 'active' : ''}">My Payslip</a>
      `;
        }

        nav.innerHTML = `
      <a href="#" class="nav-brand">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 7v10l10 5 10-5V7L12 2zm0 2.8L19.2 8 12 11.2 4.8 8 12 4.8zM4 9.8l7 3.5v7.4l-7-3.5V9.8zm9 10.9v-7.4l7-3.5v7.4l-7 3.5z"/></svg>
        HCM Lite
      </a>
      <div class="nav-links">
        ${links}
        <button class="btn btn-outline btn-sm no-print" onclick="Auth.toggleTheme()" title="Toggle Theme">🌓</button>
        <span style="font-size: 0.85rem; font-weight: 600; margin-left: 0.5rem;">${session.name} (${session.role})</span>
        <button class="btn btn-secondary btn-sm" onclick="Auth.logout()">Logout</button>
      </div>
    `;
    },

    toggleTheme() {
        const cur = document.documentElement.getAttribute("data-theme");
        const next = cur === "dark" ? "light" : "dark";
        document.documentElement.setAttribute("data-theme", next);
        localStorage.setItem("hcm_theme", next);
    },

    applySavedTheme() {
        const saved = localStorage.getItem("hcm_theme") || "light";
        document.documentElement.setAttribute("data-theme", saved);
    }
};

Auth.applySavedTheme();