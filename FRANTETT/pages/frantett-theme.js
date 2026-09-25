/* ============================================================
   FRANTETT GLOBAL THEME
   Reads the theme selected in Settings.
   Presentation layer only.
   ============================================================ */

(function () {

    const THEME_KEY = "frantett_settings_theme";

    function applyFranTettTheme() {

        const savedTheme =
            localStorage.getItem(THEME_KEY);

        const theme =
            savedTheme === "dark"
                ? "dark"
                : "light";

        document.documentElement.setAttribute(
            "data-theme",
            theme
        );
    }

    try {
        applyFranTettTheme();
    } catch (error) {
        document.documentElement.setAttribute(
            "data-theme",
            "light"
        );
    }

})();