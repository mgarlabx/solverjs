
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


	// SELECT
	// use this <select onchange="myFunction(this.value)">


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

        let text = Zterms.text(language);
        text = text.replace(/\n/g, '<br>');
        text += `<div class="solver-terms-buttons">`;
        text += `<button id="z-terms-yes" class="solver-terms-button" style="background-color:blue;">${exprYes}</button>`;
        text += `<button id="z-terms-no" class="solver-terms-button" style="background-color:red;">${exprNo}</button>`;
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

    termsError(language) {
        if (language !== 'pt' && language !== 'es') language = 'en';
        const msgError = {
            "pt": "Erro: Termos não aceitos.",
            "en": "Error: Terms not accepted.",
            "es": "Error: Términos no aceptados.",
        }[language];
        const msgReload = {
            "pt": "Recarregar a página para ler novamente os termos.",
            "en": "Reload the page to read the terms again.",
            "es": "Recargue la página para leer los términos de nuevo.",
        }[language];
        document.body.innerHTML = `
            <div class="solver-terms-error">
            <div class="solver-terms-error-message">${msgError}</div>
            <div onclick="window.location.reload()" class="solver-terms-error-reload">${msgReload}</div>
            </div>`;
    },

    // ------ Record access ------ ------ ------ ------ ------ ------ ------ ------ ------ ------ ------ ------ ------ 

    recordAccess(appName) {
        if (location.href.includes('127.0.0')) return;
        if (location.href.includes('localhost')) return;
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
        this.languageCurrent = language;
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

};

window.solverModalClose = Z.modalHide;



const Zterms = {

    text(language) {
        if (language === 'pt') {
            return this.text_pt;
        } else if (language === 'es') {
            return this.text_es;
        } else {
            return this.text_en;
        }
    },

    text_en: `
SolverEdu is a voluntary, philanthropic, non-commercial, open-source initiative that aims to support educators and students through the use of technology. The applications available on this platform can be freely used by anyone, free of charge, under the following conditions:

1. There is no prior registration or need to log in, so all access is anonymous and no sensitive user data is collected and/or stored on servers. There is only a record of the number of accesses, for the purposes of platform usage statistics and, in some cases, records of user interactions, but always anonymously.

2. Much of the information and operations performed by users in the applications are stored locally, in the browser cache, through the "local storage" feature. This means that if the user clears the browser cache, this data will be lost. Likewise, if the user accesses the application on another device and/or another browser, this information will not be loaded.

3. Some applications on this platform have a download feature, which allows users to download a file in "json" format so that they can save the cache in their folders and upload it again using the upload feature, including on other devices.

4. The applications on this platform are "proof of concept", meaning they should not be used as a production environment, as they are subject to errors and imperfections, and there are no guarantees of security and stability.

5. As this is a voluntary and self-funded initiative, the platform may be taken offline at any time, without prior notice. This reinforces the need for this platform not to be used as a production environment.

6. If the user wishes to use one or more applications on this platform as a production environment, they must download the source code and install it on their own infrastructure, at their own risk and responsibility, and may change, delete and include new features, including for commercial purposes. We only request that this use be reported for the purposes of publicizing and promoting the platform.

7. The platform is currently free to access, but this does not prevent it from being commercialized and/or monetized in some way, directly or indirectly, in the future, nor from becoming a profit-making platform.

8. This platform is exclusively for educational purposes. It should only be used in this context and for peaceful and legal purposes. There are no guarantees for any misuse or for any other purpose.

9. Users of the SolverEdu platform and its applications exempt its organizers from any and all liability for material, personal, moral, image or any other type of damages that may be caused by its use or by third parties, in any and all circumstances.

Do you declare, of your own free will, that you have understood and are aware of the above conditions and agree to them in order to access SolverEdu applications?
    `,

    text_pt: `
A SolverEdu é uma iniciativa voluntária, filantrópica, sem fins comerciais e de código aberto, com o objetivo de apoiar educadores e educandos através do uso da tecnologia. As aplicações diponíveis nessa plataforma podem ser livremente utilizados por qualquer pessoa, sem custo, dentro das seguintes condições:

1. Não há cadastros prévios e nem a necessidade de login, portanto todos os acessos são anônimos e nenhum dado sensível dos usuários é coletado e/ou armazenado em servidores. Há apenas o registro da contagem de acessos, para fins de estatísticas de utilização da plataforma e, em alguns casos, registros das interações dos usuários, mas sempre de forma anônima.

2. Muitas das informações e operações feitas pelos usuários nas aplicações são armazenadas localmente, no cachê do navegador, através do recurso "local storage". Isso significa que no caso do usuário limpar o cachê do navegador, esses dados serão perdidos. Da mesma forma, se o usuário acessar em outro dispositivo e/ou outro navegador, essas informações não serão carregadas.

3. Algumas aplicações dessa plataforma possuem o recurso download, que permite baixar um arquivo no formato "json" para que o usuário possa salvar em suas pastas o cachê e subir novamente através do recurso upload, inclusive em outros dispositivos.

4. As aplicações dessa plataforma tem o caráter de "prova de conceito", ou seja, não devem ser usadas como ambiente de produção, pois estão sujeitas a erros e imperfeições, bem como não há garantias de segurança e de estabilidade. 

5. Como se trata de uma iniciativa voluntária e autofinanciada, a plataforma poderá ser retirada do ar a qualquer momento, sem aviso prévio. Dessa forma, reforça-se a necessidade desta plataforma não ser usada como ambiente de produção.

6. Caso o usuário deseje usar uma ou mais aplicações dessa plataforma como ambiente de produção, ele deverá baixar o código fonte e instalar em sua própria infraestrutura, sob sua responsabilidade e risco, sendo permitido alterar, excluir e incluir novas funcionalidades, inclusive com objetivos comerciais. Solicita-se apenas que esse uso seja informado, para fins de divulgação e impulsionamento da plataforma.

7. A plataforma no momento é de acesso gratuito, mas isso não impede que no futuro venha eventualmente a ser comercializada e/ou monetizada de alguma forma, direta ou indiretamente, tampouco que passe a ter fins lucrativos.

8. Essa plataforma tem exclusivamente objetivos educacionais. Só deve ser usada nesse contexto e com fins pacíficos e legais. Não há garantias por eventual mau uso ou decorrente de qualquer outro propósito.

9. Os usuários da plataforma SolverEdu e de suas aplicações isentam os seus organizadores de toda e qualquer responsabilidade por danos materiais, pessoais, morais, à imagem, ou de qualquer outra espécie, que venham a ser causados pelo seu uso ou por terceiros, em toda e qualquer hipótese.

Você declara, de livre e espontânea vontade, ter compreendido e estar ciente das condições acima e concorda com elas para acessar as aplicações da SolverEdu?    
    `,

    text_es: `
SolverEdu es una iniciativa voluntaria, filantrópica, no comercial y de código abierto, con el objetivo de apoyar a educadores y estudiantes a través del uso de la tecnología. Las aplicaciones disponibles en esta plataforma pueden ser utilizadas libremente por cualquier persona, de forma gratuita, bajo las siguientes condiciones:

1. No existe registro previo ni necesidad de iniciar sesión, por lo que todo acceso es anónimo y no se recogen y/o almacenan datos sensibles del usuario en servidores. Únicamente se mantiene un registro del número de accesos, a efectos de estadísticas de uso de la plataforma y, en algunos casos, registros de las interacciones de los usuarios, pero siempre de forma anónima.

2. Gran parte de la información y operaciones que realizan los usuarios en las aplicaciones se almacenan localmente, en la memoria caché del navegador, a través de la función de "almacenamiento local". Esto significa que si el usuario borra la memoria caché del navegador, estos datos se perderán. Asimismo, si el usuario accede desde otro dispositivo y/o otro navegador, esta información no se cargará.

3. Algunas aplicaciones de esta plataforma cuentan con la función de descarga, que permite descargar un archivo en formato “json” para que el usuario pueda guardar el caché en sus carpetas y volver a subirlo mediante la función de carga, incluso en otros dispositivos.

4. Las aplicaciones en esta plataforma son de naturaleza "prueba de concepto", lo que significa que no deben usarse como entorno de producción, ya que están sujetas a errores e imperfecciones y no existen garantías de seguridad y estabilidad.

5. Al tratarse de una iniciativa voluntaria y autofinanciada, la plataforma podrá ser retirada del servicio en cualquier momento, sin previo aviso. Esto refuerza la necesidad de que esta plataforma no se utilice como entorno de producción.

6. Si el usuario desea utilizar una o más aplicaciones de esta plataforma como entorno de producción, deberá descargar el código fuente e instalarlo en su propia infraestructura, bajo su propia responsabilidad y riesgo, pudiendo modificarlo, eliminarlo e incluir nuevas funcionalidades, incluso con fines comerciales. Únicamente se solicita que se informe de dicho uso, a efectos de difusión y promoción de la plataforma.

7. La plataforma actualmente es de libre acceso, pero esto no impide que en el futuro pueda ser comercializada y/o monetizada de alguna forma, directa o indirectamente, ni convertirse en una plataforma con fines lucrativos.

8. Esta plataforma tiene fines exclusivamente educativos. Sólo debe utilizarse en este contexto y con fines pacíficos y legales. No existen garantías por mal uso o para cualquier otro propósito.

9. Los usuarios de la plataforma SolverEdu y sus aplicaciones eximen a sus organizadores de cualquier responsabilidad por daños materiales, personales, morales, de imagen o de cualquier otro tipo que pudieran ocasionarse por su utilización o por terceros, en cualquier circunstancia.

¿Declara usted, por su propia voluntad, haber comprendido y conocer las condiciones anteriores y estar de acuerdo con ellas para poder acceder a las aplicaciones de SolverEdu?
    `,


};
