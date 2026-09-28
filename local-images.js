(() => {
    const chosenLocalSources = new WeakMap();

    
    
    const configuredReplacements = new Map();
    const path = location.pathname.toLowerCase().replace(/\\/g, "/");
    const currentSection = path.includes("/team/") || path.endsWith("/team.html")
        ? "equipe"
        : path.includes("/blog/") || path.endsWith("/blog.html")
            ? "blog"
            : path.endsWith("/about.html")
                ? "apropos"
                : path.endsWith("/solutions.html")
                    ? "solutions"
                    : path.endsWith("/contact.html")
                        ? "contact"
                        : "accueil";

    const activeSections = [
        window.IMAGES_DU_SITE?.commun || {},
        window.IMAGES_DU_SITE?.[currentSection] || {},
    ];

    activeSections.forEach((section) => {
        Object.values(section).forEach(({ original, remplacement }) => {
            if (original && remplacement) configuredReplacements.set(original, remplacement);
        });
    });

    const scriptBase = new URL(".", document.currentScript?.src || location.href);

    const fileNameFromSource = (source) => {
        if (!source) return "";
        try {
            return decodeURIComponent(new URL(source, location.href).pathname.split("/").pop());
        } catch {
            return source.split("/").pop().split("?")[0];
        }
    };

    const isLocalSource = (source) => {
        if (!source) return false;
        return !/^(?:https?:)?\/\/|^data:|^blob:/i.test(source);
    };

    const preferLocalSource = (image) => {
        if (!(image instanceof HTMLImageElement)) return;

        const currentSource = image.getAttribute("src");
        // Explicit PSE replacements must win over a remembered template source.
        const pseSource = image.getAttribute("data-pse-img") || image.getAttribute("data-pse-aimg");
        if (pseSource) {
            const selected = new URL(pseSource, scriptBase).href;
            chosenLocalSources.set(image, selected);
            if (image.src !== selected) image.setAttribute("src", selected);
            image.removeAttribute("srcset");
            return;
        }
        const configuredPath = configuredReplacements.get(fileNameFromSource(currentSource));
        if (configuredPath) {
            chosenLocalSources.set(image, new URL(configuredPath, scriptBase).href);
        }

        if (!configuredPath && isLocalSource(currentSource)) {
            chosenLocalSources.set(image, currentSource);
        }

        const chosenSource = chosenLocalSources.get(image);
        if (chosenSource && currentSource !== chosenSource) {
            image.setAttribute("src", chosenSource);
        }

        
        
        
        if (chosenSource || isLocalSource(currentSource)) {
            image.removeAttribute("srcset");
        }
    };

    const updateImages = (root) => {
        if (root instanceof HTMLImageElement) preferLocalSource(root);
        if (root.querySelectorAll) root.querySelectorAll("img").forEach(preferLocalSource);
    };

    new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === "attributes") {
                preferLocalSource(mutation.target);
                return;
            }

            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === Node.ELEMENT_NODE) updateImages(node);
            });
        });
    }).observe(document.documentElement, {
        subtree: true,
        childList: true,
        attributes: true,
        attributeFilter: ["src", "srcset"],
    });

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () => updateImages(document));
    } else {
        updateImages(document);
    }
})();
