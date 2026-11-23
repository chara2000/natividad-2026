import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { prompt, communityName, financialStats, secretSanta, activities } = body;

    const apiKey = process.env.OPENAI_API_KEY;
    const model = process.env.AI_MODEL || 'luna-5.6';
    const baseUrl = process.env.AI_API_BASE_URL || 'https://api.openai.com/v1';

    // System prompt giving Santa IA rich context of the Colombian/Latin Christmas traditions
    const systemPrompt = `Eres Santa IA (Impulsado por el modelo GPT Luna 5.6), el asistente oficial navideño inteligente de la comunidad "${communityName || 'Navidad en Comunidad'}".
Tu rol es ayudar a organizar novenas de aguinaldos, cenas de Nochebuena, el juego de amigo secreto, menús de comida tradicional (buñuelos, natilla, pavo, lechona, pernil), cálculo de presupuestos y cuotas por persona, itinerarios por horas y mensajes para WhatsApp.

DATOS EN VIVO DEL GRUPO:
- Meta de presupuesto: $${financialStats?.totalBudgetGoal || 2000000} COP
- Total recaudado: $${financialStats?.totalCollected || 1450000} COP (${financialStats?.progressPercentage || 72.5}%)
- Saldo faltante: $${financialStats?.remainingToCollect || 550000} COP
- Total de participantes: ${financialStats?.totalContributors || 10}
- Personas con aportes pendientes: ${financialStats?.pendingContributorsCount || 4}
- Amigo secreto: Presupuesto entre $${secretSanta?.budgetMin || 50000} y $${secretSanta?.budgetMax || 80000} COP.

Responde siempre en español, con un tono alegre, cálido, festivo (usando emojis navideños como 🎅, 🎄, 🎁, 🕯️), respuestas concisas, números claros y sugerencias prácticas.`;

    // 1. If an API key is configured, call the LLM endpoint with model Luna 5.6
    if (apiKey && apiKey !== 'tu-api-key-de-openai-o-proveedor-compatible') {
      try {
        const response = await fetch(`${baseUrl}/chat/completions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: model, // "luna-5.6"
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: prompt },
            ],
            temperature: 0.7,
            max_tokens: 800,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const reply = data.choices?.[0]?.message?.content;
          if (reply) {
            return NextResponse.json({
              reply,
              model: model,
              source: 'api',
            });
          }
        }
      } catch (apiErr) {
        console.warn('API call error, falling back to local reasoning:', apiErr);
      }
    }

    // 2. Intelligent Christmas Local Engine (Model: Luna 5.6 reasoning emulator)
    const lower = (prompt || '').toLowerCase();
    let replyText = '';

    if (lower.includes('dinero') || lower.includes('falta') || lower.includes('presupuesto') || lower.includes('finanzas')) {
      replyText = `📊 **Balance Financiero Navideño en Vivo (Luna 5.6):**\n\n• **Meta presupuestada:** $${(financialStats?.totalBudgetGoal || 2000000).toLocaleString('es-CO')} COP\n• **Recaudado hasta hoy:** $${(financialStats?.totalCollected || 1450000).toLocaleString('es-CO')} COP (${financialStats?.progressPercentage || 72.5}%)\n• **Falta por recaudar:** $${(financialStats?.remainingToCollect || 550000).toLocaleString('es-CO')} COP\n• **Participantes al día:** ${(financialStats?.paidContributorsCount || 6)} de ${(financialStats?.totalContributors || 10)} personas.\n\n💡 *Consejo de Santa:* Hay ${financialStats?.pendingContributorsCount || 4} familiares con saldo pendiente. Recuerda que pueden abonar por Nequi o Daviplata en el módulo de Finanzas.`;
    } else if (lower.includes('cena') || lower.includes('menú') || lower.includes('25 personas') || lower.includes('comida')) {
      replyText = `🍗 **Propuesta de Menú de Nochebuena para 25 Personas (GPT Luna 5.6):**\n\n1. **Platos Fuertes:** Pavo horneado con relleno de frutos secos y manzanas + Pernil de cerdo en salsa agridulce de ciruelas.\n2. **Acompañamientos:** Arroz navideño con tocineta y uvas pasas, ensalada rusa (papa, zanahoria, manzana verde y crema) y puré de camote o papa criolla.\n3. **Mecato Típico Colombiano:** 50 buñuelos recién fritos y dos bandejas grandes de natilla de arequipe con dulce de mora casero.\n4. **Bebidas:** 4 botellas de vino tinto, 3 botellas de champaña espumosa para el brindis de medianoche y gaseosas/jugos naturales.\n\n💰 **Cálculo estimado:** $950.000 COP ($38.000 COP por persona).`;
    } else if (lower.includes('amigo secreto') || lower.includes('sorteo') || lower.includes('regalo')) {
      replyText = `🎁 **Estado del Amigo Secreto (Luna 5.6):**\n\n• **Presupuesto oficial:** $${(secretSanta?.budgetMin || 50000).toLocaleString('es-CO')} a $${(secretSanta?.budgetMax || 80000).toLocaleString('es-CO')} COP.\n• **Fecha de entrega:** 24 de diciembre a las 9:30 PM.\n• **Participantes:** 8 personas registradas con exclusiones de parejas activas.\n\n🤫 Ya puedes entrar a la pestaña **Amigo Secreto** y raspar tu tarjeta mágica para ver en secreto a quién le regalas y qué tallas o gustos tiene.`;
    } else if (lower.includes('whatsapp') || lower.includes('mensaje') || lower.includes('invitacion')) {
      replyText = `📲 **Mensaje festivo generado por Luna 5.6 listo para copiar a WhatsApp:**\n\n"🎄✨ *¡Gran Navidad Familia García 2026!* ✨🎄\n\nQuerida familia, ya está activa nuestra plataforma oficial.\n📅 *Próxima cita:* Cena de Nochebuena - 24 Dic 6:00 PM en Casa de la Abuela Carmen.\n💰 *Aporte por persona:* $200.000 COP (¡Llevamos el 72.5% recaudado!)\n🎁 *Amigo secreto:* Ya pueden consultar sus asignaciones secretas y registrar su lista de deseos.\n\n👉 Entra ya a la plataforma con el código de invitación.\n¡Los esperamos a todos con el corazón lleno de amor y alegría navideña!"`;
    } else if (lower.includes('novena') || lower.includes('juegos') || lower.includes('itinerario')) {
      replyText = `🎉 **Dinámicas sugeridas por Luna 5.6:**\n\n1. **Los Gozos con Pandereta:** Usa el botón interactivo de pandereta en la pestaña Novenas para acompañar los villancicos.\n2. **Ruleta de Penitencias:** Cada miembro que llegue tarde o pierda en aguinaldos gira la ruleta de retos.\n3. **Trivia Familiar:** Haz el quiz de 5 preguntas sobre tradiciones navideñas después del chocolate caliente.`;
    } else {
      replyText = `🎅✨ ¡Hola! Como asistente GPT Luna 5.6 estoy listo para ayudarte:\n\n• Puedo calcular presupuestos y aportes individuales.\n• Diseñar el menú para cualquier número de invitados.\n• Redactar recordatorios de pago corteses para WhatsApp.\n• Sugerir el orden del itinerario para las novenas o la cena del 24.\n\n¿Qué necesitas planear hoy para la familia?`;
    }

    return NextResponse.json({
      reply: replyText,
      model: 'luna-5.6',
      source: 'emulator',
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Error procesando solicitud de Santa IA', details: error.message },
      { status: 500 }
    );
  }
}
