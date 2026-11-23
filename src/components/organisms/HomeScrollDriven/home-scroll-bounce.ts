import '../../../lib/scroll-motion/phone-bounce';
import { isIPhoneSafari } from '../../../lib/scroll-motion/iphone-safari';

const iphoneSafari = isIPhoneSafari(navigator.userAgent);

for (const track of document.querySelectorAll('.home-scroll__track--animated')) {
	track.toggleAttribute('data-iphone-safari', iphoneSafari);
}
