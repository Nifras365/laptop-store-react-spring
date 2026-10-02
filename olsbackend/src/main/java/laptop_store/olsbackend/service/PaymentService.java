package laptop_store.olsbackend.service;

import laptop_store.olsbackend.dto.PaymentConfirmDTO;
import laptop_store.olsbackend.dto.PaymentIntentDTO;
import laptop_store.olsbackend.dto.PaymentResponseDTO;

public interface PaymentService {
    PaymentResponseDTO createPaymentIntent(PaymentIntentDTO paymentIntentDTO);
    void confirmPayment(PaymentConfirmDTO paymentConfirmDTO);
}
