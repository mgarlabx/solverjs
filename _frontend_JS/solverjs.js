
const Z = {

    closeIcon: '<?xml version="1.0" encoding="iso-8859-1"?><svg fill="#000000" height="20px" width="20px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 490 490" xml:space="preserve"><polygon points="456.851,0 245,212.564 33.149,0 0.708,32.337 212.669,245.004 0.708,457.678 33.149,490 245,277.443 456.851,490 489.292,457.678 277.331,245.004 489.292,32.337 "/></svg>',

    // Wait for the DOM to be ready
    ready(callback) {
        document.addEventListener('DOMContentLoaded', callback);
    },


    // ------ DOM ------ ------ ------ ------ ------ ------ ------ ------ ------ ------ ------ ------ ------ 

    // Get element by ID
    get(selector) {
        if (selector.length === 0) return;
        selector = selector.replace('#', '');
        return document.getElementById(selector);
    },

    // Hide elements
    hide(selector) {
        if (selector.length === 0) return;
        if (selector.slice(0, 1) === '#') {
            if (this.missing(selector)) return;
            document.querySelector(selector).style.display = 'none';
        } else if (selector.slice(0, 1) === '.') {
            document.querySelectorAll(selector).forEach((el) => {
                el.style.display = 'none';
            });
        }
    },

    // Show elements
    show(selector, display = 'block') {
        if (selector.length === 0) return;
        if (selector.slice(0, 1) === '#') {
            if (this.missing(selector)) return;
            document.querySelector(selector).style.display = display;
        } else if (selector.slice(0, 1) === '.') {
            document.querySelectorAll(selector).forEach((el) => {
                el.style.display = display;
            });
        }
    },

    // Set innerHTML
    html(selector, html) {
        if (this.missing(selector)) return;
        document.querySelector(selector).innerHTML = html;

    },


    // Check if element exists
    missing(selector) {
        if (document.querySelector(selector)) {
            return false;
        } else {
            console.log(`Z.ERROR: Element ${selector} does not exist`);
            return true;
        }
    },

    // ------ Form ------ ------ ------ ------ ------ ------ ------ ------ ------ ------ ------ ------ ------ 

    // Example
    // tx += `<input type="radio" class="edit-radio" value="quiz" name="radio-type" ${this.data.type == 'quiz' ? ' checked' : '' }> Quiz`;
    // const type = Z.getInputRadio('radio-type');
    getInputRadio(elementName) {
        return document.querySelector(`input[name="${elementName}"]:checked`)?.value;
    },

    // Example
    // <input id="exampleId">;
    // const command = Z.getInputText('exampleId');
    getInputText(elementId) {
        return document.querySelector(`#${elementId}`).value;
    },

    getInputTextarea(elementId) {
        return document.querySelector(`#${elementId}`).value;
    },

    getInputCheckbox(elementId) {
        return document.querySelector(`#${elementId}`).checked;
    },

    getInputCheckboxes(className) {
        const checkboxes = document.querySelectorAll(`.${className}`);
        return checked = [...checkboxes].map(checkbox => checkbox.checked);
    },

    // deprecated
    getValue(selector) {
        if (this.missing(selector)) return;
        return document.querySelector(selector).value;
    },

    // ------ Terms ------ ------ ------ ------ ------ ------ ------ ------ ------ ------ ------ ------ ------ 

    terms(appName, language, callback) {
        let solveredu = localStorage.getItem('solveredu');
        solveredu = JSON.parse(solveredu);
        if (solveredu?.terms?.includes(appName)) return callback(true); // user already accepted terms
        Z.termsShow(appName, language, callback); // otherwise, show terms
    },

    termsShow(appName, language, callback) {

        // Remove accepted terms to force click again
        let solveredu = localStorage.getItem('solveredu');
        solveredu = JSON.parse(solveredu);
        if (solveredu) {
            if (solveredu.terms) {
                solveredu.terms = solveredu.terms.filter(item => item !== appName);
            } else {
                solveredu.terms = [];
            }
        } else {
            console.log(3);
            solveredu = { terms: [] };
        }
        localStorage.setItem('solveredu', JSON.stringify(solveredu));

        // Show terms
        if (language !== 'pt' && language !== 'es') language = 'en';
        const title = {
            en: 'Terms of use and privacy policy',
            pt: 'Condições de uso e política de privacidade',
            es: 'Condiciones de uso y política de privacidad'
        }[language];
        const exprYes = {
            en: 'Yes',
            pt: 'Sim',
            es: 'Sí'
        }[language];
        const exprNo = {
            en: 'No',
            pt: 'Não',
            es: 'No'
        }[language];

        // Read terms from file
        const path = `files/terms_${language}.txt`;
        fetch(path)
            .then(response => response.text())
            .then(text => {
                text = text.replace(/\n/g, '<br>');
                text += `<div class="terms-buttons">`;
                text += `<button id="z-terms-yes" class="terms-button" style="background-color:blue;">${exprYes}</button>`;
                text += `<button id="z-terms-no" class="terms-button" style="background-color:red;">${exprNo}</button>`;
                text += `</div>`;
                Z.modal(title, text, false);
                Z.get('#z-terms-yes').onclick = () => {
                    Z.termsAccept(appName, 1);
                    return callback(true);
                };
                Z.get('#z-terms-no').onclick = () => {
                    Z.termsAccept(appName, 0);
                    return callback(false);
                };
            });
    },

    // button 1 = accept, 0 = reject
    termsAccept(appName, option) {
        let solveredu = localStorage.getItem('solveredu');
        solveredu = JSON.parse(solveredu);
        if (option === 1) {
            if (!solveredu.terms.includes(appName)) {
                solveredu.terms.push(appName);
            }
        } else {
            solveredu.terms = solveredu.terms.filter(item => item !== appName);
        }
        localStorage.setItem('solveredu', JSON.stringify(solveredu));
        Z.modalHide();
    },

    // ------ Record access ------ ------ ------ ------ ------ ------ ------ ------ ------ ------ ------ ------ ------ 

    recordAccess(appName) {
        fetch(`https://solvertank.tech/solverjs/app/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                proc: 'recordAccess',
                appName: appName 
            })
        });
    },


    // ------ Processing ------ ------ ------ ------ ------ ------ ------ ------ ------ ------ ------ ------ ------ 

    processing: {
        show(icon = '<img src="https://solvertank.tech/solverjs/images/processing.gif" alt="Processing...">') {
            const tx = `<div id="solver-processing"><div id="solver-processing-icon">${icon}</div></div>`;
            document.querySelector('body').insertAdjacentHTML('beforeend', tx);
        },
        hide() {
            try {
                document.querySelector('body').removeChild(document.querySelector('#solver-processing'));
            }
            catch (e) {
                //console.log('Z.ERROR: Processing not found');
            }
        },
    },

    // ------ Modal ------ ------ ------ ------ ------ ------ ------ ------ ------ ------ ------ ------ ------ 

    modal(title, body, showCloseIcon = true) {
        let tx = '';
        tx += `<div id="solver-modal-backdrop" ${showCloseIcon ? ` onclick="solverModalClose()` : ``}"></div>`;
        tx += `<div id="solver-modal">`;
        tx += `<div id="solver-modal-header">`;
        tx += `<div id="solver-modal-header-title">${title}</div>`;
        if (showCloseIcon) tx += `<div id="solver-modal-header-close" onclick="solverModalClose()">${Z.closeIcon}</div>`;
        tx += `</div>`;
        tx += `<div id="solver-modal-body">${body}</div>`;
        tx += `</div>`;
        document.querySelector('body').insertAdjacentHTML('beforeend', tx);

    },

    modalHide() {
        document.querySelector('body').removeChild(document.querySelector('#solver-modal'));
        document.querySelector('body').removeChild(document.querySelector('#solver-modal-backdrop'));
    },


    // ------ Language ------ ------ ------ ------ ------ ------ ------ ------ ------ ------ ------ ------ ------ 

    languageCurrent: 'en',

    languageDictionary: [],

    languageBrowser() {
        const browserLanguage = navigator.language || navigator.userLanguage;
        if (browserLanguage.startsWith('en-')) {
            return 'en';
        } else if (browserLanguage.startsWith('pt-')) {
            return 'pt';
        } else if (browserLanguage.startsWith('es-')) {
            return 'es';
        } else {
            return 'en';
        }
    },

    async languageLoadDictionary(dictionaryPath) {
        this.languageCurrent = this.languageBrowser();
        const response = await fetch(dictionaryPath);
        const data = await response.json();
        this.languageDictionary = data;
    },

    languageSet(language) {
        this.currentLanguage = language;
    },

    //languageTranslate
    lng(key) {
        const obj = this.languageDictionary.find(item => item.key === key);
        if (obj) {
            return obj[this.languageCurrent];
        } else {
            console.log(`Z.ERROR: ${key} not found in dictionary`);
            return `{{{${key}}}}`;
        }
    },

}

window.solverModalClose = Z.modalHide;

