const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

/**
 * Function to load template
 *
 * How to use:
 * <div id="parent"></div>
 * <script>
 *  load("#parent", "./path-to-template.html");
 * </script>
 */
function load(selector, path) {
    const cached = localStorage.getItem(path);
    if (cached) {
        $(selector).innerHTML = cached;
    }

    fetch(path)
        .then((res) => res.text())
        .then((html) => {
            if (html !== cached) {
                $(selector).innerHTML = html;
                localStorage.setItem(path, html);
            }
        })
        .finally(() => {
            window.dispatchEvent(new Event("template-loaded"));
        });
}

/**
 * Function to check if an element is hidden by display: none
 */
function isHidden(element) {
    if (!element) return true;

    if (window.getComputedStyle(element).display === "none") {
        return true;
    }

    let parent = element.parentElement;
    while (parent) {
        if (window.getComputedStyle(parent).display === "none") {
            return true;
        }
        parent = parent.parentElement;
    }

    return false;
}

/**
 * Function to force an action to wait
 * before being executed after a period of time
 */
function debounce(func, timeout = 300) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            func.apply(this, args);
        }, timeout);
    };
}

/**
 * JS toggle
 *
 * Instructions:
 * <button class="js-toggle" toggle-target="#box">Click</button>
 * <div id="box">Content show/hide</div>
 */
window.addEventListener("template-loaded", initJsToggle);

function initJsToggle() {
    $$(".js-toggle").forEach((button) => {
        const target = button.getAttribute("toggle-target");
        if (!target) {
            document.body.innerText = `Need to adding toggle-target for: ${button.outerHTML}`;
        }
        button.onclick = (e) => {
            e.preventDefault();

            if (!$(target)) {
                return (document.body.innerText = `Cannot found element "${target}"`);
            }
            const isHidden = $(target).classList.contains("hide");

            requestAnimationFrame(() => {
                $(target).classList.toggle("hide", !isHidden);
                $(target).classList.toggle("show", isHidden);
            });
        };
        document.onclick = function (e) {
            if (!e.target.closest(target)) {
                const isHidden = $(target).classList.contains("hide");
                if (!isHidden) {
                    button.click();
                }
            }
        };
    });
}

/**
 * Function to init tabs
 */
window.addEventListener("template-loaded", initTabs);

function initTabs(){
    const tabs = $$(".tab-item");
    const panes = $$(".tab-pane");
    
    const tabActive = $(".tab-item.active");
    const tabsWrapper = $(".tabs");
    
    requestIdleCallback(function () {
        tabsWrapper.style.setProperty("--line-tab-offset", tabActive.offsetLeft + "px")
        tabsWrapper.style.setProperty("--line-tab-width", tabActive.offsetWidth + "px")
    });
    
    tabs.forEach((tab, index) => {
      const pane = panes[index];
    
      tab.onclick = function () {
        $(".tab-item.active").classList.remove("active");
        $(".tab-pane.active").classList.remove("active");
    
        tabsWrapper.style.setProperty("--line-tab-offset", this.offsetLeft + "px");
        tabsWrapper.style.setProperty("--line-tab-width",this.offsetWidth + "px");
    
        this.classList.add("active");
        pane.classList.add("active");
      };
    });
}


/**
 * Function to toggle collapse
 */
window.addEventListener("template-loaded", initCollapsible);
function initCollapsible(){
    const arcordions = $$(".toggle-collapse")

    arcordions.forEach((arc) => {
        arc.onclick = function(){
            this.classList.toggle("active")
        }
    })
}