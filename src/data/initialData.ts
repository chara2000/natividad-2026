import {
  UserProfile,
  Community,
  Activity,
  ExpenseItem,
  UserContribution,
  PaymentReceipt,
  SecretSantaSession,
  Poll,
  AdventDay,
  MemoryPhoto,
  SantaAIMessage,
} from '../types';

export const initialCurrentUser: UserProfile | null = null;

export const initialMembers: UserProfile[] = [];

export const initialCommunity: Community = {
  id: 'comm-navidad-2026',
  name: 'Nuestra Navidad 2026',
  slogan: 'Unidos en amor, buñuelos, natilla y tradición',
  year: 2026,
  totalBudgetGoal: 1000000,
  quotaPerPerson: 150000,
  currency: 'COP',
  coverGradient: 'from-emerald-900 via-green-950 to-rose-950',
  inviteCode: 'NAVIDAD-2026',
  masterPin: '2026',
  paymentDetails: {
    nequiNumber: '310 123 4567',
    daviplataNumber: '310 123 4567',
    accountHolder: 'Tesorero Familiar',
  },
};

export const initialActivities: Activity[] = [];

export const initialExpenses: ExpenseItem[] = [];

export const initialContributions: UserContribution[] = [];

export const initialReceipts: PaymentReceipt[] = [];

export const initialSecretSanta: SecretSantaSession = {
  id: 'santa-navidad-2026',
  communityId: 'comm-navidad-2026',
  title: 'Amigo Secreto Navideño 2026 🎁',
  budgetMin: 30000,
  budgetMax: 60000,
  currency: 'COP',
  drawDate: '2026-12-01',
  deliveryDate: '2026-12-24',
  status: 'draft',
  participants: [],
  exclusions: {},
  assignments: [],
  wishlists: {},
};

export const initialPolls: Poll[] = [];

export const initialAdventDays: AdventDay[] = [
  { dayNumber: 1, title: 'El Espíritu de la Corona de Adviento', surprise: 'Enciende una luz en tu corazón y regala un cumplido sincero hoy.', carolOrQuote: '“Mi burrito sabanero va camino de Belén...”', mission: 'Llama o escríbele a un familiar con quien hace tiempo no hablas.', unlocked: true },
  { dayNumber: 2, title: 'Aroma a Canela y Clavos', surprise: 'La receta del mejor chocolate caliente lleva clavo y canela.', carolOrQuote: '“Campana sobre campana, y sobre campana una...”', mission: 'Tómate una bebida caliente pensando en lo que más agradeces este año.', unlocked: true },
  { dayNumber: 3, title: 'El Corazón de San José', surprise: 'La serenidad y el trabajo silencioso son virtudes maravillosas.', carolOrQuote: '“Los pastores a Belén corren presurosos...”', mission: 'Ayuda a un amigo o vecino con un favor sin que te lo pida.', unlocked: true },
  { dayNumber: 4, title: 'Farolitos de Esperanza', surprise: 'Las luces en la ventana alejan la tristeza.', carolOrQuote: '“Noche de paz, noche de amor, todo duerme en derredor...”', mission: 'Coloca una luz o adorno en tu puerta o ventana.', unlocked: false },
  { dayNumber: 5, title: 'Gozos y Panderetas', surprise: '¡El sonido de la alegría navideña despierta sonrisas!', carolOrQuote: '“¡Dulce Jesús mío, mi niño adorado... ven a nuestras almas!”', mission: 'Escucha una tanda de villancicos a todo volumen.', unlocked: false },
  { dayNumber: 6, title: 'Recuerdos de la Infancia', surprise: '¿Recuerdas tu primer juguete favorito de Navidad?', carolOrQuote: '“Hacia el portal de Belén se dirige un pastorcito...”', mission: 'Busca una foto navideña de cuando eras niño y compártela en el grupo.', unlocked: false },
  { dayNumber: 7, title: 'Noche de las Velitas', surprise: '¡Fuego bendito y deseos de paz para el hogar!', carolOrQuote: '“Antón tiruriruriru, Antón tirurirurá...”', mission: 'Enciende tus velitas con toda la familia reunida.', unlocked: false },
  { dayNumber: 8, title: 'Generosidad Oculta', surprise: 'Dar en secreto enriquece el alma el doble.', carolOrQuote: '“Tutaina tuturuma, tutaina tuturumaina...”', mission: 'Deja una propina especial o ayuda a quien trabaja en la calle.', unlocked: false },
  { dayNumber: 9, title: 'El Pesebre Colombiano', surprise: 'El buey, la mulita, las ovejas de lana y el musgo artificial.', carolOrQuote: '“Zagalillos del valle venid, a Belén a cantar y danzar...”', mission: 'Revisa que ninguna figurita del pesebre se haya caído.', unlocked: false },
  { dayNumber: 10, title: 'Día de Buñuelos Dorados', surprise: 'El secreto del buñuelo es que gire solito en el aceite.', carolOrQuote: '“Yo soy un pastorcillo que va buscando al Niño...”', mission: 'Prueba un buñuelo crujiente y caliente.', unlocked: false },
  { dayNumber: 11, title: 'Natilla de la Abuela', surprise: 'Mecer la natilla con cuchara de palo es arte mayor.', carolOrQuote: '“Ven, ven, ven a nuestras almas, Jesús ven, ven a nuestras almas...”', mission: 'Aprende o repasa la receta tradicional familiar.', unlocked: false },
  { dayNumber: 12, title: 'Paz y Reconciliación', surprise: 'El perdón es el regalo más valioso de la Navidad.', carolOrQuote: '“Gloria a Dios en las alturas y en la tierra paz...”', mission: 'Perdona de corazón cualquier malentendido pasado.', unlocked: false },
  { dayNumber: 13, title: 'Música de Fin de Año', surprise: 'Pastor López, Rodolfo Aicardi y Los Hispanos encienden la fiesta.', carolOrQuote: '“Traigo una cartica que me mandó mi mamá...”', mission: 'Baila una cumbia o porro navideño en la sala.', unlocked: false },
  { dayNumber: 14, title: 'Árbol Iluminado', surprise: 'Cada esfera representa un momento vivido en el año.', carolOrQuote: '“Arbolito de Navidad que siempre floreces los 24...”', mission: 'Dedica un pensamiento bonito a quienes están lejos.', unlocked: false },
  { dayNumber: 15, title: 'Aguinaldos Clásicos', surprise: '¡Al sí y al no! ¡Dar y no recibir! ¡Estatua!', carolOrQuote: '“Vamos pastores, vamos, vamos a Belén...”', mission: 'Juega una ronda de aguinaldos con alguien hoy.', unlocked: false },
  { dayNumber: 16, title: 'Día 1 de la Novena', surprise: '“Benignísimo Dios de infinita caridad...”', carolOrQuote: '“Ven a nuestras almas, ven no tardes tanto...”', mission: 'Reza el primer día con fe y alegría.', unlocked: false },
  { dayNumber: 17, title: 'Día 2 de la Novena', surprise: 'La humildad de la cuna en Belén.', carolOrQuote: '“¡Oh Sapiencia suma del Dios soberano!”', mission: 'Comparte un refrigerio con quien más lo necesite.', unlocked: false },
  { dayNumber: 18, title: 'Día 3 de la Novena', surprise: 'Cálido abrazo de unión familiar.', carolOrQuote: '“¡Oh raíz sagrada de Jesé que enhiesto...”', mission: 'Da un abrazo de más de 10 segundos a alguien de tu casa.', unlocked: false },
  { dayNumber: 19, title: 'Día 4 de la Novena', surprise: 'La estrella guía a los reyes magos.', carolOrQuote: '“¡Llave de David que abre al desterrado!”', mission: 'Sé la guía y el apoyo de alguien hoy.', unlocked: false },
  { dayNumber: 20, title: 'Día 5 de la Novena', surprise: 'Alegría contagiosa en todos los rincones.', carolOrQuote: '“¡Oh sol naciente que de luz eterno...”', mission: 'Sonríele a un desconocido en la calle.', unlocked: false },
  { dayNumber: 21, title: 'Día 6 de la Novena', surprise: 'Noche de solidaridad y entrega de regalos.', carolOrQuote: '“¡Rey de las naciones y su deseado!”', mission: 'Lleva un juguete o prenda a un niño vulnerable.', unlocked: false },
  { dayNumber: 22, title: 'Día 7 de la Novena', surprise: 'Preparativos para la gran noche.', carolOrQuote: '“¡Oh lumbre de oriente, sol de eternos rayos!”', mission: 'Ayuda a planear y limpiar el lugar de la cena.', unlocked: false },
  { dayNumber: 23, title: 'Día 8 de la Novena', surprise: '¡Mañana es Nochebuena!', carolOrQuote: '“¡Ven que ya María previene sus brazos!”', mission: 'Ten listos tus regalos empacados con amor.', unlocked: false },
  { dayNumber: 24, title: '¡Nochebuena & Natividad!', surprise: '¡Ha nacido la Luz del Mundo! Feliz Navidad para toda la familia.', carolOrQuote: '“¡Noche de Paz, Noche de Amor!”', mission: 'Brinda, abraza a los tuyos y agradece por la vida.', unlocked: false },
];

export const initialMemories: MemoryPhoto[] = [];

export const initialSantaMessages: SantaAIMessage[] = [
  {
    id: 'msg-1',
    sender: 'santa',
    text: '¡Ho, ho, ho! 🎅✨ ¡Bienvenidos a Natividad 2026! Soy Santa IA, impulsado por Luna 5.6.\n\nPuedo ayudarte a:\n• Calcular presupuestos y cuotas por persona.\n• Planear el menú de Nochebuena o la lista de compras.\n• Redactar invitaciones para enviar a WhatsApp.\n• Diseñar el itinerario de las 9 novenas y juegos navideños.\n\n¿En qué te puedo colaborar hoy para que esta Navidad sea inolvidable?',
    timestamp: '12:00 PM',
  },
];
