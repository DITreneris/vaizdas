(function () {
    'use strict';

    var CONFIG = {
        SELECTION_TIMEOUT: 2000,
        TOAST_DURATION: 3000,
        BUTTON_RESET_TIMEOUT: 2500,
        ERROR_TIMEOUT: 3000,
        DEBOUNCE_DELAY: 100,
        ACCORDION_KEY: 'di_generator_active_section_v1'
    };

    var copyTimeout = null;
    var toastTimeout = null;
    var isCopying = false;

    var TEXT = {
        lt: {
            notFound: 'Promptas nerastas',
            emptyPrompt: 'Tuščias promptas',
            copyFailed: 'Kopijuoti nepavyko',
            selectText: 'Pažymėk tekstą',
            copied: 'Nukopijuota ✓',
            copiedAria: 'Nukopijuota sėkmingai',
            errorAria: 'Klaida: ',
            toast: 'Nukopijuota.',
            copyPromptAria: 'Kopijuoti promptą ',
            clipboardSuffix: ' į mainų atmintinę'
        },
        en: {
            notFound: 'Prompt not found',
            emptyPrompt: 'Prompt is empty',
            copyFailed: 'Copy failed',
            selectText: 'Select the text',
            copied: 'Copied ✓',
            copiedAria: 'Copied successfully',
            errorAria: 'Error: ',
            toast: 'Copied.',
            copyPromptAria: 'Copy prompt ',
            clipboardSuffix: ' to clipboard'
        }
    };

    function getLocale() {
        return (document.documentElement.getAttribute('lang') || 'lt').toLowerCase().indexOf('en') === 0 ? 'en' : 'lt';
    }

    function t() {
        return TEXT[getLocale()];
    }

    function debounce(func, delay) {
        return function () {
            var args = arguments;
            var context = this;
            clearTimeout(copyTimeout);
            copyTimeout = setTimeout(function () { func.apply(context, args); }, delay);
        };
    }

    function selectText(element) {
        if (!element) return;
        try {
            var pre = element.querySelector('pre');
            if (!pre) return;
            var range = document.createRange();
            range.selectNodeContents(pre);
            var selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);

            element.classList.add('selected');
            setTimeout(function () {
                element.classList.remove('selected');
            }, CONFIG.SELECTION_TIMEOUT);
        } catch (_) { /* ignore */ }
    }

    function handleCodeBlockKeydown(event, element) {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            selectText(element);
        }
    }

    function copyPrompt(button, promptId) {
        if (isCopying) return;
        isCopying = true;

        var el = document.getElementById(promptId);
        if (!el) {
            showError(button, t().notFound);
            isCopying = false;
            return;
        }

        var text = el.textContent || el.innerText;
        if (!text || text.trim().length === 0) {
            showError(button, t().emptyPrompt);
            isCopying = false;
            return;
        }

        if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
            navigator.clipboard.writeText(text).then(function () {
                showSuccess(button);
                showToast();
                isCopying = false;
            }).catch(function () {
                fallbackCopy(text, button);
                isCopying = false;
            });
        } else {
            fallbackCopy(text, button);
            isCopying = false;
        }
    }

    function fallbackCopy(text, button) {
        var textarea = document.getElementById('hiddenTextarea');
        if (!textarea) {
            showError(button, t().copyFailed);
            return;
        }

        textarea.style.position = 'fixed';
        textarea.style.left = '0';
        textarea.style.top = '0';
        textarea.style.opacity = '0';
        textarea.value = text;
        textarea.focus();
        textarea.select();

        try {
            var ok = document.execCommand('copy');
            if (ok) {
                showSuccess(button);
                showToast();
            } else {
                showError(button, t().selectText);
            }
        } catch (_) {
            showError(button, t().selectText);
        }

        textarea.style.position = 'absolute';
        textarea.style.left = '-9999px';
        textarea.style.opacity = '0';
    }

    function showSuccess(button) {
        if (!button) return;
        var original = button.innerHTML;
        button.innerHTML = '<span aria-hidden="true"><i data-lucide="check-circle-2" class="icon icon--sm"></i></span><span>' + t().copied + '</span>';
        button.classList.add('success');

        if (window.lucide && typeof window.lucide.createIcons === 'function') {
            window.lucide.createIcons({ root: button });
        }

        button.setAttribute('aria-label', t().copiedAria);

        setTimeout(function () {
            button.innerHTML = original;
            button.classList.remove('success');
            if (window.lucide && typeof window.lucide.createIcons === 'function') {
                window.lucide.createIcons({ root: button });
            }
            var pid = button.getAttribute('data-prompt-id');
            if (pid) {
                button.setAttribute('aria-label', t().copyPromptAria + pid.replace('prompt', '') + t().clipboardSuffix);
            }
        }, CONFIG.BUTTON_RESET_TIMEOUT);
    }

    function showError(button, message) {
        if (!button) return;
        var original = button.innerHTML;
        var errorMessage = message || t().selectText;
        button.innerHTML = '<span aria-hidden="true"><i data-lucide="alert-triangle" class="icon icon--sm"></i></span><span>' + errorMessage + '</span>';
        if (window.lucide && typeof window.lucide.createIcons === 'function') {
            window.lucide.createIcons({ root: button });
        }
        button.setAttribute('aria-label', t().errorAria + errorMessage);

        setTimeout(function () {
            button.innerHTML = original;
            var pid = button.getAttribute('data-prompt-id');
            if (pid) {
                button.setAttribute('aria-label', t().copyPromptAria + pid.replace('prompt', '') + t().clipboardSuffix);
            }
        }, CONFIG.ERROR_TIMEOUT);
    }

    function showToast() {
        var toast = document.getElementById('toast');
        if (!toast) return;
        var progress = document.getElementById('toastProgress');
        var message = document.getElementById('toastMessage');
        clearTimeout(toastTimeout);
        toast.classList.add('show');
        toast.setAttribute('aria-live', 'polite');
        if (message) {
            message.textContent = t().toast;
        }
        if (progress) {
            progress.style.animation = 'none';
            void progress.offsetWidth;
            progress.style.animation = 'toastProgress ' + CONFIG.TOAST_DURATION + 'ms linear forwards';
        }
        toastTimeout = setTimeout(function () {
            toast.classList.remove('show');
            if (progress) progress.style.animation = 'none';
        }, CONFIG.TOAST_DURATION);
    }

    function getStoredAccordionId() {
        try {
            return localStorage.getItem(CONFIG.ACCORDION_KEY) || '';
        } catch (_) {
            return '';
        }
    }

    function setStoredAccordionId(value) {
        try {
            if (value) {
                localStorage.setItem(CONFIG.ACCORDION_KEY, value);
            } else {
                localStorage.removeItem(CONFIG.ACCORDION_KEY);
            }
        } catch (_) { /* ignore */ }
    }

    function setAccordionItem(item, isOpen) {
        if (!item || !item.toggle || !item.body) return;
        item.toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        item.body.hidden = !isOpen;
        if (item.chevron) {
            item.chevron.style.transform = isOpen ? 'rotate(180deg)' : '';
        }
    }

    function setupAccordion() {
        var items = [
            {
                id: 'promptLibrary',
                toggle: document.getElementById('promptLibraryToggle'),
                body: document.getElementById('promptLibraryBody'),
                chevron: document.querySelector('#promptLibraryToggle .collapsible-chevron')
            },
            {
                id: 'tools',
                toggle: document.getElementById('toolsToggle'),
                body: document.getElementById('toolsBody'),
                chevron: document.querySelector('#toolsToggle .collapsible-chevron')
            },
            {
                id: 'fullGenerator',
                toggle: document.getElementById('fullGenToggle'),
                body: document.getElementById('fullGenBody'),
                chevron: document.querySelector('#fullGenToggle .collapsible-chevron')
            }
        ].filter(function (item) { return item.toggle && item.body; });

        var sectionToStep = {
            miniGenerator: 1,
            promptLibrary: 2,
            tools: 3,
            fullGenerator: 4
        };

        function updateHeroActiveStep(sectionId) {
            var heroSteps = document.querySelectorAll('.header-step');
            heroSteps.forEach(function (step) { step.classList.remove('is-active'); });

            var stepNum = sectionToStep[sectionId];
            if (!stepNum) return;
            heroSteps.forEach(function (step) {
                var num = step.querySelector('.header-step-num');
                if (num && num.textContent.trim() === String(stepNum)) {
                    step.classList.add('is-active');
                }
            });
        }

        function openOnly(targetId) {
            var foundOpen = false;
            items.forEach(function (item) {
                var shouldOpen = item.id === targetId;
                setAccordionItem(item, shouldOpen);
                if (shouldOpen) foundOpen = true;
            });
            setStoredAccordionId(foundOpen ? targetId : '');
            updateHeroActiveStep(targetId || 'miniGenerator');
            if (foundOpen && targetId) {
                requestAnimationFrame(function () {
                    var section = document.getElementById(targetId);
                    if (section && section.scrollIntoView) {
                        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                });
            }
        }

        function toggleItem(targetId) {
            var current = items.find(function (i) { return i.id === targetId; });
            if (!current) return;
            var isOpen = current.toggle.getAttribute('aria-expanded') === 'true';
            if (isOpen) {
                setAccordionItem(current, false);
                setStoredAccordionId('');
                updateHeroActiveStep('miniGenerator');
                return;
            }
            openOnly(targetId);
        }

        items.forEach(function (item) {
            item.toggle.addEventListener('click', function () {
                toggleItem(item.id);
            });
        });

        window.openAccordionSection = function (sectionId) {
            if (!sectionId) return;
            openOnly(sectionId);
        };

        var heroLinks = document.querySelectorAll('.header-step[href]');
        heroLinks.forEach(function (link) {
            link.addEventListener('click', function (e) {
                var hash = link.getAttribute('href');
                if (!hash) return;
                var sectionId = hash.replace('#', '');
                var matchingItem = items.find(function (i) { return i.id === sectionId; });
                if (matchingItem) {
                    e.preventDefault();
                    openOnly(sectionId);
                    var target = document.getElementById(sectionId);
                    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });

        var stored = getStoredAccordionId();
        if (stored) {
            openOnly(stored);
        } else {
            openOnly('');
        }
    }

    window.selectText = debounce(selectText, CONFIG.DEBOUNCE_DELAY);
    window.copyPrompt = debounce(copyPrompt, CONFIG.DEBOUNCE_DELAY);
    window.handleCodeBlockKeydown = handleCodeBlockKeydown;

    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') {
            var toast = document.getElementById('toast');
            if (toast) { toast.classList.remove('show'); }
        }
    });

    document.addEventListener('DOMContentLoaded', function () {
        if (window.lucide && typeof window.lucide.createIcons === 'function') {
            window.lucide.createIcons();
        }

        setupAccordion();

        var codeBlocks = document.querySelectorAll('.code-block');
        codeBlocks.forEach(function (block) {
            if (!block.hasAttribute('tabindex')) {
                block.setAttribute('tabindex', '0');
            }
        });
    });
})();
