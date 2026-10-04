/** Inline <head>-style theme bootstrap. Must stay server-safe (no "use client"). */
export const THEME_SCRIPT = `(function(){try{var t=localStorage.getItem('ms-theme');if(t==='light'){document.documentElement.classList.remove('dark');}else if(t!=='dark'&&window.matchMedia('(prefers-color-scheme: light)').matches){document.documentElement.classList.remove('dark');}}catch(e){}})();`;

export const THEME_KEY = "ms-theme";
