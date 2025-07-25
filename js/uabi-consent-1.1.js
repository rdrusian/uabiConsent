/** uabiConsent 1.1.1
*
* Copyright 2025, Rudi Drusian - https://rudi.drusian.com.br
* Licensed under MIT: https://telazul.drusian.com.br/en/article/license
*
* Changelog:
*
* - Configured consent using signals from google analytics
* - Added function to show cookie values ​​in browser console
*/

// ##################
// #   setCookie()  #
// ##################
function setCookie(name, value, days) {
  let expires = "";
  if (days) {
    let date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + value + expires + "; path=/; SameSite=None; Secure";
}

// ##################
// #   getCookie()  #
// ##################
function getCookie(name) {
	let nameEQ = name + "=";
	let ca = document.cookie.split(';');
	for (let i = 0; i < ca.length; i++) {
		 let c = ca[i];
		 while (c.charAt(0) == ' ') c = c.substring(1, c.length);
		 if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
	}
	return null;
}

// ####################
// #   eraseCookie()  #
// ####################
function eraseCookie(name) {
	document.cookie = name + '=; Max-Age=-99999999; expires=Thu, 01 Jan 1970 00:00:00 GMT;';
}

// ####################
// #   validateURL()  #
// ####################
function validateURL(str) {
	let pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
	 '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
	 '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
	 '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
	 '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
	 '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
	return !!pattern.test(str);
}

// #########################
// #  Current Script Path  #
// #########################
const uabiSrc = document.currentScript.src;
const uabiPath = uabiSrc.substring(0, uabiSrc.lastIndexOf("/"));;

// ############################################
// #  Lei Geral de Proteção de Dados (LGPD)   #
// ############################################
const uabiConsent = function(options) {
	const t = this;
	// Options
	t.opt = Object.assign({}, uabiConsent.Defaults, options);

	// Button Open Dialog
	t.showDialogButton = document.querySelectorAll('.uabi-consent-show-dialog');

	// Text for Accordion items and help
	t.onOffText = [
		{ id: 'strictlyNecessary' },
		{ id: 'performanceCookies' },
		{ id: 'functionalCookies' },
		{ id: 'targetingCookies' },
	];

	// Allowed Languages
	t.allowedLanguages = ['pt','en','es'];

	// strictlyNecessary always granted
	setCookie(t.opt.name + 'strictlyNecessary', "granted", t.opt.expire);

	// First Access
	if (!getCookie(t.opt.name)) {
		// Set Show Dialog Cookie
		setCookie('uabiShowDialog', true, t.opt.expire);
	}

	// Until the user take action
	if (getCookie('uabiShowDialog') == 'true') {
		// Set Initial Consent Cookie
		setCookie(t.opt.name, t.opt.initialConsent, t.opt.expire);
		// Cookie by Type
		if (t.onOffText) {
			for (let i = 0; i < t.onOffText.length; i++) {
				let s = t.onOffText[i];
				if (s.id != 'strictlyNecessary') {
					setCookie(t.opt.name + s.id, t.opt.initialConsent, t.opt.expire);
				}
			}
		}
	}

	// Validate privacy policy url
	if (validateURL(t.opt.privacyPolicyUrl) === false) {
		throw new Error('Cookies: Error loading privacy policy url');
	// Validate language
	} else if (!t.allowedLanguages.includes(t.opt.lang)) {
		throw new Error('Consent Language: Error loading translations' );
	} else if (t.opt.analytics === true && (typeof t.opt.analyticsID == 'undefined' || t.opt.analyticsID == '')) {
		throw new Error('Analytics: Configure a valid ID' );
	} else if (t.opt.adsense === true && (typeof t.opt.adsenseID == 'undefined' || t.opt.adsenseID == '')) {
		throw new Error('Adsense: Configure a valid ID' );
	} else {
		t.init();
	}
}

// #############
// #  Options  #
// #############
uabiConsent.Defaults = {
	name: 'uabiConsent-',
	initialConsent: 'denied',
	expire: 365,
	lang: 'pt',
	showDecline: true,
	showSettings: true,
	analytics: false,
	adsense: false,
	consoleLog: false
}

// ########################
// #   getConsentSignal   #
// ########################
uabiConsent.prototype.getConsentSignal = function (cookieName) {
	const t = this;
	const signal = getCookie(t.opt.name + cookieName);
	return ['granted', 'denied'].includes(signal) ? signal : 'denied';
};

// ######################
// #   Load Analytics   #
// ######################
uabiConsent.prototype.loadAnalytics = function () {

	// kkkkkk - Descomentar a linha no final
	// if (location.hostname.includes('.localdomain')) return;
	const t = this;
	if (!t.analytics) {
		t.analytics = document.createElement('script');
		t.analytics.async = true;
		t.analytics.src = 'https://www.googletagmanager.com/gtag/js?id=' + t.opt.analyticsID;

		t.analytics.onload = function() {
			window.dataLayer = window.dataLayer || [];
		   window.gtag = window.gtag || function () { dataLayer.push(arguments); };

			const adsenseSignal = t.getConsentSignal('targetingCookies');
			const analyticsSignal = t.getConsentSignal('performanceCookies');

			// Set user conset signals
			gtag('consent', 'default', {
			  'ad_storage': adsenseSignal,
			  'ad_user_data': adsenseSignal,
			  'ad_personalization': adsenseSignal,
			  'analytics_storage': analyticsSignal
			});

			// Configure Google Analytics with the ID provided
		   gtag('js', new Date());
		   gtag('config', t.opt.analyticsID);
		};

		document.head.appendChild(t.analytics);
	}
}

// ########################
// #   Reload Analytics   #
// ########################
uabiConsent.prototype.reloadAnalytics = function () {
	const t = this;

	if (location.hostname.includes('.localdomain')) return;
	if (t.opt.analytics === false || typeof t.opt.analyticsID == 'undefined' || t.opt.analyticsID == '') return


	const adsenseSignal = t.getConsentSignal('targetingCookies');
	const analyticsSignal = t.getConsentSignal('performanceCookies');

	// Set user conset signals
	gtag('consent', 'update', {
	  'ad_storage': adsenseSignal,
	  'ad_user_data': adsenseSignal,
	  'ad_personalization': adsenseSignal,
	  'analytics_storage': analyticsSignal
	});

	// Configure Google Analytics with the ID provided
   gtag('config', t.opt.analyticsID);
}

// ###############
// #   Adsense   #
// ###############
uabiConsent.prototype.loadAdsense = function () {
	if (location.hostname.includes('.localdomain')) return;
	const t = this;
	if (!t.adsense) {
		if (document.querySelector('script[src*="adsbygoogle.js"]')) {
		  throw new Error('Adsense has already been started outside the script which causes conflict');
		}

		t.adsense = document.createElement('script');
		t.adsense.async = true;
		t.adsense.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=' + t.opt.adsenseID;
		t.adsense.crossorigin = 'anonymous';

		t.adsense.onload = function() {
			// Ensures the adsbygoogle array exists
			const adsbygoogle = window.adsbygoogle || [];
      	window.adsbygoogle = adsbygoogle;
			// Function to initialize a single ad
			function initializeAd(adElement) {
				try {
					adsbygoogle.push({});
				} catch (error) {
					console.error('Erro ao inicializar anúncio AdSense:', error);
				}
			}
			const manualAds = document.querySelectorAll('ins[data-ad-client]');
			manualAds.forEach(initializeAd);
		}
		document.head.appendChild(t.adsense);
	}
}

// #################
// #   consent()   #
// #################
uabiConsent.prototype.consent = function (e) {
	const t = this;

	// Consent All
	setCookie(t.opt.name, 'granted', t.opt.expire);

	// Grant Cookies by Type
	if (t.onOffText) {
		for (const s of t.onOffText) {
			setCookie(t.opt.name + s.id, 'granted', t.opt.expire);
		}
	}

	// Check the checkboxes if showSettings is active.
	if (t.onOffItems) {
		for (const s of t.onOffItems) {
			s.checked = true;
		}
	}

	// Close
	t.closeSettings(e);
	t.closeDialog();

	// Reload analytics with new consents signals
	// Adsense uses the same signals as analytics
	t.reloadAnalytics();

	// Show log in console if enabled
	if (t.opt.consoleLog) t.logCookies();
}

// ########################
// #   confirmChoices()   #
// ########################
uabiConsent.prototype.confirmChoices = function (e) {
	const t = this;
	// Consent all
	let consentAll = 'granted';

	// Individual consentment
	let consent;

	// Set cookies by type
	for (const s of t.onOffItems) {
		// Consent all is false if one of the cookie types is false
		if (s.checked === false) {
			consentAll = 'denied';
			consent = 'denied'
		} else {
			consent = 'granted';
		}

		setCookie(t.opt.name + s.id, consent, t.opt.expire);
	}

	// Set Consent for All Cookies
	setCookie(t.opt.name, consentAll, t.opt.expire);
	// Tell not to open the dialog
	setCookie('uabiShowDialog', false, t.opt.expire);
	// Close
	t.closeSettings(e);
	t.closeDialog();

	// Reload analytics with new consents signals
	// Adsense uses the same signals as analytics
	t.reloadAnalytics();

	// Show log in console if enabled
	if (t.opt.consoleLog) t.logCookies();
}

// #################
// #   decline()   #
// #################
uabiConsent.prototype.decline = function (e) {
	const t = this;
	setCookie(t.opt.name, 'denied', t.opt.expire);

	// Deny Cookies by Type
	if (t.onOffText) {
		for (const s of t.onOffText) {
			if (s.id != 'strictlyNecessary') {
				setCookie(t.opt.name + s.id, 'denied', t.opt.expire);
			}
		}
	}

	// Uncheck the checkboxes if showSettings is active.
	if (t.onOffItems) {
		for (const s of t.onOffItems) {
			if (s.id != 'strictlyNecessary') {
				s.checked = false;
			}
		}
	}


	t.closeDialog();

	// Reload analytics with new consents signals
	// Adsense uses the same signals as analytics
	t.reloadAnalytics();

	// Show log in console if enabled
	if (t.opt.consoleLog) t.logCookies();
}

// ##################
// #   settings()   #
// ##################
uabiConsent.prototype.settings = function (e) {
	const t = this;
	t.dialog.classList.remove('active');
	t.settingsDialog.classList.add('active');
}

// #######################
// #   closeSettings()   #
// #######################
uabiConsent.prototype.closeSettings = function (e) {
	const t = this;
	e.preventDefault();
	t.dialog.classList.add('active');
	if (t.opt.showSettings) {
		t.settingsDialog.classList.remove('active');
	}
}

// #########################
// #   toogleAccordion()   #
// #########################
uabiConsent.prototype.toogleAccordion = function (s,e) {
	if (e.target.classList.contains('uabi-consent-settings-text')) {
		s.nextElementSibling.classList.toggle('active');
	}
}

// ####################
// #   logCookies()   #
// ####################
uabiConsent.prototype.logCookies = function (e) {
	const t = this;


// Log cookies values in console using colors
const styles = {
    granted: "color:#08e20f;font-weight:bold;",
    denied: "color:#f93922;font-weight:bold;",
};

console.log(
    `Consent All: %c${getCookie(t.opt.name)}%c
Show Dialog: %c${getCookie("uabiShowDialog")}%c
strictlyNecessary: %c${getCookie(t.opt.name + "strictlyNecessary")}%c
performanceCookies: %c${getCookie(t.opt.name + "performanceCookies")}%c
functionalCookies: %c${getCookie(t.opt.name + "functionalCookies")}%c
targetingCookies: %c${getCookie(t.opt.name + "targetingCookies")}`,
    getCookie(t.opt.name) === "granted" ? styles.granted : styles.denied,
    "", // Reset de estilo (para evitar que os estilos "vazem" para a próxima linha)
    getCookie("uabiShowDialog") === "true" ? styles.granted : styles.denied,
    "",
    getCookie(t.opt.name + "strictlyNecessary") === "granted" ? styles.granted : styles.denied,
    "",
    getCookie(t.opt.name + "performanceCookies") === "granted" ? styles.granted : styles.denied,
    "",
    getCookie(t.opt.name + "functionalCookies") === "granted" ? styles.granted : styles.denied,
    "",
    getCookie(t.opt.name + "targetingCookies") === "granted" ? styles.granted : styles.denied
);


}

// ###################
// #   newDialog()   #
// ###################
uabiConsent.prototype.newDialog = function (e) {
	const t = this;

	// Cria o container
	t.container = document.createElement('div');
	t.container.className = 'uabi-consent-container active';
	document.body.appendChild(t.container);

	// Cria a caixa de dialogo
	t.dialog = document.createElement('div');
	t.dialog.className = 'uabi-consent-dialog active';
	t.container.appendChild(t.dialog);

	// Cria o container da mensagem
	t.dialogMessageContainer = document.createElement('div');
	t.dialogMessageContainer.className = 'uabi-consent-message';
	t.dialog.appendChild(t.dialogMessageContainer);

	// Cria o título da mensagem
	t.dialogTitle = document.createElement('h1');
	t.dialogTitle.innerHTML = t.lang.dialogTitle;
	t.dialogMessageContainer.appendChild(t.dialogTitle);

	// Cria a mensagem
	t.dialogMessage = document.createElement('p');
	t.dialogMessage.innerHTML = t.lang.message[langModifier] + ' ';
	t.dialogMessageContainer.appendChild(t.dialogMessage);

	// Política de Privacidade
	t.privacyPolicyP = document.createElement('p');
	t.privacyPolicyP.className = 'uabi-learn-more';
	t.dialogMessageContainer.appendChild(t.privacyPolicyP);

	t.privacyPolicyUrl = document.createElement('a');
	t.privacyPolicyUrl.href = t.opt.privacyPolicyUrl;
	t.privacyPolicyUrl.innerHTML = t.lang.learnMore;
	t.privacyPolicyP.appendChild(t.privacyPolicyUrl);

	// Cria o container dos botões
	t.dialogButtons = document.createElement('div');
	t.dialogButtons.className = 'uabi-consent-buttons';
	t.dialog.appendChild(t.dialogButtons);

	// Botão Consentir
	t.consentButton = document.createElement('button');
	t.consentButton.className = 'uabi-consent-btn uabi-consent-btn-consent';
	t.consentButton.innerHTML = t.lang.consent[langModifier];
	t.dialogButtons.appendChild(t.consentButton);

	if (t.opt.showDecline) {
		// Botão Recusar
		t.declineButton = document.createElement('button');
		t.declineButton.className = 'uabi-consent-btn uabi-consent-btn-decline';
		t.declineButton.innerHTML = t.lang.decline;
		t.dialogButtons.appendChild(t.declineButton);
	}

	// Botão Configurar
	if (t.opt.showSettings) {
		t.settingsButton = document.createElement('button');
		t.settingsButton.className = 'uabi-consent-btn uabi-consent-btn-settings';
		t.settingsButton.innerHTML = t.lang.settings;
		t.dialogButtons.appendChild(t.settingsButton);
	}
}

// ####################
// #   showDialog()   #
// ####################
uabiConsent.prototype.showDialog = function (e) {
	const t = this;
	e.preventDefault();
	t.container.classList.add('active');
}

// #####################
// #   closeDialog()   #
// #####################
uabiConsent.prototype.closeDialog = function (e) {
	const t = this;
	t.container.classList.remove('active')
	setCookie('uabiShowDialog', false, t.opt.expire);
}

// ###########################
// #   newSettingsDialog()   #
// ###########################
uabiConsent.prototype.newSettingsDialog = function (e) {
	const t = this;

	// Configuration container
	t.settingsDialog = document.createElement('div');
	t.settingsDialog.className = 'uabi-consent-settings';
	t.container.appendChild(t.settingsDialog);

	// Title
	t.settingsDialogTitle = document.createElement('h1');
	t.settingsDialogTitle.innerHTML = t.lang.settingsDialogTitle;
	t.settingsDialog.appendChild(t.settingsDialogTitle);

	// Close Button
	t.settingsCloseButton = document.createElement('a');
	t.settingsCloseButton.href = '';
	t.settingsCloseButton.className = 'uabi-consent-close-btn';
	t.settingsCloseButton.innerHTML = '&#x02a2f;';
	t.settingsDialog.appendChild(t.settingsCloseButton);

	// Message
	t.settingsDialogMessage = document.createElement('p');
	t.settingsDialogMessage.innerHTML = t.lang.settingsDialogMessage;
	t.settingsDialog.appendChild(t.settingsDialogMessage);

	// Accordion Help Container
	t.settingsDialogAccordion = document.createElement('div');
	t.settingsDialogAccordion.className = 'uabi-consent-accordion';
	t.settingsDialog.appendChild(t.settingsDialogAccordion);

	// Array to store items for later access
	t.accordionItems = [];
	t.onOffItems = [];

	// Create the Accordion Items
	for (let i = 0; i < t.onOffText.length; i++) {

		// Item container
		let item = document.createElement('div');
		item.className = 'uabi-consent-accordion-item';
		t.settingsDialogAccordion.appendChild(item);

		// Item Header
		let itemHeader = document.createElement('div');
		itemHeader.className = 'uabi-consent-accordion-item-header';
		item.appendChild(itemHeader);

		// Cookie Type
		let text = document.createElement('div');
		text.className = 'uabi-consent-settings-text';
		text.innerHTML = t.onOffText[i].lang + ' &#8595;';
		itemHeader.appendChild(text);

		// On / Off
		let onOff = document.createElement('div');
		onOff.className = 'uabi-consent-on-off';
		itemHeader.appendChild(onOff);

		let onOffLabel = document.createElement('label');
		onOff.appendChild(onOffLabel);

		// Checkbox
		let cookie = getCookie(t.opt.name + t.onOffText[i].id);
		let onOffCheckbox = document.createElement('input');
		onOffCheckbox.type = 'checkbox';
		onOffCheckbox.id = t.onOffText[i].id;
		// strictlyNecessary always TRUE, disabled
		if (t.onOffText[i].id == 'strictlyNecessary') {
			onOffCheckbox.checked = true;
			onOffCheckbox.disabled = true;
		} else if (cookie == 'granted' || (cookie === null && t.opt.initialConsent === 'granted')) {
			onOffCheckbox.checked = true;
		}
		onOffLabel.appendChild(onOffCheckbox);

		let onOffSpan = document.createElement('span');
		onOffLabel.appendChild(onOffSpan);

		// Accordion Help
		let body = document.createElement('div');
		body.className = 'uabi-consent-accordion-body';
		item.appendChild(body);

		let bodyText = document.createElement('div');
		bodyText.innerHTML = t.onOffText[i].langHelp;
		body.appendChild(bodyText);

		//  Save items for latter access

		// Accordion
		t.accordionItems[i] = itemHeader;
		// On / Off
		t.onOffItems[i] = onOffCheckbox;

	}

	// Buttons
	t.settingsDialogButtons = document.createElement('div');
	t.settingsDialogButtons.className = 'uabi-consent-buttons';
	t.settingsDialog.appendChild(t.settingsDialogButtons);

	// Confirm Choices Button
	t.settingsConfirmButton = document.createElement('button');
	t.settingsConfirmButton.className = 'uabi-consent-btn uabi-consent-btn-confirm';
	t.settingsConfirmButton.innerHTML = t.lang.confirm;
	t.settingsDialogButtons.appendChild(t.settingsConfirmButton);

	// Consent All Button
	t.settingsConsentButton = document.createElement('button');
	t.settingsConsentButton.className = 'uabi-consent-btn uabi-consent-btn-consent';
	t.settingsConsentButton.innerHTML = t.lang.consent[langModifier];
	t.settingsDialogButtons.appendChild(t.settingsConsentButton);

}

// ###################
// #   Lang / Init   #
// ###################
uabiConsent.prototype.init = function () {
	const t = this;

	fetch(uabiPath + `/uabi-consent-1.1.lang.json`)
	.then(response => response.json())
	.then(response => {
		// Lang
		t.lang = response[t.opt.lang];

		// Text for Accordion items and help
		for (var i = 0; i < t.onOffText.length; i++) {
			t.onOffText[i].lang = t.lang[t.onOffText[i].id];
			t.onOffText[i].langHelp = t.lang[t.onOffText[i].id + 'Help'];
		}

		// init 2
		t.init2();
	})
	.catch(error => {
      console.error(`LGPD: Error loading translations`);
    });
}

// ###########
// #  Init 2 #
// ###########
uabiConsent.prototype.init2 = function (e) {
	const t = this;

	// Defines the message according to whether consent is required or not
	if (t.opt.initialConsent == "granted" && !t.opt.showDecline && !t.opt.showSettings) {
		langModifier = 'mandatory';
	} else {
		langModifier = 'default';
	}

	// Create the dialog boxes
	t.newDialog();
	if (t.opt.showSettings) {
		t.newSettingsDialog();
	}

	// Analytics
	// Loads Analytics even if only Adsense is enabled.
	// Adsense needs Analytics to be loaded to use its signals.
	if (t.opt.analytics || t.opt.adsense) t.loadAnalytics();

	// Adsense
	if (t.opt.adsense) t.loadAdsense();

	// #####################
	// #  Event Listeners  #
	// #####################

	// Show Dialog Button - Cookies
	if (t.showDialogButton) {
		t.showDialogButtonClickHandler = [];
		for (let i = 0; i < t.showDialogButton.length; i++) {
			t.showDialogButtonClickHandler[i] = t.showDialog.bind(t);
			t.showDialogButton[i].addEventListener('click', t.showDialogButtonClickHandler[i]);
		}
	}

	// Consent Button
	t.consentButtonClickHandler = t.consent.bind(t);
	t.consentButton.addEventListener('click', t.consentButtonClickHandler);

	// Decline Button
	if (t.opt.showDecline) {
		t.declineButtonClickHandler = t.decline.bind(t);
		t.declineButton.addEventListener('click', t.declineButtonClickHandler);
	}

	if (t.opt.showSettings) {
		// Settings Button
		t.settingsButtonClickHandler = t.settings.bind(t);
		t.settingsButton.addEventListener('click', t.settingsButtonClickHandler);

		// Settings Consent Button
		if (t.opt.showSettings) {
			t.settingsConsentButtonClickHandler = t.consent.bind(t);
			t.settingsConsentButton.addEventListener('click', t.settingsConsentButtonClickHandler);
		}

		// Settings Close Button
		t.settingsCloseButtonClickHandler = t.closeSettings.bind(t);
		t.settingsCloseButton.addEventListener('click', t.settingsCloseButtonClickHandler);

		// Settings Close Button
		t.settingsCloseButtonClickHandler = t.closeSettings.bind(t);
		t.settingsCloseButton.addEventListener('click', t.settingsCloseButtonClickHandler);

		// Accordion Help - Cookie configuration
		t.accordionHandler = [];
		for (let i = 0; i < t.accordionItems.length; i++) {
			let s = t.accordionItems[i];
			t.accordionHandler[i] = t.toogleAccordion.bind(t,s);
			s.addEventListener('click', t.accordionHandler[i]);
		}

		// Settings Confirm Choices
		t.settingsConfirmButtonClickHandler = t.confirmChoices.bind(t);
		t.settingsConfirmButton.addEventListener('click', t.settingsConfirmButtonClickHandler);
	}

	// #############
	// #  Cookies  #
	// #############

	// Não abre a caixa de dialogo se o usuário já decidiu
	if (getCookie("uabiShowDialog") == 'false') {
		t.closeDialog();
	}

	// Show log in console if enabled
	if (t.opt.consoleLog) t.logCookies();
}

// ############
// #   Exit   #
// ############
uabiConsent.prototype.exit = function() {
	// Limpa o objeto preparando para uma nova inicilização com diferentes opções
	const t = this;
	// Remove the dialog and all the events associated
	t.container.parentNode.removeChild(t.container);
}

// ##############
// #   Reload   #
// ##############
uabiConsent.prototype.reload = function() {
	const t = this;
	t.exit();
	t.init();
}

// ############
// #   Load   #
// ############
// myUabiConsentObjects = new uabiConsent({});
