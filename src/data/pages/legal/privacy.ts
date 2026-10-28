import type { Locale } from '../../../i18n/config';
import type { LegalPageData } from '../page.types';

export const privacyPageData = {
	es: {
		key: 'privacy',
		slug: 'privacidad',
		template: 'legal',
		meta: {
			title: 'Política de privacidad | Wortise',
			description: 'Cómo Wortise recopila, utiliza y comparte información personal en sus servicios y plataforma de marketing.',
		},
		content: {
			eyebrow: 'Legal',
			title: 'Política de privacidad',
			updatedAt: '2024-03-18',
			effectiveAt: '2018-07-02',
			html: `
<h2>1. INTRODUCCIÓN</h2>
<p>Wortise es una empresa de monetización de aplicaciones móviles que opera una solución de plataforma de marketing que proporciona servicios y productos de publicidad y monetización a profesionales del marketing y publishers.</p>
<hr>
<h2>2. ALCANCE DE ESTA POLÍTICA DE PRIVACIDAD</h2>
<h3>2.1. APLICACIÓN</h3>
<p>Esta Política de Privacidad explica cómo Wortise recopila, utiliza y comparte información de las personas que interactúan con sus servicios, ofertas o plataformas que integran su Plataforma de Marketing («Servicios de la Plataforma de Marketing») y con su sitio web, respectivamente. «Wortise» significa Bee Holding SAS, sus subsidiarias y empresas afiliadas. Wortise es el responsable del tratamiento de la información personal procesada, salvo que se indique lo contrario.</p>
<h3>2.2. EXCLUSIONES</h3>
<p>Wortise puede ofrecer a los consumidores aplicaciones móviles independientes, servicios de contenido web y funciones de software a través de dispositivos inteligentes, que pueden estar preinstalados en los dispositivos, ser descargables, estar alojados en la web o ponerse a disposición a través de otros medios digitales («Ofertas para Consumidores»). Esta Política de Privacidad no se aplica a las prácticas de recopilación o tratamiento de datos de cada uno de los servicios anteriores, respectivamente. Si usted es consumidor de alguna de estas Ofertas para Consumidores, la política de privacidad aplicable debería estar disponible a través de dichos servicios. Consulte las respectivas políticas de privacidad de cada Oferta para Consumidores para conocer sus prácticas de recopilación y uso de datos.</p>
<p>En la medida en que las Ofertas para Consumidores anteriores promuevan publicidad basada en intereses utilizando los Servicios de la Plataforma de Marketing, los términos de esta política se aplicarán a las prácticas de tratamiento de datos de dichos Servicios de la Plataforma de Marketing.</p>
<p>Los Servicios de la Plataforma de Marketing y las Ofertas para Consumidores se denominan conjuntamente «Servicios».</p>
<hr>
<h2>3. SERVICIOS DE LA PLATAFORMA DE MARKETING DE Wortise</h2>
<p>Wortise se encarga de publicar anuncios en las propiedades digitales de publishers de sitios y aplicaciones de terceros y de desarrolladores de aplicaciones, en nombre de sus socios publicitarios del lado de la demanda, a través de diversos canales de soluciones publicitarias, incluidos exchanges, redes, canales externos a las redes, etc. Wortise también puede publicar anuncios en las Ofertas para Consumidores. Wortise también realiza planificación de campañas, medición —por ejemplo, si un anuncio se ha visto y su marca de tiempo— y atribución de anuncios, por sí misma o a través de socios externos de medición.</p>
<p>Wortise proporciona Servicios de la Plataforma de Marketing, incluida la optimización de campañas publicitarias, el análisis y enriquecimiento de datos, la creación de segmentos y la adquisición o reactivación de usuarios a través de diversos canales de publicidad digital. Wortise recibe datos en su Plataforma de Marketing desde diversas fuentes, incluida la información de usuarios finales recopilada por nuestros sistemas, aplicaciones u ofertas, socios, proveedores de datos o cookies, o clientes («Fuentes»), que pueden incluir aplicaciones, sitios y servicios de terceros que usted utiliza. Consulte las políticas de privacidad de las aplicaciones, sitios y servicios que utiliza para comprender cómo recopilan, utilizan y comparten datos de sus interacciones con ellos. Wortise no es responsable de cómo dichas aplicaciones, sitios y servicios de terceros recopilan y utilizan los datos.</p>
<hr>
<h2>4. ¿QUÉ INFORMACIÓN PERSONAL RECOPILAMOS?</h2>
<p>Cuando ve un anuncio distribuido a través de Wortise en un sitio, una aplicación u otro medio digital, podemos recopilar información sobre su dispositivo y su interacción con el anuncio. Esta información nos permite mostrarle anuncios y mejorar nuestros Servicios, incluido el reconocimiento de su dispositivo cuando utiliza otros sitios y aplicaciones que se han asociado con nosotros. Wortise también puede recopilar información sobre usted cuando decide interactuar con nuestras encuestas o aplicaciones basadas en opiniones. La información que podemos recopilar incluye:</p>
<p>(a) Identificadores del dispositivo. Los identificadores del dispositivo son cadenas alfanuméricas únicas para su dispositivo. Estos incluyen:</p>
<p>ID de publicidad de Google (GAID) o ID de Android para dispositivos Android</p>
<p>Identificador de publicidad en plataformas OTT y CTV</p>
<p>ID de cookies</p>
<p>(b) Información de ubicación, incluida:</p>
<p>Geolocalización o ubicación precisa de su dispositivo si ha autorizado a la aplicación o al sitio a recopilar su información de ubicación</p>
<p>Información de ubicación que inferimos a partir de los datos recopilados mediante un identificador de la red WiFi a la que está conectado su dispositivo, de conformidad con la legislación aplicable y siempre que esté permitido el acceso a la ubicación</p>
<p>Información de ubicación que inferimos de la dirección IP de su dispositivo, con un nivel de precisión que no será superior al de una ciudad, salvo que haya autorizado a la aplicación o al sitio a recopilar su información de ubicación</p>
<p>(c) Información de la red, incluida:</p>
<p>Operador de telefonía móvil</p>
<p>Proveedor de red o de servicios de Internet (ISP)</p>
<p>Tipo de red, por ejemplo, WiFi o red móvil</p>
<p>Dirección IP</p>
<p>Identificadores de los puntos de acceso WiFi a los que está conectado su dispositivo</p>
<p>Fecha y hora de conexión</p>
<p>(d) Información sobre aplicaciones o sitios y nuestro kit de desarrollo de software (SDK), incluida:</p>
<p>Nombre o versión de la aplicación o el sitio</p>
<p>Identificador de la aplicación</p>
<p>Versión del SDK</p>
<p>Identificador de la clave de API</p>
<p>Otra información sobre su dispositivo o contenida en él, incluida:</p>
<p>Tipo de dispositivo, por ejemplo, marca y modelo</p>
<p>Hora de inicio y hora de actualización del dispositivo</p>
<p>Nombre del dispositivo</p>
<p>Tamaño de la pantalla</p>
<p>Capacidad de memoria y del disco duro</p>
<p>Sistema operativo y versión, por ejemplo, iOS 14, Android, Windows o Blackberry</p>
<p>Navegador móvil utilizado, por ejemplo, Chrome, Safari o Firefox</p>
<p>Configuración de idioma, incluido el código de país, y zona horaria</p>
<p>Uso de aplicaciones</p>
<p>Información publicitaria. Recopilamos información sobre el anuncio presentado en su dispositivo, incluida:</p>
<p>El tipo de contenido del anuncio: el anunciante y la categoría, por ejemplo, juegos, finanzas, entretenimiento o noticias</p>
<p>El tipo de anuncio, por ejemplo, si es texto, imagen, video u otro formato</p>
<p>Dónde se publica el anuncio, por ejemplo, el sitio, medio digital o aplicación en el que aparece</p>
<p>Si vio el anuncio, hizo clic en él o interactuó con él de otra manera</p>
<p>Otra información de marketing:</p>
<p>En el contexto de nuestros Servicios de la Plataforma de Marketing, nuestros clientes, socios o proveedores también pueden revelarnos determinada información personal o no personal que hayan recopilado por separado sobre usted durante su interacción con sus aplicaciones, sitios o servicios, para que podamos prestar eficazmente nuestros Servicios. Esto puede ocurrir en el contexto de sitios web, incluidos los sitios web móviles, cookies, otras tecnologías u otras características agregadas u otros identificadores relacionados con su dispositivo, para comprender su interacción con dicho sitio y mostrar determinados tipos de anuncios relevantes para sus intereses.</p>
<p>Estas partes le proporcionan cookies de conformidad con sus propias políticas específicas de privacidad y cookies, y sujetas a sus propios requisitos legales aplicables. No utilizamos la información que nos proporcionan para ninguna finalidad distinta de las permitidas por dichos terceros o de la prestación o mejora de nuestros Servicios.</p>
<p>No recopilamos datos sensibles, como el origen racial o étnico, las opiniones políticas, las creencias religiosas o filosóficas, los datos genéticos, los datos biométricos o los datos relativos a la salud. Podemos mostrar anuncios dirigidos a personas interesadas en la actividad física.</p>
<hr>
<h2>5. ¿CÓMO UTILIZAMOS SU INFORMACIÓN PERSONAL?</h2>
<p>Utilizamos la información que recopilamos sobre su dispositivo para lo siguiente:</p>
<p>Mostrar anuncios en su dispositivo, que pueden incluir publicidad basada en intereses personalizada según sus intereses, preferencias y ubicaciones</p>
<p>Participar en pujas para publicar anuncios y determinar qué anuncios son más eficaces</p>
<p>Analizar y proporcionar a nuestros socios del lado de la demanda o anunciantes informes sobre la eficacia de los anuncios y las campañas, incluso entre distintos tipos de dispositivos, basándonos en nuestra identificación de dispositivos relacionados con una misma persona. Nosotros, o los terceros con quienes prestamos este servicio, podemos utilizar datos entre dispositivos para proporcionar servicios de publicidad basada en intereses y mostrar anuncios personalizados a los usuarios en múltiples dispositivos móviles, incluidas las aplicaciones OTT y los televisores inteligentes</p>
<p>Evitar mostrarle los mismos anuncios demasiadas veces</p>
<p>Crear segmentos de audiencia personalizados para permitir que nuestros clientes y socios orienten mejor sus anuncios y ofertas</p>
<p>Mejorar nuestros Servicios y ayudar a nuestros clientes y socios a mejorar sus productos y servicios</p>
<p>Detectar, disuadir y prevenir el fraude y el tráfico fraudulento, o proteger y asegurar nuestros sistemas</p>
<p>Podemos procesar sus respuestas a encuestas y compartir los datos de las respuestas con las marcas que son nuestros clientes o anunciantes</p>
<hr>
<h2>6. ¿CON QUIÉN COMPARTIMOS SU INFORMACIÓN PERSONAL?</h2>
<p>Wortise puede compartir la información que recopilamos o recibimos sobre usted, según lo descrito en esta Política, de la siguiente manera:</p>
<p>Publishers y socios de oferta. Podemos compartir su información con publishers —la aplicación— para ayudarlos a comprender cómo interactúan los usuarios con sus aplicaciones, sitios y con los anuncios de sus aplicaciones y sitios</p>
<p>Socios de demanda y anunciantes. Podemos compartir su información con socios de demanda, marcas y anunciantes que utilizan nuestra Plataforma de Marketing para permitirles comprender el rendimiento de sus campañas y ayudarlos a orientar mejor sus campañas, productos u ofertas</p>
<p>Socios de marketing. Podemos compartir su información con socios de datos que nos ayudan a comprender mejor sus preferencias mediante servicios de enriquecimiento de datos, análisis e identificación, así como con empresas de medición que nos ayudan con la atribución y el seguimiento de anuncios distribuidos a través de nosotros («Socios de Marketing»)</p>
<p>Proveedores de servicios. Podemos compartir la información personal que recopilamos sobre usted con nuestros proveedores de servicios externos. Las categorías de proveedores de servicios a quienes confiamos información personal incluyen: servicios de TI y relacionados; detección de fraude, información y servicios; procesadores de pagos; proveedores de atención al cliente; y proveedores que apoyan la prestación de los Servicios</p>
<p>Divulgaciones para protegernos a nosotros o a otras personas. Podemos acceder, conservar y divulgar a terceros cualquier información que almacenemos asociada a usted si creemos de buena fe que hacerlo es necesario o apropiado para: cumplir con solicitudes de las fuerzas del orden o de seguridad nacional y con procedimientos legales, como una orden judicial o una citación; proteger sus derechos, bienes o seguridad, los nuestros o los de otras personas; hacer cumplir nuestras políticas o contratos; cobrar importes que se nos adeuden; o colaborar con la investigación o el enjuiciamiento de actividades ilegales presuntas o reales</p>
<p>Divulgaciones en caso de fusión, venta u otras transferencias de activos. Si participamos en una fusión, adquisición, proceso de diligencia debida para financiación, reorganización, quiebra, administración judicial, compra o venta de activos, o transición del servicio a otro proveedor, su información podrá venderse o transferirse como parte de dicha operación, en la medida permitida por la ley y/o el contrato</p>
<hr>
<h2>7. ¿CÓMO MANTENEMOS SEGURA LA INFORMACIÓN PERSONAL?</h2>
<p>Wortise adopta medidas técnicas y organizativas razonables para proteger la información que recopila sobre usted, en cumplimiento de sus requisitos legales y de privacidad y de sus obligaciones contractuales. También procuramos obtener de nuestros socios una protección contractual adecuada respecto de la recopilación, el uso o el tratamiento de los datos de los usuarios. Lamentablemente, ningún sistema es 100% seguro y no podemos asegurar ni garantizar la seguridad de la información que nos proporcione. En la máxima medida permitida por la legislación aplicable, no aceptamos responsabilidad por la divulgación no autorizada.</p>
<p>Al utilizar nuestros Servicios o proporcionarnos información personal, acepta que podamos comunicarnos con usted electrónicamente sobre cuestiones de seguridad, privacidad y administración relacionadas con su uso de nuestros Servicios. Si tenemos conocimiento de una vulneración de la seguridad de un sistema, podemos intentar notificárselo electrónicamente mediante la publicación de un aviso en nuestros Servicios, por correo postal o enviándole un correo electrónico.</p>
<hr>
<h2>8. ¿DURANTE CUÁNTO TIEMPO CONSERVAMOS SU INFORMACIÓN?</h2>
<p>Wortise conserva la información recopilada en el contexto de nuestra Plataforma de Marketing durante un período de hasta tres (3) meses, salvo que la ley o un contrato aplicable exijan lo contrario.</p>
<p>Wortise puede conservar la información que obtiene sobre usted de acuerdo con las instrucciones de los clientes o socios que proporcionan dicha información, o según sea necesario para cumplir con nuestras obligaciones contractuales. Si usted proporciona información al participar en una encuesta o aplicación de Wortise basada en opiniones, solo conservaremos sus datos personales durante el tiempo necesario para cumplir las finalidades para las que los recopilamos.</p>
<p>Tras el período de conservación aplicable, Wortise solo conservará y podrá utilizar sus datos: (i) de forma agregada o anonimizada; (ii) para cumplir con sus obligaciones legales; y (iii) para resolver controversias y hacer cumplir los acuerdos. Tenga en cuenta que los usos indicados en esta disposición se aplicarán como excepción a sus solicitudes relacionadas con los derechos del interesado o del consumidor.</p>
<hr>
<h2>9. EXCLUSIÓN DE LOS ANUNCIOS BASADOS EN INTERESES</h2>
<p>Exclusión de la publicidad basada en intereses: si prefiere no recibir publicidad de Wortise basada en intereses, puede optar por excluirse en cualquier momento visitando la página de exclusión de Wortise y enviando el identificador de su dispositivo o cualquier otro identificador indicado. Si opta por excluirse de la publicidad basada en intereses, seguirá recibiendo anuncios «genéricos» de Wortise. Para excluirse de nuestra segmentación publicitaria entre dispositivos, deberá hacerlo en cada navegador y dispositivo mediante los métodos de exclusión correspondientes.</p>
<p>En su dispositivo, visite la configuración de privacidad del sistema operativo (SO). Seleccione Limitar seguimiento de anuncios para dispositivos iOS/tvOS, Inhabilitar anuncios basados en intereses para dispositivos Android, Limitar seguimiento de anuncios para dispositivos Roku, o una configuración similar que ofrezca su SO. Consulte la política de privacidad del fabricante de su dispositivo para obtener más información.</p>
<hr>
<h2>10. DERECHOS DE PRIVACIDAD</h2>
<p>Wortise proporciona a los consumidores los derechos del interesado o del consumidor cuando y en la medida en que lo exijan las leyes aplicables.</p>
<p>Reglamento General de Protección de Datos (RGPD): si usted es un interesado del EEE, consulte nuestra Política de Privacidad para el EEE en <a href="https://www.Wortise.com/privacy-policy-for-eea/">https://www.Wortise.com/privacy-policy-for-eea/</a> para conocer sus derechos como interesado en virtud del RGPD.</p>
<p>California: la Ley de Privacidad del Consumidor de California de 2018 («CCPA») otorga a los residentes de California el derecho a saber qué categorías de información personal ha recopilado Wortise sobre ellos y si Wortise divulgó esa información personal con una finalidad comercial, por ejemplo, a un proveedor de servicios, durante los 12 meses anteriores. Las categorías de fuentes de las que recopilamos información personal y nuestras finalidades empresariales y comerciales para utilizarla se establecen, respectivamente, en las secciones anteriores «4. ¿QUÉ INFORMACIÓN RECOPILAMOS?» y «5. ¿CÓMO UTILIZAMOS SU INFORMACIÓN?». Las categorías de terceros con los que podemos compartir su información se enumeran en la sección anterior «6. ¿CON QUIÉN COMPARTIMOS SU INFORMACIÓN?».</p>
<p>Los residentes de California tienen derecho a optar por excluirse de la «venta» de su información personal. En virtud de la CCPA, «venta» se define de forma amplia e incluye la transferencia de información personal por parte de una empresa a un tercero a cambio de una contraprestación de valor, incluso si no se intercambia dinero. Puede considerarse que Wortise «vende» información personal. Las categorías de información personal que hemos «vendido» y las categorías de terceros a quienes hemos «vendido» información personal durante los doce meses anteriores se enumeran en la sección anterior «6. ¿CON QUIÉN COMPARTIMOS SU INFORMACIÓN?».</p>
<p>Los residentes del estado de California, en Estados Unidos, tienen los siguientes derechos de privacidad adicionales:</p>
<p>• Tiene derecho a ejercer determinados derechos del consumidor, como solicitar conocer, divulgar, acceder o eliminar sus datos recopilados durante los últimos 12 meses, escribiéndonos a <a href="mailto:privacy@wortise.com">privacy@wortise.com</a>.</p>
<p>• Tiene derecho a optar por excluirse de la venta de sus datos haciendo clic en el siguiente enlace: No vender mis datos.</p>
<p>No discriminación. Los residentes de California tienen derecho a no recibir un trato discriminatorio por nuestra parte por ejercer los derechos que les confiere la CCPA.</p>
<p>Agente autorizado. Solo usted, o una persona legalmente autorizada para actuar en su nombre, podrá realizar una solicitud verificable del consumidor relacionada con su información personal. También podrá realizar una solicitud verificable del consumidor en nombre de su hijo menor de edad. Para designar a un agente autorizado, póngase en contacto con nosotros según se establece en la sección «17. CONTACTO» a continuación y proporcione una autorización escrita firmada por usted y por el agente designado.</p>
<p>Verificación. Para proteger su privacidad, tomaremos las siguientes medidas para verificar su identidad antes de atender su solicitud. Cuando realice una solicitud, le pediremos que proporcione información suficiente que nos permita verificar razonablemente que usted es la persona sobre la que hemos recopilado información personal o un representante autorizado, lo que puede incluir información sobre su dispositivo.</p>
<p>Nevada. Si usted es residente de Nevada, tiene derecho a optar por excluirse de la venta de determinada Información Personal a terceros que pretendan licenciarla o venderla. Puede ejercer este derecho escribiéndonos a <a href="mailto:privacy@wortise.com">privacy@wortise.com</a> con el asunto «Nevada Do Not Sell Request» y proporcionándonos su nombre y la dirección de correo electrónico asociada a su cuenta.</p>
<p>Las leyes de privacidad de su país pueden otorgarle los siguientes derechos de privacidad adicionales en relación con su información personal: derecho de acceso, solicitud de rectificación, solicitud de eliminación, anonimización o bloqueo, limitación u oposición al tratamiento, retirada del consentimiento, solicitud de portabilidad de los datos, información sobre los terceros con quienes se han compartido sus datos y solicitud de revisión de decisiones tomadas exclusivamente sobre la base del tratamiento automatizado. Para ejercer estos derechos, escríbanos a <a href="mailto:privacy@wortise.com">privacy@wortise.com</a>.</p>
<hr>
<h2>11. TRANSFERENCIAS INTERNACIONALES</h2>
<p>Wortise puede compartir su información con clientes, compradores, socios, afiliadas y otros terceros descritos anteriormente que se encuentren en países distintos de su país de residencia; por ejemplo, si reside en el EEE, podemos compartir su información con nuestros clientes o afiliadas de fuera del EEE, sujeto a los requisitos contractuales o legales aplicables. Usted acepta que toda la información que procesamos pueda transferirse, tratarse y almacenarse en cualquier lugar del mundo.</p>
<p>Aunque algunos países pueden no contar con leyes de protección de datos equivalentes a las del país en el que reside, tomaremos medidas razonables para proteger su información de conformidad con esta Política de Privacidad.</p>
<hr>
<h2>12. CAMPAÑAS DE GENERACIÓN DE CONTACTOS</h2>
<p>Wortise puede ofrecer a los profesionales del marketing soluciones publicitarias basadas en formularios que incluyan la recopilación de información que usted proporcione voluntariamente como parte de un anuncio que contenga un cuestionario. Dicha información puede consistir en datos personales, información o datos no personales, o ambos. Toda la información que proporcione voluntariamente en respuesta a dicho formulario o cuestionario suele enviarse directamente a los servidores del anunciante correspondiente o a su página de destino y, en esos casos, se regirá por las políticas de privacidad de dicho anunciante vigentes en el momento de la transferencia.</p>
<p>En caso de que Wortise trate directamente datos personales, usted reconoce que Wortise puede estar obligada a almacenar dicha información durante el período en que continúe gestionando la campaña de generación de contactos correspondiente para el anunciante en cuyo nombre se recopila la información. Wortise puede almacenar temporalmente esta información únicamente para ejecutar dichas campañas basadas en formularios y la utilizará solo con el fin de optimizarlas, con sujeción a los requisitos legales de privacidad y contractuales aplicables. Wortise ha implementado salvaguardas internas para proteger el almacenamiento temporal de esta información y adopta medidas técnicas y organizativas razonables para protegerla. Wortise dispone de mecanismos para eliminar o anonimizar los datos personales una vez concluida dicha campaña o dentro de un período de treinta (30) días. Tras la conclusión de la campaña correspondiente, Wortise podrá conservar y utilizar su Información únicamente en la medida necesaria para elaborar informes para su cliente, cumplir con sus obligaciones legales, resolver controversias y hacer cumplir los acuerdos, y para ninguna otra finalidad. La información o los datos no personales que usted proporcione podrán utilizarse para mejorar nuestros Servicios.</p>
<p>Si tiene preguntas sobre las campañas de generación de contactos de Wortise, póngase en contacto con nosotros en <a href="mailto:privacy@wortise.com">privacy@wortise.com</a>. Wortise remitirá cualquier consulta o reclamación al anunciante correspondiente responsable del tratamiento de los datos proporcionados como parte de las campañas de generación de contactos.</p>
<hr>
<h2>13. COOKIES</h2>
<p>Utilizamos cookies y balizas para ayudarnos a recopilar parte de la información que hemos descrito anteriormente. Esto puede ocurrir cuando interactúa con nosotros o con nuestros socios externos, que permiten a Wortise recopilar datos relacionados con su interacción con sus aplicaciones o sitios con el fin de mostrarle anuncios relevantes y/o mejorar nuestros servicios. También podemos utilizar cookies en nuestros sitios web y en los de nuestros anunciantes para proporcionarle, respectivamente, funcionalidad del sitio web y publicidad, y para evitar que tenga que volver a proporcionar la información que ya nos ha facilitado en visitas posteriores a nuestro sitio.</p>
<hr>
<h2>14. PRIVACIDAD DE LOS MENORES</h2>
<p>No recopilamos a sabiendas información personal de menores de 16 años a través de los Servicios Publicitarios y del Sitio.</p>
<hr>
<h2>15. OTROS SITIOS WEB</h2>
<p>Nuestro sitio web y los anuncios que publicamos pueden contener enlaces a otros sitios web. Debe tener en cuenta que no somos responsables de las prácticas de privacidad de dichos sitios web, ya que pueden tener políticas de privacidad y condiciones de uso diferentes y no están asociados con nosotros. Usted reconoce que no podemos controlar esos enlaces y que no seremos responsables de ningún uso de dichos sitios web.</p>
<hr>
<h2>16. CAMBIOS EN ESTA POLÍTICA DE PRIVACIDAD</h2>
<p>Podemos modificar esta Política de Privacidad en cualquier momento. La Política de Privacidad modificada se mostrará en nuestro sitio. Si realizamos cambios sustanciales, se lo notificaremos mediante un aviso en este sitio antes de que el cambio entre en vigor. Consulte nuestra Política de Privacidad con regularidad para asegurarse de haber leído la última versión.</p>
<hr>
<h2>16. CONTACTO</h2>
<p>Si tiene preguntas sobre esta Política de Privacidad, póngase en contacto con nosotros en <a href="mailto:privacy@wortise.com">privacy@wortise.com</a>.</p>`,
		},
	},
	en: {
		key: 'privacy',
		slug: 'privacy-policy',
		template: 'legal',
		meta: {
			title: 'Privacy Policy | Wortise',
			description: 'How Wortise collects, uses and shares personal information in its services and marketing platform.',
		},
		content: {
			eyebrow: 'Legal',
			title: 'Privacy Policy',
			updatedAt: '2024-03-18',
			effectiveAt: '2018-07-02',
			html: `
<h2>1. INTRODUCTION</h2>
<p>Wortise is a mobile application monetization company operating a marketing platform solution that provides advertising and monetization services and products to marketers and publishers.</p>
<hr>
<h2>2. SCOPE OF THIS PRIVACY POLICY</h2>
<h3>2.1. APPLICATION</h3>
<p>This Privacy Policy explains how Wortise collects, uses and shares information from individuals who interact with its services, offerings or platforms that comprise its Marketing Platform (“Marketing Platform Services”) and with its website, respectively. “Wortise” means Bee Holding SAS, its subsidiaries and affiliated companies. Wortise is the controller of the personal information processed, unless otherwise stated.</p>
<h3>2.2. EXCLUSIONS</h3>
<p>Wortise may offer consumers standalone mobile applications, web content services and software features through smart devices, which may be preinstalled on devices, downloadable, web-hosted or made available through other digital means (“Consumer Offerings”). This Privacy Policy does not apply to the data collection or processing practices of each of the above services, respectively. If you are a consumer of any of these Consumer Offerings, the applicable privacy policy should be available through those services. Please refer to each Consumer Offering’s respective privacy policy for its data collection and use practices.</p>
<p>To the extent that the above Consumer Offerings promote interest-based advertising using the Marketing Platform Services, the terms of this policy will apply to the data processing practices of those Marketing Platform Services.</p>
<p>The Marketing Platform Services and Consumer Offerings are collectively referred to as “Services.”</p>
<hr>
<h2>3. Wortise MARKETING PLATFORM SERVICES</h2>
<p>Wortise serves advertisements on the digital properties of third-party site and application publishers and application developers, on behalf of its demand-side advertising partners, through various advertising solution channels, including exchanges, networks, off-network channels, etc. Wortise may also serve advertisements in the Consumer Offerings. Wortise also performs campaign planning, measurement—for example, whether an advertisement has been viewed and its timestamp—and ad attribution, either itself or through third-party measurement partners.</p>
<p>Wortise provides Marketing Platform Services, including advertising campaign optimization, data analysis and enrichment, segment creation, and user acquisition or reactivation through various digital advertising channels. Wortise receives data into its Marketing Platform from various sources, including end-user information collected by our systems, applications or offerings, partners, data or cookie providers, or clients (“Sources”), which may include third-party applications, sites and services you use. Please review the privacy policies of the applications, sites and services you use to understand how they collect, use and share data from your interactions with them. Wortise is not responsible for how such third-party applications, sites and services collect and use data.</p>
<hr>
<h2>4. WHAT PERSONAL INFORMATION DO WE COLLECT?</h2>
<p>When you view an advertisement distributed through Wortise on a site, application or other digital medium, we may collect information about your device and your interaction with the advertisement. This information enables us to show you advertisements and improve our Services, including recognizing your device when you use other sites and applications that have partnered with us. Wortise may also collect information about you when you choose to interact with our surveys or opinion-based applications. The information we may collect includes:</p>
<p>(a) Device identifiers. Device identifiers are alphanumeric strings unique to your device. These include:</p>
<p>Google advertising ID (GAID) or Android ID for Android devices</p>
<p>Advertising identifier on OTT and CTV platforms</p>
<p>Cookie IDs</p>
<p>(b) Location information, including:</p>
<p>Geolocation or precise location of your device if you have authorized the application or site to collect your location information</p>
<p>Location information we infer from data collected through an identifier of the WiFi network to which your device is connected, in accordance with applicable law and provided location access is permitted</p>
<p>Location information we infer from your device’s IP address, with accuracy no greater than city level, unless you have authorized the application or site to collect your location information</p>
<p>(c) Network information, including:</p>
<p>Mobile carrier</p>
<p>Network or Internet service provider (ISP)</p>
<p>Network type, for example, WiFi or mobile network</p>
<p>IP address</p>
<p>Identifiers of WiFi access points to which your device is connected</p>
<p>Connection date and time</p>
<p>(d) Information about applications or sites and our software development kit (SDK), including:</p>
<p>Application or site name or version</p>
<p>Application identifier</p>
<p>SDK version</p>
<p>API key identifier</p>
<p>Other information about or contained on your device, including:</p>
<p>Device type, for example, make and model</p>
<p>Device startup time and update time</p>
<p>Device name</p>
<p>Screen size</p>
<p>Memory and hard drive capacity</p>
<p>Operating system and version, for example, iOS 14, Android, Windows or Blackberry</p>
<p>Mobile browser used, for example, Chrome, Safari or Firefox</p>
<p>Language settings, including country code, and time zone</p>
<p>Application usage</p>
<p>Advertising information. We collect information about the advertisement presented on your device, including:</p>
<p>The type of advertisement content: the advertiser and category, for example, games, finance, entertainment or news</p>
<p>The type of advertisement, for example, whether it is text, image, video or another format</p>
<p>Where the advertisement is served, for example, the site, digital medium or application in which it appears</p>
<p>Whether you viewed the advertisement, clicked on it or otherwise interacted with it</p>
<p>Other marketing information:</p>
<p>In the context of our Marketing Platform Services, our clients, partners or providers may also disclose to us certain personal or non-personal information they have separately collected about you during your interaction with their applications, sites or services, so that we can effectively provide our Services. This may occur in the context of websites, including mobile websites, cookies, other technologies or other aggregated characteristics or other identifiers relating to your device, to understand your interaction with that site and show certain types of advertisements relevant to your interests.</p>
<p>These parties provide you with cookies in accordance with their own specific privacy and cookie policies and subject to their own applicable legal requirements. We do not use the information they provide for any purpose other than those permitted by such third parties or the provision or improvement of our Services.</p>
<p>We do not collect sensitive data, such as racial or ethnic origin, political opinions, religious or philosophical beliefs, genetic data, biometric data or health-related data. We may display advertisements targeted at people interested in physical activity.</p>
<hr>
<h2>5. HOW DO WE USE YOUR PERSONAL INFORMATION?</h2>
<p>We use the information we collect about your device for the following:</p>
<p>Displaying advertisements on your device, which may include interest-based advertising personalized to your interests, preferences and locations</p>
<p>Participating in bids to serve advertisements and determining which advertisements are most effective</p>
<p>Analyzing and providing our demand-side partners or advertisers with reports on the effectiveness of advertisements and campaigns, including across different device types, based on our identification of devices related to the same person. We, or the third parties with whom we provide this service, may use cross-device data to provide interest-based advertising services and show personalized advertisements to users on multiple mobile devices, including OTT applications and smart TVs</p>
<p>Avoiding showing you the same advertisements too many times</p>
<p>Creating custom audience segments to enable our clients and partners to better target their advertisements and offers</p>
<p>Improving our Services and helping our clients and partners improve their products and services</p>
<p>Detecting, deterring and preventing fraud and fraudulent traffic, or protecting and securing our systems</p>
<p>We may process your survey responses and share response data with brands that are our clients or advertisers</p>
<hr>
<h2>6. WITH WHOM DO WE SHARE YOUR PERSONAL INFORMATION?</h2>
<p>Wortise may share the information we collect or receive about you as described in this Policy as follows:</p>
<p>Publishers and supply partners. We may share your information with publishers—the application—to help them understand how users interact with their applications, sites and the advertisements in their applications and sites</p>
<p>Demand partners and advertisers. We may share your information with demand partners, brands and advertisers that use our Marketing Platform to enable them to understand their campaign performance and help them better target their campaigns, products or offers</p>
<p>Marketing partners. We may share your information with data partners that help us better understand your preferences through data enrichment, analytics and identification services, as well as measurement companies that help us with attribution and tracking of advertisements distributed through us (“Marketing Partners”)</p>
<p>Service providers. We may share the personal information we collect about you with our third-party service providers. Categories of service providers to whom we entrust personal information include: IT and related services; fraud detection, information and services; payment processors; customer support providers; and providers supporting delivery of the Services</p>
<p>Disclosures to protect us or others. We may access, retain and disclose to third parties any information we store associated with you if we believe in good faith that doing so is necessary or appropriate to: comply with law enforcement or national security requests and legal proceedings, such as a court order or subpoena; protect your rights, property or safety, ours or those of others; enforce our policies or contracts; collect amounts owed to us; or assist in the investigation or prosecution of suspected or actual illegal activity</p>
<p>Disclosures in the event of merger, sale or other asset transfers. If we are involved in a merger, acquisition, financing due diligence process, reorganization, bankruptcy, receivership, purchase or sale of assets, or transition of service to another provider, your information may be sold or transferred as part of that transaction, to the extent permitted by law and/or contract</p>
<hr>
<h2>7. HOW DO WE KEEP PERSONAL INFORMATION SECURE?</h2>
<p>Wortise takes reasonable technical and organizational measures to protect the information it collects about you, in compliance with its legal and privacy requirements and contractual obligations. We also seek adequate contractual protection from our partners regarding the collection, use or processing of user data. Unfortunately, no system is 100% secure, and we cannot ensure or guarantee the security of information you provide to us. To the fullest extent permitted by applicable law, we accept no liability for unauthorized disclosure.</p>
<p>By using our Services or providing us with personal information, you agree that we may communicate with you electronically about security, privacy and administrative matters relating to your use of our Services. If we become aware of a system security breach, we may attempt to notify you electronically by posting a notice on our Services, by post or by sending you an email.</p>
<hr>
<h2>8. HOW LONG DO WE RETAIN YOUR INFORMATION?</h2>
<p>Wortise retains information collected in the context of our Marketing Platform for a period of up to three (3) months, unless otherwise required by law or an applicable contract.</p>
<p>Wortise may retain information it obtains about you in accordance with the instructions of the clients or partners providing that information, or as necessary to fulfill our contractual obligations. If you provide information by participating in a Wortise survey or opinion-based application, we will retain your personal data only for as long as necessary to fulfill the purposes for which we collected it.</p>
<p>After the applicable retention period, Wortise will retain and may use your data only: (i) in aggregated or anonymized form; (ii) to comply with its legal obligations; and (iii) to resolve disputes and enforce agreements. Please note that the uses specified in this provision will apply as an exception to your requests relating to data subject or consumer rights.</p>
<hr>
<h2>9. OPTING OUT OF INTEREST-BASED ADVERTISEMENTS</h2>
<p>Opting out of interest-based advertising: if you prefer not to receive interest-based advertising from Wortise, you may opt out at any time by visiting the Wortise opt-out page and submitting your device identifier or any other identifier indicated. If you opt out of interest-based advertising, you will continue to receive “generic” advertisements from Wortise. To opt out of our cross-device advertising targeting, you must do so on each browser and device using the relevant opt-out methods.</p>
<p>On your device, visit the operating system (OS) privacy settings. Select Limit Ad Tracking for iOS/tvOS devices, Opt out of Interest-Based Ads for Android devices, Limit Ad Tracking for Roku devices, or a similar setting offered by your OS. Please refer to your device manufacturer’s privacy policy for more information.</p>
<hr>
<h2>10. PRIVACY RIGHTS</h2>
<p>Wortise provides consumers with data subject or consumer rights when and to the extent required by applicable laws.</p>
<p>General Data Protection Regulation (GDPR): if you are an EEA data subject, please refer to our EEA Privacy Policy at <a href="https://www.Wortise.com/privacy-policy-for-eea/">https://www.Wortise.com/privacy-policy-for-eea/</a> for your rights as a data subject under the GDPR.</p>
<p>California: the California Consumer Privacy Act of 2018 (“CCPA”) gives California residents the right to know what categories of personal information Wortise has collected about them and whether Wortise disclosed that personal information for a business purpose, for example, to a service provider, during the preceding 12 months. The categories of sources from which we collect personal information and our business and commercial purposes for using it are set out, respectively, in the preceding sections “4. WHAT INFORMATION DO WE COLLECT?” and “5. HOW DO WE USE YOUR INFORMATION?”. The categories of third parties with whom we may share your information are listed in the preceding section “6. WITH WHOM DO WE SHARE YOUR INFORMATION?”.</p>
<p>California residents have the right to opt out of the “sale” of their personal information. Under the CCPA, “sale” is broadly defined and includes the transfer of personal information by a business to a third party for valuable consideration, even if no money is exchanged. Wortise may be considered to “sell” personal information. The categories of personal information we have “sold” and the categories of third parties to whom we have “sold” personal information during the preceding twelve months are listed in the preceding section “6. WITH WHOM DO WE SHARE YOUR INFORMATION?”.</p>
<p>Residents of the state of California, United States, have the following additional privacy rights:</p>
<p>• You have the right to exercise certain consumer rights, such as requesting to know, disclose, access or delete your data collected during the last 12 months, by writing to us at <a href="mailto:privacy@wortise.com">privacy@wortise.com</a>.</p>
<p>• You have the right to opt out of the sale of your data by clicking the following link: Do Not Sell My Data.</p>
<p>Non-discrimination. California residents have the right not to receive discriminatory treatment from us for exercising the rights granted to them by the CCPA.</p>
<p>Authorized agent. Only you, or a person legally authorized to act on your behalf, may make a verifiable consumer request relating to your personal information. You may also make a verifiable consumer request on behalf of your minor child. To designate an authorized agent, please contact us as set out in section “17. CONTACT” below and provide a written authorization signed by you and the designated agent.</p>
<p>Verification. To protect your privacy, we will take the following steps to verify your identity before fulfilling your request. When you make a request, we will ask you to provide sufficient information to enable us to reasonably verify that you are the person about whom we collected personal information or an authorized representative, which may include information about your device.</p>
<p>Nevada. If you are a Nevada resident, you have the right to opt out of the sale of certain Personal Information to third parties that intend to license or sell it. You may exercise this right by writing to us at <a href="mailto:privacy@wortise.com">privacy@wortise.com</a> with the subject “Nevada Do Not Sell Request” and providing your name and the email address associated with your account.</p>
<p>Your country’s privacy laws may grant you the following additional privacy rights regarding your personal information: the right of access, a request for rectification, a request for deletion, anonymization or blocking, restriction of or objection to processing, withdrawal of consent, a request for data portability, information about the third parties with whom your data has been shared, and a request for review of decisions made solely on the basis of automated processing. To exercise these rights, please write to us at <a href="mailto:privacy@wortise.com">privacy@wortise.com</a>.</p>
<hr>
<h2>11. INTERNATIONAL TRANSFERS</h2>
<p>Wortise may share your information with clients, buyers, partners, affiliates and other third parties described above located in countries other than your country of residence; for example, if you reside in the EEA, we may share your information with our clients or affiliates outside the EEA, subject to applicable contractual or legal requirements. You agree that all information we process may be transferred, processed and stored anywhere in the world.</p>
<p>Although some countries may not have data protection laws equivalent to those of your country of residence, we will take reasonable steps to protect your information in accordance with this Privacy Policy.</p>
<hr>
<h2>12. LEAD GENERATION CAMPAIGNS</h2>
<p>Wortise may offer marketers form-based advertising solutions that include collecting information you voluntarily provide as part of an advertisement containing a questionnaire. Such information may consist of personal data, non-personal information or data, or both. All information you voluntarily provide in response to such a form or questionnaire is generally sent directly to the relevant advertiser’s servers or landing page and, in such cases, will be governed by that advertiser’s privacy policies in effect at the time of transfer.</p>
<p>If Wortise directly processes personal data, you acknowledge that Wortise may be required to store such information for the period during which it continues to manage the relevant lead generation campaign for the advertiser on whose behalf the information is collected. Wortise may temporarily store this information solely to run such form-based campaigns and will use it only to optimize them, subject to applicable privacy legal and contractual requirements. Wortise has implemented internal safeguards to protect the temporary storage of this information and takes reasonable technical and organizational measures to protect it. Wortise has mechanisms to delete or anonymize personal data once that campaign has ended or within a period of thirty (30) days. After the relevant campaign has ended, Wortise may retain and use your Information only to the extent necessary to prepare reports for its client, fulfill its legal obligations, resolve disputes and enforce agreements, and for no other purpose. The non-personal information or data you provide may be used to improve our Services.</p>
<p>If you have questions about Wortise’s lead generation campaigns, please contact us at <a href="mailto:privacy@wortise.com">privacy@wortise.com</a>. Wortise will refer any inquiry or complaint to the relevant advertiser responsible for processing the data provided as part of the lead generation campaigns.</p>
<hr>
<h2>13. COOKIES</h2>
<p>We use cookies and beacons to help us collect some of the information described above. This may occur when you interact with us or with our third-party partners, who allow Wortise to collect data relating to your interaction with their applications or sites to show you relevant advertisements and/or improve our services. We may also use cookies on our websites and those of our advertisers to provide you with website functionality and advertising, respectively, and to avoid requiring you to provide again information you have already supplied on subsequent visits to our site.</p>
<hr>
<h2>14. CHILDREN’S PRIVACY</h2>
<p>We do not knowingly collect personal information from children under 16 through the Advertising Services and the Site.</p>
<hr>
<h2>15. OTHER WEBSITES</h2>
<p>Our website and the advertisements we serve may contain links to other websites. Please be aware that we are not responsible for the privacy practices of those websites, as they may have different privacy policies and terms of use and are not associated with us. You acknowledge that we cannot control those links and that we will not be responsible for any use of those websites.</p>
<hr>
<h2>16. CHANGES TO THIS PRIVACY POLICY</h2>
<p>We may modify this Privacy Policy at any time. The modified Privacy Policy will be displayed on our site. If we make material changes, we will notify you by a notice on this site before the change takes effect. Please review our Privacy Policy regularly to ensure you have read the latest version.</p>
<hr>
<h2>16. CONTACT</h2>
<p>If you have questions about this Privacy Policy, please contact us at <a href="mailto:privacy@wortise.com">privacy@wortise.com</a>.</p>`,
		},
	},
	pt: {
		key: 'privacy',
		slug: 'politica-de-privacidade',
		template: 'legal',
		meta: {
			title: 'Política de privacidade | Wortise',
			description: 'Como a Wortise coleta, utiliza e compartilha informações pessoais em seus serviços e plataforma de marketing.',
		},
		content: {
			eyebrow: 'Legal',
			title: 'Política de privacidade',
			updatedAt: '2024-03-18',
			effectiveAt: '2018-07-02',
			html: `
<h2>1. INTRODUÇÃO</h2>
<p>A Wortise é uma empresa de monetização de aplicativos móveis que opera uma solução de plataforma de marketing que fornece serviços e produtos de publicidade e monetização a profissionais de marketing e publishers.</p>
<hr>
<h2>2. ESCOPO DESTA POLÍTICA DE PRIVACIDADE</h2>
<h3>2.1. APLICAÇÃO</h3>
<p>Esta Política de Privacidade explica como a Wortise coleta, utiliza e compartilha informações das pessoas que interagem com seus serviços, ofertas ou plataformas que integram sua Plataforma de Marketing (“Serviços da Plataforma de Marketing”) e com seu site, respectivamente. “Wortise” significa Bee Holding SAS, suas subsidiárias e empresas afiliadas. A Wortise é a controladora das informações pessoais tratadas, salvo indicação em contrário.</p>
<h3>2.2. EXCLUSÕES</h3>
<p>A Wortise pode oferecer aos consumidores aplicativos móveis independentes, serviços de conteúdo na web e funções de software por meio de dispositivos inteligentes, que podem estar pré-instalados nos dispositivos, ser baixáveis, estar hospedados na web ou ser disponibilizados por outros meios digitais (“Ofertas para Consumidores”). Esta Política de Privacidade não se aplica às práticas de coleta ou tratamento de dados de cada um dos serviços acima, respectivamente. Se você for consumidor de alguma dessas Ofertas para Consumidores, a política de privacidade aplicável deverá estar disponível por meio desses serviços. Consulte as respectivas políticas de privacidade de cada Oferta para Consumidores para conhecer suas práticas de coleta e uso de dados.</p>
<p>Na medida em que as Ofertas para Consumidores acima promovam publicidade baseada em interesses utilizando os Serviços da Plataforma de Marketing, os termos desta política se aplicarão às práticas de tratamento de dados desses Serviços da Plataforma de Marketing.</p>
<p>Os Serviços da Plataforma de Marketing e as Ofertas para Consumidores são denominados conjuntamente “Serviços”.</p>
<hr>
<h2>3. SERVIÇOS DA PLATAFORMA DE MARKETING DA Wortise</h2>
<p>A Wortise veicula anúncios nas propriedades digitais de publishers de sites e aplicativos de terceiros e de desenvolvedores de aplicativos, em nome de seus parceiros publicitários do lado da demanda, por meio de diversos canais de soluções publicitárias, incluindo exchanges, redes, canais externos às redes etc. A Wortise também pode veicular anúncios nas Ofertas para Consumidores. A Wortise também realiza planejamento de campanhas, medição — por exemplo, se um anúncio foi visualizado e seu registro de data e hora — e atribuição de anúncios, por conta própria ou por meio de parceiros externos de medição.</p>
<p>A Wortise fornece Serviços da Plataforma de Marketing, incluindo otimização de campanhas publicitárias, análise e enriquecimento de dados, criação de segmentos e aquisição ou reativação de usuários por diversos canais de publicidade digital. A Wortise recebe dados em sua Plataforma de Marketing de diversas fontes, incluindo informações de usuários finais coletadas por nossos sistemas, aplicativos ou ofertas, parceiros, fornecedores de dados ou cookies, ou clientes (“Fontes”), que podem incluir aplicativos, sites e serviços de terceiros que você utiliza. Consulte as políticas de privacidade dos aplicativos, sites e serviços que utiliza para compreender como coletam, utilizam e compartilham dados de suas interações com eles. A Wortise não é responsável pela forma como esses aplicativos, sites e serviços de terceiros coletam e utilizam os dados.</p>
<hr>
<h2>4. QUAIS INFORMAÇÕES PESSOAIS COLETAMOS?</h2>
<p>Quando você visualiza um anúncio distribuído por meio da Wortise em um site, aplicativo ou outro meio digital, podemos coletar informações sobre seu dispositivo e sua interação com o anúncio. Essas informações nos permitem exibir anúncios para você e melhorar nossos Serviços, incluindo o reconhecimento de seu dispositivo quando você utiliza outros sites e aplicativos parceiros. A Wortise também pode coletar informações sobre você quando decide interagir com nossas pesquisas ou aplicativos baseados em opiniões. As informações que podemos coletar incluem:</p>
<p>(a) Identificadores do dispositivo. Os identificadores do dispositivo são sequências alfanuméricas exclusivas de seu dispositivo. Eles incluem:</p>
<p>ID de publicidade do Google (GAID) ou ID do Android para dispositivos Android</p>
<p>Identificador de publicidade em plataformas OTT e CTV</p>
<p>IDs de cookies</p>
<p>(b) Informações de localização, incluindo:</p>
<p>Geolocalização ou localização precisa de seu dispositivo se você autorizou o aplicativo ou site a coletar suas informações de localização</p>
<p>Informações de localização que inferimos dos dados coletados por meio de um identificador da rede WiFi à qual seu dispositivo está conectado, de acordo com a legislação aplicável e desde que o acesso à localização seja permitido</p>
<p>Informações de localização que inferimos do endereço IP de seu dispositivo, com precisão não superior ao nível de uma cidade, salvo se você autorizou o aplicativo ou site a coletar suas informações de localização</p>
<p>(c) Informações da rede, incluindo:</p>
<p>Operadora de telefonia móvel</p>
<p>Provedor de rede ou de serviços de Internet (ISP)</p>
<p>Tipo de rede, por exemplo, WiFi ou rede móvel</p>
<p>Endereço IP</p>
<p>Identificadores dos pontos de acesso WiFi aos quais seu dispositivo está conectado</p>
<p>Data e hora da conexão</p>
<p>(d) Informações sobre aplicativos ou sites e nosso kit de desenvolvimento de software (SDK), incluindo:</p>
<p>Nome ou versão do aplicativo ou site</p>
<p>Identificador do aplicativo</p>
<p>Versão do SDK</p>
<p>Identificador da chave de API</p>
<p>Outras informações sobre seu dispositivo ou nele contidas, incluindo:</p>
<p>Tipo de dispositivo, por exemplo, marca e modelo</p>
<p>Hora de inicialização e hora de atualização do dispositivo</p>
<p>Nome do dispositivo</p>
<p>Tamanho da tela</p>
<p>Capacidade de memória e do disco rígido</p>
<p>Sistema operacional e versão, por exemplo, iOS 14, Android, Windows ou Blackberry</p>
<p>Navegador móvel utilizado, por exemplo, Chrome, Safari ou Firefox</p>
<p>Configurações de idioma, incluindo o código do país, e fuso horário</p>
<p>Uso de aplicativos</p>
<p>Informações publicitárias. Coletamos informações sobre o anúncio apresentado em seu dispositivo, incluindo:</p>
<p>O tipo de conteúdo do anúncio: o anunciante e a categoria, por exemplo, jogos, finanças, entretenimento ou notícias</p>
<p>O tipo de anúncio, por exemplo, se é texto, imagem, vídeo ou outro formato</p>
<p>Onde o anúncio é veiculado, por exemplo, o site, meio digital ou aplicativo em que aparece</p>
<p>Se você visualizou o anúncio, clicou nele ou interagiu com ele de outra forma</p>
<p>Outras informações de marketing:</p>
<p>No contexto de nossos Serviços da Plataforma de Marketing, nossos clientes, parceiros ou fornecedores também podem nos revelar determinadas informações pessoais ou não pessoais que tenham coletado separadamente sobre você durante sua interação com seus aplicativos, sites ou serviços, para que possamos prestar nossos Serviços de forma eficaz. Isso pode ocorrer no contexto de sites, incluindo sites móveis, cookies, outras tecnologias ou outras características agregadas ou outros identificadores relacionados a seu dispositivo, para compreender sua interação com esse site e exibir determinados tipos de anúncios relevantes para seus interesses.</p>
<p>Essas partes fornecem cookies de acordo com suas próprias políticas específicas de privacidade e cookies, e sujeitas a seus próprios requisitos legais aplicáveis. Não utilizamos as informações que elas nos fornecem para nenhuma finalidade diferente das permitidas por esses terceiros ou da prestação ou melhoria de nossos Serviços.</p>
<p>Não coletamos dados sensíveis, como origem racial ou étnica, opiniões políticas, crenças religiosas ou filosóficas, dados genéticos, dados biométricos ou dados relativos à saúde. Podemos exibir anúncios direcionados a pessoas interessadas em atividade física.</p>
<hr>
<h2>5. COMO UTILIZAMOS SUAS INFORMAÇÕES PESSOAIS?</h2>
<p>Utilizamos as informações que coletamos sobre seu dispositivo para o seguinte:</p>
<p>Exibir anúncios em seu dispositivo, que podem incluir publicidade baseada em interesses personalizada de acordo com seus interesses, preferências e localizações</p>
<p>Participar de leilões para veicular anúncios e determinar quais anúncios são mais eficazes</p>
<p>Analisar e fornecer a nossos parceiros do lado da demanda ou anunciantes relatórios sobre a eficácia dos anúncios e das campanhas, inclusive entre diferentes tipos de dispositivos, com base em nossa identificação de dispositivos relacionados à mesma pessoa. Nós, ou os terceiros com quem prestamos esse serviço, podemos utilizar dados entre dispositivos para fornecer serviços de publicidade baseada em interesses e exibir anúncios personalizados aos usuários em múltiplos dispositivos móveis, incluindo aplicativos OTT e smart TVs</p>
<p>Evitar exibir os mesmos anúncios para você muitas vezes</p>
<p>Criar segmentos de público personalizados para permitir que nossos clientes e parceiros direcionem melhor seus anúncios e ofertas</p>
<p>Melhorar nossos Serviços e ajudar nossos clientes e parceiros a melhorar seus produtos e serviços</p>
<p>Detectar, dissuadir e prevenir fraudes e tráfego fraudulento, ou proteger e assegurar nossos sistemas</p>
<p>Podemos tratar suas respostas a pesquisas e compartilhar os dados das respostas com as marcas que são nossos clientes ou anunciantes</p>
<hr>
<h2>6. COM QUEM COMPARTILHAMOS SUAS INFORMAÇÕES PESSOAIS?</h2>
<p>A Wortise pode compartilhar as informações que coletamos ou recebemos sobre você, conforme descrito nesta Política, da seguinte maneira:</p>
<p>Publishers e parceiros de oferta. Podemos compartilhar suas informações com publishers — o aplicativo — para ajudá-los a compreender como os usuários interagem com seus aplicativos, sites e com os anúncios de seus aplicativos e sites</p>
<p>Parceiros de demanda e anunciantes. Podemos compartilhar suas informações com parceiros de demanda, marcas e anunciantes que utilizam nossa Plataforma de Marketing para permitir que compreendam o desempenho de suas campanhas e ajudá-los a direcionar melhor suas campanhas, produtos ou ofertas</p>
<p>Parceiros de marketing. Podemos compartilhar suas informações com parceiros de dados que nos ajudam a compreender melhor suas preferências por meio de serviços de enriquecimento de dados, análise e identificação, bem como com empresas de medição que nos ajudam na atribuição e no rastreamento de anúncios distribuídos por nós (“Parceiros de Marketing”)</p>
<p>Prestadores de serviços. Podemos compartilhar as informações pessoais que coletamos sobre você com nossos prestadores de serviços externos. As categorias de prestadores de serviços aos quais confiamos informações pessoais incluem: serviços de TI e relacionados; detecção de fraudes, informações e serviços; processadores de pagamentos; fornecedores de atendimento ao cliente; e fornecedores que apoiam a prestação dos Serviços</p>
<p>Divulgações para nos proteger ou proteger outras pessoas. Podemos acessar, conservar e divulgar a terceiros quaisquer informações que armazenemos associadas a você se acreditarmos de boa-fé que isso é necessário ou apropriado para: cumprir solicitações de autoridades policiais ou de segurança nacional e processos legais, como uma ordem judicial ou intimação; proteger seus direitos, bens ou segurança, os nossos ou os de outras pessoas; fazer cumprir nossas políticas ou contratos; cobrar valores que nos sejam devidos; ou colaborar com a investigação ou persecução de atividades ilegais suspeitas ou reais</p>
<p>Divulgações em caso de fusão, venda ou outras transferências de ativos. Se participarmos de uma fusão, aquisição, processo de diligência prévia para financiamento, reorganização, falência, administração judicial, compra ou venda de ativos, ou transição do serviço para outro fornecedor, suas informações poderão ser vendidas ou transferidas como parte dessa operação, na medida permitida pela lei e/ou pelo contrato</p>
<hr>
<h2>7. COMO MANTEMOS AS INFORMAÇÕES PESSOAIS SEGURAS?</h2>
<p>A Wortise adota medidas técnicas e organizacionais razoáveis para proteger as informações que coleta sobre você, em cumprimento de seus requisitos legais e de privacidade e de suas obrigações contratuais. Também buscamos obter de nossos parceiros proteção contratual adequada em relação à coleta, ao uso ou ao tratamento dos dados dos usuários. Infelizmente, nenhum sistema é 100% seguro e não podemos assegurar ou garantir a segurança das informações que você nos fornecer. Na máxima medida permitida pela legislação aplicável, não aceitamos responsabilidade pela divulgação não autorizada.</p>
<p>Ao utilizar nossos Serviços ou nos fornecer informações pessoais, você concorda que podemos nos comunicar eletronicamente com você sobre questões de segurança, privacidade e administração relacionadas ao uso de nossos Serviços. Se tomarmos conhecimento de uma violação da segurança de um sistema, podemos tentar notificá-lo eletronicamente por meio da publicação de um aviso em nossos Serviços, por correspondência ou pelo envio de um e-mail.</p>
<hr>
<h2>8. POR QUANTO TEMPO CONSERVAMOS SUAS INFORMAÇÕES?</h2>
<p>A Wortise conserva as informações coletadas no contexto de nossa Plataforma de Marketing por um período de até três (3) meses, salvo se a lei ou um contrato aplicável exigirem o contrário.</p>
<p>A Wortise pode conservar as informações que obtém sobre você de acordo com as instruções dos clientes ou parceiros que fornecem essas informações, ou conforme necessário para cumprir nossas obrigações contratuais. Se você fornecer informações ao participar de uma pesquisa ou aplicativo da Wortise baseado em opiniões, conservaremos seus dados pessoais apenas pelo tempo necessário para cumprir as finalidades para as quais os coletamos.</p>
<p>Após o período de conservação aplicável, a Wortise somente conservará e poderá utilizar seus dados: (i) de forma agregada ou anonimizada; (ii) para cumprir suas obrigações legais; e (iii) para resolver controvérsias e fazer cumprir os acordos. Observe que os usos indicados nesta disposição se aplicarão como exceção às suas solicitações relacionadas aos direitos do titular ou do consumidor.</p>
<hr>
<h2>9. EXCLUSÃO DOS ANÚNCIOS BASEADOS EM INTERESSES</h2>
<p>Exclusão da publicidade baseada em interesses: se preferir não receber publicidade da Wortise baseada em interesses, você pode optar pela exclusão a qualquer momento visitando a página de exclusão da Wortise e enviando o identificador de seu dispositivo ou qualquer outro identificador indicado. Se optar pela exclusão da publicidade baseada em interesses, continuará recebendo anúncios “genéricos” da Wortise. Para optar pela exclusão de nossa segmentação publicitária entre dispositivos, você deverá fazê-lo em cada navegador e dispositivo usando os métodos de exclusão correspondentes.</p>
<p>Em seu dispositivo, acesse as configurações de privacidade do sistema operacional (SO). Selecione Limitar Rastreamento de Anúncios para dispositivos iOS/tvOS, Desativar Anúncios Baseados em Interesses para dispositivos Android, Limitar Rastreamento de Anúncios para dispositivos Roku ou uma configuração semelhante oferecida por seu SO. Consulte a política de privacidade do fabricante de seu dispositivo para obter mais informações.</p>
<hr>
<h2>10. DIREITOS DE PRIVACIDADE</h2>
<p>A Wortise fornece aos consumidores os direitos do titular ou do consumidor quando e na medida em que as leis aplicáveis os exigirem.</p>
<p>Regulamento Geral de Proteção de Dados (RGPD): se você for um titular de dados do EEE, consulte nossa Política de Privacidade para o EEE em <a href="https://www.Wortise.com/privacy-policy-for-eea/">https://www.Wortise.com/privacy-policy-for-eea/</a> para conhecer seus direitos como titular de dados nos termos do RGPD.</p>
<p>Califórnia: a Lei de Privacidade do Consumidor da Califórnia de 2018 (“CCPA”) concede aos residentes da Califórnia o direito de saber quais categorias de informações pessoais a Wortise coletou sobre eles e se a Wortise divulgou essas informações pessoais para uma finalidade comercial, por exemplo, a um prestador de serviços, durante os 12 meses anteriores. As categorias de fontes das quais coletamos informações pessoais e nossas finalidades empresariais e comerciais para utilizá-las estão estabelecidas, respectivamente, nas seções anteriores “4. QUAIS INFORMAÇÕES COLETAMOS?” e “5. COMO UTILIZAMOS SUAS INFORMAÇÕES?”. As categorias de terceiros com os quais podemos compartilhar suas informações estão listadas na seção anterior “6. COM QUEM COMPARTILHAMOS SUAS INFORMAÇÕES?”.</p>
<p>Os residentes da Califórnia têm o direito de optar pela exclusão da “venda” de suas informações pessoais. Nos termos da CCPA, “venda” é definida de forma ampla e inclui a transferência de informações pessoais por uma empresa a um terceiro em troca de uma contraprestação de valor, mesmo que não haja troca de dinheiro. Pode-se considerar que a Wortise “vende” informações pessoais. As categorias de informações pessoais que “vendemos” e as categorias de terceiros aos quais “vendemos” informações pessoais durante os doze meses anteriores estão listadas na seção anterior “6. COM QUEM COMPARTILHAMOS SUAS INFORMAÇÕES?”.</p>
<p>Os residentes do estado da Califórnia, nos Estados Unidos, têm os seguintes direitos adicionais de privacidade:</p>
<p>• Você tem o direito de exercer determinados direitos do consumidor, como solicitar conhecimento, divulgação, acesso ou exclusão de seus dados coletados durante os últimos 12 meses, escrevendo para <a href="mailto:privacy@wortise.com">privacy@wortise.com</a>.</p>
<p>• Você tem o direito de optar pela exclusão da venda de seus dados clicando no seguinte link: Não vender meus dados.</p>
<p>Não discriminação. Os residentes da Califórnia têm o direito de não receber tratamento discriminatório de nossa parte por exercer os direitos conferidos pela CCPA.</p>
<p>Agente autorizado. Somente você, ou uma pessoa legalmente autorizada a agir em seu nome, poderá realizar uma solicitação verificável do consumidor relacionada às suas informações pessoais. Você também poderá realizar uma solicitação verificável do consumidor em nome de seu filho menor de idade. Para designar um agente autorizado, entre em contato conosco conforme estabelecido na seção “17. CONTATO” abaixo e forneça uma autorização escrita assinada por você e pelo agente designado.</p>
<p>Verificação. Para proteger sua privacidade, tomaremos as seguintes medidas para verificar sua identidade antes de atender à solicitação. Quando você fizer uma solicitação, pediremos que forneça informações suficientes para nos permitir verificar razoavelmente que você é a pessoa sobre a qual coletamos informações pessoais ou um representante autorizado, o que pode incluir informações sobre seu dispositivo.</p>
<p>Nevada. Se você for residente de Nevada, tem o direito de optar pela exclusão da venda de determinadas Informações Pessoais a terceiros que pretendam licenciá-las ou vendê-las. Você pode exercer esse direito escrevendo para <a href="mailto:privacy@wortise.com">privacy@wortise.com</a> com o assunto “Nevada Do Not Sell Request” e fornecendo seu nome e o endereço de e-mail associado à sua conta.</p>
<p>As leis de privacidade de seu país podem conceder os seguintes direitos adicionais de privacidade em relação às suas informações pessoais: direito de acesso, solicitação de retificação, solicitação de exclusão, anonimização ou bloqueio, limitação ou oposição ao tratamento, retirada do consentimento, solicitação de portabilidade dos dados, informações sobre os terceiros com os quais seus dados foram compartilhados e solicitação de revisão de decisões tomadas exclusivamente com base no tratamento automatizado. Para exercer esses direitos, escreva para <a href="mailto:privacy@wortise.com">privacy@wortise.com</a>.</p>
<hr>
<h2>11. TRANSFERÊNCIAS INTERNACIONAIS</h2>
<p>A Wortise pode compartilhar suas informações com clientes, compradores, parceiros, afiliadas e outros terceiros descritos acima que estejam em países diferentes de seu país de residência; por exemplo, se você reside no EEE, podemos compartilhar suas informações com nossos clientes ou afiliadas fora do EEE, sujeito aos requisitos contratuais ou legais aplicáveis. Você concorda que todas as informações que tratamos possam ser transferidas, tratadas e armazenadas em qualquer lugar do mundo.</p>
<p>Embora alguns países possam não ter leis de proteção de dados equivalentes às do país em que você reside, tomaremos medidas razoáveis para proteger suas informações de acordo com esta Política de Privacidade.</p>
<hr>
<h2>12. CAMPANHAS DE GERAÇÃO DE LEADS</h2>
<p>A Wortise pode oferecer aos profissionais de marketing soluções publicitárias baseadas em formulários que incluam a coleta de informações que você forneça voluntariamente como parte de um anúncio contendo um questionário. Essas informações podem consistir em dados pessoais, informações ou dados não pessoais, ou ambos. Todas as informações que você fornecer voluntariamente em resposta a esse formulário ou questionário geralmente são enviadas diretamente aos servidores do anunciante correspondente ou à sua página de destino e, nesses casos, serão regidas pelas políticas de privacidade desse anunciante vigentes no momento da transferência.</p>
<p>Caso a Wortise trate diretamente dados pessoais, você reconhece que a Wortise pode ser obrigada a armazenar essas informações durante o período em que continuar gerenciando a campanha de geração de leads correspondente para o anunciante em cujo nome as informações são coletadas. A Wortise pode armazenar temporariamente essas informações exclusivamente para executar essas campanhas baseadas em formulários e as utilizará apenas para otimizá-las, sujeita aos requisitos legais de privacidade e contratuais aplicáveis. A Wortise implementou salvaguardas internas para proteger o armazenamento temporário dessas informações e adota medidas técnicas e organizacionais razoáveis para protegê-las. A Wortise dispõe de mecanismos para excluir ou anonimizar os dados pessoais após a conclusão dessa campanha ou dentro de um período de trinta (30) dias. Após a conclusão da campanha correspondente, a Wortise poderá conservar e utilizar suas Informações somente na medida necessária para elaborar relatórios para seu cliente, cumprir suas obrigações legais, resolver controvérsias e fazer cumprir os acordos, e para nenhuma outra finalidade. As informações ou os dados não pessoais que você fornecer poderão ser utilizados para melhorar nossos Serviços.</p>
<p>Se você tiver dúvidas sobre as campanhas de geração de leads da Wortise, entre em contato conosco em <a href="mailto:privacy@wortise.com">privacy@wortise.com</a>. A Wortise encaminhará qualquer consulta ou reclamação ao anunciante correspondente responsável pelo tratamento dos dados fornecidos como parte das campanhas de geração de leads.</p>
<hr>
<h2>13. COOKIES</h2>
<p>Utilizamos cookies e beacons para nos ajudar a coletar parte das informações descritas acima. Isso pode ocorrer quando você interage conosco ou com nossos parceiros externos, que permitem à Wortise coletar dados relacionados à sua interação com seus aplicativos ou sites para exibir anúncios relevantes e/ou melhorar nossos serviços. Também podemos utilizar cookies em nossos sites e nos de nossos anunciantes para fornecer, respectivamente, funcionalidade do site e publicidade, e para evitar que você precise fornecer novamente as informações já disponibilizadas em visitas posteriores ao nosso site.</p>
<hr>
<h2>14. PRIVACIDADE DE MENORES</h2>
<p>Não coletamos conscientemente informações pessoais de menores de 16 anos por meio dos Serviços Publicitários e do Site.</p>
<hr>
<h2>15. OUTROS SITES</h2>
<p>Nosso site e os anúncios que veiculamos podem conter links para outros sites. Observe que não somos responsáveis pelas práticas de privacidade desses sites, pois podem ter políticas de privacidade e condições de uso diferentes e não estão associados a nós. Você reconhece que não podemos controlar esses links e que não seremos responsáveis por qualquer uso desses sites.</p>
<hr>
<h2>16. ALTERAÇÕES NESTA POLÍTICA DE PRIVACIDADE</h2>
<p>Podemos modificar esta Política de Privacidade a qualquer momento. A Política de Privacidade modificada será exibida em nosso site. Se fizermos alterações substanciais, notificaremos você por meio de um aviso neste site antes que a alteração entre em vigor. Consulte nossa Política de Privacidade regularmente para garantir que leu a versão mais recente.</p>
<hr>
<h2>16. CONTATO</h2>
<p>Se você tiver dúvidas sobre esta Política de Privacidade, entre em contato conosco em <a href="mailto:privacy@wortise.com">privacy@wortise.com</a>.</p>`,
		},
	},
} satisfies Partial<Record<Locale, LegalPageData<'privacy'>>>;
