'use client';

import React, { useState } from 'react';
import {
  Flame,
  Music,
  BookOpen,
  Sparkles,
  Share2,
  ChevronRight,
  ChevronLeft,
  Heart,
  Star,
  CheckCircle2,
  Volume2,
  RotateCcw,
  Calendar,
} from 'lucide-react';
import { soundFX } from '../../utils/audio';
import { fireHolidayConfetti } from '../../utils/confetti';
import { FilterPills, SearchInput } from '../ui/FilterBar';

/* ============================================================
   NOVENA DE AGUINALDOS COLOMBIANA — 100% CANÓNICA E ÍNTEGRA
   Tradición de Fray Fernando de Jesús Larrea (Siglo XVIII)
   Días del 16 al 24 de Diciembre
   ============================================================ */

interface NovenaDayContent {
  day: number;
  dateStr: string;
  title: string;
  historicalConsideration: string; // Consideración canónica tradicional
  familyReflection: string;        // Meditación para la familia colombiana de hoy
  petitions: string[];             // Peticiones comunitarias
  closingPrayer: string;           // Oración propia de ese día
}

const NOVENA_DAYS: NovenaDayContent[] = [
  {
    day: 1,
    dateStr: '16 de Diciembre',
    title: 'Día Primero — El Amor Infinito del Padre y la Promesa del Salvador',
    historicalConsideration: `En el principio de los tiempos, Dios creó el cielo y la tierra por amor, y puso al hombre en el paraíso terrenal para que gozara de su amistad y de su gracia. Pero el hombre, desobedeciendo el mandato divino, cayó en la miseria del pecado y quedó apartado de su Creador.

No obstante su ingratitud, la infinita misericordia del Padre Eterno no abandonó a su criatura. En el mismo instante de la caída, prometió un Redentor: la descendencia de la mujer que aplastaría la cabeza de la serpiente infernal. Durante siglos y milenios, los santos patriarcas y los profetas suspiraron por la llegada del Mesías, clamando con ardor: "¡Cielos, lloved vuestra justicia; ábrase la tierra y germine al Salvador!"

Al abrir hoy nuestra Novena de Aguinaldos, contemplemos la inmensidad del amor de Dios, que no escatimó a su propio Hijo, sino que lo entregó por todos nosotros. Reconozcamos con profunda gratitud tan inefable beneficio y dispongamos nuestras almas para recibirlo con pureza de corazón.`,
    familyReflection: `Hoy 16 de diciembre se enciende la primera lucecita en el pesebre de nuestro hogar. En Colombia, el inicio de la Novena es sinónimo de reencuentro, de aroma a canela y natilla, del sonar de las primeras panderetas y maracas.

Pero más allá de la fiesta exterior, este primer día nos invita a preguntarnos: ¿cómo está el amor en nuestra familia? El amor de Dios no pone condiciones; no nos ama porque seamos perfectos, sino porque somos sus hijos. Que este primer día sea la oportunidad para limar asperezas, pedir perdón si ofendimos a alguien en este año que termina, y estrechar la mano con sinceridad.`,
    petitions: [
      'Por la reconciliación y la paz en el seno de nuestra familia.',
      'Por los que están lejos de su tierra y añoran el calor del hogar colombiano.',
      'Para que el amor de Dios sea el cimiento firme de cada uno de nuestros hogares.',
      'Por las familias que hoy sufren dificultades económicas, para que no les falte el pan ni la esperanza.',
    ],
    closingPrayer: 'Niño Dios amadísimo, que por amor infinito quisiste descender del Cielo para salvarnos: enciende en nuestros pechos el fuego sagrado de tu caridad, para que amándote a Ti sobre todas las cosas, nos amemos fraternalmente los unos a los otros. Amén. 🕯️',
  },
  {
    day: 2,
    dateStr: '17 de Diciembre',
    title: 'Día Segundo — La Humildad de la Encarnación',
    historicalConsideration: `El Verbo Eterno, Segunda Persona de la Santísima Trinidad, igual en poder, sabiduría y gloria al Padre, tomó la naturaleza humana en las entrañas purísimas de la Virgen María. ¡Misterio de anonadamiento y de amor incomprensible! Aquel a quien los cielos no pueden contener, se encerró en el seno virginal de una doncella nazarena.

No vino revestido de la majestad tremenda del Sinaí, rodeado de truenos y relámpagos; vino en la pequeñez de un embrión humano, sujeto a todas las flaquezas de nuestra naturaleza excepto al pecado. Quiso enseñarnos con su ejemplo que el verdadero camino hacia Dios es la humildad profunda, y que la soberbia es el veneno que destruye el alma humana.

"Aprended de mí, que soy manso y humilde de corazón, y hallaréis descanso para vuestras almas." (Mt 11,29). Humillóse a sí mismo haciéndose obediente hasta la muerte de cruz.`,
    familyReflection: `Vivimos en un mundo que premia las apariencias, los lujos y el aparentar ser más que los demás. Pero el Niño Dios nos enseña la lección más grande en este segundo día: la verdadera grandeza se viste de sencillez.

En el hogar colombiano, la grandeza no está en los regalos costosos, sino en la generosidad humilde: la abuela que teje con cariño, el padre que trabaja en silencio, la madre que vela el sueño de sus hijos, los hermanos que comparten lo que tienen. Que aprendamos a ser humildes, reconociendo el valor de cada integrante de nuestra familia.`,
    petitions: [
      'Por la virtud de la humildad sincera en nuestras palabras y acciones diarias.',
      'Por los más necesitados y olvidados de nuestras ciudades y veredas.',
      'Para que sepamos despojarnos del orgullo y la vanidad que siembran división.',
      'Por nuestros niños y jóvenes, para que crezcan en sabiduría, gracia y sencillez.',
    ],
    closingPrayer: '¡Oh Jesús dulcísimo, modelo incomparable de humildad! Aplasta en nosotros la soberbia que tanto te ofende y danos un corazón manso y pequeño como el tuyo, para que seas siempre nuestro único tesoro. Amén. 🕯️',
  },
  {
    day: 3,
    dateStr: '18 de Diciembre',
    title: 'Día Tercero — El Camino Hacia Belén: Fe y Esperanza en las Dificultades',
    historicalConsideration: `Habiendo promulgado el emperador César Augusto un edicto por el cual se ordenaba empadronar a todo el imperio romano, debieron marchar María y José desde Nazaret de Galilea hasta Belén de Judá, la ciudad de David, por ser ellos de la estirpe real del santo rey profeta.

Consideremos la fatiga, el frío y las penalidades de tan penosa jornada. La Virgen Santísima, próxima ya a su divino parto, cabalga con dificultad por senderos escarpados y pedregosos, azotada por los vientos invernales. San José, angustiado al ver el sufrimiento de su santa esposa, prodiga toda su ternura y cuidados para aliviar su cansancio.

Sin embargo, ni una queja sale de sus labios. Sabían que en aquel aparente capricho del emperador pagano se cumplían los designios divinos profetizados por Miqueas: "Y tú, Belén de Judá, de ningún modo eres la menor entre las ciudades de Judá, porque de ti saldrá el Caudillo que apacentará a mi pueblo Israel."`,
    familyReflection: `Cuántas familias en Colombia han tenido que emprender caminos duros: desplazamientos forzados, mudanzas en busca de sustento, viajes lejanos para trabajar y enviar remesas a los suyos. El camino de José y María nos dice que Dios camina con los que sufren el desarraigo.

Cuando los problemas aprietan, cuando las cuentas no cuadran o las enfermedades golpean a la puerta, no perdamos la esperanza. Como José y María en su travesía a Belén, confiemos en que Dios siempre tiene preparado un puerto seguro para los que confían en Él.`,
    petitions: [
      'Por los migrantes y familias desplazadas de Colombia y del mundo.',
      'Por quienes hoy viajan por las carreteras de nuestra patria para reencontrarse con sus seres queridos.',
      'Por la paciencia y fortaleza en medio de las pruebas cotidianas del hogar.',
      'Para que la fe de nuestra familia sea inquebrantable en las horas difíciles.',
    ],
    closingPrayer: 'Amable Niño Jesús, que acompañaste a María y a José en su penosa marcha hacia Belén: sé el compañero fiel de nuestra familia en todas nuestras fatigas, y llévanos con seguridad a la patria celestial. Amén. 🕯️',
  },
  {
    day: 4,
    dateStr: '19 de Diciembre',
    title: 'Día Cuarto — El Rechazo en Belén y la Falta de Posada',
    historicalConsideration: `Llegados por fin a Belén, agotados por el viaje y anhelantes de encontrar un techo donde refugiarse, María y José recorren las calles de la ciudad llamando de puerta en puerta. Mas todas las posadas estaban colmadas y en todas partes reciben una negativa fría y desabrida.

Nadie se compadece de la tierna doncella cuyo rostro refleja la inminencia del sagrado alumbramiento; nadie tiene compasión del anciano carpintero que con lágrimas en los ojos suplica un rincón de caridad. "No hay lugar para ustedes aquí", es la constante respuesta.

¡Qué dolor para el tierno corazón de José! El Creador del universo, el Rey de la gloria, mendigando un rincón en su propia creación, y los hombres, encerrados en sus egoísmos y comodidades, le cierran las puertas en las narices.`,
    familyReflection: `Este pasaje del Evangelio nos sacude el corazón: "Vino a los suyos, y los suyos no lo recibieron." (Jn 1,11). ¿Cuántas veces nosotros mismos le cerramos la puerta a Jesús cuando le cerramos la puerta al hermano necesitado, al abuelo que pide atención, al familiar solitario o al vecino en apuros?

Que en nuestra casa nunca se escuche el "no hay posada". Que nuestra mesa esté siempre abierta a la caridad, que compartamos un plato de buñuelo y natilla con quien no tiene con qué celebrar, y que el Niño Dios encuentre en nuestro corazón una posada tibia y acogedora.`,
    petitions: [
      'Para que sepamos abrir las puertas de nuestro hogar a los desamparados.',
      'Por los ancianos que viven en la soledad y el abandono en estas fiestas.',
      'Para que desterremos la indiferencia y el egoísmo de nuestra comunidad.',
      'Por las instituciones de caridad que acogen a los desvalidos en Colombia.',
    ],
    closingPrayer: '¡Oh Divino Niño, rechazado por los hombres en Belén! Perdona nuestras durezas de corazón y ven a nacer en mi alma. Te prometo que en ella encontrarás siempre posada, amor, desagravio y reverente adoración. Amén. 🕯️',
  },
  {
    day: 5,
    dateStr: '20 de Diciembre',
    title: 'Día Quinto — El Establo de Belén y la Riqueza de la Pobreza',
    historicalConsideration: `Rechazados por todos, cae la noche sobre Belén y arrecia el frío invernal. José recuerda entonces que en las afueras de la ciudad, en las laderas del campo, existen unas cuevas o grutas que sirven de establo a los bueyes y asnos de los pastores. Hacia allá dirige con premura los pasos de la Santísima Virgen.

Al entrar en aquella gruta fría, desprovista de toda comodidad terrena, la limpian y barren con reverencia. Un rústico pesebre de madera, con un puñado de paja seca, es el trono que el mundo ofrece al Rey de reyes. Y sin embargo, ¡qué paz celestial, qué fragancia de santidad inunda aquel bendito rincón!

Allí, entre un buey y un asno que con su aliento dan calor al ambiente, se dispone a nacer el Salvador prometido. Dios ha elegido la pobreza más absoluta para desengañarnos de las riquezas falaces del mundo y enseñarnos a buscar únicamente los tesoros eternos.`,
    familyReflection: `En Colombia, el pesebre es el centro de la fiesta. Con musgo, aserrín de colores, papel periódico pintado de verde y montañas hechas con amor por las manos de toda la familia. Ese pesebre nos recuerda que no se necesita riqueza material para tener un hogar bendecido.

La verdadera riqueza de una familia colombiana se mide en risas compartidas, en anécdotas alrededor de la mesa, en abrazos sinceros y en la bendición de tener salud y a nuestros seres queridos con vida. Demos gracias hoy por nuestro techo y por todo lo que Dios nos concede.`,
    petitions: [
      'Por el agradecimiento sincero por el techo, la comida y la familia que Dios nos da.',
      'Por los niños de los barrios y veredas más humildes de nuestra patria.',
      'Para que aprendamos a desapegarnos de lo material y valorar lo espiritual.',
      'Por los campesinos colombianos que labran la tierra y cuidan los campos.',
    ],
    closingPrayer: 'Niño Jesús del Pesebre, que escogiste la pobreza de un establo para enriquecernos con tu gracia: arranca de nosotros el apego desmedido a las cosas terrenas y concédenos la riqueza celestial de tu santo amor. Amén. 🕯️',
  },
  {
    day: 6,
    dateStr: '21 de Diciembre',
    title: 'Día Sexto — La Espera Santa de María Santísima',
    historicalConsideration: `En las horas previas al sagrado nacimiento, contemplemos a la Virgen Inmaculada en el recogimiento más sublime y en la oración más ardiente. Elevada en éxtasis de amor divino, su alma santísima conversa con el Dios que lleva en sus entrañas.

Todo en María es pureza, todo es adoración, todo es entrega incondicional. Ningún dolor terrenal turba la serenidad de su espíritu, pues el Verbo Divino, al nacer, respetará la integridad de su doncellez virginal como el rayo de sol atraviesa el cristal sin romperlo ni mancharlo.

¡Dichoso establo de Belén, convertido en templo viviente del Altísimo! ¡Dichosa María, arca de la nueva y eterna alianza, trono de la eterna Sabiduría!`,
    familyReflection: `En este sexto día de la novena, honramos de corazón a las madres de nuestra familia: a las mamás que con ternura incansable cuidan a sus hijos, a las abuelas que con sus oraciones sostienen a varias generaciones, a las tías y hermanas que brindan apoyo constante.

María es el modelo supremo de la madre: paciente, orante, atenta, llena de fortaleza en medio de la sencillez. Que en nuestro hogar haya siempre una palabra de gratitud, un beso respetuoso y un homenaje sincero para las mujeres que dan vida y amor a nuestra familia.`,
    petitions: [
      'Por todas las madres de nuestra familia, vivas y difuntas.',
      'Por las mujeres gestantes, para que sientan la bendición de la vida en sus entrañas.',
      'Por las madres cabeza de familia en Colombia que sacan adelante a sus hijos con heroico sacrificio.',
      'Para que en nuestro hogar reine el respeto, la devoción y el cariño mutuo.',
    ],
    closingPrayer: 'Madre Purísima de Belén, alcánzanos de tu divino Hijo la gracia de una pureza interior y un recogimiento santo, para que nuestras almas sean el sagrario donde habite siempre Jesús Sacramentado. Amén. 🕯️',
  },
  {
    day: 7,
    dateStr: '22 de Diciembre',
    title: 'Día Séptimo — El Canto Celestial de los Ángeles y la Gloria de Dios',
    historicalConsideration: `Llegada la media noche sagrada, los cielos se rasgan y una multitud de coros angélicos desciende sobre los campos de Belén. La luz increada inunda las tinieblas de la tierra y los espíritus celestes entonan el himno más hermoso que jamás se haya escuchado en el orbe:

"¡Gloria a Dios en las alturas, y en la tierra paz a los hombres de buena voluntad!" (Lc 2,14).

La gloria de Dios y la paz de los hombres: he aquí el compendio de la obra de la Redención. Dios es glorificado porque su justicia y su misericordia se han besado en la Encarnación; los hombres reciben la paz porque el Príncipe de la Paz ha venido a destruir el imperio del pecado y de la muerte.`,
    familyReflection: `¡Paz a los hombres de buena voluntad! Esta es la gran promesa navideña para Colombia. La paz no es solo un acuerdo firmado; la paz comienza en la sala de nuestra casa, en el comedor, en la forma en que nos hablamos, en no guardar rencores ni alzar la voz con ira.

Que el himno de los ángeles resuene hoy en nuestro corazón: seamos constructores de paz en nuestra familia, en el trabajo, con los vecinos y en las redes sociales. Sembremos serenidad donde haya tormenta y comprensión donde haya desacuerdos.`,
    petitions: [
      'Por la paz duradera y verdadera de Colombia en todos sus rincones.',
      'Por la reconciliación entre familiares y vecinos distanciados.',
      'Para que aprendamos a hablar con mansedumbre, respeto y afecto.',
      'Por los que trabajan por la justicia social y la convivencia en nuestra nación.',
    ],
    closingPrayer: 'Príncipe Celestial de la Paz, haz que resuene en nuestro hogar el canto de tus santos ángeles. Que desterremos toda discordia y rencor, y que tu paz santísima reine hoy y siempre en nuestros corazones. Amén. 🕯️',
  },
  {
    day: 8,
    dateStr: '23 de Diciembre',
    title: 'Día Octavo — El Anuncio a los Pastores y la Prontitud de la Fe',
    historicalConsideration: `Cerca de la gruta de Belén pernoctaban unos sencillos pastores, vigilando por turnos sus rebaños en la noche. De pronto, un resplandor admirable los envuelve y el Ángel del Señor se presenta ante ellos. Sobrecogidos de espanto, caen en tierra; mas el Ángel les dice con dulce voz:

"No temáis, porque os traigo una buena nueva que será de gran gozo para todo el pueblo: os ha nacido hoy, en la ciudad de David, un Salvador, que es Cristo el Señor. Y esta será para vosotros la señal: hallaréis al niño envuelto en pañales y acostado en un pesebre." (Lc 2, 10-12).

Apenas desaparecida la visión angélica, los pastores no dudan ni postergan su marcha. "Vayamos a Belén", se dicen unos a otros; y corriendo a toda prisa, encuentran a María, a José y al Niño acostado en el pesebre. Se postran en tierra, lo adoran con fe viva y le ofrecen sus sencillos regalos de queso, lana y leche.`,
    familyReflection: `Estamos a pocas horas de la gran Nochebuena. Los pastores nos dan un ejemplo maravilloso: no dudaron, no dijeron "mañana vamos", no pusieron excusas. Corrieron a buscar al Niño.

Cuántas veces aplazamos las cosas importantes: dar un abrazo, decir "te quiero", visitar a un pariente enfermo o rezar en familia. Que en este penúltimo día de la novena tengamos la prisa santa de los pastores para hacer el bien, para demostrar cariño y para prepararnos espiritualmente para recibir a Jesús.`,
    petitions: [
      'Para que tengamos una fe viva, activa y sin vacilaciones como la de los pastores.',
      'Por los niños de nuestra familia, para que conserven la inocencia y el fervor ante el pesebre.',
      'Por los sacerdotes, religiosos y misioneros que anuncian la Buena Nueva en Colombia.',
      'Para que vivamos estas horas previas a la Navidad en un ambiente de recogimiento y alegría sana.',
    ],
    closingPrayer: '¡Oh Niño Jesús, que te revelaste primero a los sencillos pastores! Danos un corazón puro e inocente como el de ellos, para que sepamos correr a tu encuentro y ofrecerte con gozo el tributo de nuestras vidas. Amén. 🕯️',
  },
  {
    day: 9,
    dateStr: '24 de Diciembre',
    title: 'Día Noveno — ¡Ha Nacido el Salvador! ¡Nochebuena y Cumplimiento de la Promesa!',
    historicalConsideration: `¡Llegó la noche venturosa, la noche santa entre todas las noches del año! A la media noche virginal, sin menoscabo de su integridad y en un rapto de éxtasis celestial, nace el Redentor del mundo, Dios de Dios, Luz de Luz, Dios verdadero de Dios verdadero.

La Virgen Inmaculada contempla por vez primera el rostro adorable de su Hijo y de su Dios; lo toma en sus brazos con infinita ternura, lo envuelve en pobres pañales y lo recuesta amorosamente sobre la paja del pesebre. San José, de rodillas, derrama lágrimas de indecible consuelo y adora a aquel Divino Infante que le llamará padre sobre la tierra.

¡Cielos y tierra, cantad al unísono alabanzas al Señor! La serpiente antigua ha sido vencida; la muerte ha perdido su aguijón; la esperanza ha florecido en el desierto del mundo. ¡Cristo ha nacido, venid y adorémosle!`,
    familyReflection: `¡Ha llegado la Nochebuena colombiana! La noche de los buñuelos calientes, de la natilla con dulce de mora, de los abrazos apretados después de las doce, de los villancicos a todo pulmón con panderetas y campanas, de los regalos que se abren con ilusión bajo el arbolito.

Antes de sentarnos a la cena y destapar los paquetes, hagamos una pausa sagrada en familia. Miremos al Niño en el pesebre, tomémonos de las manos y demos gracias a Dios porque estamos vivos, porque nos tenemos los unos a los otros, porque el Niño Jesús ha querido nacer una vez más en medio de nuestra familia. ¡Feliz y santa Navidad para todos!`,
    petitions: [
      'Por la bendición de Dios sobre cada uno de los miembros de nuestra familia, presentes y ausentes.',
      'Por las almas de nuestros seres queridos difuntos, para que celebren la Navidad eterna en el Cielo.',
      'Por una Colombia unida, fraterna, próspera y en paz para el año 2026.',
      'Para que la gracia de este santo nacimiento permanezca viva en nuestros corazones durante todo el año nuevo.',
    ],
    closingPrayer: '¡Oh Divino Niño Jesús, recién nacido en Belén! Te abrimos las puertas de par en par de nuestro hogar y de nuestras almas. Sé Tú el Rey de nuestra familia, nuestro protector en el camino y nuestra gloria eterna en el Cielo. ¡Feliz Navidad, Niño Dios adorado! Amén. 🕯️🎄🌟',
  },
];

/* ============================================================
   LOS 12 GOZOS COMPLETOS DE LA NOVENA TRADICIONAL COLOMBIANA
   ============================================================ */

const GOZO_CHORUS = {
  label: 'ESTRIBILLO (Se canta con alegría después de cada estrofa)',
  text: `¡Dulce Jesús mío, mi niño adorado,
ven a nuestras almas!
¡Ven, no tardes tanto!`,
};

interface GozoVerse {
  num: number;
  title: string;
  stanza: string;
}

const GOZOS_12_ESTROFAS: GozoVerse[] = [
  {
    num: 1,
    title: 'Oh Sapiencia Suma',
    stanza: `¡Oh, Sapiencia suma del Dios soberano,
que a infantil alcance te rebajas sacro!
¡Oh, Divino Niño, ven para enseñarnos
la prudencia que hace verdaderos sabios!`,
  },
  {
    num: 2,
    title: 'Oh Adonai Potente',
    stanza: `¡Oh, Adonai potente que a Moisés hablando,
de Sinaí en la cumbre diste al pueblo el mando!
¡Ah, ven prontamente porque ya expiramos,
y extiende al salvarnos tu potente brazo!`,
  },
  {
    num: 3,
    title: 'Oh Raíz Sagrada de Jesé',
    stanza: `¡Oh, raíz sagrada de Jesé que enhiesto
presentas al orbe tu fragante cetro!
¡Dulcísimo Niño, que has sido llamado
lirio de los valles, flor de los collados!`,
  },
  {
    num: 4,
    title: 'Llave de David',
    stanza: `¡Llave de David que abre al desterrado
las celestes puertas del regio palacio!
¡Sácanos, ¡oh Niño!, con tu blanca mano,
de la cárcel triste que labró el pecado!`,
  },
  {
    num: 5,
    title: 'Oh Lumbre de Oriente',
    stanza: `¡Oh, lumbre de Oriente, Sol de eternos rayos,
que entre las tinieblas tu esplendor veamos!
¡Niño tan precioso, dicha del cristiano,
luzca la sonrisa de tus dulces labios!`,
  },
  {
    num: 6,
    title: 'Espejo Sin Mancha',
    stanza: `¡Espejo sin mancha, Santo de los santos,
sin igual imagen del Dios soberano!
¡Borra nuestras culpas, salva al desterrado
y, en forma de niño, da al mísero amparo!`,
  },
  {
    num: 7,
    title: 'Rey de las Naciones',
    stanza: `¡Rey de las naciones, Emmanuel preclaro,
de Israel anhelo, Pastor del rebaño!
¡Niño que apacientas con suave cayado
ya la oveja arisca, ya el cordero manso!`,
  },
  {
    num: 8,
    title: 'Ábranse los Cielos',
    stanza: `¡Ábranse los cielos y llueva de lo alto
bienhechor rocío como riego santo!
¡Ven ya, Niño mío, ven, Dios humanado,
luce, hermosa estrella, brota, flor del campo!`,
  },
  {
    num: 9,
    title: 'Ven que ya María',
    stanza: `¡Ven que ya María previene sus brazos,
do su Niño vea, en tiempo cercano!
¡Ven, que ya José, con anhelo sacro,
se dispone a hacerse de tu amor sagrario!`,
  },
  {
    num: 10,
    title: 'Del Débil Auxilio',
    stanza: `¡Del débil auxilio, del doliente amparo,
consuelo del triste, luz del desterrado!
¡Vida de mi vida, mi dueño adorado,
mi constante amigo, mi divino hermano!`,
  },
  {
    num: 11,
    title: 'Vean Ante Mis Ojos',
    stanza: `¡Vean ante mis ojos, de ti enamorados,
bese ya tus plantas, bese ya tus manos!
¡Prosternado en tierra, te tiendo los brazos,
y aún más que mis frases, te dice mi llanto!`,
  },
  {
    num: 12,
    title: 'Ven, Salvador Nuestro',
    stanza: `¡Ven, Salvador nuestro, por quien suspiramos,
ven a nuestras almas, ven no tardes tanto!
¡Ven a nuestras almas, ven no tardes tanto!`,
  },
];

/* ============================================================
   ORACIONES TRADICIONALES COMPLETAS (TEXTOS CANÓNICOS ÍNTEGROS)
   ============================================================ */

interface CanonicalPrayer {
  id: string;
  title: string;
  subtitle: string;
  roleHint: string;
  text: string;
  traditionalResponse?: string;
}

const CANONICAL_PRAYERS: CanonicalPrayer[] = [
  {
    id: 'todos_los_dias',
    title: 'Oración para Todos los Días',
    subtitle: 'Se reza al inicio de cada día de la Novena',
    roleHint: 'Leída por el cabeza de familia o quien dirige el rezo',
    text: `Benignísimo Dios de infinita caridad, que tanto amasteis a los hombres, que les disteis en vuestro Hijo la mejor prenda de vuestro amor, para que hecho hombre en las entrañas de una Virgen naciese en un pesebre para nuestra salud y remedio; yo, en nombre de todos los hombres, os doy infinitas gracias por tan soberano beneficio.

En retorno de él os ofrezco la pobreza, humildad y demás virtudes de vuestro Hijo humanado, suplicándoos por sus divinos méritos, por las incomodidades en que nació y por las tiernas lágrimas que derramó en el pesebre, que dispongáis nuestros corazones con humildad profunda, con amor encendido, con total desprecio de todo lo terreno, para que el recién nacido Jesús tenga en ellos su cuna y more eternamente. Amén.`,
    traditionalResponse: 'Aquí se rezan tres veces: Gloria al Padre, al Hijo y al Espíritu Santo. Como era en el principio, ahora y siempre, por los siglos de los siglos. Amén.',
  },
  {
    id: 'virgen_maria',
    title: 'Oración a la Santísima Virgen María',
    subtitle: 'En honor a la Madre del Salvador',
    roleHint: 'Tradicionalmente leída por las damas de la casa o los niños',
    text: `Soberana María, que por vuestras grandes virtudes y especialmente por vuestra humildad, merecisteis que todo un Dios os escogiese por madre suya, os suplico que preparéis y dispongáis mi alma y la de todos los que en este tiempo hiciesen esta novena, para el nacimiento espiritual de vuestro adorado Hijo.

¡Oh dulcísima Madre!, comunicadme algo del profundo recogimiento y divina ternura con que lo aguardasteis vos, para que nos hagáis menos indignos de verle, amarle y adorarle por toda la eternidad. Amén.`,
    traditionalResponse: 'Aquí se reza tres veces: Dios te salve María, llena eres de gracia, el Señor es contigo; bendita tú eres entre todas las mujeres, y bendito es el fruto de tu vientre, Jesús. Santa María, Madre de Dios, ruega por nosotros pecadores, ahora y en la hora de nuestra muerte. Amén.',
  },
  {
    id: 'san_jose',
    title: 'Oración a San José',
    subtitle: 'Custodio del Redentor y Patrono de la Familia',
    roleHint: 'Tradicionalmente leída por los padres de familia',
    text: `¡Oh santísimo José, esposo de María y padre adoptivo de Jesús! Infinitas gracias doy a Dios porque os escogió para tan soberanos ministerios y os adornó con todos los dones proporcionados a tan excelente grandeza.

Os ruego, por el amor que tuvisteis al Divino Niño, me abracéis en fervorosos deseos de verle y recibirle sacramentalmente, mientras en su divina esencia le veo y le gozo en el Cielo. Amén.`,
    traditionalResponse: 'Aquí se reza un Padrenuestro, un Avemaría y un Gloria al Padre.',
  },
  {
    id: 'nino_jesus',
    title: 'Oración al Niño Jesús',
    subtitle: 'Plegaria cumbre de la Novena de Aguinaldos',
    roleHint: 'Rezada por todos los presentes juntos o por los más pequeños',
    text: `Señor, acuérdate de nosotros y ven a visitarnos con tu paz; líbranos de la condenación eterna para que gocemos con corazón puro de tu presencia.

¡Oh Dios, que nos alegras con la memoria anual del nacimiento de tu Unigénito Jesucristo!, concédenos que así como le recibimos con gozo por Redentor, así también le veamos seguros cuando viniere como Juez, a nuestro Señor Jesucristo tu Hijo, que contigo vive y reina en unidad del Espíritu Santo, por todos los siglos de los siglos. Amén.`,
    traditionalResponse: 'Aquí se reza un Padrenuestro y se hacen las peticiones secretas de la familia.',
  },
  {
    id: 'paz_colombia',
    title: 'Oración por la Paz y Prosperidad de Colombia',
    subtitle: 'Plegaria entrañable de nuestra amada tierra',
    roleHint: 'Oración especial comunitaria',
    text: `Señor Jesús, Príncipe de la Paz: en esta Navidad consagramos a Ti a toda nuestra patria Colombia.

Tú que conoces los anhelos y las penas de nuestro pueblo trabajador y noble, derrama tu bendición sobre nuestras ciudades, campos, montañas y costas. Sana las heridas de la violencia, el desamor y la injusticia. Concede a nuestros gobernantes sabiduría y rectitud, a nuestras familias concordia y pan digno, y a nuestros jóvenes horizontes llenos de esperanza.

Que la estrella de Belén brille sobre nuestra patria y haga de Colombia una tierra de reconciliación, hermandad y progreso para todos. Amén. 🇨🇴`,
  },
  {
    id: 'difuntos_familia',
    title: 'Oración por los Familiares Difuntos',
    subtitle: 'En memoria de quienes nos precedieron en el Cielo',
    roleHint: 'Momento de silencio y recogimiento familiar',
    text: `Padre de bondad, en esta noche de alegría navideña traemos al corazón la memoria de todos los abuelos, padres, hermanos, hijos y amigos de nuestra familia que ya han partido de este mundo hacia tu presencia.

Dales, Señor, el descanso eterno y brille para ellos la luz perpetua. Que desde el Reino Celestial intercedan por nosotros, para que cuando llegue nuestra hora, podamos reunirnos todos juntos en el banquete eterno de tu Gloria. Descansen en paz. Amén. 🕯️`,
  },
];

/* ============================================================
   VILLANCICOS COLOMBIANOS POPULARES COMPLETOS
   ============================================================ */

interface ColombianCarol {
  title: string;
  notes: string;
  verses: string[];
}

const COLOMBIAN_CAROLS: ColombianCarol[] = [
  {
    title: 'Tutaina',
    notes: 'El clásico infaltable de las novenas colombianas',
    verses: [
      `Tutaina tuturuma
tutaina tuturumaina
tutaina tuturuma turuma
tutaina tuturumaina.`,

      `Los pastores de Belén
vienen a adorar al Niño;
la Virgen y San José
los reciben con cariño.`,

      `Tutaina tuturuma
tutaina tuturumaina
tutaina tuturuma turuma
tutaina tuturumaina.`,

      `Tres reyes vienen también
con incienso, mirra y oro,
a ofrecer a Dios su rey
el más grande de sus tesoros.`,

      `Tutaina tuturuma
tutaina tuturumaina
tutaina tuturuma turuma
tutaina tuturumaina.`,
    ],
  },
  {
    title: 'Mi Burrito Sabanero',
    notes: 'Alegría contagiosa para grandes y chicos',
    verses: [
      `Con mi burrito sabanero
voy camino de Belén,
con mi burrito sabanero
voy camino de Belén.
Si me ven, si me ven,
voy camino de Belén.
Si me ven, si me ven,
voy camino de Belén.`,

      `El lucerito mañanero
ilumina mi sendero,
el lucerito mañanero
ilumina mi sendero.
Si me ven, si me ven,
voy camino de Belén.
Si me ven, si me ven,
voy camino de Belén.`,

      `Con mi cuatrico voy cantando,
mi burrito va trotando,
con mi cuatrico voy cantando,
mi burrito va trotando.
Si me ven, si me ven,
voy camino de Belén.
Si me ven, si me ven,
voy camino de Belén.`,

      `¡Tuki tuki tuki tuki,
tuki tuki tuki ta!
¡Apúrate mi burrito
que ya vamos a llegar!
¡Tuki tuki tuki tuki,
tuki tuki tuki tu!
¡Apúrate mi burrito,
vamos a ver a Jesús!`,
    ],
  },
  {
    title: 'A la Nanita Nana',
    notes: 'Arrullo tradicional al Divino Infante',
    verses: [
      `A la nanita nana, nanita ella,
nanita ella.
Mi Jesús tiene sueño,
bendito sea, bendito sea.`,

      `Fuentecilla que corres
clara y sonora,
ruiseñor que en la selva
cantando lloras:
callad mientras la cuna
se balancea,
a la nanita nana,
nanita ella.`,

      `A la nanita nana, nanita ella,
nanita ella.
Mi Jesús tiene sueño,
bendito sea, bendito sea.`,

      `Pimpollo de canela,
lirio en capullo,
duérmete sin recelo
con mi murmullo.
Duérmete, niño hermoso,
de mi consuelo,
que en tus ojos divinos
se mira el cielo.`,
    ],
  },
  {
    title: 'Los Peces en el Río',
    notes: 'Ritmo festivo tradicional con palmas y maracas',
    verses: [
      `La Virgen se está peinando
entre cortina y cortina;
los cabellos son de oro
y el peine de plata fina.`,

      `Pero mira cómo beben
los peces en el río,
pero mira cómo beben
por ver a Dios nacido.
Beben y beben y vuelven a beber,
los peces en el río
por ver a Dios nacer.`,

      `La Virgen está lavando
y tendiendo en el romero;
los pajarillos cantando
y el romero floreciendo.`,

      `Pero mira cómo beben
los peces en el río,
pero mira cómo beben
por ver a Dios nacido.
Beben y beben y vuelven a beber,
los peces en el río
por ver a Dios nacer.`,

      `La Virgen va caminando
va caminando solita,
no lleva más compañía
que el Niño de su manita.`,

      `Pero mira cómo beben
los peces en el río,
pero mira cómo beben
por ver a Dios nacido.
Beben y beben y vuelven a beber,
los peces en el río
por ver a Dios nacer.`,
    ],
  },
  {
    title: 'Campana Sobre Campana',
    notes: 'Clásico resonar de campanas navideñas',
    verses: [
      `Campana sobre campana,
y sobre campana una,
asómate a la ventana,
verás al Niño en la cuna.`,

      `Belén, campanas de Belén,
que los ángeles tocan,
¿qué nueva me traéis?`,

      `Recogido tu rebaño,
¿a dónde vas, pastorcillo?
Voy a llevar al portal
requesón, manteca y vino.`,

      `Belén, campanas de Belén,
que los ángeles tocan,
¿qué nueva me traéis?`,

      `Campana sobre campana,
y sobre campana dos,
asómate a la ventana,
porque está naciendo Dios.`,

      `Belén, campanas de Belén,
que los ángeles tocan,
¿qué nueva me traéis?`,
    ],
  },
  {
    title: 'Anton Tiruriruriru',
    notes: 'Villancico pastoril tradicional de aguinaldo',
    verses: [
      `Antón tiruriruriru,
Antón tirurirura.
Antón tiruriruriru,
Antón tirurirura.`,

      `Jesús al pesebre
vamos a adorar,
Jesús al pesebre
vamos a adorar.`,

      `Duérmete, niño chiquito,
que la noche viene ya;
cierra tus lindos ojitos,
que tu madre te arrullará.`,

      `Antón tiruriruriru,
Antón tirurirura.
Antón tiruriruriru,
Antón tirurirura.`,
    ],
  },
  {
    title: 'Noche de Paz',
    notes: 'Solemne himno de amor y serenidad',
    verses: [
      `Noche de paz, noche de amor,
todo duerme en derredor.
Entre los astros que esparcen su luz,
bella, anunciando al niñito Jesús,
brilla la estrella de paz,
brilla la estrella de paz.`,

      `Noche de paz, noche de amor,
oye humilde el fiel pastor
coros celestes que anuncian salud,
gracias y glorias en gran plenitud,
por nuestro buen Redentor,
por nuestro buen Redentor.`,

      `Noche de paz, noche de amor,
ved qué bello resplandor
luce en el rostro del Niño Jesús,
en el pesebre, del mundo la luz,
astro de eterno fulgor,
astro de eterno fulgor.`,
    ],
  },
];

/* ============================================================
   COMPONENTE PRINCIPAL: NOVENA DE AGUINALDOS COLOMBIANA
   ============================================================ */

export const NovenaModule: React.FC = () => {
  const [selectedDayNum, setSelectedDayNum] = useState<number>(1);
  const [activeSection, setActiveSection] = useState<'guided' | 'consideration' | 'gozos' | 'villancicos' | 'oraciones'>('guided');
  const [guidedStep, setGuidedStep] = useState<number>(1);
  const [shakeCount, setShakeCount] = useState(0);

  // Filters for sub-sections
  const [prayerFilter, setPrayerFilter] = useState<string>('all');
  const [carolFilter, setCarolFilter] = useState<string>('all');
  const [carolSearch, setCarolSearch] = useState<string>('');
  const [gozoFilter, setGozoFilter] = useState<string>('all');

  // Accordion states
  const [expandedGozoIndex, setExpandedGozoIndex] = useState<number | null>(0);
  const [expandedCarolIndex, setExpandedCarolIndex] = useState<number | null>(0);
  const [expandedPrayerId, setExpandedPrayerId] = useState<string | null>('todos_los_dias');

  const currentDay = NOVENA_DAYS.find(d => d.day === selectedDayNum) || NOVENA_DAYS[0];

  const handleTambourine = () => {
    soundFX.playTambourine?.();
    setShakeCount(prev => prev + 1);
    if (shakeCount > 0 && shakeCount % 6 === 0) {
      fireHolidayConfetti();
    }
  };

  const guidedStepsList = [
    { num: 1, title: '1. Oración para Todos los Días' },
    { num: 2, title: `2. Consideración del Día ${selectedDayNum}` },
    { num: 3, title: '3. Oración a la Santísima Virgen' },
    { num: 4, title: '4. Oración a San José' },
    { num: 5, title: '5. Los Gozos Navideños' },
    { num: 6, title: '6. Oración al Niño Jesús' },
    { num: 7, title: '7. Villancicos & Compartir' },
  ];

  const nextGuidedStep = () => {
    soundFX.playClick?.();
    if (guidedStep < 7) {
      setGuidedStep(prev => prev + 1);
    } else {
      fireHolidayConfetti();
      soundFX.playJingleBell?.();
    }
  };

  const prevGuidedStep = () => {
    soundFX.playClick?.();
    if (guidedStep > 1) {
      setGuidedStep(prev => prev - 1);
    }
  };

  return (
    <div className="space-y-6 pb-20">

      {/* ── HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest font-bold text-amber-300 flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-amber-400" /> Tradición Colombiana 100% Canónica
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-cinzel text-white">
            Novena de Aguinaldos 🕯️
          </h2>
          <p className="text-xs text-emerald-200/80 mt-0.5">
            Textos íntegros de Fray Fernando de Jesús Larrea · 12 Gozos tradicionales · Rezo guiado paso a paso.
          </p>
        </div>

        {/* Pandereta / Maraca Interactiva */}
        <button
          onClick={handleTambourine}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-pine-950 font-black text-xs shadow-lg shadow-amber-500/30 active:scale-90 transition-transform self-start sm:self-auto cursor-pointer"
        >
          <span className="text-xl">🪇</span>
          <span>¡Tocar Pandereta / Maraca!</span>
          <span className="px-2 py-0.5 rounded-full bg-pine-950/20 text-[11px] font-mono font-bold">
            {shakeCount}
          </span>
        </button>
      </div>

      {/* ── SELECTOR VISUAL DE LOS 9 DÍAS (16 AL 24 DE DICIEMBRE) — SIN CLIPPING NI SCROLL ── */}
      <div className="glass-card rounded-3xl p-4 sm:p-5 border border-amber-400/30 bg-black/40 space-y-3 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-pine-950 flex items-center justify-center text-lg flex-shrink-0 shadow-md font-bold">
              {selectedDayNum === 9 ? '👶' : '⭐'}
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-amber-300 font-bold flex items-center gap-1.5">
                Día {selectedDayNum} de la Novena de Aguinaldos · {currentDay.dateStr}
              </p>
              <h4 className="text-sm sm:text-base font-black text-white font-cinzel line-clamp-1">
                {currentDay.title}
              </h4>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              type="button"
              disabled={selectedDayNum <= 1}
              onClick={() => {
                soundFX.playClick?.();
                setSelectedDayNum(prev => Math.max(1, prev - 1));
                setGuidedStep(1);
              }}
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-amber-400/40 text-xs font-bold text-emerald-200 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer flex items-center gap-1"
            >
              ← <span className="hidden sm:inline">Anterior</span>
            </button>
            <span className="text-xs font-mono font-bold text-amber-300 px-2 py-1 rounded-lg bg-amber-400/10 border border-amber-400/25">
              {selectedDayNum}/9
            </span>
            <button
              type="button"
              disabled={selectedDayNum >= 9}
              onClick={() => {
                soundFX.playClick?.();
                setSelectedDayNum(prev => Math.min(9, prev + 1));
                setGuidedStep(1);
              }}
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-amber-400/40 text-xs font-bold text-emerald-200 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer flex items-center gap-1"
            >
              <span className="hidden sm:inline">Siguiente</span> →
            </button>
          </div>
        </div>

        {/* 9 Day Visual Grid (Responsive, Touch-friendly, Zero layout clip) */}
        <div className="grid grid-cols-3 sm:grid-cols-9 gap-1.5 pt-1">
          {NOVENA_DAYS.map(d => {
            const isCurrent = d.day === selectedDayNum;
            return (
              <button
                key={d.day}
                type="button"
                onClick={() => {
                  soundFX.playClick?.();
                  setSelectedDayNum(d.day);
                  setGuidedStep(1);
                }}
                className={`p-2 rounded-2xl flex flex-col items-center justify-center text-center transition-all cursor-pointer border ${
                  isCurrent
                    ? 'bg-gradient-to-b from-amber-400 to-amber-500 text-pine-950 border-amber-300 font-black shadow-lg shadow-amber-500/25 scale-[1.03]'
                    : 'bg-black/30 hover:bg-white/10 text-emerald-200/80 border-white/10 hover:border-amber-400/30'
                }`}
              >
                <span className="text-base sm:text-lg">{d.day === 9 ? '👶' : '🕯️'}</span>
                <span className="text-[11px] font-bold mt-0.5">Día {d.day}</span>
                <span className={`text-[9px] font-mono ${isCurrent ? 'text-pine-950/80 font-bold' : 'text-emerald-400/60'}`}>
                  {15 + d.day} Dic
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── NAVEGACIÓN PRINCIPAL DE SECCIONES (FLEX-WRAP RESPONSIVO) ── */}
      <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-3">
        {[
          { id: 'guided', label: `🕯️ Rezo Guiado (Día ${selectedDayNum})`, icon: Sparkles },
          { id: 'consideration', label: `📖 Consideración del Día`, icon: BookOpen },
          { id: 'gozos', label: '🎵 Los 12 Gozos', icon: Music },
          { id: 'oraciones', label: '🙏 Oraciones Canónicas', icon: Heart },
          { id: 'villancicos', label: '🎶 Villancicos Tradicionales', icon: Flame },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeSection === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                soundFX.playClick?.();
                setActiveSection(tab.id as any);
              }}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                isActive
                  ? 'bg-amber-400/25 text-amber-300 border border-amber-400/40 shadow-sm font-bold'
                  : 'bg-white/5 text-emerald-200/70 border border-white/5 hover:text-white hover:bg-white/10'
              }`}
            >
              <Icon className="w-3.5 h-3.5 text-amber-400/80" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ══════════════════════════════════════════════
          SECCIÓN 1: MODO REZO GUIADO (PASO A PASO)
      ══════════════════════════════════════════════ */}
      {activeSection === 'guided' && (
        <div className="max-w-3xl mx-auto space-y-5">
          {/* Progress stepper */}
          <div className="glass-card p-4 rounded-2xl border border-amber-400/25 bg-black/40 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-amber-300 font-bold flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" /> Rezo Tradicional en Familia · {currentDay.dateStr}
              </span>
              <span className="font-mono text-emerald-300 font-bold">
                Paso {guidedStep} de 7
              </span>
            </div>

            <div className="flex gap-1.5 overflow-x-auto scrollbar-none pt-1">
              {guidedStepsList.map(step => (
                <button
                  key={step.num}
                  onClick={() => setGuidedStep(step.num)}
                  className={`flex-1 min-w-[70px] py-1 px-2 rounded-lg text-[10px] font-bold text-center transition-all truncate border cursor-pointer ${
                    guidedStep === step.num
                      ? 'bg-amber-400 text-pine-950 border-amber-300'
                      : guidedStep > step.num
                      ? 'bg-emerald-900/40 text-emerald-300 border-emerald-500/30'
                      : 'bg-black/30 text-white/40 border-white/5'
                  }`}
                >
                  {step.title.split('.')[1]}
                </button>
              ))}
            </div>
          </div>

          {/* Stepper Content */}
          <div className="glass-card rounded-3xl p-6 sm:p-8 border border-amber-400/30 shadow-2xl bg-black/40 space-y-5">
            {/* PASO 1: Oración para todos los días */}
            {guidedStep === 1 && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="border-b border-white/10 pb-3">
                  <span className="text-[11px] font-bold text-amber-300 uppercase tracking-widest font-mono">Paso 1 de 7</span>
                  <h3 className="text-xl font-bold font-cinzel text-white mt-1">Oración para Todos los Días</h3>
                  <p className="text-xs text-emerald-300/80 italic">Todos se ponen en pie o de rodillas reverentemente.</p>
                </div>

                <div className="bg-black/50 p-5 rounded-2xl border border-white/10 text-sm text-emerald-100/95 leading-relaxed font-serif space-y-3">
                  <p>
                    Benignísimo Dios de infinita caridad, que tanto amasteis a los hombres, que les disteis en vuestro Hijo la mejor prenda de vuestro amor, para que hecho hombre en las entrañas de una Virgen naciese en un pesebre para nuestra salud y remedio; yo, en nombre de todos los hombres, os doy infinitas gracias por tan soberano beneficio.
                  </p>
                  <p>
                    En retorno de él os ofrezco la pobreza, humildad y demás virtudes de vuestro Hijo humanado, suplicándoos por sus divinos méritos, por las incomodidades en que nació y por las tiernas lágrimas que derramó en el pesebre, que dispongáis nuestros corazones con humildad profunda, con amor encendido, con total desprecio de todo lo terreno, para que el recién nacido Jesús tenga en ellos su cuna y more eternamente. Amén.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-400/25 text-xs text-amber-200 space-y-1">
                  <span className="font-bold block">🙏 Rezar en comunidad:</span>
                  <p className="italic">
                    "Gloria al Padre, al Hijo y al Espíritu Santo. Como era en el principio, ahora y siempre, por los siglos de los siglos. Amén." (Se reza 3 veces)
                  </p>
                </div>
              </div>
            )}

            {/* PASO 2: Consideración del Día */}
            {guidedStep === 2 && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="border-b border-white/10 pb-3">
                  <span className="text-[11px] font-bold text-amber-300 uppercase tracking-widest font-mono">
                    Paso 2 de 7 · {currentDay.dateStr}
                  </span>
                  <h3 className="text-xl font-bold font-cinzel text-white mt-1">
                    {currentDay.title}
                  </h3>
                  <p className="text-xs text-emerald-300/80 italic">Un familiar lee pausadamente la consideración en voz alta.</p>
                </div>

                <div className="space-y-3">
                  <span className="text-xs font-bold text-amber-300 uppercase tracking-wider block">
                    📜 Consideración Canónica Tradicional
                  </span>
                  <div className="bg-black/50 p-5 rounded-2xl border border-white/10 text-sm text-emerald-100/95 leading-relaxed font-serif space-y-3">
                    {currentDay.historicalConsideration.split('\n\n').map((p, i) => (
                      <p key={i}>{p}</p>
                    ))}
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider block">
                    🇨🇴 Meditación para la Familia de Hoy
                  </span>
                  <div className="bg-emerald-950/40 p-4 rounded-2xl border border-emerald-500/25 text-xs sm:text-sm text-white/90 leading-relaxed font-serif space-y-2">
                    {currentDay.familyReflection.split('\n\n').map((p, i) => (
                      <p key={i}>{p}</p>
                    ))}
                  </div>
                </div>

                {/* Peticiones */}
                <div className="space-y-2 pt-2">
                  <span className="text-xs font-bold text-amber-300 uppercase tracking-wider block">
                    🙏 Peticiones Familiares
                  </span>
                  <div className="space-y-1.5">
                    {currentDay.petitions.map((pet, i) => (
                      <div key={i} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-black/30 border border-white/5 text-xs text-emerald-100">
                        <span className="text-amber-400 font-bold">•</span>
                        <span>{pet}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Oración de cierre del día */}
                <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-400/25 text-xs text-amber-200 italic font-serif">
                  <span className="font-bold block not-italic mb-1 font-sans text-amber-300">Oración propia del día:</span>
                  {currentDay.closingPrayer}
                </div>
              </div>
            )}

            {/* PASO 3: Oración a la Virgen María */}
            {guidedStep === 3 && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="border-b border-white/10 pb-3">
                  <span className="text-[11px] font-bold text-amber-300 uppercase tracking-widest font-mono">Paso 3 de 7</span>
                  <h3 className="text-xl font-bold font-cinzel text-white mt-1">Oración a la Santísima Virgen María</h3>
                  <p className="text-xs text-emerald-300/80 italic">Proclamada con devoción filial a la Madre de Dios.</p>
                </div>

                <div className="bg-black/50 p-5 rounded-2xl border border-white/10 text-sm text-emerald-100/95 leading-relaxed font-serif space-y-3">
                  <p>
                    Soberana María, que por vuestras grandes virtudes y especialmente por vuestra humildad, merecisteis que todo un Dios os escogiese por madre suya, os suplico que preparéis y dispongáis mi alma y la de todos los que en este tiempo hiciesen esta novena, para el nacimiento espiritual de vuestro adorado Hijo.
                  </p>
                  <p>
                    ¡Oh dulcísima Madre!, comunicadme algo del profundo recogimiento y divina ternura con que lo aguardasteis vos, para que nos hagáis menos indignos de verle, amarle y adorarle por toda la eternidad. Amén.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-400/25 text-xs text-amber-200 space-y-1">
                  <span className="font-bold block">🙏 Rezar en comunidad:</span>
                  <p className="italic">
                    "Dios te salve María, llena eres de gracia, el Señor es contigo; bendita tú eres entre todas las mujeres, y bendito es el fruto de tu vientre, Jesús. Santa María, Madre de Dios, ruega por nosotros pecadores, ahora y en la hora de nuestra muerte. Amén." (Se reza 3 veces)
                  </p>
                </div>
              </div>
            )}

            {/* PASO 4: Oración a San José */}
            {guidedStep === 4 && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="border-b border-white/10 pb-3">
                  <span className="text-[11px] font-bold text-amber-300 uppercase tracking-widest font-mono">Paso 4 de 7</span>
                  <h3 className="text-xl font-bold font-cinzel text-white mt-1">Oración a San José</h3>
                  <p className="text-xs text-emerald-300/80 italic">Custodio del Redentor y Patrono protector de la familia.</p>
                </div>

                <div className="bg-black/50 p-5 rounded-2xl border border-white/10 text-sm text-emerald-100/95 leading-relaxed font-serif space-y-3">
                  <p>
                    ¡Oh santísimo José, esposo de María y padre adoptivo de Jesús! Infinitas gracias doy a Dios porque os escogió para tan soberanos ministerios y os adornó con todos los dones proporcionados a tan excelente grandeza.
                  </p>
                  <p>
                    Os ruego, por el amor que tuvisteis al Divino Niño, me abracéis en fervorosos deseos de verle y recibirle sacramentalmente, mientras en su divina esencia le veo y le gozo en el Cielo. Amén.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-400/25 text-xs text-amber-200 space-y-1">
                  <span className="font-bold block">🙏 Rezar en comunidad:</span>
                  <p className="italic">
                    Un Padrenuestro, un Avemaría y un Gloria al Padre.
                  </p>
                </div>
              </div>
            )}

            {/* PASO 5: Los Gozos Navideños */}
            {guidedStep === 5 && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div>
                    <span className="text-[11px] font-bold text-amber-300 uppercase tracking-widest font-mono">Paso 5 de 7</span>
                    <h3 className="text-xl font-bold font-cinzel text-white mt-1">Los 12 Gozos de la Novena</h3>
                    <p className="text-xs text-emerald-300/80 italic">¡Preparen panderetas, maracas y palmas!</p>
                  </div>
                  <button
                    onClick={handleTambourine}
                    className="px-3.5 py-2 rounded-xl bg-amber-400 text-pine-950 font-black text-xs shadow-md active:scale-95 flex items-center gap-1.5 cursor-pointer"
                  >
                    🪇 ¡Sonar!
                  </button>
                </div>

                {/* Estribillo principal */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/20 via-amber-400/25 to-amber-500/20 border-2 border-amber-400/50 text-center space-y-1 shadow-lg">
                  <span className="text-[10px] uppercase font-black text-amber-300 tracking-wider">
                    ESTRIBILLO (Cantar todos después de cada Gozo)
                  </span>
                  <p className="text-base sm:text-lg font-bold font-cinzel text-white leading-relaxed">
                    ¡Dulce Jesús mío, mi niño adorado...<br />
                    ven a nuestras almas, ven no tardes tanto!
                  </p>
                </div>

                {/* 12 Gozos list */}
                <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
                  {GOZOS_12_ESTROFAS.map(gozo => (
                    <div key={gozo.num} className="p-3.5 rounded-2xl bg-black/40 border border-white/10 space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-amber-400/25 text-amber-300 font-mono font-bold text-xs flex items-center justify-center">
                          {gozo.num}
                        </span>
                        <span className="text-xs font-bold text-amber-200">{gozo.title}</span>
                      </div>
                      <pre className="text-xs sm:text-sm text-emerald-100 font-serif leading-relaxed whitespace-pre-wrap pl-2 italic">
                        {gozo.stanza}
                      </pre>
                      <p className="text-[11px] text-amber-300/70 font-semibold italic text-right">
                        → (Todos): ¡Dulce Jesús mío, mi niño adorado, ven a nuestras almas, ven no tardes tanto!
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* PASO 6: Oración al Niño Jesús */}
            {guidedStep === 6 && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="border-b border-white/10 pb-3">
                  <span className="text-[11px] font-bold text-amber-300 uppercase tracking-widest font-mono">Paso 6 de 7</span>
                  <h3 className="text-xl font-bold font-cinzel text-white mt-1">Oración al Niño Jesús</h3>
                  <p className="text-xs text-emerald-300/80 italic">Todos de rodillas en torno al pesebre.</p>
                </div>

                <div className="bg-black/50 p-5 rounded-2xl border border-white/10 text-sm text-emerald-100/95 leading-relaxed font-serif space-y-3">
                  <p>
                    Señor, acuérdate de nosotros y ven a visitarnos con tu paz; líbranos de la condenación eterna para que gocemos con corazón puro de tu presencia.
                  </p>
                  <p>
                    ¡Oh Dios, que nos alegras con la memoria anual del nacimiento de tu Unigénito Jesucristo!, concédenos que así como le recibimos con gozo por Redentor, así también le veamos seguros cuando viniere como Juez, a nuestro Señor Jesucristo tu Hijo, que contigo vive y reina en unidad del Espíritu Santo, por todos los siglos de los siglos. Amén.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-400/25 text-xs text-amber-200 space-y-2">
                  <span className="font-bold block text-sm">🙏 Momento de Petición Familiar en Silencio:</span>
                  <p className="italic">
                    Cada integrante de la familia presenta en el secreto de su corazón una gracia especial que pide al Divino Niño en esta Navidad.
                  </p>
                  <p className="font-semibold pt-1">
                    Se concluye rezando un Padrenuestro comunitario.
                  </p>
                </div>
              </div>
            )}

            {/* PASO 7: Villancicos & Compartir */}
            {guidedStep === 7 && (
              <div className="space-y-4 animate-in fade-in duration-200 text-center">
                <div className="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-tr from-amber-500 to-amber-400 text-pine-950 flex items-center justify-center text-3xl shadow-xl shadow-amber-500/30">
                  🎉
                </div>

                <div>
                  <span className="text-[11px] font-bold text-amber-300 uppercase tracking-widest font-mono">Paso 7 de 7</span>
                  <h3 className="text-2xl font-bold font-cinzel text-white mt-1">
                    ¡Novena del Día {selectedDayNum} Cumplida!
                  </h3>
                  <p className="text-xs text-emerald-200/90 mt-1 max-w-md mx-auto">
                    Es momento de encender la alegría navideña: cantar villancicos con pandereta, abrazar a la familia y disfrutar de los buñuelos y la natilla.
                  </p>
                </div>

                {/* Quick carol player suggestion */}
                <div className="p-4 rounded-2xl bg-berry-950/40 border border-rose-500/25 text-left space-y-2">
                  <span className="text-xs font-bold text-rose-300 uppercase tracking-wider block">
                    🎶 Villancico sugerido para hoy:
                  </span>
                  <h4 className="text-base font-bold text-white font-cinzel">Tutaina</h4>
                  <pre className="text-xs text-emerald-100 font-serif leading-relaxed whitespace-pre-wrap">
                    {COLOMBIAN_CAROLS[0].verses.slice(0, 3).join('\n\n')}
                  </pre>
                  <button
                    onClick={() => setActiveSection('villancicos')}
                    className="text-amber-300 text-xs font-bold hover:underline block pt-1"
                  >
                    Ver más villancicos completos →
                  </button>
                </div>

                <div className="flex items-center justify-center gap-3 pt-2">
                  <button
                    onClick={() => {
                      setGuidedStep(1);
                      soundFX.playClick?.();
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-white/20 text-white/70 hover:text-white text-xs font-semibold cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Rezar de Nuevo
                  </button>
                </div>
              </div>
            )}

            {/* Stepper Navigation Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={prevGuidedStep}
                disabled={guidedStep === 1}
                className={`flex items-center gap-1 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  guidedStep === 1
                    ? 'opacity-30 cursor-not-allowed text-white/50'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                <ChevronLeft className="w-4 h-4" /> Anterior
              </button>

              <button
                type="button"
                onClick={nextGuidedStep}
                className="flex items-center gap-1 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-pine-950 font-bold text-xs shadow-md shadow-amber-500/20 active:scale-95 transition-all cursor-pointer"
              >
                <span>{guidedStep === 7 ? '¡Celebrar con Confeti! 🎊' : 'Siguiente Oración'}</span>
                {guidedStep < 7 && <ChevronRight className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════
          SECCIÓN 2: CONSIDERACIONES (DÍAS 1 AL 9)
      ══════════════════════════════════════════════ */}
      {activeSection === 'consideration' && (
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="glass-card rounded-3xl p-6 sm:p-8 border border-amber-400/30 shadow-2xl bg-black/40 space-y-5">
            <div className="border-b border-white/10 pb-4">
              <div className="flex items-center gap-3 mb-2">
                <span className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-400 text-pine-950 flex items-center justify-center font-black text-lg shadow-lg">
                  {currentDay.day}
                </span>
                <div>
                  <span className="text-[11px] font-bold text-amber-300 uppercase font-mono block">
                    🕯️ {currentDay.dateStr}
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold font-cinzel text-white leading-tight">
                    {currentDay.title}
                  </h3>
                </div>
              </div>
            </div>

            {/* Texto canónico tradicional */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-amber-300 uppercase tracking-wider block">
                📜 Texto Tradicional de la Novena de Aguinaldos
              </span>
              <div className="bg-black/50 p-5 rounded-2xl border border-white/10 text-sm text-emerald-100/95 leading-relaxed font-serif space-y-3">
                {currentDay.historicalConsideration.split('\n\n').map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            </div>

            {/* Meditación familiar de hoy */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider block">
                🇨🇴 Reflexión para la Familia Colombiana
              </span>
              <div className="bg-emerald-950/40 p-5 rounded-2xl border border-emerald-500/25 text-sm text-white/90 leading-relaxed font-serif space-y-3">
                {currentDay.familyReflection.split('\n\n').map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            </div>

            {/* Peticiones */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-bold text-amber-300 uppercase tracking-wider block">
                🙏 Peticiones para Este Día
              </span>
              <div className="space-y-1.5">
                {currentDay.petitions.map((pet, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-black/30 border border-white/5 text-xs text-emerald-100 leading-relaxed">
                    <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 font-mono font-bold flex items-center justify-center flex-shrink-0 text-[10px] mt-0.5">
                      {i + 1}
                    </span>
                    <p>{pet}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Oración de cierre */}
            <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-400/25 text-xs text-amber-200 italic font-serif">
              <span className="font-bold block not-italic mb-1 font-sans text-amber-300">Oración de cierre:</span>
              {currentDay.closingPrayer}
            </div>

            <div className="pt-2 flex items-center justify-between">
              <button
                onClick={() => {
                  setActiveSection('guided');
                  setGuidedStep(2);
                }}
                className="text-amber-300 text-xs font-bold hover:underline flex items-center gap-1"
              >
                Rezar este día con el modo guiado paso a paso →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════
          SECCIÓN 3: LOS 12 GOZOS COMPLETOS
      ══════════════════════════════════════════════ */}
      {activeSection === 'gozos' && (
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="glass-card rounded-3xl p-6 sm:p-8 border border-amber-400/30 shadow-2xl bg-black/40 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h3 className="text-xl font-bold font-cinzel text-white">
                  Los 12 Gozos Navideños Canónicos 🎶
                </h3>
                <p className="text-xs text-emerald-200/80 mt-0.5">
                  Versión íntegra tradicional · Cánticos con pandereta y maracas
                </p>
              </div>

              <button
                onClick={handleTambourine}
                className="px-3.5 py-2 rounded-xl bg-amber-400 text-pine-950 font-black text-xs shadow-md active:scale-95 flex items-center gap-1.5 cursor-pointer"
              >
                🪇 ¡Tocar!
              </button>
            </div>

            {/* Estribillo principal */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/20 via-amber-400/25 to-amber-500/20 border-2 border-amber-400/50 text-center space-y-1 shadow-lg">
              <span className="text-[10px] uppercase font-black text-amber-300 tracking-wider">
                ESTRIBILLO (Se canta después de cada una de las 12 estrofas)
              </span>
              <p className="text-base sm:text-lg font-bold font-cinzel text-white leading-relaxed">
                ¡Dulce Jesús mío, mi niño adorado...<br />
                ven a nuestras almas, ven no tardes tanto!
              </p>
            </div>

            {/* Filtro rápido de Estrofa (1 al 12) */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] uppercase tracking-wider font-bold text-amber-300/80 block">
                Seleccionar Estrofa de los Gozos:
              </span>
              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  type="button"
                  onClick={() => setGozoFilter('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                    gozoFilter === 'all'
                      ? 'bg-amber-400 text-pine-950 font-black border-amber-300 shadow-sm'
                      : 'bg-white/5 text-emerald-200/70 border-white/10 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  🌟 Todas (12)
                </button>
                {GOZOS_12_ESTROFAS.map(g => {
                  const isSel = gozoFilter === String(g.num);
                  return (
                    <button
                      key={g.num}
                      type="button"
                      onClick={() => {
                        setGozoFilter(isSel ? 'all' : String(g.num));
                        setExpandedGozoIndex(g.num);
                      }}
                      className={`px-2.5 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        isSel
                          ? 'bg-amber-400 text-pine-950 border-amber-300 shadow-sm font-black'
                          : 'bg-black/30 text-emerald-200/70 border-white/10 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      {g.num}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 12 Gozos accordion */}
            <div className="space-y-2">
              {GOZOS_12_ESTROFAS
                .filter(g => gozoFilter === 'all' || String(g.num) === gozoFilter)
                .map(gozo => (
                <div
                  key={gozo.num}
                  className={`rounded-2xl border transition-all overflow-hidden ${
                    expandedGozoIndex === gozo.num
                      ? 'border-amber-400/50 bg-black/60'
                      : 'border-white/10 bg-black/30 hover:border-amber-400/20'
                  }`}
                >
                  <button
                    onClick={() => setExpandedGozoIndex(expandedGozoIndex === gozo.num ? null : gozo.num)}
                    className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-xl bg-amber-500/20 text-amber-300 font-mono font-bold text-xs flex items-center justify-center flex-shrink-0">
                        {gozo.num}
                      </span>
                      <span className="text-xs font-bold text-white">{gozo.title}</span>
                    </div>
                    <ChevronRight className={`w-4 h-4 text-emerald-300/60 transition-transform ${expandedGozoIndex === gozo.num ? 'rotate-90' : ''}`} />
                  </button>

                  {(expandedGozoIndex === gozo.num || gozoFilter !== 'all') && (
                    <div className="px-4 pb-4">
                      <div className="bg-black/40 rounded-xl p-4 border border-white/5">
                        <pre className="text-sm text-emerald-100 font-serif leading-loose whitespace-pre-wrap italic">
                          {gozo.stanza}
                        </pre>
                      </div>
                      <p className="text-[11px] text-amber-300/80 font-bold italic mt-2 ml-1">
                        → (Todos a una voz): ¡Dulce Jesús mío, mi niño adorado, ven a nuestras almas, ven no tardes tanto! 🪇
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="p-3 rounded-2xl bg-emerald-950/40 border border-emerald-500/20 text-xs text-emerald-300 text-center">
              💡 Al terminar el Gozo 12, el Estribillo se canta dos veces con palmas y campanitas para celebrar con alegría.
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════
          SECCIÓN 4: ORACIONES CANÓNICAS COMPLETAS
      ══════════════════════════════════════════════ */}
      {activeSection === 'oraciones' && (
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="glass-card rounded-3xl p-6 sm:p-8 border border-amber-400/30 shadow-2xl bg-black/40 space-y-4">
            <div className="border-b border-white/10 pb-4">
              <h3 className="text-xl font-bold font-cinzel text-white">
                Todas las Oraciones de la Novena Canónica 🙏
              </h3>
              <p className="text-xs text-emerald-200/80 mt-0.5">
                Textos íntegros de devoción comunitaria para rezar en el pesebre
              </p>
            </div>

            {/* Filtro Temático de Oraciones (Píldoras en flex-wrap sin clipping) */}
            <div className="space-y-1.5 pb-2">
              <span className="text-[10px] uppercase tracking-wider font-bold text-emerald-300/80 block">
                Filtro rápido de oración:
              </span>
              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  type="button"
                  onClick={() => {
                    setPrayerFilter('all');
                    setExpandedPrayerId(null);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                    prayerFilter === 'all'
                      ? 'bg-amber-400/25 text-amber-300 border-amber-400/50 font-bold shadow-sm'
                      : 'bg-white/5 text-emerald-200/70 border-white/10 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  🌟 Todas ({CANONICAL_PRAYERS.length})
                </button>
                {CANONICAL_PRAYERS.map(p => {
                  const isSel = prayerFilter === p.id;
                  const shortName = p.title.replace('Oración ', '').replace('para ', '').replace('a la ', '').replace('a ', '').replace('al ', '');
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        setPrayerFilter(isSel ? 'all' : p.id);
                        setExpandedPrayerId(p.id);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                        isSel
                          ? 'bg-amber-400 text-pine-950 font-bold border-amber-300 shadow-md'
                          : 'bg-black/30 text-emerald-200/70 border-white/10 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      {shortName}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2.5">
              {CANONICAL_PRAYERS
                .filter(p => prayerFilter === 'all' || p.id === prayerFilter)
                .map(oracion => (
                <div
                  key={oracion.id}
                  className={`rounded-2xl border transition-all overflow-hidden ${
                    expandedPrayerId === oracion.id || prayerFilter !== 'all'
                      ? 'border-emerald-400/40 bg-black/60 shadow-lg'
                      : 'border-white/10 bg-black/30 hover:border-emerald-400/20'
                  }`}
                >
                  <button
                    onClick={() => setExpandedPrayerId(expandedPrayerId === oracion.id ? null : oracion.id)}
                    className="w-full flex items-center justify-between gap-3 px-4 py-3.5 text-left cursor-pointer"
                  >
                    <div>
                      <span className="text-sm font-bold text-white block">{oracion.title}</span>
                      <span className="text-[11px] text-emerald-300/70 italic">{oracion.subtitle}</span>
                    </div>
                    <ChevronRight className={`w-4 h-4 text-emerald-300/60 transition-transform flex-shrink-0 ${expandedPrayerId === oracion.id || prayerFilter !== 'all' ? 'rotate-90' : ''}`} />
                  </button>

                  {(expandedPrayerId === oracion.id || prayerFilter !== 'all') && (
                    <div className="px-4 pb-4 space-y-3">
                      <div className="bg-black/50 rounded-2xl p-5 border border-white/8 space-y-3">
                        {oracion.text.split('\n\n').map((par, pIdx) => (
                          <p key={pIdx} className="text-sm text-emerald-100/95 leading-relaxed font-serif">
                            {par}
                          </p>
                        ))}
                      </div>

                      {oracion.traditionalResponse && (
                        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-400/20 text-xs text-amber-200 italic">
                          <span className="font-bold not-italic font-sans text-amber-300 block mb-0.5">Respuesta tradicional:</span>
                          {oracion.traditionalResponse}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════
          SECCIÓN 5: VILLANCICOS TRADICIONALES
      ══════════════════════════════════════════════ */}
      {activeSection === 'villancicos' && (
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="glass-card rounded-3xl p-6 sm:p-8 border border-amber-400/30 shadow-2xl bg-black/40 space-y-4">
            <div className="border-b border-white/10 pb-4">
              <h3 className="text-xl font-bold font-cinzel text-white">
                Cancionero de Villancicos Tradicionales 🎶
              </h3>
              <p className="text-xs text-emerald-200/80 mt-0.5">
                Letras completas de los cantos de aguinaldo para cantar en familia
              </p>
            </div>

            {/* Búsqueda y Filtros de Villancicos (Sin clipping ni desborde) */}
            <div className="space-y-3">
              <SearchInput
                value={carolSearch}
                onChange={setCarolSearch}
                placeholder="Buscar villancico por título o letra…"
              />

              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  type="button"
                  onClick={() => {
                    setCarolFilter('all');
                    setExpandedCarolIndex(null);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                    carolFilter === 'all'
                      ? 'bg-rose-500/25 text-rose-300 border-rose-400/50 font-bold shadow-sm'
                      : 'bg-white/5 text-emerald-200/70 border-white/10 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  🎵 Todos ({COLOMBIAN_CAROLS.length})
                </button>
                {COLOMBIAN_CAROLS.map((c, idx) => {
                  const isSel = carolFilter === c.title;
                  return (
                    <button
                      key={c.title}
                      type="button"
                      onClick={() => {
                        setCarolFilter(isSel ? 'all' : c.title);
                        setExpandedCarolIndex(idx);
                      }}
                      className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                        isSel
                          ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-pine-950 font-black border-amber-300 shadow-md'
                          : 'bg-black/30 text-emerald-200/70 border-white/10 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      {c.title}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2.5">
              {COLOMBIAN_CAROLS
                .filter(c => {
                  if (carolFilter !== 'all' && c.title !== carolFilter) return false;
                  if (carolSearch) {
                    const q = carolSearch.toLowerCase();
                    const matchTitle = c.title.toLowerCase().includes(q);
                    const matchVerses = c.verses.some(v => v.toLowerCase().includes(q));
                    return matchTitle || matchVerses;
                  }
                  return true;
                })
                .map((carol, cIdx) => (
                <div
                  key={carol.title}
                  className={`rounded-2xl border transition-all overflow-hidden ${
                    expandedCarolIndex === cIdx || carolFilter !== 'all' || carolSearch !== ''
                      ? 'border-rose-400/40 bg-black/60 shadow-lg'
                      : 'border-white/10 bg-black/30 hover:border-rose-400/20'
                  }`}
                >
                  <button
                    onClick={() => setExpandedCarolIndex(expandedCarolIndex === cIdx ? null : cIdx)}
                    className="w-full flex items-center justify-between gap-3 px-4 py-3.5 text-left cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🎵</span>
                      <div>
                        <span className="text-sm font-bold text-white block">{carol.title}</span>
                        <span className="text-[11px] text-emerald-300/70">{carol.notes}</span>
                      </div>
                    </div>
                    <ChevronRight className={`w-4 h-4 text-emerald-300/60 transition-transform flex-shrink-0 ${expandedCarolIndex === cIdx || carolFilter !== 'all' || carolSearch !== '' ? 'rotate-90' : ''}`} />
                  </button>

                  {(expandedCarolIndex === cIdx || carolFilter !== 'all' || carolSearch !== '') && (
                    <div className="px-4 pb-4 space-y-2.5">
                      {carol.verses.map((verse, vIdx) => (
                        <div key={vIdx} className="bg-black/40 rounded-xl p-3.5 border border-white/5">
                          <pre className="text-xs sm:text-sm text-emerald-100 font-serif leading-relaxed whitespace-pre-wrap italic">
                            {verse}
                          </pre>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="p-3.5 rounded-2xl bg-berry-950/40 border border-rose-500/20 text-xs text-rose-200 text-center">
              🇨🇴 ¡Los villancicos colombianos unen las generaciones y llenan de gozo el hogar!
            </div>
          </div>
        </div>
      )}

      {/* ── FOOTER TRADICIONAL ── */}
      <div className="max-w-3xl mx-auto text-center space-y-1 py-4 opacity-70">
        <p className="text-xs text-emerald-300 italic font-serif">
          "¡Gloria a Dios en las alturas, y en la tierra paz a los hombres de buena voluntad!" — Lucas 2,14
        </p>
        <p className="text-[11px] text-amber-300">
          🇨🇴 Novena de Aguinaldos Colombiana · Tradición del 16 al 24 de Diciembre · NATIVIDAD 2026
        </p>
      </div>

    </div>
  );
};
