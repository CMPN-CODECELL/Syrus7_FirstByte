export class UI {
  static getAvatarColor(name = "User") {
    const colors = [
      { bg: "from-blue-600 to-indigo-600", text: "text-white" },
      { bg: "from-emerald-600 to-teal-600", text: "text-white" },
      { bg: "from-violet-600 to-purple-600", text: "text-white" },
      { bg: "from-amber-600 to-orange-600", text: "text-white" },
      { bg: "from-rose-600 to-pink-600", text: "text-white" },
      { bg: "from-cyan-600 to-blue-600", text: "text-white" },
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const idx = Math.abs(hash) % colors.length;
    return colors[idx];
  }

  static getInitials(name = "User") {
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return (parts[0] ? parts[0].substring(0, 2) : "US").toUpperCase();
  }

  static renderAvatar(name = "User", sizeClass = "w-10 h-10 text-sm") {
    const color = this.getAvatarColor(name);
    const initials = this.getInitials(name);
    return `
      <div class="${sizeClass} rounded-full bg-gradient-to-br ${color.bg} ${color.text} font-semibold flex items-center justify-center shrink-0 shadow-sm border border-white/20 select-none">
        ${initials}
      </div>
    `;
  }

  static showToast(message, type = "info") {
    let container = document.getElementById("campusos-toast-container");
    if (!container) {
      container = document.createElement("div");
      container.id = "campusos-toast-container";
      container.className = "fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm pointer-events-none";
      document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.className = `pointer-events-auto flex items-start gap-3 p-3.5 rounded-lg shadow-lg text-sm border animate-toast transition-all duration-200 ${
      type === "success"
        ? "bg-emerald-950/95 text-emerald-100 border-emerald-800"
        : type === "error"
        ? "bg-rose-950/95 text-rose-100 border-rose-800"
        : type === "warning"
        ? "bg-amber-950/95 text-amber-100 border-amber-800"
        : "bg-slate-900/95 text-slate-100 border-slate-700"
    }`;

    const icons = {
      success: `<svg class="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>`,
      error: `<svg class="w-5 h-5 text-rose-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>`,
      warning: `<svg class="w-5 h-5 text-amber-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>`,
      info: `<svg class="w-5 h-5 text-blue-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`,
    };

    toast.innerHTML = `
      ${icons[type] || icons.info}
      <div class="flex-1 font-medium leading-snug">${this.escapeHtml(message)}</div>
      <button class="text-white/60 hover:text-white shrink-0 ml-2" onclick="this.parentElement.remove()">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
      </button>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      if (toast && toast.parentElement) {
        toast.style.opacity = "0";
        toast.style.transform = "translateX(20px)";
        setTimeout(() => toast.remove(), 250);
      }
    }, 4000);
  }

  static escapeHtml(str = "") {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  static copyToClipboard(text, successMsg = "Copied to clipboard!") {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        this.showToast(successMsg, "success");
      }).catch(() => {
        this.showToast("Copied link: " + text, "info");
      });
    } else {
      this.showToast("Link: " + text, "info");
    }
  }

  static downloadTextAsFile(filename, text) {
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    this.showToast(`Downloaded ${filename} successfully!`, "success");
  }
}
