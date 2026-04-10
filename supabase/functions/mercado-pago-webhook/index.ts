// Edge Function: Mercado Pago Webhook
// Recibe notificaciones de pago de Mercado Pago
// y actualiza el estado del pedido en la base de datos.

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

serve(async (req) => {
  try {
    const body = await req.json();

    if (body.type !== 'payment') {
      return new Response('OK', { status: 200 });
    }

    const paymentId = body.data?.id;
    const accessToken = Deno.env.get('MERCADO_PAGO_ACCESS_TOKEN')!;

    const paymentResponse = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const payment = await paymentResponse.json();

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const orderId = payment.external_reference;
    const paymentStatus = payment.status === 'approved' ? 'pagado' : payment.status === 'rejected' ? 'fallido' : 'pendiente';

    await supabase.from('payments').insert({
      order_id: orderId,
      mercado_pago_id: paymentId.toString(),
      amount: payment.transaction_amount,
      status: paymentStatus,
      method: 'mercado_pago',
      webhook_data: payment,
    });

    if (paymentStatus === 'pagado') {
      await supabase
        .from('orders')
        .update({ payment_status: 'pagado', status: 'confirmado' })
        .eq('id', orderId);
    }

    return new Response('OK', { status: 200 });
  } catch (error) {
    console.error('Webhook error:', error);
    return new Response('Error', { status: 500 });
  }
});
