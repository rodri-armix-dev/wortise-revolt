import type { Locale } from '../../../i18n/config';
import type { LegalPageData } from '../page.types';

export const sdkTermsPageData = {
	es: {
		key: 'sdk-terms',
		slug: 'terminos-del-sdk',
		template: 'legal',
		meta: {
			title: 'Términos y condiciones del SDK | Wortise',
			description: 'Condiciones de licencia, integración y uso del SDK de Wortise.',
		},
		content: {
			eyebrow: 'Legal',
			title: 'Términos y condiciones del SDK',
			introduction: '<p>Estos Términos y condiciones del SDK («Términos») rigen el uso del kit de desarrollo de software de Wortise («SDK»), proporcionado por Bee Holding S.A.S., una empresa registrada en Uruguay («Bee Holding», «nosotros», «nos» o «nuestro»).</p><p>Al integrar, acceder o utilizar el SDK, usted («Desarrollador», «usted») acepta quedar sujeto a estos Términos.</p><p>Si no está de acuerdo con estos Términos, no debe utilizar el SDK.</p>',
			html: `
<hr>
<h2>1. Licencia</h2>
<p>1.1. Sujeto a su pleno cumplimiento de estos Términos, Bee Holding le otorga una licencia limitada, no exclusiva, intransferible y revocable para integrar y utilizar el SDK de Wortise únicamente para mostrar anuncios proporcionados a través de la red publicitaria de Wortise dentro de sus aplicaciones móviles.</p>
<p>1.2. No podrá modificar, distribuir, realizar ingeniería inversa, descompilar, desensamblar ni crear obras derivadas del SDK, salvo en la medida expresamente permitida por la legislación aplicable.</p>
<hr>
<h2>2. Usos prohibidos y contenido publicitario inapropiado</h2>
<p>2.1. No debe utilizar el SDK de ninguna manera que:</p>
<p>Infrinja cualquier ley, normativa o derecho de terceros aplicable;</p>
<p>Interfiera o altere el funcionamiento del SDK, los servidores o las redes;</p>
<p>Recopile datos personales o sensibles de los usuarios sin consentimiento o en infracción de las políticas de las plataformas, incluidas las Políticas para Desarrolladores de Google Play y las directrices del App Store.</p>
<h3>2.2. Contenido y comportamientos publicitarios inapropiados</h3>
<p>No debe mostrar, promover ni permitir la visualización de anuncios a través del SDK de Wortise que contengan o promuevan:</p>
<p>Violencia, acoso o daño físico a uno mismo o a otras personas;</p>
<p>Discurso de odio o discriminación por motivos de raza, origen étnico, religión, género, discapacidad, orientación sexual o cualquier otra categoría protegida;</p>
<p>Pornografía, contenido sexual o sugerente que involucre a menores, o contenido para adultos inapropiado para niños;</p>
<p>Drogas, alcohol, tabaco, armas o cualquier actividad peligrosa o ilegal;</p>
<p>Contenido falso, engañoso o fraudulento;</p>
<p>Juegos de azar o juegos de azar simulados dirigidos a menores;</p>
<p>Malware, spyware o comportamientos engañosos que interfieran con la funcionalidad de las aplicaciones o los mecanismos de consentimiento de los usuarios.</p>
<p>2.3. Los anuncios publicados a través del SDK de Wortise deben cumplir con:</p>
<p>Las Políticas del Programa para Desarrolladores de Google Play, incluidos los requisitos de la Política de Familias;</p>
<p>Las Directrices de Revisión del App Store; y</p>
<p>Todas las leyes y normativas aplicables en los territorios donde se distribuya su aplicación.</p>
<hr>
<h2>3. Datos y privacidad</h2>
<p>3.1. El SDK de Wortise puede recopilar datos técnicos y de uso necesarios para la publicación de anuncios, la medición del rendimiento, la prevención del fraude y la elaboración de informes.</p>
<p>3.2. Debe proporcionar en su aplicación una política de privacidad de acceso público que informe claramente sobre:</p>
<p>El uso del SDK de Wortise y sus prácticas de recopilación de datos;</p>
<p>El cumplimiento de las leyes de privacidad aplicables, incluidos el RGPD, la CCPA y la COPPA, si su aplicación está dirigida a niños.</p>
<p>3.3. No debe utilizar el SDK para recopilar información de identificación personal (PII) ni datos de ubicación de menores de 13 años, o de la edad definida por la legislación local, sin un consentimiento parental verificado.</p>
<hr>
<h2>4. Responsabilidades del desarrollador</h2>
<p>4.1. Usted es el único responsable del funcionamiento, el contenido y el cumplimiento normativo de sus aplicaciones, lo que incluye garantizar que todos los anuncios mostrados a través del SDK de Wortise cumplan con estos Términos y con todas las leyes y políticas de las plataformas aplicables.</p>
<p>4.2. Acepta eliminar o desactivar el SDK sin demora si Bee Holding se lo indica por motivos de políticas, cumplimiento normativo o razones legales.</p>
<hr>
<h2>5. Propiedad intelectual</h2>
<p>5.1. El SDK de Wortise y todos los materiales relacionados son propiedad de Bee Holding S.A.S. o de sus licenciantes y están protegidos por derechos de autor.</p>
<p>5.2. Salvo por la licencia limitada otorgada anteriormente, no se le transfiere ningún derecho, título ni propiedad.</p>
<hr>
<h2>6. Terminación</h2>
<p>6.1. Bee Holding puede suspender o dar por terminado su uso del SDK de Wortise en cualquier momento si usted infringe estos Términos o cualquier política aplicable.</p>
<p>6.2. Tras la terminación, debe dejar de utilizar el SDK de inmediato y eliminar todas sus copias de sus aplicaciones y sistemas.</p>
<hr>
<h2>7. Exclusión de garantías</h2>
<p>El SDK de Wortise se proporciona «tal cual» y «según disponibilidad», sin garantías de ningún tipo, expresas o implícitas.</p>
<p>Bee Holding no garantiza el funcionamiento ininterrumpido o libre de errores del SDK ni de la publicación de anuncios, ni garantiza ingresos o rendimiento publicitario alguno.</p>
<hr>
<h2>8. Limitación de responsabilidad</h2>
<p>En la máxima medida permitida por la ley, Bee Holding no será responsable de ningún daño indirecto, incidental, especial, consecuente o punitivo que surja de su uso del SDK de Wortise o de la visualización de anuncios, o que se relacione con ellos, incluso si se le ha advertido de la posibilidad de tales daños.</p>
<hr>
<h2>9. Indemnización</h2>
<p>Usted acepta indemnizar, defender y mantener indemnes a Bee Holding S.A.S., sus afiliadas, directivos, empleados y socios frente a cualquier reclamación, pérdida, responsabilidad, daño o gasto, incluidos los honorarios razonables de abogados, que surja de o se relacione con:</p>
<p>Su uso del SDK de Wortise;</p>
<p>Su incumplimiento de estos Términos; o</p>
<p>Su infracción de cualquier ley, normativa o derecho de terceros aplicable.</p>
<hr>
<h2>10. Ley aplicable y jurisdicción</h2>
<p>Estos Términos se regirán e interpretarán de conformidad con las leyes de Uruguay, sin tener en cuenta los principios sobre conflicto de leyes.</p>
<p>Toda controversia que surja de estos Términos o en relación con ellos estará sujeta a la jurisdicción exclusiva de los tribunales de Montevideo, Uruguay.</p>
<hr>
<h2>11. Cambios en estos Términos</h2>
<p>Bee Holding se reserva el derecho de actualizar o modificar estos Términos en cualquier momento.</p>
<p>El uso continuado del SDK de Wortise después de dichos cambios constituye su aceptación de los Términos revisados.</p>
<hr>
<p>© 2025 Wortise. Todos los derechos reservados.</p>`,
		},
	},
	en: {
		key: 'sdk-terms',
		slug: 'sdk-terms',
		template: 'legal',
		meta: {
			title: 'SDK Terms and Conditions | Wortise',
			description: 'License, integration and usage terms for the Wortise SDK.',
		},
		content: {
			eyebrow: 'Legal',
			title: 'SDK Terms and Conditions',
			introduction: '<p>These SDK Terms and Conditions (“Terms”) govern the use of the Wortise software development kit (“SDK”), provided by Bee Holding S.A.S., a company registered in Uruguay (“Bee Holding,” “we,” “us” or “our”).</p><p>By integrating, accessing or using the SDK, you (“Developer,” “you”) agree to be bound by these Terms.</p><p>If you do not agree to these Terms, you must not use the SDK.</p>',
			html: `
<hr>
<h2>1. License</h2>
<p>1.1. Subject to your full compliance with these Terms, Bee Holding grants you a limited, non-exclusive, non-transferable and revocable license to integrate and use the Wortise SDK solely to display advertisements provided through the Wortise advertising network within your mobile applications.</p>
<p>1.2. You may not modify, distribute, reverse engineer, decompile, disassemble or create derivative works of the SDK, except to the extent expressly permitted by applicable law.</p>
<hr>
<h2>2. Prohibited Uses and Inappropriate Advertising Content</h2>
<p>2.1. You must not use the SDK in any manner that:</p>
<p>Violates any applicable law, regulation or third-party right;</p>
<p>Interferes with or disrupts the operation of the SDK, servers or networks;</p>
<p>Collects personal or sensitive user data without consent or in violation of platform policies, including the Google Play Developer Policies and App Store guidelines.</p>
<h3>2.2. Inappropriate Advertising Content and Behaviors</h3>
<p>You must not display, promote or allow the display of advertisements through the Wortise SDK that contain or promote:</p>
<p>Violence, harassment or physical harm to oneself or others;</p>
<p>Hate speech or discrimination based on race, ethnicity, religion, gender, disability, sexual orientation or any other protected category;</p>
<p>Pornography, sexual or suggestive content involving minors, or adult content inappropriate for children;</p>
<p>Drugs, alcohol, tobacco, weapons or any dangerous or illegal activity;</p>
<p>False, misleading or fraudulent content;</p>
<p>Gambling or simulated gambling directed at minors;</p>
<p>Malware, spyware or deceptive behaviors that interfere with application functionality or user consent mechanisms.</p>
<p>2.3. Advertisements served through the Wortise SDK must comply with:</p>
<p>The Google Play Developer Program Policies, including Families Policy requirements;</p>
<p>The App Store Review Guidelines; and</p>
<p>All applicable laws and regulations in the territories where your application is distributed.</p>
<hr>
<h2>3. Data and Privacy</h2>
<p>3.1. The Wortise SDK may collect technical and usage data necessary for ad delivery, performance measurement, fraud prevention and reporting.</p>
<p>3.2. You must provide a publicly accessible privacy policy in your application that clearly discloses:</p>
<p>The use of the Wortise SDK and its data collection practices;</p>
<p>Compliance with applicable privacy laws, including the GDPR, CCPA and COPPA if your application is directed at children.</p>
<p>3.3. You must not use the SDK to collect personally identifiable information (PII) or location data from children under 13, or the age defined by local law, without verified parental consent.</p>
<hr>
<h2>4. Developer Responsibilities</h2>
<p>4.1. You are solely responsible for the operation, content and regulatory compliance of your applications, including ensuring that all advertisements displayed through the Wortise SDK comply with these Terms and all applicable laws and platform policies.</p>
<p>4.2. You agree to promptly remove or disable the SDK if instructed by Bee Holding for policy, compliance or legal reasons.</p>
<hr>
<h2>5. Intellectual Property</h2>
<p>5.1. The Wortise SDK and all related materials are the property of Bee Holding S.A.S. or its licensors and are protected by copyright.</p>
<p>5.2. Except for the limited license granted above, no right, title or ownership is transferred to you.</p>
<hr>
<h2>6. Termination</h2>
<p>6.1. Bee Holding may suspend or terminate your use of the Wortise SDK at any time if you violate these Terms or any applicable policy.</p>
<p>6.2. Upon termination, you must immediately stop using the SDK and remove all copies from your applications and systems.</p>
<hr>
<h2>7. Disclaimer of Warranties</h2>
<p>The Wortise SDK is provided “as is” and “as available,” without warranties of any kind, express or implied.</p>
<p>Bee Holding does not warrant uninterrupted or error-free operation of the SDK or ad delivery, nor does it guarantee any advertising revenue or performance.</p>
<hr>
<h2>8. Limitation of Liability</h2>
<p>To the fullest extent permitted by law, Bee Holding shall not be liable for any indirect, incidental, special, consequential or punitive damages arising out of or relating to your use of the Wortise SDK or the display of advertisements, even if advised of the possibility of such damages.</p>
<hr>
<h2>9. Indemnification</h2>
<p>You agree to indemnify, defend and hold harmless Bee Holding S.A.S., its affiliates, officers, employees and partners from any claims, losses, liabilities, damages or expenses, including reasonable attorneys’ fees, arising out of or relating to:</p>
<p>Your use of the Wortise SDK;</p>
<p>Your breach of these Terms; or</p>
<p>Your violation of any applicable law, regulation or third-party right.</p>
<hr>
<h2>10. Governing Law and Jurisdiction</h2>
<p>These Terms shall be governed by and construed in accordance with the laws of Uruguay, without regard to conflict of laws principles.</p>
<p>Any dispute arising out of or relating to these Terms shall be subject to the exclusive jurisdiction of the courts of Montevideo, Uruguay.</p>
<hr>
<h2>11. Changes to These Terms</h2>
<p>Bee Holding reserves the right to update or modify these Terms at any time.</p>
<p>Your continued use of the Wortise SDK following such changes constitutes your acceptance of the revised Terms.</p>
<hr>
<p>© 2025 Wortise. All rights reserved.</p>`,
		},
	},
	pt: {
		key: 'sdk-terms',
		slug: 'termos-do-sdk',
		template: 'legal',
		meta: {
			title: 'Termos e condições do SDK | Wortise',
			description: 'Condições de licença, integração e uso do SDK da Wortise.',
		},
		content: {
			eyebrow: 'Legal',
			title: 'Termos e condições do SDK',
			introduction: '<p>Estes Termos e condições do SDK (“Termos”) regem o uso do kit de desenvolvimento de software da Wortise (“SDK”), fornecido pela Bee Holding S.A.S., uma empresa registrada no Uruguai (“Bee Holding”, “nós”, “nos” ou “nosso”).</p><p>Ao integrar, acessar ou utilizar o SDK, você (“Desenvolvedor”, “você”) concorda em se vincular a estes Termos.</p><p>Se você não concordar com estes Termos, não deverá utilizar o SDK.</p>',
			html: `
<hr>
<h2>1. Licença</h2>
<p>1.1. Sujeito ao seu pleno cumprimento destes Termos, a Bee Holding concede a você uma licença limitada, não exclusiva, intransferível e revogável para integrar e utilizar o SDK da Wortise exclusivamente para exibir anúncios fornecidos pela rede publicitária da Wortise em seus aplicativos móveis.</p>
<p>1.2. Você não poderá modificar, distribuir, realizar engenharia reversa, descompilar, desmontar ou criar obras derivadas do SDK, exceto na medida expressamente permitida pela legislação aplicável.</p>
<hr>
<h2>2. Usos proibidos e conteúdo publicitário inadequado</h2>
<p>2.1. Você não deve utilizar o SDK de qualquer maneira que:</p>
<p>Viole qualquer lei, regulamento ou direito de terceiros aplicável;</p>
<p>Interfira ou prejudique o funcionamento do SDK, dos servidores ou das redes;</p>
<p>Colete dados pessoais ou sensíveis dos usuários sem consentimento ou em violação às políticas das plataformas, incluindo as Políticas para Desenvolvedores do Google Play e as diretrizes da App Store.</p>
<h3>2.2. Conteúdo e comportamentos publicitários inadequados</h3>
<p>Você não deve exibir, promover ou permitir a exibição de anúncios por meio do SDK da Wortise que contenham ou promovam:</p>
<p>Violência, assédio ou danos físicos a si mesmo ou a outras pessoas;</p>
<p>Discurso de ódio ou discriminação por raça, etnia, religião, gênero, deficiência, orientação sexual ou qualquer outra categoria protegida;</p>
<p>Pornografia, conteúdo sexual ou sugestivo envolvendo menores, ou conteúdo adulto inadequado para crianças;</p>
<p>Drogas, álcool, tabaco, armas ou qualquer atividade perigosa ou ilegal;</p>
<p>Conteúdo falso, enganoso ou fraudulento;</p>
<p>Jogos de azar ou simulações de jogos de azar direcionados a menores;</p>
<p>Malware, spyware ou comportamentos enganosos que interfiram na funcionalidade dos aplicativos ou nos mecanismos de consentimento dos usuários.</p>
<p>2.3. Os anúncios veiculados por meio do SDK da Wortise devem cumprir:</p>
<p>As Políticas do Programa para Desenvolvedores do Google Play, incluindo os requisitos da Política para Famílias;</p>
<p>As Diretrizes de Revisão da App Store; e</p>
<p>Todas as leis e regulamentos aplicáveis nos territórios onde seu aplicativo é distribuído.</p>
<hr>
<h2>3. Dados e privacidade</h2>
<p>3.1. O SDK da Wortise pode coletar dados técnicos e de uso necessários para a veiculação de anúncios, medição de desempenho, prevenção de fraudes e elaboração de relatórios.</p>
<p>3.2. Você deve disponibilizar em seu aplicativo uma política de privacidade de acesso público que informe claramente sobre:</p>
<p>O uso do SDK da Wortise e suas práticas de coleta de dados;</p>
<p>O cumprimento das leis de privacidade aplicáveis, incluindo o RGPD, a CCPA e a COPPA, caso seu aplicativo seja direcionado a crianças.</p>
<p>3.3. Você não deve utilizar o SDK para coletar informações de identificação pessoal (PII) ou dados de localização de menores de 13 anos, ou da idade definida pela legislação local, sem consentimento parental verificado.</p>
<hr>
<h2>4. Responsabilidades do desenvolvedor</h2>
<p>4.1. Você é o único responsável pelo funcionamento, conteúdo e conformidade regulatória de seus aplicativos, incluindo garantir que todos os anúncios exibidos por meio do SDK da Wortise cumpram estes Termos e todas as leis e políticas das plataformas aplicáveis.</p>
<p>4.2. Você concorda em remover ou desativar o SDK prontamente se a Bee Holding assim determinar por motivos de políticas, conformidade regulatória ou razões legais.</p>
<hr>
<h2>5. Propriedade intelectual</h2>
<p>5.1. O SDK da Wortise e todos os materiais relacionados são propriedade da Bee Holding S.A.S. ou de seus licenciadores e são protegidos por direitos autorais.</p>
<p>5.2. Exceto pela licença limitada concedida acima, nenhum direito, título ou propriedade é transferido a você.</p>
<hr>
<h2>6. Rescisão</h2>
<p>6.1. A Bee Holding pode suspender ou encerrar seu uso do SDK da Wortise a qualquer momento se você violar estes Termos ou qualquer política aplicável.</p>
<p>6.2. Após a rescisão, você deve interromper imediatamente o uso do SDK e remover todas as cópias de seus aplicativos e sistemas.</p>
<hr>
<h2>7. Isenção de garantias</h2>
<p>O SDK da Wortise é fornecido “no estado em que se encontra” e “conforme disponível”, sem garantias de qualquer tipo, expressas ou implícitas.</p>
<p>A Bee Holding não garante o funcionamento ininterrupto ou livre de erros do SDK ou da veiculação de anúncios, nem garante qualquer receita ou desempenho publicitário.</p>
<hr>
<h2>8. Limitação de responsabilidade</h2>
<p>Na máxima medida permitida por lei, a Bee Holding não será responsável por quaisquer danos indiretos, incidentais, especiais, consequenciais ou punitivos decorrentes de ou relacionados ao seu uso do SDK da Wortise ou à exibição de anúncios, mesmo que tenha sido informada da possibilidade de tais danos.</p>
<hr>
<h2>9. Indenização</h2>
<p>Você concorda em indenizar, defender e isentar a Bee Holding S.A.S., suas afiliadas, administradores, funcionários e parceiros de quaisquer reclamações, perdas, responsabilidades, danos ou despesas, incluindo honorários advocatícios razoáveis, decorrentes de ou relacionados a:</p>
<p>Seu uso do SDK da Wortise;</p>
<p>Seu descumprimento destes Termos; ou</p>
<p>Sua violação de qualquer lei, regulamento ou direito de terceiros aplicável.</p>
<hr>
<h2>10. Lei aplicável e jurisdição</h2>
<p>Estes Termos serão regidos e interpretados de acordo com as leis do Uruguai, sem considerar os princípios de conflito de leis.</p>
<p>Qualquer controvérsia decorrente de ou relacionada a estes Termos estará sujeita à jurisdição exclusiva dos tribunais de Montevidéu, Uruguai.</p>
<hr>
<h2>11. Alterações nestes Termos</h2>
<p>A Bee Holding se reserva o direito de atualizar ou modificar estes Termos a qualquer momento.</p>
<p>O uso continuado do SDK da Wortise após essas alterações constitui sua aceitação dos Termos revisados.</p>
<hr>
<p>© 2025 Wortise. Todos os direitos reservados.</p>`,
		},
	},
} satisfies Partial<Record<Locale, LegalPageData<'sdk-terms'>>>;
