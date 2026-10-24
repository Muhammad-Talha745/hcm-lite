/**
 * HCM Lite - Smart AI Helper
 */
const SmartHelper = {
    answer(questionText, user) {
        const q = (questionText || "").toLowerCase().trim();
        const users = Storage.getUsers();
        const employees = users.filter(u => u.role === "employee");
        const today = Storage.getTodayDateString();
        const attendance = Storage.getAttendance();
        const leaves = Storage.getLeaves();
        const company = Storage.getCompany() || { leaveQuota: 15 };

        if (!q) return "Please ask a question regarding company or your attendance/leave status.";

        // ADMIN QUERIES
        if (user.role === "admin") {
            if (q.includes("how many") && (q.includes("employee") || q.includes("staff") || q.includes("workers"))) {
                return `We currently have ${employees.length} active employee${employees.length === 1 ? '' : 's'}.`;
            }

            if (q.includes("who") && q.includes("leave") && q.includes("today")) {
                const onLeave = leaves.filter(l => l.status === "approved" && l.from <= today && l.to >= today);
                if (onLeave.length === 0) return "No employees are on approved leave today.";
                const names = onLeave.map(l => {
                    const emp = users.find(u => u.id === l.employeeId);
                    return `${emp ? emp.name : 'Unknown'} (${l.type})`;
                });
                return `${names.length} employee(s) on leave today: ` + names.join(", ");
            }

            if (q.includes("who") && (q.includes("late") || q.includes("tardy")) && q.includes("today")) {
                const lateList = attendance.filter(a => a.date === today && a.status === "late");
                if (lateList.length === 0) return "No employees were late today.";
                const names = lateList.map(a => {
                    const emp = users.find(u => u.id === a.employeeId);
                    return `${emp ? emp.name : 'Unknown'} (in at ${a.checkIn})`;
                });
                return `${names.length} employee(s) were late today: ` + names.join(", ");
            }

            if (q.includes("present") && q.includes("today")) {
                const presentToday = attendance.filter(a => a.date === today);
                return `${presentToday.length} employee(s) checked in today.`;
            }
        }

        // EMPLOYEE QUERIES
        if (user.role === "employee") {
            if (q.includes("how many") && q.includes("leave") && (q.includes("left") || q.includes("remaining") || q.includes("balance"))) {
                const myApprovedLeaves = leaves.filter(l => l.employeeId === user.id && l.status === "approved");
                const usedDays = myApprovedLeaves.reduce((sum, l) => sum + (l.days || 0), 0);
                const remaining = Math.max(0, (company.leaveQuota || 15) - usedDays);
                return `You have ${remaining} leave day(s) remaining out of ${company.leaveQuota} annual days.`;
            }

            if (q.includes("late today") || (q.includes("was i late"))) {
                const myToday = attendance.find(a => a.employeeId === user.id && a.date === today);
                if (!myToday) return "You haven't checked in yet today.";
                return myToday.status === "late"
                    ? `Yes, you arrived late today at ${myToday.checkIn}.`
                    : `No, you checked in on time at ${myToday.checkIn}.`;
            }

            if (q.includes("hours") && (q.includes("week") || q.includes("worked"))) {
                // Calculate work hours this week
                const curDate = new Date();
                const firstDayOfWeek = new Date(curDate.setDate(curDate.getDate() - curDate.getDay() + 1));
                const mondayStr = firstDayOfWeek.toISOString().split("T")[0];

                const myWeeklyRecords = attendance.filter(a => a.employeeId === user.id && a.date >= mondayStr && a.checkOut);
                let totalMinutes = 0;

                myWeeklyRecords.forEach(r => {
                    const [inH, inM] = r.checkIn.split(":").map(Number);
                    const [outH, outM] = r.checkOut.split(":").map(Number);
                    totalMinutes += (outH * 60 + outM) - (inH * 60 + inM);
                });

                const hrs = (totalMinutes / 60).toFixed(1);
                return `You have recorded approximately ${hrs} worked hours this week so far.`;
            }
        }

        // GENERAL FALLBACK
        return `I can answer queries such as: "How many employees do we have?", "Who is on leave today?", "Who was late today?", "How many leaves do I have left?", or "How many hours did I work this week?".`;
    }
};