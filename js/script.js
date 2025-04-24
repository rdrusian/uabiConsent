// ###################
// #   Window Load   #
// ###################
window.addEventListener('load', function() { });

// #####################
// #  Cookie Consent   #
// #####################
myUabiConsent = new uabiConsent({
	name: 'uabiConsent-',
	lang: 'en',
	initialConsent: 'denied',
	expire: 365,
	privacyPolicyUrl: 'https://telazul.drusian.com.br/pt/artigo/politica-de-privacidade',
	showDecline: true,
	showSettings: true,
	consoleLog: true
});
