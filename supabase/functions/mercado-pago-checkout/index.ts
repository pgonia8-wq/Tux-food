// Edge Function: Mercado Pago Checkout
// Deploy en: Supabase Dashboard > Edge Functions
//
// Esta función crea una preferencia de pago en Mercado Pago
// y retorna la URL de checkout.
//
// Requiere las variables de entorno:
// - MERCADO_PAGO_ACCESS_TOKEN

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { order_id, items, total, payer_email } = await req.json();

    const accessToken = Deno.env.get('MERCADO_PAGO_ACCESS_TOKEN');
    if (!accessToken) {
      throw new Error('MERCADO_PAGO_ACCESS_TOKEN no configurado');
    }

    const preference = {
      items: items.map((item: any) => ({
        title: item.name,
        quantity: item.quantity,
        unit_price: item.price,
        currency_id: 'MXN',
      })),
      payer: { email: payer_email },
      external_reference: order_id,
      back_urls: {
        success: `${Deno.env.get('APP_URL') || 'https://tuxfood.app'}/payment/success`,
        failure: `${Deno.env.get('APP_URL') || 'https://tuxfood.app'}/payment/failure`,
        pending: `${Deno.env.get('APP_URL') || 'https://tuxfood.app'}/payment/pending`,
      },
      auto_return: 'approved',
      notification_url: `${Deno.env.get('SUPABASE_URL')}/functions/v1/mercado-pago-webhook`,
    };

    const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(preference),
    });

    const data = await response.json();

    return new Response(JSON.stringify({ checkout_url: data.init_point, preference_id: data.id }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
