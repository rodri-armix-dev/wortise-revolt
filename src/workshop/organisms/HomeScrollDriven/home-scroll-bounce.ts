import '../../lib/phone-bounce';
import { isIPhoneSafari } from '../../lib/iphone-safari';

const iphoneSafari = isIPhoneSafari(navigator.userAgent);

for (const track of document.querySelectorAll('.home-scroll__track--animated')) {
	track.toggleAttribute('data-iphone-safari', iphoneSafari);
}
